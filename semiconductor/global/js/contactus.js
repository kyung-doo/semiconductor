$(document).ready(function(){
	
	function isValidRequest(container) {
		$popoverContainer = container;
		
		$alertArea = $(".alert-area", $popoverContainer);
        $alertAreaP = $(".alert-area > P", $popoverContainer);
        
		$alertArea.hide();
        
		$exitCheck = true;
        
        if($("#email", $popoverContainer).val() == "" || !CheckMail($("#email", $popoverContainer).val())){
        	$alertAreaP.html(requestMsg.msg.txt_valid_email);
        	$alertArea.show();
        	$("#email", $popoverContainer).val('');
		    $("#email", $popoverContainer).focus();
		    $exitCheck = false;
		    return false;
		}
        
        if($("#firstName", $popoverContainer).val() == "") {
			$alertAreaP.html(requestMsg.msg.txt_valid1 +" "+$("#firstName", $popoverContainer).attr('data-label'));
			$alertArea.show();
			$("#firstName", $popoverContainer).focus();
			return false;
		}
        
        if($("#lastName", $popoverContainer).val() == "") {
			$alertAreaP.html(requestMsg.msg.txt_valid1 +" "+$("#lastName", $popoverContainer).attr('data-label'));
			$alertArea.show();
			$("#lastName", $popoverContainer).focus();
			return false;
		}
        
        if($("#jobType", $popoverContainer).val() == "") {
	    	$alertAreaP.html(requestMsg.msg.txt_valid2 +" "+$("#jobType", $popoverContainer).attr('data-label'));
			$alertArea.show();
			$("#jobType", $popoverContainer).focus();
			return false;
        }
        
        if($("#country", $popoverContainer).val() == "") {
	    	$alertAreaP.html(requestMsg.msg.txt_valid2 +" "+$("#country", $popoverContainer).attr('data-label'));
			$alertArea.show();
			$("#country", $popoverContainer).focus();
			return false;
        }
        
        if($("#message", $popoverContainer).val() == ""){
        	$alertAreaP.html(requestMsg.msg.txt_valid1+" "+ $("#message", $popoverContainer).attr('data-label'));
    		$alertArea.show();
    		$("#message", $popoverContainer).focus();
    		return false;
    	} else if(($("#message", $popoverContainer).val()).length > 2000) {
    		$alertAreaP.html(requestMsg.msg.txt_valid_message);
    		$alertAreaP.show();
    		$("#message", $popoverContainer).focus();
    		return false;
    	}
        
        $("input[type=checkbox]", $popoverContainer).each(function(){
        	if(!$(this).prop("checked")  && $(this).attr("class") == "must"){
        		$alertAreaP.html(requestMsg.msg.txt_checkbox_agree);
        		$alertArea.show();
        		$exitCheck = false;
        		return false;
        	}
        });
        
        if(!$exitCheck) return false;
        
        
        return true;
        
	}
	
    // Email validation
    function CheckMail(strMail) {
        var check1 = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/; 
        var check2 = /^[a-zA-Z0-9\-\.\_]+\@[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,4})$/; 
        if ( !check1.test(strMail) && check2.test(strMail) ) { 
            return true; 
        } else { 
            return false; 
        } 
    }
    
    // Phone Number validation
    function phoneNumber(number) {
    	numberValue = number.replace(/\+/g, '').replace(/-/g, '');
        var check = /^[-0-9]*$/;
        if ( !check.test(numberValue)) { 
            return false; 
        } else {
            return true; 
        } 
    }
	
	// Contact us submit button Event
	$("[data-role=ui-layer-email]").find($('*[data-role=ui-btn-submit]')).each(function () {
		$(this).unbind().bind({
			'click':function(){
				var $dataRoleEmail = $("[data-role=ui-layer-email]");
				
				if(isValidRequest($dataRoleEmail)){
					
					$("#product option:selected").val($("#product option:selected").text());
					$("#productSub option:selected").val($("#productSub option:selected").text());
					
					var $submitForm = $('#' + $dataRoleEmail.find('form').attr('id'));
					var $completeLayer = $("*[data-role=ui-layer-ebc]");
					
					if(document.location.host ==="www.samsung.com"){
						url = "https://www.samsung.com/semiconductor/"+GLOBAL_SITE_CODE+"/contact-us/send";
					} else if(document.location.host ==="origin2.samsung.com"){
						url = "https://origin2.samsung.com/semiconductor/"+GLOBAL_SITE_CODE+"/contact-us/send";
					} else {
						url = "/semiconductor/"+GLOBAL_SITE_CODE+"/contact-us/send";
					}
			    	
			    	$.ajax({
			            type        : 'POST',
			            url         :  url,
			            data        : $($submitForm, $dataRoleEmail).serializeArray(),
			            dataType    : 'json',
			            success     : function(data,st) {
			            },
			            error       : function(xhr,st,err) {
			            },
			            beforeSend  : function(xhr) {
			            },
			            complete    : function(xhr, textStatus) {
			            }
			        });
					
			    	compLayerPopup($dataRoleEmail, $completeLayer, $submitForm);
			    	
			        return false;
				}
			}
		});
	});
	
	// Contact us submit - Complete popup call
    function compLayerPopup(container, completeLayer, form){

    	// 1. Contact us form reset
    	form[0].reset();
    	
    	// 2. Contact us form close
    	$('*[data-role=ui-layer-email]').find('a.btn-close').trigger('click');    	
    	
    	// 3. Product of Interest (productSub 초기화)
    	container.find($('#product > option:eq(0)')).trigger('change')
    	
    	// 4. Complete popup call
 		$(this).data('manager', new LayerCommonUI(completeLayer));
 		(function(manager){
			manager._container.removeClass('pop-wrap');
 		}($(this).data('manager')));
    }
    
});