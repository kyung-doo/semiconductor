var catalogueCompare = [] // 비교값 저장
var selectData = {} // 선택된 파라미터값 저장
var excelParamSet = {} // excel export 파라미터값 저장
var parameterIdx = null;  // parameter 에서 active  index

/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){
	init_mode();
	init_scripts();
	init_flick();
	init_jump();
	init_layer_compare();
	init_event();
	binding_resources();
	init_selection_tool();
	init_view();
};

/********************************************************************************************************
 * METHOD: INIT_SCRIPTS
 ********************************************************************************************************/
function init_scripts(){
	$.getScript('/semiconductor/common/js/lib/jquery.dataTables.js')
		.done(function( script, textStatus ) {
			$.getScript('/semiconductor/common/js/lib/dataTables.fixedColumns.js');
		});	

	$.getScript('/semiconductor/common/js/lib/jquery-ui.js');
};

/********************************************************************************************************
 * METHOD:MODE
 ********************************************************************************************************/
function init_mode() {
	var owner = this;
	
	// 1. init
	owner.change_img(_common.is_mode());
	owner.change_kv(_common.is_mode());
	owner.change_feature_img();

	// 2. resize
	$(window).bind({
		'resize' : function() {
			var mode = _common.is_mode();
			owner.change_kv(mode);
			owner.change_img(mode);
			owner.change_feature_img();
		}
	});
};

/********************************************************************************************************
 * METHOD:CHANGE_IMG
 ********************************************************************************************************/
function change_img(mode) {
	var img_url = '';
	$('img.responsive').each(function() {
		var $this = $(this);
		
		switch(String(mode).toUpperCase()) {
			case 'MOBILE':
				img_url = $this.attr('data-media-mobile');
				break;
			case 'PC':
			case 'TABLET_B':
			case 'TABLET_A':
				img_url = $this.attr('data-media-desktop');
				break;
		};
		
		$this.attr('src', img_url);
	});
};

/********************************************************************************************************
 * METHOD:CHANGE_KV
 ********************************************************************************************************/
function change_kv(mode) {
	var img_url = '';
	
	$('div.key-visual li').each(function(){
		$("img", $(this)).	each(function(){
			var $this = $(this);
							
			switch(String(mode).toUpperCase()) {
				case 'MOBILE':
					img_url = $this.attr('data-media-mobile');
					$(this).removeClass('kv_desktop').addClass('kv_mobile');
					break;
				case 'PC':
				case 'TABLET_B':
				case 'TABLET_A':
					img_url = $this.attr('data-media-desktop');
					$(this).removeClass('kv_mobile').addClass('kv_desktop');
					break;
			};
			
			$this.attr('src', img_url);
				
		});
	});
};

/****************************************************************************************
* METHOD:RESPONSIVE FEATURE IMAGE
****************************************************************************************/
function change_feature_img() {
	var mode = '';
	var w = window.innerWidth;

	if (navigator.userAgent.indexOf('MSIE 7.0') !== -1 || navigator.userAgent.indexOf('MSIE 8.0') !== -1) {
		w = $(window).width();
	}

	if (w <= 479) {
		mode = 'MOBILE';
	} else if (w > 479 && w <= 767) {
		mode = 'TABLET_A';
	} else if (w > 767 && w <= 1023) {
		mode = 'TABLET_B';
	} else if (w > 1023) {
		mode = 'PC';
	}

	$('.feature-module').find('img.responsive-image').each(function() {
		var $this = $(this);
		var img_url = '';
		var type = $this.data('type');

		if (type == 'type1') {
			switch(String(mode).toUpperCase()) {
				case 'MOBILE':
				case 'TABLET_B':
					img_url = $this.attr('data-media-mobile');
					break;
				case 'TABLET_A':
				case 'PC':
					img_url = $this.attr('data-media-desktop');
					break;
			};
		} else if (type == 'type2') {
			switch(String(mode).toUpperCase()) {
				case 'MOBILE':
				case 'TABLET_A':
				case 'TABLET_B':
					img_url = $this.attr('data-media-mobile');
					break;

				case 'PC':
					img_url = $this.attr('data-media-desktop');
					break;
			};
		} else if (type == 'type3') {
			switch(String(mode).toUpperCase()) {
				case 'MOBILE':
				case 'TABLET_A':
					img_url = $this.attr('data-media-mobile');
					break;
				case 'TABLET_B':
				case 'PC':
					img_url = $this.attr('data-media-desktop');
					break;
			};
		}
		// HTML
		else {
			switch(String(mode).toUpperCase()) {
				case 'MOBILE':
				case 'TABLET_A':
				case 'TABLET_B':
					img_url = $this.attr('data-media-tablet-portrait');
					break;

				case 'PC':
					img_url = $this.attr('data-media-desktop');
					break;
			};
		}

		$this.addClass('lazy');
		$this.attr('data-original', img_url);
	});
}

/********************************************************************************************************
 * METHOD:FLICK, SLIDE.BLOCK
 ********************************************************************************************************/
function init_flick(){
	$('*[data-role=ui-flick]').each(function(){
		$(this).data('flick',new FlickUI($(this),{'auto':true}));
		
		(function(flick){
			var owner=flick;
			flick.auto_btn=$('*[data-role=ui-flick-auto]');
			
			flick.auto_btn.bind({
				'click':function(){
					var $this = $(this);
					
					if($this.hasClass('pause')){
						$this.attr('class', 'play');
						$this.find('span').text(messageType01[SITE_CD].flickUI.button_play);
						owner._flag.auto=false;
						owner.stop_autoplay();
					}else{
						$this.attr('class', 'pause');
						$this.find('span').text(messageType01[SITE_CD].flickUI.button_pause);
						owner._flag.auto=true;
						owner.autoplay();
					}
				}
			});
		}($(this).data('flick')));
	});
};

/****************************************************************************************
* METHOD:JUMP
****************************************************************************************/
function init_jump() {
	$('*[data-role=ui-jump]').each(function() {
		$(this).data('jump', new JumpUI($(this)));
	});
}

/****************************************************************************************
* METHOD:JUMP BASIC
****************************************************************************************/
function init_jump_basic(){
	$('*[data-role=ui-jump-basic]').each(function(){
		$(this).data('jumpBasic',new JumpBasicUI($(this), {
			desktop: $('.filter-by-area.desktop-area'),
			mobile: $('.filter-by-area.mobile-area')
		}));
	});
	
	$('*[data-role=ui-jump-filter-filterby], *[data-role=ui-jump-filter-sortby]').on('click', function(e){
		var mode = _common.is_mode();
		var target = null;
		var target_button = null;
		
		if (mode == 'MOBILE') {
			target = $('.filter-by-area.mobile-area');
			target_button = target.find('.filterby'); 
		}
		else {
			target = $('.filter-by-area.desktop-area');
			target_button = target.find('.btn-filterby');
		}
		
		var pos = target.offset().top;
		$('html,body').stop().animate({'scrollTop':pos+'px'},700);
		
		if (target_button.hasClass('link-toggled')) {
			target_button.click();
		}

		e.preventDefault();
	});
}

/****************************************************************************************
* METHOD:LAYER COMPARE
****************************************************************************************/
function init_layer_compare() {
	$('button[data-role=ui-btn-compare]').click(function(){
		if (catalogueCompare.length > 1)
		{
			catalogueCompare.sort();
			_common.open_popup_layer('compare');
			drawCompareTable();
			
		}else{
			_common.open_popup_layer('compare');
			$("*[data-tmpl=catalogueCompare]").html("Please check the comparison item if you want to data comparison.");
		}		
	});
}

/****************************************************************************************
* METHOD:AFTER COMPARE
****************************************************************************************/
function after_compare(data){
	var compareTable = $('table.CompareResult').DataTable( {
		scrollX:        true,
		scrollCollapse: true,
		paging:         false,
		searching: false,
		info:false,
		retrieve: true
	} );

	new $.fn.dataTable.FixedColumns(compareTable, {"leftColumns":1});
}

/********************************************************************************************************
 * METHOD: OPEN NEXT STEP
 ********************************************************************************************************/
function open_next_step(accordionBtn){
	if(_common.is_mode() != 'MOBILE') return false;
	
	var $this = accordionBtn;
	var $scope = $this.closest('ul[data-role=ui-accordion]');
	var $accordionBtns = $scope.find('a[data-role=ui-accordion-btn]');
	var $contents = $scope.find('div[data-role=ui-accordion-content]');
	var $thisContent = $this.closest('div[data-role=ui-accordion-content]');
	var accordionIdx = $accordionBtns.index($thisContent.prev());
	var $thisAccordionBtn = $accordionBtns.eq(accordionIdx);
	var contentIdx = $contents.index($thisContent);
	var $nextAccordionBtn = $accordionBtns.eq(accordionIdx + 1);
	var $nextContent = $contents.eq(contentIdx + 1);
	
	$thisAccordionBtn.removeClass('expanded').addClass('closed');
	$thisContent.removeClass('active').stop().slideUp(_common._transition_speed, function(){
		
		$nextAccordionBtn.removeClass('closed dimmed').addClass('expanded');
		$nextContent.addClass('active').stop().slideDown(_common._transition_speed);
		
	});
}

/********************************************************************************************************
 * METHOD: AFTER VALUE
 ********************************************************************************************************/
function after_value(data, caller){
	if(caller.data('slide')){
		
		var values_length = data.parameterValueList.length;
	
		var valuesHeight = Math.round(190/values_length ) + Math.round((190/(values_length -1))/values_length );
		$(".sliderLabel li").css({height : valuesHeight});
	
		//NOTIC :: vertical slider 는 그래프의 아래가 가장 작은 값을 갖는다
	    var slider = $("#sliderRange").slider({
	        orientation: "vertical",
			range: true,
			min: 0,
	        max:(values_length -1),
	        values: [0, values_length -1],
	        slide: function(event, ui) {},
	        change: function(event, ui) { 
			   var startParam = data.parameterValueList[(values_length -1)-slider.slider('values', 1)].paramSpecVal;
			   var endParam = data.parameterValueList[(values_length -1)-slider.slider('values', 0)].paramSpecVal;
			   $(".sliderChk > p > em").html(startParam + " <span>~</span> " + endParam);
			   $('button[data-role=ui-btn-addparameter]').data('startvalue', startParam).data('endvalue', endParam);
	        }
	    });
	    
	}
    if(typeof caller != 'undefined'){
    	checkSelectData($(caller).data('paramid'), $(caller).data('slide'), data);
    }
}

/********************************************************************************************************
 * METHOD: INIT EVENT
 ********************************************************************************************************/
function init_event(){
	$('button[data-role=ui-btn-searchresult]').click(function(){
		getParamValue();
		catalogueCompare = [];
		
		var p_product = $('div[data-tmpl="compCat1"]').find('a.active').text();
		var p_type = $('div[data-tmpl="compCat2"]').find('a.active').text();
		
		sendClickCode('spt_search_success','selection tools:search:' + p_product.replace(/[^\w\s]/gi, '').toLowerCase() + '_' + p_type.replace(/[^\w\s]/gi, '').toLowerCase());
	});
	
	$('div[data-tmpl="compCat1"], div[data-tmpl="compCat2"]').on('click', 'a', function(e){
		$('a[data-role="btn-clear-all-param"]').click();
	});
	
	$('div[data-tmpl=compCat4]').on('click', 'input[type=checkbox]', function(e){
		var $btnParam = $('ul[data-role=ui-area-parameter]').find('a.active');
		var param = $btnParam.data('paramid');
		
		selectData[param] = {
				'name' : param,
				'dispName' : $btnParam.text(),
				'slide' : false,
				'values' : []
			};
		
		$checkedCheckboxs = $('div[data-tmpl=compCat4]').find('input[type=checkbox]:checked');
		
		$.each($checkedCheckboxs, function(idx, val){
			var temp = {
					'value' : $(this).val()
					
			}
			selectData[param].values.push(temp);
			
		});

		drawSelectData();
	});
	
	$('div[data-tmpl=compCat4]').on('click', 'button[data-role=ui-btn-addparameter]', function(e){
		e.preventDefault();
		
		var $btnParam = $('ul[data-role=ui-area-parameter]').find('a.active');
		var param = $btnParam.data('paramid');
		var startValue = $(this).data('startvalue');
		var endValue = $(this).data('endvalue');
		
		if(!startValue || !endValue) return false;
			
		selectData[param] = {
								'name' : param,
								'dispName' : $btnParam.text(),
								'slide' : true,
								'values' : []
							};
		
		var $btnAdd = $('button[data-role=ui-btn-addparameter]');
		var startValue = $btnAdd.data('startvalue');
		var endValue = $btnAdd.data('endvalue');
		
		var temp = {
				'startValue' : startValue,
				'endValue' : endValue
				
		}
		selectData[param].values.push(temp);
		
		drawSelectData();
	});
	
	$('a[data-role=btn-clear-all-param]').click(function(){
		var $btnDeletes = $('div[data-role=ui-filter-result-param]').find('a[data-role=btn-close-word]');
		
		$.each($btnDeletes, function(){
			deleteSelectData($(this));
		});
	});
	
	$('div[data-role=ui-filter-result-param]').on('click', 'a[data-role=btn-close-word]', function(){
		deleteSelectData($(this));
	});
	
	$('button[data-role="ui-btn-export"]').click(function(e){
		sendClickCode('content_click','catalogue:export');
		
		window.location.href = '/semiconductor/' + SITE_CD + '/application/selectionToolResultListExcel?' + $.param(excelParamSet);
	});
	
	$('div[data-role="ui-area-related-link"]').on('click', 'a.btn.link', function(){
		sendClickCode('content_click', 'related links');
	});
}

/****************************************************************************************
* METHOD: DRAW SELECT DATA
****************************************************************************************/
function drawSelectData(){
	 var html = '';
	 
	 $.each(selectData, function(idx, val){
		 if(val.values.length < 1) return true;
		 
		 var temp = '';
		 var tempStartValue = '';
		 var tempEndValue = '';
		 
		 var temp = '';
		 $.each(val.values, function(j, v){
			if(val.slide){
				temp += v.startValue;
				temp += ' ~ ';
				temp += v.endValue;
				
				tempStartValue = v.startValue;
				tempEndValue = v.endValue;
			} 
			else{
				html += '<span class="word">' + val.dispName;
				html += '	<em>' + v.value + '</em>';
				html += '	<a href="javascript:void(0);" class="btn-close" data-role="btn-close-word" data-param="' + val.name + '" data-slide="' + val.slide + '" data-value="' + v.value + '">';
				html += '		<span class="blind">Close</span>';
				html += '	</a>';
				html += '</span>';
			}
		 });
		 
		 if(val.slide){
			 html += '<span class="word">' + val.dispName;
			 html += '	<em>' + temp + '</em>';
			 html += '	<a href="javascript:void(0);" class="btn-close" data-role="btn-close-word" data-param="' + val.name + '" data-slide="' + val.slide + '" data-startvalue="' + tempStartValue + '" data-endvalue="' + tempEndValue + '">';
			 html += '		<span class="blind">Close</span>';
			 html += '	</a>';
			 html += '</span>';
		 }
	 });
	 
	 if(html.length > 0){
		 $('div[data-role=ui-filter-result-param]').empty().append(html);
		 $('a[data-role=btn-clear-all-param]').show();
	 }
	 else{
		 $('div[data-role=ui-filter-result-param]').empty();
		 $('a[data-role=btn-clear-all-param]').hide();
	 }
}

/****************************************************************************************
* METHOD: DELETE SELECT DATA
****************************************************************************************/
function deleteSelectData($btnDelete){
	var param = $btnDelete.data('param');
	var isSlide = $btnDelete.data('slide');
	var value = '';
	
	if(!isSlide) value = $btnDelete.data('value');
	
	var data = selectData[param].values;
	var $this = $(this);
	
	if(isSlide){
		$('div[data-tmpl=compCat4]').find('button[data-role=ui-btn-addparameter]').prev().html('<em></em>');
		selectData[param].values = [];
	}
	else{
		$('div[data-tmpl=compCat4]').find('input[type="checkbox"][value="' + value + '"]').prop('checked', false);
		
		var temp_value = new Array();
		
		$.each(selectData[param].values, function(idx, val){
			if(val.value != value) temp_value.push(val);
		});
		
		selectData[param].values = temp_value;
	}
	
	drawSelectData();
}

/****************************************************************************************
* METHOD: CHECK SELECT DATA
****************************************************************************************/
function checkSelectData(param, isSlide, data){

	if(isSlide){
		if(typeof selectData[param] != 'undefined'){
			if(selectData[param].values.length < 1) return false;
			
			data = data.parameterValueList;
			
			var startValueIdx = 0;
			var endValueIdx = 0;
			
			var values_length = data.length;
			
			$.each(data, function(idx, val){
				if(val.paramSpecVal == selectData[param].values[0].startValue) endValueIdx = ((values_length -1) - idx);
				if(val.paramSpecVal == selectData[param].values[0].endValue) startValueIdx = ((values_length -1) - idx);
			});
			
			var valuesHeight = Math.round(190/values_length ) + Math.round((190/(values_length -1))/values_length );
			$(".sliderLabel li").css({height : valuesHeight});
			
			var slider = $("#sliderRange").slider({
		        orientation: "vertical",
				range: true,
				min: 0,
		        max:(values_length -1),
		        values: [startValueIdx, endValueIdx],
		        slide: function(event, ui) {},
		        change: function(event, ui) { 
		        	var startParam = data[(values_length -1)-slider.slider('values', 1)].paramSpecVal;
		        	var endParam = data[(values_length -1)-slider.slider('values', 0)].paramSpecVal;
		        	$(".sliderChk > p > em").html(startParam + " <span>~</span> " + endParam);
		        	$('button[data-role=ui-btn-addparameter]').data('startvalue', startParam).data('endvalue', endParam);
		        }
		    });
		}
	}
	else{
		var $checkboxs = $('div[data-tmpl=compCat4]').find('input[type=checkbox]');
		
		if(typeof selectData[param] != 'undefined'){
			$.each($checkboxs, function(i, vi){
				$.each(selectData[param].values, function(j, vj){
					if(vi.value == vj.value){
						vi.checked = true;
					}
				})
			});
		}
	}
}

/****************************************************************************************
* METHOD:BINDING
****************************************************************************************/
function binding_resources(){
	$('button[data-role=ui-btn-news]').click(function(){
		var $news = $('div[data-tmpl="news"]');
		var startNum = $news.find('>div.grid-col4').length + 1;
		
		var options = {
			param : {
				mType : 'json',
				iaId : GLOBAL_IA_ID,
				startIndex : startNum,
				endIndex : $(this).data('cnt')
				
			},
			callback:function(){ 
				$('img[data-cdn="img"]:not(.lazy)').each(function(){
					$(this).attr('src', $(this).data('original'));
				});
			}
		}
		_common.makeTemplate('/semiconductor/' + SITE_CD + '/application/selectRelatedProductList', 'news',options);
		$(this).hide().parents('.article-txt').addClass('active');
	});
}

/****************************************************************************************
* METHOD:SELECTION TOOL
****************************************************************************************/
function init_selection_tool(){
	var subClikedObj;
	var clickMenuNum=0;
	/*20150710 이벤트 추가*/
	$(document).on("click",".selectCat_wrap .support-list-type>li>div>ul>li:has('ul')>a,.support-list-type a.noClick",function(){
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
		//obj.addClass('active').parent().siblings().find('>a').removeClass('active');
		//start: 20150710 수정 부분
		if(obj.closest(".inner_sub").hasClass("inner_sub")){
			if(!obj.next().prop("tagName")) obj.closest(".inner_sub").find('a.active').removeClass('active');
		}else{
			obj.closest("ul").find("li>a.active").removeClass('active');
		}
		if(!obj.next().prop("tagName"))obj.addClass('active');
		//end: 20150710 수정 부분
	}
	
	var removeDimmedClass = function(obj){
		if(_common.is_mode() != 'MOBILE') return false;
		
		obj.closest('li').find('a[data-role="ui-accordion-btn"]').removeClass("dimmed");
	}
	
	// STEP1
	$productArea.on('click', 'a', function(e){
		e.preventDefault();
		var $this = $(this);
		if($this.data('iaid') && $this.parent().find('>ul').length === 0){
			addActiveClass($this);
			removeDimmedClass($typeArea);
			$paramArea.empty();
			$valueArea.empty();
			$btnSearch.addClass('no_active');
			
			var options = {
				clear : true,
				param : {
					mType : 'json',
					typeIaid : GLOBAL_IA_ID,
					iaId : $this.data('iaid')
				}
			};
			
			_common.makeTemplate('/semiconductor/' + SITE_CD + '/application/selectSelectionToolTypeList', 'compCat2', options);
		}
	});
	
	// STEP2
	$typeArea.on('click', 'a', function(e){
		e.preventDefault();
		var $this = $(this);

		if($this.data('iaid') && $this.parent().find('>ul').length === 0){
			addActiveClass($this);
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
			
			_common.makeTemplate('/semiconductor/' + SITE_CD + '/application/selectSelectionToolParamAttributeList', 'compCat3', options);
		}
	});
	
	// STEP3
	$paramArea.on('click', 'a', function(e){
		e.preventDefault();
		var $this = $(this);
		var p_iaid = $typeArea.find('a.active').data('iaid');
		
		if($this.data('paramid')){
			addActiveClass($this);
			
			var options = {
				clear : true,
				param : {
					mType : 'json',
					iaId : p_iaid,
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

			_common.makeTemplate('/semiconductor/' + SITE_CD + '/application/selectSelectionToolParamValueList', 'compCat4', options);
		}
	});
}

/********************************************************************************************************
 * METHOD: GET PARAM VALUE
 ********************************************************************************************************/
function getParamValue(){
	var p_specValList = {};
	var p_resultArray = new Array();
	var cnt = 0;
	
	$.each(selectData, function(idx, val){
		var sub_val = [];
		var isSlide = val.slide;
		var cntVal = 0;
		
		$.each(val.values, function(idx_2, val_2){
			if(isSlide){
				sub_val.push(val_2.startValue);
				sub_val.push(val_2.endValue);
			}
			else{
				sub_val.push(val_2.value);
			}
			
			cnt++;
			cntVal++;
		});
		
		var tempVal = {
			"paramId" : val.name,
			"rangeUseFl" : isSlide ? "Y" : "N",
			"values" : sub_val
		}
		if(cntVal > 0)	p_resultArray.push(tempVal);
	});
	
	p_specValList['paramValList'] = p_resultArray;
	
	if(cnt === 0){
		getCatalogueResult();
	}
	else{
		getCatalogueResult(JSON.stringify(p_specValList));
	}
}

/********************************************************************************************************
 * METHOD: GET CATALOGUE RESULT
 ********************************************************************************************************/
function getCatalogueResult(p_specValList){
	var p_typeIaId = $('div[data-tmpl="compCat2"]').find('a.active').data('iaid');
	var arg = {
		'iaId' : GLOBAL_IA_ID,
		'typeIaid' : p_typeIaId,
		'mType' : 'json'
	}
	
	if(p_specValList !== undefined){
		$.extend(arg, {'paramVal' : p_specValList});
	}
	
	$.getJSON('/semiconductor/' + SITE_CD + '/application/selectSelectionToolResultList', arg, function(data){
		
		var $areaResultBtn = $('p.resultList-btns');
		var $areaNoResult = $('.module.no-result-area');
		var $areaResultFor = $('p.sec-title2');
		
		var $productArea = $('div[data-tmpl="compCat1"]');
		var $typeArea = $('div[data-tmpl="compCat2"]');
		var resultForTxt = '';
		
		if(!$productArea.find('li>a.active').closest('ul').hasClass('inner_sub')){
			resultForTxt += $productArea.find('li>a.active').closest('ul').parent().find('>a').text() + ' > ';
		}
		
		resultForTxt += $productArea.find('li>a.active').text();
		
		if(!$typeArea.find('li>a.active').closest('ul').hasClass('inner_sub')){
			resultForTxt += ' > ' + $typeArea.find('li>a.active').closest('ul').parent().find('>a').text();
		}
		
		if(!$typeArea.find('li>a.active').data('classNull')){
			resultForTxt += ' > ' + $typeArea.find('li>a.active').text();
		}
		
		if(data.SelectionToolResultList.length){
			drawResultTable(data);
			$areaResultBtn.show();
			$areaResultFor.show().find('span[data-role="ui-title-resultfor"]').text(resultForTxt);
			$areaNoResult.hide();
		}
		else{
			$('div[data-tmpl="selectionToolList"]').empty();
			$areaResultBtn.hide();
			$areaResultFor.hide();
			$areaNoResult.show();
		}
		
	});
	
	excelParamSet = arg;
	excelParamSet.mType = 'excel';
}

/********************************************************************************************************
 * METHOD: DRAW RESULT TABLE
 ********************************************************************************************************/
function drawResultTable(data){
	var html = '';
	html += '<table class="catalogueList tableType1">';
	html += '	<thead>';
	html += '		<tr>';
	html += '			<th></th>';
	html += '			<th><span>' + messageType01[SITE_CD].catalogue.partnumber + '</span></th>';
	
	$.each(data.SelectionToolTitleList, function(idx, val){
		var isSlide = val.paramRangeUseFl == 'Y' ? true : false;
			
	html += '			<th data-paramId="' + val.paramId + '" data-slide="' + isSlide + '"><span>' + val.paramDispNm + '</span></th>';
	
	});
		
	html += '		</tr>';
	html += '	</thead>';
	html += '	<tbody>';

	var idx = 0;
	
	var arrPrdId = new Array();
	
	$.each(data.SelectionToolResultList, function(idx, val){
		arrPrdId.push(val.prdId);
	});
	
	var getUniqueArray = function(arrayData){
		var u = {}, a = [];
		for(var i = 0, l = arrayData.length; i < l; ++i){
			if(u.hasOwnProperty(arrayData[i])) {
				continue;
			}
			a.push(arrayData[i]);
			u[arrayData[i]] = 1;
		}
		return a;
	}

	var uniquePrdIdList = getUniqueArray(arrPrdId);
	
	$.each(uniquePrdIdList, function(idx, val){
		
	
	html += '		<tr data-idx="' + idx + '">';
	html += '			<td><span><input type="checkbox" name="catalogueResult' + idx + '" id="catalogueResult' + idx + '" /><label for="catalogueResult' + idx + '"></label></span></td>';
	
		$.each(data.SelectionToolResultList, function(idx_2, val_2){
			if(val == val_2.prdId){
	html += '			<td><span><a href="' + val_2.prdUrl + '" onclick="sendClickCode(\'finding_method\', \'selection tool\');">' + val_2.partno + '</a></span></td>';
				return false;
			}
		});
	
		$.each(data.SelectionToolTitleList, function(idx_2, val_2){
			$.each(data.SelectionToolResultList, function(idx_3, val_3){
				if(val_3.prdId == val && val_3.paramId == val_2.paramId){
						
	html += '			<td><span>' + (val_3.specVal || ' ') + '</span></td>';
					
				}
			});
		});
	
	html += '		</tr>';
	
	});

	html += '	</tbody>';
	html += '</table>';
	
	var $target = $('div[data-tmpl="selectionToolList"]');
	
	$target.empty().append($(html));
	
	after_catalogue();
}

/********************************************************************************************************
 * METHOD: AFTER CATALOGUE
 ********************************************************************************************************/
function after_catalogue(){
	
	$('table.catalogueList').find('tbody').find('tr').each(function(idx, val){
		var $this = $(this);
		
		$this.data('idx', idx);
	});
	
	$('table[data-role="ui-tbl-cataloguelist"]').remove();
	$('body').append($('table.catalogueList').clone().attr('id', 'tbl_catalogueList').attr('data-role', 'ui-tbl-cataloguelist').removeAttr('class').hide());
	
	var table = $('table.catalogueList').DataTable( {
		scrollX:        true,
		scrollCollapse: true,
		paging:         false,
		searching: false,
		info:false,
		retrieve: true,
		columnDefs: [{ "orderable": false, "targets": 0 }] //첫번째 컬럼 정렬기능 제거
	} );

	new $.fn.dataTable.FixedColumns(table, {"leftColumns":2});

	$(window).resize();
	selectToComapre();
}

/********************************************************************************************************
 * METHOD: SELECT TO COMPARE
 ********************************************************************************************************/
function selectToComapre(){
	$("label", $('table.catalogueList')).click(function(){
		var thisId = $(this).attr("for");	
		var thisIdx = thisId.split("catalogueResult");

		if ($("input#"+ thisId, $('table.catalogueList.DTFC_Cloned')).is(":checked")){
			
			$("input#"+ thisId).attr("checked", false);
				
			$("label[for="+ thisId + "]").css({
				"background":"#fff",
				"border":"1px solid #ccc"
			});

			/*ie8 에서 array 의 indexOf 를 지원하지 않아서 넣음*/
			if (!Array.indexOf) {
			  Array.prototype.indexOf = function (obj, start) {
				for (var i = (start || 0); i < this.length; i++) {
				  if (this[i] == obj) {
					return i;
				  }
				}
			  }
			}
			/*//ie8 에서 array 의 indexOf 를 지원하지 않아서 넣음*/
			
			var Idx = catalogueCompare.indexOf(thisIdx[1]);
			catalogueCompare.splice(Idx, 1);		
		}else{
			if (catalogueCompare.length > 4){
				_common.open_popup_layer('compare');
				$("*[data-tmpl=catalogueCompare]").html("Comparison of the data can be up to five.");

			}else {
			
				$("input#"+ thisId).attr("checked", true);					
			
				$("label[for="+ thisId + "]").css({
					"background":"#0071bf url(/semiconductor/common/img/ico/ico_checked3.png) no-repeat left top",
					"background-size":"auto 100%",
					"border":"1px solid #0071bf "
				});	

				catalogueCompare.push(thisIdx[1]);
			}		
		}
	});
}

/********************************************************************************************************
 * METHOD: DRAW COMPARE TABLE
 ********************************************************************************************************/
function drawCompareTable(){
	var html = '';
	var dataIdx = catalogueCompare;
	
	var $tableHead = $('.dataTables_scrollHead').find('table>thead');
	var $headTh = $tableHead.find('tr').first().find('th');
	var $tableBody = $('.dataTables_scrollBody').find('table>tbody');
	var $bodyTr = $tableBody.find('tr');
	var partNoList = [];
	
	html += '<table class="CompareResult tableType1">';
	html += '	<thead>';
	html += '		<tr>';
	
	$.each($headTh, function(idx, val){
		if(idx === 0) return true;
	
	html += '			<th>' + $(this).text() + '</th>';
	
	});
	
	html += '		</tr>';
	html += '	</thead>';
	html += '	<tbody>';
	
	$.each($bodyTr, function(idx, val){
		var trIdx = $(this).data('idx');

		if($.inArray(String(trIdx), dataIdx) < 0) return true; 
		
		var $thisTd = $(this).find('td');
	html += '		<tr>';
	
		$.each($thisTd, function(idx_2, val_2){
			
			if(idx_2 === 0) return true;
			if(idx_2 === 1) partNoList.push($(val_2).text());
	
	html += '			<td>' + $(val_2).text() + '</td>';
		
		});
		
	html += '		</tr>';
	
	});
	
	html += '	</tbody>';
	html += '</table>';
	
	var $target = $('div[data-tmpl="catalogueCompare"]');
	
	$target.empty().append($(html));
	
	var partNoListToString = '';
	$.each(partNoList, function(idx, val){
		partNoListToString += val;
		if(idx < partNoList.length - 1)	partNoListToString += '^';
	});
	
	sendClickCode('compare', partNoListToString);
	
	after_compare();
}

/********************************************************************************************************
 * METHOD: VIEW
 ********************************************************************************************************/
function init_view(){
	$('p.sec-title2').hide();
}