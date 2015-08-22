
var map={};

function getLocalTime(timeMs) {     
    return new Date(parseInt(timeMs)).toLocaleString()
} 

function getZhStatus(zhCode)
{
    $.get("http://xueqiu.com/cubes/rebalancing/history.json?cube_symbol="+zhCode+"&count=1&page=1",		
    function(data){

        var count = map[zhCode];
        if(count==null)
        {
            count = 0;
        }
        if(data.totalCount > count)
        {
            map[zhCode] = data.totalCount;
            var put_str = "  "
            var stock_datas = data.list[0].rebalancing_histories;	
            put_str+= count+" : "+getLocalTime(stock_datas[0].created_at)+"\n";				
            $.each(stock_datas,function(index,item){
                put_str += "  "+item.stock_name+"("+item.stock_symbol+")  ￥"+item.price+ "\n  "+item.prev_weight+"% -> "+item.target_weight+"%  \n";
            });
            //chrome.extension.sendMessage({cmd: "notify",type:"basic", mesg:put_str},function(response) {});
            notify("basic", put_str);
        }	
    });	
}

function check(){
    var zhKey;
    var zhValue;
    //notify("debug", "len:"+window.localStorage.length);
	var hour = new Date().getHours()
	if(hour>8 && hour<16)
	{
		for(var i=0,len=window.localStorage.length;i<len;i++){
            zhKey=window.localStorage.key(i);
            zhValue=window.localStorage.getItem(zhKey)
            getZhStatus(zhValue)
        }
	}
	
}
var g_newsArr=null;
$(document).ready(function(){
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		if(request.cmd=='setNewsArr'){
			console.log(request.arr)
			g_newsArr=request.arr;
		}else if(request.cmd=='getNewsArr'){
			sendResponse({'arr':g_newsArr});
		}else if(request.cmd=='notify'){
			notify(request.type, request.mesg);
			sendResponse('ok');
		}
	})
    setInterval(check, 10000); 
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
        case 'debug':
			opt= {
			type: 'basic',
			title: "调试",
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
