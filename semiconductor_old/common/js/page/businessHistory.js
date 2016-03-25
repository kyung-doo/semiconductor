/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){
	init_mode();
	init_flick();
	init_slide();
	showHideJump.init();
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
 * METHOD:SLIDE
 ********************************************************************************************************/
function init_slide() {
	/* end 탭 숫자 */
	var setHistoryInfo = function($thumbATag){
		var imgSrc = $thumbATag.find('img').attr('src');
		var imgAlt = $thumbATag.find('img').attr('alt');
		var date = $thumbATag.data('date');
		var title = $thumbATag.data('title');
		var content = $thumbATag.data('content');
		
		var $areaImage = $('div[data-role="ui-area-history-image"]');
		var $areaInfo = $('div[data-role="ui-area-history-info"]');
		
		$areaImage.find('img').attr('src', imgSrc).attr('alt', imgAlt);
		$areaInfo.find('span').text(date);
		$areaInfo.find('h3').text(title);
		$areaInfo.find('p').text(content);
	}
	
	/* start 슬라이드 */
	$(".business-history").each(function(){
		var $this = $(this);
		var thumbRow = 10; //한 번에 나올 썸네일 수
		var thumbWidth = 68; //썸네일 너비
		var thumbMargin = thumbRow * thumbWidth; //슬라이딩 마진값
		var $thumbnail = $this.children(".thumbnail");
		var slideSize = $thumbnail.find("li").length; //요소 개수
		var slideWidth = slideSize * thumbWidth; //썸네일 ul 전체 width
		var hideColCnt = 0;
		var $thumbList = $thumbnail.children("ul");//썸네일 ul
		
		var calMarginCnt = function(direction, remainCnt){
			
			var marginCnt = 0;
			
			if(remainCnt >= thumbRow){
				marginCnt = thumbRow;
			}
			else{
				marginCnt = remainCnt;
			}
			
			if(marginCnt){
				if(direction === 'next'){
					$thumbList.animate({"margin-left" : "-=" + (marginCnt * thumbWidth) + "px"});//나머지 개수만큼 슬라이딩
					hideColCnt += marginCnt;
				}
				else{
					$thumbList.animate({"margin-left" : "+=" + (marginCnt * thumbWidth) + "px"});//나머지 개수만큼 슬라이딩
					hideColCnt -= marginCnt;
				}
			}
		}

		$this.find(".indicator > strong").text(1);
		$this.find(".indicator > span").text(slideSize);
		$thumbnail.children("ul").css('margin-left', '');
		
		/* start 데이터 좌우 버튼 */
		$this.find(".history-contents > .image > button").off().on('click', function(){
			var $thisBtn = $(this);
			var activeThumb = $thumbnail.find("li.active");//선택된 요소
			var setThumbActive = function(direction){
				activeThumb.removeClass("active");
				if(direction === 'next'){
					activeThumb.next().addClass("active");//다음썸네일에 active 클래스 부여
				}
				else{
					activeThumb.prev().addClass("active");//이전썸네일에 active 클래스 부여
				}
				
				activeThumb = $thumbnail.find("li.active");
				$thisBtn.siblings(".indicator").children("strong").text(activeThumb.index() + 1);//모바일용 인디케이터 숫자 변경
			}
			
			
			/* start 다음버튼 */
			if($thisBtn.hasClass("next")){
				if(!activeThumb.is(":last-child")){//선택된 요소가 마지막 아닐 때 (마지막일 때는 액션 없음)
					
					setThumbActive('next');

					if(hideColCnt <= activeThumb.index() && activeThumb.index() <= hideColCnt + thumbRow){//선택된 요소와 슬라이딩 판의 싱크 맞을 때
						if((activeThumb.index() - hideColCnt) % thumbRow === 0 && activeThumb.index() !== hideColCnt){//thumbRow의 배수일 때
							
							var remainCnt = slideSize - activeThumb.index();
							calMarginCnt('next', remainCnt);
						}
					}
				}
			}
			/* end 다음버튼 */
			/* start 이전버튼 */
			else {				
				if(!activeThumb.is(":first-child")){//선택된 요소가 첫번째 아닐 때 (첫번째일 때는 액션 없음)
					
					setThumbActive('prev');
					
					if((hideColCnt - 1) <= activeThumb.index() && activeThumb.index() <= hideColCnt + thumbRow){//선택된 요소와 슬라이딩 판의 싱크 맞을 때
						if((hideColCnt - 1) === activeThumb.index()){//thumbRow의 배수일 때
							
							calMarginCnt('prev', hideColCnt);
						}
					}
				}
			}
			/* end 이전버튼 */
			
			setHistoryInfo($this.find(".thumbnail ul").find('li.active').find('a'));
		});
		/* end 데이터 좌우 버튼 */

		$this.find(".thumbnail ul").width(slideWidth);//썸네일 ul 전체 width
		if (slideSize < thumbRow + 1){//요소 개수가 thumbRow 이하일 때
			$this.find(".thumbnail > button").hide();//썸네일 좌우 버튼 가림
		}
		else{
			$this.find(".thumbnail > button").show();//썸네일 좌우 버튼 보여줌
		}

		/* start 썸네일 */
		$this.find(".thumbnail ul").on('click', 'a', function(e){
			e.preventDefault();
			$(this).parent("li").addClass("active").siblings().removeClass("active");
			setHistoryInfo($(this));
		});
		/* end 썸네일 */

		var slideFlag = true;
		/* start 썸네일 좌우 버튼 */
		$this.find(".thumbnail > button").off().on('click', function(){
			
			if(!slideFlag) return false;
			slideFlag = false;
			
			var activeThumb = $thumbnail.find("li.active");
			
			/* start 다음 버튼 */
			if($(this).hasClass("next")){
				var remainCnt = slideSize - thumbRow - hideColCnt;
				
				calMarginCnt('next', remainCnt);
				
				slideFlag = true;
			}
			/* end 다음버튼 */
			/* start 이전버튼 */
			else {
				
				calMarginCnt('prev', hideColCnt);
				
				slideFlag = true;
			}
			/* end 이전버튼 */
		});
		/* end 썸네일 좌우 버튼 */
	});
	/* end 슬라이드 */
}

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
 * METHOD: DRAW THUMBNAIL
 ********************************************************************************************************/
function draw_thumnail(data){
	var $target = $(".business-history").find(".thumbnail ul");
	var html = '';
	
	$.each(data.mainModel.businessHistoryList, function(idx, val){
		var imgUrl = val.filePath || '/semiconductor/common/img/layout/blank_img.jpg';
		html += '<li>';
		html += '	<a href="javascript:void(0)" data-date="' + val.validStYmd + '" data-title="' + val.contsTitle + '" data-content="' + val.contsDesc.replace(/\"/g, '&quot;') + '">';
		html += '		<img src="' + imgUrl + '" alt="' + val.contsTitle + '">';
		html += '	</a>';
		html += '</li>';
	});
	
	$target.empty().append(html);
	init_slide();
	$target.find('a').first().click();
}

/********************************************************************************************************
 * METHOD: ShowHideJump
 ********************************************************************************************************/
var showHideJump = {
	options:{
		scroll_top: 0,
		container: "[data-role='ui-showHide-jump']",
		tab: "[data-role='ui-showHide-tab']",
		menu: "*[data-role='ui-showHide-menu']",
		btn: "*[data-role='ui-showHide-btn']",
		mode:'',
		init_tab_top:''
	},
	init:function(){
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

	},
	set_init_state:function(){
		showHideJump.options.init_tab_top = showHideJump.get_offset();
		showHideJump.options.mode = _common.is_mode();

		showHideJump.active_menu();
		showHideJump.show_jump(showHideJump.options.mode);

		if (showHideJump.options.mode !== 'MOBILE')
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
		return $(window).scrollTop();
	},
	float_Jump:function(mode){
		showHideJump.options.scroll_top = showHideJump.get_scrollTop();

		if (showHideJump.options.scroll_top >=  showHideJump.options.init_tab_top )
		{
			this.set_top_margin();
			$(showHideJump.options.tab).addClass("float");
		}else {
			$(showHideJump.options.tab).removeClass("float");
			$("[data-role='showHideJump-contents']").css({
				marginTop:0
			});
		}
	},	
	active_menu:function(){
		$(">li>a", $(showHideJump.options.menu)).each(function(){
			$(this).click(function(e){
				e.preventDefault();
				
				showHideJump.options.mode = _common.is_mode();
				
				$(this).parent().addClass("active").siblings().removeClass("active");
				
				$(showHideJump.options.btn).text($(this).text());

				if (showHideJump.options.mode === 'MOBILE')
				{
					$(showHideJump.options.menu).hide();
				}

				if ($(showHideJump.options.tab).hasClass("float")){
					showHideJump.scroll_content();
				}
				
				var p_classId = $(this).data('classid');
				
				$.getJSON('/semiconductor/' + SITE_CD + '/about-us/business-history/selectBusinessHitirySearchList', {mType : 'json', classId : p_classId}, function(data){
					draw_thumnail(data);
				});
			});
		});
	},
	show_jump:function(mode){
		$(showHideJump.options.btn).click(function(){
			if (mode === 'MOBILE')
			{
				$(showHideJump.options.menu).show();
			}
		});
	},
	scroll_content:function(mode){
		var menuheight, extraMargin;
		var $jumpContent = $("[data-role='showHideJump-contents']:visible");
		var con_top = $jumpContent.offset().top;

		this.set_top_margin();
		con_top -= parseInt($jumpContent.css('margin-top'));
		$("html, body").stop().animate({scrollTop : con_top}, _common._transition_speed);		
	},
	set_top_margin:function(){
		if (showHideJump.options.mode === 'MOBILE')
		{
			menuheight = parseInt($(showHideJump.options.btn).outerHeight());
			extraMargin = 15;
		}else {
			menuheight = parseInt($(showHideJump.options.menu).outerHeight());
			extraMargin = 30;
		}

		$("[data-role='showHideJump-contents']:visible").css({
			marginTop: (menuheight + extraMargin) + 'px'
		});
	}
}