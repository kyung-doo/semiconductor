/*!
 * @class	{Class} LayerCommonUI
 */
var LayerCommonUI = CommonUI.extend({
	/**
	 * initialize
	 *
	 * @constructs
	 * @extends		CommonUI
	 * @requires		ui.common.js
	 * @requires		util.validation.js
	 * @requires		util.string.js
	 * @classdesc
	 * common 레이어팝업 생성<br/>
	 * (data-role 속성에 따라 자동 생성)
	 *
	 * 1. email-us(contact us)
	 * 		- call
	 * 		<button type="button" class="btn-small" data-role="ui-btn-email">Email Us</button>
	 *
	 * 		- layer content
	 * 		<div class="ui-layer-email" data-role="ui-layer-email" style="display:none;">
	 * 			...
	 * 			<a href="#" class="btn-close" data-role="ui-close-email"><span class="blind">Close Window</span></a>
	 * 		</div>
	 *
	 */

	init : function(target) {
		this._scope = null;
		this._target = $(target);
		this._container = null;
		this._type = $(this._target).attr('data-role').split('-')[2];
		this._prev = null;
		this._layer_clear = this._target.data('layerClear');
		this._contents = null;

		this.reinit();

	},

	reinit : function(target) {
		this.build_scope();
		this.build_cover();
		this.build_container();
		this.build_content();
		this.build_event();

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
		var owner = this;
		var winHeight = $(window).height();
	
		if (owner._layer_clear) {
			var scope = owner._target.closest('div[data-role=ui-layer-scope]');
			owner._target.closest('div[data-role=ui-layer-content]').find('div').first().appendTo($('body')).hide();
			scope.remove();
			
			$('html, body').css('overflow', 'visible');
		}

		owner._scope = $(document.createElement('div')).attr({
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
		this._container = $(document.createElement('div')).attr({
			'class' : 'pop-wrap pop-width ui-layer-container ' + String(this._type),
			'data-role' : 'ui-layer-container'
		}).appendTo(this._scope);
	},

	/**
	 * build-content
	 *
	 * @private
	 * @return		{void}
	 */
	build_content : function() {
		//this._prev = $('*[data-role=ui-layer-' + String(this._type) + ']').prev();
		var owner = this;

		var content = $(document.createElement('div')).attr({
			'class' : 'ui-layer-content ' + String(owner._type),
			'data-role' : 'ui-layer-content'
		}).data('manager', owner._target).appendTo($(owner._container));
		
		owner._kernel = $('*[data-role=ui-layer-' + String(owner._type) + ']');

		owner._kernel.appendTo(content).attr('tabIndex', '0').show();
		owner._kernel.focus();
		$('*[data-role=ui-close-' + String(owner._type) + ']').find('span').text(messageType02.mybusiness.acc_close_layer);
		
		//Focus in repeater
		if(owner._kernel.find('a.focus-repeater').length < 1){
			owner._kernel.append('<a href="javascript:void(0);" class="focus-repeater">Focus in repeater</a>');
		}
		
		owner._kernel.find('a.focus-repeater').on('focusin', function(){
			owner._kernel.attr('tabindex', 0).focus();
			
		});
		
		
		owner.set_max_width(owner);
	},

	/**
	 *	build-event
	 *
	 * @private
	 * @return		{void}
	 */
	build_event : function() {
		var owner = this;
				
		// 1. close-btn-event
		owner._scope.on('click', '*[data-role=ui-close-' + String(owner._type) + ']', function(e) {
			// 1. locate or save contents & remove a layer popup
			e.preventDefault();
			$('*[data-role=ui-layer-' + String(owner._type) + ']').appendTo($('body')).hide();
			
			//insertAfter(owner._prev);
			owner._scope.remove();
			
			$('html, body').css('overflow', 'visible');
		});
		
		$(window).resize(function() {
			owner.set_max_width(owner);
		});
		
		if (ValidationUtil.is_mobile()) {
			$(window).resize(function() {
				if (_common._document_width != $(window).width()) {
					_common._document_width = $(window).width();
					//owner.resize();
				}
			});
		}
	},
	
	/**
	 *	set_max_width
	 *
	 * @private
	 * @return		{void}
	 */
	set_max_width : function(owner) {
		if(owner._kernel.data('maxwidth')){
			var maxWidth = owner._kernel.data('maxwidth');
			var winWidth = $(window).width();
			var paddingWidth = owner._kernel.outerWidth() - owner._kernel.width() + parseInt(owner._container.css('padding-left')) + parseInt(owner._container.css('padding-right'));
			
			if(winWidth < maxWidth + paddingWidth){
				owner._kernel.width(winWidth - paddingWidth);
			}
			else{
				owner._kernel.width(maxWidth);
			}
		};
	},
	
	
	/**
	 * resize popup for mobile device
	 */
	
	resize : function() {
		var owner = this;
		var bodyHeight = $('body').outerHeight();
		var contLeft = 0;
		var contTop = 0;

		//$('html, body').css('overflow', 'hidden');

		owner._container.find('>div').css({
			'display' : 'block',
			'vertical-align' : 'top'
		});

		owner._container.css({
			'position' : 'relative',
			//'width' : 'auto',
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
