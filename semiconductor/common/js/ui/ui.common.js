/*!
 * @class	{Class} CommonUI
 */
var CommonUI = Class.extend({
	/**
	 * initailize
	 *
	 * @constructs
	 * @abstract
	 */
	init : function() {
		throw new Error('must be implemented by subclass!');
	},

	/**
	 * get-rectangle
	 *
	 * @public
	 * @description
	 * 표시 객체에 대한 위치, 영역 정보 취득
	 *
	 * @param		{Object} scope - 표시 객체
	 * @return		{Object}
	 *
	 * <pre class="prettyprint">
	 * {
	 *		ax:{Number},	// 가로 좌표(절대)
	 * 		ay:{Number},	// 세로 좌표(절대)
	 * 		rx:{Number},	// 가로 좌표(상대)
	 * 		ry:{Number},	// 세로 좌표(상대)
	 * 		w:{Number},	// 세로 길이
	 * 		h:{Number}		// 가로 길이
	 * }
	 * </pre>
	 */
	get_rectange : function(scope) {
		return {
			'ax' : $(scope).offset().left || 0,
			'ay' : $(scope).offset().top || 0,
			'rx' : $(scope).position().left || 0,
			'ry' : $(scope).position().top || 0,
			'w' : $(scope).width() || 0,
			'h' : $(scope).height() || 0
		};
	},

	/**
	 * get-total-height
	 *
	 * @public
	 * @description
	 * 표시 객체에 대한 전체 세로 길이 정보 취득
	 *
	 * @param		{Object} scope - 표시 객체
	 * @return		{Number} - 세로 전체 길이
	 */
	get_total_height : function(scope) {
		return $(scope).outerHeight(true);
	},

	/**
	 * get-total-width
	 *
	 * @public
	 * @description
	 * 표시 객체에 대한 전체 가로 길이 정보 취득
	 *
	 * @param		{Object} scope - 표시 객체
	 * @return		{Number} - 가로 전체 길이
	 */
	get_total_width : function(scope) {
		return $(scope).outerWidth(true);
	},

	/**
	 * define-collision
	 *
	 * @public
	 * @description
	 * 마우스의 좌표가 표시 객체 영역내에 있는지 확인
	 *
	 * @param		{Object} scope - 표시 객체
	 * @param		{Object} pos - 마우스 좌표
	 * @param		{Number} pos.left - 마우스 가로 좌표
	 * @param		{Number} pos.top - 마우스 세로 좌표
	 * @return		{Boolean} true | false
	 */
	is_collision : function(scope, pos) {
		var rect = this.get_rectange(scope);

		return ((pos.left >= rect.ax && pos.left <= rect.ax + rect.w) && (pos.top >= rect.ay && pos.top <= rect.ay + rect.h)
		) ? true : false;
	},

	/**
	 * toggle-image-src
	 *
	 * @public
	 * @description
	 * 이미지 변경
	 *
	 * @param		{Object} scope - <code>IMG</code> 객체
	 * @param		{String} from - 변경 전 값
	 * @param		{String} to - 변경 후 값
	 * @return		{void}
	 */
	toggle_img_url : function(img, from, to) {
		var url = $(img).attr('src');
		url = url.replace(from, to);

		$(img).attr('src', url);
	},

	/**
	 * show
	 *
	 * @public
	 * @description
	 * 표시/감춤
	 *
	 * @param		{Object} scope - 표시 객체
	 * @param		{Boolean} bool - true [표시] | false [감춤]
	 * @return		{void}
	 */
	show : function(scope, bool) {
		if (bool)
			$(scope).show();
		else
			$(scope).hide();
	}
});
