function addEvent(obj,type,fn){//通过 DOM2级 事件绑定函数写的 addEvent() 方法。
	if(typeof obj.addEventListener=="function"){
		obj.addEventListener(type,fn,false);//冒泡模式
	}
}

function removeEvent(obj,type,fn){//通过 DOM2级 事件绑定函数写的 removeEvent() 方法。
	if(typeof obj.removeEventListener=="function"){
		obj.removeEventListener(type,fn,false);//冒泡模式
	}
}

function getEvt(evt){//getEvt() 方法，获取 event 对象。
	var e=evt || window.event;
	return e;
}

function getTarget(e){//getTarget() 方法
	if(e.relatedTarget){//W3C
		return e.relatedTarget;
	} else if(e.srcElement){//IE(注意：这里的判断不严密，因为 Chrome 也支持 srcElement 属性)。
		if(e.type=="mouseover"){
			return e.fromElement;
		} else if(e.type=="mouseout"){
			return e.toElement;
		}
	}
}

function getCharCode(e){//getCharCode() 方法(该方法是为了兼容旧版本的 IE 浏览器不支持 event 对象的 charCode 属性的情况，现在的 IE 浏览器已经支持 charCode 属性了)。
	if(typeof e.charCode=="number"){//W3C(现在 IE 浏览器也支持 event 对象的 charCode 属性了)。
		return e.charCode;
	} else{//IE
		return e.keyCode;
	}
}

function preDef(e){//preDef() 方法，跨浏览器阻止默认行为。
	if(typeof e.preventDefault=="function"){//W3C
		e.preventDefault();
	} else if(typeof e.returnValue!="undefined"){//IE
		e.returnValue=false;
	}
}

//跨浏览器兼容 mousewheel 事件(非火狐) 和 DOMMouseScroll 事件(火狐)
function WD(e){
	if(e.type=="mousewheel"){
		return e.wheelDelta;
	} else if(e.type=="DOMMouseScroll"){
		return e.detail*(-40);
	}
}

function filterWhiteNode(node){//filterWhiteNode() 方法，忽略空白文本节点。
	var arr=[];
	for(var i=0;i<node.childNodes.length;i++){
		var child=node.childNodes[i];
		if(child.nodeType==3 && /^\s+$/.test(child.nodeValue)){
			continue;
		}
		arr.push(child);
	}
	return arr;
}

function removeWhiteNode(node){//removeWhiteNode() 方法，移除空白文本节点。
	for(var i=0;i<node.childNodes.length;i++){
		var child=node.childNodes[i];
		if(child.nodeType==3 && /^\s+$/.test(child.nodeValue)){
			node.removeChild(child);
			i=i-1;//重点注意：这里需要重置变量 i 的值。
		}
	}
	return node;
}

function removeArrElem(arr,value){//移除指定的数组元素
	for(var i=0;i<arr.length;i++){
		if(arr[i]==value){
			arr.splice(i,1);
			i=i-1;//重点注意：这里需要重置变量 i 的值。因为在我们通过 splice() 方法删除数组的指定元素后，数组的长度 和 变量i的值 也会动态发生变化，也就是说，如果原数组的第一个元素(即，原先 i 的值是 0 的元素)被删除后，原数组的第二个元素(即，原先 i 的值是 1)就会变成新数组的第一个元素(即，现在 i 的值是 0)。如果我们没有重置变量 i 的值，那么被删除后的那个数组元素的下一个数组元素会执行不到 for 循环里的语句。
		}
	}
	return arr;
}

function insertAfter(newNode,existingNode){//insertAfter() 方法
	var parent=existingNode.parentNode;
	parent.insertBefore(newNode,existingNode.nextSibling);
}

function getStyle(node){//跨浏览器获取 CSSStyleDeclaration 对象
	return window.getComputedStyle(node,null) || node.currentStyle;
}

function offsetLeft(node){//offsetLeft() 方法，计算指定元素到页面左边界的距离。
	var left=node.offsetLeft;
	var parent=node.offsetParent;
	while(parent){
		//注意：下面每一次都需要加上 parent 元素的左边框的宽度，因为 offsetLeft 属性计算的是目标元素的 border-box 的左上角相对于 父元素的 padding-box 左上角的位置。
		left+=parent.offsetLeft+parseInt(getStyle(parent).borderLeftWidth);
		parent=parent.offsetParent;
	}
	return left;
}

function offsetTop(node){//offsetTop() 方法，计算指定元素到页面上边界的距离。
	var top=node.offsetTop;
	var parent=node.offsetParent;
	while(parent){
		//注意：下面每一次都需要加上 parent 元素的左边框的宽度，因为 offsetTop 属性计算的是目标元素的 border-box 的左上角相对于 父元素的 padding-box 左上角的位置。
		top+=parent.offsetTop+parseInt(getStyle(parent).borderTopWidth);
		parent=parent.offsetParent;
	}
	return top;
}

function scrollStart(node){//scrollStart() 方法，让元素的滚动条回到初始位置。
	if(node.scrollLeft!=0 || node.scrollTop!=0){
		node.scrollLeft=0;
		node.scrollTop=0;
	}
}

//获取窗口的 scrollTop 属性 和 scrollLeft 属性的值：
function getScroll(){
	return {
		top: document.documentElement.scrollTop || document.body.scrollTop,
		left: document.documentElement.scrollLeft || document.body.scrollLeft
	}
	//注意：IE 浏览器需要在 scroll 事件里才能获取到 scrollTop 属性 和 scrollLeft 属性的值(窗口的 scroll 事件可以绑定的对象可以是 window 也可以是 document)。
}

//获取窗口可视区的宽度和高度：
function getInner(){
	if(typeof window.innerWidth!="undefined"){//加上滚动条的宽度和高度
		return {
			width: window.innerWidth,
			height: window.innerHeight
		}
	} else if(typeof document.documentElement.clientWidth!="undefined"){//不加滚动条的宽度和高度
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		}
	}
}

//添加 DOMContentLoaded 事件：
function addDOMLoaded(fn){
	addEvent(document,"DOMContentLoaded",fn);
}

function select(start,end){//select() 方法，返回 start~end 之间一个随机的整数(包括 start 和 end)。
	var total=end-start+1;
	return Math.floor(Math.random()*total+start);
}

//注意：上面我们自定义的那个 select() 方法，并不是下面我们自定义的 selectPartialText() 方法里用到的那个 select() 方法。

function selectPartialText(element,start,end){//selectPartialText() 方法，选择指定起始到结束位置的部分文本。
	if(typeof element.setSelectionRange=="function"){//W3C(现在 IE 浏览器也支持 setSelectionRange() 方法了)。
		element.setSelectionRange(start,end);
		element.focus();
	} else if(typeof element.createTextRange=="function"){//IE
		var range=element.createTextRange();
		var length=end-start;
		range.collapse(true);
		range.moveStart("character",start);
		range.moveEnd("character",length);
		range.select();
	}
}

function getSelectText(element){//getSelectText() 方法，返回选择的文本(注意：这个方法在 select 事件里才会有有效的值)。
	if(typeof element.selectionStart=="number"){
		return element.value.substring(element.selectionStart,element.selectionEnd);
	}
}

function hasClass(element,cName){//检查是否存在指定的 class 值
	var patt=new RegExp("(^|\\s)"+cName+"(\\s|$)");//注意：这里的分组圆括号是必须的。
	return !!element.className.match(patt);
	//注意：上面 return 语句里只是为了要返回一个布尔值，所以这里用的 match() 方法不是必须的，也可以用 test() 方法，即 return patt.test(element.className); 在这里效果是相同的。
}

function addClass(element,cName){//添加指定的 class 值
	if(!hasClass(element,cName)){
		element.className+=" "+cName;
	}
}

function removeClass(element,cName){//移除指定的 class 值
	var patt=new RegExp("(^|\\s)"+cName+"(\\s|$)");
	if(hasClass(element,cName)){
		element.className=element.className.replace(patt," ");
		//注意：上面必须要用一个空格替换我们指定要移除的那个 class 值，要不然如果碰到左右两边都是空格的 class 值的话，它前后的两个 class 值就会连在一起了。
	}
}

function getSheet(index){//获取指定的 sheet 对象
	var link=document.getElementsByTagName("link")[index];
	return document.styleSheets[index] || link.sheet;
}

function getRule(sIndex,rIndex){//获取指定的 sheet 对象的指定的 rule 对象
	var sheet=getSheet(sIndex);
	return (sheet.cssRules || sheet.rules)[rIndex];
}

//跨浏览器添加指定的一条 css规则：
function insertRule(sIndex,selectorText,cssText,rIndex){
	var sheet=getSheet(sIndex);
	if(typeof sheet.insertRule=="function"){
		sheet.insertRule(selectorText+"{"+cssText+"}",rIndex);
	} else if(typeof sheet.addRule=="function"){
		sheet.addRule(selectorText,cssText,rIndex);
	}
}

//跨浏览器移除指定的一条 css规则：
function deleteRule(sIndex,rIndex){
	var sheet=getSheet(sIndex);
	if(typeof sheet.deleteRule=="function"){
		sheet.deleteRule(rIndex);
	} else if(typeof sheet.removeRule=="function"){
		sheet.removeRule(rIndex);
	}
}

//设置一条指定的 cookie：
function setCookie(name,value,expires,path,domain,secure){
	if(arguments.length<2) return;
	var cookie="";
	cookie=encodeURIComponent(name)+"="+encodeURIComponent(value);
	if(expires){
		var date=setCookieDate(expires);
		cookie+=";expires="+date;
	}
	if(path){
		cookie+=";path="+path;
	}
	if(domain){
		cookie+=";domian="+domain;
	}
	if(secure){
		cookie+=";secure";
	}
	document.cookie=cookie;
}

//设置一条 cookie 的过期时间：
function setCookieDate(days){
	if(typeof days=="number" && days>0){
		var date=new Date();
		date.setDate(date.getDate()+days);
		return date;
	} else {
		throw new Error("您传递的天数不正确，必须是数字并且大于 0。");
	}
}

//获取一条指定的 cookie：
function getCookie(name){
	var cookieValue="";
	var cookieName=encodeURIComponent(name)+"=";
	var cookieStart=document.cookie.indexOf(cookieName);
	if(cookieStart>-1){//这里需要判断 cookieStart 的值是否大于 -1，因为如果找不到 cookieName 返回 -1 的话，下面用到的 index() 方法的第二个参数会忽略负的参数然后从索引 0 的位置开始搜索，那么得到的 cookieEnd 的值就不正确了。重要的是，如果找不到 cookieName 的话，就没有必要再继续获取 cookieValue 了。
		var cookieEnd=document.cookie.indexOf(";",cookieStart);
		if(cookieEnd>-1){//如果 document.cookie(字符串) 里找不到分号(;)的话，说明我们要获取的这条 cookie 的结束位置就是 document.cookie(字符串) 的结束位置。
			cookieValue=document.cookie.substring(cookieStart+cookieName.length,cookieEnd);
		} else{
			cookieValue=document.cookie.substring(cookieStart+cookieName.length);
		}
	}
	return decodeURIComponent(cookieValue);
}

//删除一条指定的 cookie：
function deleteCookie(name){
	var cookieValue=getCookie(name);
	var date=new Date(0);
	document.cookie=encodeURIComponent(name)+"="+encodeURIComponent(cookieValue)+";expires="+date;
}

//跨浏览器创建 xhr 对象：
function createXHR(){
	var xhr;
	if(typeof XMLHttpRequest!="undefined"){//W3C(现在 IE 浏览器也支持 XMLHttpRequest() 构造函数了)。
		xhr=new XMLHttpRequest();
	} else if(typeof ActiveXObject!="undefined"){
		xhr=new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xhr;
}

//注意：特殊字符传参产生的问题可以通过 encodeURIComponent() 方法进行编码处理：
function addURLParam(url,name,value){
	url+=url.indexOf("?")==-1?"?":"&";//判断传入的 url 是否已有参数(有的话，是含有 ? 符号的)。
	url+=encodeURIComponent(name)+"="+encodeURIComponent(value);
	return url;
}

//ajax 函数
function ajax(obj){
	var xhr=createXHR();
	//重要注意：下面如果写成 var url+=obj.url.indexOf("?")==-1?"?rand="+Math.random():"&rand="+Math.random(); 是会报错的，原因是通过 var 关键字声明的变量后面不能直接跟 += 操作符。
	obj.url+=obj.url.indexOf("?")==-1?"?rand="+Math.random():"&rand="+Math.random();
	obj.data=params(obj.data);

	if(obj.method=="GET"){//GET 类型
		obj.url+="&"+obj.data;
	}

	if(obj.async==true){//异步加载
		xhr.onreadystatechange=function(){
			if(this.readyState==4){
				callback();//修改完成。
			}
		}
	}

	xhr.open(obj.method,obj.url,obj.async);

	if(obj.method=="GET"){//GET 类型
		xhr.send(null);
	} else if(obj.method=="POST"){//POST 类型
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xhr.send(obj.data);
	}

	if(obj.async==false){//同步加载
		callback();
	}

	function callback(){
		if(xhr.status==200){
			obj.success(xhr.responseText);
		} else{
			alert("数据返回失败，状态代码："+this.status+"状态信息："+this.statusText);
		}
	}
}

/*
//ajax 调用：
document.addEventListener("click",function(){
	ajax({
		method: "GET",
		url: "http://127.0.0.1/xml(02).php",
		async: true,
		success: function(text){//回调函数
			alert(text);
		},
		data: {
			code: "J&Q",
			age: 200
		}
	});
},false);
*/

function params(data){
	//这里如果没有传 data 的话，因为 data 是 undefined，所以下面的 for 循环语句没有执行，同时也不会报错。
	var arr=[];
	for(var i in data){
		arr.push(encodeURIComponent(i)+"="+encodeURIComponent(data[i]));
	}
	return arr.join("&");
}

//counting 计数：
function counting(element,args){
	var count=0;//通过下面的闭包访问这里的 count 变量，保证每一个对象访问的都是自己的 count 变量。
	addEvent(element,"click",function(){//闭包
		//注意：如果 args 的长度是 3，那么 0 % 3 = 0(余数)，1 % 3 = 1(余数)，2 % 3 = 2，3 % 3 = 0(余数)，4 % 3 = 1(余数)，以此类推。
		args[count++%args.length].call(this);//通过点击执行对应的那个函数
	});
}

function getInnerText(element){
	return element.innerText || element.textContent;
}

function setInnerText(element,text){
	if(typeof element.innerText!="undefined"){
		element.innerText=text;
	} else if(typeof element.textContent!="undefined"){
		element.textContent=text;
	}
}