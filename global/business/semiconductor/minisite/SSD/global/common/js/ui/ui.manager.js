/*!
 * @class	{Class} UIManager
 */
var UIManager = Class.extend({
	/**
	 * Initialize
	 */
	init : function() {
		this.init_body();
		this.init_video();
		this.reinit();
	},

	/**
	 * ReInitialize
	 */
	reinit : function(type) {
		switch(String(type).toUpperCase()) {
			case 'VIDEO':
				this.reinit_video();
				break;

			default:
				this.init_alink();
				this.init_accordion();
				this.init_layer_video();
				this.init_layer_common();
				this.init_globalsearch();
				this.init_filter();
				this.init_go_top();
				this.init_browser_fix();
				this.init_personal_history();
				//this.init_survey();
				this.init_offline_loadmore();
				this.init_placeholder();
				
				break;
		};
	},

	/**
	 * Initialize Body
	 */
	init_body : function() {
		// 1. type-browser-vendor
		$('body').addClass(ValidationUtil.get_browser_type());

		// 2. type-platform
		$('body').addClass(ValidationUtil.get_platform_type());

		// 3. show/hide browser-notice part as browser type
		var iev = ValidationUtil.get_msie_version();

		if (!(ValidationUtil.is_null(iev)) && iev <= 8) {
			$('.browser-notice').show();
		}
	},

	/**
	 * Initialize alink
	 */
	init_alink : function() {
		$('a').each(function(a) {
			var $this = $(this);
			
			if ($this.attr('href') == '#') {
				$this.attr('href', 'javascript:void(0);');
			}

			// ie7 fix
			if (String($this.attr('href')) == window.location.href + '#') {
				$this.attr('href', 'javascript:void(0);');
			}

			// attr[href=#top] : go to top
			if ($this.attr('href') == '#header') {
				$this.click(function(e) {
					$(window).scrollTop(0);
					$('#header').focus();
					e.preventDefault();
				});
			}
		});
	},

	/**
	 * Initialize Accordion
	 */
	init_accordion : function() {
		var owner = this;

		if ($('*[data-role=ui-accordion]').length) {
			if ( typeof $(this).attr('data-accordion-type') === 'undefined') {
				$('*[data-role=ui-accordion]').each(function() {
					$(this).data('accordion', new AccordionUI($(this)));
				});
			}
		}
	},

	/**
	 * Initialize Video
	 */
	init_video : function() {
		var owner = this;
		var btnCnt = $('*[data-role=play-btn]').length + $('*[data-role=common-video-player]').length;
		var ytCnt = 0;
		var bcCnt = 0;
		
		if($('*[data-role=play-btn]').length > 0){
			$.each($('*[data-role=play-btn]'), function(i, v){
				if($(this).data('videoType') == 'youtube'){
					ytCnt++;
				}
				else{
					bcCnt++;
				}
			});
		}
		
		if($('*[data-role=common-video-player]').length > 0){
			$.each($('*[data-role=common-video-player]'), function(i, v){
				if($(this).hasClass('youtube-player')){
					ytCnt++;
				}
				else{
					bcCnt++;
				}
			});
		}

		/**
		 *  YouTube Player API(IFrame API)
		 *
		 * @definition
		 *
		 * @reference
		 *  https://developers.google.com/youtube/iframe_api_reference
		 *
		 * */
		if(btnCnt > 0 && ytCnt > 0 && SITE_CD != 'cn'){
			$.getScript('https://www.youtube.com/iframe_api', function(data, textStatus, jqxhr) {
				if ( typeof (window.YT) != 'undefined' && typeof (window.YT.Player) != 'undefined') {
					owner.reinit_video();
				};
			});
		}

		/**
		 *  Dynamically Loading a Player Using JavaScript API
		 *
		 * @definition
		 * To dynamically add or remove players from a page using the createExperiences() and unload() methods in the Video Cloud JavaScript Player API
		 *
		 * @method
		 * - createExperiences()
		 * - unload()
		 *
		 * @reference
		 *  http://support.brightcove.com/en/video-cloud/docs/dynamically-loading-player-using-javascript
		 *
		 * */
		if(btnCnt > 0 && bcCnt > 0){
			$.getScript('http://admin.brightcove.com/js/BrightcoveExperiences.js', function(data, textStatus, jqxhr) {
				brightcove.createExperiences();
			});
		}
	},

	/**
	 * re-initialize-video(YouTube)
	 */
	reinit_video : function() {
		var owner = this;

		$('*[data-role=common-video-player]').each(function(a) {
			if (ValidationUtil.is_null($(this).data('manager')) && $(this).hasClass('youtube-player')) {
				var aid = $(this).attr('id');
				var avid = $(this).attr('data-video-id');

				owner.build_video(aid, avid, '100%', '100%');
			};
		});
	},

	/**
	 * build-youtube-video(YouTube)
	 */
	build_video : function(id, videoid, width, height) {
		var owner = this;
		var autoplay = 1;
		
		if (id.indexOf('home-video-player') > -1) {
			autoplay = 0;

		}
		
		var player = new YT.Player(id, {
			'videoId' : videoid,
			'width' : width,
			'height' : height,
			'wmode' : 'transparent',
			'playerVars' : {
				'allowfullscreen' : true,
				'enablejsapi' : 1,
				'version' : 3,
				'autoplay' : 0

			}
		});
		
		$('#' + id).empty().attr('data-role', 'common-video-player').data('manager', player);
		
	},
	
	
	/**
	 * stop-video
	 */
	stop_video : function(id) {
		$('*[data-role=common-video-player]').each(function(a) {
			if (!ValidationUtil.is_null($(this).data('manager')) && $(this).attr('id') != id) {
				if ($(this).hasClass('youtube-player')) {
					$(this).data('manager').stopVideo();
				} else {
					$(this).data('manager').pause();
				}
			}
		});
	},

	/**
	 * load-brightcove-video(Brightcove)
	 *
	 * @private
	 *
	 * @definition
	 * Brightcove template load callback, called when template loads,
	 *	this function stores a reference to the player and modules.
	 *
	 * @param {HTMLElement} experienceID - id of player.
	 * @return		{void}
	 */
	load_template : function(experienceID) {
		// 1. init-brightcove-video
		var player = brightcove.api.getExperience(experienceID);
		var APIModules = brightcove.api.modules.APIModules;
		var videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);

		var experienceModule = player.getModule(APIModules.EXPERIENCE);
		var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
		var Android = /(Android)/g.test(navigator.userAgent);

		if (iOS || Android) {
			$(window).on('resize', function() {
				var w = $('*[data-role=ui-layer-content]').length ? $('*[data-role=ui-layer-content]').width() : $('div.video-box').width();
				var h = $('*[data-role=ui-layer-content]').length ? $('*[data-role=ui-layer-content]').outerHeight(false) : $('div.video-box').height();

				experienceModule.setSize(w, h);
			});
		}


		var savePlayer = new Object();

		// 2. save-video-player as browser type
		// cf> for ie10 - container id: _containermyExperience
		if (ValidationUtil.get_browser_type() == 'msie10') {
			savePlayer = $('#' + experienceID).parent().parent().parent();
			if ($(savePlayer).parent('#_containermyExperience')) {
				// a. for brigihtcove multi
				$('#_containermyExperience').css('height', '100%');
			}
		} else {
			savePlayer = $('#' + experienceID).parent().parent();
		}

		$(savePlayer).data('manager', videoPlayer);

		// Omniture
		if ( typeof (myTemplateLoaded) !== undefined && typeof (myTemplateLoaded) === 'function') {
			myTemplateLoaded(experienceID);
		}
	},

	/**
	 * Initialize Layer Video
	 */
	init_layer_video : function() {
		$(document).on('click', '*[data-role=play-btn]', function() {
			
			var iev = ValidationUtil.get_msie_version();

			if (!(ValidationUtil.is_null(iev)) && iev <= 8 && $(this).attr('data-video-type') == 'brightcove') {
				alert('This video does not support the web browser you are using.');
			} else {
				$(this).data('manager', new LayerVideoUI($(this)));
			}
			
			$(window).bind('touchmove', function(e){
				e.preventDefault();
			});
			
			return false;
		});
	},
	
	/**
	 * Initialize Layer Common
	 */
	init_layer_common : function() {
		
		// contact us
		$(document).ready(function(){
			var $scope = $('div[data-role=ui-layer-email]');
			$scope.find(".press_contact_btn button.btn_open").click(function(){
				$(this).toggleClass('hide');
				$(".contact_info_area").slideToggle(_common._transition_speed);
				return false;
			})
			$scope.find(".press_contact_btn button.btn_close").click(function(){
				$(".press_contact_btn button.btn_open").removeClass('hide');
				$(".contact_info_area").slideUp(_common._transition_speed);
				return false;
			})
		});

		$(document).on('click', '*[data-role=ui-btn-email]', function() {
			$(this).data('manager', new LayerCommonUI($(this)));
			var $scope = $('div[data-role=ui-layer-email]');
			$(".press_contact_btn button.btn_open").removeClass('hide');
			$(".contact_info_area").hide();
			//contact-popup 아코디언
			
			
			var $selectProduct = $scope.find('select[data-role="ui-select-product"]');
			var $selectProductSub = $scope.find('select[data-role="ui-select-product-sub"]');
			var data01 = ['Please Select Sub Product','Server DRAM', 'PC DRAM', 'Mobile DRAM', 'Consumer DRAM', 'Graphic DRAM']
			var data02 = ['Please Select Sub Product','V - NAND', 'Client SSD', 'Mobile DRAM', 'eMMC', 'UFS']
			var data03 = ['Please Select Sub Product','eMMC Based MCP', 'ePOP']
			var data04 = ['Please Select Sub Product','Application Processor', 'ModAP', 'Modem/RF']
			var data05 = ['Please Select Sub Product','Mobile', 'Camera', 'Industry']
			var data06 = ['Please Select Sub Product','Mobile DDI', 'Panel DDI', 'Touch Controller']
			var data07 = ['Please Select Sub Product','Smartcard', 'NFC']
//			var data08 = [' ']
//			var data09 = [' ']
			
			$selectProduct.change(function(){
				var productVal = $(this).val();
				if(productVal === 'Select'){
					$selectProductSub.empty();
					$selectProductSub.append("<option value='" + 'Please Select Product' + "'>" + 'Please Select Sub Product' + "</option>");
				} else	if(productVal === 'DRAM'){
					$selectProductSub.empty();
					for(var i=0; i < data01.length; i++){
						$selectProductSub.append("<option value='" + data01[i] + "'>" + data01[i] + "</option>");
					}
				} else if(productVal === 'Flash'){
					$selectProductSub.empty();
					for(var i=0; i < data02.length; i++){
						$selectProductSub.append("<option value='" + data02[i] + "'>" + data02[i] + "</option>");
					}
				} else if(productVal === 'MCP'){
					$selectProductSub.empty();
					for(var i=0; i < data03.length; i++){
						$selectProductSub.append("<option value='" + data03[i] + "'>" + data03[i] + "</option>");
					}
				} else if(productVal === 'Exynos'){
					$selectProductSub.empty();
					for(var i=0; i < data04.length; i++){
						$selectProductSub.append("<option value='" + data04[i] + "'>" + data04[i] + "</option>");
					}
				} else if(productVal === 'CMOS'){
					$selectProductSub.empty();
					for(var i=0; i < data05.length; i++){
						$selectProductSub.append("<option value='" + data05[i] + "'>" + data05[i] + "</option>");
					}
				} else if(productVal === 'Display'){
					$selectProductSub.empty();
					for(var i=0; i < data06.length; i++){
						$selectProductSub.append("<option value='" + data06[i] + "'>" + data06[i] + "</option>");
					}
				} else if(productVal === 'Security'){
					$selectProductSub.empty();
					for(var i=0; i < data07.length; i++){
						$selectProductSub.append("<option value='" + data07[i] + "'>" + data07[i] + "</option>");
					}
				} else if(productVal === 'Power'){
					$selectProductSub.empty();
//					for(var i=0; i < data08.length; i++){
						$selectProductSub.append("<option value='" + 'undefined' + "'>" + 'Power IC' + "</option>");
//					}
				} else if(productVal === 'Bio'){
					$selectProductSub.empty();
//					for(var i=0; i < data09.length; i++){
						$selectProductSub.append("<option value='" + 'undefined' + "'>" + 'Bio-Processor' + "</option>");
//					}
				} 
				
			});
			
			//sendClickCode('content_click', 'make a request_write');
		});

		// submit-button-event
		$('*[data-role=ui-btn-submit]').off().on('click', function() {
			$('*[data-role=ui-layer-scope]').find('a.btn-close').trigger('click');
			$(this).data('manager', new LayerCommonUI($('*[data-role=ui-layer-ebc]'))); ( function(manager) {
				manager._container.removeClass('pop-wrap');
			}($(this).data('manager')));
		});

	},

	/**
	 * Initialize - Filter
	 *
	 * @private
	 * @return		{void}
	 */
	init_filter : function() {
		$('*[data-role=ui-filter-list]').each(function(a) {
			$(this).data('filter', new FilterUI($(this)));
		});
	},

	/**
	 * Initialize - Global Search
	 *
	 * @private
	 * @return		{void}
	 */
	init_globalsearch : function() {
		$('*[data-role=ui-globalsearch]').each(function(a) {
			$(this).data('globalsearch', new GlobalSearchUI($(this)));
		});
	},

	/**
	 * Initialize - Go top
	 */
	init_go_top : function() {
		$(window).on({
			'scroll' : function() {
				var pageHeight = $(window).outerHeight(false);
				var target = $(window).scrollTop();

				if (target >= pageHeight) {
					$('.btn-go-top').show();
				} else {
					$('.btn-go-top').hide();
				}
			}
		});
	},

	/**
	 * Initialize - Browser bug fix
	 */
	init_browser_fix : function() {
		if (/(Android 4.2.2)/g.test(navigator.userAgent)) {
			$('html').addClass('android-4-2-2');
		}
		if (/(Android 4.4.2)/g.test(navigator.userAgent)) {
			$('html').addClass('android-4-4-2');
		}
		if (/(Chrome\/18.)/g.test(navigator.userAgent)) {
			$('html').addClass('chrome-18');
		}
	},
	
	/**
	 * Initialize - Offline Loadmore
	 */
	init_offline_loadmore: function(){
		$(document).on('click', '*[data-role=ui-btn-more-offline]', function() {
			var $this = $(this);
			var wrap = null;
			var wrap_article_text = $this.closest('div.article-txt');
			var item = null;

			if (wrap_article_text.length > 0) {
				wrap = wrap_article_text;
				item = '.grid-col4';
			}

			wrap.addClass('active');
			wrap.find(item).first().find('a, button').first().focus();

			$this.hide();
		});
	},
	
	/**
	 * Initialize - Placeholder
	 */
	init_placeholder: function(){
		$('input[type=text], textarea').each(function() {
			var hasPlaceholder = $(this).attr('placeholder') != undefined ? true : false;

			if (hasPlaceholder) {
				$(this).placeholder();
			}
			
		});
	},
	
	/**
	 * Initialize - Personal History
	 */
	init_personal_history: function(){
		$('div[data-role=ui-personalhistory]').each(function() {
			_common._ph = new PersonalHistoryUI($(this));
		});
	},
	
	/**
	 * Initialize - Poll Survey
	 */
	init_survey : function() {
		/**
		 * survey
		 *
		 * @private
		 * @description
		 * make survey popup
		 *
		 * @return		{void}
		 */
		var stop_survey = false;
		var pathname = window.location.pathname;
		var exception_path_list = [];
		var popSurvey = function() {
			var src = '';

			src += '<div class="ui-layer-scope reveal-modal-bg" data-role="ui-layer-scope-survey">';
			src += '	<div class="ui-layer-cover"></div>';
			src += '	<div class="pop-wrap ui-layer-container survey">';
			src += '		<div class="ui-layer-content survey">';
			src += '			<div id="poll" class="ui-layer-survey">';
			src += '				<iframe id="survey" class="" data-role="ui-btn-survey" style="border: none; background: none;" frameborder="0" allowfullscreen="0" title="WE VALUE YOUR OPINION" width="100%" height="100%" src="/semiconductor/poll?pollId=3"></iframe>';
			src += '				<a href="#" class="btn-close" data-role="ui-close-survey"><span class="blind">' + messageType01[SITE_CD].tabUI.button_close + '</span></a>';
			src += '			</div>';
			src += '		</div>';
			src += '	</div>';
			src += '</div>';

			$(document).find('body').append($(src));

			$('html, body').css('overflow', 'hidden');

			var ua = navigator.userAgent;
				winHeight = $(window).height();
				
			if (ua.match(/iPhone|iPod/i) != null) {
				$('#survey').parent().css('height', winHeight);
			}
				
			if (ua.match(/iPhone|iPod|iPad/i) != null) {
				
				//$('#survey').height('100%');
				$('#survey').parent().css('-webkit-overflow-scrolling', 'touch');
				$('#survey').parent().css('overflow-y', 'scroll');

				if(_common._isRTL){
					$('#survey').parent().css('direction', 'initial');
				}
			}

			$('*[data-role=ui-close-survey]').click(function() {
				$('*[data-role=ui-layer-scope-survey]').remove();

				$('html, body').css('overflow', 'visible');
				$('.body-wrap').css({'overflow' : 'visible'});

				if ($.cookie('semi_survey_close') == null) {
					$.cookie('semi_survey_close', 1, {
						expires : 90,
						domain : '.samsung.com',
						path : '/semiconductor/',
						secure : false
					});
				}
			});

			/**
			 * resize popup for mobile device
			 */
			var resize = function() {
				var owner = {};
				owner._scope = $('*[data-role=ui-layer-scope-survey]');
				owner._container = owner._scope.find('.ui-layer-container');
				var bodyHeight = $('body').outerHeight();
				var contLeft = 0;
				var contTop = 0;
				var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
				
				$('html, body').css({'overflow' : 'initial'});
				
				if(iOS){
				
					owner._container.find('>div').css({
						'display' : 'block',
						'vertical-align' : 'top'
					});
	
					owner._container.css({
						'position' : 'absolute',
						'height' : 'auto',
						'margin-top' : 0,
						'margin-left' : 0
					});
	
					owner._scope.css({
						'position' : 'absolute',
						'left' : '0',
						'top' : '0',
						'bottom' : 'auto',
						'right' : 'auto',
						'overflow' : 'hidden'
					});
	
					owner._scope.find('.ui-layer-cover').css({
						'position' : 'absolute',
						'left' : '0',
						'top' : '0',
						'bottom' : 'auto',
						'right' : 'auto',
						'width' : '100%'
					});
	
					if ($(window).height() >= owner._container.outerHeight()) {
						contTop = $(window).scrollTop() + (($(window).height() - owner._container.outerHeight()) / 2);
					} else {
						contTop = $(window).scrollTop();
	
						// 팝업이 바닥페이지(body)의 하단을 넘어가는 경우 바닥페이지의 하단에 맞춤
						if (bodyHeight <= contTop + owner._container.outerHeight()) {
							contTop = contTop - (contTop + owner._container.outerHeight() - bodyHeight);
							contTop -= (parseInt(owner._container.css('padding-top')) + parseInt(owner._container.css('padding-bottom')) + parseInt(owner._container.find('.ui-layer-content').find('>div').css('border-top')) + parseInt(owner._container.find('.ui-layer-content').find('>div').css('border-bottom')));
						}
					}
	
					contLeft = ($(window).width() - owner._container.outerWidth()) / 2;
	
					owner._scope.css('height', '100%');
					owner._container.css({
						'top' : contTop,
						'left' : contLeft
					});
					owner._scope.find('>div>div').focus();
					owner._scope.find('.ui-layer-cover').css('height', '100%');
					$('body').css('position', 'relative');
				}

			};

			$.each(['show', 'hide'], function(i, val) {
				var _org = $.fn[val];
				$.fn[val] = function() {
					this.trigger(val);
					_org.apply(this, arguments);
				};
			});

			$('*[data-role=ui-layer-scope-survey]').bind('hide', function() {
				$('html, body').css('overflow', 'visible');
				$('.body-wrap').css({'overflow' : 'visible'});
				$('body').css('position', '');
			});

			if (ValidationUtil.is_mobile()) {
				resize();

				$(window).resize(function() {
					if (_common._document_width != $(window).width()) {
						_common._document_width = $(window).width();
						resize();
					}
				});
			}
		};

		stop_survey = ($('#pageTrack').val() == 'business page not found') ? true : false;

		$.each(exception_path_list, function(i, v) {
			if (pathname.indexOf(v) == 0) {
				stop_survey = true;
				return false;
			}
		});

		if (stop_survey) {
			return false;
		}

		if ($.cookie('semi_survey_count') == null) {
			$.cookie('semi_survey_count', 1, {
				domain : '.samsung.com',
				path : '/semiconductor/',
				secure : false
			});
		} else {
			var count = Number($.cookie('semi_survey_count'));

			if ($.cookie('b2bpoll') == null && $.cookie('semi_survey_close') == null) {

				count++;
				$.cookie('semi_survey_count', count, {
					domain : '.samsung.com',
					path : '/semiconductor/',
					secure : false
				});

				if (count >= 4) {
					popSurvey();
				}
			}
		}
	},
});
