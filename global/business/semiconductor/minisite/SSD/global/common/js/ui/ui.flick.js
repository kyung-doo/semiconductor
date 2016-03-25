/*!
 * @class	{Class} FlickUI
 */
var FlickUI = Class.extend({
	/**
	 * initialize
	 *
	 * @constructs
	 * @extends	{Class}
	 * @requires	jquery.js
	 * @classdesc
	 * 플리킹(모바일,태블릿), 슬라이드(데스크탑) 생성<br/>
	 * (data-role 속성으로 자동 생성)
	 *
	 * @param		{DOM} scope - 컨테이너
	 *
	 * @example
	 *
	 * <!--
	 *    data-role="ui-flick"            - 컨테이너
	 *    data-role="ui-flick-container"  - 플리킹 컨테이너
	 *    data-role="ui-flick-content" 	  - 플리킹 컨텐츠
	 *    data-role="ui-flick-prev" 	  - 이전 버튼
	 *    data-role="ui-flick-next"       - 다음 버튼
	 *    data-role="ui-flick-navigation" - 네비게이션 컨테이너
	 * -->
	 *
	 */
	init : function(scope, opt) {
		this._scope = $(scope);
		this._container = null;
		this._content = null;
		this._navigate = null;
		this._num = null;

		this._case = false;
		this._length = 0;
		this._current = 0;
		this._current_navigate = null;
		this._target = [];
		this._pos = [];
		this._start = {
			'x' : 0,
			'y' : 0
		};
		this._amount = {
			'x' : 0,
			'y' : 0
		};
		this._flag = {
			'scroll' : false,
			'drag' : false,
			'slide' : false,
			'auto' : false
		};
		this._transition = {
			'range' : 0.3,
			'speed' : '100',
			'time' : 10000
		};
		this._isCss = false;
		this._interval = null;

		this._w = 0;
		this._range = 0;

		try {
			this._flag.auto = opt.auto;
		} catch(e) {
		}

		this.reinit();
		this.resize();
		this.control();
	
	},

	/**
	 * re-initialize
	 *
	 * @private
	 * @return		{void}
	 */
	
	
	reinit : function() {
		// kv와 pdp에서 같이 사용함. 원래는 1로 비교했었는데 pdp에서 문제되어 0으로 변경함.
		if (this._scope.find('*[data-role=ui-flick-content]').children().length > 0) {
			if (this._scope.find('div.ctl-carousel').length) {
				this._scope.find('div.ctl-carousel').show();
			}

			this.build_scope();
			this.build_container();
			this.build_content();
			this.build_navigate();
			this.build_event();
		} else {
			if (this._scope.find('div.ctl-carousel').length) {
				this._scope.find('div.ctl-carousel').hide();
			}

			this._scope.css({
				'visibility' : 'visible'
			});
		}
	},

	control : function() {
		var $control = $('div.ctl-carousel');
		var h = $('[data-role=ui-flick-content] li').height() - $('div.screen div').height() - 30;
		
		if(ValidationUtil.is_mobile()) {
			
			$control.css({
				'top': h,
				'padding-top':'0'
					});
				
		};
	},
	
	resize : function() {
		var owner = this;

		// 2개 이상부터 리사이징 처리라, 1개있을때, 반응형에 대응이 안됨 1이상으로 수정함.
		if (owner._scope.find('*[data-role=ui-flick-content]').children().length > 0) {
			$(window).on('resize', function() {
				owner.resizing();
			});
		}
	},

	/**
	 * build-scope
	 *
	 * @private
	 * @return		{void}
	 */
	build_scope : function() {
		//this._isCss = this.get_css();
		this._isCss = false;
	},

	/**
	 * build-container
	 *
	 * @private
	 * @return		{void}
	 */
	build_container : function() {
		var owner = this;
		
		owner._container = owner._scope.find('*[data-role=ui-flick-container]');
		owner._length = owner._container.children().length;
		owner._container.css({
			'position' : 'relative',
			'overflow' : 'hidden'
		});
	},

	/**
	 * build-content
	 *
	 * @private
	 * @return		{void}
	 */
	build_content : function(cnt) {
		var owner = this;

		owner._content = owner._container.find('*[data-role=ui-flick-content]');

		// 아이템이 2개인 경우
		if (owner._content.children().length === 2) {
			owner._case = true;
			owner._content.append(owner._content.children().first().clone(true).attr('data-clone', 'clone'));
			owner._content.append(owner._content.children().eq(1).clone(true).attr('data-clone', 'clone'));
		}

		owner._length = owner._content.children().length;
		//owner._w=owner._container.width();

		// sub 타입인 경우 (sample image)
		// ui.slide.res.js에서 리사이징을 하는데, 실행 시점이 안맞아 ui.flick.js에서 처리함
		if (owner._scope.data('type') == 'sub') {
			owner._w = $(window).width();
			$('*[data-role=ui-layer-sample]').width(owner._w);
		} else {
			owner._w = owner._container.width();
		}

		owner._range = owner._w * owner._transition.range;

		owner._content.css({
			'position' : 'relative',
			//'overflow' : 'hidden',
			'width' : (owner._w * owner._length) + 'px'
		});

		if ( typeof cnt !== 'undefined') {
			owner._current = cnt;
		} else {
			owner._current = 0;
		}

		if (owner._isCss) {
			owner._content.children().each(function(a) {
				var pos = 0;

				if (a < owner._current) {
					pos = -1;
				} else if (a > owner._current) {
					pos = 1;

					if (owner._current === 0 && a === owner._length - 1) {
						pos = -1;
					}
				}

				$(this).css({
					'position' : 'absolute',
					'width' : owner._w + 'px',
					'transition' : '0ms',
					'transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
					'-webkit-transition' : '0ms',
					'-webkit-transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
					'-moz-transition' : '0ms',
					'-moz-transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
					'-o-transition' : '0ms',
					'-o-transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
					'-ms-transition' : '0ms',
					'-ms-transform' : 'translate(' + (pos * owner._w) + 'px,0)'
				});

				if (_common._isRTL) {
					$(this).css({
						'right' : -(owner._w * a) + 'px',
						'float' : 'right'
					});
				} else {
					$(this).css({
						'left' : -(owner._w * a) + 'px',
						'float' : 'left'
					});
				}
			});
		} else {
			owner._content.children().each(function(a) {
				var pos = 0;

				if (a < owner._current) {
					pos = -1;
				} else if (a > owner._current) {
					pos = 1;

					if (owner._current === 0 && a === owner._length - 1) {
						pos = -1;
					}
				}

				$(this).css({
					'position' : 'absolute',
					'top' : 0,
					'width' : owner._w + 'px'
				});

				if (_common._isRTL) {
					$(this).css('right', (pos * owner._w) + 'px');
				} else {
					$(this).css('left', (pos * owner._w) + 'px');
				}
			});

			// KV, PDP Sample image
			if (owner._scope.data('type') != 'main') {
				// 제일 높이가 큰 컨텐츠의 사이즈를 구함
				owner._content.children().each(function() {
					$(this).find('>div').css('height', '');
				});

				var maxHeight = 0;

				owner._content.children().each(function() {
					var thisHeight = $(this).find('>div').outerHeight(false);

					if (maxHeight < thisHeight) {
						maxHeight = thisHeight;
					}
				});

				owner._content.height(maxHeight);

				//owner._content.height(owner._content.children().first().find('>div').outerHeight(false));
				if (owner._content.height() === 0) {
					owner._content.height(owner._content.children().first().find('img').outerHeight(false));
				}
			}

			/*
			 if(owner._content.height()===0){
			 owner._content.children().first().find('img').on('load',function(){
			 owner._content.height($(this).outerHeight(false));
			 });
			 }
			 */
		}

		owner._target = owner.reset_target(owner._current);
		owner._pos = owner.reset_pos();
		owner.resizing_scope(owner._current);

		// PDP gallery
		if (owner._scope.data('type') == 'main') {
			if ($('*[data-role=ui-flick-num]').length) {
				owner._num = $('*[data-role=ui-flick-num]');
				owner._num.find('span.current-num').text(owner._current + 1);

				/*
				 // 항목이 2개인 경우
				 if (owner._case) {
				 _common.trace('>> reset, case: ' + owner._case);
				 owner._num.find('span.all-num').text(2);
				 }
				 else {
				 _common.trace('>> reset, case: ' + owner._case);
				 owner._num.find('span.all-num').text(owner._length);
				 }
				 */

				owner._num.find('span.all-num').text(owner._length);
				//var itemLen = $('*[data-role=ui-slide-res]').filter('*[data-type=main]').data().slide._child.length;

				var itemLen = ($('*[data-role=ui-flick]').filter('*[data-type=main]').find('*[data-role=ui-flick-content]').children().filter('*[data-clone=clone]').length == 0) ? owner._content.children().length : 2;

				owner._num.find('span.all-num').text(itemLen);

				if (itemLen == 2) {
					$('*[data-role=ui-flick]').filter('*[data-type=main]').data()._case = true;
				} else {
					$('*[data-role=ui-flick]').filter('*[data-type=main]').data()._case = false;
				}

				owner._num.css({
					'visibility' : 'visible'
				});
			}
		}

		owner._scope.css({
			'visibility' : 'visible'
		});

		if (owner._flag.auto && owner._length > 1) {
			owner.autoplay();
		}

		// 컨텐츠영역 접근성
		owner._content.find('> li').each(function(idx) {
			$(this).attr('tabindex', '0');

			$(this).bind({
				'focusin' : function(e) {
					var self = $(this);
					var idx = $(this).index();

					if (owner._current == idx) {
						owner.stop_autoplay();
						owner._flag.auto = false;

						self.attr('tabindex', '0').find('a, button').attr('tabindex', '0');
						self.siblings().attr('tabindex', '-1').find('a, button').attr('tabindex', '-1');
					} else {
						owner._content.find('> li').eq(owner._current).focus();
					}
				},
				'keydown' : function(e) {
					var self = $(this);
					var keyCode = e.keyCode;
					var tabKey = (keyCode == 9) ? true : false;
					var shiftKey = (e.shiftKey) ? true : false;

					if (tabKey && shiftKey) {
						e.preventDefault();

						owner.autoplay();
						owner._flag.auto = true;

						$('*[data-role=ui-btn-show-smartfinder]').focus();
					}
				}
			});
		});

		// 컨텐츠 버튼들 접근성
		owner._content.find('a, button').bind({
			'focusin' : function(e) {
				e.stopPropagation();

				owner.stop_autoplay();
				owner._flag.auto = false;
			},
			'keydown' : function(e) {
				e.stopPropagation();
			}
		});

		// 컨트롤러 접근성
		owner._scope.find('div.ctl-carousel button').each(function(idx) {
			var self = $(this);
			var lastLen = owner._scope.find('div.ctl-carousel button').length;
			var prevBtn = owner._scope.find('*[data-role=ui-flick-prev]');
			var nextBtn = owner._scope.find('*[data-role=ui-flick-next]');

			// prev
			if (self[0] === prevBtn[0]) {
				self.bind({
					'keydown' : function(e) {
						var keyCode = e.keyCode;
						var tabKey = (keyCode == 9) ? true : false;
						var shiftKey = (e.shiftKey) ? true : false;

						if (tabKey && shiftKey) {
							e.preventDefault();

							owner._content.find('> li').eq(owner._current).focus();

							if (owner._content.find('> li').eq(owner._current).find('a, button').length) {
								owner._content.find('> li').eq(owner._current).find('a, button').last().focus();
							}
						}
					},
					'focusin' : function(e) {
						e.stopPropagation();

						owner.stop_autoplay();
						owner._flag.auto = false;
					}
				});
			} else {
				self.bind({
					'focusin' : function(e) {
						e.stopPropagation();

						owner.stop_autoplay();
						owner._flag.auto = false;
					},
					'focusout' : function(e) {
						owner.autoplay();
						owner._flag.auto = true;
					}
				});
			}
		});
	},

	/**
	 * build-navigation
	 *
	 * @private
	 * @return		{void}
	 */
	build_navigate : function() {
		var owner = this;

		var target = (owner._scope.find('*[data-role=ui-flick-navigate]').find('button').length) ? owner._scope.find('*[data-role=ui-flick-navigate] button') : owner._scope.find('*[data-role=ui-flick-navigate] a');

		if (target.length) {
			var owner = this;

			owner._navigate = target;
			owner._navigate.each(function(a) {
				$(this).data({
					'cnt' : a,
					'parent' : $(this).parent()
				}).css('cursor', 'pointer');

				if (a === owner._current) {
					owner.active_navigate($(this));
				}
			});
		}
	},

	/**
	 * transition
	 *
	 * @private
	 * @return		{void}
	 */
	build_event : function() {
		var owner = this;

		owner._container.off('touchstart').off('touchmove').off('touchend').on({
			'touchstart' : function(e) {
				// 모바일에서 2개이상일때만 터치이벤트 바인드
				if (owner._scope.find('*[data-role=ui-flick-content]').children().length > 1) {
					owner.touch_start.call(owner, e);
				}
			},

			'touchmove' : function(e) {
				// 모바일에서 2개이상일때만 터치이벤트 바인드
				if (owner._scope.find('*[data-role=ui-flick-content]').children().length > 1) {
					owner.touch_move.call(owner, e);
				}
			},

			'touchend' : function(e) {
				// 모바일에서 2개이상일때만 터치이벤트 바인드
				if (owner._scope.find('*[data-role=ui-flick-content]').children().length > 1) {
					owner.touch_end.call(owner, e);
				}
			}
		});

		owner._scope.find('*[data-role=ui-flick-prev]').on('click', function(e) {
			// PDP Gallary Prev event
			if (!owner._flag.slide) {
				if (owner._flag.auto) {
					owner.stop_autoplay();
				}

				owner._flag.slide = true;
				owner.transition(1);

				// PDP: analytics tagging add
				if (owner._scope.data('type') == 'main') {
					//sendClickCode('pdp_gallery', 'gallery:left arrow');
				}
			}
		});

		owner._scope.find('*[data-role=ui-flick-next]').on('click', function(e) {
			if (!owner._flag.slide) {
				// PDP Gallary Prev event
				if (owner._flag.auto) {
					owner.stop_autoplay();
				}

				owner._flag.slide = true;
				owner.transition(-1);

				// PDP: analytics tagging add
				if (owner._scope.data('type') == 'main') {
					//sendClickCode('pdp_gallery', 'gallery:right arrow');
				}
			}
		});

		if (owner._navigate !== null) {
			owner._navigate.on('click', function() {
				if (!owner._flag.slide) {
					if (owner._flag.auto) {
						owner.stop_autoplay();
					}

					owner._flag.slide = true;

					var dir = 0;
					var current = (owner._case) ? owner._current % 2 : owner._current;

					if (current > $(this).data('cnt')) {
						dir = 1;
					} else if (current < $(this).data('cnt')) {
						dir = -1;
					}

					owner.transition(dir, $(this).data('cnt'));

					if (owner._current_navigate) {
						owner.deActive_navigate(owner._current_navigate);
					}

					owner.active_navigate($(this));
				}
			});
		}
	},

	/**
	 * touch-start
	 *
	 * @private
	 * @param		{Object} e - event객체
	 * @return		{void}
	 */
	touch_start : function(e) {
		var owner = this;
		
		if (e.type == 'touchstart' && e.originalEvent.touches.length <= 1) {
			owner._start.x = e.pageX || e.originalEvent.touches[0].pageX;
			owner._start.y = e.pageY || e.originalEvent.touches[0].pageY;
			owner._flag.scroll = false;

			if (owner._flag.auto) {
				owner.stop_autoplay();
			}
		}
	},

	/**
	 * touch-move
	 *
	 * @private
	 * @param		{Object} e - event객체
	 * @return		{void}
	 */
	touch_move : function(e) {
		if (e.type == 'touchmove' && e.originalEvent.touches.length <= 1) {
			var owner = this;

			owner._amount.x = (e.pageX || e.originalEvent.touches[0].pageX) - owner._start.x;
			owner._amount.y = (e.pageY || e.originalEvent.touches[0].pageY) - owner._start.y;

			var x = Math.abs(owner._amount.x);
			var y = Math.abs(owner._amount.y);

			if ((x < y && !owner._flag.drag) || owner._flag.scroll) {
				owner._flag.drag = false;
				owner._flag.scroll = true;
			} else {
				if (navigator.userAgent.indexOf("android 4.1") > -1) {
					e.stopPropagation();
				} else {
					e.preventDefault();
				}

				owner._flag.drag = true;
				owner._flag.scroll = false;

				if (owner._isCss) {
					for (var i = 0; i < owner._target.length; i++) {
						var pos = owner._pos[i] + owner._amount.x;

						owner._content.children().eq(owner._target[i]).css({
							'trasition' : '0ms',
							'transform' : 'translate(' + pos + 'px,0) translateZ(0)',
							'-webkit-trasition' : '0ms',
							'-webkit-transform' : 'translate(' + pos + 'px,0) translateZ(0)',
							'-moz-trasition' : '0ms',
							'-moz-transform' : 'translate(' + pos + 'px,0) translateZ(0)',
							'-o-trasition' : '0ms',
							'-o-transform' : 'translate(' + pos + 'px,0) translateZ(0)',
							'-ms-trasition' : '0ms',
							'-ms-transform' : 'translate(' + pos + 'px,0)'
						});
					}
				} else {
					for (var i = 0; i < owner._target.length; i++) {
						var pos = owner._pos[i];

						if (_common._isRTL) {
							pos -= owner._amount.x;
							owner._content.children().eq(owner._target[i]).css({
								'right' : pos + 'px'
							});
						} else {
							pos += owner._amount.x;
							owner._content.children().eq(owner._target[i]).css({
								'left' : pos + 'px'
							});
						}

					}
				}
			}
		}
	},

	/**
	 * touch-end
	 *
	 * @private
	 * @param		{Object} e - event객체
	 * @return		{void}
	 */
	touch_end : function(e) {
		var owner = this;
		
		if (e.type == 'touchend' && e.originalEvent.touches.length <= 1) {
			if (owner._flag.scroll) {
				owner._flag.drag = false;
				return;
			}

			var d = owner.get_direction();
			
			if (_common._isRTL) {
				d = d * -1;	
			}
			
			if (owner._flag.drag) {
				owner.transition(d);
			} else {
				if (owner._flag.auto) {
					owner.autoplay();
				}
			}
			owner._flag.drag = false;

			//e.stopPropagation();
		}
	},

	/**
	 * transition
	 *
	 * @private
	 * @param		{Number} dir - 이동 방향 [-1 | 1]
	 * @param		{Number} cnt - 이동할 화면 번호
	 * @param		{Boolean} f  - class 내부적으로 호출됬는지 여부
	 *
	 * @return		{void}
	 */
	transition : function(dir, cnt, f) {
		var owner = this;

		if (owner._current === cnt) {
			owner._flag.slide = false;
			if (owner._flag.auto) {
				owner.autoplay();
			}
			return;
		}

		if ( typeof cnt !== 'undefined') {
			owner.fix_target(dir, cnt);
		}

		owner.sliding(dir, cnt, f);

		//이미지 슬라이딩 중 비디오플레이어 stop
		var target = $(owner._content).find('>li:eq(' + (owner._current - dir) + ')>div>*[data-role=common-video-player]');
		if ($(target).length) {
			_common._ui.manager.stop_video();
		}
	},

	/**
	 * sliding
	 *
	 * @private
	 * @param		{Number} dir - 이동 방향 [-1 | 1]
	 * @param		{Number} cnt - 이동할 화면 번호
	 * @param		{Boolean} f  - class 내부적으로 호출됬는지 여부
	 *
	 * @return		{void}
	 */
	sliding : function(dir, cnt, f) {
		var owner = this;
		var flag_finish = false;

		if (owner._isCss) {
			setTimeout(function() {
				for (var i = 0; i < owner._target.length; i++) {
					var pos = owner._pos[i] + (dir * owner._w);

					if (owner._target[i] >= 0) {
						owner._content.children().eq(owner._target[i]).css({
							'transition' : owner._transition.speed + 'ms',
							'transform' : 'translate(' + pos + 'px,0) translateZ(0)',
							'-webkit-transition' : owner._transition.speed + 'ms',
							'-webkit-transition-timing-function-' : 'ease-out',
							'-webkit-transform' : 'translate(' + pos + 'px,0) translateZ(0)',
							'-moz-transition' : owner._transition.speed + 'ms',
							'-moz-transform' : 'translate(' + pos + 'px,0) translateZ(0)',
							'-o-transition' : owner._transition.speed + 'ms',
							'-o-transform' : 'translate(' + pos + 'px,0) translateZ(0)',
							'-ms-transition' : owner._transition.speed + 'ms',
							'-ms-transform' : 'translate(' + pos + 'px,0)'
						}).on({
							'webkitTransitionEnd msTransitionEnd oTransitionEnd otransitionend transitionend' : function() {
								if (!flag_finish) {
									flag_finish = true;
									owner.finish_sliding(dir, cnt, f);
								}

								$(this).off('webkitTransitionEnd msTransitionEnd oTransitionEnd otransitionend transitionend');
							}
						});
					}
				}
			}, 0);
		} else {
			var last = (owner._target[owner._target.length - 1] < 0) ? owner._target.length - 2 : owner._target.length - 1;

			for (var i = 0; i < owner._target.length; i++) {
				var pos = owner._pos[i] + (dir * owner._w);

				if (owner._target[i] >= 0) {

					if (_common._isRTL) {
						owner._content.children().eq(owner._target[i]).stop().animate({
							'right' : pos + 'px'
						}, owner._transition.speed, function() {
							if ($(this).index() === owner._target[last]) {
								owner.finish_sliding(dir, cnt, f);
							}
						});
					} else {
						owner._content.children().eq(owner._target[i]).stop().animate({
							'left' : pos + 'px'
						}, owner._transition.speed, function() {
							if ($(this).index() === owner._target[last]) {
								owner.finish_sliding(dir, cnt, f);
							}
						});
					}
				}
			}
		}
	},

	/**
	 * finish_sliding
	 *
	 * @private
	 * @param		{Number} dir - 이동 방향 [-1 | 1]
	 * @param		{Number} cnt - 이동할 화면 번호
	 * @param		{Boolean} f  - class 내부적으로 호출됬는지 여부
	 *
	 * @return		{void}
	 */
	finish_sliding : function(dir, cnt, f) {
		var owner = this;
		
		if ( typeof cnt !== 'undefined') {
			owner._current = cnt;
		} else {
			owner.reset_current(dir, f);
		}

		owner.reset_content();

		if (dir !== 0) {
			owner._pos = owner.reset_pos();
			owner._target = owner.reset_target(owner._current);
			owner.resizing_scope();
			owner._flag.slide = false;
			//$('document,body').scrollTop(0);

			if (owner._navigate !== null) {
				var idx = owner._current;

				if (idx > owner._length - 1)
					idx = 0;
				else if (idx < 0)
					idx = owner._length - 1;

				owner.deActive_navigate(owner._current_navigate);

				if (owner._case) {
					idx = idx % 2;
				}

				owner.active_navigate(owner._navigate.eq(idx));
			}
		}

		if (owner._flag.auto) {
			owner.autoplay();
		}
	},

	/**
	 * active_navigate
	 *
	 * @private
	 * @description
	 * navigate 활성화
	 *
	 * @param	{jQuery Object} item - navigate dom 객체
	 *
	 * @return {void}
	 */
	active_navigate : function(item) {
		item.data('parent').addClass('current');
		this._current_navigate = item;
	},

	/**
	 * deActive_navigate
	 *
	 * @private
	 * @description
	 * navigate 비 활성화
	 *
	 * @param	{jQuery Object} item - navigate dom 객체
	 *
	 * @return {void}
	 */
	deActive_navigate : function(item) {
		item.data('parent').removeClass('current');
	},

	/**
	 * autoplay
	 *
	 * @private
	 * @return {void}
	 */
	autoplay : function() {
		var owner = this;

		if (owner._scope.find('*[data-role=ui-flick-auto]').hasClass('pause')) {
			if (owner._interval !== null) {
				clearInterval(owner._interval);
				owner._interval = null;
			}

			owner._interval = setInterval(function() {
				owner.transition(-1);
			}, owner._transition.time);
		}
	},

	/**
	 * stop-autoplay
	 *
	 * @private
	 * @return {void}
	 */
	stop_autoplay : function() {
		var owner = this;

		if (owner._interval !== null) {
			clearInterval(owner._interval);
			owner._interval = null;
		}
	},

	/**
	 * reset_current
	 *
	 * @private
	 * @description
	 * 현재 화면 초기화
	 *
	 * @param	{Number} d - 이동방향(-1:오른쪽, 1:왼쪽)
	 */
	reset_current : function(d) {
		var owner = this;
		
		switch(d) {
			case -1:
				owner._current += 1;

				if (owner._current > owner._length - 1) {
					owner._current = 0;
				}

				break;

			case 1:
				owner._current -= 1;

				if (owner._current < 0) {
					owner._current = owner._length - 1;
				}

				break;

			default:
				break;
		}

		if ($('*[data-role=ui-flick-num]').length) {
			owner._num.find('span.current-num').text(owner._current + 1);
		}
	},

	/**
	 * get-direction
	 *
	 * @private
	 * @description
	 * 플리킹 종료 후 이동방향
	 *
	 * @return	{Number} _r - 이동방향(-1:오른쪽, 1:왼쪽)
	 */
	get_direction : function() {
		var owner = this;
		var _r = 0;

		if (owner._amount.x > owner._range) {
			_r = 1;
		} else if (owner._amount.x < -owner._range) {
			_r = -1;
		}

		return _r;
	},

	/**
	 * get-css
	 *
	 * @private
	 * @description
	 * css 트랜지션 지원 여부
	 *
	 * @return	{Boolean} - transition 속성이 있다면 true, 없다면 false 반환
	 */
	get_css : function() {
		var f = document.createElement('flick');
		var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
		var isChrome = /(Chrome)/g.test(navigator.userAgent);
		var isIE = (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) ? true : false;

		// 크롬에서 transition 사용시, 레이어팝업이 깜박거리는 이슈 있어서 크롬은 제외함.
		if (isChrome || isIE) {
			return false;
		} else {
			for (var i in props ) {
				if (f.style[props[i]] !== undefined) {
					return true;
				}

				return false;
			}
		}
	},

	/**
	 * reset_target
	 *
	 * @private
	 * @description
	 * 플리킹할 컨텐츠 타겟 설정
	 *
	 * @param	{Number} c   - 현재 보여지는 컨텐츠 index
	 *
	 * @return	{Array}  arr - 플리킹할 컨텐츠 타겟(이전,현재,다음)
	 */
	reset_target : function(c) {
		var arr = [];

		if (c === 0) {
			arr = [this._length - 1, c, c + 1];
		} else if (c === this._length - 1) {
			arr = [c - 1, c, 0];
		} else {
			arr = [c - 1, c, c + 1];
		}

		return arr;
	},

	/**
	 * reset_pos
	 *
	 * @private
	 * @description
	 * 플리킹할 컨텐츠 위치 초기화
	 *
	 * @return	{Array}  arr - 플리킹할 컨텐츠 타겟(이전,현재,다음)
	 */
	reset_pos : function() {
		/*
		 var arr=null;

		 if(this._isCss) arr=[-this._w, 0, this._w]; else arr=[-(100/this._length),0,100/this._length];
		 */

		return [-this._w, 0, this._w];
	},

	/**
	 * reset_content
	 *
	 * @private
	 * @description
	 * 방향에 따라 이동 후 컨텐츠 위치 초기화
	 *
	 * @return	{void}
	 */
	reset_content : function() {
		var owner = this;

		owner._content.children().each(function(a) {
			var pos = 1;

			if (owner._current === 0) {
				if (a === owner._length - 1) {
					pos = -1;
				}
			} else if (owner._current === owner._length - 1) {
				if (a !== 0) {
					pos = -1;
				}
			} else {
				if (a < owner._current) {
					pos = -1;
				}
			}

			if (a === owner._current) {
				pos = 0;
			}

			if (owner._isCss) {
				$(this).css({
					'transition' : '0ms',
					'transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
					'-webkit-transition' : '0ms',
					'-webkit-transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
					'-moz-transition' : '0ms',
					'-moz-transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
					'-o-transition' : '0ms',
					'-o-transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
					'-ms-transition' : '0ms',
					'-ms-transform' : 'translate(' + (pos * owner._w) + 'px,0)'
				});
			} else {
				if (_common._isRTL) {
					$(this).css('right', (pos * owner._w) + 'px');
				} else {
					$(this).css('left', (pos * owner._w) + 'px');
				}
			}
		});
	},

	/**
	 * fix-target
	 *
	 * @private
	 * @description
	 * navigate로 이동할 경우 컨텐츠 위치 조정
	 *
	 * @param	{Number} dir - 이동방향(-1:오른쪽, 1:왼쪽)
	 * @param	{Number} cnt - 이동할 화면 번호
	 *
	 * @return	{void}
	 */
	fix_target : function(dir, cnt) {
		var owner = this;

		switch(dir) {
			case -1:
				if ($.inArray(cnt, owner._target) !== -1) {
					owner._target[$.inArray(cnt, owner._target)] = -1;
				}

				owner._target[2] = cnt;

				break;

			case 1:
				if ($.inArray(cnt, owner._target) !== -1) {
					owner._target[$.inArray(cnt, owner._target)] = -1;
				}

				owner._target[0] = cnt;

				break;
		}

		if ((owner._current === 0 && cnt === owner._length - 1) || (owner._current === owner._length - 1 && cnt === 0)) {
			dir = dir * -1;

			if (owner._isCss) {
				owner._content.children().eq(cnt).css({
					'trasition' : '0ms',
					'transform' : 'translate(' + (dir * owner._w) + 'px,0) translateZ(0)',
					'-webkit-trasition' : '0ms',
					'-webkit-transform' : 'translate(' + (dir * owner._w) + 'px,0) translateZ(0)',
					'-moz-trasition' : '0ms',
					'-moz-transform' : 'translate(' + (dir * owner._w) + 'px,0) translateZ(0)',
					'-o-trasition' : '0ms',
					'-o-transform' : 'translate(' + (dir * owner._w) + 'px,0) translateZ(0)',
					'-ms-trasition' : '0ms',
					'-ms-transform' : 'translate(' + (dir * owner._w) + 'px,0)'
				});
			} else {
				if (_common._isRTL) {
					owner._content.children().eq(cnt).css('right', (dir * owner._w) + 'px');
				} else {
					owner._content.children().eq(cnt).css('left', (dir * owner._w) + 'px');
				}
			}
		}
	},

	/**
	 * resizing
	 *
	 * @private
	 * @description
	 * 현재 화면에 맞게 scope 높이 조절
	 *
	 * @return	{void}
	 */
	resizing_scope : function() {
		var owner = this;

		// sub 타입인 경우 (sample image)
		// ui.slide.res.js에서 리사이징을 하는데, 실행 시점이 안맞아 ui.flick.js에서 처리함
		if (owner._scope.data('type') == 'sub') {
			var h = owner._content.find('img').first().height();
			owner._scope.height(h);
			owner._content.height(h);
		} else {
			// KV, PDP Sample image
			if (owner._scope.data('type') != 'main') {
				owner._scope.height(owner._content.children().eq(owner._current).height());
			}
		}
		
		owner.control();
	},

	resizing : function() {
		this.build_content(this._current);
	}

});
