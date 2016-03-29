/********************************************************************************************************
 * METHOD:PAGE
 ********************************************************************************************************/
function initPage(){
    init_flick();
    init_more();
    init_jump_basic();
    init_jump();
    init_mode();
    init_same_height()
};

/********************************************************************************************************
 * METHOD:MODE
 ********************************************************************************************************/
function init_mode(){
    var owner=this;

    owner.change_kv(_common.is_mode());

    $(window).resize( function() {
        var mode = _common.is_mode();
        owner.change_kv(mode);
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
* METHOD:Same-Height
****************************************************************************************/
function init_same_height() {
    $(window).resize(function ( e )
    {
        var pc = $("[data-role*='pc']").length;
        var tablet_a = $("[data-role*='tablet_a']").length;
        var tablet_b = $("[data-role*='tablet_b']").length;
        var mobile = $("[data-role*='mobile']").length;



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
        /*
        $(".s_height_all").each(function( i )
        {
            var height = checkHeight( $(this) );
            $(this).find(".s_height_inner").css({height:height});

        });
        */
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
