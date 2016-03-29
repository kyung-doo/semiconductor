/*!
 * @class	{Class} JumpBasicUI
 */
var JumpBasicUI = Class.extend({
	/**
	 * initialize
	 *
	 * @constructs
	 * @extends	{Class}
	 * @requires	jquery.js
	 * @classdesc
	 * 점프 메뉴 생성<br/>
	 * (data-role 속성으로 자동 생성)
	 *
	 * @param		{DOM} scope - 컨테이너
	 *
	 * @example
	 *
	 * <!--
	 *    data-role="ui-jump-target"    - 점프 메뉴별 타겟 컨테이너
	 *    data-role="ui-jump"           - 컨테이너
	 *    data-role="ui-jump-container" - 점프 컨테이너
	 *    data-role="ui-jump-toggle"    - 모바일에서 점프메뉴 열기 버튼
	 *    data-role="ui-jump-menu"      - 점프 메뉴
	 * -->
	 *
	 */
	init : function(scope, jump_target) {
		this._scope = scope;
		this._target_type = null;
		
		// 중국처럼 jump_target이 없는 경우 keyvisual을 target으로 설정
		if (jump_target.length == 0) {
			jump_target = $('.key-visual');
		}

		// filter와 같이 타겟의 마크업이 desktop, mobile 두 벌로 되어있을 경우
		if (jump_target.mobile != undefined) {
			this._target_d = jump_target.desktop;
			this._target_m = jump_target.mobile;
			this._target_type = 'MULTI';
			this.check_screen();
			this.m_event();
		} else {
			this._target = jump_target;
			this.d_event();
		}
		this._temp_w = 0;
		this._limit = 0;
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

		var sct = $(window).scrollTop();
		this.fix_position(sct);
	},

	build_content : function() {
		this._scope.hide();
	},

	m_event : function() {
		var owner = this;

		$(window).on({
			'scroll' : function() {
				owner.check_screen();

				var sct = $(window).scrollTop();
				owner.fix_position(sct);
			},
			'resize' : function() {
				owner.check_screen();

				var sct = $(window).scrollTop();

				setTimeout(function() {
					owner.fix_position(sct);
				}, 0);
			}
		});
	},

	d_event : function() {
		var owner = this;

		$(window).on({
			'scroll' : function() {
				var sct = $(window).scrollTop();
				owner.fix_position(sct);
			},
			'resize' : function() {
				var sct = $(window).scrollTop();

				setTimeout(function() {
					owner.fix_position(sct);
				}, 0);
			}
		});
	},

	check_screen : function() {
		this._target = _common.is_mode() == 'MOBILE' ? this._target_m : this._target_d;
	},

	fix_position : function(t) {
		var owner = this;
		var w = $(window).width();

		//if (owner._limit===0 || w!==owner._temp_w) {
		owner._limit = owner._target.offset().top + owner._target.outerHeight();
		owner._temp_w = w;
		//}

		if (t >= this._limit) {
			owner._scope.css({
				'position' : 'fixed',
				'width' : '100%',
				'left' : 0,
				'top' : 0,
				'z-index' : 1000
			}).addClass('active');

			owner._scope.show();
		} else {
			owner._scope.css({
				'position' : 'relative',
				'z-index' : 1
			}).removeClass('active');

			owner._scope.hide();
		}
	}
});
