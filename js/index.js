// 存储各个todo分组列表
// localStorage中todoLists存储分组列表
// @Param
// 		name: 列表名称
//		num: 列表所含待办事项数量
var todoLists = JSON.parse(localStorage.getItem("todoLists")) || [];
var todoItems = JSON.parse(localStorage.getItem("todoItems")) || [];

// 原生js实现document.ready
(function () {
    var ie = !!(window.attachEvent && !window.opera);
    var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
    var fn = [];
    var run = function () { for (var i = 0; i < fn.length; i++) fn[i](); };
    var d = document;
    d.ready = function (f) {
       if (!ie && !wk && d.addEventListener)
       return d.addEventListener('DOMContentLoaded', f, false);
       if (fn.push(f) > 1) return;
       if (ie)
          (function () {
             try { d.documentElement.doScroll('left'); run(); }
             catch (err) { setTimeout(arguments.callee, 0); }
          })();
       else if (wk)
       var t = setInterval(function () {
          if (/^(loaded|complete)$/.test(d.readyState))
          clearInterval(t), run();
       }, 0);
    };
 })();

document.ready(function() {
	// 根据localStorage生成列表
	renderLists();
	
	// var screenHeight = window.innerHeight;
	// var selfList = document.getElementById("self-list");
	// var upperHeight = document.getElementById("special-list").offsetHeight + 
	// 	document.getElementById("title").offsetHeight;
	// console.log(screenHeight);
	// console.log(upperHeight);
	// selfList.style.height = (screenHeight - upperHeight) + "px";
	
	// 按钮添加列表事件
	document.querySelector('#add-btn')
		.addEventListener('click', addList);
	
	document.querySelector('#del-all-icon')
		.addEventListener('click', deleteFinish);
})

// 每次列表有更新时，重新生成列表
function renderLists() {
	const listsView = document.querySelector('#self-list');
	listsView.innerHTML = todoLists.map(obj => listGenerator(obj)).join('');
	
	var sizes = document.getElementsByClassName("list-size");
	console.log(sizes);
	for (i = 0; i < sizes.length; i++) {
		if (sizes[i].innerText == "0") {
			sizes[i].style.display = "none";
		}
	}
	
	// Important列表
	var impList = document.getElementById("Important");
	var impNum = impList.getElementsByClassName("list-size");
	var impFilter = todoItems.filter(item => item.important == true && item.finish == false);
	console.log(impFilter);
	impNum[0].innerHTML = impFilter.length;
	if (impFilter.length == 0) {
		impNum[0].style.display = "none";
	}
	
	addListenerToList();
}

function addListenerToList() {
	// 每个list添加跳转页面事件
	var lists = document.getElementsByClassName("list");
	for (i = 0; i < lists.length; i++) {
	    let listName = lists[i].id;
		let listid = lists[i].getAttribute("uni-id");
	    console.log(listName);
	    lists[i].onclick = function() {
	        window.location.href = "list.html?listname="+listName
				+"&listid="+listid;
	    }
	}
	
	// list中的删除按钮
	var del = document.querySelectorAll(".del");
	del.forEach(d => d.addEventListener('click', deleteList));
}

function getUniqueId() {
	return (Date.now && Date.now()) || new Date().getTime();
}

// 添加分组列表
function addList() {
	let inputList = document.getElementById("add-list").value;
	if (inputList == "") {
		return;
	}
	
	let listObj = {
		id: getUniqueId(),
		name: inputList,
		num: 0,
	};
	
	todoLists.push(listObj);
	document.getElementById("add-list").value = "";
	localStorage.setItem("todoLists", JSON.stringify(todoLists));
	renderLists();
}

// 删除分组列表
function deleteList(e) {
	e.stopPropagation();
	let parNode = e.currentTarget.parentNode;
	if (!confirm("Are you sure to delete \"" + parNode.getAttribute('id') + "\"?")) {
		return;
	}
	
	let listId = parNode.getAttribute("uni-id");
	let targetList = todoLists.find(list => list.id == listId);
	let index = todoLists.indexOf(targetList);
	todoLists.splice(index, 1);
	localStorage.setItem("todoLists", JSON.stringify(todoLists));
	
	todoItems = todoItems.filter(function (item) {
		return !(item.listid == listId);
	})
	localStorage.setItem("todoItems", JSON.stringify(todoItems));
	renderLists();
}

// 删除所有已完成todo事项
function deleteFinish() {
	if (!confirm("Are you sure to delete all completed tasks?")) {
		return;
	}

	todoItems = todoItems.filter(function (item) {
		return item.finish == false;
	})
	localStorage.setItem("todoItems", JSON.stringify(todoItems));
	renderLists();
}

function listGenerator(obj) {
	return `
	<div id="${obj.name}" class="list" uni-id="${obj.id}">
		<img src="img/list-icon.png" class="icon">
		<div class="list-name">
			${obj.name}
		</div>
		<div class="del">
			<img src="img/delete.png" class="del-icon">
		</div>
		<div class="list-size">
			${obj.num}
		</div>
	</div>
	`;
}




// 下拉框的长度要设置成屏幕长度的某个比例