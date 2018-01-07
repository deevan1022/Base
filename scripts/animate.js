//animate动画
Base.prototype.animate=function(obj){
	var attr=obj["attr"]=="w"?"width":obj["attr"]=="h"?"height":obj["attr"]=="x"?"left":obj["attr"]=="y"?"top":obj["attr"]=="o"?"opacity":"left";
	var step=obj["step"]!=undefined?obj["step"]:10;
	var alter=obj["alter"];
	var speed=obj["speed"]!=undefined?obj["speed"]:10;
	var target=obj["target"];
	var t=50;
	var type=obj["type"]==0?"constant":obj["type"]==1?"buffer":"buffer";

	var multiple=obj["multiple"];

	for(var i=0;i<this.elements.length;i++){
		var element=this.elements[i];
		var start=obj["start"]!=undefined?obj["start"]:obj["attr"]=="o"?parseFloat(getStyle(element,attr))*100:parseInt(getStyle(element,attr));

		attr=="opacity"?element.style[attr]=parseInt(start)/100:element.style[attr]=start+"px";

		if(alter!=undefined&&target==undefined){
			target=alter+start;
		} else if(alter==undefined&&target==undefined&&multiple==undefined){
			throw new Error("There must be a target and a alter");
		}

		if((target-start)<0) step=-step;

		if(multiple==undefined){
			multiple={};
			multiple[attr]=target;
		}

		clearInterval(element.timer);
		element.timer=setInterval(function(){
			for(var i in multiple){
				var flag=false;

				attr=i=="w"?"width":i=="h"?"height":i=="x"?"left":i=="y"?"top":i=="o"?"opacity":i!=undefined?i:"left";
				target=multiple[i];

				if(type=="buffer"){//缓冲运动
					if(attr=="opacity"){
						if(step>0){
							step=Math.ceil((target-parseFloat(getStyle(element,attr))*100)/speed);
						} else{
							step=Math.floor((target-parseFloat(getStyle(element,attr))*100)/speed);
						}
					} else{
						if(step>0){
							step=Math.ceil((target-parseInt(getStyle(element,attr)))/speed);
						} else{
							step=Math.floor((target-parseInt(getStyle(element,attr)))/speed);
						}
					}
				}

				if(attr=="opacity"){//透明度
					if(step==0){
						setOpacity();
					} else if((parseFloat(getStyle(element,attr))*100)>=(parseInt(target)-step)&&step>0){
						setOpacity();
					} else if((parseFloat(getStyle(element,attr))*100)<=(parseInt(target)-step)&&step<0){
						setOpacity();
					} else{
						element.style[attr]=((parseFloat(getStyle(element,attr))*100)+step)/100;
					}

					if(parseInt(target)==parseFloat(getStyle(element,attr))*100) flag=true;
					//document.getElementById("box2").innerHTML+=step+"<br>";
					//document.getElementById("box").innerHTML+=i+(parseFloat(getStyle(element,attr))*100)+","+flag+step+"<br/>";
				} else{
					if(step==0){
						setTarget();
					} else if(parseInt(getStyle(element,attr))>=(target-step)&&step>0){//if(Math.abs(parseInt(getStyle(element,attr))-target)<=step&&step>0)
						setTarget();
					} else if(parseInt(getStyle(element,attr))<=(target-step)&&step<0){//else if((parseInt(getStyle(element,attr))-target)<=Math.abs(step)&&step<0)
						setTarget();
					} else{
						element.style[attr]=parseInt(getStyle(element,attr))+step+"px";
					}

					if(target==parseInt(getStyle(element,attr))) flag=true;
					//document.getElementById("box2").innerHTML+=step+"<br>";
					//document.getElementById("box").innerHTML+=i+parseInt(getStyle(element,attr))+","+flag+"<br/>";
				}

			}

			for(var i in multiple){
				attr=i=="w"?"width":i=="h"?"height":i=="x"?"left":i=="y"?"top":i=="o"?"opacity":i!=undefined?i:"left";
				if(attr=="opacity"){
					if(parseInt(multiple[i])!=(parseFloat(getStyle(element,attr))*100)){
						flag=false;
					}
				} else{
					if(multiple[i]!=parseInt(getStyle(element,attr))){
						flag=false;
					}
				}
			}

			if(flag==true){
				clearInterval(element.timer);
				//列队动画
				if(obj["fn"]!=undefined) obj.fn();
			}

			function setOpacity(){
				element.style[attr]=parseInt(target)/100;
			}

			function setTarget(){
				element.style[attr]=target+"px";
			}
		},t);
	}
	return this;
};
