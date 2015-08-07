
var count = 0;

function check(){
	$.get("http://xueqiu.com/cubes/rebalancing/history.json?cube_symbol=ZH191982&count=1&page=1",		
		function(data){

			if(data.totalCount > count)
			{
				count = data.totalCount;
				chrome.extension.sendMessage({cmd: "notify",type:"basic", count:count},function(response) {});
			}	
	});	
}

$(document).ready(function(){

	setInterval(check, 5000);  

});