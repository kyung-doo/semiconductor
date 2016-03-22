$(function(){
	var subClikedObj;
	var clickMenuNum=0;
	var isP4 = (window.location.host === 'localhost' || window.location.host === '127.0.0.1' ? false : true );
	/*20150710 이벤트 추가*/
	$(document).on("click",".selectCat_wrap .support-list-type>li>div>ul>li:has('ul')>a, .support-list-type a.noClick",function(){
		/*20150710 수정함*/
		if($(this).hasClass("noClick")){
			var catIndex=$(this).closest("ul").closest("li").index();
		}else{
			var catIndex=$(this).closest("ul").closest("li").index();
		}
		if(subClikedObj){
			$(".selectCat_wrap .support-list-type>li:eq("+catIndex+")>div>ul>li:has('ul')>a.on").removeClass("on");
			$(".selectCat_wrap .support-list-type>li:eq("+catIndex+")>div>ul>li:has('ul')>a+ul:visible").slideUp("fast");
		}
		if($(this).hasClass("noClick")) return false;
		/*20150710 수정함*/
		if($(this).next().css("display")!="block"){
			$(this).addClass("on");
			$(this).next().slideDown("fast");
		}
		subClikedObj=$(this);
		clickMenuNum=catIndex;
		return false;
	});

	var $productArea = $('div[data-tmpl="compCat1"]');
	var $typeArea = $('div[data-tmpl="compCat2"]');
	var $paramArea = $('div[data-tmpl="compCat3"]');
	var $valueArea = $('div[data-tmpl="compCat4"]');
	var $btnSearch = $('button[data-role="ui-btn-searchresult"]');
	
	var addActiveClass = function(obj){ 
		if(obj.closest('ul.inner_sub').length) obj.closest('ul.inner_sub').find('a').removeClass('active');
		obj.addClass('active').parent().siblings().find('>a').removeClass('active');
	}
	
	var removeDimmedClass = function(obj){
		if(_common.is_mode() != 'MOBILE') return false;
		
		obj.closest('li').find('a[data-role="ui-accordion-btn"]').removeClass("dimmed");
	}
	
	// STEP1
	$productArea.on('click', 'a', function(e){
		e.preventDefault();
		var $this = $(this);
		
		addActiveClass($this);
		
		if($this.data('iaid') && $this.parent().find('>ul').length === 0){
			removeDimmedClass($typeArea);
			$paramArea.empty();
			$valueArea.empty();
			$btnSearch.addClass('no_active');
			
			var options = {
				clear : true,
				param : {
					mType : 'json',
					iaId : $this.data('iaid')
				}
			};
			
			_common.makeTemplate('/semiconductor/' + SITE_CD + '/support/selection-tools/selectTypeSearchList', 'compCat2', options);
		}
	});
	
	// STEP2
	$typeArea.on('click', 'a', function(e){
		e.preventDefault();
		var $this = $(this);

		addActiveClass($this);
		
		if($this.data('iaid') && $this.parent().find('>ul').length === 0){
			removeDimmedClass($paramArea);
			$paramArea.empty();
			$valueArea.empty();
			$btnSearch.removeClass('no_active');
			
			var options = {
				clear : true,
				param : {
					mType : 'json',
					iaId : $this.data('iaid')
				}
			};
			
			_common.makeTemplate('/semiconductor/' + SITE_CD + '/support/selection-tools/selectParamSearchList', 'compCat3', options);
		}
	});
	
	// STEP3
	$paramArea.on('click', 'a', function(e){
		e.preventDefault();
		var $this = $(this);
		
		addActiveClass($this);
		
		if($this.data('paramid')){
			var options = {
				clear : true,
				param : {
					mType : 'json',
					iaId : $this.data('iaid'),
					paramId : $this.data('paramid')
				},
				callback : after_value,
				caller: $this
			};
			
			var boolSlide = $this.data('slide');
			var $scriptSlide = $('script[data-role="script-catalogueValue-slide"]');
			var $scriptCheckbox = $('script[data-role="script-catalogueValue-checkbox"]');
			
			if(boolSlide){
				$scriptCheckbox.removeAttr('id');
				$scriptSlide.attr('id', 'tmpl-compCat4-inner');
			}
			else{
				$scriptSlide.removeAttr('id');
				$scriptCheckbox.attr('id', 'tmpl-compCat4-inner');
			}

			if($this.data('slide')){
				_common.makeTemplate('/semiconductor/' + SITE_CD + '/support/selection-tools/selectSpecRangeSearchList', 'compCat4', options);
			}
			else{
				_common.makeTemplate('/semiconductor/' + SITE_CD + '/support/selection-tools/selectSpecSearchList', 'compCat4', options);
			}
		}
	});
});