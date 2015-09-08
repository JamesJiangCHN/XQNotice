
regZh=/^ZH\d{6}$/;  
function checkZhDetail(id, zhSymbol)
{
    $.get("http://xueqiu.com/cubes/quote.json?code="+zhSymbol+"&return_hasexist=false&_="+new Date().getTime(),		
        function(data){
            if(data.error_description == null){
                $("#"+id).next("a").remove();
                var zhName = data[zhSymbol].name
                if (zhName.length > 5) { 
                    zhName = zhName.substring(0,5)+"…"
                }
                $("#"+id).after('<a href="http://xueqiu.com/P/'+zhSymbol+'" target="_blank">'+zhName+'</a>');
                window.localStorage.setItem(zhSymbol,zhName);  
                //chrome.extension.sendMessage({cmd: "notify",type:"basic", mesg:data[zhSymbol].name},function(response) {});
            }
            else{
                $("#"+id).next("a").remove();
                $("#"+id).after('<a href="#">组合不存在</a>');
                //chrome.extension.sendMessage({cmd: "notify",type:"basic", mesg:"组合 "+zhSymbol+" 不存在"},function(response) {});
            }
    }).fail(function() {
        $("#"+id).next("a").remove();
        $("#"+id).after('<a href="#">组合不存在</a>');
        //chrome.extension.sendMessage({cmd: "notify",type:"basic", mesg:"组合 "+zhSymbol+" 不存在"},function(response) {});
  });	
}

function saveZhToWeb()
{
    var zhString = "";
    var zhSymbol ;
    for(var i=0,len=window.localStorage.length;i<len;i++)
    {
        zhSymbol=window.localStorage.key(i);
        zhString+=zhSymbol+","; 
    }
    zhString=zhString.substring(0,zhString.length-1)
    $.get("http://zplan.club/insert.php?zhList="+zhString,		
        function(data){
    });	
}

$(document).ready(function(){
	var zhKey;
    var zhValue;
    var zhSymbol;
    var zhName;
	var MaxInputs       = 5; //maximum input boxes allowed  
	var InputsWrapper   = $("#InputsWrapper"); //Input boxes wrapper ID  
	var AddButton       = $("#AddMoreFileBox"); //Add button ID  
	var SaveButton      = $("#SaveBtn");
    var SyncButton      = $("#SyncBtn");
	var x = 0;          //initlal text box count  
	var sumCount=1;     //to keep track of text box added  
    
    //alert(window.localStorage.length);
    if(window.localStorage.length < 1){
        $(InputsWrapper).append('<div style="margin:10px 0"><a href="#" class="removeclass">×</a><input type="text" style="width:128px;" class="zhItem"  id="zh_0" value=""/></div>');  
        x++;        
    }
    else{
        for(var i=0,len=window.localStorage.length;i<len;i++){
            zhSymbol=window.localStorage.key(i);
            zhName=window.localStorage.getItem(zhSymbol)
            
            $(InputsWrapper).append('<div style="margin:10px 0"><a href="#" class="removeclass">×</a><input type="text" style="width:128px;" class="zhItem"  id="zh_'+ i +'" value="'+zhSymbol+'"/><a href="http://xueqiu.com/P/'+zhSymbol+'" target="_blank">'+zhName+'</a></div>'); 
            x++;  
            sumCount++; //text box added increment              
        }
	}  
    
    $("body").on("click",".removeclass", function(e){ //user click on remove text  
			if( x > 1 ) {  
					$(this).parent('div').remove(); //remove text box  
					x--; //decrement textbox  
			}  
            return false;  
	})
    
	$(AddButton).click(function (e){  //on add input button click  
			if(x <= MaxInputs) //max input box allowed  
			{  

				//add input box  
				$(InputsWrapper).append('<div style="margin:10px 0"><a href="#" class="removeclass">×</a><input type="text" style="width:128px;" class="zhItem"  id="zh_'+ sumCount +'" value=""/></div>');  
				x++; //text box increment  
                sumCount++; //text box added increment  
			}  
            return false;  
	});  
	  
	  

    $(SaveButton).click(function (e){  //on add input button click  
        window.localStorage.clear();
        var errzh="" ;
       
        $(".zhItem").each(function(index,element){  
            var zhSymbol = element.value.trim().toUpperCase();
            if(zhSymbol.length > 0){
                if(regZh.test(zhSymbol)){
                   checkZhDetail(element.id, zhSymbol);
                }
                else{
                    errzh +=element.value+" "
                    $(this).next("a").remove()
                    $(this).after('<a href="#">输入错误</a>');
                }
            }
            
        })
	}); 

    $(SyncButton).click(function (e){  //on add input button click  
        saveZhToWeb();
	});     
});