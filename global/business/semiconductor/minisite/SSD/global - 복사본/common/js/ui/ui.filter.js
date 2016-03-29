/*!
 * @class	{Class} FilterUI
 */
var FilterUI = CommonUI.extend({
	/**
	 * initialize
	 *
	 * @constructs
	 * @extends	{CommonUI}
	 * @requires	jquery.js
	 * @requires	ui.common.js
	 * @requires	ui.validation.js
	 * @classdesc
	 * FilterBy 리스트 블럭 생성<br/>
	 * (data-role 속성으로 자동 생성)
	 *
	 * @param		{Object} scope - 컨테이너
	 *
	 * <!--
	 * 	   1. desktop version
	 *    data-role="ui-filter-list" - FilterBy scope
	 *    data-role="ui-filter-list-container" - FilterBy 컨테이너
	 *    data-role="ui-filter-toggle" - FilterBy 버튼
	 *    data-role="ui-filter-content" - FilterBy 컨텐츠
	 *    data-role="ui-filter-menu" - FilterBy 카테고리 메뉴
	 *    data-role="ui-filter-area" - FilterBy 컨텐츠 영역
	 *    data-role="ui-filter-result" - FilterBy 선택결과값 영역
	 *    data-role="btn-close-layer" - FilterBy 영역 닫기
	 *
	 *    data-role="ui-filter-sort" - SortBy scope
	 *
	 *    2. mobile version
	 *    data-role="ui-mfilter-list" - FilterBy scope
	 *    data-role="ui-mfilter-menu" - FilterBy 카테고리 메뉴
	 *    data-role="ui-mfilter-toggle" - FilterBy 버튼
	 *    data-role="ui-mfilter-content" - FilterBy 컨텐츠
	 *    data-role="ui-mfilter-menu"- FilterBy 카테고리 메뉴
	 *
	 *    data-role="ui-mfilter-sort" - SortBy scope
	 * -->
	 *
	 */
	init : function(scope) {
		this._scope = scope;
		this._container = null;
		this._content = null;
		this._result = null;
		this._area = null;
		this._tab_title = scope.data('tabTitle') ? true : false;

		this._mscope = $('*[data-role=ui-mfilter-list]');
		this._mcontent = null;
		this._mmenu = null;
		this._mresult = null;
		this._has_tab = false;

		this._transition = {
			'bool' : false,
			'sec' : 300,
			'open' : false
		};

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
		this.build_mcontent();
		this.build_event();
	},

	/**
	 * build-container
	 *
	 * @private
	 * @return		{void}
	 */
	build_container : function() {
		var owner = this;

		var container = $(owner._scope).find('*[data-role=ui-filter-container]');
		owner._container = container;
	},

	/**
	 * build-mobile-content
	 *
	 * @private
	 * @return		{void}
	 */
	build_mcontent : function() {
		var owner = this;
		// 1. build-mobile-content
		//this._mcontent=$(this._mscope).find('*[data-role=ui-mfilter-content]');
		var mcontent = $(owner._mscope).find('*[data-role=ui-mfilter-content]').first();
		var mmenu = $(owner._mscope).find('*[data-role=ui-mfilter-menu]');
		owner._mresult = owner._mscope.find('*[data-role=ui-mfilter-result]');
		owner._mmenu = mmenu;
		
		if(mcontent.data('tab')){
			owner._has_tab = true;
		}

		//140912  체크된 값이 있을 경우 모바일 filterby 초기화면 설정
		// 2. init-ui-mfilter if some item checked
		var mchk_total=0;
		$(mcontent).find('input').each(function(a){
			if($(this).is(':checked')){
				// a. calculator input-check-count-total
				mchk_total+=1;
		
				// b. active-menu & show-content
				$(mcontent).find('>ul>li').each(function(b){
					var $this = $(this);
					if($this.find('input').is(':checked')){
						$this.parent().find('*[data-role=ui-mfilter-menu]').addClass('link-toggled');
						$this.find('>a').removeClass('link-toggled');
						$this.find('>ul').show();
						
						return false;
					}
					else{
						$this.find('>ul').hide();
					}
				});
			}
		});
		
		// 3. click-mmenu-event
		$(mmenu).each(function(a) {
			var $this = $(this);

			$this.unbind().bind({
				'click' : function() {
					if ($this.hasClass('link-toggled')) {
						$this.removeClass('link-toggled');
						$this.parent().find('>ul').slideDown(owner._transition.sec);
					} else {
						$this.addClass('link-toggled');
						$this.parent().find('>ul').slideUp(owner._transition.sec);
					}
				}
			});
		});
		

		if(mchk_total>0){
			// d. remove-a-class link-toggled
			$('a[data-role=ui-mfilter-toggle]').first().removeClass('link-toggled');
	
			// e. open-filter-area
			$(mcontent).slideDown(owner._transition.sec);
		};

		// 3. click-mmenu-event
		$(mmenu).each(function(a) {
			var $this = $(this);
			$this.unbind().bind({
				'click' : function() {
					if ($this.hasClass('link-toggled')) {
						$this.removeClass('link-toggled');
						$this.parent().find('>ul').slideDown(owner._transition.sec);
					} else {
						$this.addClass('link-toggled');
						$this.parent().find('>ul').slideUp(owner._transition.sec);
					}
				}
			});
		});

		var $target = $(mcontent);
		
		if(owner._has_tab) $target = $(mcontent).find('>ul>li');
		
		owner.match_checkbox($target);
		
	},

	/**
	 * build-content
	 *
	 * @private
	 * @return		{void}
	 */
	build_content : function() {
		var owner = this;
		// 1. build-content
		var content = $(this._scope).find('*[data-role=ui-filter-content]');
		this._content = content;
		var result = $(this._scope).find('*[data-role=ui-filter-result]');
		this._result = result;
		
		var area = $(this._content).find('*[data-role=ui-filter-area]');
		this._area = area;

		// 2. tab-menu-event
		$(this._content).find('*[data-role=ui-filter-menu]').find('li').each(function(a) {
			$(this).unbind().bind({
				'click' : function() {
					$(this).parent().find('li').removeClass('active');
					$(this).addClass('active');

					owner.build_area(a);
					return false;
				}
			});
		});

		owner.match_checkbox($(this._area).find('div'));

		var isChecked = owner._scope.find('input[type=checkbox]:checked').length > 0 ? true : false;

		if (isChecked) {
			$('*[data-role=btn-clear-all]').show();
		} else {
			$('*[data-role=btn-clear-all]').hide();
		}
	},

	/**
	 * build-area
	 *
	 * @private
	 * @return		{void}
	 */
	build_area : function(n) {
		var owner = this;

		// 1. show-content-area
		$(owner._content).find('*[data-role=ui-filter-area]>div>ul').each(function(a) {
			if (n === a) {
				$(this).addClass('active').show();
			} else {
				$(this).removeClass('active').hide();
			}
		});
	},

	/**
	 * build-event
	 *
	 * @private
	 * @description
	 * 1. filter-btn-event
	 * 2. btn-close-layer
	 * 3. mobile-filter-btn-event
	 * 4. sort-btn-event
	 * 5. mobile-sort-btn-event
	 *
	 * @return		{void}
	 */
	build_event : function() {
		var owner = this;

		// 0. init-ui-filter if some item checked
		var chk_total = 0;
		$(owner._area).find('input').each(function(a) {
			if ($(this).is(':checked')) {
				// a. calculator input-check-count-total
				chk_total += 1;

				// b. active-menu & show-content
				$(owner._area).find('>div>ul').each(function(b) {
					if ($(this).find('input').is(':checked')) {
						$('*[data-role=ui-filter-menu]>ul>li').removeClass('active');
						$('*[data-role=ui-filter-menu]>ul>li:eq(' + b + ')').addClass('active');
						$(this).show();

						return false;
					} else {
						$(this).hide();
					}
				});

				// c. add-item-in-result-area
				owner.add_item($(this).parent().attr('data-code'));
				
			} else {
				chk_total += 0;
			}
		});

		if (chk_total > 0) {
			// d. remove-a-class link-toggled
			$('a[data-role=ui-filter-toggle]').removeClass('link-toggled');

			// e. open-filter-area
			$(owner._content).slideDown(owner._transition.sec);
		}

		// 1. filter-btn-event
		$('a[data-role=ui-filter-toggle]').unbind().bind({
			'click' : function() {
				var pathname = window.location.pathname;
				
				if ($(this).hasClass('link-toggled')) {
					$(this).removeClass('link-toggled');
					$(owner._content).slideDown(owner._transition.sec);
					
				} else {
					$(this).addClass('link-toggled');
					$(owner._content).slideUp(owner._transition.sec);
					
				}

				$('*[data-role=ui-layer-close]').trigger('click');
			}
		});

		// 2. btn-close-layer - 기능 없어졌음. 추후 제거
		$('*[data-role=btn-close-layer]').unbind().bind({
			'click' : function() {
				// 접근성
				var activeA = $('a[data-role=ui-filter-toggle]');

				activeA.focus();
				// 접근성

				// a. desktop
				$('a[data-role=ui-filter-toggle]').addClass('link-toggled');
				$(owner._content).slideUp(owner._transition.sec);

				// b. mobile
				$('*[data-role=ui-mfilter-toggle]').first().addClass('link-toggled');
				$('*[data-role=ui-mfilter-content]').slideUp(owner._transition.sec);
				
			}
		});

		// 2. btn-clear-all
		$('*[data-role=btn-clear-all]').unbind().bind({
			'click' : function() {
				// 접근성
				var lastCheckbox = $('*[data-role=ui-filter-area]').find('input:checkbox:visible:enabled').last();

				lastCheckbox.focus();
				// 접근성

				$('*[data-role=ui-filter-area] input[type=checkbox]').each(function() {
					if(!$(this).prop('disabled') && $(this).attr('value') != ''){
						$(this).prop('checked', false);
					}
				});

				$('*[data-role=ui-mfilter-content] input[type=checkbox]').each(function() {
					if(!$(this).prop('disabled') && $(this).attr('value') != ''){
						$(this).prop('checked', false);
					}
				});

				$('*[data-role=ui-filter-result] span').remove();
				$('*[data-role=ui-mfilter-result] span').remove();
			
				$('select[data-role="ui-period-from-year"]').val('');
				$('select[data-role="ui-period-from-month"]').val('');
				$('select[data-role="ui-period-to-year"]').val('');
				$('select[data-role="ui-period-to-month"]').val('');

				$('*[data-role=btn-clear-all]').hide();

				if ( typeof (changePage) != 'undefined')
					changePage();
			}
		});

		// 3. mobile-filter-btn-event
		$('a[data-role=ui-mfilter-toggle]').each(function(a) {
			$(this).unbind().bind({
				'click' : function() {
					var content = (a == 0) ? $(owner._mscope).find('*[data-role=ui-mfilter-content]') : $(owner._mscope).find('*[data-role=ui-mfilter-sort]');
					var pathname = window.location.pathname;
					
					if ($(this).hasClass('link-toggled')) {
						$(this).parent().find('*[data-role=ui-mfilter-toggle]').addClass('link-toggled');
						$(this).removeClass('link-toggled');
						$(owner._mscope).find('>div:not(:eq(0))').hide();
						$(content).slideDown(owner._transition.sec);
						
					} else {
						$(this).addClass('link-toggled');
						$(content).slideUp(owner._transition.sec);
						
					}
				}
			});
		});

		// 4. sort-btn-event
		$('*[data-role=ui-filter-sort]>ul>li').each(function(b) {
			$(this).unbind().bind({
				'click' : function() {
					var $this = $(this);
					var filterTitle = $this.find('a').text();
					
					$this.parent().find('li').removeClass('active');
					$this.addClass('active');
					$('*[data-role=ui-mfilter-sort]>ul>li').removeClass('active');
					$('*[data-role=ui-mfilter-sort]>ul>li:eq(' + b + ')').addClass('active');

					sendClickCode('b2b_index','b2b_list:' + filterTitle.toLowerCase());
					
					$('*[data-role=ui-layer-close]').trigger('click');
				}
			});
		});

		// 5. mobile-sort-btn-event
		$('*[data-role=ui-mfilter-sort]>ul>li').each(function(c) {
			$(this).unbind().bind({
				'click' : function() {
					var $this = $(this);
					var filterTitle = $this.find('a').text();
					
					$this.parent().find('li').removeClass('active');
					$this.addClass('active');
					$('*[data-role=ui-filter-sort]>ul>li').removeClass('active');
					$('*[data-role=ui-filter-sort]>ul>li:eq(' + c + ')').addClass('active');
					
					sendClickCode('b2b_index','b2b_list:' + filterTitle.toLowerCase());
				}
			});
		});
		
		owner.resizeButtons();
		
		$(window).resize(function() {
			var isMobile = true;

			if (!isMobile)
				return false;

			owner.resizeButtons();
		});
	},

	/**
	 * match-checkbox
	 *
	 * @public
	 * @description
	 * 체크박스 체크된 항목 표시
	 *
	 * @param		{DOM} target
	 * @return		{METHOD}	changePage()
	 */
	match_checkbox : function(target) {
		var owner = this;
		// 1. build-two-depth-checkbox-event
		$(target).find('>ul>li').each(function(b) {
			$this_li = $(this);
			$this_li.data('data-code', b).attr('data-code', b);

			$this_li.find('>input[type=checkbox]').unbind().bind({
				'click' : function(e) {
					var $this = $(this);
					
					$this.parent().find('>label').removeClass('inpart');
					$childs = $('*[data-code=' + b + ']').find('input[type=checkbox]')
					if ($this.is(':checked')) {
						owner.add_item(b);
						$.each($childs, function(){
							$child = $(this);
							if(!$child.prop('disabled')){
								$child.prop('checked', true);
							}
						});
						var typeName = $this.attr('data-group-name');
						
						if(owner._has_tab){
							var filterTitle = '';
							
							if($('div[data-role="ui-mfilter-list"]').is(':visible')){
								filterTitle = owner._mscope.find('li[data-code=' + b + ']').closest('ul.m-twodepth').parent().find('a[data-role="ui-mfilter-menu"]').find('>span').text();
							}
							else{
								filterTitle = owner._scope.find('div[data-role="ui-filter-menu"]').find('li.active>a').text();
							}
							
							sendClickCode('category_filter', filterTitle.toLowerCase());
						}
					} else {
						owner.remove_item(b);
						$.each($childs, function(){
							$child = $(this);
							if(!$child.prop('disabled')){
								
								$child.prop('checked', false);
							}
						});
					}

					var isChecked = owner._scope.find('input[type=checkbox]:checked').length > 0 ? true : false;

					if (isChecked) {
						$('*[data-role=btn-clear-all]').show();
					} else {
						$('*[data-role=btn-clear-all]').hide();
					}

					if ( typeof (changePage) != 'undefined')
						changePage();
				}
			});

			// 2. build-three-depth-checkbox-event
			$(this).find('>ul>li').each(function(c) {
				$(this).attr('data-code', b + '-' + c);

				$(this).find('input[type=checkbox]').unbind().bind({
					'click' : function() {
						var $this = $(this);
						var acount = $this.parent().parent().find('input[type=checkbox]').not(':disabled').length;
						var chkcount = $this.parent().parent().find('input[type=checkbox]:checked').length;

						if (chkcount == 0) {
							$('*[data-code=' + b + ']').find('>input').first().prop('checked', false);
							$('*[data-code=' + b + ']').find('>label').first().removeClass('inpart');
						} else if (chkcount == acount) {
							$('*[data-code=' + b + ']').find('>input').first().prop('checked', true);
							$('*[data-code=' + b + ']').find('>label').first().removeClass('inpart');
						} else {
							$('*[data-code=' + b + ']').find('>input').first().prop('checked', true);
							$('*[data-code=' + b + ']').find('>label').first().addClass('inpart');
						}

						var $child = $('*[data-code=' + b + '-' + c + ']').find('>input').first();
						
						if ($this.is(':checked')) {
							if(!$child.prop('disabled') && $child.attr('value') != ''){
								$child.prop('checked', true);
								owner.add_item(b + '-' + c);
							}
						} else {
							if(!$child.prop('disabled') && $child.attr('value') != ''){
								$child.prop('checked', false);
								owner.remove_item(b + '-' + c);
							}
						}

						var isChecked = owner._scope.find('input[type=checkbox]:checked').length > 0 ? true : false;

						if (isChecked) {
							$('*[data-role=btn-clear-all]').show();
						} else {
							$('*[data-role=btn-clear-all]').hide();
						}

						if ( typeof (changePage) != 'undefined')
							changePage();
					}
				});
			});
		});
	},

	/**
	 * add-item
	 *
	 * @public
	 * @description
	 * 선택 결과영역(attr[data-role=ui-filter-result]) 에 체크된 항목 표시
	 *
	 * @param	{Number} n : data-code
	 * @return		{void}
	 */
	add_item : function(n) {
		var owner = this;
		var aparent = owner._scope.find('li[data-code=' + n + ']');
		var shtml = '';

		// 1. add-item-word
		if (aparent.find('ul').length > 0) {
			aparent.find('>ul>li').each(function(a) {
				var $this = $(this).find('>input');
				if (!($this.is(':checked'))) {
					if(!$this.prop('disabled')){
						
						if(owner._tab_title){
							var filterTitle = '';
							var filterCont = '';
							
							if($('div[data-role="ui-mfilter-list"]').is(':visible')){
								filterTitle = owner._mscope.find('li[data-code=' + n + ']').closest('ul.m-twodepth').parent().find('a[data-role="ui-mfilter-menu"]').find('>span').text();
								filterCont = owner._mscope.find('li[data-code=' + n + ']').find('label').text();
							}
							else{
								filterTitle = owner._scope.find('div[data-role="ui-filter-menu"]').find('li.active>a').text();
								filterCont = aparent.find('label').text();
							}
							
							shtml += '<span class="word" data-code="' + n + '-' + a + '">' + filterTitle + '<em>' + filterCont + '</em><a href="javascript:void(0);" class="btn-close" data-role="btn-close-word"><span class="blind">Close</span></a></span>';
						}
						else{
							shtml += '<span class="word" data-code="' + n + '-' + a + '">' + aparent.find('label').text() + '<a href="javascript:void(0);" class="btn-close" data-role="btn-close-word"><span class="blind">Close</span></a></span>';
						}
						
					}
				}
			});
		} else {
			// 이미 추가되어있는 span data-code값과 같은 값이 있을때  추가 안되도록 기능추가
			var isValid = true;
			owner._result.find('span').each(function() {
				if ($(this).data('code') == n) {
					isValid = false;
					return false;
				}
			});
			if (isValid){
				
				if(owner._tab_title){
					var filterTitle = '';
					var filterCont = '';
					
					if($('div[data-role="ui-mfilter-list"]').is(':visible')){
						filterTitle = owner._mscope.find('li[data-code=' + n + ']').closest('ul.m-twodepth').parent().find('a[data-role="ui-mfilter-menu"]').find('>span').text();
						filterCont = owner._mscope.find('li[data-code=' + n + ']').find('label').text();
					}
					else{
						filterTitle = owner._scope.find('div[data-role="ui-filter-menu"]').find('li.active>a').text();
						filterCont = aparent.find('label').text();
					}
					
					shtml += '<span class="word" data-code="' + n + '">' + filterTitle + '<em>' + filterCont + '</em><a href="javascript:void(0);" class="btn-close" data-role="btn-close-word"><span class="blind">Close</span></a></span>';
				}
				else{
					shtml += '<span class="word" data-code="' + n + '">' + aparent.find('label').text() + '<a href="javascript:void(0);" class="btn-close" data-role="btn-close-word"><span class="blind">Close</span></a></span>';
				}
				
			}
		};

		var resultLen = owner._result.find('span.word:not([data-code="period"])').length;
		var mresultLen = owner._mresult.find('span.word:not([data-code="period"])').length;
		
		if(resultLen === 0){
			owner._result.prepend(shtml);
		}
		else{
			owner._result.find('span.word:not([data-code="period"])').eq(resultLen - 1).after(shtml);
		}
		
		if(mresultLen === 0){
			owner._mresult.prepend(shtml);
		}
		else{
			owner._mresult.find('span.word:not([data-code="period"])').eq(mresultLen - 1).after(shtml);
		}
		
		// 2. btn-close-word
		$('*[data-role=btn-close-word]').each(function(a) {
			$(this).unbind().bind({
				'click' : function() {
					// 접근성
					var wordCnt = $('*[data-role=ui-filter-result]').find('a').length;

					if (wordCnt <= 1) {
						var lastCheckbox = $('*[data-role=ui-filter-area]').find('input:checkbox:visible:enabled').last();

						lastCheckbox.focus();
					} else if (wordCnt > 1) {
						var idx = $('*[data-role=ui-filter-result]').find('a').index(this);

						var preIdx = idx * 1 - 1;
						var nextIdx = idx * 1 + 1;

						if (preIdx < 0) {
							$('*[data-role=ui-filter-result]').find('a').eq(nextIdx).focus();
						} else {
							$('*[data-role=ui-filter-result]').find('a').eq(preIdx).focus();
						}
					}
					// 접근성

					var code = $(this).parent().attr('data-code');
					var aparent = $('li[data-code=' + code + ']');

					$(aparent).find('>input').prop('checked', false);

					if ($(aparent).parent().find('input').is(':checked')) {
						$(aparent).parent().parent().find('>label').addClass('inpart');
					} else {
						$(aparent).parent().parent().find('>input').prop('checked', false);
					}
					owner.remove_item(code);

					var isChecked = owner._scope.find('input[type=checkbox]:checked').length > 0 ? true : false;

					if (isChecked) {
						$('*[data-role=btn-clear-all]').show();
					} else {
						$('*[data-role=btn-clear-all]').hide();
					}

					if ( typeof (changePage) != 'undefined')
						changePage();

					return false;
				}
			});
		});
	},

	/**
	 * remove-item
	 *
	 * @public
	 * @description
	 * 선택 결과영역(attr[data-role=ui-filter-result]) 에 체크된 항목 삭제
	 *
	 * @param	{Number} n : data-code
	 * @return		{void}
	 */
	remove_item : function(n) {
		var owner = this;
		var aparent = $(owner._scope).find('li[data-code=' + n + ']');

		if ($(aparent).find('>ul').length > 0) {
			$(aparent).find('>ul>li').each(function(a) {
				$(owner._result).find('span[data-code=' + n + '-' + a + ']').remove();
				$(owner._mresult).find('span[data-code=' + n + '-' + a + ']').remove();
			});
		} else {
			$(owner._result).find('span[data-code=' + n + ']').remove();
			$(owner._mresult).find('span[data-code=' + n + ']').remove();
		}
	},

	/**
	 *  resize
	 *
	 *  모바일에서 Newest, Mostest 글자수 길어질 경우 버튼 높이 조절
	 */
	resizeButtons : function() {
		var owner = this;
		
		var maxHeight = 0;
		var buttons = owner._mscope.find('*[data-role=ui-mfilter-toggle]');

		buttons.each(function() {
			$(this).css('height', '');
		});

		buttons.each(function() {
			var thisHeight = $(this).outerHeight();
			if (maxHeight < thisHeight)
				maxHeight = thisHeight;
		});

		buttons.each(function() {
			$(this).css('height', maxHeight);
		});
	}
});
