/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){
	init_flick();
	init_more();
	init_jump_basic();
	init_mode();
};

/********************************************************************************************************
 * METHOD:MODE
 ********************************************************************************************************/
function init_mode(){
	var owner=this;	
	
	owner.change_kv(_common.is_mode());
	
	$(window).resize( function() {
		var mode = _common.is_mode();
		owner.change_kv(mode);
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
					img_url = cdnHost + $this.data('mediaMobile');
					$(this).removeClass('kv_desktop').addClass('kv_mobile');
					break;
				case 'PC':
				case 'TABLET_B':
				case 'TABLET_A':
					img_url = cdnHost + $this.data('mediaDesktop');
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

/********************************************************************************************************
 * METHOD:JUMP BASIC
 ********************************************************************************************************/
function init_jump_basic(){
	$('*[data-role=ui-jump-basic]').each(function(){
		$(this).data('JumpBasic',new JumpBasicUI($(this),$('*[data-role=ui-flick]')));
	});
};