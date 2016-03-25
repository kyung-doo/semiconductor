/*!
 * @class	{Class} PersonalHistoryUI
 */
var PersonalHistoryUI = Class.extend({
	/**
	 * initialize
	 *
	 * @constructs
	 * @extends	{Class}
	 * @requires	jquery.js
	 * @classdesc
	 * Personal History 생성<br/>
	 * (data-role 속성으로 자동 생성)
	 *
	 * @param		{DOM} scope - 컨테이너
	 *
	 * @example
	 *
	 * <!--
	 *    data-role="ui-personalhistory" - 컨테이너
	 *    data-role="ui-personalhistory-product" - 프로덕트 영역
	 *    data-role="ui-personalhistory-content" - 컨텐츠 영역
	 * -->
	 *
	 */
	init : function(scope) {
		this._scope = $(scope);
		this._layer_products = null;
		this._layer_contents = null;
		this._layer_notification = null;
		this._titles = null;
		this._btn_personalhistory = null;
		this._btn_close_personalhistory = null;
		
		this.drawCookieData = null;
		this.addCookieData = null;

		this._tid = null;
		this.build_content();
		this.build_event();
		this.init_notification();
	},

	/**
	 * build-content
	 *
	 * @private
	 * @return		{void}
	 */
	build_content : function() {
		var owner = this;
		
		owner._layer_products = owner._scope.find('ul[data-role=ui-personalhistory-products]');
		owner._layer_contents = owner._scope.find('ul[data-role=ui-personalhistory-contents]');
		owner._layer_notification = $("div.history_notification");
		
		owner._titles = owner._scope.find('dt[data-role=ui-personalhistory-title]');
		owner._btn_personalhistory = $('button[data-role=ui-btn-personalhistory]');
		owner._btn_close_personalhistory = $('a[data-role=ui-btn-close-personalhistory]');
		owner._btn_noti_personalhistory = $('a[data-role=ui-personalhistory-notification]');
		
		owner.drawCookieData = owner.draw_cookie_data;
		owner.addCookieData = owner.add_cookie_data; 
	},

	/**
	 * build-event
	 *
	 * @private
	 * @return		{void}
	 */
	build_event : function() {
		var owner = this;
		
		owner._btn_personalhistory.click(function(e){
			owner._scope.slideToggle(_common._transition_speed).toggleClass('active');
			owner._layer_notification.hide();
			if(owner._scope.hasClass('active')){
				owner.draw_cookie_data();
				sendClickCode('gnb','b2b_personal history');
			}
		});
		
		owner._titles.click(function(e){
			if(_common.is_mode() != 'MOBILE') return false;
			$(this).toggleClass('active').next().slideToggle(_common._transition_speed);
		});
		
		owner._btn_close_personalhistory.click(function(e){
			owner._scope.slideUp(_common._transition_speed).removeClass('active');
		});
		
		owner._btn_noti_personalhistory.click(function(e){
			owner._layer_notification.hide();
			owner._btn_personalhistory.click();
			
			sendClickCode('content_click_count','personal history:notice_history msg');
		});

		owner._scope.on('click', 'button[data-role="ui-btn-ph-del"]', function(e){
			var type = $(this).data('type');
			var id = $(this).data('id');
			
			sendClickCode('content_click_count','personal history:delete');

			owner.delete_cookie_data(type, id);
			owner.draw_cookie_data();
		});
		
		owner._scope.on('click', 'button[data-role="ui-btn-ph-pin"]', function(e){
			var type = $(this).data('type');
			var id = $(this).data('id');

			var isPined = $(this).closest('li').data('pintime');
			if(isPined){
				sendClickCode('content_click_count','personal history:pin_uncheck');
			}
			else{
				sendClickCode('content_click_count','personal history:pin_check');
			}
			
			owner.update_cookie_data(type, id, 'p');
			owner.draw_cookie_data();
			
			
		});
		
		owner._layer_contents.on('click', 'button[data-role=ui-btn-ph-readmore]', function(e){
			e.preventDafault;
			var url = $(this).data('url');
			
			document.location.href = url;
		});
		
		owner._layer_contents.on('click', 'button[data-role="ui-btn-ph-pdfdownload"]', function(e){
			e.preventDafault;
			var url = $(this).data('url');
			
			window.open(url, '_blank');
		});
		
		owner._layer_products.on('click', 'a[data-role=ui-btn-productlink]', function(e){
			var data_url = '/semiconductor/products/' + $(this).data('url');
			var isPDP = $(this).text().split('>').length >= 3 ? true : false;
			
			sendClickCode('content_click','personal history:' + $(this).text());
			if(isPDP){
				sendClickCode('finding_method','personal history');
			}
			
			var urlTest = function(url, callback){
				if(!document.body){
					return setTimeout(function(){
						urlTest(url, callback);
					}, 2000);
				}

				var check = document.createElement('iframe')
				, no = urlTest.no ? ++urlTest.no : (urlTest.no=1);
				check.id = 'urlTest'+no;
				check.style.visibility = 'hidden';

				document.body.appendChild(check);

				check.onload = function(){
					check.timer && (clearTimeout(check.timer));
					
					try{
						if(check.contentWindow['GLOBAL_ERRTYPE']){
							throw new Error("page not found")
						}
						
						callback(!check.contentWindow.document);
					}
					catch(e){
						callback(true);
					}
					
					document.body.removeChild(check);
				}

				check.timer = setTimeout(check.onload, 2000);
				check.contentWindow.location.href = url;
			};
			
			urlTest(data_url, function(isDead){
				if(isDead){
					_common.open_popup_layer('noresult');
				}
				else{
					window.location.href = data_url;
				}
			});
		});
		
		$(window).resize(function(){
			if (typeof owner._tid != 'undefined' || owner._tid != null) {
				clearTimeout(owner._tid);
			}
			
			owner._tid = setTimeout(function(){
				owner._tid = null;

				owner.drawCookieData();
			}, 100);
		});
		
	},

	/**
	 * create_default_cookie
	 *
	 * @private
	 * @param		{void}
	 * @return		{void}
	 */
	create_default_cookie : function() {		
		if (!$.cookie('ph_product')) {
			$.cookie('ph_product', JSON.stringify([]), {expires: 90, path: '/semiconductor/'});
		}
		
		if (!$.cookie('ph_content')) {
			$.cookie('ph_content', JSON.stringify([]), {expires: 90, path: '/semiconductor/'});
		}
	},
	
	/**
	 * get_cookie_data
	 *
	 * @private
	 * @param		{string} 쿠키타입
	 * @return		{json} 쿠키데이터
	 */
	get_cookie_data : function(type) {
		var data = null;
		
		if(type == 'p'){
			data = JSON.parse($.cookie("ph_product"));
		}
		else if(type = 'c'){
			data = JSON.parse($.cookie("ph_content"));
		}
		
		return data;
	},
	
	/**
	 * set_cookie_data
	 *
	 * @private
	 * @param		{json} 쿠키에 저장될 데이터
	 * @return		{void}
	 */
	set_cookie_data : function(type, data) {
		if(type == 'p'){
			$.cookie("ph_product", JSON.stringify(data), {expires: 90, path: '/semiconductor/'});
		}
		else if(type = 'c'){
			$.cookie("ph_content", JSON.stringify(data), {expires: 90, path: '/semiconductor/'});
		}
	},
	
	/**
	 * draw_cookie_data
	 *
	 * @private
	 * @param		{void}
	 * @return		{void}
	 */
	draw_cookie_data : function() {
		var owner = this;
		
		owner.create_default_cookie();
	
		var makeMarkup = function(type){
			var html = "", html_fixed = "";
			var data = owner.get_cookie_data(type);
		
			if(data.length > 0){
				$.each(data.reverse(), function(idx, val){
					if(idx > 4){
						if(_common.is_mode() == 'MOBILE') return false;
					}
					var pinStyle = '';
					var temp = '';
					var pinTime = (typeof val.pt == 'undefined') ? '' : val.pt;
					if(val.p == 1) pinStyle = 'selected';
					
					if(type == 'p'){
						
						temp += '<li data-pintime="' + pinTime + '">';
						temp += '	<p class="' + pinStyle + '">';
						temp += '		<span class="title">';
						temp += '		<button type="button" class="btn-ico ico_pin" data-role="ui-btn-ph-pin" data-type="' + type + '" data-id="' + val.i + '"><span class="blind">pin icon</span></button><a href="javascript:void(0)" data-role="ui-btn-productlink" data-url="' + val.u + '">' + val.c + '</a>';
						temp += '		</span>';
						temp += '		<span class="btn_area">';
						temp += '		<button type="button" class="btn_delect" data-role="ui-btn-ph-del" data-type="' + type + '" data-id="' + val.i + '"><span class="blind">delect</span></button>';
						temp += '		</span>';
						temp += '	</p>';
						temp += '</li>';
							
					}
					else if(type = 'c'){
						
						var linkType = '';
						var linkRole = '';
						var linkText = '';
						var linkOptions = '';
						
						if(val.k == 'r'){
							linkType = 'ico_more';
							linkRole = 'data-role="ui-btn-ph-readmore"';
							linkText = 'view more';
							linkOptions = 'data-url="/semiconductor/' + val.u + '"';
						}
						else if(val.k == 'v'){
							var videoType = '';
							if(val.vt == 'y'){
								videoType = 'youtube';
							}
							else if(val.vt == 'b'){
								videoType = 'brightcove';
							}
							
							linkType = 'ico_movie';
							linkRole = 'data-role="play-btn"';
							linkText = '';
							linkOptions = 'data-video-type="' + videoType + '" data-video-id="' + val.vi + '" data-view="1" onclick="sendClickCode(\'content_click_count\',\'personal history:video_' + val.c + '\');';
							if(val.it && val.is){
								linkOptions += 'sendClickCode(\'content\',\'insights:' + val.it + ':' + val.is + ':video\')"';
							}
							else{
								linkOptions += '"';
							}
						}
						else if(val.k == 'p'){
							linkType = 'ico_down';
							linkRole = 'data-role="ui-btn-ph-pdfdownload"';
							linkText = 'download';
							var fileName = val.u.split('/')[val.u.split('/').length-1];
							linkOptions = 'data-url=\'/semiconductor/' + val.u + '\' onclick="sendClickCode(\'download_insights\',\'' + fileName + '|personal history:download_' + val.is + '\');';
							if(val.it && val.is){
								linkOptions += 'sendClickCode(\'content\',\'insights:' + val.it + ':' + val.is + ':download pdf\')"';
							}
							else{
								linkOptions += '"';
							}
						}
						
						temp += '<li data-pintime="' + pinTime + '">';
						temp += '	<p class="' + pinStyle + '">';
						temp += '		<span class="title">';
						temp += '		<button type="button" class="btn-ico ico_pin" data-role="ui-btn-ph-pin" data-type="' + type + '" data-id="' + val.i + '"><span class="blind">pin icon</span></button>' + val.c;
						temp += '		</span>';
						temp += '		<span class="btn_area">';
						temp += '		<button type="button" class="btn-ico ' + linkType + '" ' + linkRole + ' ' + linkOptions + '><span class="blind">' + linkText + '</span></button><button type="button" class="btn_delect" data-role="ui-btn-ph-del" data-type="' + type + '" data-id="' + val.i + '"><span class="blind">delect</span></button>';
						temp += '		</span>';
						temp += '	</p>';
						temp += '</li>';
						
					}
					
					if(val.p == 1) {
						html_fixed += temp;
					}
					else{
						html += temp;
					}
				});
				
				var temp_html = '';
				var	pinTimeArray = new Array();
				
				$.each($(html_fixed), function(idx, val){
					pinTimeArray.push($(this).data('pintime'));
				});
				
				pinTimeArray.sort(function(a, b){return b-a});
				
				var pinLiArray = new Array();
				
				$.each(pinTimeArray, function(idx, val){
					$.each($(html_fixed), function(j, vj){
						if(val == $(vj).attr('data-pintime')){
							temp_html += $(vj).prop('outerHTML');
						}
					});
					
				});

				html_fixed = temp_html + html;
			}
			
			var result = new Array();
			$(html_fixed).each(function(idx, val){
				result.push($(this));
			});
			
			return result;
		};
		
		var productsResult = makeMarkup('p');
		var contentsResult = makeMarkup('c');
		
		if(productsResult.length > 0){
			owner._layer_products.parent().find('p.no_history').hide();
			owner._layer_products.empty().append(productsResult);
		}
		else{
			owner._layer_products.empty();
			owner._layer_products.parent().find('p.no_history').show();
		}
		
		if(contentsResult.length > 0){
			owner._layer_contents.parent().find('p.no_history').hide();
			owner._layer_contents.empty().append(contentsResult);
		}
		else{
			owner._layer_contents.empty();
			owner._layer_contents.parent().find('p.no_history').show();
		}
	},
	
	/**
	 * delete_cookie_data
	 *
	 * @private
	 * @param		{string} 쿠키 종류, {int} 데이터 id
	 * @return		{void}
	 */
	delete_cookie_data : function(type, id) {
		var owner = this;
		var data = owner.get_cookie_data(type);
		var new_data = [];
		
		$.each(data, function(idx, val) {
			if(Number(id) != Number(val.i)) new_data.push(val);
		});
		
		owner.set_cookie_data(type, new_data);
	},

	/**
	 * update_cookie_data
	 *
	 * @private
	 * @param		{string} 쿠키 종류, {int} 데이터 id, {string} key, {string} value
	 * @return		{void}
	 */
	update_cookie_data : function(type, id, attrName, p_val) {
		var owner = this;
		var data = owner.get_cookie_data(type);

		$.each(data, function(idx, val){
			if(Number(val.i) == Number(id)){
				
				if(attrName == 'p'){
					if(Number(val.p) == 1){
						val.p = 0;
						val.pt = '';
					}
					else{
						var pinCnt = 0;
						
						$.each(data, function(sub_idx, sub_val){
							if(Number(sub_val.p) == 1) pinCnt++;
						});
						
						if(pinCnt < 5){
							val.p = 1;
							val.pt = new Date().valueOf();
						}
						else{
							_common.open_popup_layer('overpin');
							var $popupOverpinMsg = $('div[data-role=ui-layer-overpin]').find('span[data-role=ui-msg-type]');
							
							if(type == 'p'){
								$popupOverpinMsg.text('products');
							}
							else{
								$popupOverpinMsg.text('contents');
							}
						}
					}
				}
				else{
					val[attrName] = p_val;
				}			
			}
		});
		
		owner.set_cookie_data(type, data);
	},
	
	/**
	 * add_cookie_data
	 *
	 * @private
	 * @param		{string} 쿠키 종류, {array} 데이터
	 * @return		{void}
	 */
	add_cookie_data : function(type, param) {
		var owner = this;
		var data = owner.get_cookie_data(type);
		var getMaxId = function(){
			var max = 0;
			var temp_data = owner.get_cookie_data(type);
			
			$.each(temp_data, function(idx, val){
				if(Number(val.i) > Number(max)) max = val.i;
			});
			
			return Number(max);
		};
		
		var maxRowCnt = 10;
		 
		if(data.length >= maxRowCnt){
			var minId = getMaxId();

			for(var i = data.length - maxRowCnt; i >= 0; i--){
				var new_data = owner.get_cookie_data(type);
				
				$.each(new_data, function(j, val){
					
					if(Number(minId) > Number(val.i) && Number(val.p) == 0){
						minId = val.i;
					}
				});
				owner.delete_cookie_data(type, minId);
			}
			
			data = owner.get_cookie_data(type);
		}
		
		var tempId = getMaxId();
		var tempUrl = param.url;
		
		if(type === 'p'){
			tempUrl = (tempUrl.indexOf('/semiconductor/products/') >= 0) ? tempUrl.slice(tempUrl.indexOf('/semiconductor/products/') + '/semiconductor/products/'.length) : tempUrl;
		}
		else if(type === 'c' && (param.kind === 'r' || param.kind === 'p')){
			tempUrl = (tempUrl.indexOf('/semiconductor/') >= 0) ? tempUrl.slice(tempUrl.indexOf('/semiconductor/') + '/semiconductor/'.length) : tempUrl;
		}
		
		var temp = {
			"p": 0,
			"i": tempId + 1,
			"c": param.content,
			"u": tempUrl,
			"k": param.kind,
			"vt": param.videoType,
			"vi": param.videoId,
			"pa": JSON.stringify(param.param),
			"it": param.insightType,
			"is": param.insightSeq
		}
		
		if(type === 'c' && param.kind === 'r'){
			$.extend(temp, {"sn": 0});
		}
		
		var chkVal = new Array();

		$.each(owner.get_cookie_data(type), function(idx, val){
			var attrList = ['c', 'u', 'k', 'vt', 'vi', 'pa', 'it', 'is'];
			var chkSubVal = new Array();
			var chk_val = function(temp_val, cookie_val){
				if(temp_val !== undefined){
					if(cookie_val === temp_val){
						chkSubVal.push(1);
					}
					else{
						chkSubVal.push(0);
					}
				}
			}
			
			$.each(attrList, function(idx_2, val_2){
				chk_val(temp[val_2], val[val_2]);
			});
			
			chkVal.push(chkSubVal);
		});
		
		var testVal = 0;
		
		$.each(chkVal, function(idx, val){
			var subTestVal = 0;
			$.each(val, function(idx_2, val_2){
				subTestVal += Number(val_2);
			});
			
			if(val.length == subTestVal) testVal++;
		});

		if(testVal === 0){
			data.push(temp);
			
			if(!(type === 'c' && param.kind === 'r') && (owner.get_cookie_data('p').length + owner.get_cookie_data('c').length) === 0){
				owner._layer_notification.show();
				sendClickCode('content_click_count','personal history:notice_display');
			}
			
			owner.set_cookie_data(type, data);
			owner.draw_cookie_data();
		}
	},
	
	/**
	 * init_notification
	 *
	 * @private
	 * @param		{void}
	 * @return		{void}
	 */
	init_notification : function() {
		var owner = this;
		
		owner.create_default_cookie();
		
		$.each(owner.get_cookie_data('c'), function(idx, val){
			var url = val.u;
			
			if(url && url.indexOf('http://') === 0){
				url = (url.indexOf('/semiconductor/') >= 0) ? url.slice(url.indexOf('/semiconductor/')) : url;
			}
			
			if(owner.get_cookie_data('p').length === 0 && owner.get_cookie_data('c').length === 1 && val.sn === 0 && url && url === window.location.pathname){
				owner.update_cookie_data('c', val.i, 'sn', 1);
				owner._layer_notification.show();
				sendClickCode('content_click_count','personal history:notice_display');
			}
		});
	},
});
