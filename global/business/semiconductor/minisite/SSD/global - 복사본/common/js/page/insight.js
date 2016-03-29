var catalogueCompare = []; // 비교값 저장

/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){
	init_flick();
	init_more();
	init_jump_basic();
	init_mode();
	init_filter_margin();
	init_event();
    gallery_image.init();
};

/********************************************************************************************************
 * METHOD:MODE
 ********************************************************************************************************/
function init_mode() {
	var owner = this;
	
	// 1. init
	owner.change_kv(_common.is_mode());
	
	// 2. resize
	$(window).bind({
		'resize' : function() {
			var mode = _common.is_mode();
			owner.change_kv(mode);
		}
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
 * METHOD:Filter Margin
 ********************************************************************************************************/
function init_filter_margin(){
	$(".btn-filterby,.filterby,.btn-filter-cls").click(function() {
		if($(this).parents(".filter-by-area").hasClass("on")){
			$(this).parents(".filter-by-area").removeClass("on");
		}
		else {
			$(this).parents(".filter-by-area").addClass("on");
		}
	});
}

/****************************************************************************************
* METHOD:EVENT
****************************************************************************************/
function init_event(){
	$('button[data-role=ui-btn-insights-loadmore]').click(function(){
		var $this = $(this);
		var nextPage = parseInt($this.data('page')) + 1;
		
		getInsightData(nextPage);
	});
};

/****************************************************************************************
 * METHOD:CHANGE PAGE
 * - checkbox 선택/해제 시 작동
****************************************************************************************/
function changePage(){
	getInsightData(1);
};

/****************************************************************************************
 * METHOD: GET INSIGHT DATA
****************************************************************************************/
function getInsightData(page){
	var $scope = $('div[data-role="ui-filter-area"]');
	var $productArea = $scope.find('ul[data-role="ui-filter-area-product"]');
	var $applicationArea = $scope.find('ul[data-role="ui-filter-area-application"]');
	var $contentArea = $scope.find('ul[data-role="ui-filter-area-content"]');
	var $audienceArea = $scope.find('ul[data-role="ui-filter-area-audience"]');
	var $formatArea = $scope.find('ul[data-role="ui-filter-area-format"]');
	
	var iaList = new Array();
	var typeList = new Array();
	var targetList = new Array();
	var formatList = new Array();
	
	var makeChkDataArray = function(array, $area){
		if($.isArray($area)){
			$.each($area, function(idx, val){
				$.each(val.find('input[type="checkbox"]:checked'), function(j, vj){
					array.push(vj.value);
				});
			});
		}
		else{
			$.each($area.find('input[type="checkbox"]:checked'), function(idx, val){
				array.push(val.value);
			});
		}
	};
	
	var callback = function(data){
		var $btnLoadmore = $('button[data-role="ui-btn-insights-loadmore"]');
		var $filterCnt = $('a[data-role="ui-filter-toggle"]').find('>span>em');
		
		$filterCnt.text(data.mainModel.totalCount);
		
		if(data.mainModel.insightList.length == 0){
			$btnLoadmore.hide();
			return false;
		}
		
		var curPage = data.mainModel.currentPage;
		var totPage = data.mainModel.totalPage;
		
		if(curPage < totPage){
			$btnLoadmore.show();
		}
		else{
			$btnLoadmore.hide();
		}
		
		$btnLoadmore.data('page', curPage);
		
		$('*[data-ui-textoverflow="true"]').dotdotdot();
	};
	
	makeChkDataArray(iaList, [$productArea, $applicationArea]);
	makeChkDataArray(typeList, $contentArea);
	makeChkDataArray(targetList, $audienceArea);
	makeChkDataArray(formatList, $formatArea);
	
	var param = {
		'chkIaList' : iaList.toString(),
		'chkTypeList' : typeList.toString(),
		'chkTargetList' : targetList.toString(),
		'chkFormatList' : formatList.toString(),
		'page' : page,
		'mType' : 'json'
	}
	
	var isClear = true;
	if(page > 1) isClear = false;
	
	var options = {
		clear : isClear,
		param : param,
		callback : callback
		
	};
	_common.makeTemplate('/semiconductor/insights/selectInsightsSearchList', 'insights', options);
}

/********************************************************************************************************
 * METHOD:news, event detail page - gallery
 ********************************************************************************************************/
 var gallery_image = {
	opts:{
		gallery:"[data-role='ui-gallery-images']",
		gallery_list:"[data-role='ui-gallery-thumbnail']"
	},
	init:function(){	
		$(">li>a", $(gallery_image.opts.gallery_list)).on("click", gallery_image.active_gallery);
		$("button", $(gallery_image.opts.gallery)).on("click", gallery_image.active_btns);
	},
	init_thumb:function(){
		$("li", $(gallery_image.opts.gallery_list)).each(function(){$(this).removeClass("active")});
	},
	change_gllery:function(idx){
		var src = $(">a>img" , $("li", $(gallery_image.opts.gallery_list)).eq(idx)).attr("src");

		$(".clip-center img", $(gallery_image.opts.gallery)).attr("src", src);
		$("p.paging span", $(gallery_image.opts.gallery)).text(idx+1);
		$("li", $(gallery_image.opts.gallery_list)).eq(idx).addClass("active");	
	},
	active_gallery:function(){
		var idx = $(this).parent().index();
		gallery_image.init_thumb();
		gallery_image.change_gllery(idx);
	},
	active_btns:function(){
		var idx = $("li.active", $(gallery_image.opts.gallery_list)).index();		
		var role = $(this).data("role");
		var direction = role.split("ui-btn-");
	
		if (direction[1] == 'prev')
		{
			idx = idx-1;
			if (idx < 0)
			{
				idx = $("li", $(gallery_image.opts.gallery_list)).length-1;
			}

		}else{
		
			idx = idx+1;
			if (idx == $("li", $(gallery_image.opts.gallery_list)).length)
			{
				idx = 0;
			}
		}
		
		gallery_image.init_thumb();
		gallery_image.change_gllery(idx);	

	}
 }