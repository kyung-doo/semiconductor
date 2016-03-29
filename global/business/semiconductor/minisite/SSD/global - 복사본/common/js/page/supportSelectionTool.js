var catalogueCompare = [] // 비교값 저장
var selectData = {} // 선택된 파라미터값 저장
var excelParamSet = {} // excel export 파라미터값 저장
var table;
var table2;

/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){
	init_scripts();
	init_layer_compare();
	init_event();
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
	$.getScript('/semiconductor/common/js/page/selectionToolCatagory.js');
};

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
 * METHOD: AFTER COMPARE
 ********************************************************************************************************/
function after_compare(data){

	table2 = $('table.CompareResult').DataTable( {
		scrollX:        true,
		scrollCollapse: true,
		paging:         false,
		searching: false,
		info:false,
		retrieve: true
	} );

	new $.fn.dataTable.FixedColumns(table2, {"leftColumns":1});
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
	if(data.hasOwnProperty('specRangeSearchList')){
		var values_length = data.specRangeSearchList.length;
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
			   var startParam = data.specRangeSearchList[(values_length -1)-slider.slider('values', 1)].paramVal;
			   var endParam = data.specRangeSearchList[(values_length -1)-slider.slider('values', 0)].paramVal;
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
 * METHOD: GEN PARAM
 ********************************************************************************************************/
function genParam(){
	var p_iaId = $('div[data-tmpl="compCat2"]').find('a.active').data('iaid');
	
	var p_specValList = {};
	var p_resultArray = new Array();
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
			cntVal++;
		});
		var tempVal = {
			"paramId" : val.name,
			"rangeUseFl" : isSlide ? "Y" : "N",
			"values" : sub_val
		}
		
		if(cntVal > 0) p_resultArray.push(tempVal);
	});
	p_specValList['paramValList'] = p_resultArray;
	
	var returnVal = { 'p_iaId' : p_iaId }
	
	if(p_specValList.paramValList.length > 0){
		$.extend(returnVal, {'p_specValList' : JSON.stringify(p_specValList)});
	}
	
	return returnVal
}

/********************************************************************************************************
 * METHOD: INIT EVENT
 ********************************************************************************************************/
function init_event(){
	$('button[data-role=ui-btn-searchresult]').click(function(){
		if($(this).hasClass("no_active")) return false; //버튼 활성화시에만 실행
		
		var paramSet = genParam();
		var p_product = $('div[data-tmpl="compCat1"]').find('a.active').text();
		var p_type = $('div[data-tmpl="compCat2"]').find('a.active').text();
		
		catalogueCompare = [];
		
		sendClickCode('spt_search_success','selection tools:search:' + p_product.replace(/[^\w\s]/gi, '').toLowerCase() + '_' + p_type.replace(/[^\w\s]/gi, '').toLowerCase());
		
		var param = {
				'iaId':paramSet.p_iaId,
				'paramVal':paramSet.p_specValList,
				'mType':'json'
		}

		$('a[data-role="btn-clear-all"]').first().click();
		
		$.getJSON('/semiconductor/' + SITE_CD + '/support/selection-tools/selectSelectionToolsSearchList', param, function(data){
			drawResultTable(data, true);
		});
		
		excelParamSet = param;
		delete excelParamSet.mType;
	});
	
	$('div[data-tmpl="compCat1"], div[data-tmpl="compCat2"]').on('click', 'a', function(e){
		var selectData = {}
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
			
		selectData[param] = {
								'name' : param,
								'dispName' : $btnParam.text(),
								'slide' : true,
								'values' : []
							};
		
		var $btnAdd = $('button[data-role=ui-btn-addparameter]');
		var startValue = $btnAdd.data('startvalue');
		var endValue = $btnAdd.data('endvalue');
		
		if(!startValue || !endValue) return false;
		
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
		sendClickCode('content_click','selection_tool:export');
		
		window.location.href = '/semiconductor/' + SITE_CD + '/support/selection-tools/forwardSelectionToolsResultExcel?' + $.param(excelParamSet);
	});
}

/********************************************************************************************************
 * METHOD: CHANGE PAGE
 ********************************************************************************************************/
function changePage(){
	var paramSet = genParam();
	var $checkedList = $('input[id^="p-twodepth"]:checked');
	var checkValList = new Array;
	
	$checkedList.each(function(){
		checkValList.push($(this).val());
	});
	
	catalogueCompare = []; 

	var args = {
		'iaId':paramSet.p_iaId,
		'paramVal':paramSet.p_specValList,
		'iaIdList':checkValList.toString(),
		'mType':'json'
	}
	
	$.getJSON('/semiconductor/' + SITE_CD + '/support/selection-tools/selectFilterBytSelectionToolsSearchList', args, function(data){
		drawResultTable(data, false);
	});
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
};

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
};

/********************************************************************************************************
 * METHOD: CHECK SELECT DATA
 ********************************************************************************************************/
function checkSelectData(param, isSlide, data){
	if(isSlide){
		if(typeof selectData[param] != 'undefined'){
			if(selectData[param].values.length < 1) return false;
			
			data = data.specRangeSearchList;
			
			var startValueIdx = 0;
			var endValueIdx = 0;
			
			var values_length = data.length;
			
			$.each(data, function(idx, val){
				if(val.paramVal == selectData[param].values[0].startValue) endValueIdx = ((values_length -1) - idx);
				if(val.paramVal == selectData[param].values[0].endValue) startValueIdx = ((values_length -1) - idx);
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
		        	var startParam = data[(values_length -1)-slider.slider('values', 1)].paramVal;
		        	var endParam = data[(values_length -1)-slider.slider('values', 0)].paramVal;
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
};

/********************************************************************************************************
 * METHOD: DRAW RESULT TABLE
 ********************************************************************************************************/
function drawResultTable(data, isRedrawFilter){
	var $filterCnt = $('a[data-role="ui-filter-toggle"]').find('>span>em');
	$filterCnt.text(data.partnoList.length);
	
	if(isRedrawFilter){
		if(data.filterByList && data.filterByList.length > 0){
			draw_filter(data);
			init_jump_basic();
			$(".filter_area").show();
		}
		else{
			$(".filter_area").hide();
			$('*[data-role=ui-jump-basic]').css({
				'position' : 'relative',
				'z-index' : 1
			}).removeClass('active').hide();
			$(window).off('scroll');
		}
	}
	
	if(data.specValueList){
		var html = '';
		
		html += '<table class="catalogueList tableType1">';
		html += '	<thead>';
		html += '		<tr>';
		html += '			<th></th>';
		html += '			<th><span>' + messageType01[SITE_CD].catalogue.partnumber + '</span></th>';
	
		$.each(data.paramHeaderList, function(idx, val){
				
		html += '			<th data-paramId="' + val.paramId + '"><span>' + val.paramDispNm + '</span></th>';
		
		});
			
		html += '		</tr>';
		html += '	</thead>';
		html += '	<tbody>';
	
		$.each(data.partnoList, function(idx, val){
		
		html += '		<tr>';
		html += '			<td><span><input type="checkbox" name="catalogueResult' + idx + '" id="catalogueResult' + idx + '" /><label for="catalogueResult' + idx + '"></label></span></td>';
		html += '			<td><span><a href="' + val.url + '" onclick="sendClickCode(\'finding_method\', \'selection tool\');">' + val.partno + '</a></span></td>';
	
			$.each(data.paramHeaderList, function(idx_2, val_2){
				$.each(data.specValueList, function(idx_3, val_3){
					if(val.prdId === val_3.prdId && val_2.paramId == val_3.paramId){
	
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
		
		$('p.sec-title2').show().find('span[data-role="ui-title-resultfor"]').text(resultForTxt);
		$('.col-inner.resultList-btns').show();
		$('div[data-tmpl="selectionToolList"]').show();
		$('div.module.no-result-area').hide();

		after_catalogue();
	}
	else{
		$('p.sec-title2').hide();
		$('.col-inner.resultList-btns').hide();
		$('div[data-tmpl="selectionToolList"]').hide();
		$('div.module.no-result-area').show();
		$('*[data-role=ui-jump-basic]').css({
			'position' : 'relative',
			'z-index' : 1
		}).removeClass('active').hide();
		$(window).off('scroll');
	}
}

/********************************************************************************************************
 * METHOD: DRAW FILTER
 ********************************************************************************************************/
function draw_filter(data){
	var $desktopFilterArea = $('div[data-role="ui-filter-content"]').find('ul.two-depth');
	var $mobileFilterArea = $('div[data-role="ui-mfilter-content"]').find('ul.m-twodepth');
	
	var html = '';
	var mHtml = '';
	
	$.each(data.filterByList, function(idx, val){
		html += '<li>';
		html += '	<input type="checkbox" id="p-twodepth' + idx + '" value="' + val.iaId + '" /><label for="p-twodepth' + idx + '">' + val.iaLoclNm + '</label>';
		html += '</li>';
		
		mHtml += '<li>';
		mHtml += 	'<input type="checkbox" id="p-mtwo' + idx + '" value="' + val.iaId + '" /><label for="p-mtwo' + idx + '">' + val.iaLoclNm + '</label>';
		mHtml += '</li>';
	});
	
	$desktopFilterArea.empty().append(html);
	$mobileFilterArea.empty().append(mHtml);
	
	$('div[data-role=ui-filter-list]').each(function(a) {
		$(this).data('filter', new FilterUI($(this)));
	});
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
 * METHOD: VIEW
 ********************************************************************************************************/
function init_view(){
	$('p.sec-title2').hide();
}