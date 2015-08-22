
regZh=/^zh\d{6}$/; 
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
				FieldCount++; //text box added increment  
				//add input box  
				$(InputsWrapper).append('<div style="margin:10px 0"><input type="text" class="zhItem"  id="zh_'+ FieldCount +'" value=""/><a href="#" class="removeclass">×</a></div>');  
				x++; //text box increment  
			}  
            return false;  
	});  
	  
	  

    $(SaveButton).click(function (e){  //on add input button click  
        window.localStorage.clear();
        var errzh="" ;
        $(".zhItem").each(function(index,element){  
            var fdStart = element.value.trim().toLowerCase();
            if(fdStart.length > 0){
                if(regZh.test(fdStart)){
                   window.localStorage.setItem(index,fdStart);  
                }
                else{
                    errzh +=element.value+" "
                    
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