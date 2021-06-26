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
 

var todoLists = JSON.parse(localStorage.getItem("todoLists")) || [];
// 每一项todo事项存储
var todoItems = JSON.parse(localStorage.getItem("todoItems")) || [];


function getParams(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};

document.ready(function() {
    let title = document.querySelector("h1");
    console.log(title);
	
	var listName = getParams("listname");
	if (listName != "Important" && listName != "Finished") {
		listName = todoLists.find(list => list.id == getParams("listid")).name;		
	}
    title.innerHTML = listName;
    title.style = "display=block;";
	
	document.querySelector("#data-sel").valueAsDate = new Date();
	
	// 返回初始界面
	var ret = document.getElementById("ret-icon");
	ret.onclick = function() {
		window.location.href = "index.html";
	}
	
	renderList();
	
	// 添加item按钮
	document.querySelector('#add-btn')
		.addEventListener('click', addItem);
	
	document.querySelector('#add-item')
		.addEventListener('keyup', function(event) {
			event.preventDefault();
			if (event.keyCode === 13) {
				document.getElementById('add-btn').click();
			}
		})
		
	document.querySelector('#show-btn')
		.addEventListener('click', changeShowComplete);
	
	document.querySelector('#com-all-btn')
		.addEventListener('click', completeAll);
		
	// 删除已完成
	document.querySelector('#del-all-icon')
		.addEventListener('click', deleteFinish);
})

// 展示/不展示已完成todo事项
function changeShowComplete(e) {
	var btn = e.currentTarget;
	if (btn.getAttribute('class') == "show-com") {
		btn.setAttribute('class', 'not-show-com');
	} else {
		btn.setAttribute('class', 'show-com');
	}
	renderList();
}

// 完成所有todo事项
function completeAll() {
	let listid = getParams("listid");
	var notfinish;
	if (listid == 2) {
		notfinish = todoItems.filter(item => item.finish === false);
	} else {
		notfinish = todoItems.filter(item => item.listid == listid && item.finish === false);
	}
	
	for (i = 0; i < notfinish.length; i++) {
		notfinish[i].finish = true;
	}
	
	listName = todoLists.find(list => list.id == finish.listid);
	listName.num = 0;
	localStorage.setItem("todoLists", JSON.stringify(todoLists));
	renderList();
}


// 初始化每项事项的图标按钮事件
function addListener() {
	var finishDiv = document.querySelectorAll('.fin-div');
	finishDiv.forEach(d => d.addEventListener('click', itemStatusChange))
	
	var nameDiv = document.querySelectorAll('.item-name');
	// nameDiv.forEach(d => d.addEventListener('click', itemStatusChange));
	nameDiv.forEach(d => d.addEventListener('click', editItem));
	
	var delDiv = document.querySelectorAll('.del-div');
	delDiv.forEach(d => d.addEventListener('click', deleteItem));
	
	var starDiv = document.querySelectorAll('.star-div');
	starDiv.forEach(d => d.addEventListener('click', addImportant));
	
	var inputBox = document.querySelectorAll('.edit-item');
	for (i = 0; i < inputBox.length; i++) {
		inputBox[i].onblur = function(e) {
			
			let parNode = e.currentTarget.parentNode;
			let input = parNode.getElementsByClassName("edit-item");
			let nameDiv = parNode.getElementsByClassName("item-name");
			input[0].style.display = "none";
			nameDiv[0].style.display = "inline-block";
			nameDiv[0].innerHTML = input[0].value;
			
			let itemid = parNode.getAttribute("id");
			let item = todoItems.find(item => item.id == itemid);
			item.name = input[0].value;
			localStorage.setItem("todoItems", JSON.stringify(todoItems));
			renderList();
		}
	}
}

// 改变todo事项状态
function itemStatusChange(e) {
	e.stopPropagation();
	let parNode = e.currentTarget.parentNode;
		
	let itemid = parNode.getAttribute("id");
	let itemname = parNode.getAttribute("name");
	console.log(itemname);
	let finish = todoItems.find(item => item.id == itemid);
	//console.log(finish);
		
		
	listName = todoLists.find(list => list.id == finish.listid);
		
	if (finish.finish == true) {
		finish.finish = false;
		
		// 事项所在列表的未完成数加一
		listName.num++;
	} else {
		finish.finish = true;
		
		// 事项所在列表的未完成数减一
		listName.num--;
	}
	localStorage.setItem("todoLists", JSON.stringify(todoLists));
	localStorage.setItem("todoItems", JSON.stringify(todoItems));
	renderList();
}

// 删除todo事项
function deleteItem(e) {
	e.stopPropagation();
	let parNode = e.currentTarget.parentNode;
	if (!confirm("Are you sure to delete \"" + parNode.getAttribute('name') + "\"?")) {
		return;
	}
	
	let itemid = parNode.getAttribute("id");
	let item = todoItems.find(item => item.id == itemid);
	let index = todoItems.indexOf(item);
	todoItems.splice(index, 1);
	localStorage.setItem("todoItems", JSON.stringify(todoItems));
	
	if (item.finish == false) {
		// 事项所在列表的未完成数减一
		listName = todoLists.find(list => list.id == item.listid);
		listName.num--;
		localStorage.setItem("todoLists", JSON.stringify(todoLists));
	}
	renderList();
}

// 添加todo事项
function addItem() {
	let item = document.getElementById("add-item").value;
	if (item == "") {
		return;
	}
	
	let time = document.getElementById("data-sel").value;
	let listid = getParams("listid");
	let listName = todoLists.find(list => list.id == listid).name;
	
	let itemObj = {
		id: getUniqueId(),
		name: item,
		listid: listid,
		listname: listName,
		endtime: time,
		finish: false,
		important: false
	};
	
	todoItems.push(itemObj);
	document.getElementById("add-item").value = "";
	localStorage.setItem("todoItems", JSON.stringify(todoItems));
	
	listName = todoLists.find(list => list.id == listid);
	listName.num++;
	localStorage.setItem("todoLists", JSON.stringify(todoLists));
	
	renderList();
}

// 编辑todo事项
function editItem(e) {
	e.stopPropagation();
	
	let parNode = e.currentTarget.parentNode;
	let input = parNode.getElementsByClassName("edit-item");
	let nameDiv = parNode.getElementsByClassName("item-name");
	input[0].style.display = "inline-block";
	nameDiv[0].style.display = "none";
	input[0].value = nameDiv[0].innerText.replace(/^\s+|\s+$/g, '');
}


// 删除所有已完成的事项
function deleteFinish() {
	if (!confirm("Are you sure to delete all completed tasks in \""
		+ getParams("listname") + " \"?")) {
		return;
	}
	
	var listid = getParams("listid");
	console.log("asdasdas");
	todoItems = todoItems.filter(function (item) {
		return item.finish == false || !item.listid == listid;
	})
	localStorage.setItem("todoItems", JSON.stringify(todoItems));
	renderList();
}

function getUniqueId() {
	return (Date.now && Date.now()) || new Date().getTime();
}

// 添加到重要列表
function addImportant(e) {
	e.stopPropagation();
	let parNode = e.currentTarget.parentNode;
	
	let itemid = parNode.getAttribute("id");
	let item = todoItems.find(item => item.id == itemid);
	if (item.important == true) {
		item.important = false;
	} else {
		item.important = true;
	}
	localStorage.setItem("todoItems", JSON.stringify(todoItems));
	renderList();
}


// 绘制列表
function renderList() {
	if (!renderSpecialList()) {
		const itemView = document.querySelector('.items');
		var listid = getParams("listid");
		
		notfinish = todoItems.filter(item => item.listid == listid && item.finish === false);
		notfinish.sort(itemCompare("endtime"));
		
		finish = todoItems.filter(item => item.listid == listid && item.finish === true);
		finish.sort(itemCompare("endtime"));
		
		if (document.querySelector('#show-btn').getAttribute('class') == 'not-show-com') {
			notfinish = notfinish.filter(item => item.finish === false);
			finish = finish.filter(item => item.finish === false);
		}
		
		itemView.innerHTML = notfinish.map(obj => itemGenerator(obj)).join('')
								+ finish.map(obj => itemGenerator(obj)).join('');
		
		var listSize = notfinish.length;
		document.getElementById("list-num").innerHTML = listSize + " items left";
	}
	checkIcon();
	checkEndtime();
	addListener();
}

// 更新分类列表的localStorage
function refreshList() {
	var listid = getParams("listid");
	let notfinish = todoItems.filter(item => item.listid == listid && item.finish === false);
	let list = todoLists.find(list => list.id == listid);
	list.num = notfinish.length;
	localStorage.setItem("todoLists", JSON.stringify(todoLists));
}

// 绘制特殊list列表
function renderSpecialList() {
	const itemView = document.querySelector('.items');
	var listid = getParams("listid");

	if (listid == 2) {
		let importantItems = todoItems.filter(item => item.important === true);
		let notfinish = importantItems.filter(item => item.finish === false);
		notfinish.sort(itemCompare("endtime"));
		let finished = importantItems.filter(item => item.finish === true);
		finished.sort(itemCompare("endtime"));
		
		if (document.querySelector('#show-btn').getAttribute('class') == 'not-show-com') {
			notfinish = notfinish.filter(item => item.finish === false);
			finished = finished.filter(item => item.finish === false);
		}
		
		itemView.innerHTML = notfinish.map(obj => itemGenerator_Imp(obj)).join('')
								+ finished.map(obj => itemGenerator_Imp(obj)).join('');
		document.getElementById("list-num").innerHTML = notfinish.length + " items left";
		
		var footer = document.getElementsByClassName("footer");
		footer[0].style.display = "none";
		
		return true;
	}
	if (listid == 3) {
		let finishItems = todoItems.filter(item => item.finish == true);
		itemView.innerHTML = finishItems.map(obj => itemGenerator(obj)).join('');
		
		var footer = document.getElementsByClassName("footer");
		footer[0].style.display = "none";
		
		document.querySelector('#show-btn').style.display = "none";
		document.querySelector('#com-all-btn').style.display = "none";
		
		var listNum = document.getElementById("list-num");
		listNum.innerHTML = "Totally " + finishItems.length + " tasks finished"
		
		return true;
	}
	return false;
}

// 排序todo事项比较
function itemCompare(attr) {
	return function(obj1, obj2) {
		var val1 = obj1[attr];
		var val2 = obj2[attr];
		if (val1 > val2) {
			return 1;
		} else if (val1 < val2) {
			return -1;
		} else {
			return 0;
		}
	}
}

// 生成todo事项
function itemGenerator(obj) {
	return `
	<div class="item" id=${obj.id} name=${obj.name} finish=${obj.finish}
			important=${obj.important}>
		<div class="fin-div">
			<img src="img/finish-no.png">
		</div>
		<div class="item-name">
			${obj.name}
		</div>
		<input type="text" value=" " class="edit-item" />
		<div class="star-div">
			<img src="img/star-empty64.png" class="icon" id="star-icon">
		</div>
		<div class="del-div">
			<img src="img/delete.png" class="icon" id="del-icon">
		</div>
		<div class="end-date">
			End date: ${obj.endtime}
		</div>
	</div>
	`;
}

// Important列表生成todo事项
function itemGenerator_Imp(obj) {
	return `
	<div class="item" id=${obj.id} name=${obj.name} finish=${obj.finish}
			important=${obj.important}>
		<div class="fin-div">
			<img src="img/finish-no.png">
		</div>
		<div class="item-name">
			${obj.name}
		</div>
		<input type="text" value=" " class="edit-item" />
		<div class="star-div">
			<img src="img/star-empty64.png" class="icon" id="star-icon">
		</div>
		<div class="del-div">
			<img src="img/delete.png" class="icon" id="del-icon">
		</div>
		<div class="end-date">
			End date: ${obj.endtime}
		</div>
		<div class="list-name">
			From: ${obj.listname}
		</div>
	</div>
	`;
}

// 设置图标
function checkIcon() {
	var items = document.getElementsByClassName("item");
	for (i = 0; i < items.length; i++) {
		if (items[i].getAttribute("finish") == "true") {
			let icon = items[i].getElementsByClassName("fin-div")[0].getElementsByTagName("img");
			let itemName = items[i].getElementsByClassName("item-name");
			
			icon[0].setAttribute("src", "img/finish-yes.png");
			itemName[0].setAttribute("class", "item-name item-name-finish");
		}
		
		if (items[i].getAttribute("important") == "true") {
			let iconStar = items[i].getElementsByClassName("star-div")[0].getElementsByTagName("img");
			iconStar[0].setAttribute("src", "img/star-full64.png");
		}
	}
}

// 确认是否已过期
function checkEndtime() {
	var endDate = document.getElementsByClassName("end-date");
	var today = new Date();
	today.setDate(new Date().getDate() - 1);
	for (i = 0; i < endDate.length; i++) {
		par = endDate[i].parentNode;
		//console.log(par);
		item = todoItems.find(item => item.id == par.id);
		let time = new Date(Date.parse(item.endtime.replace(/-/g,"/")));
		//console.log(item.endtime);
		if (time < today && item.finish == false) {
			endDate[i].style.color = "hotpink";
		}
	}
}


