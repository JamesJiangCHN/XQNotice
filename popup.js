var count = 0;


function getLocalTime(timeNs) {     
    return new Date(parseInt(timeNs)).toLocaleString().substr(0,17)
} 

function check(){
	var hour = new Date().getHours()
	if(hour>8 || hour<15)
	{
		$.get("http://xueqiu.com/cubes/rebalancing/history.json?cube_symbol=ZH191982&count=1&page=1",		
		function(data){

			if(data.totalCount > count)
			{
				count = data.totalCount;
				var put_str = ""
				var stock_data = data.list[0].rebalancing_histories[0];
				put_str = "\t"+count+" : "+getLocalTime(stock_data.created_at)+"\r\n\t"+stock_data.stock_name+"("+stock_data.stock_symbol+")  ￥"+stock_data.price+ "\r\n\t变更情况："+stock_data.prev_weight+"% -> "+stock_data.target_weight+"%";
				chrome.extension.sendMessage({cmd: "notify",type:"basic", mesg:put_str},function(response) {});
			}	
		});	
		
	}
	
}

$(document).ready(function(){
	setInterval(check, 5000);  
});