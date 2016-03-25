// 마지막 검색 방법 partNo : true, step : false
var isPartNoSearch = true;

/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){
	init_scripts();
	init_selectionTool_catagory();
	init_event();
};

/********************************************************************************************************
 * METHOD: INIT_SCRIPTS
 ********************************************************************************************************/
function init_scripts(){
	$.getScript('/semiconductor/common/js/lib/jquery.dataTables.js')
		.done(function( script, textStatus ) {
			$.getScript('/semiconductor/common/js/lib/dataTables.fixedColumns.js');
		});	
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
 * METHOD: boardCompatibilityChk Catagory
 ********************************************************************************************************/
function init_selectionTool_catagory(){
	var subClikedObj;
	var clickMenuNum=0;
	
	$(document).on("click",".techsrc-wrap .support-list-type>li>div>ul>li:has('ul')>a",function(){
		var catIndex=$(this).closest("ul").closest("li").index();
		if(subClikedObj){
			$(".selectCat_wrap .support-list-type>li:eq("+catIndex+")>div>ul>li:has('ul')>a.on").removeClass("on");
			$(".selectCat_wrap .support-list-type>li:eq("+catIndex+")>div>ul>li:has('ul')>a+ul:visible").slideUp("fast");
		}
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
		
		if($this.data('iaid') && $this.parent().find('>ul').length === 0){
			addActiveClass($this);
			removeDimmedClass($typeArea);
			$paramArea.empty();
			$btnSearch.addClass('no_active');
			
			var options = {
				clear : true,
				param : {
					mType : 'json',
					iaId : $this.data('iaid')
				}
			};
			
			_common.makeTemplate('/semiconductor/' + SITE_CD + '/support/technical-resources/selectTypeSearchList', 'compCat2', options);
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
			$btnSearch.removeClass('no_active');
			
			var options = {
				clear : true,
				param : {
					mType : 'json',
					iaId : $this.data('iaid')
				}
			};
			
			_common.makeTemplate('/semiconductor/' + SITE_CD + '/support/technical-resources/selectPartnoSearch', 'compCat3', options);
		}
	});
	
	// STEP3
	$paramArea.on('click', 'a', function(e){
		e.preventDefault();
		var $this = $(this);
		
		if($this.data('partno')){
			addActiveClass($this);
		}
	});
}

/********************************************************************************************************
 * METHOD: AFTER BOARD COMPATIBILITY CHK
 ********************************************************************************************************/
function after_boardCompatibilityChk(){
	if ($(".boardCompatibilityList").has('table.dataTable')){
		var table = $('table.dataTable').DataTable( {
			scrollX : true,
			scrollCollapse : true,
			paging : false,
			searching : false,
			info : false
		} );
		new $.fn.dataTable.FixedColumns(table, {"leftColumns":1});

		$(".resultList-btns").show();
	}else{
		$(".resultList-btns").hide();
	}
	 
	$(".refine.toggle-content").show();
}

/********************************************************************************************************
 * METHOD: INIT EVENT
 ********************************************************************************************************/
function init_event(){
	$('button[data-role=ui-btn-searchresult]').click(function(){
		if($(".comp_sch_btn_wrap .btn-small").hasClass("no_active")) return false; //버튼 활성화시에만 실행
		
		var $selectedProduct = $('div[data-tmpl="compCat1"]').find('a.active');
		var $selectedType = $('div[data-tmpl="compCat2"]').find('a.active');
		var $selectedParam = $('div[data-tmpl="compCat3"]').find('a.active');
		
		var p_product = $selectedProduct.text();
		var p_type = $selectedType.text();
		var stepIaId = $selectedType.data('iaid');
		var stepPartNo = $selectedParam.data('partno');
		
		sendClickCode('spt_search_success','technical resources:search:' + p_product.replace(/[^\w\s]/gi, '').toLowerCase() + '_' + p_type.replace(/[^\w\s]/gi, '').toLowerCase());
		
		isPartNoSearch = false;
		var args = {
			'iaId' : stepIaId,
			'partno' : stepPartNo,
			'mType' : 'json'
		}
		
		$('a[data-role="btn-clear-all"]').first().click();
		
		$.getJSON('/semiconductor/' + SITE_CD + '/support/technical-resources/selectParametricResourceFileList', args, function(data){
			draw_result(data, true);
		});
	});
	
	$('input[data-role="ui-input-search-partno"]').keyup(function(e){
		$this = $(this);
		var inputText = $this.val();
		var $areaAutocomplete = $('.search-autocomplete');
		
		var keyCode = e.keyCode;
		var leftKey = keyCode === 37 ? true : false;
		var upKey = keyCode === 38 ? true : false;
		var rightKey = keyCode === 39 ? true : false;
		var downKey = keyCode === 40 ? true : false;
		var enterKey = keyCode === 13 ? true : false;
		
		// left, right key
		if (leftKey || rightKey) {
			return false;
		}
		
		else if ((downKey || upKey) && $areaAutocomplete.is(':visible')){
			if (downKey) {
				if ($areaAutocomplete.find('.active').length === 0) {
					$areaAutocomplete.find('li').first().addClass('active');
				}
				else {
					if ($areaAutocomplete.find('.active').next().length > 0) {
						$areaAutocomplete.find('.active').removeClass('active').next().addClass('active');
					}
				}
			}
			else if (upKey) {
				if ($areaAutocomplete.find('.active').length === 0) {
					$areaAutocomplete.find('li').first().addClass('active');
				}
				else {
					if ($areaAutocomplete.find('.active').prev().length > 0) {
						$areaAutocomplete.find('.active').removeClass('active').prev().addClass('active');
					}
				}
			}
			
			$this.val($areaAutocomplete.find('.active').text().trim()).focus();
			
			return false;
		}
		// enter key
		else if (enterKey) {
			$('button[data-role="ui-btn-search-partno"]').click();
			return false;
		}
		// 키워드 입력
		else {
			
			if(inputText.length >= 3){
				
				var args = {
					'mType' : 'json',
					'inputPartno' : inputText
				}
				
				$.getJSON('/semiconductor/' + SITE_CD + '/support/technical-resources/selectPartnoKeyPressSearch', args, function(data){
					draw_auto_complete(data, inputText);
				});
				
			}
			else{
				$areaAutocomplete.hide();
			}
			
		}
	});
	
	$('input[data-role="ui-input-search-partno"]').keydown(function(e){
		var keyCode = e.keyCode;
		var upKey = keyCode == 38 ? true : false;
		var downKey = keyCode == 40 ? true : false;
		var enterKey = keyCode == 13 ? true : false;
		
		// left, right 방향키
		if (upKey || downKey) {
			return false;
		}
		else if (enterKey) {
			return false;
		}
	});
	
	$('button[data-role="ui-btn-search-partno"]').click(function(){
		var $inputPartno = $('input[data-role="ui-input-search-partno"]');
		var $autoComplete = $('.search-autocomplete');
		$autoComplete.hide();
		
		if($inputPartno.val().length){
			isPartNoSearch = true;
			
			var args = {
				'mType' : 'json',
				'inputPartno' : $inputPartno.val()
			}
			
			$.getJSON('/semiconductor/' + SITE_CD + '/support/technical-resources/selectPartnoResourceFileList', args, function(data){
				if(data.resourceFilterByList && data.resourceFilterByList.length > 0){
					sendClickCode('spt_search_success','part no:' + $inputPartno.val());
				}
				else{
					sendClickCode('spt_search_fail','part no:' + $inputPartno.val());
				}
				
				draw_result(data, true);
			});
		}
	});
	
	$('.search-autocomplete').on('click', 'a[data-role="ui-btn-result-autocomplete"]', function(idx, val){
		var thisPartno = $(this).data('partno');
		var $autoComplete = $('.search-autocomplete');
		var $inputSearchPartno = $('input[data-role="ui-input-search-partno"]');
		
		$inputSearchPartno.val(thisPartno);
		$autoComplete.hide();		
	});
	
	$('ul[data-tmpl="resources"]').on('click', 'a[data-role="ui-btn-download"]', function(){
		var $this = $(this);
		var fileName = $this.data('filename');
		var url = $this.attr('href');
		
		sendClickCode('download_b2b', fileName);
		_common._ph.addCookieData('c', { 'content': fileName, 'kind' : 'p', 'url' : url });
	});
}

/********************************************************************************************************
 * METHOD: CHANGE PAGE
 ********************************************************************************************************/
function changePage(){
	var searchPartNo = $('input[data-role="ui-input-search-partno"]').val();
	var stepIaId = $('div[data-tmpl="compCat2"]').find('a.active').data('iaid');
	var stepPartNo = $('div[data-tmpl="compCat3"]').find('a.active').data('partno');
	var $checkedList = $('input[id^="p-twodepth"]:checked');
	var checkValList = new Array;
	
	$checkedList.each(function(){
		checkValList.push($(this).val());
	});
	
	var args = {}
	
	if(isPartNoSearch){
		args.inputPartno = searchPartNo;
		args.classIdList = checkValList.toString();
		args.mType = 'json';
		
		$.getJSON('/semiconductor/' + SITE_CD + '/support/technical-resources/selectPartnoResourceFileList', args, function(data){
			draw_result(data, false);
		});
	}
	else{
		args.iaId = stepIaId;
		args.partno = stepPartNo;
		args.classIdList = checkValList.toString();
		args.mType = 'json';
		
		$.getJSON('/semiconductor/' + SITE_CD + '/support/technical-resources/selectParametricResourceFileList', args, function(data){
			draw_result(data, false);
		});
	}
}

/********************************************************************************************************
 * METHOD: DRAW RESULT
 ********************************************************************************************************/
function draw_result(data, isRedrawFilter){
	var $filterCnt = $('a[data-role="ui-filter-toggle"]').find('>span>em');
	
	$filterCnt.text(data.resourceFileList.length);
	
	if(data.resourceFilterByList && data.resourceFilterByList.length > 0){
		if(isRedrawFilter){
			$(".filter_area").show();
			draw_filter(data.resourceFilterByList);
		}
	}
	else{
		$(".filter_area").hide();
		$('*[data-role=ui-jump-basic]').css({
			'position' : 'relative',
			'z-index' : 1
		}).removeClass('active').hide();
		$(window).off('scroll');
	}
	
	var $target = $('ul[data-tmpl="resources"]');
	var html = '';
	
	if(data.resourceFileList.length > 0){
		$.each(data.resourceFileListCnt, function(idx, val){
			
		html += '<li>';
		html += '	<a href="javascript:void(0)" class="close expanded" data-role="ui-accordion-btn">' + val.loclClassNm + ' (' + val.cnt + ')</a>';
		html += '	<div class="inarea active" data-role="ui-accordion-content">';
		html += '		<ul class="down-list">';
			
			$.each(data.resourceFileList, function(idx_2, val_2){
				
				if(val.classId === val_2.classId){
			
		html += '			<li>';
		html += '				<div class="title">' + val_2.fileNm + '</div>';
		html += '				<div class="date">' + val_2.regDt + '</div>';
		html += '				<div class="download"><a href="' + val_2.filePath + val_2.fileSrcNm + '" class="btn down" target="_blank" data-role="ui-btn-download" data-filename="' + val_2.fileNm + '">Download</a></div>';
		html += '			</li>';
			
				}
			
			});
			
		html += '		</ul>';
		html += '	</div>';
		html += '</li>';
			
		});
		
		$target.empty().append(html);
		
		$('*[data-role=ui-accordion]').each(function() {
			$(this).data('accordion', new AccordionUI($(this)));
		});
		
		$('div.module.no-result-area').hide();
		$('.filter_area').show();
	}
	else{
		$('.filter_area').hide();
		$('div.module.no-result-area').show();
		
		$('*[data-role=ui-jump-basic]').css({
			'position' : 'relative',
			'z-index' : 1
		}).removeClass('active').hide();
		$(window).off('scroll');
	}
}

/********************************************************************************************************
 * METHOD: DRAW AUTO COMPLETE
 ********************************************************************************************************/
function draw_auto_complete(data, txt){
	var $autoComplete = $('.search-autocomplete');
	var $target = $autoComplete.find('ul');
	var html = '';

	if(data.partnoSearchList.length){
		$.each(data.partnoSearchList, function(idx, val){
			var pNo = val.partno;
			var txtIdx = pNo.indexOf(txt.toUpperCase());
			var frontTxt = pNo.slice(0, txtIdx);
			var backTxt = pNo.slice(txtIdx + txt.length, pNo.length);
			var midTxt = '<span style="color:red">' + txt.toUpperCase() + '</span>';
			var fullTxt = frontTxt + midTxt + backTxt;
			
			html += '<li>';
			html += '	<a href="javascript:void(0)" data-partno="' + val.partno + '" data-role="ui-btn-result-autocomplete">' + fullTxt + '</a>'; 
			html += '</li>';
		});
		
		$target.empty().append(html);
		$autoComplete.show();
	}
	else{
		$target.empty();
		$autoComplete.hide();
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
	
	$.each(data, function(idx, val){
		html += '<li>';
		html += '	<input type="checkbox" id="p-twodepth' + idx + '" value="' + val.classId + '" /><label for="p-twodepth' + idx + '">' + val.loclClassNm + '</label>';
		html += '</li>';
		
		mHtml += '<li>';
		mHtml += 	'<input type="checkbox" id="p-mtwo' + idx + '" value="' + val.classId + '" /><label for="p-mtwo' + idx + '">' + val.loclClassNm + '</label>';
		mHtml += '</li>';
	});
	
	$desktopFilterArea.empty().append(html);
	$mobileFilterArea.empty().append(mHtml);
	
	$('div[data-role=ui-filter-list]').each(function(a) {
		$(this).data('filter', new FilterUI($(this)));
	});
	
	init_jump_basic();
}