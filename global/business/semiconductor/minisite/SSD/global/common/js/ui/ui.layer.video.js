/*!
 * @class	{Class} LayerVideoUI
 */
var LayerVideoUI = CommonUI.extend({
	/**
	 * initialize
	 *
	 * @constructs
	 * @extends		CommonUI
	 * @requires		ui.common.js
	 * @requires		util.validation.js
	 * @requires		util.string.js
	 * @classdesc
	 * 비디오레이어 생성<br/>
	 * (data-role 속성으로 자동 생성)
	 *
	 * @ example
	 * 비디오 호출 버튼 유형 예<br/>
	 *
	 * 1. youtube video 일 경우
	 * <button type="button" class="btn-ico video" data-role="play-btn" data-video-type="youtube" data-video-id="GF6gB6sq7nk" data-view="1"><span class="blind">watch the video : [입력받은 대체텍스트]</span></button>
	 *
	 * 2. brightcove video single 일 경우
	 * <button type="button" class="btn-ico video" data-role="play-btn" data-video-type="brightcove" data-video-id="3725156612001" data-view="2"><span class="blind">watch the video : [입력받은 대체텍스트]</span></button>
	 *
	 * 3. brightcove video multi 일 경우
	 * <button type="button" class="btn-ico video type01 multi" data-role="play-btn" data-video-type="brightcove-multi" data-video-id="3725156612001" data-view="3">
	 * 		<span class="blind">watch the video : [입력받은 대체텍스트]</span>
	 * 		<span class="blind" data-video-code="3725156612001">/common/b2b4/img/product/img_bright_02.png</span>
	 * 		<span class="blind" data-video-code="3725156612001">/common/b2b4/img/product/img_bright_03.png</span>
	 * 		<span class="blind" data-video-code="3725156612001">/common/b2b4/img/product/img_bright_03.png</span>
	 * </button>
	 *
	 */
	init : function(target) {
		this._scope = null;
		this._cover = null;
		this._container = null;
		this._target = $(target);
		this._parent = null;
		this._contents = null;

		this.reinit();

	},

	/**
	 * re-initialize
	 *
	 * @private
	 * @return		{void}
	 */
	reinit : function() {
		this.build_scope();
		this.build_cover();
		this.build_container();
		this.build_content();
		this.build_events();
		
		
		if (ValidationUtil.is_mobile()) {
			this.resize();
		}
	},

	/**
	 * build-scope
	 *
	 * @private
	 * @return		{void}
	 */
	build_scope : function() {
		this._scope = $(document.createElement('div')).attr({
			'class' : 'ui-layer-scope',
			'data-role' : 'ui-layer-scope'
		}).appendTo($(document.body));
	},

	/**
	 * build-cover
	 *
	 * @private
	 * @return		{void}
	 */
	build_cover : function() {
		this._cover = $(document.createElement('div')).attr({
			'class' : 'ui-layer-cover',
			'data-role' : 'ui-layer-cover'
		}).appendTo(this._scope);
	},

	/**
	 * build-container
	 *
	 * @private
	 * @return		{void}
	 */
	build_container : function() {
		var type = $(this._target).attr('data-video-type');
		var aclass = [{
			'name' : 'youtube',
			'type' : 'movie'
		}, {
			'name' : 'brightcove',
			'type' : 'movie'
		}, {
			'name' : 'brightcove-multi',
			'type' : 'multi-movie'
		}];
		var mode = null;

		for (var a = 0, atotal = aclass.length; a < atotal; a++) {
			if (String(aclass[a].name) == String(type))
				mode = aclass[a].type;
		}

		this._container = $(document.createElement('div')).attr({
			'class' : 'ui-layer-container ' + String(mode),
			'data-role' : 'ui-layer-container'
		}).appendTo(this._scope);
	},

	/**
	 *	build-content
	 *
	 * @private
	 * @param		{Object} target - 이벤트 발생한 버튼
	 * @return		{void}
	 */
	build_content : function() {
		var owner = this;
		var video_id = $(owner._target).attr('data-video-id');
		var type = $(owner._target).attr('data-video-type');
		var shtml = null, phtml = '', ihtml = '';
		var view_num = $(owner._target).attr('data-view');
		var multi_info = $(owner._target).find('*[data-video-code]');
		var iev = ValidationUtil.get_msie_version();
		var location = $(owner._target).attr('data-location');
		this._parent = $('div[data-role=vm-player-layer]');
		var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
		var vc_player_id = _common._bc_idkey.playerId;
		var vc_player_key = _common._bc_idkey.playerKey;
		
		if(typeof location != 'undefined' && location == 'networks'){
			vc_player_id = _common._bc_idkey.siteList.global[location].playerId;
			vc_player_key = _common._bc_idkey.siteList.global[location].playerKey;
		}

		if (view_num == '1' || view_num == '4' || view_num == undefined || view_num == '') {
			view_num = video_id;
		}

		// 1. build-close-button
		var ahtml = $(document.createElement('a')).attr({
			'href' : 'javascript:void(0)',
			'class' : 'btn-close2'
		}).bind({
			// a. button-close-event
			'click' : function() {
				$(shtml).appendTo($(owner._parent));
				$(owner._scope).hide();
				$(owner._scope).remove();
				$('html, body').css('overflow', 'initial');
				$(window).unbind('touchmove');
			}
		}).append('<span class="blind">Close Window</span>');

		// 2. build-video-player
		phtml += '<object id=\"myExperience' + video_id + '\" class=\"BrightcoveExperience\">\n';
		phtml += '	<param name=\"bgcolor\" value=\"#FFFFFF\" />\n';
		phtml += '	<param name=\"width\" value=\"100%\" />\n';
		phtml += '	<param name=\"height\" value=\"100%\" />\n';
		phtml += '	<param name=\"playerID\" value=\"' + vc_player_id + '\" />\n';
		phtml += '	<param name=\"playerKey\" value=\"' + vc_player_key + '\" />\n';
		phtml += '	<param name=\"isVid\" value=\"true\" />\n';
		phtml += '	<param name=\"isUI\" value=\"true\" />\n';
		phtml += '	<param name=\"dynamicStreaming\" value=\"true\" />\n';
		if (!iOS) {
			phtml += '	<param name=\"htmlFallback\" value=\"true\" />\n';
		}
		phtml += '	<param name=\"wmode\" value=\"transparent\" />\n';
		phtml += '	<param name=\"@videoPlayer\" value=\"' + video_id + '\" />\n';
		phtml += '	<param name=\"includeAPI\" value=\"true\" />\n';
		phtml += '	<param name=\"autoStart\" value=\"true\" />\n';
		phtml += '	<param name=\"templateLoadHandler\" value=\"_common._ui.manager.load_template\" />\n';
		phtml += '</object>\n';

		switch(String(type).toUpperCase()) {
			// 1. build-youtube
			case 'YOUTUBE':
				if ($(owner._parent).find('*[data-view=' + view_num + ']').length > 0) {
					shtml = $(owner._parent).find('*[data-view=' + view_num + ']');
				} else {
					shtml = $(document.createElement('div')).css({
						'border' : 'none',
						'background' : 'none'
						//'padding':0,
						//'position':'static'
					}).attr({
						'id' : 'ytp' + view_num.replace("-", "").replace("_", ""),
						'class' : 'youtube-player',
						'data-role' : 'common-video-player',
						'data-view' : view_num,
						'data-video-id' : video_id
					});
				}

				break;

			// 2. build-brightcove-single
			case 'BRIGHTCOVE':
				if (ValidationUtil.is_null(iev) || iev >= 9) {
					if ($(owner._parent).find('*[data-view=' + view_num + ']').length > 0) {
						shtml = $(owner._parent).find('*[data-view=' + view_num + ']');

						$(shtml).find('>div').empty().append(phtml);
					} else {
						shtml = $(document.createElement('div')).attr({
							'id' : 'vm-player-' + view_num,
							'class' : 'video-player',
							'data-role' : 'common-video-player',
							'data-view' : view_num
						}).append($(document.createElement('div')).attr('class', 'vm-boxType').append(phtml).append(ahtml));
					}
				}

				break;

			// 3. build-brightcove-multi
			case 'BRIGHTCOVE-MULTI':
				if (ValidationUtil.is_null(iev) || iev >= 9) {
					// a. build-thumb-image-list
					for (var a = 0, atotal = multi_info.length; a < atotal; a++) {
						ihtml += '<li data-video-code="' + String($(multi_info).eq(a).attr('data-video-code')) + '"><a href="#"><span class="active-cover"></span><img src=\"' + String($(multi_info).eq(a).text()) + '\" alt="" /></a></li>';
					};

					// b. attach-multi-video-form
					if ($(owner._parent).find('*[data-view=' + view_num + ']').length > 0) {
						shtml = $(owner._parent).find('*[data-view=' + view_num + ']');
						$(shtml).find('>div').empty().append(phtml).append(ahtml);
					} else {
						shtml = $(document.createElement('div')).attr({
							'id' : 'vm-player-' + view_num,
							'class' : 'pop-wrap bright-cove',
							'data-role' : 'common-video-player',
							'data-view' : view_num
						}).css({
							'background' : '#000 url(/semiconductor/common/img/layout/logo-samsung-2x.png) no-repeat 50% 25%'
						}).append($(document.createElement('div')).attr('class', 'bright-main').append(phtml)).append($(document.createElement('ul')).attr({
							'class' : 'bright-list',
							'data-role' : 'bright-list'
						}).append(ihtml)).append(ahtml);
					}
				}

				break;
			default :
				// if it is a image
				break;
		};

		// 4. create-container-content
		var content = $(document.createElement('div')).attr({
			'class' : 'ui-layer-content',
			'data-role' : 'ui-layer-content',
			'tabindex' : '0'
		}).css({
			'background' : '#000 url(/semiconductor/common/img/layout/logo-samsung-2x.png) no-repeat 50% 50%'
		}).data('manager', owner._target).appendTo($(owner._container)).focus();

		$(shtml).appendTo(content);

		// 5. add-close-button in youtube video player
		if (String(type) == 'youtube') {
			$(content).append(ahtml);
		}
	},

	/**
	 * build-event
	 *
	 * @private
	 * @return		{void}
	 */
	build_events : function() {
		var owner = this;

		// 1. multi-video-event
		if ($('*[data-role=bright-list]').length > 0) {
			$('*[data-role=bright-list]').find('>li').each(function(a) {
				var player = $('*[data-role=ui-layer-scope]').find('*[data-role=common-video-player]');
				//$(this).parent().parent();

				$(this).bind({
					'click' : function() {
						$(this).parent().find('>li').removeAttr('class');
						$(this).attr('class', 'active');

						// a. load-video
						try {
							$(player).data('manager').loadVideoByID($(this).attr('data-video-code'));
						} catch(e) {
							_common.trace(e);
						}
					}
				});
			});
		}

		// 2. initialize
		_common._ui.manager.init_video();

		if (ValidationUtil.is_mobile()) {
			
			$(window).on('resize', function(e){
				owner.resize();
			});
			/*
			$(window).resize(function() {
				if (_common._document_width != $(window).width()) {
					_common._document_width = $(window).width();
					owner.resize();
				}
			});
			*/
			
		}
	},

	/**
	 * resize popup for mobile device
	 */
	
	resize : function() {
		var owner = this,
			bodyHeight = $('body').outerHeight(),
			contLeft = 0,
			contTop = 0;
			mobileHeight = $(window).height(),
			mobileWidth = $(window).width();
			
			$('html, body').css('overflow', 'hidden');
			
			owner._container.find('>div').css({
				'display' : 'block',
				'vertical-align' : 'top'
			});
	
			owner._container.css({
				'position' : 'relative',
				'width' : '100%',
				'height' : 'auto',
				'margin-top' : '20%',
				'margin-left' : 0
			});
			
			if( mobileHeight < mobileWidth ) {
				
				owner._container.css({
					'position' : 'relative',
					'width' : '80%',
					'height' : 'auto',
					//'margin-top' : '8%',
					'margin-left' : 0
				});
				
			}
			
			owner._scope.css({
				'position' : 'absolute',
				'left' : '0',
				'top' : '0',
				'bottom' : 'auto',
				'right' : 'auto',
				'overflow' : 'hidden'
			});
	
			owner._scope.find('*[data-role=ui-layer-cover]').css({
				'position' : 'absolute',
				'left' : '0',
				'top' : '0',
				'bottom' : 'auto',
				'right' : 'auto',
				'width' : '100%'
			});
			
			owner._container.find('*[data-role=ui-layer-content]').css({'left': 0});
	
			if ($(window).height() >= owner._container.outerHeight()) {
				contTop = $(window).scrollTop() + (($(window).height() - owner._container.outerHeight()) / 2);
			} else {
				contTop = $(window).scrollTop();
	
				// 팝업이 바닥페이지(body)의 하단을 넘어가는 경우 바닥페이지의 하단에 맞춤
				if (bodyHeight <= contTop + owner._container.outerHeight()) {
					contTop = contTop - (contTop + owner._container.outerHeight() - bodyHeight);
					contTop -= (parseInt(owner._container.css('padding-top')) + parseInt(owner._container.css('padding-bottom')) + parseInt(owner._container.find('*[data-role=ui-layer-content]').find('>div').css('border-top')) + parseInt(owner._container.find('*[data-role=ui-layer-content]').find('>div').css('border-bottom')));
				}
			}
			
			contLeft = ($(window).width() - owner._container.outerWidth()) / 2;
	
			owner._scope.css('height', bodyHeight);
			owner._scope.find('*[data-role=ui-layer-cover]').css('height', bodyHeight);
			owner._container.css({
				'top' : contTop,
				'left' : contLeft
			});
			owner._scope.find('>div>div').focus();
	
	
	}
});
