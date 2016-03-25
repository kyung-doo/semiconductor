var listResulteCompare = []; // 비교값 저장

/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){
	init_scripts();
	init_mode();
	init_flick();
	init_tab_category();
	init_jump_basic();
	init_jump();
	init_toggle_tab();
	init_popup();
	showHideJump.init();
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
*	METHOD: INIT_MODE
********************************************************************************************************/
function init_mode(){
	var owner=this;	
	var mode = _common.is_mode();
	
	$(window).resize( function() {
		owner.change_kv(_common.is_mode());
	});

	$(window).load( function(){
		owner.change_kv(_common.is_mode());
	});
}

/****************************************************************************************
* METHOD:TOGGLE TAB
****************************************************************************************/
function init_toggle_tab(){
	$(window).resize(function() {//리사이즈 시
		$(".toggleTab > ul > li").each(function(){
			var resizeHeight = $(this).children(".desc").height()+35;//컨텐츠 height 계산
			if($(this).children(".desc").is(":visible")){//컨텐츠 열린 상태일 때
				$(this).css("padding-bottom",resizeHeight);//컨텐츠 height 만큼 하단 여백 넣기
			}
		});
	});

	$(".toggleTab > ul > li").each(function(){
		var self = $(this);
		var thisIndex = self.index();
		var button = self.find(".overview > button");
		var jump = self.parents(".toggleTab").find(".floating-jumpmenu");
		var eqJump = jump.children(".second-jump").find("ul li:eq("+thisIndex+")").children("a");//리스트 인덱스와 동일한 점프메뉴
		var desc = self.children(".desc");
		var siblings = self.siblings();
		var others = self.parents(".toggleTab").siblings(".toggleTab").children("ul").children("li");

		function toggleHide(){
			desc.hide();//컨텐츠 숨김
			button.removeClass("hide").addClass("show").text("Expand");//버튼 클래스 및 텍스트 변경
			self.css("padding-bottom","");//하단 여백 초기화
		};

		function toggleShow(){
			desc.show();//컨텐츠 보임
			eqJump.addClass("active").parent("li").siblings().children("a").removeClass("active");//점프메뉴 클래스 변경
			jump.addClass("active").children("button").text(eqJump.text());//점프메뉴 모바일용 버튼 텍스트 변경
			siblings.css("padding-bottom","").children(".desc").hide();//형제 하단 여백 초기화, 컨텐츠 숨김
			others.css("padding-bottom","").children(".desc").hide();//멀티 형제 하단 여백 초기화, 컨텐츠 숨김
			siblings.children(".overview").find("button").removeClass("hide").addClass("show").text("Expand");//형제 버튼 클래스 및 텍스트 변경
			others.children(".overview").find("button").removeClass("hide").addClass("show").text("Expand");//멀티 형제 버튼 클래스 및 텍스트 변경
			button.removeClass("show").addClass("hide").text("Close");//버튼 클래스 및 텍스트 변경
			$("body,html").animate({scrollTop: button.offset().top}, 700);
		};

		button.click(function(){//Expand 버튼 클릭 시
			var descHeight = desc.height()+35;//컨텐츠 height 계산
			if(desc.is(":visible")){//컨텐츠 열린 상태일 때
				toggleHide();
			}
			else {
				toggleShow();
				self.css("padding-bottom",descHeight);//컨텐츠 height 만큼 하단 여백 넣기
			}
		});

		eqJump.click(function(){//점프메뉴 클릭 시
			var descHeight = desc.height()+35;
			if(desc.is(":visible")){//컨텐츠 열린 상태일 때
				toggleHide();
				$(this).removeClass("active").parents(".floating-jumpmenu").removeClass("active");
			}
			else {
				toggleShow();
				self.css("padding-bottom",descHeight);//컨텐츠 height 만큼 하단 여백 넣기
			}
		});
	});
	
	$(window).on("scroll resize", function (){
		$(".toggleTab").each(function(){
			if($(this).find(".desc:visible").length){//컨텐츠 열린 상태일 때
				var descHeight = $(this).find(".desc:visible").height();
				var scrollConTop = $(this).find(".desc:visible").offset().top;
				var scrollConBottom = scrollConTop+descHeight;
				if ($(window).scrollTop() > scrollConTop-55 && $(window).scrollTop() < scrollConBottom) {//스크롤영역일 때
					$(this).find(".floating-jumpmenu").addClass("active");//점프메뉴 보임
				}
				else {//스크롤영역 아닐 때
					$(this).find(".floating-jumpmenu").removeClass("active");//점프메뉴 숨김
				}
			}
			else {
				$(this).find(".floating-jumpmenu").removeClass("active");//점프메뉴 숨김
			}
		});

		$(".toggleTab.col4").each(function(){
			if($(window).width() < 1024 && $(window).width() > 767){//탭 사이즈일 때
				if($(this).children("ul").children("li:lt(2)").find(".desc:visible").length){//1,2번 컨텐츠 열린 상태일 때
					$(this).find(".second-jump > ul > li:lt(2)").show().siblings("li:gt(-3)").hide();
				}
				else if($(this).children("ul").children("li:gt(-3)").find(".desc:visible").length){//3,4번 컨텐츠 열린 상태일 때
					$(this).find(".second-jump > ul > li:gt(-3)").show().siblings("li:lt(2)").hide();
				}
			}
			else {
				$(this).find(".second-jump > ul > li").css("display","");
			}
		});
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
 * METHOD: POPUP
 ********************************************************************************************************/
function init_popup(){
	var regionalPoup={ //regionalPoup
		init:function(targetA){
			var targetText=$(targetA).closest(".fluid-txt").find(".tit.fg-main1").text().trim();
			$(".pop-wrap.locations .ui-layer-locations>h2").text(targetText);
			this.defaulInfo(targetA.attr('partyid'));
		},
		defaulInfo:function(p_partyid){
			var options = {
				clear : true,
				param : {
					mType : 'json',
					detailType : 'RHQ',
					partyId : p_partyid
						
				},
				callback:function(){ 
					_common.open_popup_layer('locations');
				},
				key : 'rhqDetailList'
			};
			
			_common.makeTemplate('/semiconductor/' + SITE_CD + '/support/sales-network/detail', 'regionalPoup', options);
		},
		formatDate:function(d){
			var d1=d.substr(0,4);
			var d2=d.substr(4,2);
			var d3=d.substr(6,2);
			return d1+"."+d2+"."+d3;
		},
		init_map:function(lng, lat){
			
			var map;
			var targetMarker = new google.maps.LatLng(lng, lat);
			var marker;
			
			var mapOptions = {
				zoom: 17,
				center: targetMarker ,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
	
			map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			marker = new google.maps.Marker({
				position: targetMarker,
				map: map,
				title: 'Here'
			});
		}
	}

	var salesLayerPopup = {
		init:function(targetA){

			var targetText=$(targetA).text().trim();
			var targetImgSrc=$(">img",targetA).attr("src");
			var popupZone=$(".ui-layer-country");
			var salesBranch=$(".salesBranch_wrap a:contains('"+targetText+"')");
			var dsitriButors=$(".distriutors a:contains('"+targetText+"')");
			var salesBranch_size=salesBranch.length;
			var dsitriButors_size=dsitriButors.length;
			this.clickZoneTitle=$(targetA).closest(".salesBranch_wrap").find(".sec-title").text().trim().toLowerCase();
			this.viewType = 0;
			
			
			var PopupTitle='<img class="net_flag_img" alt="' + targetText + '" src="'+targetImgSrc+'" /> '+targetText;

			$("h2.pop-tit",popupZone).html(PopupTitle);

			var tab2_1=  $(".tap-popup-wrapper> label.num01",popupZone);
			var tab2_2=$(".tap-popup-wrapper> label.num02",popupZone);

			$(tab2_1).css("left","0");
			$(tab2_2).css("left","50%");

			if(salesBranch_size<=0){ //salesBranch no-data
				this.viewType = 0;
				$(tab2_1).css("left","-100%");
				$(tab2_2).css("left","0");
				this.distributors(targetA.attr('natcd'));
			}else if(dsitriButors_size<=0){ //dsitriButors_size no-data
				this.viewType = 0;
				$(tab2_2).css("left","-100%");
				$(tab2_1).css("left","0");
				this.saleseBranches(targetA.attr('natcd'));
			}else{
				this.viewType = 1;
				this.saleseBranches(targetA.attr('natcd'));
				this.distributors(targetA.attr('natcd'));
			}
			
		},	
		saleseBranches:function(p_natcd){
			var owner = this;
			var options = {
				clear : true,
				param : {
					mType : 'json',
					detailType : 'SB',
					natCd : p_natcd
				},
				callback:function(){
					if(owner.viewType === 0){
						if(owner.clickZoneTitle=="sales branch"){
							if(!$("label.num01", owner.popupZone).hasClass("on")) $(".ui-layer-country label.num01").click();
						}else{
							if(!$("label.num02", owner.popupZone).hasClass("on")) $(".ui-layer-country label.num02").click();
						}
						
						_common.open_popup_layer('country');
					}
				}
			};

			_common.makeTemplate('/semiconductor/' + SITE_CD + '/support/sales-network/detail', 'countryPopupTab1', options);
		},
		distributors:function(p_natcd){
			var owner = this;
			var options = {
				clear : true,
				param : {
					mType : 'json',
					detailType : 'SB',
					natCd : p_natcd
				},
				callback:function(){ 				
					if(owner.clickZoneTitle=="sales branch"){
						if(!$("label.num01", owner.popupZone).hasClass("on")) $(".ui-layer-country label.num01").click();
					}else{
						if(!$("label.num02", owner.popupZone).hasClass("on")) $(".ui-layer-country label.num02").click();
					}
					
					_common.open_popup_layer('country');
				}
			};

			_common.makeTemplate('/semiconductor/' + SITE_CD + '/support/sales-network/detail', 'countryPopupTab2', options);
		}
	}
	
	$(document).on('click', '*[data-role=ui-btn-locations]', function(e) {
		e.preventDefault();
		
		regionalPoup.init($(this));
		
		
	});
	
	$(document).on('click', '*[data-role=ui-btn-country]', function() {
		salesLayerPopup.init($(this));
	});
}

/********************************************************************************************************
 * METHOD: AFTER BOARD COMPATIBILITY CHECK
 ********************************************************************************************************/
function after_boardCompatibilityChk(){
	if ($(".boardCompatibilityList").has('table.dataTable')){
		var table = $('table.CompatibilityList').DataTable({
			scrollX : true,
			scrollCollapse : true,
			paging : false,
			searching : false,
			info : false
		});
		new $.fn.dataTable.FixedColumns(table, {"leftColumns":1});
	
		$(".resultList-btns").show();
	}
	else{
		$(".resultList-btns").hide();
	}
	
	$(".refine.toggle-content").show();
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
	var contentIdx = $contents.index($thisContent);
	var $nextAccordionBtn = $accordionBtns.eq(accordionIdx + 1);
	
	$nextAccordionBtn.removeClass('dimmed');
}

// 테크리컬 리소스 검색버튼 결과 show/hide
$(document).ready(function(){
	$(".tech_result_btn").click(function(){
		$(".filter_area").show();
	})
})

/****************************************************************************************
* METHOD:JUMP BASIC
****************************************************************************************/
function init_jump_basic(){
	$('*[data-role=ui-jump-basic]').each(function(){
		$(this).data('JumpBasic',new JumpBasicUI($(this),$('*[data-role=ui-flick]')));
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

/********************************************************************************************************
*	METHOD:TAB-CATEGORY
********************************************************************************************************/
function init_tab_category(){
	$('*[data-role=ui-tab-category]').each(function(a){
		var $tabWrap = $(this);
		
		$('*[data-role=ui-tab-menu]',  $tabWrap).each(function(a){
			$(this).bind({
				'click':function(){
					var idx = $(this).parent().index();
					$(this).parent().parent().find('>li').removeClass('active');
					$(this).parent().addClass('active');
					
					$('*[data-role=ui-tab-list]', $tabWrap).hide();
					$('*[data-role=ui-tab-list]:eq('+idx+')', $tabWrap).show();
					
					$('button[data-role=ui-btn-searchresult]').addClass('no_active');
					$('div[data-tmpl="compCat1"], div[data-tmpl="compCat5"]').find('a').removeClass('active');
					$('div[data-tmpl="compCat2"], div[data-tmpl="compCat3"], div[data-tmpl="compCat4"], div[data-tmpl="compCat6"], div[data-tmpl="compCat7"], div[data-tmpl="compCat8"]').empty();
				}
			});
		});
	});

	$('.tap-popup-wrapper > input[type=radio]:checked').next('label').addClass('on').next('.tab-popup-content').addClass('on');
	$(document).on('click', '.tap-popup-wrapper > label:not(".on")', function(e) {
		var $this = $(this);
		$this.toggleClass('on').siblings('label').removeClass('on');
		$this.next('.tab-popup-content').toggleClass('on').siblings('.tab-popup-content').removeClass('on');
		
		if($this.closest('div[data-tmpl="regionalPoup"]').length){
			var regionTit = $('div[data-tmpl="regionalPoup"]').find('h2.pop-tit').text();
			
			if(e.originalEvent !== undefined){
				sendClickCode('content_click_count','sales network:headquarter_' + regionTit.toLowerCase() + ':' + $this.text().toLowerCase());
			}
		}
		else{
			var contName = $('div[data-role="ui-layer-country"]').find('h2.pop-tit').text();
			
			if(e.originalEvent !== undefined){
				sendClickCode('content_click_count','sales network:' + contName.toLowerCase() + ':' + $this.text().toLowerCase());
			}
		}
	});
};

/********************************************************************************************************
 * METHOD: ShowHideJump - various package
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
		$(">li", $(showHideJump.options.menu)).each(function(){
			$(this).click(function(){
				showHideJump.options.mode = _common.is_mode();

				$(">li", $(showHideJump.options.menu)).each(function(){
					$(this).removeClass("active");
					$("[data-role='showHideJump-contents']").css({margin:'0'}).hide();
				});
				$(this).addClass("active");
				var $this_con = $(">a", $(this)).data("packageid");
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
