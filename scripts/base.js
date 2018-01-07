//下面还有一个问题：
function Base(args){
	this.elements=[];
	if(typeof args=="string"){
		if(args.indexOf(" ")!=-1){
			var node=[];//这里创建了一个临时数组 node
			var elements=args.split(" ");
			if(node.length==0) node.push(document);
			for(var i=0;i<elements.length;i++){
				var element=elements[i];
				switch(element.charAt(0)){
					case "#":
						this.elements=[];
						this.elements.push(this.getId(element.substring(1)));
						node=this.elements;
						break;
					case ".":
						this.elements=[];
						for(var j=0;j<node.length;j++){
							var temps=this.getClass(element.substring(1),node[j]);
							for(var k=0;k<temps.length;k++){
								this.elements.push(temps[k]);
							}
						}
						node=this.elements;
						break;
					default:
						this.elements=[];
						for(var j=0;j<node.length;j++){
							var temps=this.getTag(element,node[j]);
							for(var k=0;k<temps.length;k++){
								this.elements.push(temps[k]);
							}
						}
						node=this.elements;
				}
			}
		} else {
			switch(args.charAt(0)){
				case "#":
					this.elements.push(this.getId(args.substring(1)));
					break;
				case ".":
					this.elements=this.getClass(args.substring(1));
					break;
				default:
					this.elements=this.getTag(args);
			}
		}
	} else if(typeof args=="object"){
		this.elements.push(args);
	} else if(typeof args=="function"){
		this.ready(args);
	}
}

function $(args){
	return new Base(args);
}

Base.prototype.getId=function(id){
	return document.getElementById(id);
}

Base.prototype.getClass=function(className,parentNode){
	if(arguments.length==1){
		parentNode=document;
	}
	return parentNode.getElementsByClassName(className);
}

Base.prototype.getTag=function(tag,parentNode){
	if(arguments.length==1){
		parentNode=document;
	}
	return parentNode.getElementsByTagName(tag);
}

//获取某一个节点，并且返回这个节点对象：
Base.prototype.getElement=function(index){
	return this.elements[index];
}

//获取某一个节点，并且返回 base 对象：
Base.prototype.eq=function(index){
	var element=this.elements[index];
	this.elements=[];
	this.elements.push(element);
	return this;
}

//设置和获取指定元素的 css 样式：
Base.prototype.css=function(attr,value){
	if(arguments.length==1){//获取 css 样式
		return getStyle(this.elements[0])[attr];
	}
	for(var i=0;i<this.elements.length;i++){//设置 css 样式
		var element=this.elements[i];
		element.style[attr]=value;
	}
	return this;
}

//设置和获取指定元素的 innerHTML 属性：
Base.prototype.html=function(text){
	if(arguments.length==0){
		return this.elements[0].innerHTML;//获取 innerHTML 属性
	}
	for(var i=0;i<this.elements.length;i++){//设置 innerHTML 属性
		var element=this.elements[i];
		element.innerHTML=text;
	}
	return this;
}

Base.prototype.click=function(fn){
	for(var i=0;i<this.elements.length;i++){
		var element=this.elements[i];
		addEvent(element,"click",fn);
	}
}

Base.prototype.toggle=function(){
	for(var i=0;i<this.elements.length;i++){
		var element=this.elements[i];
		(function(elem,args){
			var count=0;//通过下面的闭包访问这里的 count 变量，保证每一个对象访问的都是自己的 count 变量。
			addEvent(elem,"click",function(){//闭包
				args[count++%args.length].call(this);
			});
		})(element,arguments);
	}
}

/*
Base.prototype.next=function(){//获取下一个节点
	var nextNode=this.elements[0].nextSibling;
	while(nextNode.nodeType==3 && /^\s+$/.test(nextNode.nodeValue)){
		nextNode=nextNode.nextSibling;
	}
	this.elements[0]=nextNode;
	return this;
}
*/

/*
Base.prototype.prev=function(){//获取上一个节点
	var prevNode=this.elements[0].previousSibling;
	while(prevNode.nodeType==3 && /^\s+$/.test(prevNode.nodeValue)){
		prevNode=prevNode.previousSibling;
	}
	this.elements[0]=prevNode;
	return this;
}
*/

//当前节点的下一个元素节点：
/*
Base.prototype.next=function(){
	var nextNode=this.elements[0].nextSibling;
	this.elements=[];
	while(nextNode && nextNode.nodeType!=1){
		nextNode=nextNode.nextSibling;
	}
	if(nextNode){
		this.elements[0]=nextNode;
	} else{
		throw new Error("当前节点没有下一个元素节点。");
	}
	return this;
}
*/

//当前节点的上一个元素节点：
/*
Base.prototype.prev=function(){
	var prevNode=this.elements[0].previousSibling;
	this.elements=[];
	while(prevNode && prevNode.nodeType!=1){
		prevNode=prevNode.previousSibling;
	}
	if(prevNode){
		this.elements[0]=prevNode;
	} else{
		throw new Error("当前节点没有上一个元素节点。");
	}
}
*/

//当前节点的下一个元素节点：
Base.prototype.next=function(){
	var nextNode=this.elements[0].nextSibling;
	this.elements=[];
	this.elements[0]=nextNode;
	if(nextNode==null) throw new Error("当前节点没有下一个元素节点。");
	if(nextNode.nodeType!=1) this.next();//循环
	return this;
}

//当前节点的上一个元素节点：
Base.prototype.prev=function(){
	var prevNode=this.elements[0].previousSibling;
	this.elements=[];
	this.elements[0]=prevNode;
	if(prevNode==null) throw new Error("当前节点没有上一个元素节点。");
	if(prevNode.nodeType!=1) this.prev();//循环
	return this;
}

//添加指定的一条 css规则：
Base.prototype.insertRule=function(sIndex,selector,cssText,rIndex){
	var sheet=getSheet(sIndex);
	if(typeof sheet.insertRule=="function"){
		sheet.insertRule(selector+"{"+cssText+"}",rIndex);
	} else if(typeof sheet.addRule=="function"){
		sheet.addRule(selector,cssText,rIndex);
	}
	return this;
}

//移除指定的一条 css规则：
Base.prototype.deleteRule=function(sIndex,rIndex){
	var sheet=getSheet(sIndex);
	if(typeof sheet.deleteRule=="function"){
		sheet.deleteRule(rIndex);
	} else if(typeof sheet.removeRule=="function"){
		sheet.removeRule(rIndex);
	}
	return this;
}

//设置鼠标移入移出方法：
Base.prototype.hover=function(over,out){
	for(var i=0;i<this.elements.length;i++){
		var element=this.elements[i];
		addEvent(element,"mouseover",over);
		addEvent(element,"mouseout",out);
	}
	return this;
}

//设置显示：
Base.prototype.show=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display="block";
	}
	return this;
}

//设置隐藏：
Base.prototype.hide=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display="none";
	}
	return this;
}

//设置物体居中：
//下面还有一个问题：IE 浏览器在没有触发 scroll 事件的情况下，scrollTop 属性和 scrollLeft属性的值始终是 0 的问题。
Base.prototype.center=function(){
	for(var i=0;i<this.elements.length;i++){
		var element=this.elements[i];
		//这里没有用 window.innerWidth 的原因是，window.innerWidth 属性是计算上滚动条的宽度的(注意：不是滚动条滚动过的距离)，而 document.documentElement.clientWidth 属性是不计算上滚动条的宽度的(注意：不是滚动条滚动过的距离)。
		var left=(document.documentElement.clientWidth-element.offsetWidth)/2+getScroll().left;
		//这里没有用 window.innerHeight 的原因是，window.innerHeight 属性是计算上滚动条的高度的(注意：不是滚动条滚动过的距离)，而 document.documentElement.clientHeight 属性是不计算上滚动条的高度的(注意：不是滚动条滚动过的距离)。
		var top=(document.documentElement.clientHeight-element.offsetHeight)/2+getScroll().top;
		element.style.position="absolute";
		element.style.left=left+"px";
		element.style.top=top+"px";
	}
	return this;
}

//添加 DOMContentLoaded 事件：
Base.prototype.ready=function(fn){
	addDOMLoaded(fn);
}

//添加插件：
Base.prototype.extend=function(name,fn){
	Base.prototype[name]=fn;
}

//返回 first 节点：
Base.prototype.first=function(){
	return this.elements[0];
}

//返回 last 节点：
Base.prototype.last=function(){
	return this.elements[this.elements.length-1];
}

//设置事件发生器：
Base.prototype.bind=function(type,fn){
	for(var i=0;i<this.elements.length;i++){
		var element=this.elements[i];
		addEvent(element,type,fn);
	}
	return this;
}

//获取表单字段元素：
Base.prototype.form=function(name){
	var form=this.elements[0];
	this.elements=[];
	var fields=form.elements[name];
	for(var i=0;i<fields.length;i++){
		this.elements.push(fields[i]);
	}
	return this;
}

//设置和获取表单字段的 value 值：
Base.prototype.value=function(text){
	if(arguments.length==0) return this.elements[0].value;
	for(var i=0;i<this.elements.length;i++){
		var element=this.elements[i];
		element.value=text;
	}
	return this;
}

//设置和获取 innerText 属性：
Base.prototype.text=function(text){
	if(arguments.length==0) return getInnerText(this.elements[0]);
	for(var i=0;i<this.elements.length;i++){
		setInnerText(this.elements[i],text);
	}
	return this;
}

//获取某组节点的数量：
Base.prototype.length=function(){
	return this.elements.length;
}

//设置和获取某一个节点的属性(DOM 的方法)：
Base.prototype.attr=function(attr,value){
	if(arguments.length==1){
		return this.elements[0].getAttribute(attr);
	}
	for(var i=0;i<this.elements.length;i++){
		var element=this.elements[i];
		element.setAttribute(attr,value);
	}
	return this;
}

//获取某一个元素节点在父节点的所有元素节点里的索引：
Base.prototype.index=function(){
	var parentNode=this.elements[0].parentNode;
	var children=parentNode.children;
	for(var i=0;i<children.length;i++){
		if(this.elements[0]==children[i]) return i;
	}
}

//设置透明度：
Base.prototype.opacity=function(num){
	for(var i=0;i<this.elements.length;i++){
		var element=this.elements[i];
		element.style.opacity=num/100;
	}
	return this;
}

//触发浏览器窗口事件
Base.prototype.resize=function(fn){
	for(var i=0;i<this.elements.length;i++){
		var element=this.elements[i];
		addEvent(window,"resize",function(){
			//fn();
			center();
		});

		addEvent(window,"scroll",function(){
			center();
		});

		function center(){
			var left=(document.documentElement.clientWidth-element.offsetWidth)/2+getScroll().left;
			var top=(document.documentElement.clientHeight-element.offsetHeight)/2+getScroll().top;
			if(document.documentElement.clientWidth>element.offsetWidth && document.documentElement.clientHeight>element.offsetHeight){
				element.style.left=left+"px";
				element.style.top=top+"px";
			} else{
				element.style.left=getScroll().left+"px";
				element.style.top=getScroll().top+"px";
			}
		}
	}
	return this;
}

//drag 拖拽：
//下面还有一个问题：用比较快的速度拖拽目标的时候，会发生鼠标脱离拖拽目标的情况。
Base.prototype.drag=function(){
	var element=this.elements[0];
	this.elements=[];

	addEvent(element,"mousedown",function(evt){
		var e=getEvt(evt);
		var distX=e.clientX+getScroll().left-element.offsetLeft;
		var distY=e.clientY+getScroll().top-element.offsetTop;

		addEvent(document.documentElement,"mousedown",preDef);
		addEvent(document.documentElement,"selectstart",preDef);

		addEvent(element,"mousemove",move);
		function move(evt){
			var e=getEvt(evt);
			var left=e.clientX+getScroll().left-distX;
			var top=e.clientY+getScroll().top-distY;
			element.style.left=left+"px";
			element.style.top=top+"px";
			if(e.clientX<distX){
				element.style.left=getScroll().left+"px";
			}
			if(e.clientY<distY){
				element.style.top=getScroll().top+"px";
			}
			if(e.clientX-distX>document.documentElement.clientWidth-element.offsetWidth){//这里没有用 window.innerWidth 的原因是，window.innerWidth 属性是计算上滚动条的宽度的(注意：不是滚动条滚动过的距离)，而 document.documentElement.clientWidth 属性是不计算上滚动条的宽度的(注意：不是滚动条滚动过的距离)。
				element.style.left=document.documentElement.clientWidth-element.offsetWidth+getScroll().left+"px";
			}
			if(e.clientY-distY>document.documentElement.clientHeight-element.offsetHeight){//这里没有用 window.innerHeight 的原因是，window.innerHeight 属性是计算上滚动条的高度的(注意：不是滚动条滚动过的距离)，而 document.documentElement.clientHeight 属性是不计算上滚动条的高度的(注意：不是滚动条滚动过的距离)。
				element.style.top=document.documentElement.clientHeight-element.offsetHeight+getScroll().top+"px";
			}
		}

		addEvent(element,"mouseup",function(evt){
			removeEvent(element,"mousemove",move);
			removeEvent(document.documentElement,"mousedown",preDef);
			removeEvent(document.documentElement,"selectstart",preDef);
		});
	});
	return this;
}

