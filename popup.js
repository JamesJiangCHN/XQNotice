
var count=0;

function getLocalTime(timeMs) {     
    return new Date(parseInt(timeMs)).toLocaleString()
} 

function getZhStatus(zhCode)
{
    $.get("http://xueqiu.com/cubes/rebalancing/history.json?cube_symbol="+zhCode+"&count=1&page=1",		
    function(data){

        if(data.totalCount > count)
        {
            //count = data.totalCount;
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

function check(){
    var zhKey;
    var zhValue;
    
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

$(document).ready(function(){
    
    
    
	setInterval(check, 5000);  
	var zhKey;
    var zhValue;
	var MaxInputs       = 8; //maximum input boxes allowed  
	var InputsWrapper   = $("#InputsWrapper"); //Input boxes wrapper ID  
	var AddButton       = $("#AddMoreFileBox"); //Add button ID  
	var SaveButton      = $("#SaveBtn");
	var x = 0; //initlal text box count  
	var FieldCount=1; //to keep track of text box added  
    
    //alert(window.localStorage.length);
    if(window.localStorage.length < 1){
        $(InputsWrapper).append('<div style="margin:10px 0"><input type="text" class="zhItem"  id="zh_0" value=""/><a href="#" class="removeclass">×</a></div>');  
        x++;        
    }
    else{
        for(var i=0,len=window.localStorage.length;i<len;i++){
            zhKey=window.localStorage.key(i);
            zhValue=window.localStorage.getItem(zhKey)
            $(InputsWrapper).append('<div style="margin:10px 0"><input type="text" class="zhItem"  id="zh_'+ zhKey +'" value="'+zhValue+'"/><a href="#" class="removeclass">×</a></div>'); 
            x++;            
        }
	}  
	$(AddButton).click(function (e){  //on add input button click  
			if(x <= MaxInputs) //max input box allowed  
			{  
				FieldCount++; //text box added increment  
				//add input box  
				$(InputsWrapper).append('<div style="margin:10px 0"><input type="text" class="zhItem"  id="zh_'+ FieldCount +'" value=""/><a href="#" class="removeclass">×</a></div>');  
				x++; //text box increment  
			}  
            return false;  
	});  
	  
	$("body").on("click",".removeclass", function(e){ //user click on remove text  
			if( x > 1 ) {  
					$(this).parent('div').remove(); //remove text box  
					x--; //decrement textbox  
			}  
            return false;  
	})  

    $(SaveButton).click(function (e){  //on add input button click  
        window.localStorage.clear();
        $(".zhItem").each(function(index,element){  
            window.localStorage.setItem(index,element.value);   
        })
        
        //$.each($(".zhItem"), function(i,val){  
        //    window.localStorage.setItem(index,element.value);  
        //});  
	});      
});