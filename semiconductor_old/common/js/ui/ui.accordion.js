/*!
 * @class	{Class} AccordionUI
 */
var AccordionUI = Class.extend({
	/**
	 * initialize
	 *
	 * @constructs
	 * @extends	{Class}
	 * @requires	jquery.js
	 * @classdesc
	 * 아코디언 메뉴 생성<br/>
	 * (data-role 속성으로 자동 생성)
	 *
	 * @param		{DOM} scope - 컨테이너
	 *
	 * @example
	 *
	 * <!--
	 *    data-role="ui-accordion" - 컨테이너
	 *    data-role="ui-accordion-btn" 	   - 아코디언 메뉴 열기 버튼
	 *    data-role="ui-accordion-content" - 아코디언 메뉴 컨텐츠
	 * -->
	 *
	 */
	init : function(scope) {
		this._scope = $(scope);
		this._transition = {
			'speed' : 300
		};
		this._type = null;

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
		this._type = this._scope.attr('data-accordion-type');

		this._content = this._scope.find('*[data-role=ui-accordion-btn]');
		this._content.each(function() {
			var content = $(this).parent().find('*[data-role=ui-accordion-content]');
			$(this).data('content', content);

			if (owner._type === 'compare') {
				$(this).data('icon', $(this).find('span'));
			}
		});
	},

	/**
	 * build-event
	 *
	 * @private
	 * @return		{void}
	 */
	build_event : function() {
		var owner = this;

		this._content.off('click').on('click', function(e) {
			if (!$(this).data('content').hasClass('active')) {
				owner.active_item($(this));
			} else {
				owner.deActive_item($(this));
			}
		});
	},

	/**
	 * active_item
	 *
	 * @private
	 * @param		{Jquery Object} item - 활성화 될 메뉴
	 * @return		{void}
	 */
	active_item : function(item) {
		var owner = this;
		
		if(item.hasClass('dimmed')) return false;

		item.data('content').addClass('active').stop().slideDown(owner._transition.speed, function(){
			$(this).css('display', 'block');
		});

		if (this._type === 'basic') {
			item.removeClass('show').addClass('hide').find('>span').text('view more');

			item.parent().attr('class', 'active');
		} else if (this._type === 'compare') {
			item.data('icon').attr({
				'class' : 'icon-minus'
			});
		} else {
			//var txt = item.text().replace('+', '-').replace('open', 'close');

			item.removeClass('closed').addClass('expanded');//.find('>span').text(txt);
		}
	},

	/**
	 * deActive_item
	 *
	 * @private
	 * @param		{Jquery Object} item - 비 활성화 될 메뉴
	 * @return		{void}
	 */
	deActive_item : function(item) {
		var owner = this;

		item.data('content').removeClass('active').stop().slideUp(owner._transition.speed);

		if (owner._type == 'basic') {
			item.removeClass('hide').addClass('show').find('>span').text('close');

			item.parent().removeAttr('class');
		} else if (owner._type === 'compare') {
			item.data('icon').attr({
				'class' : 'icon-plus'
			});
		} else {
			//var txt = item.text().replace('-', '+').replace('close', 'open');

			item.removeClass('expanded').addClass('closed');//.find('>span').text(txt);
		}
	}
});
