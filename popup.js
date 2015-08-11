
var count = 0;

function getLocalTime(timeNs) {     
    return new Date(parseInt(timeNs)).toLocaleString()
} 

function check(){
	var hour = new Date().getHours()
	if(hour>8 && hour<16)
	{
		$.get("http://xueqiu.com/cubes/rebalancing/history.json?cube_symbol=ZH191982&count=1&page=1",		
		function(data){

			if(data.totalCount > count)
			{
				count = data.totalCount;
				var put_str = "  "
				var stock_datas = data.list[0].rebalancing_histories;	
				put_str+= count+" : "+getLocalTime(stock_datas[0].created_at)+"\n";				
				$.each(stock_datas,function(index,item){
					put_str += "  "+item.stock_name+"("+item.stock_symbol+")  ￥"+item.price+ "\n  "+item.prev_weight+"% -> "+item.target_weight+"%  \n";
				});
				chrome.extension.sendMessage({cmd: "notify",type:"basic", mesg:put_str},function(response) {});
			}	
		});	
		
	}
	
}

$(document).ready(function(){
	setInterval(check, 5000);  
});