/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){

    init_scripts();
    init_flick();
    init_more();
    init_jump_basic();
    init_jump();
    init_toggle_tab();
    init_mode();
    init_same_height();
    init_dotdotdot();
    init_data_table();
    init_selection_Tool();
    init_feature_selection()
};



/********************************************************************************************************
 * METHOD: INIT_SCRIPTS
 ********************************************************************************************************/
function init_scripts(){

    //$.cachedScript('/semiconductor/minisite/ssd/common/js/lib/datatables.js');
};

/********************************************************************************************************
 * METHOD:MODE
 ********************************************************************************************************/
function init_mode(){
    var owner=this;

    owner.change_kv(_common.is_mode());
    owner.change_img(_common.is_mode());

    $(window).resize( function() {
        var mode = _common.is_mode();
        owner.change_kv(mode);
        owner.change_img(_common.is_mode());
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
                    img_url = cdnHost + $this.data('mediaMobile');
                    $(this).removeClass('kv_desktop').addClass('kv_mobile');
                    break;
                case 'PC':
                case 'TABLET_B':
                case 'TABLET_A':
                    img_url = cdnHost + $this.data('mediaDesktop');
                    $(this).removeClass('kv_mobile').addClass('kv_desktop');
                    break;
            };

            $this.attr('src', img_url);

        });
    });
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
 * METHOD:VIEW-MORE
 ********************************************************************************************************/
function init_more(){
    $('div[data-role=ui-view-mobile-btn]>button').bind({
        'click':function(){
            $('div[data-role=ui-view]').addClass('active');
        }
    });
};

/********************************************************************************************************
 * METHOD:JUMP BASIC
 ********************************************************************************************************/
function init_jump_basic(){
    $('*[data-role=ui-jump-basic]').each(function(){
        $(this).data('JumpBasic',new JumpBasicUI($(this),$('*[data-role=ui-flick]')));
    });
};

/****************************************************************************************
* METHOD:JUMP
****************************************************************************************/
function init_jump() {
    $('*[data-role=ui-jump]').each(function() {
        $(this).data('jump', new JumpUI($(this)));
    });
}


/********************************************************************************************************
 * METHOD: ShowHideJump - smart memory
 ********************************************************************************************************/
var showHideJump = {
    options:{
        scroll_top:'0',
        container:"[data-role='ui-showHide-jump']",
        tab:"[data-role='ui-showHide-tab']",
        menu:"*[data-role='ui-showHide-menu']",
        btn:"*[data-role='ui-showHide-btn']",
        mode:'',
        init_tab_top:''
    },
    init:function(){
        if($(showHideJump.options.container).length > 0){
            showHideJump.set_init_state();

            $(window).on({
                resize:function(){
                    showHideJump.set_init_state();
                },
                scroll:function(){
                    showHideJump.options.mode = _common.is_mode();

                    if ($(showHideJump.options.container).data("jump"))
                    {
                        showHideJump.float_Jump(showHideJump.options.mode);
                    }
                }
            });
        }
    },
    set_init_state:function(){
        showHideJump.options.init_tab_top = showHideJump.get_offset();
        showHideJump.options.mode = _common.is_mode();

        showHideJump.active_menu();
        showHideJump.show_jump(showHideJump.options.mode);

        if (showHideJump.options.mode != 'MOBILE')
        {
            $(showHideJump.options.menu).show();
        }else{
            $(showHideJump.options.menu).hide();
        }
    },
    get_offset:function(){
        return $(showHideJump.options.tab).offset().top;
    },
    get_scrollTop:function(){
        return $(document).scrollTop();
    },
    float_Jump:function(mode){
        showHideJump.options.scroll_top = showHideJump.get_scrollTop();

        if (showHideJump.options.scroll_top >=  showHideJump.options.init_tab_top )
        {
            $(showHideJump.options.tab).addClass("float");
        }else {
            $(showHideJump.options.tab).removeClass("float");
            $("[data-role='showHideJump-contents']").css({
                marginTop:"0"
            });
        }
    },
    active_menu:function(){
        $("[data-role='ui-showHide-link']", $(showHideJump.options.container)).each(function(){
            $(this).click(function(){
                showHideJump.options.mode = _common.is_mode();

                $("> li", $(showHideJump.options.menu)).each(function(){
                    $(this).removeClass("active");
                    $("[data-role='showHideJump-contents']").css({margin:'0'}).hide();
                });

                var $this_con = $(this).data("packageid");
                $("a[data-packageId='"+$this_con+"']", $(showHideJump.options.menu)).parent().addClass("active");
                $("[data-content='"+$this_con+"']").show();
                $(showHideJump.options.btn).text($this_con);

                if (showHideJump.options.mode == 'MOBILE')
                {
                    $(showHideJump.options.menu).hide();
                }

                if ($(showHideJump.options.tab).hasClass("float")){
                    showHideJump.scroll_content(showHideJump.options.mode);
                }
            });
        });
    },
    show_jump:function(mode){
        $(showHideJump.options.btn).click(function(){
            if (mode == 'MOBILE')
            {
                $(showHideJump.options.menu).show();
            }
        });
    },
    scroll_content:function(mode){

        var menuheight, extraMargin;

        var con_top =  $("[data-role='showHideJump-contents']:visible").offset().top;

        if (mode == 'MOBILE')
        {
            menuheight = parseInt($(showHideJump.options.btn).height());
            extraMargin = 15;
        }else {
            menuheight = parseInt($(showHideJump.options.menu).height());
            extraMargin = 30;
        }

        $("[data-role='showHideJump-contents']:visible").css({
            marginTop:((menuheight)+extraMargin) + "px"
        });

        $("html, body").stop().animate({scrollTop : con_top}, 500, 'swing');

    }
}

/****************************************************************************************
* METHOD:TOGGLE TAB
****************************************************************************************/
function init_toggle_tab(){

    var isAnimateStop = true;
    var tabJumpHeight = 56;


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
            curButton.find('span').text(curJump.find('.active span').text());
        }
        else{
            curJump.hide();
        }
    };

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
        var overview = self.find(".overview");

        function toggleHide(){
            desc.hide();//컨텐츠 숨김
            button.removeClass("hide").addClass("show").text("Expand");//버튼 클래스 및 텍스트 변경
            self.css("padding-bottom","");//하단 여백 초기화
        };

        function toggleShow(){
            overview.parent().siblings().find('.overview').removeClass('active').removeClass('default')
            overview.removeClass('default').addClass('active')
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
                overview.removeClass('active')
                overview.parent().siblings().find('.overview').removeClass('active').addClass('default')
                overview.addClass('default')
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
* METHOD:Same-Height
****************************************************************************************/
function init_same_height() {
    $(window).resize(function ( e )
    {

        $("[data-role^='s_height']").each(function( i )
        {

            var data = $(this).attr("data-role").split(" ");

            var height = checkHeight($(this));
            if($.inArray("pc", data)>0)
            {
                if(String(_common.is_mode()).toUpperCase() == "PC")
                {
                    $(this).find(".s_height_inner").css({height:height});
                }
            }
            else
            {
                if(String(_common.is_mode()).toUpperCase() == "PC")
                {
                    $(this).find(".s_height_inner").css({height:""});
                }
            }
            if($.inArray("tablet_a", data)>0)
            {
                if(String(_common.is_mode()).toUpperCase() == "TABLET_A")
                {
                    $(this).find(".s_height_inner").css({height:height});
                }
            }
            else
            {
                if(String(_common.is_mode()).toUpperCase() == "TABLET_A")
                {
                    $(this).find(".s_height_inner").css({height:""});
                }
            }

            if($.inArray("tablet_b", data)>0)
            {
                if(String(_common.is_mode()).toUpperCase() == "TABLET_B")
                {
                    $(this).find(".s_height_inner").css({height:height});

                }
            }
            else
            {
                if(String(_common.is_mode()).toUpperCase() == "TABLET_B")
                {
                    $(this).find(".s_height_inner").css({height:""});
                }
            }

            if($.inArray("mobile", data)>0)
            {
                if(String(_common.is_mode()).toUpperCase() == "MOBILE")
                {
                    $(this).find(".s_height_inner").css({height:height});

                }
            }
            else
            {
                if(String(_common.is_mode()).toUpperCase() == "MOBILE")
                {
                    $(this).find(".s_height_inner").css({height:""});
                }
            }
        });

    });
    $(window).resize();
    $(window).load(function ()
    {
        $(window).resize();
    });
    function checkHeight( obj )
    {
        var h = 0;
        obj.find(".s_height_inner").each( function ( i )
        {
            $(this).css({height:""});
            if($(this).height() > h) h = $(this).height();
        });
        return h;
    }
}


/****************************************************************************************
* METHOD:RESIZE
****************************************************************************************/
function init_dotdotdot() {
    $(window).resize( function(e) {
        $('*[data-ui-textoverflow="true"]').dotdotdot();
    });
}


/********************************************************************************************************
 * METHOD:CHANGE_IMG
 ********************************************************************************************************/
function change_img(mode) {
    var img_url = '';
    $('img.responsive').each(function() {
        var $this = $(this);



        switch(String(mode).toUpperCase()) {
            case 'MOBILE':
                img_url = $this.attr('data-media-mobile');
                break;
            case 'PC':
            case 'TABLET_B':
            case 'TABLET_A':
                img_url = $this.attr('data-media-desktop');
                break;
        };
        $this.attr('src', img_url);
    });
};


/********************************************************************************************************
 * METHOD:DATA TABLE
 ********************************************************************************************************/
function init_data_table(){


    $("*[data-role='data-table']").each(function ()
    {
          var dataTable = new DataTable($(this));
    });

};


/********************************************************************************************************
 * METHOD:loadReviewAwards
 ********************************************************************************************************/
function loadReviewAwards( path )
{
    var loadNum = 12;
    var dataList;
    var startNum = 0;
    var endNum;

    var tmpl;

    $.getJSON(path, function ( data )
    {
        dataList = data.reviewsAwardsList;
        endNum = dataList.length;
        addList(4);

        if(startNum >= endNum)  $("button[data-role='ui-btn-awards']").hide();

        $("button[data-role='ui-btn-awards']").bind("click", function ( e )
        {
            if(!$("#data-tmpl-awards").is(".loaded"))
            {
               $("#data-tmpl-awards").addClass("loaded");
            }

            addList(8);

            if(startNum >= endNum)
            {
                $(this).hide();
            }
        });


    });

    function addList( len )
    {
       var list = new Array();
        for(var i = startNum; i< startNum+len; i++)
        {
            if(i < endNum)
            {
                list.push( dataList[i] );
            }
        }
        tmpl = $("#tmpl-awards-inner").tmpl({"reviewsAwardsList":list});
        tmpl.appendTo($("#data-tmpl-awards"));
        startNum = startNum+len;
        $(window).resize();
    }

}


/********************************************************************************************************
 * METHOD:init_selection_Tool
 ********************************************************************************************************/

function init_selection_Tool()
{
    $("*[data-role='selection-tool']").each(function ()
    {
        var selectionTool = new SelectionToo( $(this) );
    });

}

function init_feature_selection(){
    $("*[data-role='feature-selection-tool']").each(function(){
        var featureSelectionTool = new featureSelection( $(this) );
    })
}

var featureSelection = Class.extend({
    init : function(scope) {
        this._scope = scope;
        this._dataUrl = scope.attr("data-url");
        this._jsonData;
        this.init_selection_feature();
    },

    init_selection_feature : function (){

        var owner = this;



        $.getJSON(owner._dataUrl, function ( data )
        {
            console.log(data.selectionList[1].member.length);

            $(data.selectionList).each(function ()
            {
                var member = $(this).find("member");
                console.log(member);
            });

        }).fail(function ( e , textStatus, error)
        {

        });


    }
});



/*
function init_selection_feature(){
    var $scope = $('div[data-role="feature-selection-tool"]');
    var $selectProduct = $scope.find('select[data-role="ui-select-feature"]');
    var $selectProductSub = $scope.find('select[data-role="ui-select-feature-sub"]');
    var $recommend = $scope.find('ul[data-role="ui-recommend-product"]');
    var recommend_data01 = ['950 PRO']
    var recommend_data02 = ['850 PRO']
    var recommend_data03 = ['850 EVO']
    var recommend_data04 = ['750 EVO']
    var recommend_data05 = ['T3']
    var recommend_data06 = ['PM863 for mixed intensive','SM863 for mixed intensive']
    var recommend_data07 = ['']

    var recommend_url01 = ['/semiconductor/minisite/ssd/product/consumer/950pro.html']
    var recommend_url02 = ['/semiconductor/minisite/ssd/product/consumer/850pro.html']
    var recommend_url03 = ['/semiconductor/minisite/ssd/product/consumer/850evo.html']
    var recommend_url04 = ['/semiconductor/minisite/ssd/product/consumer/750evo.html']

    var recommend_url05 = ['/semiconductor/minisite/ssd/product/portable/t3.html']
    var recommend_url06 = ['/semiconductor/minisite/ssd/product/enterprise/pm863.html','/semiconductor/minisite/ssd/product/enterprise/sm863.html']
    var recommend_url07 = ['']

    var recommend_sub_data01 = ['850 PRO - 1TB','850 PRO - 2TB']
    var recommend_sub_data02 = ['850 PRO - 1TB','850 PRO - 2TB','850 PRO – 4TB/1TB(mSATA)']
    var recommend_sub_data03 = ['T3 - 1TB','T3 - 2TB']
    var recommend_sub_data04 = ['PM863 - 1920 GB','PM863 - 3840 GB','SM863 - 1920 GB']

    var recommend_sub_url01 = ['/semiconductor/minisite/ssd/product/consumer/950pro.html']
    var recommend_sub_url02 = ['/semiconductor/minisite/ssd/product/consumer/850pro.html']
    var recommend_sub_url03 = ['/semiconductor/minisite/ssd/product/consumer/850evo.html']
    var recommend_sub_url04 = ['/semiconductor/minisite/ssd/product/consumer/750evo.html']

    $selectProduct.change(function(){
        var productVal = $(this).val();
        if(productVal === 'select'){
            $recommend.empty();
            $recommend.append("<li>" + 'Please Select Product' + "<li>");
            $scope.find(".step02").hide();
        }else if(productVal === 'select01'){
            $recommend.empty();
            for(var i=0; i < recommend_data01.length; i++){
                $recommend.append("<li><span class='pro_title'>" + recommend_data01[i] + "</span><a href='" + recommend_url01[i] + "'>go</a></li>");
            }
            $scope.find(".step02").hide();
        }else if(productVal === 'select02'){
            $recommend.empty();
            for(var i=0; i < recommend_data01.length; i++){
                $recommend.append("<li><span class='pro_title'>" + recommend_data02[i] + "</span><a href='" + recommend_url02[i] + "'>go</a></li>");
            }
            $scope.find(".step02").hide();
        }else if(productVal === 'select02'){
            $recommend.empty();
            for(var i=0; i < recommend_data02.length; i++){
                $recommend.append("<li><span class='pro_title'>" + recommend_data02[i] + "</span><a href='" + recommend_url02[i] + "'>go</a></li>");
            }
            $scope.find(".step02").hide();
        }
        else if(productVal === 'select03'){
            $recommend.empty();
            for(var i=0; i < recommend_data03.length; i++){
                $recommend.append("<li><span class='pro_title'>" + recommend_data03[i] + "</span><a href='" + recommend_url03[i] + "'>go</a></li>");
            }
            $scope.find(".step02").hide();
        }
        else if(productVal === 'select04'){
            $recommend.empty();
            for(var i=0; i < recommend_data04.length; i++){
                $recommend.append("<li><span class='pro_title'>" + recommend_data04[i] + "</span><a href='" + recommend_url04[i] + "'>go</a></li>");
            }
            $scope.find(".step02").hide();
        }
        else if(productVal === 'select05'){
            $recommend.empty();
            for(var i=0; i < recommend_data05.length; i++){
                $recommend.append("<li><span class='pro_title'>" + recommend_data05[i] + "</span><a href='" + recommend_url05[i] + "'>go</a></li>");
            }
            $scope.find(".step02").hide();
        }
        else if(productVal === 'select06'){
            $recommend.empty();
            for(var i=0; i < recommend_data06.length; i++){
                $recommend.append("<li><span class='pro_title'>" + recommend_data06[i] + "</span><a href='" + recommend_url06[i] + "'>go</a></li>");
            }
            $scope.find(".step02").hide();
        }
        else if(productVal === 'select07'){
            $recommend.empty();
            $scope.find(".step02").show();

        }

    });

    $selectProductSub.change(function(){
        var productVal = $(this).val();
        if(productVal === 'select07'){
            $recommend.empty();
            $recommend.append("<li>" + 'Question 문구' + "<li>");

        }else if(productVal === 'select07_01'){
            $recommend.empty();
            for(var i=0; i < recommend_sub_data01.length; i++){
                $recommend.append("<li><span class='pro_title'>" + recommend_sub_data01[i] + "</span><a href='" + recommend_sub_url01[i] + "'>go</a></li>");
            }
        }else if(productVal === 'select07_02'){
            $recommend.empty();
            for(var i=0; i < recommend_sub_data02.length; i++){
                $recommend.append("<li><span class='pro_title'>" + recommend_sub_data02[i] + "</span><a href='" + recommend_sub_url02[i] + "'>go</a></li>");
            }
        }else if(productVal === 'select07_03'){
            $recommend.empty();
            for(var i=0; i < recommend_sub_data03.length; i++){
                $recommend.append("<li><span class='pro_title'>" + recommend_sub_data03[i] + "</span><a href='" + recommend_sub_url03[i] + "'>go</a></li>");
            }
        }else if(productVal === 'select07_04'){
            $recommend.empty();
            for(var i=0; i < recommend_sub_data04.length; i++){
                $recommend.append("<li><span class='pro_title'>" + recommend_sub_data04[i] + "</span><a href='" + recommend_sub_url04[i] + "'>go</a></li>");
            }
        }
    });



}
*/

