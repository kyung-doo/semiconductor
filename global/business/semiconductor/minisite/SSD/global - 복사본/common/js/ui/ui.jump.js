/*!
 * @class	{Class} JumpUI
 */
var JumpUI = Class.extend({
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
	init : function(scope) {
		this._scope = $(scope);
		this._container = null;
		this._content = null;
		this._target = null;
		this._btn = null;
		this._current = null;
		this._flag = false;
		this._temp_w = 0;
		this._speed = 500;
		this._limit = 0;
		this._smartfinder = false;
		this._isActive = null;
		this._isOriginalEvent = false;
		this._omnitureTitle = '';

		this.reinit();
	},

	/**
	 * re-initialize
	 *
	 * @private
	 * @return		{void}
	 */
	reinit : function() {
		this.build_container();
		this.build_content();
		this.build_event();
	},

	/**
	 * build-container
	 *
	 * @private
	 * @return		{void}
	 */
	build_container : function() {
		this._container = this._scope.find('*[data-role=ui-jump-container]');
	},

	/**
	 * build-content
	 *
	 * @private
	 * @return		{void}
	 */
	build_content : function() {
		var owner = this;

		owner._content = owner._scope.find('*[data-role=ui-jump-menu] a');

		owner._target = $('*[data-role=ui-jump-target]');

		owner._content.each(function(a) {
			$(this).data('cnt', a);
			$(this).data('target', owner._target.eq(a));
			if ($(this).hasClass('on'))
				owner._current = $(this);
		});

		owner._btn = owner._scope.find('*[data-role=ui-jump-toggle]');
	},

	/**
	 * build-content
	 *
	 * @private
	 * @return		{void}
	 */
	build_event : function() {
		var owner = this;

		owner._content.on('click', function(e) {
			e.preventDefault();
			
			owner._flag = true;
			var $self = $(this);
			var $lazyImages = $('img.lazy');
			var move = function(){
				//140813 추가
				if ($('*[data-role=ui-tab-jump-btn]').length > 0) {
					$('*[data-role=ui-tab-jump-btn]').text($self.find('>span').text()).parent().removeClass('expand');
				}
				
				if (owner._current)
					owner.deActive_item(owner._current);
				
				owner.active_item($self);
				owner.transition($self);

				var nowOmnitureTitle = $self.data('engTitle').toLowerCase();
				
				if(owner._omnitureTitle !== nowOmnitureTitle){
					owner._omnitureTitle = nowOmnitureTitle;
					sendClickCode('jumpto', 'jump to:' + owner._omnitureTitle);
				}
			};

			if ($self.data('target').length === 0) return;
			
			var imgCnt = 0;
			var loadCnt = 0;
			
			$lazyImages.each(function(){
				if($(this).attr('src') != $(this).attr('data-original')) {
					imgCnt++;
				}
			});
			
			if(imgCnt > 0){
				$lazyImages.each(function(){
					$(this).attr('src', $(this).attr('data-original'));
					$(this).load(function(){
						loadCnt++;
					})
				});
				
				function checkLoaded(){
					if(loadCnt >= imgCnt){
						clearInterval(tid);
						
						move();
					}
				}
				tid = setInterval(checkLoaded, 100);
			}
			else{
				move();
			}
		});
		
		$(window).on({
			'scroll' : function(e) {
				var sct = $(window).scrollTop();
				if(e.originalEvent !== undefined) {
					owner._isOriginalEvent = true;
				}
				owner.fix_position(sct);
			},

			'resize' : function() {
				var sct = $(window).scrollTop();

				setTimeout(function() {
					owner.fix_position(sct);
				}, 0);
			},
			
			'load hashchange' : function() {
				var hash = window.location.hash;
				
				if(hash){
					$.each(owner._content, function(){
						var $this = $(this);
						if($this.data('hash')){
							if(hash.indexOf($this.data('hash')) === 1){
								$this.click();
								return false;
							}
						}
					});
				}
			}
		});

		owner._btn.on('click', function() {
			owner._container.toggleClass('open');
		});

		//140813 추가
		if ($('*[data-role=ui-tab-jump-btn]').length > 0) {
			$('*[data-role=ui-tab-jump-btn]').bind({
				'click' : function() {
					var is_expanded = $(this).parent().hasClass('expand');

					if (is_expanded) {
						$(this).parent().removeClass('expand');
					} else {
						$(this).parent().addClass('expand');
						$(this).text($('a[data-role=ui-tab-jump-menu].on>span').text());
					}

				}
			});
		}
	},

	/**
	 * active-item
	 *
	 * @private
	 * @description
	 * 버튼 활성화
	 *
	 * @param       {jQuery Object} - 버튼 객체
	 * @return		{void}
	 */
	active_item : function(item) {
		var owner = this;
		var w = $(window).width();

		if (_common.is_mode() == 'MOBILE') {
			//owner._container.removeClass('open');
		}

		var cnt = item.data('cnt');
		var txt = item.text();
		
		owner._scope.find('*[data-role=ui-tab-jump-btn]').text(txt);
		owner._content.eq(cnt).addClass('on');
		owner._current = item;
	},

	/**
	 * deActive-item
	 *
	 * @private
	 * @description
	 * 버튼 비 활성화
	 *
	 * @param       {jQuery Object} - 버튼 객체
	 * @return		{void}
	 */
	deActive_item : function(item) {
		var cnt = item.data('cnt');

		this._content.eq(cnt).removeClass('on');
	},

	/**
	 * fix-position
	 *
	 * @private
	 * @description
	 * 스크롤 위치에 따라 점프메뉴 position 변경
	 *
	 * @param       {Number} n - 스크롤 위치
	 * @return		{void}
	 */
	fix_position : function(t) {
		var owner = this;
		var w = $(window).width();
		var _sf = $('*[data-role=ui-smartfinder]');

		if (owner._limit === 0 || w !== owner._temp_w || owner._smartfinder !== _sf.is(':visible') || _sf.is(':visible')) {
			owner._limit = Math.round(owner._target.first().offset().top - owner._scope.outerHeight(false)) - 20;
			owner._temp_w = w;
			owner._smartfinder = _sf.is(':visible');
		}

		if (t >= owner._limit) {
			owner._target.first().css({
				'margin-top' : Math.round(owner._scope.outerHeight(false)) + 'px'
			});
			owner._scope.css({
				'position' : 'fixed',
				'width' : '100%',
				'left' : 0,
				'top' : 0,
				'z-index' : 1000,
				'display' : 'block'
			}).addClass('active');

			owner._isActive = true;

			if (!owner._flag) {
				var cnt = owner.get_position(t);

				if (owner._current){
					owner.deActive_item(owner._current);
				}

				if(cnt !== undefined){
					owner.active_item(owner._content.eq(cnt));
					
					var nowOmnitureTitle = owner._content.eq(cnt).data('engTitle').toLowerCase();
					
					if(nowOmnitureTitle && owner._isOriginalEvent && owner._omnitureTitle !== nowOmnitureTitle){
						owner._omnitureTitle = nowOmnitureTitle;
						sendClickCode('jumpto', 'jump to:scroll:' + owner._omnitureTitle);
					}
				}
			}
			
			owner._isOriginalEvent = false;
		} else {
			owner._target.first().css({
				'margin-top' : 0
			});
			owner._scope.css({
				'position' : 'relative',
				'z-index' : 1
			}).removeClass('active');

			owner._isActive = false;

			if (!owner._scope.hasClass('pdp')) {
				owner._scope.css('display', 'none');
			}
		}
	},

	/**
	 * transition
	 *
	 * @public
	 * @description
	 * 해당 타겟 위치로 문서 이동
	 *
	 * @param       {jQuery Object} - 버튼 객체
	 * @return		{void}
	 */
	transition : function(item) {
		var owner = this;
		var pos = item.data('target').offset().top - owner._scope.outerHeight(false) - 20;

		if(owner._scope.is(':visible')) {
			pos = pos + 10;
		}

		$('html, body').stop().animate({
			'scrollTop' : pos + 'px'
		}, owner._speed, function() {
			owner._flag = false;
		});
	},

	/**
	 * get-position
	 *
	 * @public
	 * @description
	 * 현재 스크롤 위치에 따른 메뉴 인덱스 검사
	 *
	 * @param       {Number} t   - 스크롤 위치
	 * @return		{Number} cnt - 메뉴 인덱스
	 */
	get_position : function(t) {
		var owner = this;
		var cnt;

		owner._target.each(function(a) {
			var min = Math.round($(this).offset().top - owner._scope.outerHeight(false)) - 20;
			var max = Math.round(min + $(this).outerHeight(false));

			if (t >= min && t < max)
				cnt = a;
		});

		/*
		var target = owner._target.eq(owner._target.length - 1);
		if (t > Math.round(target.offset().top)) {
			cnt = owner._content.length - 1;
		}
		*/

		return cnt;
	}
});
