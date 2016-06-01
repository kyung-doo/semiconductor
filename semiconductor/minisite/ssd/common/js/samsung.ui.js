/*!
 * @class    {Class} messageType01
 */
var messageType01 = {
    // Global
    "global" : {
        compareUI : {
            acc_close_compare_layer : "close compare layer"
        },
        layerCompareUI : {
            button_added : "ADDED",
            button_compare : "COMPARE",
            valid_select_more_item1 : "You can compare up to 3 products.",
            valid_select_more_item2 : "Add another item to compare with"
        },
        pagerUI : {
            acc_previous : "Previous",
            acc_next : "Next"
        },
        stepSearchUI : {
            valid_no_image : "No images for the corresponding product."
        },
        tabUI : {
            button_close : "Close"
        },
        flickUI : {
            button_play : "Play",
            button_pause : "pause"
        },
        catalogue : {
            partnumber : "Partnumber"
        }
    }
};

var messageType02 = {
    // Energy Label
    airconditioner: {
        label_indoor_uint:     'Indoor unit' ,     // b2b4.airconditioner.label.indoor.uint
        valid_county:         'Please select the \'County\' field.',      // b2b4.airconditioner.label.valid.county
        valid_outdoor:         'Please select the \'Outdoor unit\' field.',     // b2b4.airconditioner.label.valid.outdoor
        valid_indoor:         'Please check the \'Indoor unit\' field.',     // b2b4.airconditioner.label.valid.indoor
        valid_model:         'Please select the \'Model\' field.',     // b2b4.airconditioner.label.valid.model
        lable_select:         'Select'      // b2b4.airconditioner.label.select
    },

    // Comparison
    compare: {
        label_at_glance:         'At a Glance',     // b2b4.compare.label.ataglance
        button_learn_more:         'LEARN MORE',     // b2b4.compare.learn.more
        button_collapse_all:     'Collapse All -',      // b2b4.comparison.collapseall.text=Collapse All -
        button_expand_all:         'Expand All +',    // b2b4.comparison.expandall.text=Expand All +
        button_delete_product:     'Delete Product '        // b2b4.pdp.compare.delete.product=Delete Product
    },

    // EBC
    ebc: {
        valid_check:             'Please check {0}',          // b2b4.ebc.txt.valid.check=Please check {0}
        valid_enter_your:         'Please enter your {0}',          // b2b4.ebc.txt.valid.enter=Please enter your {0}
        valid_choose_your:         'Please choose your {0}',         // b2b4.ebc.txt.valid.choose=Please choose your {0}
        valid_enter_valid:         'Please enter a valid {0}',          // b2b4.ebc.txt.valid.enter.valid=Please enter a valid {0}
        valid_job_function:     'Job Function',         // b2b4.requestaquote.jobfunction=Job Function
        valid_industry_type:     'industry type.',         // b2b4.ebc.txt.valid.industry.type
        valid_email_address:     'e-mail address.',         // b2b4.ebc.txt.valid.email.address
        valid_phone_number:     'phone number.',          // b2b4.ebc.txt.valid.phone.number
        valid_number_visitors:     'Number of Visitors',        // b2b4.ebc.visitors=Number of Visitors
        valid_desired_date:     'Desired Date of Visit',        // b2b4.ebc.date=Desired Date of Visit
        valid_enter_desired_date:'Please enter a valid Desired Date of Visit',    // b2b4.ebc.txt.valid.enter.desired.date
        valid_agreement:         'agreement.',         // b2b4.ebc.txt.valid.agreement
        button_read_more:         'Read more',        // b2b4.smartfinder.common.readmore=Read more
        button_download_pdf:     'Download PDF',    // b2b4.smartfinder.common.downloadpdf=Download PDF
        button_play_video:         'Play video'        // b2b4.smartfinder.common.playvideo=Play video
    },

    // My Business
    mybusiness: {
        label_no_recent_history:     'There are no recent histories for Insights',     // mybusiness.recently.insights.empty=There are no recent histories for Insights
        acc_close_layer:             'Close Layer',    // mybusiness.close.layer
        button_download_pdf:         'Download PDF',    // b2b4.smartfinder.common.downloadpdf=Download PDF
        button_read_more:             'Read more',    // b2b4.smartfinder.common.readmore=Read more
        button_play_video:             'Play video'        // b2b4.smartfinder.common.playvideo=Play video
    },

    // Support Detail
    support_detail: {
        label_faqs:             'Faqs',    // b2b4.support.detail.label.faqs
        label_how_to:             'How to guides',      // b2b4.support.detail.label.howto
        label_video_how_to:     'Video how to guides',      // b2b4.support.detail.label.video.howto
        label_troubleshooting:     'Troubleshooting'     // b2b4.support.detail.label.troubleshooting
    },

    // filter
    filter: {
        noresult:             'Sorry, no results were found.',    // common.noresult.text=Sorry, no results were found.
        tryanothercategory: 'Try another category'        // b2b4.noresult.tryanothercategory.text=Try another category.
    },

    // buyOnline
    buyonline : {
        buyonline_title:     'BUY ONLINE',           //b2b4.common.upper.buyonline=BUY ONLINE
        buyonline_link:        'GO'             //product.buyonline.go.text=GO
    }
};



﻿/*!
 * @class    {Class} UIManager
 */
var UIManager = Class.extend({
    /**
     * Initialize
     */
    init : function() {
        this.init_body();
        this.init_video();
        this.reinit();
    },

    /**
     * ReInitialize
     */
    reinit : function(type) {
        switch(String(type).toUpperCase()) {
            case 'VIDEO':
                this.reinit_video();
                break;

            default:
                this.init_alink();
                this.init_accordion();
                this.init_layer_video();
                this.init_layer_common();
                this.init_globalsearch();
                this.init_filter();
                this.init_go_top();
                this.init_browser_fix();
                this.init_personal_history();
                //this.init_survey();
                this.init_offline_loadmore();
                this.init_placeholder();

                break;
        };
    },

    /**
     * Initialize Body
     */
    init_body : function() {
        // 1. type-browser-vendor
        $('body').addClass(ValidationUtil.get_browser_type());

        // 2. type-platform
        $('body').addClass(ValidationUtil.get_platform_type());

        // 3. show/hide browser-notice part as browser type
        var iev = ValidationUtil.get_msie_version();

        if (!(ValidationUtil.is_null(iev)) && iev <= 8) {
            $('.browser-notice').show();
        }
    },

    /**
     * Initialize alink
     */
    init_alink : function() {
        $('a').each(function(a) {
            var $this = $(this);

            if ($this.attr('href') == '#') {
                $this.attr('href', 'javascript:void(0);');
            }

            // ie7 fix
            if (String($this.attr('href')) == window.location.href + '#') {
                $this.attr('href', 'javascript:void(0);');
            }

            // attr[href=#top] : go to top
            if ($this.attr('href') == '#header') {
                $this.click(function(e) {
                    $(window).scrollTop(0);
                    $('#header').focus();
                    e.preventDefault();
                });
            }
        });
    },

    /**
     * Initialize Accordion
     */
    init_accordion : function() {

        var owner = this;

        if ($('*[data-role=ui-accordion]').length) {

            if ( typeof $(this).attr('data-accordion-type') === 'undefined') {

                $('*[data-role=ui-accordion]').each(function() {
                    $(this).data('accordion', new AccordionUI($(this)));
                });
            }
        }
    },

    /**
     * Initialize Video
     */
    init_video : function() {
        var owner = this;
        var btnCnt = $('*[data-role=play-btn]').length + $('*[data-role=common-video-player]').length;
        var ytCnt = 0;
        var bcCnt = 0;

        if($('*[data-role=play-btn]').length > 0){
            $.each($('*[data-role=play-btn]'), function(i, v){
                if($(this).data('videoType') == 'youtube'){
                    ytCnt++;
                }
                else{
                    bcCnt++;
                }
            });
        }

        if($('*[data-role=common-video-player]').length > 0){
            $.each($('*[data-role=common-video-player]'), function(i, v){
                if($(this).hasClass('youtube-player')){
                    ytCnt++;
                }
                else{
                    bcCnt++;
                }
            });
        }

        /**
         *  YouTube Player API(IFrame API)
         *
         * @definition
         *
         * @reference
         *  https://developers.google.com/youtube/iframe_api_reference
         *
         * */
        if(btnCnt > 0 && ytCnt > 0 && SITE_CD != 'cn'){
            $.getScript('https://www.youtube.com/iframe_api', function(data, textStatus, jqxhr) {
                if ( typeof (window.YT) != 'undefined' && typeof (window.YT.Player) != 'undefined') {
                    owner.reinit_video();
                };
            });
        }

        /**
         *  Dynamically Loading a Player Using JavaScript API
         *
         * @definition
         * To dynamically add or remove players from a page using the createExperiences() and unload() methods in the Video Cloud JavaScript Player API
         *
         * @method
         * - createExperiences()
         * - unload()
         *
         * @reference
         *  http://support.brightcove.com/en/video-cloud/docs/dynamically-loading-player-using-javascript
         *
         * */
        if(btnCnt > 0 && bcCnt > 0){
            $.getScript('http://admin.brightcove.com/js/BrightcoveExperiences.js', function(data, textStatus, jqxhr) {
                brightcove.createExperiences();
            });
        }
    },

    /**
     * re-initialize-video(YouTube)
     */
    reinit_video : function() {
        var owner = this;

        $('*[data-role=common-video-player]').each(function(a) {
            if (ValidationUtil.is_null($(this).data('manager')) && $(this).hasClass('youtube-player')) {
                var aid = $(this).attr('id');
                var avid = $(this).attr('data-video-id');

                owner.build_video(aid, avid, '100%', '100%');
            };
        });
    },

    /**
     * build-youtube-video(YouTube)
     */
    build_video : function(id, videoid, width, height) {
        var owner = this;
        var autoplay = 1;

        if (id.indexOf('home-video-player') > -1) {
            autoplay = 0;

        }

        var player = new YT.Player(id, {
            'videoId' : videoid,
            'width' : width,
            'height' : height,
            'wmode' : 'transparent',
            'playerVars' : {
                'allowfullscreen' : true,
                'enablejsapi' : 1,
                'version' : 3,
                'autoplay' : 0

            }
        });

        $('#' + id).empty().attr('data-role', 'common-video-player').data('manager', player);

    },


    /**
     * stop-video
     */
    stop_video : function(id) {
        $('*[data-role=common-video-player]').each(function(a) {
            if (!ValidationUtil.is_null($(this).data('manager')) && $(this).attr('id') != id) {
                if ($(this).hasClass('youtube-player')) {
                    $(this).data('manager').stopVideo();
                } else {
                    $(this).data('manager').pause();
                }
            }
        });
    },

    /**
     * load-brightcove-video(Brightcove)
     *
     * @private
     *
     * @definition
     * Brightcove template load callback, called when template loads,
     *    this function stores a reference to the player and modules.
     *
     * @param {HTMLElement} experienceID - id of player.
     * @return        {void}
     */
    load_template : function(experienceID) {
        // 1. init-brightcove-video
        var player = brightcove.api.getExperience(experienceID);
        var APIModules = brightcove.api.modules.APIModules;
        var videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);

        var experienceModule = player.getModule(APIModules.EXPERIENCE);
        var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
        var Android = /(Android)/g.test(navigator.userAgent);

        if (iOS || Android) {
            $(window).on('resize', function() {
                var w = $('*[data-role=ui-layer-content]').length ? $('*[data-role=ui-layer-content]').width() : $('div.video-box').width();
                var h = $('*[data-role=ui-layer-content]').length ? $('*[data-role=ui-layer-content]').outerHeight(false) : $('div.video-box').height();

                experienceModule.setSize(w, h);
            });
        }


        var savePlayer = new Object();

        // 2. save-video-player as browser type
        // cf> for ie10 - container id: _containermyExperience
        if (ValidationUtil.get_browser_type() == 'msie10') {
            savePlayer = $('#' + experienceID).parent().parent().parent();
            if ($(savePlayer).parent('#_containermyExperience')) {
                // a. for brigihtcove multi
                $('#_containermyExperience').css('height', '100%');
            }
        } else {
            savePlayer = $('#' + experienceID).parent().parent();
        }

        $(savePlayer).data('manager', videoPlayer);

        // Omniture
        if ( typeof (myTemplateLoaded) !== undefined && typeof (myTemplateLoaded) === 'function') {
            myTemplateLoaded(experienceID);
        }
    },

    /**
     * Initialize Layer Video
     */
    init_layer_video : function() {
        $(document).on('click', '*[data-role=play-btn]', function() {



            var iev = ValidationUtil.get_msie_version();

            if (!(ValidationUtil.is_null(iev)) && iev <= 8 && $(this).attr('data-video-type') == 'brightcove') {
                alert('This video does not support the web browser you are using.');
            } else {
                $(this).data('manager', new LayerVideoUI($(this)));
            }

            $(window).bind('touchmove', function(e){
                e.preventDefault();
            });

            $(window).resize();

            return false;
        });
    },

    /**
     * Initialize Layer Common
     */
    init_layer_common : function() {

        // contact us
        $(document).ready(function(){
            var $scope = $('div[data-role=ui-layer-email]');
            $scope.find(".press_contact_btn button.btn_open").click(function(){
                $(this).toggleClass('hide');
                $(".contact_info_area").slideToggle(_common._transition_speed);
                return false;
            })
            $scope.find(".press_contact_btn button.btn_close").click(function(){
                $(".press_contact_btn button.btn_open").removeClass('hide');
                $(".contact_info_area").slideUp(_common._transition_speed);
                return false;
            })
        });

        $(document).on('click', '*[data-role=ui-btn-term]', function() {
            $(this).data('manager', new LayerCommonUI($(this)));
            var $scope = $('div[data-role=ui-layer-email]');
        });
        $(document).on('click', '*[data-role=ui-btn-privacy]', function()
        {
            $(this).data('manager', new LayerCommonUI($(this)));
            var $scope = $('div[data-role=ui-layer-privacy]');

        });

    },

    /**
     * Initialize - Filter
     *
     * @private
     * @return        {void}
     */
    init_filter : function() {
        $('*[data-role=ui-filter-list]').each(function(a) {
            $(this).data('filter', new FilterUI($(this)));
        });
    },

    /**
     * Initialize - Global Search
     *
     * @private
     * @return        {void}
     */
    init_globalsearch : function() {
        $('*[data-role=ui-globalsearch]').each(function(a) {
            $(this).data('globalsearch', new GlobalSearchUI($(this)));
        });
    },

    /**
     * Initialize - Go top
     */
    init_go_top : function() {
        $(window).on({
            'scroll' : function() {
                var pageHeight = $(window).outerHeight(false);
                var target = $(window).scrollTop();

                if (target >= pageHeight) {
                    $('.btn-go-top').show();
                } else {
                    $('.btn-go-top').hide();
                }
            }
        });
    },

    /**
     * Initialize - Browser bug fix
     */
    init_browser_fix : function() {
        if (/(Android 4.2.2)/g.test(navigator.userAgent)) {
            $('html').addClass('android-4-2-2');
        }
        if (/(Android 4.4.2)/g.test(navigator.userAgent)) {
            $('html').addClass('android-4-4-2');
        }
        if (/(Chrome\/18.)/g.test(navigator.userAgent)) {
            $('html').addClass('chrome-18');
        }
    },

    /**
     * Initialize - Offline Loadmore
     */
    init_offline_loadmore: function(){
        $(document).on('click', '*[data-role=ui-btn-more-offline]', function() {
            var $this = $(this);
            var wrap = null;
            var wrap_article_text = $this.closest('div.article-txt');
            var item = null;

            if (wrap_article_text.length > 0) {
                wrap = wrap_article_text;
                item = '.grid-col4';
            }

            wrap.addClass('active');
            wrap.find(item).first().find('a, button').first().focus();

            $this.hide();
        });
    },

    /**
     * Initialize - Placeholder
     */
    init_placeholder: function(){
        $('input[type=text], textarea').each(function() {
            var hasPlaceholder = $(this).attr('placeholder') != undefined ? true : false;

            if (hasPlaceholder) {
                $(this).placeholder();
            }

        });
    },

    /**
     * Initialize - Personal History
     */
    init_personal_history: function(){
        $('div[data-role=ui-personalhistory]').each(function() {
            _common._ph = new PersonalHistoryUI($(this));
        });
    },

    /**
     * Initialize - Poll Survey
     */
    init_survey : function() {
        /**
         * survey
         *
         * @private
         * @description
         * make survey popup
         *
         * @return        {void}
         */
        var stop_survey = false;
        var pathname = window.location.pathname;
        var exception_path_list = [];
        var popSurvey = function() {
            var src = '';

            src += '<div class="ui-layer-scope reveal-modal-bg" data-role="ui-layer-scope-survey">';
            src += '    <div class="ui-layer-cover"></div>';
            src += '    <div class="pop-wrap ui-layer-container survey">';
            src += '        <div class="ui-layer-content survey">';
            src += '            <div id="poll" class="ui-layer-survey">';
            src += '                <iframe id="survey" class="" data-role="ui-btn-survey" style="border: none; background: none;" frameborder="0" allowfullscreen="0" title="WE VALUE YOUR OPINION" width="100%" height="100%" src="/semiconductor/poll?pollId=3"></iframe>';
            src += '                <a href="#" class="btn-close" data-role="ui-close-survey"><span class="blind">' + messageType01[SITE_CD].tabUI.button_close + '</span></a>';
            src += '            </div>';
            src += '        </div>';
            src += '    </div>';
            src += '</div>';

            $(document).find('body').append($(src));

            $('html, body').css('overflow', 'hidden');

            var ua = navigator.userAgent;
                winHeight = $(window).height();

            if (ua.match(/iPhone|iPod/i) != null) {
                $('#survey').parent().css('height', winHeight);
            }

            if (ua.match(/iPhone|iPod|iPad/i) != null) {

                //$('#survey').height('100%');
                $('#survey').parent().css('-webkit-overflow-scrolling', 'touch');
                $('#survey').parent().css('overflow-y', 'scroll');

                if(_common._isRTL){
                    $('#survey').parent().css('direction', 'initial');
                }
            }

            $('*[data-role=ui-close-survey]').click(function() {
                $('*[data-role=ui-layer-scope-survey]').remove();

                $('html, body').css('overflow', 'visible');
                $('.body-wrap').css({'overflow' : 'visible'});

                if ($.cookie('semi_survey_close') == null) {
                    $.cookie('semi_survey_close', 1, {
                        expires : 90,
                        domain : '.samsung.com',
                        path : '/semiconductor/',
                        secure : false
                    });
                }
            });

            /**
             * resize popup for mobile device
             */
            var resize = function() {
                var owner = {};
                owner._scope = $('*[data-role=ui-layer-scope-survey]');
                owner._container = owner._scope.find('.ui-layer-container');
                var bodyHeight = $('body').outerHeight();
                var contLeft = 0;
                var contTop = 0;
                var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

                $('html, body').css({'overflow' : 'initial'});

                if(iOS){

                    owner._container.find('>div').css({
                        'display' : 'block',
                        'vertical-align' : 'top'
                    });

                    owner._container.css({
                        'position' : 'absolute',
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

                    owner._scope.find('.ui-layer-cover').css({
                        'position' : 'absolute',
                        'left' : '0',
                        'top' : '0',
                        'bottom' : 'auto',
                        'right' : 'auto',
                        'width' : '100%'
                    });

                    if ($(window).height() >= owner._container.outerHeight()) {
                        contTop = $(window).scrollTop() + (($(window).height() - owner._container.outerHeight()) / 2);
                    } else {
                        contTop = $(window).scrollTop();

                        // 팝업이 바닥페이지(body)의 하단을 넘어가는 경우 바닥페이지의 하단에 맞춤
                        if (bodyHeight <= contTop + owner._container.outerHeight()) {
                            contTop = contTop - (contTop + owner._container.outerHeight() - bodyHeight);
                            contTop -= (parseInt(owner._container.css('padding-top')) + parseInt(owner._container.css('padding-bottom')) + parseInt(owner._container.find('.ui-layer-content').find('>div').css('border-top')) + parseInt(owner._container.find('.ui-layer-content').find('>div').css('border-bottom')));
                        }
                    }

                    contLeft = ($(window).width() - owner._container.outerWidth()) / 2;

                    owner._scope.css('height', '100%');
                    owner._container.css({
                        'top' : contTop,
                        'left' : contLeft
                    });
                    owner._scope.find('>div>div').focus();
                    owner._scope.find('.ui-layer-cover').css('height', '100%');
                    $('body').css('position', 'relative');
                }

            };

            $.each(['show', 'hide'], function(i, val) {
                var _org = $.fn[val];
                $.fn[val] = function() {
                    this.trigger(val);
                    _org.apply(this, arguments);
                };
            });

            $('*[data-role=ui-layer-scope-survey]').bind('hide', function() {
                $('html, body').css('overflow', 'visible');
                $('.body-wrap').css({'overflow' : 'visible'});
                $('body').css('position', '');
            });

            if (ValidationUtil.is_mobile()) {
                resize();

                $(window).resize(function() {
                    if (_common._document_width != $(window).width()) {
                        _common._document_width = $(window).width();
                        resize();
                    }
                });
            }
        };

        stop_survey = ($('#pageTrack').val() == 'business page not found') ? true : false;

        $.each(exception_path_list, function(i, v) {
            if (pathname.indexOf(v) == 0) {
                stop_survey = true;
                return false;
            }
        });

        if (stop_survey) {
            return false;
        }

        if ($.cookie('semi_survey_count') == null) {
            $.cookie('semi_survey_count', 1, {
                domain : '.samsung.com',
                path : '/semiconductor/',
                secure : false
            });
        } else {
            var count = Number($.cookie('semi_survey_count'));

            if ($.cookie('b2bpoll') == null && $.cookie('semi_survey_close') == null) {

                count++;
                $.cookie('semi_survey_count', count, {
                    domain : '.samsung.com',
                    path : '/semiconductor/',
                    secure : false
                });

                if (count >= 4) {
                    popSurvey();
                }
            }
        }
    },
});


﻿/*!
 * @class    {Class} CommonUI
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
     * @param        {Object} scope - 표시 객체
     * @return        {Object}
     *
     * <pre class="prettyprint">
     * {
     *        ax:{Number},    // 가로 좌표(절대)
     *         ay:{Number},    // 세로 좌표(절대)
     *         rx:{Number},    // 가로 좌표(상대)
     *         ry:{Number},    // 세로 좌표(상대)
     *         w:{Number},    // 세로 길이
     *         h:{Number}        // 가로 길이
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
     * @param        {Object} scope - 표시 객체
     * @return        {Number} - 세로 전체 길이
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
     * @param        {Object} scope - 표시 객체
     * @return        {Number} - 가로 전체 길이
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
     * @param        {Object} scope - 표시 객체
     * @param        {Object} pos - 마우스 좌표
     * @param        {Number} pos.left - 마우스 가로 좌표
     * @param        {Number} pos.top - 마우스 세로 좌표
     * @return        {Boolean} true | false
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
     * @param        {Object} scope - <code>IMG</code> 객체
     * @param        {String} from - 변경 전 값
     * @param        {String} to - 변경 후 값
     * @return        {void}
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
     * @param        {Object} scope - 표시 객체
     * @param        {Boolean} bool - true [표시] | false [감춤]
     * @return        {void}
     */
    show : function(scope, bool) {
        if (bool)
            $(scope).show();
        else
            $(scope).hide();
    }
});


/*!
 * @class    {Class} NavUI
 */
var NavUI = Class.extend({
    /**
     * initialize
     *
     * @constructs
     * @extends    {Class}
     * @requires    jquery.js
     * @classdesc
     * gnb generation
     *
     * @param        {DOM} scope - container
     *
     * @example
     *
     * <!--
     *    data-role="ui-nav"     - 컨테이너
     *    data-role="ui-nav-sub" - 서브메뉴
     *    data-role="ui-nav-btn" - 모바일에서 gnb 열기
     * -->
     *
     */
    init : function(scope) {
        this._scope = $(scope);
        this._content = null;
        this._sub = null;
        this._default = null;
        this._btn = null;
        this._current = {
            'depth_1' : null,
            'depth_2' : null
        };
        this._active = true;

        this.reinit();
    },

    /**
     * re-initialize
     *
     * @private
     * @return        {void}
     */
    reinit : function() {
        this.build_content();
        this.build_event();
        this.build_resize();
    },

    /**
     * build-content
     *
     * @private
     * @return        {void}
     */
    build_content : function() {
        var owner = this;
        var code = owner.get_gnb_code(window.location.pathname.split('/')[3]);

        owner._content = owner._scope.find('>li>a');
        owner._content.each(function() {
            $(this).data('parent', $(this).parent());
            $(this).data('cnt', $(this).parent().index());

            if ($(this).data('parent').attr('data-gnb') === code) {
                $(this).data('parent').addClass('active');
                owner._default = $(this).data('parent');
            }
        });

        owner._sub = owner._scope.find('*[data-role=ui-nav-sub]>li>a');
        owner._sub.each(function() {
            $this = $(this);
            $this.data('parent', $this.parent());
            $this.data('cnt', $this.parent().index());

            /*
            if($this.parent().find('ul').length > 0){
                $this.attr('href', 'javascript:void(0)');
            }
            */
        });

        owner._btn = $('*[data-role=ui-nav-btn]');
        owner._btn.data('wrap', $('*[data-role=ui-nav-wrap]'));
    },

    /**
     * build-event
     *
     * @private
     * @return        {void}
     */
    build_event : function() {
        var owner = this;
        var w = $(window).width();

        if (w <= 1023) {
            owner._active = false;
            owner.remove_event_d();
            owner.m_event();
        } else {
            owner.remove_event_m();
            owner.d_event();
        }
    },

    /**
     * d-event
     *
     * @private
     * @description
     * 데스크탑 이벤트
     *
     * @return        {void}
     */
    d_event : function() {
        var owner = this;

        owner._content.on({
            'mouseenter' : function() {
                for (var i in owner._current) {
                    if (owner._current[i])
                        owner.deActive_item(owner._current[i]);
                }

                owner.active_item($(this), 1);
            },

            'focus' : function() {
                for (var i in owner._current) {
                    if (owner._current[i])
                    {
                        owner.deActive_item(owner._current[i]);
                    }

                }

                owner.active_item($(this), 1);
            }
        });

        owner._sub.on({
            'mouseenter' : function() {
                if (owner._current.depth_2)
                    owner.deActive_item(owner._current.depth_2);
                owner.active_item($(this), 2);
            },

            'focus' : function() {
                if (owner._current.depth_2)
                    owner.deActive_item(owner._current.depth_2);
                owner.active_item($(this), 2);


            },
            'focusout' : function ()
            {
                console.log("!!!");
                if($(this).parent().is(".last"))
                {
                    
                    owner.reset();
                }
            }
        });

        owner._scope.on('mouseleave', function() {
            owner.reset();
        });
    },

    /**
     * m-event
     *
     * @private
     * @description
     * 모바일 이벤트
     *
     * @return        {void}
     */
    m_event : function() {
        var owner = this;

        owner._content.on({
            'click': function() {
                if (owner._current.depth_1) {
                    if (owner._current.depth_1.data('cnt') === $(this).data('cnt')) {
                        owner.reset();
                        return;
                    }

                    owner.reset();
                }

                owner.active_item($(this), 1);
            },

            'focusout' : function ()
            {
               
            }
        });
        
        $(".direct a").on("focusout", function ( e )
        {
            
            if($(this).parent().is(".last"))
            {
                owner._btn.focus();
            }
        });

        owner._sub.on({
            'click': function()
            {
                if (owner._current.depth_2) 
                {
                    owner.deActive_item(owner._current.depth_2);

                    if (owner._current.depth_2.data('cnt') === $(this).data('cnt')) 
                    {
                        owner._current.depth_2 = null;
                        return;
                    }
                }
                owner.active_item($(this), 2);
                console.log("!!!");
            }
        });

        owner._btn.on('click', function() {
            owner.slide($(this).data('wrap'));

            if($('div[data-role="ui-nav-wrap"]').hasClass('nav-on')){
                sendClickCode('gnb','gnb open');
            }
        });

        $('div.overlay').on('click', function() {
            owner._btn.trigger('click');
        });
    },

    /**
     * remove-event-d
     *
     * @private
     * @description
     * 데스크탑 이벤트 삭제
     *
     * @return        {void}
     */
    remove_event_d : function() {
        var owner = this;

        owner._content.off('mouseenter focus');
        owner._sub.off('mouseenter focus');
        owner._scope.off('mouseleave');
    },

    /**
     * remove-event-m
     *
     * @private
     * @description
     * 모바일 이벤트 삭제
     *
     * @return        {void}
     */
    remove_event_m : function() {
        var owner = this;

        owner._content.off('click');
        owner._sub.off('click');
        owner._btn.off('click');
        $('div.overlay').off('click');
    },

    /**
     * build-resize
     *
     * @private
     * @description
     * 반응형에 따른 이벤트 등록 및 삭제
     *
     * @return        {void}
     */
    build_resize : function() {
        var owner = this;

        $(window).on('resize', function() {
            var w = window.innerWidth;
            var limit = 1023;

            if (w <= limit) {
                if (owner._active) {
                    owner._active = false;
                    owner.remove_event_d();
                    owner.m_event();
                    owner.reset();
                }
            } else {
                if (!owner._active) {
                    owner._active = true;
                    owner.remove_event_m();
                    owner.d_event();

                    if (owner._btn.data('wrap').hasClass('nav-on'))
                        owner.slide(owner._btn.data('wrap'));
                }
            }
        });
    },

    /**
     * active-item
     *
     * @private
     * @param       {jQuery Object} item  - 해당 메뉴 객체
     * @param       {Number} depth        - 해당 메뉴 뎁스
     * @return        {void}
     */
    active_item : function(item, depth) {
        var owner = this;

        item.data('parent').addClass('on');

        if (owner._default !== null)
            owner._default.removeClass('active');

        owner._current['depth_' + depth] = item;
    },

    /**
     * deActive-item
     *
     * @private
     * @param       {jQuery Object} item  - 해당 메뉴 객체
     * @return        {void}
     */
    deActive_item : function(item) {
        item.data('parent').removeClass('on');
    },

    /**
     * reset
     *
     * @private
     * @description
     * 메뉴 리셋
     *
     * @return        {void}
     */
    reset : function() {
        var owner = this;

        for (var i in owner._current) {
            if (owner._current[i])
                owner.deActive_item(owner._current[i]);
            owner._current[i] = null;
        }

        if (owner._default !== null)
            owner._default.addClass('active');
    },

    /**
     * slide
     *
     * @private
     * @description
     * 모바일에서 메뉴 슬라이드
     *
     * @param       {jQuery Object} item  - 모바일에서 메뉴열기 버튼
     * @return        {void}
     */
    slide : function(item) {
        var x = 0;
        var _f = null;
        var flag = $('*[data-role=ui-flick]').length ? true : false;

        if (flag)
            _f = $('*[data-role=ui-flick]').data('flick');

        if (!item.hasClass('nav-on')) {
            //x=-280;
            item.addClass('nav-on');

            if (flag)
                _f.stop_autoplay();
        } else {
            item.removeClass('nav-on');
            this.reset();

            if (flag)
                _f.autoplay();
        }
    },

    /**
     * get-gnb-code
     *
     * @private
     * @param {String} name - 메뉴명
     *
     * @return    {String} code - 메뉴코드
     */
    get_gnb_code : function(name) {
        var code = '';

        switch(name) {
        case 'industry':
            code = 'BIA001';
            break;

        case 'solutions-services':
            code = 'BIA002';
            break;

        case 'business-products':
            code = 'BIA003';
            break;

        case 'insights':
            code = 'BIA004';
            break;

        case 'support':
            code = 'BIA005';
            break;

        case 'promotions':
            code = 'BIA006';
            break;

        default:
            break;
        }

        return code;
    }
});

﻿/*!
 * @class    {Class} AccordionUI
 */
var AccordionUI = Class.extend({
    /**
     * initialize
     *
     * @constructs
     * @extends    {Class}
     * @requires    jquery.js
     * @classdesc
     * 아코디언 메뉴 생성<br/>
     * (data-role 속성으로 자동 생성)
     *
     * @param        {DOM} scope - 컨테이너
     *
     * @example
     *
     * <!--
     *    data-role="ui-accordion" - 컨테이너
     *    data-role="ui-accordion-btn"        - 아코디언 메뉴 열기 버튼
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
     * @return        {void}
     */
    reinit : function() {
        this.build_content();
        this.build_event();
    },

    /**
     * build-content
     *
     * @private
     * @return        {void}
     */
    build_content : function() {
        var owner = this;
        this._type = this._scope.attr('data-accordion-type');

        this._content = this._scope.find('*[data-role=ui-accordion-btn]');

        this._content.on("active", function ( e )
        {
            setTimeout(function (){$(window).resize();},1);
            owner.active_item($(this));
        });

        this._content.on("deActive", function ( e )
        {
            owner._transition.speed = 0;
            owner.deActive_item($(this));
            owner._transition.speed = 300;
        });

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
     * @return        {void}
     */
    build_event : function() {
        var owner = this;

        this._content.off('click').on('click', function(e)
        {

            if(!$(this).attr("data-role")) return;

            if (!$(this).data('content').hasClass('active')) {
                setTimeout(function (){$(window).resize();},1);
                owner.active_item($(this));
                var guideTxt = $(this).find(".blind").text().replace("open", "close");
                $(this).find(".blind").text(guideTxt);
            } else {
                owner.deActive_item($(this));
                var guideTxt = $(this).find(".blind").text().replace("close", "open");
                $(this).find(".blind").text(guideTxt);
            }


        });
    },

    /**
     * active_item
     *
     * @private
     * @param        {Jquery Object} item - 활성화 될 메뉴
     * @return        {void}
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
     * @param        {Jquery Object} item - 비 활성화 될 메뉴
     * @return        {void}
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


﻿/*!
 * @class    {Class} FilterUI
 */
var FilterUI = CommonUI.extend({
    /**
     * initialize
     *
     * @constructs
     * @extends    {CommonUI}
     * @requires    jquery.js
     * @requires    ui.common.js
     * @requires    ui.validation.js
     * @classdesc
     * FilterBy 리스트 블럭 생성<br/>
     * (data-role 속성으로 자동 생성)
     *
     * @param        {Object} scope - 컨테이너
     *
     * <!--
     *        1. desktop version
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
     * @return        {void}
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
     * @return        {void}
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
     * @return        {void}
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
     * @return        {void}
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
     * @return        {void}
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
     * @return        {void}
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
     * @param        {DOM} target
     * @return        {METHOD}    changePage()
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
     * @param    {Number} n : data-code
     * @return        {void}
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
     * @param    {Number} n : data-code
     * @return        {void}
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


﻿/*!
 * @class    {Class} FlickUI
 */
var FlickUI = Class.extend({
    /**
     * initialize
     *
     * @constructs
     * @extends    {Class}
     * @requires    jquery.js
     * @classdesc
     * 플리킹(모바일,태블릿), 슬라이드(데스크탑) 생성<br/>
     * (data-role 속성으로 자동 생성)
     *
     * @param        {DOM} scope - 컨테이너
     *
     * @example
     *
     * <!--
     *    data-role="ui-flick"            - 컨테이너
     *    data-role="ui-flick-container"  - 플리킹 컨테이너
     *    data-role="ui-flick-content"       - 플리킹 컨텐츠
     *    data-role="ui-flick-prev"       - 이전 버튼
     *    data-role="ui-flick-next"       - 다음 버튼
     *    data-role="ui-flick-navigation" - 네비게이션 컨테이너
     * -->
     *
     */
    init : function(scope, opt) {
        this._scope = $(scope);
        this._container = null;
        this._content = null;
        this._navigate = null;
        this._num = null;

        this._case = false;
        this._length = 0;
        this._current = 0;
        this._current_navigate = null;
        this._target = [];
        this._pos = [];
        this._start = {
            'x' : 0,
            'y' : 0
        };
        this._amount = {
            'x' : 0,
            'y' : 0
        };
        this._flag = {
            'scroll' : false,
            'drag' : false,
            'slide' : false,
            'auto' : false
        };
        this._transition = {
            'range' : 0.3,
            'speed' : '100',
            'time' : 10000
        };
        this._isCss = false;
        this._interval = null;

        this._w = 0;
        this._range = 0;

        try {
            this._flag.auto = opt.auto;
        } catch(e) {
        }

        this.reinit();
        this.resize();
        this.control();

    },

    /**
     * re-initialize
     *
     * @private
     * @return        {void}
     */


    reinit : function() {
        // kv와 pdp에서 같이 사용함. 원래는 1로 비교했었는데 pdp에서 문제되어 0으로 변경함.
        if (this._scope.find('*[data-role=ui-flick-content]').children().length > 0) {
            if (this._scope.find('div.ctl-carousel').length) {
                this._scope.find('div.ctl-carousel').show();
            }

            this.build_scope();
            this.build_container();
            this.build_content();
            this.build_navigate();
            this.build_event();
        } else {
            if (this._scope.find('div.ctl-carousel').length) {
                this._scope.find('div.ctl-carousel').hide();
            }

            this._scope.css({
                'visibility' : 'visible'
            });
        }
    },

    control : function() {
        var $control = $('div.ctl-carousel');
        var h = $('[data-role=ui-flick-content] li').height() - $('div.screen div').height() - 30;
        /*
        if(ValidationUtil.is_mobile()) {

            $control.css({
                'top': h,
                'padding-top':'0'
                    });

        };
        */
    },

    resize : function() {
        var owner = this;

        // 2개 이상부터 리사이징 처리라, 1개있을때, 반응형에 대응이 안됨 1이상으로 수정함.
        if (owner._scope.find('*[data-role=ui-flick-content]').children().length > 0) {
            $(window).on('resize', function() {
                owner.resizing();
            });
        }
    },

    /**
     * build-scope
     *
     * @private
     * @return        {void}
     */
    build_scope : function() {
        //this._isCss = this.get_css();
        this._isCss = false;
    },

    /**
     * build-container
     *
     * @private
     * @return        {void}
     */
    build_container : function() {
        var owner = this;

        owner._container = owner._scope.find('*[data-role=ui-flick-container]');
        owner._length = owner._container.children().length;
        owner._container.css({
            'position' : 'relative',
            'overflow' : 'hidden'
        });
    },

    /**
     * build-content
     *
     * @private
     * @return        {void}
     */
    build_content : function(cnt) {
        var owner = this;

        owner._content = owner._container.find('*[data-role=ui-flick-content]');

        // 아이템이 2개인 경우
        if (owner._content.children().length === 2) {
            owner._case = true;
            owner._content.append(owner._content.children().first().clone(true).attr('data-clone', 'clone'));
            owner._content.append(owner._content.children().eq(1).clone(true).attr('data-clone', 'clone'));
        }

        owner._length = owner._content.children().length;
        //owner._w=owner._container.width();

        // sub 타입인 경우 (sample image)
        // ui.slide.res.js에서 리사이징을 하는데, 실행 시점이 안맞아 ui.flick.js에서 처리함
        if (owner._scope.data('type') == 'sub') {
            owner._w = $(window).width();
            $('*[data-role=ui-layer-sample]').width(owner._w);
        } else {
            owner._w = owner._container.width();
        }

        owner._range = owner._w * owner._transition.range;

        owner._content.css({
            'position' : 'relative',
            //'overflow' : 'hidden',
            'width' : (owner._w * owner._length) + 'px'
        });

        if ( typeof cnt !== 'undefined') {
            owner._current = cnt;
        } else {
            owner._current = 0;
        }

        if (owner._isCss) {
            owner._content.children().each(function(a) {
                var pos = 0;

                if (a < owner._current) {
                    pos = -1;
                } else if (a > owner._current) {
                    pos = 1;

                    if (owner._current === 0 && a === owner._length - 1) {
                        pos = -1;
                    }
                }

                $(this).css({
                    'position' : 'absolute',
                    'width' : owner._w + 'px',
                    'transition' : '0ms',
                    'transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
                    '-webkit-transition' : '0ms',
                    '-webkit-transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
                    '-moz-transition' : '0ms',
                    '-moz-transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
                    '-o-transition' : '0ms',
                    '-o-transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
                    '-ms-transition' : '0ms',
                    '-ms-transform' : 'translate(' + (pos * owner._w) + 'px,0)'
                });

                if (_common._isRTL) {
                    $(this).css({
                        'right' : -(owner._w * a) + 'px',
                        'float' : 'right'
                    });
                } else {
                    $(this).css({
                        'left' : -(owner._w * a) + 'px',
                        'float' : 'left'
                    });
                }
            });
        } else {
            owner._content.children().each(function(a) {
                var pos = 0;

                if (a < owner._current) {
                    pos = -1;
                } else if (a > owner._current) {
                    pos = 1;

                    if (owner._current === 0 && a === owner._length - 1) {
                        pos = -1;
                    }
                }

                $(this).css({
                    'position' : 'absolute',
                    'top' : 0,
                    'width' : owner._w + 'px'
                });

                if (_common._isRTL) {
                    $(this).css('right', (pos * owner._w) + 'px');
                } else {
                    $(this).css('left', (pos * owner._w) + 'px');
                }
            });

            // KV, PDP Sample image
            if (owner._scope.data('type') != 'main') {
                // 제일 높이가 큰 컨텐츠의 사이즈를 구함
                owner._content.children().each(function() {
                    $(this).find('>div').css('height', '');
                });

                var maxHeight = 0;

                owner._content.children().each(function() {
                    var thisHeight = $(this).find('>div').outerHeight(false);

                    if (maxHeight < thisHeight) {
                        maxHeight = thisHeight;
                    }
                });

                owner._content.height(maxHeight);

                //owner._content.height(owner._content.children().first().find('>div').outerHeight(false));
                if (owner._content.height() === 0) {
                    owner._content.height(owner._content.children().first().find('img').outerHeight(false));
                }
            }

            /*
             if(owner._content.height()===0){
             owner._content.children().first().find('img').on('load',function(){
             owner._content.height($(this).outerHeight(false));
             });
             }
             */
        }

        owner._target = owner.reset_target(owner._current);
        owner._pos = owner.reset_pos();
        owner.resizing_scope(owner._current);

        // PDP gallery
        if (owner._scope.data('type') == 'main') {
            if ($('*[data-role=ui-flick-num]').length) {
                owner._num = $('*[data-role=ui-flick-num]');
                owner._num.find('span.current-num').text(owner._current + 1);

                /*
                 // 항목이 2개인 경우
                 if (owner._case) {
                 _common.trace('>> reset, case: ' + owner._case);
                 owner._num.find('span.all-num').text(2);
                 }
                 else {
                 _common.trace('>> reset, case: ' + owner._case);
                 owner._num.find('span.all-num').text(owner._length);
                 }
                 */

                owner._num.find('span.all-num').text(owner._length);
                //var itemLen = $('*[data-role=ui-slide-res]').filter('*[data-type=main]').data().slide._child.length;

                var itemLen = ($('*[data-role=ui-flick]').filter('*[data-type=main]').find('*[data-role=ui-flick-content]').children().filter('*[data-clone=clone]').length == 0) ? owner._content.children().length : 2;

                owner._num.find('span.all-num').text(itemLen);

                if (itemLen == 2) {
                    $('*[data-role=ui-flick]').filter('*[data-type=main]').data()._case = true;
                } else {
                    $('*[data-role=ui-flick]').filter('*[data-type=main]').data()._case = false;
                }

                owner._num.css({
                    'visibility' : 'visible'
                });
            }
        }

        owner._scope.css({
            'visibility' : 'visible'
        });

        if (owner._flag.auto && owner._length > 1) {
            owner.autoplay();
        }

        // 컨텐츠영역 접근성
        owner._content.find('> li').each(function(idx) {
            $(this).attr('tabindex', '0');

            $(this).bind({
                'focusin' : function(e) {
                    var self = $(this);
                    var idx = $(this).index();

                    if (owner._current == idx) {
                        owner.stop_autoplay();
                        owner._flag.auto = false;

                        self.attr('tabindex', '0').find('a, button').attr('tabindex', '0');
                        self.siblings().attr('tabindex', '-1').find('a, button').attr('tabindex', '-1');
                    } else {
                        owner._content.find('> li').eq(owner._current).focus();
                    }
                },
                'keydown' : function(e) {
                    var self = $(this);
                    var keyCode = e.keyCode;
                    var tabKey = (keyCode == 9) ? true : false;
                    var shiftKey = (e.shiftKey) ? true : false;

                    if (tabKey && shiftKey) {
                        e.preventDefault();

                        owner.autoplay();
                        owner._flag.auto = true;

                        $('*[data-role=ui-btn-show-smartfinder]').focus();
                    }
                }
            });
        });

        // 컨텐츠 버튼들 접근성
        owner._content.find('a, button').bind({
            'focusin' : function(e) {
                e.stopPropagation();

                owner.stop_autoplay();
                owner._flag.auto = false;
            },
            'keydown' : function(e) {
                e.stopPropagation();
            }
        });

        // 컨트롤러 접근성
        owner._scope.find('div.ctl-carousel button').each(function(idx) {
            var self = $(this);
            var lastLen = owner._scope.find('div.ctl-carousel button').length;
            var prevBtn = owner._scope.find('*[data-role=ui-flick-prev]');
            var nextBtn = owner._scope.find('*[data-role=ui-flick-next]');

            // prev
            if (self[0] === prevBtn[0]) {
                self.bind({
                    'keydown' : function(e) {
                        var keyCode = e.keyCode;
                        var tabKey = (keyCode == 9) ? true : false;
                        var shiftKey = (e.shiftKey) ? true : false;

                        if (tabKey && shiftKey) {
                            e.preventDefault();

                            owner._content.find('> li').eq(owner._current).focus();

                            if (owner._content.find('> li').eq(owner._current).find('a, button').length) {
                                owner._content.find('> li').eq(owner._current).find('a, button').last().focus();
                            }
                        }
                    },
                    'focusin' : function(e) {
                        e.stopPropagation();

                        owner.stop_autoplay();
                        owner._flag.auto = false;
                    }
                });
            } else {
                self.bind({
                    'focusin' : function(e) {
                        e.stopPropagation();

                        owner.stop_autoplay();
                        owner._flag.auto = false;
                    },
                    'focusout' : function(e) {
                        owner.autoplay();
                        owner._flag.auto = true;
                    }
                });
            }
        });
    },

    /**
     * build-navigation
     *
     * @private
     * @return        {void}
     */
    build_navigate : function() {
        var owner = this;

        var target = (owner._scope.find('*[data-role=ui-flick-navigate]').find('button').length) ? owner._scope.find('*[data-role=ui-flick-navigate] button') : owner._scope.find('*[data-role=ui-flick-navigate] a');

        if (target.length) {
            var owner = this;

            owner._navigate = target;
            owner._navigate.each(function(a) {
                $(this).data({
                    'cnt' : a,
                    'parent' : $(this).parent()
                }).css('cursor', 'pointer');

                if (a === owner._current) {
                    owner.active_navigate($(this));
                }
            });
        }
    },

    /**
     * transition
     *
     * @private
     * @return        {void}
     */
    build_event : function() {
        var owner = this;

        owner._container.off('touchstart').off('touchmove').off('touchend').on({
            'touchstart' : function(e) {
                // 모바일에서 2개이상일때만 터치이벤트 바인드
                if (owner._scope.find('*[data-role=ui-flick-content]').children().length > 1) {
                    owner.touch_start.call(owner, e);
                }
            },

            'touchmove' : function(e) {
                // 모바일에서 2개이상일때만 터치이벤트 바인드
                if (owner._scope.find('*[data-role=ui-flick-content]').children().length > 1) {
                    owner.touch_move.call(owner, e);
                }
            },

            'touchend' : function(e) {
                // 모바일에서 2개이상일때만 터치이벤트 바인드
                if (owner._scope.find('*[data-role=ui-flick-content]').children().length > 1) {
                    owner.touch_end.call(owner, e);
                }
            }
        });

        owner._scope.find('*[data-role=ui-flick-prev]').on('click', function(e) {
            // PDP Gallary Prev event
            if (!owner._flag.slide) {
                if (owner._flag.auto) {
                    owner.stop_autoplay();
                }

                owner._flag.slide = true;
                owner.transition(1);

                // PDP: analytics tagging add
                if (owner._scope.data('type') == 'main') {
                    //sendClickCode('pdp_gallery', 'gallery:left arrow');
                }
            }
        });

        owner._scope.find('*[data-role=ui-flick-next]').on('click', function(e) {
            if (!owner._flag.slide) {
                // PDP Gallary Prev event
                if (owner._flag.auto) {
                    owner.stop_autoplay();
                }

                owner._flag.slide = true;
                owner.transition(-1);

                // PDP: analytics tagging add
                if (owner._scope.data('type') == 'main') {
                    //sendClickCode('pdp_gallery', 'gallery:right arrow');
                }
            }
        });

        if (owner._navigate !== null) {
            owner._navigate.on('click', function() {
                if (!owner._flag.slide) {
                    if (owner._flag.auto) {
                        owner.stop_autoplay();
                    }

                    owner._flag.slide = true;

                    var dir = 0;
                    var current = (owner._case) ? owner._current % 2 : owner._current;

                    if (current > $(this).data('cnt')) {
                        dir = 1;
                    } else if (current < $(this).data('cnt')) {
                        dir = -1;
                    }

                    owner.transition(dir, $(this).data('cnt'));

                    if (owner._current_navigate) {
                        owner.deActive_navigate(owner._current_navigate);
                    }

                    owner.active_navigate($(this));
                }
            });
        }
    },

    /**
     * touch-start
     *
     * @private
     * @param        {Object} e - event객체
     * @return        {void}
     */
    touch_start : function(e) {
        var owner = this;

        if (e.type == 'touchstart' && e.originalEvent.touches.length <= 1) {
            owner._start.x = e.pageX || e.originalEvent.touches[0].pageX;
            owner._start.y = e.pageY || e.originalEvent.touches[0].pageY;
            owner._flag.scroll = false;

            if (owner._flag.auto) {
                owner.stop_autoplay();
            }
        }
    },

    /**
     * touch-move
     *
     * @private
     * @param        {Object} e - event객체
     * @return        {void}
     */
    touch_move : function(e) {
        if (e.type == 'touchmove' && e.originalEvent.touches.length <= 1) {
            var owner = this;

            owner._amount.x = (e.pageX || e.originalEvent.touches[0].pageX) - owner._start.x;
            owner._amount.y = (e.pageY || e.originalEvent.touches[0].pageY) - owner._start.y;

            var x = Math.abs(owner._amount.x);
            var y = Math.abs(owner._amount.y);

            if ((x < y && !owner._flag.drag) || owner._flag.scroll) {
                owner._flag.drag = false;
                owner._flag.scroll = true;
            } else {
                if (navigator.userAgent.indexOf("android 4.1") > -1) {
                    e.stopPropagation();
                } else {
                    e.preventDefault();
                }

                owner._flag.drag = true;
                owner._flag.scroll = false;

                if (owner._isCss) {
                    for (var i = 0; i < owner._target.length; i++) {
                        var pos = owner._pos[i] + owner._amount.x;

                        owner._content.children().eq(owner._target[i]).css({
                            'trasition' : '0ms',
                            'transform' : 'translate(' + pos + 'px,0) translateZ(0)',
                            '-webkit-trasition' : '0ms',
                            '-webkit-transform' : 'translate(' + pos + 'px,0) translateZ(0)',
                            '-moz-trasition' : '0ms',
                            '-moz-transform' : 'translate(' + pos + 'px,0) translateZ(0)',
                            '-o-trasition' : '0ms',
                            '-o-transform' : 'translate(' + pos + 'px,0) translateZ(0)',
                            '-ms-trasition' : '0ms',
                            '-ms-transform' : 'translate(' + pos + 'px,0)'
                        });
                    }
                } else {
                    for (var i = 0; i < owner._target.length; i++) {
                        var pos = owner._pos[i];

                        if (_common._isRTL) {
                            pos -= owner._amount.x;
                            owner._content.children().eq(owner._target[i]).css({
                                'right' : pos + 'px'
                            });
                        } else {
                            pos += owner._amount.x;
                            owner._content.children().eq(owner._target[i]).css({
                                'left' : pos + 'px'
                            });
                        }

                    }
                }
            }
        }
    },

    /**
     * touch-end
     *
     * @private
     * @param        {Object} e - event객체
     * @return        {void}
     */
    touch_end : function(e) {
        var owner = this;

        if (e.type == 'touchend' && e.originalEvent.touches.length <= 1) {
            if (owner._flag.scroll) {
                owner._flag.drag = false;
                return;
            }

            var d = owner.get_direction();

            if (_common._isRTL) {
                d = d * -1;
            }

            if (owner._flag.drag) {
                owner.transition(d);
            } else {
                if (owner._flag.auto) {
                    owner.autoplay();
                }
            }
            owner._flag.drag = false;

            //e.stopPropagation();
        }
    },

    /**
     * transition
     *
     * @private
     * @param        {Number} dir - 이동 방향 [-1 | 1]
     * @param        {Number} cnt - 이동할 화면 번호
     * @param        {Boolean} f  - class 내부적으로 호출됬는지 여부
     *
     * @return        {void}
     */
    transition : function(dir, cnt, f) {
        var owner = this;

        if (owner._current === cnt) {
            owner._flag.slide = false;
            if (owner._flag.auto) {
                owner.autoplay();
            }
            return;
        }

        if ( typeof cnt !== 'undefined') {
            owner.fix_target(dir, cnt);
        }

        owner.sliding(dir, cnt, f);

        //이미지 슬라이딩 중 비디오플레이어 stop
        var target = $(owner._content).find('>li:eq(' + (owner._current - dir) + ')>div>*[data-role=common-video-player]');
        if ($(target).length) {
            _common._ui.manager.stop_video();
        }
    },

    /**
     * sliding
     *
     * @private
     * @param        {Number} dir - 이동 방향 [-1 | 1]
     * @param        {Number} cnt - 이동할 화면 번호
     * @param        {Boolean} f  - class 내부적으로 호출됬는지 여부
     *
     * @return        {void}
     */
    sliding : function(dir, cnt, f) {
        var owner = this;
        var flag_finish = false;

        if (owner._isCss) {
            setTimeout(function() {
                for (var i = 0; i < owner._target.length; i++) {
                    var pos = owner._pos[i] + (dir * owner._w);

                    if (owner._target[i] >= 0) {
                        owner._content.children().eq(owner._target[i]).css({
                            'transition' : owner._transition.speed + 'ms',
                            'transform' : 'translate(' + pos + 'px,0) translateZ(0)',
                            '-webkit-transition' : owner._transition.speed + 'ms',
                            '-webkit-transition-timing-function-' : 'ease-out',
                            '-webkit-transform' : 'translate(' + pos + 'px,0) translateZ(0)',
                            '-moz-transition' : owner._transition.speed + 'ms',
                            '-moz-transform' : 'translate(' + pos + 'px,0) translateZ(0)',
                            '-o-transition' : owner._transition.speed + 'ms',
                            '-o-transform' : 'translate(' + pos + 'px,0) translateZ(0)',
                            '-ms-transition' : owner._transition.speed + 'ms',
                            '-ms-transform' : 'translate(' + pos + 'px,0)'
                        }).on({
                            'webkitTransitionEnd msTransitionEnd oTransitionEnd otransitionend transitionend' : function() {
                                if (!flag_finish) {
                                    flag_finish = true;
                                    owner.finish_sliding(dir, cnt, f);
                                }

                                $(this).off('webkitTransitionEnd msTransitionEnd oTransitionEnd otransitionend transitionend');
                            }
                        });
                    }
                }
            }, 0);
        } else {
            var last = (owner._target[owner._target.length - 1] < 0) ? owner._target.length - 2 : owner._target.length - 1;

            for (var i = 0; i < owner._target.length; i++) {
                var pos = owner._pos[i] + (dir * owner._w);

                if (owner._target[i] >= 0) {

                    if (_common._isRTL) {
                        owner._content.children().eq(owner._target[i]).stop().animate({
                            'right' : pos + 'px'
                        }, owner._transition.speed, function() {
                            if ($(this).index() === owner._target[last]) {
                                owner.finish_sliding(dir, cnt, f);
                            }
                        });
                    } else {
                        owner._content.children().eq(owner._target[i]).stop().animate({
                            'left' : pos + 'px'
                        }, owner._transition.speed, function() {
                            if ($(this).index() === owner._target[last]) {
                                owner.finish_sliding(dir, cnt, f);
                            }
                        });
                    }
                }
            }
        }
    },

    /**
     * finish_sliding
     *
     * @private
     * @param        {Number} dir - 이동 방향 [-1 | 1]
     * @param        {Number} cnt - 이동할 화면 번호
     * @param        {Boolean} f  - class 내부적으로 호출됬는지 여부
     *
     * @return        {void}
     */
    finish_sliding : function(dir, cnt, f) {
        var owner = this;

        if ( typeof cnt !== 'undefined') {
            owner._current = cnt;
        } else {
            owner.reset_current(dir, f);
        }

        owner.reset_content();

        if (dir !== 0) {
            owner._pos = owner.reset_pos();
            owner._target = owner.reset_target(owner._current);
            owner.resizing_scope();
            owner._flag.slide = false;
            //$('document,body').scrollTop(0);

            if (owner._navigate !== null) {
                var idx = owner._current;

                if (idx > owner._length - 1)
                    idx = 0;
                else if (idx < 0)
                    idx = owner._length - 1;

                owner.deActive_navigate(owner._current_navigate);

                if (owner._case) {
                    idx = idx % 2;
                }

                owner.active_navigate(owner._navigate.eq(idx));
            }
        }

        if (owner._flag.auto) {
            owner.autoplay();
        }
    },

    /**
     * active_navigate
     *
     * @private
     * @description
     * navigate 활성화
     *
     * @param    {jQuery Object} item - navigate dom 객체
     *
     * @return {void}
     */
    active_navigate : function(item) {
        item.data('parent').addClass('current');
        this._current_navigate = item;
    },

    /**
     * deActive_navigate
     *
     * @private
     * @description
     * navigate 비 활성화
     *
     * @param    {jQuery Object} item - navigate dom 객체
     *
     * @return {void}
     */
    deActive_navigate : function(item) {
        item.data('parent').removeClass('current');
    },

    /**
     * autoplay
     *
     * @private
     * @return {void}
     */
    autoplay : function() {
        var owner = this;

        if (owner._scope.find('*[data-role=ui-flick-auto]').hasClass('pause')) {
            if (owner._interval !== null) {
                clearInterval(owner._interval);
                owner._interval = null;
            }

            owner._interval = setInterval(function() {
                owner.transition(-1);
            }, owner._transition.time);
        }
    },

    /**
     * stop-autoplay
     *
     * @private
     * @return {void}
     */
    stop_autoplay : function() {
        var owner = this;

        if (owner._interval !== null) {
            clearInterval(owner._interval);
            owner._interval = null;
        }
    },

    /**
     * reset_current
     *
     * @private
     * @description
     * 현재 화면 초기화
     *
     * @param    {Number} d - 이동방향(-1:오른쪽, 1:왼쪽)
     */
    reset_current : function(d) {
        var owner = this;

        switch(d) {
            case -1:
                owner._current += 1;

                if (owner._current > owner._length - 1) {
                    owner._current = 0;
                }

                break;

            case 1:
                owner._current -= 1;

                if (owner._current < 0) {
                    owner._current = owner._length - 1;
                }

                break;

            default:
                break;
        }

        if ($('*[data-role=ui-flick-num]').length) {
            owner._num.find('span.current-num').text(owner._current + 1);
        }
    },

    /**
     * get-direction
     *
     * @private
     * @description
     * 플리킹 종료 후 이동방향
     *
     * @return    {Number} _r - 이동방향(-1:오른쪽, 1:왼쪽)
     */
    get_direction : function() {
        var owner = this;
        var _r = 0;

        if (owner._amount.x > owner._range) {
            _r = 1;
        } else if (owner._amount.x < -owner._range) {
            _r = -1;
        }

        return _r;
    },

    /**
     * get-css
     *
     * @private
     * @description
     * css 트랜지션 지원 여부
     *
     * @return    {Boolean} - transition 속성이 있다면 true, 없다면 false 반환
     */
    get_css : function() {
        var f = document.createElement('flick');
        var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
        var isChrome = /(Chrome)/g.test(navigator.userAgent);
        var isIE = (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) ? true : false;

        // 크롬에서 transition 사용시, 레이어팝업이 깜박거리는 이슈 있어서 크롬은 제외함.
        if (isChrome || isIE) {
            return false;
        } else {
            for (var i in props ) {
                if (f.style[props[i]] !== undefined) {
                    return true;
                }

                return false;
            }
        }
    },

    /**
     * reset_target
     *
     * @private
     * @description
     * 플리킹할 컨텐츠 타겟 설정
     *
     * @param    {Number} c   - 현재 보여지는 컨텐츠 index
     *
     * @return    {Array}  arr - 플리킹할 컨텐츠 타겟(이전,현재,다음)
     */
    reset_target : function(c) {
        var arr = [];

        if (c === 0) {
            arr = [this._length - 1, c, c + 1];
        } else if (c === this._length - 1) {
            arr = [c - 1, c, 0];
        } else {
            arr = [c - 1, c, c + 1];
        }

        return arr;
    },

    /**
     * reset_pos
     *
     * @private
     * @description
     * 플리킹할 컨텐츠 위치 초기화
     *
     * @return    {Array}  arr - 플리킹할 컨텐츠 타겟(이전,현재,다음)
     */
    reset_pos : function() {
        /*
         var arr=null;

         if(this._isCss) arr=[-this._w, 0, this._w]; else arr=[-(100/this._length),0,100/this._length];
         */

        return [-this._w, 0, this._w];
    },

    /**
     * reset_content
     *
     * @private
     * @description
     * 방향에 따라 이동 후 컨텐츠 위치 초기화
     *
     * @return    {void}
     */
    reset_content : function() {
        var owner = this;

        owner._content.children().each(function(a) {
            var pos = 1;

            if (owner._current === 0) {
                if (a === owner._length - 1) {
                    pos = -1;
                }
            } else if (owner._current === owner._length - 1) {
                if (a !== 0) {
                    pos = -1;
                }
            } else {
                if (a < owner._current) {
                    pos = -1;
                }
            }

            if (a === owner._current) {
                pos = 0;
            }

            if (owner._isCss) {
                $(this).css({
                    'transition' : '0ms',
                    'transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
                    '-webkit-transition' : '0ms',
                    '-webkit-transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
                    '-moz-transition' : '0ms',
                    '-moz-transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
                    '-o-transition' : '0ms',
                    '-o-transform' : 'translate(' + (pos * owner._w) + 'px,0) translateZ(0)',
                    '-ms-transition' : '0ms',
                    '-ms-transform' : 'translate(' + (pos * owner._w) + 'px,0)'
                });
            } else {
                if (_common._isRTL) {
                    $(this).css('right', (pos * owner._w) + 'px');
                } else {
                    $(this).css('left', (pos * owner._w) + 'px');
                }
            }
        });
    },

    /**
     * fix-target
     *
     * @private
     * @description
     * navigate로 이동할 경우 컨텐츠 위치 조정
     *
     * @param    {Number} dir - 이동방향(-1:오른쪽, 1:왼쪽)
     * @param    {Number} cnt - 이동할 화면 번호
     *
     * @return    {void}
     */
    fix_target : function(dir, cnt) {
        var owner = this;

        switch(dir) {
            case -1:
                if ($.inArray(cnt, owner._target) !== -1) {
                    owner._target[$.inArray(cnt, owner._target)] = -1;
                }

                owner._target[2] = cnt;

                break;

            case 1:
                if ($.inArray(cnt, owner._target) !== -1) {
                    owner._target[$.inArray(cnt, owner._target)] = -1;
                }

                owner._target[0] = cnt;

                break;
        }

        if ((owner._current === 0 && cnt === owner._length - 1) || (owner._current === owner._length - 1 && cnt === 0)) {
            dir = dir * -1;

            if (owner._isCss) {
                owner._content.children().eq(cnt).css({
                    'trasition' : '0ms',
                    'transform' : 'translate(' + (dir * owner._w) + 'px,0) translateZ(0)',
                    '-webkit-trasition' : '0ms',
                    '-webkit-transform' : 'translate(' + (dir * owner._w) + 'px,0) translateZ(0)',
                    '-moz-trasition' : '0ms',
                    '-moz-transform' : 'translate(' + (dir * owner._w) + 'px,0) translateZ(0)',
                    '-o-trasition' : '0ms',
                    '-o-transform' : 'translate(' + (dir * owner._w) + 'px,0) translateZ(0)',
                    '-ms-trasition' : '0ms',
                    '-ms-transform' : 'translate(' + (dir * owner._w) + 'px,0)'
                });
            } else {
                if (_common._isRTL) {
                    owner._content.children().eq(cnt).css('right', (dir * owner._w) + 'px');
                } else {
                    owner._content.children().eq(cnt).css('left', (dir * owner._w) + 'px');
                }
            }
        }
    },

    /**
     * resizing
     *
     * @private
     * @description
     * 현재 화면에 맞게 scope 높이 조절
     *
     * @return    {void}
     */
    resizing_scope : function() {
        var owner = this;

        // sub 타입인 경우 (sample image)
        // ui.slide.res.js에서 리사이징을 하는데, 실행 시점이 안맞아 ui.flick.js에서 처리함
        if (owner._scope.data('type') == 'sub') {
            var h = owner._content.find('img').first().height();
            owner._scope.height(h);
            owner._content.height(h);
        } else {
            // KV, PDP Sample image
            if (owner._scope.data('type') != 'main') {
                owner._scope.height(owner._content.children().eq(owner._current).height());
            }
        }

        owner.control();
    },

    resizing : function() {
        this.build_content(this._current);
    }

});


/*!
 * @class    {Class} GlobalSearchUI
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
                        url    += 'callback=?';
                        url    += '&dispLen=' + owner._options.disp_len;
                        url    += '&q=' + encodeURIComponent(ipt_str);

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

/*!
 * @class    {Class} JumpBasicUI
 */
var JumpBasicUI = Class.extend({
    /**
     * initialize
     *
     * @constructs
     * @extends    {Class}
     * @requires    jquery.js
     * @classdesc
     * 점프 메뉴 생성<br/>
     * (data-role 속성으로 자동 생성)
     *
     * @param        {DOM} scope - 컨테이너
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
     * @return        {void}
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


﻿/*!
 * @class    {Class} JumpUI
 */
var JumpUI = Class.extend({
    /**
     * initialize
     *
     * @constructs
     * @extends    {Class}
     * @requires    jquery.js
     * @classdesc
     * 점프 메뉴 생성<br/>
     * (data-role 속성으로 자동 생성)
     *
     * @param        {DOM} scope - 컨테이너
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
     * @return        {void}
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
     * @return        {void}
     */
    build_container : function() {
        this._container = this._scope.find('*[data-role=ui-jump-container]');
    },

    /**
     * build-content
     *
     * @private
     * @return        {void}
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
     * @return        {void}
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
                    $('*[data-role=ui-tab-jump-btn] .title').text($self.find('>span').text())
                    $('*[data-role=ui-tab-jump-btn]').parent().removeClass('expand');
                    var guide = $('*[data-role=ui-tab-jump-btn] .blind').text().replace("close", "open");
                    $('*[data-role=ui-tab-jump-btn] .blind').text(guide);
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
                        var guide = $(this).find(".blind").text().replace("close", "open");
                        $(this).find(".blind").text(guide);
                    } else {
                        $(this).parent().addClass('expand');
                        $(this).find(".title").text($('a[data-role=ui-tab-jump-menu].on>span').text());
                        var guide = $(this).find(".blind").text().replace("open", "close");
                        $(this).find(".blind").text(guide);
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
     * @return        {void}
     */
    active_item : function(item) {
        var owner = this;
        var w = $(window).width();

        if (_common.is_mode() == 'MOBILE') {
            //owner._container.removeClass('open');
        }

        var cnt = item.data('cnt');
        var txt = item.text();

        owner._scope.find('*[data-role=ui-tab-jump-btn] .title').text(txt);
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
     * @return        {void}
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
     * @return        {void}
     */
    fix_position : function(t) {
        var owner = this;
        var w = $(window).width();
        var _sf = $('*[data-role=ui-smartfinder]');

        if (owner._limit === 0 || w !== owner._temp_w || owner._smartfinder !== _sf.is(':visible') || _sf.is(':visible')) {
            try
            {
                owner._limit = Math.round(owner._target.first().offset().top - owner._scope.outerHeight(false)) - 20;
                //alert(owner._limit);
                owner._temp_w = w;
                owner._smartfinder = _sf.is(':visible');
            }
            catch(e){}
        }

        if (t >= owner._limit) {
            owner._target.first().css({
                'margin-top' : Math.round(owner._scope.outerHeight(false)) + 'px'

            });
            //console.log(owner._scope.outerHeight(false));
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
                    try
                    {
                        var nowOmnitureTitle = owner._content.eq(cnt).data('engTitle').toLowerCase();
                    }
                    catch(e){}


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
     * @return        {void}
     */
    transition : function(item) {
        var owner = this;
        var pos = item.data('target').offset().top - owner._scope.outerHeight(false) - 20;

        //if(!owner._scope.hasClass('active'))    pos = pos-50;

//        console.log(pos);

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
     * @return        {Number} cnt - 메뉴 인덱스
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


﻿/*!
 * @class    {Class} LayerUI
 */
var LayerUI = Class.extend({
    /**
     * initialize
     *
     * @constructs
     * @extends    {Class}
     * @requires    jquery.js
     * @classdesc
     * 레이어 팝업 생성<br/>
     * (data-role 속성으로 자동 생성)
     *
     * @param        {DOM} scope - 컨테이너
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
     * @return        {void}
     */
    reinit : function() {
        this.build_content();
        this.build_event();
    },

    /**
     * build-content
     *
     * @private
     * @return        {void}
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
     * @return        {void}
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
     * @param        {jQuery Object} item - 버튼
     *
     * @return        {void}
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
     * @return        {Object}
     *
     * <pre class="prettyprint">
     * {
     *        'w':{Number},    // 가로 넓이
     *        'h':{Number}    // 세로 넓이
     *        'ax':{Number}    // 상대위치 가로축 좌표
     *        'ay':{Number}    // 상대위치 세로축 좌표
     *        'rx':{Number}    // 절대위치 가로축 좌표
     *        'xy':{Number}    // 절대위치 세로축 좌표
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
     * @param        {jQuery Object} item - 버튼
     *
     * @return        {void}
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
     * @return        {void}
     */
    deActive : function() {
        this._scope.hide();
    }
});

﻿/*!
 * @class    {Class} LayerCommonUI
 */
var LayerCommonUI = CommonUI.extend({
    /**
     * initialize
     *
     * @constructs
     * @extends        CommonUI
     * @requires        ui.common.js
     * @requires        util.validation.js
     * @requires        util.string.js
     * @classdesc
     * common 레이어팝업 생성<br/>
     * (data-role 속성에 따라 자동 생성)
     *
     * 1. email-us(contact us)
     *         - call
     *         <button type="button" class="btn-small" data-role="ui-btn-email">Email Us</button>
     *
     *         - layer content
     *         <div class="ui-layer-email" data-role="ui-layer-email" style="display:none;">
     *             ...
     *             <a href="#" class="btn-close" data-role="ui-close-email"><span class="blind">Close Window</span></a>
     *         </div>
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
     * @return        {void}
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
     * @return        {void}
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
     * @return        {void}
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
     * @return        {void}
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
     *    build-event
     *
     * @private
     * @return        {void}
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
     *    set_max_width
     *
     * @private
     * @return        {void}
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


/*!
 * @class    {Class} LayerVideoUI
 */
var LayerVideoUI = CommonUI.extend({
    init: function (a) {
        this._scope = null;
        this._cover = null;
        this._container = null;
        this._target = $(a);
        this._parent = null;
        this._contents = null;
        this.reinit()
    },
    reinit: function () {
        this.build_scope();
        this.build_cover();
        this.build_container();
        this.build_content();
        this.build_events()
    },
    build_scope: function () {
        this._scope = $(document.createElement("div")).attr({
            "class": "ui-layer-scope",
            "data-role": "ui-layer-scope"
        }).appendTo($(document.body))
    },
    build_cover: function () {
        this._cover = $(document.createElement("div")).attr({
            "class": "ui-layer-cover",
            "data-role": "ui-layer-cover"
        }).appendTo(this._scope)
    },
    build_container: function () {
        var d = $(this._target).attr("data-video-type");
        var b = [{
            name: "youtube",
            type: "movie"
        }, {
            name: "brightcove",
            type: "movie"
        }, {
            name: "brightcove-multi",
            type: "multi-movie"
        }];
        var e = null;
        for (var c = 0, f = b.length; c < f; c++) {
            if (String(b[c].name) == String(d)) {
                e = b[c].type
            }
        }
        this._container = $(document.createElement("div")).attr({
            "class": "ui-layer-container " + String(e),
            "data-role": "ui-layer-container"
        }).appendTo(this._scope)
    },
    build_content: function () {
        var d = this;
        var g = $(d._target).attr("data-video-id");
        var m = $(d._target).attr("data-video-type");
        var h = null,
            o = "",
            f = "";
        var b = $(d._target).attr("data-view");
        var c = $(d._target).find("*[data-video-code]");
        var j = ValidationUtil.get_msie_version();
        var p = $(d._target).attr("data-location");
        this._parent = $("div[data-role=vm-player-layer]");
        var n = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
        var l = _common._bc_idkey.playerId;
        var e = _common._bc_idkey.playerKey;
        if (typeof p != "undefined" && p == "networks") {
            l = _common._bc_idkey.siteList.global[p].playerId;
            e = _common._bc_idkey.siteList.global[p].playerKey
        }
        if (b == "1" || b == "4" || b == undefined || b == "") {
            b = g
        }
        var a = $(document.createElement("a")).attr({
            href: "javascript:void(0)",
            "class": "btn-close2"
        }).bind({
            click: function () {
                $(h).appendTo($(d._parent));
                $(d._scope).hide();
                $(d._scope).remove();
                $("html, body").css("overflow", "initial");
                $(window).unbind("touchmove")
            }
        }).append('<span class="blind">Close Window</span>');
        o += '<object id="myExperience' + g + '" class="BrightcoveExperience">\n';
        o += '    <param name="bgcolor" value="#FFFFFF" />\n';
        o += '    <param name="width" value="100%" />\n';
        o += '    <param name="height" value="100%" />\n';
        o += '    <param name="playerID" value="' + l + '" />\n';
        o += '    <param name="playerKey" value="' + e + '" />\n';
        o += '    <param name="isVid" value="true" />\n';
        o += '    <param name="isUI" value="true" />\n';
        o += '    <param name="dynamicStreaming" value="true" />\n';
        if (!n) {
            o += '    <param name="htmlFallback" value="true" />\n'
        }
        o += '    <param name="wmode" value="transparent" />\n';
        o += '    <param name="@videoPlayer" value="' + g + '" />\n';
        o += '    <param name="includeAPI" value="true" />\n';
        o += '    <param name="autoStart" value="true" />\n';
        o += '    <param name="templateLoadHandler" value="_common._ui.manager.load_template" />\n';
        o += "</object>\n";
        switch (String(m).toUpperCase()) {
            case "YOUTUBE":
                if ($(d._parent).find("*[data-view=" + b + "]").length > 0) {
                    h = $(d._parent).find("*[data-view=" + b + "]")
                } else {
                    h = $(document.createElement("div")).css({
                        border: "none",
                        background: "none"
                    }).attr({
                        id: "ytp" + b.replace("-", "").replace("_", ""),
                        "class": "youtube-player",
                        "data-role": "common-video-player",
                        "data-view": b,
                        "data-video-id": g
                    })
                }
                break;
            case "BRIGHTCOVE":
                if (ValidationUtil.is_null(j) || j >= 9) {
                    if ($(d._parent).find("*[data-view=" + b + "]").length > 0) {
                        h = $(d._parent).find("*[data-view=" + b + "]");
                        $(h).find(">div").empty().append(o)
                    } else {
                        h = $(document.createElement("div")).attr({
                            id: "vm-player-" + b,
                            "class": "video-player",
                            "data-role": "common-video-player",
                            "data-view": b
                        }).append($(document.createElement("div")).attr("class", "vm-boxType").append(o).append(a))
                    }
                }
                break;
            default:
                break
        }
        var i = "#000";
        if (_common.is_mode() === "MOBILE") {
            i = "#000"
        }
        var k = $(document.createElement("div")).attr({
            "class": "ui-layer-content",
            "data-role": "ui-layer-content",
            tabindex: "0"
        }).css({
            background: i
        }).data("manager", d._target).appendTo($(d._container)).focus();
        $(h).appendTo(k);
        if (String(m) == "youtube") {
            $(k).append(a)
        }
    },
    build_events: function () {
        var a = this;
        if ($("*[data-role=bright-list]").length > 0) {
            $("*[data-role=bright-list]").find(">li").each(function (b) {
                var c = $("*[data-role=ui-layer-scope]").find("*[data-role=common-video-player]");
                $(this).bind({
                    click: function () {
                        $(this).parent().find(">li").removeAttr("class");
                        $(this).attr("class", "active");
                        try {
                            $(c).data("manager").loadVideoByID($(this).attr("data-video-code"))
                        } catch (d) {
                            _common.trace(d)
                        }
                    }
                })
            })
        }
        _common._ui.manager.init_video()
    },
    resize: function () {
        var b = this,
            d = $("body").outerHeight(),
            a = 0,
            c = 0;
        mobileHeight = $(window).height(), mobileWidth = $(window).width();
        $("html, body").css("overflow", "hidden");
        b._container.find(">div").css({
            display: "block",
            "vertical-align": "top"
        });
        b._container.css({
            position: "relative",
            width: "100%",
            height: "auto",
            "margin-top": "20%",
            "margin-left": 0
        });
        if (mobileHeight < mobileWidth) {
            b._container.css({
                position: "relative",
                width: "80%",
                height: "auto",
                "margin-left": 0
            })
        }
        b._scope.css({
            position: "absolute",
            left: "0",
            top: "0",
            bottom: "auto",
            right: "auto",
            overflow: "hidden"
        });
        b._scope.find("*[data-role=ui-layer-cover]").css({
            position: "absolute",
            left: "0",
            top: "0",
            bottom: "auto",
            right: "auto",
            width: "100%"
        });
        b._container.find("*[data-role=ui-layer-content]").css({
            left: 0
        });
        if ($(window).height() >= b._container.outerHeight()) {
            c = $(window).scrollTop() + (($(window).height() - b._container.outerHeight()) / 2)
        } else {
            c = $(window).scrollTop();
            if (d <= c + b._container.outerHeight()) {
                c = c - (c + b._container.outerHeight() - d);
                c -= (parseInt(b._container.css("padding-top")) + parseInt(b._container.css("padding-bottom")) + parseInt(b._container.find("*[data-role=ui-layer-content]").find(">div").css("border-top")) + parseInt(b._container.find("*[data-role=ui-layer-content]").find(">div").css("border-bottom")))
            }
        }
        a = ($(window).width() - b._container.outerWidth()) / 2;
        b._scope.css("height", d);
        b._scope.find("*[data-role=ui-layer-cover]").css("height", d);
        b._container.css({
            top: c,
            left: a
        });
        b._scope.find(">div>div").focus()
    }
});


/*!
 * @class    {Class} PopupUI
 */
var PopupUI = {
    newWindow : function(string_url, string_name, int_width, int_height, bool_scrollbars) {
        var centerLeft = parseInt((window.screen.availWidth - int_width) / 2);
        var centerTop = parseInt((window.screen.availHeight - int_height) / 2);
        var misc_features = ', status=no, location=no, scrollbars=' + (bool_scrollbars == true ? 'yes' : 'no') + ', resizable=no';
        var windowFeatures = 'width=' + int_width + ',height=' + int_height + ',left=' + centerLeft + ',top=' + centerTop + misc_features;
        var win = window.open(string_url, string_name, windowFeatures);
        win.focus();
        return win;
    }
};

/*!
 * @class    {Class} PersonalHistoryUI
 */
var PersonalHistoryUI = Class.extend({
    /**
     * initialize
     *
     * @constructs
     * @extends    {Class}
     * @requires    jquery.js
     * @classdesc
     * Personal History 생성<br/>
     * (data-role 속성으로 자동 생성)
     *
     * @param        {DOM} scope - 컨테이너
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
     * @return        {void}
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
     * @return        {void}
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
     * @param        {void}
     * @return        {void}
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
     * @param        {string} 쿠키타입
     * @return        {json} 쿠키데이터
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
     * @param        {json} 쿠키에 저장될 데이터
     * @return        {void}
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
     * @param        {void}
     * @return        {void}
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
                        temp += '    <p class="' + pinStyle + '">';
                        temp += '        <span class="title">';
                        temp += '        <button type="button" class="btn-ico ico_pin" data-role="ui-btn-ph-pin" data-type="' + type + '" data-id="' + val.i + '"><span class="blind">pin icon</span></button><a href="javascript:void(0)" data-role="ui-btn-productlink" data-url="' + val.u + '">' + val.c + '</a>';
                        temp += '        </span>';
                        temp += '        <span class="btn_area">';
                        temp += '        <button type="button" class="btn_delect" data-role="ui-btn-ph-del" data-type="' + type + '" data-id="' + val.i + '"><span class="blind">delect</span></button>';
                        temp += '        </span>';
                        temp += '    </p>';
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
                        temp += '    <p class="' + pinStyle + '">';
                        temp += '        <span class="title">';
                        temp += '        <button type="button" class="btn-ico ico_pin" data-role="ui-btn-ph-pin" data-type="' + type + '" data-id="' + val.i + '"><span class="blind">pin icon</span></button>' + val.c;
                        temp += '        </span>';
                        temp += '        <span class="btn_area">';
                        temp += '        <button type="button" class="btn-ico ' + linkType + '" ' + linkRole + ' ' + linkOptions + '><span class="blind">' + linkText + '</span></button><button type="button" class="btn_delect" data-role="ui-btn-ph-del" data-type="' + type + '" data-id="' + val.i + '"><span class="blind">delect</span></button>';
                        temp += '        </span>';
                        temp += '    </p>';
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
                var    pinTimeArray = new Array();

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
     * @param        {string} 쿠키 종류, {int} 데이터 id
     * @return        {void}
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
     * @param        {string} 쿠키 종류, {int} 데이터 id, {string} key, {string} value
     * @return        {void}
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
     * @param        {string} 쿠키 종류, {array} 데이터
     * @return        {void}
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
     * @param        {void}
     * @return        {void}
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

/*!
 * @class    {Class} DdataTable
 */
var DataTable = Class.extend({
    /**
     * initialize
     *
     * @constructs
     * @extends    {Class}
     * @requires    jquery.js
     * @classdesc
     *
     *
     */
    init : function(scope) {
        this._scope = scope;
        this._fixContainer;
        this.reinit();
    },

    /**
     * re-initialize
     *
     * @private
     * @return        {void}
     */
    reinit : function() {
        this.createFixContainer();
    },


    /**
     * 더미컨테이너 추가
     * @return        {void}
     */
    createFixContainer : function () {

       var owner = this;
       var tableCon = owner._scope;
       var append = "<div class='fix-table' data-role='fix-container'></div>";
       owner._fixContainer = $(append);
       owner._fixContainer.css({position:"absolute", top:0, left:0});
       tableCon.parent().css({position:"relative"}).append(owner._fixContainer);

       var thead = tableCon.find("thead");
       var tbody = tableCon.find("tbody");
       var appendStr = "<table><thead>";

       thead.find("tr").each(function ( i )
       {
           appendStr += "<tr>";
           appendStr += "<th>"+$(this).find("th").eq(0).html()+"</th>";
           appendStr += "</tr>";
       });

       appendStr += "</tr></thead><tbody>";

       tbody.find("tr").each(function ( i )
       {
           appendStr += "<tr>";
           appendStr += "<td>"+$(this).find("td").eq(0).html()+"</td>";
           appendStr += "</tr>";
       });

       appendStr += "</tbody></table>";
       owner._fixContainer.append(appendStr);

       $(window).resize(function ( e )
       {
           var paddingLeft = parseInt(tableCon.find("th").eq(0).css("padding-left"));
           var paddingRight = parseInt(tableCon.find("th").eq(0).css("padding-right"));
           owner._fixContainer.css({width:tableCon.find("th").eq(0).width()+paddingLeft+paddingRight+2});
       }).resize();

    }



});

var SelectionToo = Class.extend({
    /**
     * SelectionToo
     *
     * @constructs
     * @extends    {Class}
     * @requires    jquery.js
     * @classdesc
     *
     *
     */
    init : function(scope) {
        this._scope = scope;
        this._dataUrl = scope.attr("data-url");
        this._tmpl = scope.attr("data-tmpl");
        this._jsonData;
        this.reinit();
    },


    reinit : function() {
        this.loadData();
        var owner = this;

        $(window).bind("resize", function ( e )
        {
            if(_common.is_mode() != 'MOBILE')
            {
                $("*[class^=selection_step]").css({display:""});
            }
        });

    },


    loadData : function ()
    {
        var owner = this;
        $.getJSON(owner._dataUrl, function ( data )
        {
            owner._jsonData = data;
            owner.removeList(1);
            owner.initList();
        });
    },


    initList : function ()
    {
        var owner = this;
        var isFirst = true;
        var list = owner._jsonData.selectionList;
        var ar = new Array();
        $(list).each(function ( i )
        {
            ar.push({"contsID":list[i].contsID, "contsTitle":list[i].contsTitle});
        });

        var tmpl = $("#"+owner._tmpl+"1").tmpl({selectionList : ar});
        tmpl.appendTo(owner._scope.find(".selection_step1"));

        owner._scope.find(".selection_step1").find("li").each(function ()
        {
           $(this).bind("click", function ( e )
           {
               owner._scope.find(".selection_step1 li").removeClass("on");
               $(this).addClass("on");
               var idx = $(this).index();
               owner.addList(list[idx].contsID, list[idx].member, 1);
           });
        });

        if(_common.is_mode() == 'MOBILE')
        {
            owner._scope.find(".selection_step1").parent().parent().find(".title").trigger("active");
        }

        $(window).resize(function ()
        {
            if(_common.is_mode() != 'MOBILE')
            {
                owner._scope.find(".selection_step").find(".title").attr("data-role", "");
            }
            else
            {
                owner._scope.find(".selection_step").find(".title").attr("data-role", "ui-accordion-btn");
            }
        });
    },


    addList : function ( id, member, remove )
    {
        var owner = this;
        var step = id.length/2;
        var ar = new Array();

        owner.removeList( remove );

        if(member.length == 0) return;

        $(member).each(function ( i )
        {
            ar.push({"contsID":member[i].contsID, "contsTitle":member[i].contsTitle});
        });

        var tmpl = $("#"+owner._tmpl+(step+1)).tmpl({selectionList : ar});
        tmpl.appendTo(owner._scope.find(".selection_step"+(step+1)));
        owner._scope.find(".selection_step"+(step+1)).addClass("on");
        owner._scope.find(".selection_step"+(step+1)).parent().parent().find(".title").removeClass("dimmed");

        if(_common.is_mode() == 'MOBILE')
        {

            owner._scope.find(".selection_step"+(step+1)).parent().parent().find(".title").trigger("active");
        }




        owner._scope.find(".selection_step"+(step+1)+" li").each(function ( i )
        {
           $(this).bind("click", function ( e )
           {
               owner._scope.find(".selection_step"+(step+1)+" li").removeClass("on");
               $(this).addClass("on");
               var idx = $(this).index();
               if(typeof member[idx].contsLink == "undefined")
               {
                   var idx = $(this).index();
                   owner.addList(member[idx].contsID, member[idx].member, member[idx].contsID.length/2);
               }
               else
               {
                   if($(this).find("a").is(".link"))
                   {
                       if(member[idx].contsLink != "")
                       {
                           $(this).find("a").attr("onClick", member[idx].contsCode).attr("href", member[idx].contsLink);
                       }
                       else
                       {
                           $(this).find("a").attr("onClick", member[idx].contsCode);
                       }
                   }
                   else
                   {
                       owner._scope.find(".selection_step"+(step+1)+" li a").removeClass("link").attr("onClick", "").attr("href", "javascript:void(0);");
                       $(this).find("a").addClass("link");
                   }
               }

           });
        });
    },

    removeList : function ( step )
    {
        var owner = this;

        //console.log(step);

        for(var i = 0; i < 4; i++)
        {
            if(i > step-1)
            {
                owner._scope.find(".selection_step"+(i+1)).empty();
                owner._scope.find(".selection_step"+(i+1)).removeClass("on");
                owner._scope.find(".selection_step"+(i+1)).parent().parent().find(".title").addClass("dimmed");
                if(_common.is_mode() == 'MOBILE')
                {
                    if(owner._scope.find(".selection_step"+(i+1)).parent().parent().find(".title").is(".expanded"))
                    {
                        owner._scope.find(".selection_step"+(i+1)).parent().parent().find(".title").removeClass("expanded");
                        owner._scope.find(".selection_step"+(i+1)).parent().parent().find(".title").trigger("deActive");
                    }
                }
            }
        }
    }


});





