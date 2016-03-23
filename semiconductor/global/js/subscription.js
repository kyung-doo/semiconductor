$(document).ready(function(){
	
	function isValidsubscription() {
		
		$exitCheck = true;
		
		$alertArea = $(".alert-area", $("*[data-role=ui-accordion-content]"));
		$alertArea.hide();
		
		if($(".email-input").val() == "" || !CheckMail($(".email-input").val())){
			$(".email-input").val('');
			$(".email-input").focus();
			
			$alertArea.html("Please enter a valid Email Address");
			$alertArea.show();
			
			$exitCheck = false;
		    return false;
		}
		
		$("*[data-role=ui-accordion-content]").find('[type=checkbox]').each(function(){
			if(!$(this).prop("checked")) {
				$alertArea.html("Please check agreement box");
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
    
	
	$('*[data-role=ui-btn-subscription-email]').each(function(){
		$(this).unbind().bind({
			'click' : function () {
				if (isValidsubscription()) {
					subscriptionAjax();
				}
			}
		});
	});
	
	$(".email-input", $("*[data-role=ui-accordion-content]")).keypress(function (e){
		if(e.which==13){
			if (isValidsubscription()) {
				subscriptionAjax();
			};
		};
	});
	
	function subscriptionAjax() {
		
		$.ajax({
			url         :  'http://samsungsemiblog.com/subscribe/',
			data        :  {
								source : 'SamsungGlobal',
								email : $(".email-input").val()
							},
			dataType    : 'jsonp',
			jsonpCallback	: 'jsonpCallback',
			success     : function(data) {
				if(parseInt(data.success) === 1){
					_common.open_popup_layer('subscription');
				}
				else{
					_common.open_popup_layer('subscriptionerr');
					$('div[data-role="ui-layer-subscriptionerr"]').find('p.des').text(data.action);
				}
				
			},
			error       : function(xhr,st,err) {
				_common.open_popup_layer('subscriptionerr');
				$('div[data-role="ui-layer-subscriptionerr"]').find('p.des').text(err);
			}
		});
		
		// Omniture
		sendClickCode('content_click','subscribe:email address');
		
		// 초기화
		$("*[data-role=ui-accordion-content]").find($(".email-input")).val("");
		$("*[data-role=ui-accordion-content]").find($("#policy01")).attr("checked", false);
		$("*[data-role=ui-accordion-content]").find($("#policy02")).attr("checked", false);
	}
});