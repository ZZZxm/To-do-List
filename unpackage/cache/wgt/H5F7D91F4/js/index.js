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

// 存储各个todo分组列表
const todoLists = JSON.parse(localStorage.getItem("todoLists")) || [];

document.ready(function() {
	
	renderLists();
	
	// 为每个list绑定跳转页面事件
	var lists = document.getElementsByClassName("list");
    for (i = 0; i < lists.length; i++)
    {
        let listName = lists[i].id;
        console.log(listName);
        lists[i].onclick = function() {
            window.location.href = "list.html?listname="+listName;
        }
    }
	
	document.querySelector('#add-btn')
		.addEventListener('click', addList);
})

function addListenerToList() {
	var lists = document.getElementsByClassName("list");
	for (i = 0; i < lists.length; i++)
	{
	    let listName = lists[i].id;
	    console.log(listName);
	    lists[i].onclick = function() {
	        window.location.href = "list.html?listname="+listName;
	    }
	}
}

// 添加分组列表
function addList(e) {
	let inputList = document.getElementById("add-list").value;
	if (inputList == "") {
		return;
	}
	
	let listObj = {
		name: inputList,
		num: 0,
	};
	
	todoLists.push(listObj);
	document.getElementById("add-list").value = "";
	localStorage.setItem("todoLists", JSON.stringify(todoLists));
	renderLists();
}

function renderLists() {
	const listsView = document.querySelector('#self-list');
	listsView.innerHTML = todoLists.map(obj => listGenerator(obj)).join('');
	addListenerToList();
}

function listGenerator(obj) {
	return `
	<div id="${obj.name}" class="list">
		<img src="img/list-icon.png" class="icon">
		<div class="list-name">
			${obj.name}
		</div>
		<div class="list-size">
			${obj.num}
		</div>
	</div>
	`;
}

