var catalogueCompare = []; // 비교값 저장

/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){
	init_flick();
	init_more();
	init_jump_basic();
	init_mode();
	init_lazy();
	init_jump();
	init_event();
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
 * METHOD: INIT EVENT
 ********************************************************************************************************/
function init_event(){
	$('div[data-role="ui-area-related-link"]').on('click', 'a.btn.link', function(){
		sendClickCode('content_click', 'related links');
	});
}