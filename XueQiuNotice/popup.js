
regZh=/^ZH\d{6}$/;  
function getZhDetail(id, zhCode)
{
    $.get("http://xueqiu.com/cubes/quote.json?code="+zhCode+"&return_hasexist=false&_="+new Date().getTime(),		
        function(data){
            if(data.error_description == null){
                $("#"+id).next("a").remove();
                $("#"+id).after('<a href="http://xueqiu.com/P/'+zhCode+'" target="_blank">'+data[zhCode].name+'</a>');
                //chrome.extension.sendMessage({cmd: "notify",type:"basic", mesg:data[zhCode].name},function(response) {});
            }
            else{
                $("#"+id).next("a").remove();
                $("#"+id).after('<a href="#">不存在</a>');
                //chrome.extension.sendMessage({cmd: "notify",type:"basic", mesg:"组合 "+zhCode+" 不存在"},function(response) {});
            }
    }).fail(function() {
        $("#"+id).next("a").remove();
        $("#"+id).after('<a href="#">不存在</a>');
        //chrome.extension.sendMessage({cmd: "notify",type:"basic", mesg:"组合 "+zhCode+" 不存在"},function(response) {});
  });	
}

function checkZhDetail(index, zhCode)
{
    $.get("http://xueqiu.com/cubes/quote.json?code="+zhCode+"&return_hasexist=false&_="+new Date().getTime(),		
        function(data){
            if(data.error_description == null){
                $("#zh_"+index).next("a").remove();
                $("#zh_"+index).after('<a href="http://xueqiu.com/P/'+zhCode+'" target="_blank">'+data[zhCode].name+'</a>');
                window.localStorage.setItem(index,zhCode);  
                //chrome.extension.sendMessage({cmd: "notify",type:"basic", mesg:data[zhCode].name},function(response) {});
            }
            else{
                $("#zh_"+index).next("a").remove();
                $("#zh_"+index).after('<a href="#">不存在</a>');
                //chrome.extension.sendMessage({cmd: "notify",type:"basic", mesg:"组合 "+zhCode+" 不存在"},function(response) {});
            }
    }).fail(function() {
        $("#zh_"+index).next("a").remove();
        $("#zh_"+index).after('<a href="#">不存在</a>');
        //chrome.extension.sendMessage({cmd: "notify",type:"basic", mesg:"组合 "+zhCode+" 不存在"},function(response) {});
  });	
}

$(document).ready(function(){
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
        $(InputsWrapper).append('<div style="margin:10px 0"><a href="#" class="removeclass">×</a><input type="text" style="width:128px;" class="zhItem"  id="zh_0" value=""/></div>');  
        x++;        
    }
    else{
        for(var i=0,len=window.localStorage.length;i<len;i++){
            zhKey=window.localStorage.key(i);
            zhValue=window.localStorage.getItem(zhKey)
            
            $(InputsWrapper).append('<div style="margin:10px 0"><a href="#" class="removeclass">×</a><input type="text" style="width:128px;" class="zhItem"  id="zh_'+ zhKey +'" value="'+zhValue+'"/></div>'); 
            getZhDetail("zh_"+ zhKey, zhValue)
            x++;            
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
				$(InputsWrapper).append('<div style="margin:10px 0"><a href="#" class="removeclass">×</a><input type="text" style="width:128px;" class="zhItem"  id="zh_'+ FieldCount +'" value=""/></div>');  
				x++; //text box increment  
                FieldCount++; //text box added increment  
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
                   checkZhDetail(index, zhSymbol);
                }
                else{
                    errzh +=element.value+" "
                    $("#"+id).next("a").remove()
                    $(this).after('<a href="#">错误</a>');
                }
            }
            
        })
        if(errzh !="" ){
            alert("组合代码："+errzh+",输入错误！")
        }
        //$.each($(".zhItem"), function(i,val){  
        //    window.localStorage.setItem(index,element.value);  
        //});  
	});      
});