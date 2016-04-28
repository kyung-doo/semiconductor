/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){
    init_jump_basic();
    init_flick();
    init_mode();
    init_filter_margin();
    init_event();
    init_datefilter();
    init_location_filter();
    init_toggle_tab();
    gallery_image.init();
};

/********************************************************************************************************
 * METHOD:FLICK, SLIDE.BLOCK
 ********************************************************************************************************/
function init_flick(){
    $('*[data-role=ui-flick]').each(function(){
        $(this).data('flick',new FlickUI($(this),{'auto':true}));

        (function(flick){
            var owner=flick;
            flick.auto_btn=$('*[data-role=ui-flick-auto]');

            flick.auto_btn.bind({
                'click':function(){
                    var $this = $(this);

                    if($this.hasClass('pause')){
                        $this.attr('class', 'play');
                        $this.find('span').text(messageType01[SITE_CD].flickUI.button_play);
                        owner._flag.auto=false;
                        owner.stop_autoplay();
                    }else{
                        $this.attr('class', 'pause');
                        $this.find('span').text(messageType01[SITE_CD].flickUI.button_pause);
                        owner._flag.auto=true;
                        owner.autoplay();
                    }
                }
            });
        }($(this).data('flick')));
    });
};

/********************************************************************************************************
 * METHOD:MODE
 ********************************************************************************************************/
function init_mode() {
    var owner = this;

    // 1. init
    owner.change_kv(_common.is_mode());

    // 2. resize
    $(window).bind({
        'resize' : function() {
            var mode = _common.is_mode();
            owner.change_kv(mode);
        }
    });
};

/********************************************************************************************************
 * METHOD:CHANGE_KV
 ********************************************************************************************************/
function change_kv(mode) {
    var img_url = '';

    $('div.key-visual li').each(function(){
        $("img", $(this)).    each(function(){
            var $this = $(this);

            switch(String(mode).toUpperCase()) {
                case 'MOBILE':
                    img_url = $this.attr('data-media-mobile');
                    $(this).removeClass('kv_desktop').addClass('kv_mobile');
                    break;
                case 'PC':
                case 'TABLET_B':
                case 'TABLET_A':
                    img_url = $this.attr('data-media-desktop');
                    $(this).removeClass('kv_mobile').addClass('kv_desktop');
                    break;
            };

            $this.attr('src', img_url);
        });
    });
};

/****************************************************************************************
* METHOD:TOGGLE TAB
****************************************************************************************/
function init_toggle_tab(){
    $(window).resize(function() {//리사이즈 시
        $(".toggleTab > ul > li").each(function(){
            var resizeHeight = $(this).children(".desc").height()+35;//컨텐츠 height 계산
            if($(this).children(".desc").is(":visible")){//컨텐츠 열린 상태일 때
                $(this).css("padding-bottom",resizeHeight);//컨텐츠 height 만큼 하단 여백 넣기
            }
        });
    });

    $(".toggleTab > ul > li").each(function(){
        var self = $(this);
        var thisIndex = self.index();
        var button = self.find(".overview > button");
        var jump = self.parents(".toggleTab").find(".floating-jumpmenu");
        var eqJump = jump.children(".second-jump").find("ul li:eq("+thisIndex+")").children("a");//리스트 인덱스와 동일한 점프메뉴
        var desc = self.children(".desc");
        var siblings = self.siblings();
        var others = self.parents(".toggleTab").siblings(".toggleTab").children("ul").children("li");

        function toggleHide(){
            desc.hide();//컨텐츠 숨김
            button.removeClass("hide").addClass("show").text("Expand");//버튼 클래스 및 텍스트 변경
            self.css("padding-bottom","");//하단 여백 초기화
        };

        function toggleShow(){
            desc.show();//컨텐츠 보임
            eqJump.addClass("active").parent("li").siblings().children("a").removeClass("active");//점프메뉴 클래스 변경
            jump.addClass("active").children("button").text(eqJump.text());//점프메뉴 모바일용 버튼 텍스트 변경
            siblings.css("padding-bottom","").children(".desc").hide();//형제 하단 여백 초기화, 컨텐츠 숨김
            others.css("padding-bottom","").children(".desc").hide();//멀티 형제 하단 여백 초기화, 컨텐츠 숨김
            siblings.children(".overview").find("button").removeClass("hide").addClass("show").text("Expand");//형제 버튼 클래스 및 텍스트 변경
            others.children(".overview").find("button").removeClass("hide").addClass("show").text("Expand");//멀티 형제 버튼 클래스 및 텍스트 변경
            button.removeClass("show").addClass("hide").text("Close");//버튼 클래스 및 텍스트 변경
            $("body,html").animate({scrollTop: button.offset().top}, 700);
        };

        button.click(function(){//Expand 버튼 클릭 시
            var descHeight = desc.height()+35;//컨텐츠 height 계산
            if(desc.is(":visible")){//컨텐츠 열린 상태일 때
                toggleHide();
            }
            else {
                toggleShow();
                self.css("padding-bottom",descHeight);//컨텐츠 height 만큼 하단 여백 넣기
            }
        });

        eqJump.click(function(){//점프메뉴 클릭 시
            var descHeight = desc.height()+35;
            if(desc.is(":visible")){//컨텐츠 열린 상태일 때
                toggleHide();
                $(this).removeClass("active").parents(".floating-jumpmenu").removeClass("active");
            }
            else {
                toggleShow();
                self.css("padding-bottom",descHeight);//컨텐츠 height 만큼 하단 여백 넣기
            }
        });
    });

    $(window).on("scroll resize", function (){
        $(".toggleTab").each(function(){
            if($(this).find(".desc:visible").length){//컨텐츠 열린 상태일 때
                var descHeight = $(this).find(".desc:visible").height();
                var scrollConTop = $(this).find(".desc:visible").offset().top;
                var scrollConBottom = scrollConTop+descHeight;
                if ($(window).scrollTop() > scrollConTop-55 && $(window).scrollTop() < scrollConBottom) {//스크롤영역일 때
                    $(this).find(".floating-jumpmenu").addClass("active");//점프메뉴 보임
                }
                else {//스크롤영역 아닐 때
                    $(this).find(".floating-jumpmenu").removeClass("active");//점프메뉴 숨김
                }
            }
            else {
                $(this).find(".floating-jumpmenu").removeClass("active");//점프메뉴 숨김
            }
        });

        $(".toggleTab.col4").each(function(){
            if($(window).width() < 1024 && $(window).width() > 767){//탭 사이즈일 때
                if($(this).children("ul").children("li:lt(2)").find(".desc:visible").length){//1,2번 컨텐츠 열린 상태일 때
                    $(this).find(".second-jump > ul > li:lt(2)").show().siblings("li:gt(-3)").hide();
                }
                else if($(this).children("ul").children("li:gt(-3)").find(".desc:visible").length){//3,4번 컨텐츠 열린 상태일 때
                    $(this).find(".second-jump > ul > li:gt(-3)").show().siblings("li:lt(2)").hide();
                }
            }
            else {
                $(this).find(".second-jump > ul > li").css("display","");
            }
        });
    });
}

/****************************************************************************************
* METHOD:JUMP BASIC
****************************************************************************************/
function init_jump_basic(){
    $('*[data-role=ui-jump-basic]').each(function(){
        $(this).data('jumpBasic',new JumpBasicUI($(this), {
            desktop: $('.filter-by-area.desktop-area'),
            mobile: $('.filter-by-area.mobile-area')
        }));
    });

    $('*[data-role=ui-jump-filter-filterby], *[data-role=ui-jump-filter-sortby]').on('click', function(e){
        var mode = _common.is_mode();
        var target = null;
        var target_button = null;

        if (mode == 'MOBILE') {
            target = $('.filter-by-area.mobile-area');
            target_button = target.find('.filterby');
        }
        else {
            target = $('.filter-by-area.desktop-area');
            target_button = target.find('.btn-filterby');
        }

        var pos = target.offset().top;
        $('html,body').stop().animate({'scrollTop':pos+'px'},700);

        if (target_button.hasClass('link-toggled')) {
            target_button.click();
        }

        e.preventDefault();
    });
};

/********************************************************************************************************
 * METHOD:Filter Margin
 ********************************************************************************************************/
function init_filter_margin(){
    $(".btn-filterby,.filterby,.btn-filter-cls").click(function() {
        if($(this).parents(".filter-by-area").hasClass("on")){
            $(this).parents(".filter-by-area").removeClass("on");
        }
        else {
            $(this).parents(".filter-by-area").addClass("on");
        }
    });
}

/****************************************************************************************
* METHOD:EVENT
****************************************************************************************/
function init_event(){
    $('button[data-role="ui-btn-loadmore"]').click(function(){
        var $this = $(this);
        var nextPage = parseInt($this.data('page')) + 1;

        getInsightData(nextPage);
    });

    var isAnimateStop = true;
    var tabJumpHeight = 56;

    $('.closeNavArea').on("click", function (){
        $("div.overlay").trigger("click");
    });

    $('ul[data-role=ui-btn-1depth]').find('a').click(function(){
        var idx = $('*[data-role=ui-btn-1depth]').find('a').index(this), $self = $(this), $ui_tab_1depth;

        $self.parent().addClass('active').siblings().removeClass('active');
        location.hash = $self.attr('class');

        $ui_tab_1depth = $('*[data-role=ui-tab-1depth]');
        $ui_tab_1depth.hide().eq(idx).show();

        $ui_tab_1depth.each(function (){
            var $self = $(this), $second_jomp_a = $self.find('.second-jump > ul > li > a');
            $second_jomp_a.removeClass('active');
            $second_jomp_a.eq(idx).addClass('active');
        });

        $(window).trigger('scroll');

        //sendClickCode('jumpto','b2b_tab:' + $(this).text());
    });

    $('*[data-role=ui-tab-jump]').find('a').click(function(e){
        //isAnimateStop = false;

        var self = $(this);
        var curTab = self.closest('*[data-role=ui-tab-1depth]');
        var curJump = curTab.find('*[data-role=ui-tab-jump]');
        var idx = curJump.find('a').index(this);
        var content = curTab.find('*[data-role=ui-tab-content]');
        var item = content.eq(idx);


        $('ul[data-role=ui-btn-1depth]').find('a').eq(idx).trigger('click');
        /*
        //sendClickCode('jumpto','jump to:'+$(this).find('span').text());

        curJump.find('*[data-role=ui-tab-jump-btn]').find('span').text(curJump.find('.active span').text());

        var pos = Math.ceil(item.offset().top - curJump.outerHeight(false));

        self.addClass('active').parent().siblings().find('a').removeClass('active');

        self.parents('*[data-role=ui-tab-jump]').removeClass('expand');

        $('html,body').stop(true, true).animate({'scrollTop':pos}, 700, function(){
            isAnimateStop = true;
        });*/

        if ($('.acc-help-container').length > 0)
        {
            var pos = Math.ceil($('.acc-help-container').offset().top);
            $('html,body').stop(true, true).animate({'scrollTop':pos}, 700/*, function(){
                isAnimateStop = true;
            }*/);

            $('*[data-role=ui-tab-jump-btn]').parent().removeClass('expand');
        }
    });

    $('*[data-role=ui-tab-jump-btn]').click(function(){
        var isOpen = $(this).parent().hasClass('expand');
        if(isOpen){
            $(this).parent().removeClass('expand');
        }
        else{
            $(this).parent().addClass('expand');
        }
    });

    var tid = null;

    $(window).on({
        'scroll':function(e){
            if(isAnimateStop){
                    makeJump();
            }
        },

        'resize':function(){
        }
    });

    var makeJump = function(){
        var scrollTop = $(window).scrollTop();
        var curTab = $('*[data-role=ui-tab-1depth]:visible');
        var curJump = curTab.find('*[data-role=ui-tab-jump]');
        var content = curTab.find('*[data-role=ui-tab-content]');
        var curButton = curTab.find('*[data-role=ui-tab-jump-btn]');

        if(curJump.length === 0) return;

        if(scrollTop >= Math.ceil(content.offset().top) - curJump.outerHeight(false)){
            curJump.show();
            curJump.css('position', 'fixed');
            curJump.css('left', 0);
            curJump.css('top', 0);
            curJump.css('z-index', 1000);

            /*var currentIdx = 0;

            content.each(function(i, v){
                var conTop = Math.ceil(content.eq(i).offset().top - curJump.outerHeight(false));

                if(scrollTop >= conTop){
                    currentIdx = i;
                }
            });*/

            //curJump.find('li').eq(currentIdx).find('a').addClass('active').parent().siblings().find('a').removeClass('active');
            curButton.find('span').text(curJump.find('.active span').text());
        }
        else{
            curJump.hide();
        }
    };

    // 2014-10-30 adnstyle add
    var moveUrl = function(url){
        var href = url? url : location.href.split("#")[1];
        if(!href){
            $('ul[data-role=ui-btn-1depth]').find("a").first().trigger("click");
            return false;
        }
        if( $('*[data-role=ui-tab-jump]:visible').length ){
            $('*[data-role=ui-tab-jump]:visible').find("."+href).trigger("click");
        }else{
            $('ul[data-role=ui-btn-1depth]').find("."+href).trigger("click");
        }

    };
    moveUrl();

    $(".anchor-page").on("click",function(){
        var aa = $(this).attr("href").split("#")[1];
        moveUrl(aa);
    });

    $(document).on('click', '*[data-role=ui-btn-gallery]', function(e) {
        var mySrc=$(this).closest("div").find(".larger-view-thumnail>img").attr("src");
        var src_index_start=mySrc.lastIndexOf("/")+1;
        var src_index_end=mySrc.lastIndexOf(".jpg");
        var imgPath=mySrc.substring(0,src_index_start);
        var img_b_src=imgPath+mySrc.substring(src_index_start, src_index_end)+"_b.gif";

        $(".ui-layer-gallery").find("img").attr("src",img_b_src);
        _common.open_popup_layer('gallery');
    });

    $(document).on('click', '*[data-role=ui-btn-chinaRohs]', function(e) {
        _common.open_popup_layer('chinaRohs');
    });
};

/****************************************************************************************
* METHOD:DATEFILTER
****************************************************************************************/
function init_datefilter(){
    $(".desktop-area .menu li").click(function(){
        if($(this).is(":first-child")){
            $(".date-filter").hide();
        }
        else {
            $(".date-filter").show();
        }
    });
    $("a.m-btn-date-filter").click(function(){
        $(this).next(".m-date-filter").slideToggle(300);
    });
};

/****************************************************************************************
* METHOD:LOCATION FILTER
****************************************************************************************/
function init_location_filter(){
    var filterSizeCal = $('.company-location-list').find('li:visible').find('ul.depth2Area').find('>li').length;
    $('.business-location .btn-filterby span strong').text(filterSizeCal);
};

/****************************************************************************************
 * METHOD:CHANGE PAGE
 * - checkbox 선택/해제 시 작동
****************************************************************************************/
function changePage(){

    // about-us / location
    var $locationScope = $('.business-location');
    var $checkboxs = $locationScope.find('div[data-role="ui-filter-list"]').find('input[type=checkbox]:checked');
    var checkedCnt = $checkboxs.length;

    if(checkedCnt === 0) {
        $(".company-location-list").find("li.depth1Area").show();

        init_location_filter();
    }
    else{
        $(".company-location-list").find("li.depth1Area").hide();

        $.each($checkboxs, function(){
            var locationValue = $(this).parent().data('code');

            $(".company-location-list").find('li[data-role=location' + locationValue + ']').show();
        });

        init_location_filter();
    }

};

/****************************************************************************************
 * METHOD: GET INSIGHT DATA
****************************************************************************************/
function getInsightData(page){
    var $scope = $('div[data-role="ui-filter-area"]');
    var $productArea = $scope.find('ul[data-role="ui-filter-area-product"]');
    var $applicationArea = $scope.find('ul[data-role="ui-filter-area-application"]');
    var $contentArea = $scope.find('ul[data-role="ui-filter-area-content"]');
    var $audienceArea = $scope.find('ul[data-role="ui-filter-area-audience"]');
    var $formatArea = $scope.find('ul[data-role="ui-filter-area-format"]');

    var iaList = new Array();
    var typeList = new Array();
    var targetList = new Array();
    var formatList = new Array();

    var makeChkDataArray = function(array, $area){
        if($.isArray($area)){
            $.each($area, function(idx, val){
                $.each(val.find('input[type="checkbox"]:checked'), function(j, vj){
                    array.push(vj.value);
                });
            });
        }
        else{
            $.each($area.find('input[type="checkbox"]:checked'), function(idx, val){
                array.push(val.value);
            });
        }
    };

    var callback = function(data){
        if(data.mainModel.insightList.length == 0) return false;

        var curPage = data.mainModel.insightList[0].currentPage;
        var totPage = data.mainModel.insightList[0].totalPage;
        var $btnLoadmore = $('button[data-role="ui-btn-loadmore"]');

        if(curPage < totPage){
            $btnLoadmore.show();
        }
        else{
            $btnLoadmore.hide();
        }

        $btnLoadmore.data('page', curPage);
    };

    makeChkDataArray(iaList, [$productArea, $applicationArea]);
    makeChkDataArray(typeList, $contentArea);
    makeChkDataArray(targetList, $audienceArea);
    makeChkDataArray(formatList, $formatArea);

    var param = {
        'chkIaList' : iaList,
        'chkTypeList' : typeList,
        'chkTargetList' : targetList,
        'chkFormatList' : formatList,
        'page' : page
    }

    var isClear = true;
    if(page > 1) isClear = false;

    var options = {
        clear : isClear,
        param : param
    };

    _common.makeTemplate('/semiconductor/insights/selectInsightsSearchList', 'insights');
}

/********************************************************************************************************
 * METHOD:news, event detail page - gallery
 ********************************************************************************************************/
 var gallery_image = {
    opts:{
        gallery:"[data-role='ui-gallery-images']",
        gallery_list:"[data-role='ui-gallery-thumbnail']"
    },
    init:function(){
        $(">li>a", $(gallery_image.opts.gallery_list)).on("click", gallery_image.active_gallery);
        $("button", $(gallery_image.opts.gallery)).on("click", gallery_image.active_btns);
    },
    init_thumb:function(){
        $("li", $(gallery_image.opts.gallery_list)).each(function(){$(this).removeClass("active")});
    },
    change_gllery:function(idx){
        var src = $(">a>img" , $("li", $(gallery_image.opts.gallery_list)).eq(idx)).attr("src");

        $(".clip-center img", $(gallery_image.opts.gallery)).attr("src", src);
        $("p.paging span", $(gallery_image.opts.gallery)).text(idx+1);
        $("li", $(gallery_image.opts.gallery_list)).eq(idx).addClass("active");
    },
    active_gallery:function(){
        var idx = $(this).parent().index();
        gallery_image.init_thumb();
        gallery_image.change_gllery(idx);
    },
    active_btns:function(){
        var idx = $("li.active", $(gallery_image.opts.gallery_list)).index();
        var role = $(this).data("role");
        var direction = role.split("ui-btn-");

        if (direction[1] == 'prev')
        {
            idx = idx-1;
            if (idx < 0)
            {
                idx = $("li", $(gallery_image.opts.gallery_list)).length-1;
            }

        }else{

            idx = idx+1;
            if (idx == $("li", $(gallery_image.opts.gallery_list)).length)
            {
                idx = 0;
            }
        }

        gallery_image.init_thumb();
        gallery_image.change_gllery(idx);

    }
 }
