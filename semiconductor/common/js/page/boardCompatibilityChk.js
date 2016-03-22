var isMemoryType = true; // 탭구분 memory type : true , system : false
var paramSet = {}
var excelParamSet = {}

/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){
	init_scripts();
	init_tab();
	int_event();
};

/********************************************************************************************************
 * METHOD: INIT_SCRIPTS
 ********************************************************************************************************/
function init_scripts(){
	$.getScript('/semiconductor/common/js/lib/jquery.dataTables.js').done(function(){
		$.getScript('/semiconductor/common/js/lib/dataTables.fixedColumns.js');
	});
};

/********************************************************************************************************
*	METHOD: TAB
********************************************************************************************************/
function init_tab(){
	$('div[data-role=ui-tab-category]').each(function(){
		var $scope = $(this);
		
		$scope.find('a[data-role=ui-tab-menu]').click(function(idx){
			var $this = $(this);
			var idx = $scope.find('a[data-role=ui-tab-menu]').index(this);
			var $tabList = $scope.find('*[data-role=ui-tab-list]');
			var tabTitle = $this.text();
			
			$this.closest('li').addClass('active').siblings().removeClass('active');

			$tabList.hide();
			$tabList.eq(idx).show();
			
			sendClickCode('b2b_index','b2b_tab:' + tabTitle.toLowerCase());
			
			if(idx === 0){
				isMemoryType = true;
			}
			else{
				isMemoryType = false;
			}
			
			paramSet = {}
			
			$('button[data-role=ui-btn-searchresult]').addClass('no_active');
			$('div[data-tmpl="compCat1"], div[data-tmpl="compCat5"]').find('a').removeClass('active');
			$('div[data-tmpl="compCat2"], div[data-tmpl="compCat3"], div[data-tmpl="compCat4"], div[data-tmpl="compCat6"], div[data-tmpl="compCat7"], div[data-tmpl="compCat8"]').empty();
		});
	});
};

/********************************************************************************************************
 * METHOD: boardCompatibilityChk Catagory
 ********************************************************************************************************/
function int_event(){
	$('button[data-role="ui-btn-searchresult"]').click(function(){
		if($(this).hasClass("no_active")) return false;
		var url = '/semiconductor/' + SITE_CD + '/support/tools-utilities/board-compatibility/selectDramBoardList';
		
		get_json_data(url, 'table');	
	});
	
	$('button[data-role="ui-btn-export"]').click(function(){
		sendClickCode('content_click','catalogue:export');
		
		window.location.href = '/semiconductor/' + SITE_CD + '/support/tools-utilities/board-compatibility/forwardDramBoardResultExcel?' + $.param(excelParamSet);
	});
	
	var $tabScope = $('div[data-role=ui-tab-category]');
	var $btnSearch = $('button[data-role=ui-btn-searchresult]');
	var $moduleDensity = $('div[data-tmpl="compCat3"]');
	var $speed = $('div[data-tmpl="compCat4"]');
	var $motherboardManufacturer = $('div[data-tmpl="compCat7"]');
	var $systemName = $('div[data-tmpl="compCat8"]');
	
	// Tab 전체 공통
	$tabScope.on('click', 'a', function(){
		var $this = $(this);
		
		open_next_step($this);
		add_active_class($this);
	});
	
	// Memory Type
	$tabScope.on('click', 'div[data-tmpl="compCat1"] a', function(){
		var $this = $(this);
		var url = '/semiconductor/' + SITE_CD + '/support/tools-utilities/board-compatibility/selectDramBoardModuleTypeOptionList';
		var $target = $('div[data-tmpl="compCat2"]');
		paramSet.memType = $this.text();
		
		$btnSearch.removeClass('no_active');
		
		// 하위 검색 결과 삭제
		$moduleDensity.empty();
		$speed.empty();
		
		// 하위 param 초기화
		paramSet.modType = '';
		paramSet.modDnsty = '';
		paramSet.spd = '';
		
		get_json_data(url, 'step', 'moduleTypeOptionList', $target);
	});
	
	// Module Type
	$tabScope.on('click', 'div[data-tmpl="compCat2"] a', function(){
		var $this = $(this);
		var url = '/semiconductor/' + SITE_CD + '/support/tools-utilities/board-compatibility/selectDramBoardModuleDensityOptionList';
		var $target = $('div[data-tmpl="compCat3"]');
		paramSet.modType = $this.text();
		
		// 하위 검색 결과 삭제
		$speed.empty();
		
		// 하위 param 초기화
		paramSet.modDnsty = '';
		paramSet.spd = '';
		
		get_json_data(url, 'step', 'moduleDensityOptionList', $target);
	});
	
	// Mudule Density
	$tabScope.on('click', 'div[data-tmpl="compCat3"] a', function(){
		var $this = $(this);
		var url = '/semiconductor/' + SITE_CD + '/support/tools-utilities/board-compatibility/selectDramBoardSpeedOptionList';
		var $target = $('div[data-tmpl="compCat4"]');
		paramSet.modDnsty = $this.text();
		
		// 하위 param 초기화
		paramSet.spd = '';
		
		get_json_data(url, 'step', 'speedOptionList', $target);
	});
	
	// Speed
	$tabScope.on('click', 'div[data-tmpl="compCat4"] a', function(){
		var $this = $(this);
		paramSet.spd = $this.text();
	});
	
	// Chipset Maker
	$tabScope.on('click', 'div[data-tmpl="compCat5"] a', function(){
		var $this = $(this);
		var url = '/semiconductor/' + SITE_CD + '/support/tools-utilities/board-compatibility/selectDramBoardChipsetOptionList';
		var $target = $('div[data-tmpl="compCat6"]');
		paramSet.chipsetMaker = $this.text();
		$btnSearch.removeClass('no_active');
		
		// 하위 검색 결과 삭제
		$motherboardManufacturer.empty();
		$systemName.empty();
		
		// 하위 param 초기화
		paramSet.chipset = '';
		paramSet.boardMaker = '';
		paramSet.boardNm = '';
		
		get_json_data(url, 'step', 'chipsetOptionList', $target);
	});
	
	// Chipset
	$tabScope.on('click', 'div[data-tmpl="compCat6"] a', function(){
		var $this = $(this);
		var url = '/semiconductor/' + SITE_CD + '/support/tools-utilities/board-compatibility/selectDramBoardBoardMakerOptionList';
		var $target = $('div[data-tmpl="compCat7"]');
		paramSet.chipset = $this.text();
		
		// 하위 검색 결과 삭제
		$systemName.empty();
		
		// 하위 param 초기화
		paramSet.boardMaker = '';
		paramSet.boardNm = '';
		
		get_json_data(url, 'step', 'boardMakerOptionList', $target);
	});
	
	// Motherboard Manufacturer
	$tabScope.on('click', 'div[data-tmpl="compCat7"] a', function(){
		var $this = $(this);
		var url = '/semiconductor/' + SITE_CD + '/support/tools-utilities/board-compatibility/selectDramBoardBoardNameOptionList';
		var $target = $('div[data-tmpl="compCat8"]');
		paramSet.boardMaker = $this.text();
		
		// 하위 param 초기화
		paramSet.boardNm = '';
		
		get_json_data(url, 'step', 'boardNameOptionList', $target);
	});
	
	// System Name
	$tabScope.on('click', 'div[data-tmpl="compCat8"] a', function(){
		var $this = $(this);
		paramSet.boardNm = $this.text();
	});
}

/********************************************************************************************************
 * METHOD: GET JSON DATA
 ********************************************************************************************************/
function get_json_data(url, type, key, $target){
	var param = {}
	var result;
	
	if(isMemoryType){
		param = {
			mType : 'json',
			memType : paramSet.memType,
			modType : paramSet.modType,
			modDnsty : paramSet.modDnsty,
			spd : paramSet.spd
		}
	}
	else{
		param = {
			mType : 'json',
			chipsetMaker : paramSet.chipsetMaker,
			chipset : paramSet.chipset,
			boardMaker : paramSet.boardMaker,
			boardNm : paramSet.boardNm
		}
	}

	$.getJSON(url, param, function(data){
		if(type === 'table'){
			draw_table(data);
		}
		else if(type === 'step'){
			draw_step(data, key, $target);
		}
	});
	
	if(type === 'table'){
		excelParamSet = param;
		delete excelParamSet.mType;
	}
}

/********************************************************************************************************
 * METHOD: DRAW DATA
 ********************************************************************************************************/
function draw_step(data, key, $target){
	var html = '<ul>';
	
	$.each(data[key], function(idx, val){
		html += '<li><a href="javascript:void(0)">' + val + '</a></li>';
	});
	
	html += '</ul>';
	
	$target.empty().append(html);
}

/********************************************************************************************************
 * METHOD: DRAW DATA
 ********************************************************************************************************/
function draw_table(data){
	var headTitle = ['Partnumber', 'Chipset Maker', 'Chipset', 'Board Maker', 'Board Name', 'Memory Type', 'Module Type', 'Module Density', 'Speed', 'Component Density', 'Latency', 'Component Week Code', 'Test Class', 'AMB Vendor', 'RCD Vendor']
	var $target = $('div[data-tmpl="boardCompatibilityList"]');
	var $btnExport = $('.resultList-btns');
	var $noResult = $('div.module.no-result-area');
	
	if(data.dramBoardList && data.dramBoardList.length < 1){
		$target.empty();
		$btnExport.hide();
		$noResult.show();
		
		return false;
	}
	else{
		$noResult.hide();
	}
	
	var html = '<table class="catalogueList tableType1">';
	
	html += '	<thead>';
	html += '		<tr>';
	
	$.each(headTitle, function(idx, val){
		
	html += '			<th><span>' + val + '</span></th>';
	
	});
	
	html += '		</tr>';
	html += '	</thead>';
	html += '	<tbody>';
	
	$.each(data.dramBoardList, function(idx, val){
		html += '	<tr>';
		html += '		<td><a href="' + val.url + '">' + ( val.modPm || ' ' ) + '</a></td>';
		html += '		<td>' + ( val.chipsetMaker || ' ' ) + '</td>';
		html += '		<td>' + ( val.chipset || ' ' ) + '</td>';
		html += '		<td>' + ( val.boardMaker || ' ' ) + '</td>';
		html += '		<td>' + ( val.boardNm || ' ' ) + '</td>';
		html += '		<td>' + ( val.memType || ' ' ) + '</td>';
		html += '		<td>' + ( val.modType || ' ' ) + '</td>';
		html += '		<td>' + ( val.modDnsty || ' ' ) + '</td>';
		html += '		<td>' + ( val.spd || ' ' ) + '</td>';
		html += '		<td>' + ( val.comptDnsty || ' ' ) + '</td>';
		html += '		<td>' + ( val.ltncy || ' ' ) + '</td>';
		html += '		<td>' + ( val.comptWeekCd || ' ' ) + '</td>';
		html += '		<td>' + ( val.testClass || ' ' ) + '</td>';
		html += '		<td>' + ( val.ambVendor || ' ' ) + '</td>';
		html += '		<td>' + ( val.rcdVendor || ' ' ) + '</td>';
		html += '	</tr>';	
	});
	
	html += '	</tbody>';
	html += '</table>';
	
	$target.empty().append(html);
	$btnExport.show();
	
	set_fixed_col();
}

/********************************************************************************************************
 * METHOD: SET FIXED COL
 ********************************************************************************************************/
function set_fixed_col(){
	$('table[data-role="ui-tbl-cataloguelist"]').remove();
	$('body').append($('table.catalogueList').clone().attr('id', 'tbl_catalogueList').attr('data-role', 'ui-tbl-cataloguelist').removeAttr('class').hide());
	
	var table = $('table.catalogueList').DataTable( {
		scrollX:        true,
		scrollCollapse: true,
		paging:         false,
		searching: false,
		info:false,
		retrieve: true
	} );

	new $.fn.dataTable.FixedColumns(table, {"leftColumns":1});
}

/********************************************************************************************************
 * METHOD: ADD ACTIVE CLASS
 ********************************************************************************************************/
function add_active_class(obj){
	obj.addClass('active').parent().siblings().find('>a').removeClass('active');
}

/********************************************************************************************************
 * METHOD: OPEN NEXT STEP
 ********************************************************************************************************/
function open_next_step($btn){
	if(_common.is_mode() != 'MOBILE') return false;

	var $this = $btn.closest('div[data-role="ui-accordion-content"]').parent().find('a[data-role="ui-accordion-btn"]');
	var $scope = $this.closest('ul[data-role=ui-accordion]');
	var $accordionBtns = $scope.find('a[data-role=ui-accordion-btn]');
	var $contents = $scope.find('div[data-role=ui-accordion-content]');
	var $thisContent = $btn.closest('div[data-role=ui-accordion-content]');
	var accordionIdx = $accordionBtns.index($this);
	var contentIdx = $contents.index($thisContent);
	var $nextAccordionBtn = $accordionBtns.eq(accordionIdx + 1);
	
	$nextAccordionBtn.removeClass('dimmed');
}