/*!
 * @class	{Class} LayerUI
 */
var LayerUI = Class.extend({
	/**
	 * initialize
	 *
	 * @constructs
	 * @extends	{Class}
	 * @requires	jquery.js
	 * @classdesc
	 * 레이어 팝업 생성<br/>
	 * (data-role 속성으로 자동 생성)
	 *
	 * @param		{DOM} scope - 컨테이너
	 *
	 * @example
	 *
	 * <!--
	 *    data-role="ui-layer-name" - 컨테이너
	 *    data-role="ui-btn-name"   - 레이어 열기 버튼
	 * -->
	 *
	 */
	init : function(scope) {
		this._scope = $(scope);
		this._arrow = {
			'top' : null,
			'bottom' : null
		};
		this._btn = null;
		this._btn_close = null;
		this._current = null;

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
	},

	/**
	 * build-content
	 *
	 * @private
	 * @return		{void}
	 */
	build_content : function() {
		var owner = this;
		var btn_str = owner._scope.attr('data-role').split('-')[2];
		owner._btn = $('*[data-role=ui-btn-' + btn_str + ']');
		owner._btn.each(function(a) {
			$(this).data('cnt', a);
		});

		owner._btn_close = owner._scope.find('*[data-role=ui-layer-close]');
		owner._arrow.top = owner._scope.find('.arrow');
		owner._arrow.bottom = owner._scope.find('.arrow2');
	},

	/**
	 * build-event
	 *
	 * @private
	 * @return		{void}
	 */
	build_event : function() {
		var owner = this;

		owner._btn.on('click', function(e) {
			e.preventDefault();
			if (owner._current) {
				owner.deActive();
				if (owner._current.data('cnt') === $(this).data('cnt')) {
					owner._current = null;
					return;
				}
			}
			owner.transition($(this));
			owner.active($(this));

			if ($('*[data-role=ui-layer-compare]').length) {
				var compare = $('*[data-role=ui-layer-compare]').data('compare');
				compare.deActive();
				compare._current = null;
			}
		});

		owner._btn_close.on('click', function(e) {
			e.preventDefault();

			owner.deActive();
			owner._current = null;
		});

		$(window).on('resize', function() {
			if (owner._current) {
				owner.transition(owner._current);
			}
		});
	},

	/**
	 * transition
	 *
	 * @public
	 * @param		{jQuery Object} item - 버튼
	 *
	 * @return		{void}
	 */
	transition : function(item) {
		var owner = this;
		var w = $(window).width();
		var h = $(window).height();
		var sct = $(window).scrollTop();
		var scope = owner.get_info(owner._scope);
		var arrow = owner.get_info(owner._arrow.top);
		var btn = owner.get_info(item);
		var target_x = btn.ax + (btn.w / 2) - (scope.w / 2);
		var target_y = btn.ay + btn.h + arrow.h;

		arrow.rx = (scope.w / 2) - (arrow.w / 2);

		for (var i in owner._arrow) {
			owner._arrow[i].css({
				'left' : arrow.rx + 'px'
			});
		}

		if (w - btn.ax - (btn.w / 2) < scope.w / 2) {
			var temp_x = target_x;
			target_x = w - scope.w;
			var gap = temp_x - target_x;

			for (var i in owner._arrow) {
				owner._arrow[i].css({
					'left' : (arrow.rx + gap) + 'px'
				});
			}
		} else if (btn.ax + (btn.w / 2) < scope.w / 2) {
			target_x = 0;

			for (var i in owner._arrow) {
				owner._arrow[i].css({
					'left' : (btn.ax + (btn.w / 2) - (arrow.w / 2)) + 'px'
				});
			}
		}

		if (h + sct - (btn.ay + btn.h + arrow.h) < scope.h && scope.h + arrow.h < btn.ay) {
			target_y = btn.ay - scope.h - arrow.h;

			owner._arrow.top.hide();
			owner._arrow.bottom.show();
		} else {
			owner._arrow.top.show();
			owner._arrow.bottom.hide();
		}

		owner._scope.css({
			'left' : target_x + 'px',
			'top' : target_y + 'px'
			//'z-index' : 100000
		});
	},

	/**
	 * get-info
	 *
	 * @private
	 *
	 * @return		{Object}
	 *
	 * <pre class="prettyprint">
	 * {
	 *		'w':{Number},	// 가로 넓이
	 *		'h':{Number}	// 세로 넓이
	 *		'ax':{Number}	// 상대위치 가로축 좌표
	 *		'ay':{Number}	// 상대위치 세로축 좌표
	 *		'rx':{Number}	// 절대위치 가로축 좌표
	 *		'xy':{Number}	// 절대위치 세로축 좌표
	 * }
	 * </pre>
	 */
	get_info : function(item) {
		return {
			'w' : item.outerWidth(),
			'h' : item.outerHeight(),
			'ax' : item.offset().left,
			'ay' : item.offset().top,
			'rx' : item.position().left,
			'ry' : item.position().top
		};
	},

	/**
	 * active
	 *
	 * @private
	 * @param		{jQuery Object} item - 버튼
	 *
	 * @return		{void}
	 */
	active : function(item) {
		this._scope.show();
		this._current = item;
	},

	/**
	 * deActive
	 *
	 * @private
	 *
	 * @return		{void}
	 */
	deActive : function() {
		this._scope.hide();
	}
}); 