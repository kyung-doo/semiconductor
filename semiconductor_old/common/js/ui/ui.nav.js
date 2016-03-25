/*!
 * @class	{Class} NavUI
 */
var NavUI = Class.extend({
	/**
	 * initialize
	 *
	 * @constructs
	 * @extends	{Class}
	 * @requires	jquery.js
	 * @classdesc
	 * gnb generation
	 *
	 * @param		{DOM} scope - container
	 *
	 * @example
	 *
	 * <!--
	 *    data-role="ui-nav"     - 컨테이너
	 *    data-role="ui-nav-sub" - 서브메뉴
	 *    data-role="ui-nav-btn" - 모바일에서 gnb 열기
	 * -->
	 *
	 */
	init : function(scope) {
		this._scope = $(scope);
		this._content = null;
		this._sub = null;
		this._default = null;
		this._btn = null;
		this._current = {
			'depth_1' : null,
			'depth_2' : null
		};
		this._active = true;

		this.reinit();
	},

	/**
	 * re-initialize
	 *
	 * @private
	 * @return		{void}
	 */
	reinit : function() {
		this.build_content();
		this.build_event();
		this.build_resize();
	},

	/**
	 * build-content
	 *
	 * @private
	 * @return		{void}
	 */
	build_content : function() {
		var owner = this;
		var code = owner.get_gnb_code(window.location.pathname.split('/')[3]);

		owner._content = owner._scope.find('>li>a');
		owner._content.each(function() {
			$(this).data('parent', $(this).parent());
			$(this).data('cnt', $(this).parent().index());

			if ($(this).data('parent').attr('data-gnb') === code) {
				$(this).data('parent').addClass('active');
				owner._default = $(this).data('parent');
			}
		});

		owner._sub = owner._scope.find('*[data-role=ui-nav-sub]>li>a');
		owner._sub.each(function() {
			$this = $(this);
			$this.data('parent', $this.parent());
			$this.data('cnt', $this.parent().index());
			
			/*
			if($this.parent().find('ul').length > 0){
				$this.attr('href', 'javascript:void(0)');
			}
			*/
		});

		owner._btn = $('*[data-role=ui-nav-btn]');
		owner._btn.data('wrap', $('*[data-role=ui-nav-wrap]'));
	},

	/**
	 * build-event
	 *
	 * @private
	 * @return		{void}
	 */
	build_event : function() {
		var owner = this;
		var w = $(window).width();

		if (w <= 1024) {
			owner._active = false;
			owner.remove_event_d();
			owner.m_event();
		} else {
			owner.remove_event_m();
			owner.d_event();
		}
	},

	/**
	 * d-event
	 *
	 * @private
	 * @description
	 * 데스크탑 이벤트
	 *
	 * @return		{void}
	 */
	d_event : function() {
		var owner = this;

		owner._content.on({
			'mouseenter' : function() {
				for (var i in owner._current) {
					if (owner._current[i])
						owner.deActive_item(owner._current[i]);
				}

				owner.active_item($(this), 1);
			},

			'focus' : function() {
				for (var i in owner._current) {
					if (owner._current[i])
						owner.deActive_item(owner._current[i]);
				}

				owner.active_item($(this), 1);
			}
		});

		owner._sub.on({
			'mouseenter' : function() {
				if (owner._current.depth_2)
					owner.deActive_item(owner._current.depth_2);
				owner.active_item($(this), 2);
			},

			'focus' : function() {
				if (owner._current.depth_2)
					owner.deActive_item(owner._current.depth_2);
				owner.active_item($(this), 2);
			}
		});

		owner._scope.on('mouseleave', function() {
			owner.reset();
		});
	},

	/**
	 * m-event
	 *
	 * @private
	 * @description
	 * 모바일 이벤트
	 *
	 * @return		{void}
	 */
	m_event : function() {
		var owner = this;

		owner._content.on('click', function() {
			if (owner._current.depth_1) {
				if (owner._current.depth_1.data('cnt') === $(this).data('cnt')) {
					owner.reset();
					return;
				}

				owner.reset();
			}

			owner.active_item($(this), 1);
		});

		owner._sub.on('click', function() {
			if (owner._current.depth_2) {
				owner.deActive_item(owner._current.depth_2);

				if (owner._current.depth_2.data('cnt') === $(this).data('cnt')) {
					owner._current.depth_2 = null;
					return;
				}
			}
			owner.active_item($(this), 2);
		});

		owner._btn.on('click', function() {
			owner.slide($(this).data('wrap'));
			
			if($('div[data-role="ui-nav-wrap"]').hasClass('nav-on')){
				sendClickCode('gnb','gnb open');
			}
		});

		$('div.overlay').on('click', function() {
			owner._btn.trigger('click');
		});
	},

	/**
	 * remove-event-d
	 *
	 * @private
	 * @description
	 * 데스크탑 이벤트 삭제
	 *
	 * @return		{void}
	 */
	remove_event_d : function() {
		var owner = this;
		
		owner._content.off('mouseenter focus');
		owner._sub.off('mouseenter focus');
		owner._scope.off('mouseleave');
	},

	/**
	 * remove-event-m
	 *
	 * @private
	 * @description
	 * 모바일 이벤트 삭제
	 *
	 * @return		{void}
	 */
	remove_event_m : function() {
		var owner = this;
		
		owner._content.off('click');
		owner._sub.off('click');
		owner._btn.off('click');
		$('div.overlay').off('click');
	},

	/**
	 * build-resize
	 *
	 * @private
	 * @description
	 * 반응형에 따른 이벤트 등록 및 삭제
	 *
	 * @return		{void}
	 */
	build_resize : function() {
		var owner = this;

		$(window).on('resize', function() {
			var w = window.innerWidth;
			var limit = 1024;
			
			if (w <= limit) {
				if (owner._active) {
					owner._active = false;
					owner.remove_event_d();
					owner.m_event();
					owner.reset();
				}
			} else {
				if (!owner._active) {
					owner._active = true;
					owner.remove_event_m();
					owner.d_event();

					if (owner._btn.data('wrap').hasClass('nav-on'))
						owner.slide(owner._btn.data('wrap'));
				}
			}
		});
	},

	/**
	 * active-item
	 *
	 * @private
	 * @param       {jQuery Object} item  - 해당 메뉴 객체
	 * @param       {Number} depth        - 해당 메뉴 뎁스
	 * @return		{void}
	 */
	active_item : function(item, depth) {
		var owner = this;
		
		item.data('parent').addClass('on');

		if (owner._default !== null)
			owner._default.removeClass('active');

		owner._current['depth_' + depth] = item;
	},

	/**
	 * deActive-item
	 *
	 * @private
	 * @param       {jQuery Object} item  - 해당 메뉴 객체
	 * @return		{void}
	 */
	deActive_item : function(item) {
		item.data('parent').removeClass('on');
	},

	/**
	 * reset
	 *
	 * @private
	 * @description
	 * 메뉴 리셋
	 *
	 * @return		{void}
	 */
	reset : function() {
		var owner = this;
		
		for (var i in owner._current) {
			if (owner._current[i])
				owner.deActive_item(owner._current[i]);
			owner._current[i] = null;
		}

		if (owner._default !== null)
			owner._default.addClass('active');
	},

	/**
	 * slide
	 *
	 * @private
	 * @description
	 * 모바일에서 메뉴 슬라이드
	 *
	 * @param       {jQuery Object} item  - 모바일에서 메뉴열기 버튼
	 * @return		{void}
	 */
	slide : function(item) {
		var x = 0;
		var _f = null;
		var flag = $('*[data-role=ui-flick]').length ? true : false;

		if (flag)
			_f = $('*[data-role=ui-flick]').data('flick');

		if (!item.hasClass('nav-on')) {
			//x=-280;
			item.addClass('nav-on');

			if (flag)
				_f.stop_autoplay();
		} else {
			item.removeClass('nav-on');
			this.reset();

			if (flag)
				_f.autoplay();
		}
	},

	/**
	 * get-gnb-code
	 *
	 * @private
	 * @param {String} name - 메뉴명
	 *
	 * @return	{String} code - 메뉴코드
	 */
	get_gnb_code : function(name) {
		var code = '';

		switch(name) {
		case 'industry':
			code = 'BIA001';
			break;

		case 'solutions-services':
			code = 'BIA002';
			break;

		case 'business-products':
			code = 'BIA003';
			break;

		case 'insights':
			code = 'BIA004';
			break;

		case 'support':
			code = 'BIA005';
			break;
		
		case 'promotions':
			code = 'BIA006';
			break;

		default:
			break;
		}

		return code;
	}
}); 