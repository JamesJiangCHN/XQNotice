
var count;

function getLocalTime(timeMs) {     
    return new Date(parseInt(timeMs)).toLocaleString()
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
	
	var MaxInputs       = 8; //maximum input boxes allowed  
	var InputsWrapper   = $("#InputsWrapper"); //Input boxes wrapper ID  
	var AddButton       = $("#AddMoreFileBox"); //Add button ID  
	var SaveButton      = $("#SaveBtn");
	var x = InputsWrapper.length; //initlal text box count  
	var FieldCount=1; //to keep track of text box added  
	  
	$(AddButton).click(function (e){  //on add input button click  
			if(x <= MaxInputs) //max input box allowed  
			{  
				FieldCount++; //text box added increment  
				//add input box  
				$(InputsWrapper).append('<div style="margin:10px 0"><input type="text" name="mytext[]" id="field_'+ FieldCount +'" value="Text '+ FieldCount +'"/><a href="#" class="removeclass">×</a></div>');  
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
		chrome.storage.local.set({'value': 'value1'}, function() {
            alert('存储成功')       
        }); 
	});      
});