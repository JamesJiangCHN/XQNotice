/*
created 2014-04-27 by qq1833183060

*/


function getCurIp(){	
	$.ajax({
		url:"http://www.ip38.com/",
		type:"GET",
		dataType: "text",
		async:false,				
		timeout: 1e4,		
		success:function(data, t, jqXHR){	
//<LI>您的本机IP地址：
//    111.12.126.16    &nbsp;&nbsp;来自：</strong><span id="ipad"> 稍等,查询中.... </span></LI>	
			var reg=/您的本机IP地址：\s.*?(\d*\.\d*\.\d*\.\d*)/;
			var result=reg.exec(data);
			console.log(result[0]);
			console.log(result[1]);
			
			console.log('成功获取本机ip');
			curIp=result[1];
			alert(curIp);
			if(result[1]!=undefined){
				
			}else{
				clearTimeout(getCurIp);
				setTimeout(getCurIp,5000);
			}			
		},
		error:function( jqXHR, textStatus, errorThrown) {
			console.log("Disconnect error");
			console.log(textStatus)
			console.log(jqXHR.status)
			clearTimeout(getCurIp);
			alert(textStatus);
			alert(jqXHR.status);
			//setTimeout(getCurIp,5000);
		}
	});
}
var g_newsArr=null;
$(document).ready(function(){
	//getCurIp();
	try{
	g_newsArr=JSON.parse(''+localStorage['newsArr']);
	}catch(c){}
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		if(request.cmd=='setNewsArr'){
			console.log(request.arr)
			g_newsArr=request.arr;
			localStorage['newsArr']=JSON.stringify(g_newsArr);
		}else if(request.cmd=='getNewsArr'){
			sendResponse({'arr':g_newsArr});
		}else if(request.cmd=='notify'){
			notify(request.type, request.mesg);
			sendResponse('ok');
		}
	})
});
chrome.windows.onRemoved.addListener(function (windowId){
		console.log('ddd');
});

function notify(ntype,mesg){
	var opt=null;
	switch(ntype){
		case 'basic':
			opt= {
			type: ntype,
			title: "组合有更新",
			message: mesg,
			iconUrl: "icon128.png",
			
		  }
			break;
		case 'image':
			opt= {
			type: ntype,
			title: "桌面提醒",
			message: "中大奖了！",
			iconUrl: "icon128.png",
			imageUrl:"image.jpg",
		  }
		break;
		case 'list':
			opt= {
			type: ntype,
			title: "桌面提醒",
			message: "中大奖了！",
			iconUrl: "icon128.png",
			items: [{ title: "1.", message: "下班了"},
					{ title: "2.", message: "吃饭了."},
					{ title: "3.", message: "中奖了."}]
		  }
		break;
		case 'progress':
			opt= {
			type: ntype,
			title: "桌面提醒",
			message: "当前进度...",
			iconUrl: "icon128.png",			
			progress:80
			}
		break;
		}
		
	   chrome.notifications.create('',opt,function(id){
		
	   })
}
