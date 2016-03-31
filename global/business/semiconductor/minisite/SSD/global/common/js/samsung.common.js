/*!
 * Common
 */
var SITE_CD = 'global';

var cdnHost = '';

var _common = {
	_ui : {
		'manager' : null,
		'iscomplete' : false
	},

	_mode : null,

	_isRTL : $('html').hasClass('rtl'),

	// 모바일 scroll 이벤트시 resize이벤트 fire되는 버그 해결을 위해
	_document_width : $(window).width(),
	
	_transition_speed : 300,

	_bc_idkey : {
		'playerId' : null,
		'playerKey' : null,
		'siteList' : {
			'global' : {
				'playerId' : '1281430501001',
				'playerKey' : 'AQ~~,AAABKPKaCgk~,gYL2wr7gn2M2nHoTltY5-qmjLTktK46P'
			}
		}
	},
	
	_ph : null,
	
	init : function() {
		this.init_cdn();
		
		this.init_ui();

		this.init_mode();

		this.init_indicator();
		
		this.init_bc_idkey();
	},

	reinit : function() {
		if (this._ui.manager != null) {
			if ( typeof (initPage) !== 'undefined') {
				initPage();
			}

			if ( typeof (initAuthPage) !== 'undefined') {
				initAuthPage();
			}
		}
	},

	init_ui : function() {
		if (this._ui.manager == null) {
			var owner = this;
			owner._ui.manager = new UIManager();
			owner._ui.iscomplete = true;
			owner.reinit();
		}
	},

	reinit_ui : function(type) {
		if (this._ui.manager != null) {
			this._ui.manager.reinit.apply(this._ui.manager, arguments);
		}
	},

	init_bc_idkey : function() {
		if ( typeof this._bc_idkey.siteList[SITE_CD] != 'undefined') {
			this._bc_idkey.playerId = this._bc_idkey.siteList[SITE_CD].playerId;
			this._bc_idkey.playerKey = this._bc_idkey.siteList[SITE_CD].playerKey;
		}
	},

	is_mode : function() {
		var mode = '';
		var w = window.innerWidth;
		//-window.document.body.scrollWidth;
		if (navigator.userAgent.indexOf('MSIE 7.0') !== -1 || navigator.userAgent.indexOf('MSIE 8.0') !== -1)
			w = $(window).width();

		if (w <= 767) {
			mode = 'MOBILE';
		} else if (w > 767 && w <= 1023) {
			mode = 'TABLET_A';
		} else if (w > 1023 && w <= 1280) {
			mode = 'TABLET_B';
		} else if (w > 1280) {
			mode = 'PC';
		}
		return mode;
	},

	get_mode : function() {
		return this._mode;
	},

	set_mode : function(mode) {
		this._mode = mode;
	},

	trace : function() {
		try {
			if ( typeof (window.console) != 'undefined' && window.console && window.console.log) {
			}
		} catch(e) {
		}
	},

	/**
	 * initialize-change-image
	 *
	 * @private
	 * @return		{void}
	 */
	init_mode : function() {
		var owner = this;

		// 1. resize
		$(window).bind({
			'resize' : function() {
				var mode = owner.is_mode();
				owner.change_img(mode);
			}
		});
	},

	/**
	 * initialize-indicator
	 *
	 * @private
	 * @return		{void}
	 */
	init_indicator : function() {
		$(document).on({
			'ajaxStop ajaxError' : function(e) {
				$('*[data-role=ui-indicator]').remove();
			}
		});
	},

	/**
	 * open-indicator
	 *
	 * @private
	 * @param       {jQuery Object} - progress image apeend target object
	 * @return		{void}
	 */
	open_indicator : function(target, type) {
		var dom = $('<div class="ui-indicator" data-role="ui-indicator">');

		$('*[data-role=ui-indicator]').remove();

		switch(type) {
			case 'more':
				dom.insertBefore(target);
				break;

			case 'filter':
				dom.prependTo(target);
				break;

			case 'step':
				dom.insertAfter(target);
				break;

			case 'search':
				dom.insertAfter(target);
				break;

			case 'search_more':
				dom.appendTo(target);
				break;
		}
	},
	
	/**
	 * initialize-cdn
	 *
	 * @private
	 * @return		{void}
	 */
	init_cdn : function() {
		switch(window.location.host) {
			case 'www.samsung.com':
				cdnHost = 'http://cdn.samsung.com'; 
				break;
			case 'stgweb4.samsung.com':
				cdnHost = 'http://stgweb4.cdn.samsung.com'; 
				break;
			default:
				cdnHost = 'http://' + window.location.host;
		}
		
		$('img[data-cdn="img"]:not(.lazy)').each(function(){
			$(this).attr('src', cdnHost + $(this).data('original'));
		});
		
		$('a[data-cdn="down"]').each(function(){
			$(this).click(function(e){
				e.preventDefault();
				
				var url = cdnHost + $(this).attr('href');
				var target = $(this).attr('target');
				
				window.open(url, target);
			});
		});
	},
	
	/**
	 * flick; image change for resolution
	 *
	 * @ scope - attr[data-role=ui-flick]
	 *
	 * @ attr[data-media-] - image url for resolution
	 * @ attr[data-role=not-responsive] - attr[data-media-] empty case
	 *
	 */
	change_img : function(mode) {
		var kv_url = '';

		$('*[data-role=ui-flick]').not('.key-visual').find('>div>ul>li>div:not([data-role=not-responsive])').each(function() {
			switch(String(mode).toUpperCase()) {
				case 'MOBILE':
					kv_url = typeof $(this).attr('data-media-mobile') !== 'undefined' ? $(this).attr('data-media-mobile') : $(this).css('backbround-image');
					break;
				case 'TABLET_A':
				case 'TABLET_B':
				case 'PC':
					kv_url = typeof $(this).attr('data-media-desktop') !== 'undefined' ? $(this).attr('data-media-desktop') : $(this).css('backbround-image');
					break;
			}

			$(this).css('background-image', 'url(\"' + kv_url + '\")');
		});
	},

	/**
	 * open-popup-layer
	 *
	 * @private
	 * @param       {string} - layer name ex) ui-layer-popupname -> open_popup_layer(popupname)
	 * @return		{void}
	 */
	open_popup_layer : function(popName) {
		var $obj = $('<div>').attr('data-role', 'ui-btn-' + popName);
		var $target = $('*[data-role=ui-layer-' + popName + ']');

		if ($target.length > 0) {
			new LayerCommonUI($obj);
		}
	},
	
	/**
	 * makeTemplate
	 * 
	 * JSON 데이터를 요청하여 해당 Template에 바인딩한다
	 *
	 * @private
	 * @param       p_url : json 요청 url
	 * 				p_templateID : 사용할 template id
	 * 					스크립트와 쌍으로 연결됨 ( script id 는 tmpl 접두사와 inner 접미사로 구성 )
	 *					<ul data-tmpl="test1">
	 *					<script type="text/x-jquery-tmpl" id="tmpl-test1-inner">
	 *					모바일 마크업이 따로 존재하면 접미사 m으로 구분
	 *					<ul data-tmpl="test1-m">
	 *					<script type="text/x-jquery-tmpl" id="tmpl-test1-m-inner">
	 *
	 *				p_options
	 *
	 *					param : json 요청시 사용할 파라미터
	 *					clear : 내용 삭제 여부 true, false ( appendTo, prependTo 에만 작동) (없으면 false)
	 *					to : template 의 삽입 위치 (없으면 appendTo)
	 *						at - appendTo, pt - prependTo, ia - insertAfter, ib - insertBefore
	 *					callback : 바인딩 후 실행할 callback함수
	 *						return (json data, 이벤트 발생 element)
	 *					caller : 이벤트 발생 element
	 *					key : 사용할 jsondata key값
	 * @return		{void}
	 */
	makeTemplate : function(p_url, p_templateID, p_options){
		var owner = this;
		var result = null;
		var param = '';
		
		if(typeof p_options != 'undefined' && p_options.hasOwnProperty('param')) param = p_options.param;

		$.getJSON(p_url, param, function(data){
			result = data;
			if(typeof p_options != 'undefined' &&
					p_options.hasOwnProperty('key')) data = data[p_options.key];
			var $template = $('#tmpl-' + p_templateID + '-inner').tmpl(data);
			var $mobileTemplate = $('#tmpl-' + p_templateID + '-m-inner').tmpl(data);
			var $target = $('*[data-tmpl=' + p_templateID + ']');
			var $mobileTarget = $('*[data-tmpl=' + p_templateID + '-m]');
			
			
			if(
					typeof p_options != 'undefined' &&
					p_options.hasOwnProperty('clear') &&
					p_options.clear && 
					(
						p_options.to == 'at' ||
						p_options.to == 'pt' ||
						!p_options.hasOwnProperty('to')
					)
				){
				$target.empty();
				if($mobileTemplate.length) $mobileTarget.empty();
			}
					
			if(typeof p_options != 'undefined' && p_options.hasOwnProperty('to')){
				if(p_options.to == 'at'){
					$template.appendTo($target);
					if($mobileTemplate.length) $mobileTemplate.appendTo($mobileTarget);
				}
				else if(p_options.to == 'pt'){
					$template.prependTo($target);
					if($mobileTemplate.length) $mobileTemplate.prependTo($mobileTarget);
				}
				else if(p_options.to == 'ia'){
					$template.insertAfter($target);
					if($mobileTemplate.length) $mobileTemplate.insertAfter($mobileTarget);
				}
				else if(p_options.to == 'ib'){
					$template.insertBefore($target);
					if($mobileTemplate.length) $mobileTemplate.insertBefore($mobileTarget);
				}
			}
			else{
				$template.appendTo($target);
				if($mobileTemplate.length) $mobileTemplate.appendTo($mobileTarget);
			}
			
		}).done(function(){
			if(typeof p_options != 'undefined'){
				
				if(p_options.hasOwnProperty('callback')){
					if(p_options.hasOwnProperty('caller')){
						p_options.callback(result, p_options.caller);
					}
					else{
						p_options.callback(result);
					}
				}
			}
				
		}).fail(function(jqxhr, textStatus, error){
			var err = textStatus + ", " + error;
			owner.trace( "Request Failed: " + err );
		});
	}
}; //common

$(document).ready(function() {
	if(typeof GLOBAL_SITE_CODE !== 'undefined') SITE_CD = GLOBAL_SITE_CODE
	
	new NavUI($('*[data-role=ui-nav]'));
	_common.change_img(_common.is_mode());
	_common.init();

	window.onYouTubeIframeAPIReady = function() {
		try {
			_common.reinit_ui('video');
		} catch(e) {
			_common.trace(e);
		}
	};
	
	// <div class="hero_area">  존재여부확인후 add_hero 클래스 추가
	$(".submenu-container ul li.sub .flyout").each(function(){
		if($(this).find(".hero_area").length > 0){
			$(this).addClass('add_hero');
		} 
	})
	
	$('*[data-ui-textoverflow="true"]').dotdotdot();
}); //ready

if(typeof sendClickCode === 'undefined'){
	function sendClickCode(a, b){
		_common.trace(a + " | " + b);
	}
};

jQuery.cachedScript=function(b,a)
{
    a=$.extend(a||{},{dataType:"script",cache:true,url:b});
    return jQuery.ajax(a);
};
