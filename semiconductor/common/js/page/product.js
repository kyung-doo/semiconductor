var catalogueCompare = [] // 비교값 저장
var selectData = {} // 선택된 파라미터값 저장
var excelParamSet = {} // excel export 파라미터값 저장
var parameterIdx = null;  // parameter 에서 active  index

/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){
	init_scripts();
	init_flick();
	init_more();
	init_jump_basic();
	init_mode();
	init_lazy();
	init_jump();
	binding_resources();
	init_layer_compare();
	init_cross_bg();
	init_event();
	init_resources();
	init_result_for();
	init_result_area();

	catalogueDepth.init();
	showHideJump.init();
};

/********************************************************************************************************
 * METHOD: INIT_SCRIPTS
 ********************************************************************************************************/
function init_scripts(){
	$.getScript('/semiconductor/common/js/lib/jquery.dataTables.js').done(function(){
		$.getScript('/semiconductor/common/js/lib/dataTables.fixedColumns.js').done(function(){			
			
			if($(".catalogueResult").length){
				after_catalogue();
			}
		});
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

/********************************************************************************************************
 * METHOD:VIEW-MORE
 ********************************************************************************************************/
function init_more(){
	$('div[data-role=ui-view-mobile-btn]>button').bind({
		'click':function(){
			$('div[data-role=ui-view]').addClass('active');
		}
	});
};

/****************************************************************************************
* METHOD:JUMP BASIC
****************************************************************************************/
function init_jump_basic(){
	$('*[data-role=ui-jump-basic]').each(function(){
		$(this).data('JumpBasic',new JumpBasicUI($(this),$('*[data-role=ui-flick]')));
	});
};

/****************************************************************************************
* METHOD:LAZY LOAD
****************************************************************************************/
function init_lazy() {
	$(document).ready(function(){
		$('.feature-module').find('img.responsive-image').attr('src', '');
		
		if (ValidationUtil.is_mobile()) {
			$('a.btn.print').remove();
		}
	});
	
	$(window).load(function(){
		$('img.lazy').lazyload({
	        thresold : 100,
	        effect: "fadeIn"
	    });	
	});
	
	$(window).resize(function(){
		if (_common._document_width != $(window).width()) {
			_common._document_width = $(window).width();
			
			$('img.lazy').lazyload({
		        thresold : 100
		    });	
		}
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

/****************************************************************************************
* METHOD:JUMP
****************************************************************************************/
function init_jump() {
	$('*[data-role=ui-jump]').each(function() {
		$(this).data('jump', new JumpUI($(this)));
	});
}

/********************************************************************************************************
 * METHOD: CALLBACK SELECT TYPE
 ********************************************************************************************************/
function callback_selectType(){
	getCatalogueResult();
}

/****************************************************************************************
* METHOD:BINDING
****************************************************************************************/
function binding_resources(){
	$('*[data-role=ui-btn-catalogue]').click(function(){
		var $this = $(this);
		var p_typeIaid = $(this).data('typeiaid');
		var typeTitle = $this.text();
		
		if($this.parent().find('div.sub').length){
			p_typeIaid = $this.parent().find('div.sub').find('li').first().find('a').data('typeiaid');
		}
		
		var options = {
			clear : true,
			key : 'parameterList',
			param : {
				typeIaid : p_typeIaid,
				mType : 'json'
			},
			callback : callback_selectType
		};	

		list_active(this);
		
		set_result_for($this.text());
		
		$('a[data-role=btn-clear-all]').click();
		$('div[data-tmpl="catalogueValue"]').empty();
		
		sendClickCode('content_click_count','catalogue:type_' + typeTitle.replace(/[^\w\s]/gi, '').toLowerCase());
		
		catalogueCompare.splice(0, catalogueCompare.length); 
		_common.makeTemplate('/semiconductor/' + SITE_CD + '/products/selectCatalogueParamAttributeList', 'catalogueParam', options);
		
		excelParamSet = options.param;
		excelParamSet.mType = 'excel';
	});

	$('*[data-role="ui-area-parameter"]').on('click', 'a[data-role="ui-btn-value"]', function(){
		var self = this;
		var p_typeIaId = $('ul[data-role="ui-catalogue-type"]').find('li.active').find('a[data-role="ui-btn-catalogue"]').data('typeiaid');
		var options = {
			clear : true,
			callback : after_catalogueValue,
			caller : self,
			param : {
				iaId :GLOBAL_IA_ID,
				typeIaid :p_typeIaId,
				paramId : $(this).data('param'),
				mType : 'json'
			}
		};	

		list_active(self);
		
		var boolSlide = $(self).data('slide');
		var $scriptSlide = $('script[data-role="script-catalogueValue-slide"]');
		var $scriptCheckbox = $('script[data-role="script-catalogueValue-checkbox"]');
		
		if(boolSlide){
			$scriptCheckbox.removeAttr('id');
			$scriptSlide.attr('id', 'tmpl-catalogueValue-inner');
		}
		else{
			$scriptSlide.removeAttr('id');
			$scriptCheckbox.attr('id', 'tmpl-catalogueValue-inner');
		}
		
		parameterIdx = $(this).parent().index();
		
		_common.makeTemplate('/semiconductor/' + SITE_CD + '/products/selectCatalogueParamValueList', 'catalogueValue', options);
	});

	$('button[data-role=ui-btn-awards]').click(function(){
		var $this = $(this);
		var $areaAwards = $('div[data-tmpl="awards"]');
		var startNum = $areaAwards.find('>div.grid-col4').length + 1;
		var endNum = Number($this.data('cnt'));
		
		if(endNum - startNum > 31){
			endNum = startNum + 31;
		}
		
		var options = {
			param : {
				mType : 'json',
				iaId : GLOBAL_IA_ID,
				startRnum : startNum,
				endRnum : endNum
				
			},
			callback:function(){
				if($areaAwards.find('>div.grid-col4').length >= Number($this.data('cnt'))){
					$this.hide();
				}
				if(!$this.closest('.article-txt').hasClass('active')){
					$this.closest('.article-txt').addClass('active');
				}
			}
		}
		_common.makeTemplate('/semiconductor/' + SITE_CD + '/products/selectReviewsAwardsList', 'awards', options);
	});

	$('button[data-role=ui-btn-news]').click(function(){
		var $this = $(this);
		var $areaNews = $('div[data-tmpl="news"]');
		var startNum = $areaNews.find('>div.grid-col4').length + 1;
		var endNum = Number($this.data('cnt'));
		
		if(endNum - startNum > 31){
			endNum = startNum + 31;
		}
		
		var options = {
			param : {
				mType : 'json',
				iaId : GLOBAL_IA_ID,
				startRnum : startNum,
				endRnum : endNum
			},
			callback:function(){ 
				if($areaNews.find('>div.grid-col4').length >= Number($this.data('cnt'))){
					$this.hide();
				}
				if(!$this.closest('.article-txt').hasClass('active')){
					$this.closest('.article-txt').addClass('active');
				}
			}
		}
		_common.makeTemplate('/semiconductor/' + SITE_CD + '/products/selectInTheNewsList', 'news', options);
	});
}

/********************************************************************************************************
 * METHOD:	Resources  show/hide
 ********************************************************************************************************/
function init_resources() {
	var resourcesLength = $(">li", $(".support-list-type")).length;

	$(">li:gt(14)", $(".support-list-type")).hide();
	
	if(resourcesLength > 14){
		$("button[data-role=ui-btn-resources]").show().click(function(){
			$(">li", $(".support-list-type")).show();
			$(this).hide();
		});
	}
	else{
		$("button[data-role=ui-btn-resources]").hide();
	}
}

/********************************************************************************************************
 * METHOD:Cross Background Color
 ********************************************************************************************************/
function init_cross_bg() {
	$(".cross-bg > .feature-module:odd").addClass("bg-main5");
}

/********************************************************************************************************
 * METHOD:list active
 ********************************************************************************************************/
 function list_active(el){
	var $parent = $(el).closest("ul");
	$(">li", $parent).each(function(){$(this).removeClass("active");})
	$(el).parent().addClass("active");
 };
 
/********************************************************************************************************
 * METHOD: INIT EVNET
 ********************************************************************************************************/
function init_event(){
	$('ul[data-role=ui-catalogue-type]').on('click', 'a', function(){
		var $btnParam = $(this).closest('ul[data-role=ui-accordion]').find('a[data-role=ui-accordion-btn]').eq(1);

		$btnParam.removeClass('closed').addClass('expanded');
		$btnParam.next().addClass('active').stop().slideDown(_common._transition_speed);
	});
	
	$('div[data-tmpl=catalogueValue]').on('click', 'input[type=checkbox], button[data-role=ui-btn-addparameter]', function(e){
		var $btnParam = $('ul[data-role=ui-area-parameter]').find('li.active>a');
		var param = $btnParam.data('param');
		var isSlide = $btnParam.data('slide');
		
		if(isSlide){
			var $btnAdd = $('button[data-role=ui-btn-addparameter]');
			var startValue = $btnAdd.data('startvalue');
			var endValue = $btnAdd.data('endvalue');
			
			if(!startValue || !endValue) return false;
			
			selectData[param] = {
									'name' : param,
									'dispName' : $btnParam.text(),
									'slide' : true,
									'values' : []
								};
			
			var temp = {
					'startValue' : startValue,
					'endValue' : endValue
					
			}
			selectData[param].values.push(temp);
			
			sendClickCode('content_click_count','catalogue:parameter and value_' + $btnParam.text().replace(/[^\w\s]/gi, '').toLowerCase() + '_' + startValue.replace(/[^\w\s]/gi, '').toLowerCase() + ' ' + endValue.replace(/[^\w\s]/gi, '').toLowerCase());
		}
		else{
			
			selectData[param] = {
					'name' : param,
					'dispName' : $btnParam.text(),
					'slide' : false,
					'values' : []
				};
			
			$checkedCheckboxs = $('div[data-tmpl=catalogueValue]').find('input[type=checkbox]:checked');
			
			$.each($checkedCheckboxs, function(idx, val){
				var temp = {
						'value' : $(this).val()
						
				}
				selectData[param].values.push(temp);
				
			});
			
			var vals = '';
			
			$.each(selectData[param].values, function(idx, val){
				vals += val.value.replace(/[^\w\s]/gi, '').toLowerCase();
				if(idx < selectData[param].values.length - 1) vals += ',';
			});
			
			sendClickCode('content_click_count','catalogue:parameter and value_' + $btnParam.text().replace(/[^\w\s]/gi, '').toLowerCase() + '_' + vals);
		}
		
		drawSelectData();
		getParamValue();
	});
	
	$('a[data-role=btn-clear-all]').click(function(){
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

		if(excelParamSet.mType === undefined){
			excelParamSet = {
				typeIaid :$('a[data-role="ui-btn-catalogue"]').first().data('typeiaid'),
				mType : 'excel'
			}
		}
		
		window.location.href = '/semiconductor/' + SITE_CD + '/products/fowardCatalogueExportExcel?' + $.param(excelParamSet);
	});
	
	$('div[data-role="ui-area-related-link"]').on('click', 'a.btn.link', function(){
		sendClickCode('content_click', 'related links');
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

/********************************************************************************************************
 * METHOD:	RESULT FOR
 ********************************************************************************************************/
function init_result_for() {
	var $typeArea = $('ul[data-role="ui-catalogue-type"]');
	var $selectedLi = $typeArea.find('>li.active');
	var typeName = $selectedLi.find('>a').text();
	
	if($selectedLi.find('div.sub').length){
		typeName += " &gt; " + $selectedLi.find('>div.sub').find('li.active').find('>a').text();
	}

	set_result_for(typeName);
}

/********************************************************************************************************
 * METHOD:	RESULT AREA
 ********************************************************************************************************/
function init_result_area() {
	if($('#catalogueResultList').length && $('#catalogueResultList').val() === 'N'){
		$('div[data-tmpl="catalogueResult"]').hide();
		$('p.catalogue-btns').hide();
		$('div.module.no-result-area').show();
	}
}

/********************************************************************************************************
 * METHOD: SET RESULT FOR
 ********************************************************************************************************/
function set_result_for(p_typeName){
	var $titleArea = $('span[data-role="ui-title-resultfor"]');
	var subTypeIaName = $('#subTypeIaName').val();
	
	$titleArea.html(" " + subTypeIaName + (p_typeName ? ' &gt; ' : '') + p_typeName);
}

/********************************************************************************************************
 * METHOD: GET PARAM VALUE
 ********************************************************************************************************/
function getParamValue(){
	var p_specValList = {};
	var p_resultArray = new Array();
	
	$.each(selectData, function(idx, val){
		var sub_val = [];
		var isSlide = val.slide;
		
		$.each(val.values, function(idx_2, val_2){
			if(isSlide){
				sub_val.push(val_2.startValue);
				sub_val.push(val_2.endValue);
			}
			else{
				sub_val.push(val_2.value);
			}
			
		});
		var tempVal = {
			"paramId" : val.name,
			"rangeUseFl" : isSlide ? "Y" : "N",
			"values" : sub_val
		}
		
		p_resultArray.push(tempVal);
	});
	
	p_specValList['paramValList'] = p_resultArray;
	
	getCatalogueResult(JSON.stringify(p_specValList));
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
	
	$.each(data.catalogueTitleList, function(idx, val){
		var isSlide = val.paramRangeUseFl == 'Y' ? true : false;
			
	html += '			<th data-paramId="' + val.paramId + '" data-slide="' + isSlide + '"><span>' + val.paramDispNm + '</span></th>';
	
	});
		
	html += '		</tr>';
	html += '	</thead>';
	html += '	<tbody>';
	
	var idx = 0;
	
	var arrPrdId = new Array();
	
	$.each(data.catalogueResultList, function(idx, val){
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
	
		$.each(data.catalogueResultList, function(idx_2, val_2){
			if(val == val_2.prdId){
	html += '			<td><span><a href="' + val_2.prdUrl + '" onclick="sendClickCode(\'finding_method\', \'catalogue\');">' + val_2.partno + '</a></span></td>';
				return false;
			}
		});
	
		$.each(data.catalogueTitleList, function(idx_2, val_2){
			$.each(data.catalogueResultList, function(idx_3, val_3){
				if(val_3.prdId == val && val_3.paramId == val_2.paramId){
						
	html += '			<td><span>' + (val_3.specVal || ' ') + '</span></td>';
					
				}
			});
		});
	
	html += '		</tr>';
	
	});
	
	html += '	</tbody>';
	html += '</table>';
	
	var $target = $('div[data-role="ui-catalogue-result-table"]');
	
	$target.empty().append($(html));
	after_catalogue();
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
	
	sendClickCode('compare', '|' + partNoListToString);
	after_compare();
}

/********************************************************************************************************
 * METHOD: DRAW SELECT DATA
 ********************************************************************************************************/
function drawSelectData(){
	 var html = '';
	 
	 $.each(selectData, function(idx, val){
		 if(val.values.length < 1) return true;
		 
		 var temp = '';
		 var tempStartValue = '';
		 var tempEndValue = '';
		 
		 $.each(val.values, function(j, v){
			if(val.slide){
				temp += v.startValue;
				temp += '<span> ~ </span>';
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
		 $('a[data-role=btn-clear-all]').show();
	 }
	 else{
		 $('div[data-role=ui-filter-result-param]').empty();
		 $('a[data-role=btn-clear-all]').hide();
	 }
}

/********************************************************************************************************
 * METHOD: DELETE SELECT DATA
 ********************************************************************************************************/
function deleteSelectData($btnDelete){
	var param = $btnDelete.data('param');
	var isSlide = $btnDelete.data('slide');
	var value = '';
	
	if(!isSlide) value = $btnDelete.data('value');
	
	var data = selectData[param].values;
	var $this = $(this);
	
	if(isSlide){
		$('div[data-tmpl=catalogueValue]').find('button[data-role=ui-btn-addparameter]').data('startvalue', '').data('endvalue', '').prev().html('<em></em>');
		selectData[param].values = [];
	}
	else{
		$('div[data-tmpl=catalogueValue]').find('input[type="checkbox"][value="' + value + '"]').prop('checked', false);
		
		var temp_value = new Array();
		
		$.each(selectData[param].values, function(idx, val){
			if(val.value != value) temp_value.push(val);
		});
		
		selectData[param].values = temp_value;
	}
	
	drawSelectData();
	getParamValue();
}

/********************************************************************************************************
 * METHOD: CHECK SELECT DATA
 ********************************************************************************************************/
function checkSelectData(param, isSlide, data){
	if(isSlide){
		
		if(typeof selectData[param] != 'undefined'){
			if(selectData[param].values.length < 1) return false;
			
			var startValueIdx = 0;
			var endValueIdx = 0;
			var values_length = data.parameterValueList.length;
			
			$.each(data.parameterValueList, function(idx, val){
				if(val.paramSpecVal === selectData[param].values[0].startValue) endValueIdx = ((values_length -1) - idx);
				if(val.paramSpecVal === selectData[param].values[0].endValue) startValueIdx = ((values_length -1) - idx);
			});
	
			var valuesHeight = Math.round(190/values_length ) + Math.round((190/(values_length -1))/values_length );
			$(".catalogue .sliderLabel li").css({height : valuesHeight});
			
			var slider = $("#sliderRange").slider({
		        orientation: "vertical",
				range: true,
				min: 0,
		        max:(values_length -1),
		        values: [startValueIdx, endValueIdx],
		        slide: function(event, ui) {},
		        change: function(event, ui) { 
		        	var startParam = data.parameterValueList[(values_length -1)-slider.slider('values', 1)].paramSpecVal;
		        	var endParam = data.parameterValueList[(values_length -1)-slider.slider('values', 0)].paramSpecVal;
		        	$(".catalogue .sliderChk > p > em").html(startParam + " <span>~</span> " + endParam);
		        	$('button[data-role=ui-btn-addparameter]').data('startvalue', startParam).data('endvalue', endParam);
		        }
		    });
		}
	}
	else{
		var $checkboxs = $('div[data-tmpl=catalogueValue]').find('input[type=checkbox]');
		
		if(typeof selectData[param] != 'undefined'){
			$.each($checkboxs, function(i, vi){
				$.each(selectData[param].values, function(j, vj){
					if(vi.value == vj.value){
						$(vi).prop('checked', true);
					}
				})
			});
		}
	}
}

/********************************************************************************************************
 * METHOD: AFTER COMPARE
 ********************************************************************************************************/
function after_compare(){
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
 * METHOD: AFTER CATALOGUE VALUE
 ********************************************************************************************************/
function after_catalogueValue(data, caller){
	var values_length = data.parameterValueList.length;
	var values = [];
	
	for (var i =0 ; i < values_length ; i++)
	{		
		values.push(i);
	}	

	var valuesHeight = Math.round(190/values_length ) + Math.round((190/(values_length -1))/values_length );
	$(".catalogue .sliderLabel li").css({height : valuesHeight});

	//NOTIC :: vertical slider 는 그래프의 아래가 가장 작은 값을 갖는다
    var slider = $("#sliderRange").slider({
        orientation: "vertical",
		range: true,
		min: 0,
        max:(values_length -1),
        values: [values[0], values[values_length-1]],
        slide: function(event, ui) {},
        change: function(event, ui) { 
        	var startParam = data.parameterValueList[(values_length -1)-slider.slider('values', 1)].paramSpecVal;
        	var endParam = data.parameterValueList[(values_length -1)-slider.slider('values', 0)].paramSpecVal;
		   	$(".catalogue .sliderChk > p > em").html(startParam + " <span>~</span> " + endParam);
		    $('button[data-role=ui-btn-addparameter]').data('startvalue', startParam).data('endvalue', endParam);
        }
    });
    
    checkSelectData($(caller).data('param'), $(caller).data('slide'), data);
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
			
			if(catalogueCompare.length > 4){
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
	var $activeType = $('ul[data-role="ui-catalogue-type"]').find('>li.active');
	var $selectBtn = $activeType.find('a[data-role="ui-btn-catalogue"]');
	var p_typeIaid = $activeType.find('a[data-role="ui-btn-catalogue"]').data('typeiaid');
	
	if($activeType.find('div.sub').length){
		p_typeIaid = $activeType.find('div.sub').find('li.active').find('a').data('typeiaid');
	}
	
	var arg = {
		'iaId' : GLOBAL_IA_ID,
		'typeIaid' : p_typeIaid,
		'mType' : 'json'
	}
	
	if(p_specValList !== undefined){
		$.extend(arg, {'paramVal' : p_specValList});
	}
	
	$.getJSON('/semiconductor/' + SITE_CD + '/products/selectCatalogueResultList', arg, function(data){
		var $areaResult = $('div[data-tmpl="catalogueResult"]');
		var $areaResultBtn = $('p.catalogue-btns');
		var $areaNoResult = $('div.module.no-result-area');
		
		if(data.catalogueResultList && data.catalogueResultList.length){
			$areaResult.show();
			drawResultTable(data);
			$areaResultBtn.show();
			$areaNoResult.hide();
		}
		else{
			$areaResult.hide();
			$areaResultBtn.hide();
			$areaNoResult.show();
		}
	});
	
	excelParamSet = arg;
	excelParamSet.mType = 'excel';
}

/********************************************************************************************************
 * METHOD: CATALOGUE DEPTH
 ********************************************************************************************************/
var catalogueDepth = {
	options:{
	
	},
	init:function(){

		catalogueDepth.setResize();		

		$(".type > li > a").on('click', this.showDepth);			 

		$(window).on({
			resize:function(){
				catalogueDepth.setResize();
			}
		});
	
	},
	setResize:function(){		
		$(".type > li").each(function(){
			$(this).css({
				margin:'0 0 0 0'
			});
			var mode = _common.is_mode();
			catalogueDepth.setItemAlign(mode);
		});

		var $viewDepth = $(".type > li > .sub:visible");
		var chk_viewDepth = $(".type > li > .sub:visible").length;
		 if (chk_viewDepth>0)
		 {
			var obj = $(">a", $viewDepth.parent());
			catalogueDepth.setSubDepth(obj);			
		 }		
		 
	},
	setItemAlign:function(mode){
		$(".type  li").each(function(){			
			var a_height = $("> a", $(this)).height();
			var p_height = $("> a > p", $(this)).height();
			var p_top;			
			
			if (mode == "MOBILE"){
				if ($(this).parent().parent().hasClass("sub"))
				{
					p_top = 0;
				}else{
					p_top = (a_height - p_height)/2;
				}
			}else{
				p_top = (a_height - p_height)/2;
			}

			$(">a>p", $(this)).css({
				marginTop:p_top
			});
		
		});	
		
	},
	showDepth:function(){
		catalogueDepth.hideDepth();		
		catalogueDepth.setSubDepth(this);		

		if($(">.sub", $(this).parent()).length > 0){								
			$(">.sub", $(this).parent()).show();

			var mode = _common.is_mode();
			catalogueDepth.setItemAlign(mode);
		}
	},
	hideDepth:function(){
		$(".type").css({
			paddingBottom:'0'
		});


		$(".type > li").each(function(){
			$(this).css({
				margin:'0 0 0 0'
			});
			$(".sub", $(this)).hide();

			catalogueDepth.init_SubDepthActive();
		});
	},	
	/*subDepth 의 좌표 및 css 셋팅*********************/
	setSubDepth:function(obj){
		var mode = _common.is_mode();

		var $this = $(obj); // 해당 obj
		var this_row; // 해당 obj 의 row
		var this_width = $this.width(); 
		var row_length; // 한 row에 들어가는 obj 갯수		
		var this_idx = $this.parent().index(); // 해당 obj 의 index
		var depth_height = $(">.sub", $this.parent()).height(); // 해당 obj 의 sub 의 height
		var depth_length = $("li" , $(">.sub", $this.parent())).length; // 해당 obj 의 sub 의 갯수
		var depth_width = ($this.parents(".type").width())-10; // 해당 obj 의 sub 의 width
		var depth_left; // 해당 obj 의 sub 의 화살표 좌표
		var parentTop = $this.parent().offset(); // 해당 obj 의 top
		var type_length = $(">li", $(".type")).length; // 전체 갯수
		
		
		switch(mode){
			case 'PC':
			case 'TABLET_B':
				col_length = 4;		
				sub_col_length = 6;			 
				break;
			case 'TABLET_A':
				col_length = 2;
				sub_col_length = 2;			 
				break;
			case 'MOBILE':
				col_length = 1;
				sub_col_length = 1;	
				break;			
		}
	
		this_row = Math.floor(this_idx/col_length);
		var row_all =  Math.floor((type_length-1)/col_length);// 전체 row
		
		var col_idx = this_idx%col_length;
		depth_left = (col_idx*(this_width+40))+(this_width)/2;						
		
		
		if (col_length == 1){
			$(">.sub", $this.parent()).css({
				width:"100%",
				backgroundPosition:'50% top'
			});

			$(".type").css({
				paddingBottom:'0'
			});

			$(">.sub", $this.parent()).each(function(){
				$("li", $(this)).each(function(){					
					$(this).css({borderLeft:"none", borderTop:"1px solid #dbdbdb"});
					if ($(this).index()== 0)
					{
						$(this).css({border:"none"});
					}
				});
			});

		}else{		
			/*행간격추가*/
			if (this_row == row_all)//해당 obj 가 마지막 줄에 있을 경우,
			{
				$(".type").css({
					paddingBottom:(depth_height+15)
				});
			}else{	//

				/*
				if (catalogueDepth.options.load == true)
				{
					depth_height = (Math.floor(depth_length/sub_col_length))*60;
				}
				*/
					 
				for (var i = (col_length*(this_row+1));  i < (col_length*(this_row+2)); i++ )
				{
					$(".type > li").eq(i).css({
						margin:depth_height + 'px 0 0 0'
					});
				}	
				
				$(".type").css({
					paddingBottom:'10px'
				});
			}

			/*subDepth 의 css 셋팅*/
			$(">.sub", $this.parent()).css({
				width:depth_width,
				top:($this.position().top)+60,
				backgroundPosition:depth_left +'px top'
			});

			$(">.sub", $this.parent()).each(function(){
				$("li", $(this)).each(function(){
					
					$(this).css({borderTop:"none", borderLeft:"1px solid #dbdbdb"});
					
					var idx = $(this).index();
					if (idx%sub_col_length == 0)
					{
						$(this).css({border:"none"});
					}
				});
			});
			
		}

		catalogueDepth.setItemAlign(mode);
	
		catalogueDepth.setSubDepthAcitve(obj);
		
	},
	/*subDepth 의 li active******************************/
	init_SubDepthActive:function(){
		$(".type .sub").each(function(){
			$("li", $(this)).each(function(){
				$(this).removeClass("active");
				if ($(this).index() == 0)
				{
					$(this).addClass("active");
				}
			});
		});
	},
	setSubDepthAcitve:function(obj){
		var $this = $(obj); // 해당 obj
		var $list = $(">.sub ul", $this.parent());
		$("li", $list).each(function(){
			$(">a", $(this)).on("click", function(){
				$("li", $list).each(function(){$(this).removeClass("active");});
				$(this).parent().addClass("active");
			})
		});
	}
}

/********************************************************************************************************
 * METHOD: ShowHideJump - smart memory
 ********************************************************************************************************/
var showHideJump = {
	options:{
		scroll_top:'0',
		container:"[data-role='ui-showHide-jump']",
		tab:"[data-role='ui-showHide-tab']",
		menu:"*[data-role='ui-showHide-menu']",
		btn:"*[data-role='ui-showHide-btn']",
		mode:'',
		init_tab_top:''
	},
	init:function(){
		if($(showHideJump.options.container).length > 0){
			showHideJump.set_init_state();
			
			$(window).on({
				resize:function(){
					showHideJump.set_init_state();						
				},
				scroll:function(){
					showHideJump.options.mode = _common.is_mode();
					
					if ($(showHideJump.options.container).data("jump"))
					{
						showHideJump.float_Jump(showHideJump.options.mode);
					}				
				}
			});	
		}	
	},
	set_init_state:function(){
		showHideJump.options.init_tab_top = showHideJump.get_offset();
		showHideJump.options.mode = _common.is_mode();

		showHideJump.active_menu();
		showHideJump.show_jump(showHideJump.options.mode);

		if (showHideJump.options.mode != 'MOBILE')
		{
			$(showHideJump.options.menu).show();	
		}else{
			$(showHideJump.options.menu).hide();	
		}
	},
	get_offset:function(){
		return $(showHideJump.options.tab).offset().top;
	},
	get_scrollTop:function(){
		return $(document).scrollTop();
	},
	float_Jump:function(mode){
		showHideJump.options.scroll_top = showHideJump.get_scrollTop();

		if (showHideJump.options.scroll_top >=  showHideJump.options.init_tab_top )
		{
			$(showHideJump.options.tab).addClass("float");
		}else {
			$(showHideJump.options.tab).removeClass("float");
			$("[data-role='showHideJump-contents']").css({
				marginTop:"0"
			});
		}
	},	
	active_menu:function(){
		$("[data-role='ui-showHide-link']", $(showHideJump.options.container)).each(function(){
			$(this).click(function(){
				showHideJump.options.mode = _common.is_mode();

				$("> li", $(showHideJump.options.menu)).each(function(){
					$(this).removeClass("active");
					$("[data-role='showHideJump-contents']").css({margin:'0'}).hide();
				});
				
				var $this_con = $(this).data("packageid");
				$("a[data-packageId='"+$this_con+"']", $(showHideJump.options.menu)).parent().addClass("active");
				$("[data-content='"+$this_con+"']").show();
				$(showHideJump.options.btn).text($this_con);

				if (showHideJump.options.mode == 'MOBILE')
				{
					$(showHideJump.options.menu).hide();					
				}

				if ($(showHideJump.options.tab).hasClass("float")){
					showHideJump.scroll_content(showHideJump.options.mode);
				}
			});
		});
	},
	show_jump:function(mode){		
		$(showHideJump.options.btn).click(function(){
			if (mode == 'MOBILE')
			{
				$(showHideJump.options.menu).show();					
			}
		});
	},
	scroll_content:function(mode){			

		var menuheight, extraMargin;		

		var con_top =  $("[data-role='showHideJump-contents']:visible").offset().top;

		if (mode == 'MOBILE')
		{
			menuheight = parseInt($(showHideJump.options.btn).height());
			extraMargin = 15;
		}else {
			menuheight = parseInt($(showHideJump.options.menu).height());
			extraMargin = 30;
		}

		$("[data-role='showHideJump-contents']:visible").css({
			marginTop:((menuheight)+extraMargin) + "px"
		});	

		$("html, body").stop().animate({scrollTop : con_top}, 500, 'swing');		
	
	}
}