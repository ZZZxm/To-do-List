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

function getParams(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};

document.ready(function() {
    var listName = getParams("listname");
    console.log(listName);
    var title = document.querySelector("h1");
    console.log(title);
    title.innerText = listName;
    title.style = "display=block;";
	
	var ret = document.getElementById("ret-icon");
	ret.onclick = function() {
		window.location.href = "index.html";
	}
	

	
	initItemIcon();
})

// 初始化每项事项的图标按钮事件
function initItemIcon() {
	var finishDiv = document.getElementsByClassName("fin-div");
	
	// 完成图标
	for (i = 0; i < finishDiv.length; i++) {
		let icon = finishDiv[i].getElementsByTagName("img");
		let itemName = finishDiv[i].nextElementSibling;
		console.log(itemName);
		finishDiv[i].onclick = function() {
			console.log(111);
			if (icon[0].getAttribute("src", 2) == "img/finish-no.png") {
				icon[0].setAttribute("src", "img/finish-yes.png");
				itemName.setAttribute("class", "item-name item-name-finish");
			}
			else {
				icon[0].setAttribute("src", "img/finish-no.png");
				itemName.setAttribute("class", "item-name");
			}
		}
		
		itemName.onclick = function() {
			console.log(111);
			if (icon[0].getAttribute("src", 2) == "img/finish-no.png") {
				icon[0].setAttribute("src", "img/finish-yes.png");
				itemName.setAttribute("class", "item-name item-name-finish");
			}
			else {
				icon[0].setAttribute("src", "img/finish-no.png");
				itemName.setAttribute("class", "item-name");
			}
		}
	}
	
	var starDiv = document.getElementsByClassName("")
}

// 记得 event.stopPropagation();


