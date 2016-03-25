/*!
 * @class	{Class} GlobalSearchUI
 */
var GlobalSearchUI = Class.extend({
	init: function(scope) {
		this._scope = $(scope);
		this._options = {
			site_code: SITE_CD,
			min_char: 2,
			disp_len: 6
		};
		this._search_btn = this._scope.find('*[data-role=ui-btn-search]');
		this._submit_btn = this._scope.find('button[type=submit]');
		this._autocomplete_list = this._scope.find('*[data-role=ui-globalsearch-autocomplete-list]');
		this._popular_list = this._scope.find('*[data-role=ul-globalsearch-popular-list]');
		this._recent_list = this._scope.find('*[data-role=ul-globalsearch-recent-list]');
		this._global_recent_list = $('*[data-role=ul-globalsearch-recent-list]');
		this._input = this._scope.find('*[data-role=ui-search-input]');
		this._btn_del_keyword = this._scope.find('*[data-role=ui-search-btn-del]');
		this._footer_btn_del_keyword = $('*[data-role=ui-footer-search-btn-del]');
		this._footer_search_input = $('*[data-role=ui-footer-search-input]');
		this._footer_search_submit = $('*[data-role=ui-footer-search-submit]');
		this._popular_data = [];
		this._recent_data = [];
		this._tid = null;
		this._show_list_type = '';
		this._init_flag = false;
		this._xhr;
		
		this.reinit();
	},
	
	reinit: function() {
		this.build_event();
		this.get_recent_list();
		this.render_recent_list(this._recent_data);
		this._footer_search_input.trigger('keyup');
	},
	
	build_event: function() {
		this.eventbind();
	},
	
	shuffle_array: function(array) {
		var currentIndex = array.length, temporaryValue, randomIndex ;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	},
	
	get_recent_list: function() {
		var owner = this;
		
		if ($.cookie('sk') == null) $.cookie('sk', '[]', { domain: '.samsung.com', path: '/semiconductor/', secure: false });
		
		var recent_data = null;
		
		if ($.cookie('sk') != null) recent_data = JSON.parse($.cookie('sk'));
		
		owner._recent_data = recent_data;
	},
	
	// resize (검색결과페이지에서는 X버튼 보이기)
	resize: function() {
		var owner = this;
		var mode = _common.is_mode();
		var isActive = $('*[data-role=ui-globalsearch]').hasClass('active');
		
		if (mode == 'TABLET_A' || mode == 'PC') {
			if (owner._input.val() != '') {
				owner._btn_del_keyword.show();
			}
			else {
				owner._btn_del_keyword.hide();
			}
		}
		else if (mode == 'MOBILE' || mode == 'TABLET_B') {
			if (owner._input.val() != '' && isActive) {
				owner._btn_del_keyword.show();
			}
			else {
				owner._btn_del_keyword.hide();
			}
		}
	},
	
	// desktop, mobile event
	eventbind: function(){
		var owner = this;
		
		owner.resize();
		
		$(window).resize(function(){
			owner.resize();
		});
		
		// Header 모바일 화면에서 검색창 노출하게 하는 버튼
		owner._search_btn.on('click', function(e){
			if ($(this).parent().hasClass('active')) {
				$(this).parent().removeClass('active');
				owner._btn_del_keyword.hide();
			}
			else {
				$(this).parent().addClass('active');
			}
			
			owner.resize();
			
			e.stopPropagation();
		});
		
		// Header 검색어 삭제 click 이벤트
		owner._btn_del_keyword.on('click', function(e){
			e.stopPropagation();
			owner._input.val('').trigger('keyup').trigger('keydown').focus();
		});
		
		// Footer 검색어 삭제 click 이벤트
		owner._footer_btn_del_keyword.on('click', function(e){
			owner._footer_search_input.val('').trigger('keyup').trigger('keydown').focus();
		});
		
		// Header 검색입력창 click 이벤트
		owner._input.on('click', function(e) {
			e.stopPropagation(); 
			//owner.get_popular_list();
		});
		
		// Header 검색입력창 keyup 이벤트
		owner._input.on('keyup', function(e) {
			var keyCode = e.keyCode;
			var leftKey = keyCode == 37 ? true : false;
			var upKey = keyCode == 38 ? true : false;
			var rightKey = keyCode == 39 ? true : false;
			var downKey = keyCode == 40 ? true : false;
			var enterKey = keyCode == 13 ? true : false;
			
			var ipt_str = $(this).val();
			var ipt_str_len = ipt_str.length;
			
			// left, right key
			if (leftKey || rightKey) {
				return false;
			}
			// down, up key
			else if ((downKey || upKey) && owner._show_list_type == 'autocomplete') {
				if (downKey) {
					if (owner._autocomplete_list.find('.active').length == 0) {
						owner._autocomplete_list.find('li').first().addClass('active');
					}
					else {
						if (owner._autocomplete_list.find('.active').next().length > 0) {
							owner._autocomplete_list.find('.active').removeClass('active').next().addClass('active');
						}
					}
				}
				else if (upKey) {
					if (owner._autocomplete_list.find('.active').length == 0) {
						owner._autocomplete_list.find('li').first().addClass('active');
					}
					else {
						if (owner._autocomplete_list.find('.active').prev().length > 0) {
							owner._autocomplete_list.find('.active').removeClass('active').prev().addClass('active');
						}
					}
				}
				
				var searchTxt = owner._autocomplete_list.find('.active').text();
				owner._input.val(searchTxt).focus();
				
				return false;
			}
			// enter key
			else if (enterKey) {
				return true;
			}
			// 키워드 입력
			else {
				owner._search_btn.parent().addClass('active');
				
				if (ipt_str_len > 0) {
					owner._btn_del_keyword.show();
				}	
				else {
					owner._btn_del_keyword.hide();
				}
				
				// Popular Keywords, Recent Keywords 출력				
				if (ipt_str_len < owner._options.min_char) {
					// 입력중에는 검색 안함
					if (owner._tid !== undefined || owner._tid != null) {
						clearTimeout(owner._tid);
					}
					
					owner._tid = setTimeout(function(){
						owner._tid = null;
						//owner.render_popular_list(owner._popular_data);
						owner.show_popularRecent_list();
					}, 300);
				}
				// 검색 ajax 호출
				else {
					// 입력중에는 검색 안함
					if (owner._tid !== undefined || owner._tid != null) {
						clearTimeout(owner._tid);
					}
					
					owner._tid = setTimeout(function(){
						owner._tid = null;
						
						var url = '';
						url += '/' + owner._options.site_code + '/' + 'data-search/autoComplete.jsonp?';
						url	+= 'callback=?';
						url	+= '&dispLen=' + owner._options.disp_len;
						url	+= '&q=' + encodeURIComponent(ipt_str);
						
						if (owner._xhr && owner._xhr.readyState != 4 && owner._xhr.readyState != 0){
							owner._xhr.abort();
				        }
						
						owner._xhr = $.ajax({
							type: 'get',
							url: url,
							dataType: 'jsonp',
							success : function(result) {
								// Suggestive Keywords 출력
								if (result.length > 0) {
									owner.render_autocomplete_list(result);
								}
								// Popular Keywords 출력
								else {
									//owner.render_popular_list(owner._popular_data);
									owner.show_popularRecent_list();
								}
							},
							error : function(xhr, status, error) {
								
							}
						});
					}, 300);
				}
				
				return false;
			}
		});
		
		// Header 검색입력창 keydown 이벤트
		owner._input.on('keydown', function(e) {
			var keyCode = e.keyCode;
			var leftKey = keyCode == 37 ? true : false;
			var upKey = keyCode == 38 ? true : false;
			var rightKey = keyCode == 39 ? true : false;
			var downKey = keyCode == 40 ? true : false;
			var enterKey = keyCode == 13 ? true : false;
			var shiftKey = e.shiftKey ? true : false;
			var tab = keyCode == 9 ? true : false;
			
			var ipt_str = $(this).val();
			var ipt_str_len = ipt_str.length;
			
			if (shiftKey && tab) {
				if (owner._xhr && owner._xhr.readyState != 4 && owner._xhr.readyState != 0){
					owner._xhr.abort();
		        }
			
				// 검색입력창 감추기
				owner._autocomplete_list.hide();
				owner._scope.find('.auto-complete').removeClass('results-returned no-results-returned on');
				owner._recent_list.hide();
				owner._popular_list.hide();
				
				return true;
			}
			
			// left, right 방향키
			if (upKey || downKey) {
				return false;
			}
			else if (enterKey) {
				if (ipt_str_len > 0) {
					owner.goResultPage();
				}
				
				return false;
			}
		});
		
		// Header 검색버튼 클릭시
		owner._submit_btn.on('click', function() {
			var ipt_str = owner._input.val();
			var ipt_str_len = ipt_str.length;
			
			if (ipt_str_len > 0) {
				owner.goResultPage();
			}
		}).on('focusin', function(){
			if (owner._xhr && owner._xhr.readyState != 4 && owner._xhr.readyState != 0){
				owner._xhr.abort();
	        }
			
			// 검색입력창 감추기
			owner._autocomplete_list.hide();
			owner._scope.find('.auto-complete').removeClass('results-returned no-results-returned on');
			owner._recent_list.hide();
			owner._popular_list.hide();
		});
		
		owner._footer_search_input.on('keyup', function(e) {
			var ipt_str = $(this).val();
			var ipt_str_len = ipt_str.length;
			
			if (ipt_str_len > 0) {
				owner._footer_btn_del_keyword.show();
			}	
			else {
				owner._footer_btn_del_keyword.hide();
			}
		});
		
		// Footer 검색입력창에서 엔터키 입력시
		owner._footer_search_input.on('keydown', function(e) {
			var keyCode = e.keyCode;
			var leftKey = keyCode == 37 ? true : false;
			var upKey = keyCode == 38 ? true : false;
			var rightKey = keyCode == 39 ? true : false;
			var downKey = keyCode == 40 ? true : false;
			var enterKey = keyCode == 13 ? true : false;
			var ipt_str = $(this).val();
			var ipt_str_len = ipt_str.length;
			
			if (enterKey) {
				if (ipt_str_len > 0) {
					owner._input.val(ipt_str);
					owner.goResultPage();
				}
				
				return false;
			}
		});
		
		// Footer 검색버튼 클릭시
		owner._footer_search_submit.on('click', function(e) {
			e.preventDefault();
			
			var ipt_str = owner._footer_search_input.val();
			var ipt_str_len = ipt_str.length;
			
			if (ipt_str_len > 0) {
				owner._input.val(ipt_str);
				owner.goResultPage();
			}
		});
		
		// body 클릭시 검색창 닫음
		$('body').click(function(e) {
			owner._search_btn.parent().removeClass('active');
			//owner._scope.find('.auto-complete').removeClass('no-results-returned results-returned on');
			owner._scope.find('.auto-complete').removeClass('on');
			owner.resize();
		});
	},
	
	// Popular, Recent 열기
	show_popularRecent_list: function() {
		var owner = this;
		owner._autocomplete_list.hide();
		owner._scope.find('.auto-complete').removeClass('results-returned').addClass('no-results-returned on');
		owner._recent_list.show();
		//owner._popular_list.show();
		owner._show_list_type = 'popular_recent';
	},
	
	// Recent 목록 출력
	render_recent_list: function(recent) {
		var owner = this;

		if(recent == null) return false;
		
		// 공통영역, 페이지의 Recent 목록에 바인드
		var recentData = recent;
		recentData.reverse();
		
		owner._global_recent_list.each(function(){
			var nodeName = String(this.nodeName).toLowerCase();
			var html = '';
			var self = $(this);
			
			if (nodeName == 'ul') {
				$.each(recentData, function(idx, val) {
					// 3개까지만 출력
					if (idx >= 3) return false;
					
					html += '<li><a href="javascript:;">' + val +'</a></li>';
				});
			}
			else if (nodeName == 'div') {
				$.each(recentData, function(idx, val) {
					// 3개까지만 출력
					if (idx >= 3) return false;
					
					html += '<a href="javascript:;">' + val +'</a>';
				});
			}
			
			self.empty().append(html);
			
			self.find('a').click(function(event){
				var searchTxt = $(this).text();
				owner._input.val(searchTxt);
				
				owner.goResultPage();
			});
		});
	},

	// 자동완성 목록 출력
	render_autocomplete_list: function(data) {
		var owner = this;
		owner._popular_list.hide();
		owner._recent_list.hide();
		owner._autocomplete_list.empty();
		
		$.each(data, function(idx, val){
			// 옵션에서 지정한 갯수 까지만 출력
			if (idx >= owner._options.disp_len) return false;
			
			owner._autocomplete_list.append('<li><a href="javascript:;">' + val +'</a></li>');
		});
		
		owner._autocomplete_list.find('a').click(function(event){
			var searchTxt = $(this).text();
			owner._input.val(searchTxt);
			owner.goResultPage();
		});
		
		owner._scope.find('.auto-complete').removeClass('no-results-returned').addClass('results-returned on');
		owner._autocomplete_list.show();
		owner._show_list_type = 'autocomplete';
	},
	
	// 페이지 이동
	goResultPage: function() {
		var owner = this;
		var searchTxt = owner._input.val();
		var recent_data = [];
		
		// 쿠키에서 최근 검색어 가져옴
		if ($.cookie('sk') != null) {
			recent_data = JSON.parse($.cookie('sk'));
		}
		
		// 에러날 문자들 제거
		searchTxt = searchTxt.replace(/"/g, ' ');
		searchTxt = searchTxt.replace(/'/g, ' ');
		searchTxt = searchTxt.replace(/>/g, ' ');
		searchTxt = searchTxt.replace(/</g, ' ');
		searchTxt = searchTxt.replace(/\+/g, ' ');
		searchTxt = searchTxt.replace(/:/g, ' ');
		searchTxt = searchTxt.replace(/\\\\/g, ' ');
		searchTxt = searchTxt.replace(/(^\s*)|(\s*$)/g, "");
		
		var isDupl = false;

		// 검색어 중복 체크
		$.each(recent_data, function(idx, val) {
			if (val == searchTxt) {
				isDupl = true;
				return false;
			}
		});
		
		// 중복이 아닌경우
		if (!isDupl) {
			var tmp_arr = recent_data;
			tmp_arr.reverse();
			
			var newArr = [];
			
			$.each(tmp_arr, function(idx, val) {
				if (idx > 1) return false;
				
				newArr.push(val);
			});
			
			newArr.reverse();
			newArr.push(searchTxt);
			
			recent_data = newArr;
			recent_data = JSON.stringify(recent_data);
			
			$.cookie('sk', recent_data, { domain: '.samsung.com', path: '/semiconductor/', secure: false });
		}

		
		var link = '';
		// SITE_CD 확인
		if(owner._options.site_code == 'global'){
			link = '/semiconductor/search/?q=' + encodeURIComponent(searchTxt);
		} else {
			link = '/semiconductor/' + owner._options.site_code + '/search/?q=' + encodeURIComponent(searchTxt);
		}
		
		location.href = link;
	}
});