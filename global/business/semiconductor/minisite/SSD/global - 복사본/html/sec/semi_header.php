
</head>
<!--[if IE 7]><body class="legacy-ie ie7"><![endif]-->
<!--[if IE 8]><body class="legacy-ie ie8"><![endif]-->
<!--[if IE 9]><body class="ie9"><![endif]-->
<!--[if gte IE 10]><!--><body><!--<![endif]-->
<!-- common skip menu -->
<div class="skip-menu">
	<a href="#content">skip to content</a>
</div>
<!-- //semiconductor/common skip menu -->

<div class="body-wrap" data-role="ui-nav-wrap">
	<!-- header -->
	<div class="header-wrap">
		<!-- 
			<div class="browser-notice">
				<span>This website is best viewed using Internet Explorer 9 , Chrome , Firefox and newer browsers.</span>
				<button type="button">
			</div>
			<div class="cookie-notice">
				<span>
					This site uses cookies. By continuing to browse the site you are agreeing to our use of cookies.
					<a title="Read our privacy policy" href="#">Find out more here</a>
				</span>
				<button type="button">
			</div>
		 
		 <div class="cookie-notice" data-role="ui-ph-notice">
			<span>
				personal history personal history personal history personal history personal history
			</span>
			<button type="button">
		</div>
		-->
		<div class="space"></div>
    	<div class="header">
        	<div class="logo">
				<h1><a href="/semiconductor"><span class="blind">SAMSUNG BUSINESS</span></a></h1>
   			</div>
            <button type="button" class="btn-ico ctl-nav" data-role="ui-nav-btn"><span class="label">Open Menu</span></button>
			<div class="overlay"></div>	<!-- dimed layer -->
			<div class="nav">
				<!-- GNB -->
				<!--#include virtual="/semiconductor/global/ssi/navigation/top_nav.sec"-->
				<!-- //GNB -->
				<!-- top utility -->
				<!--#include virtual="/semiconductor/global/ssi/header/top_utility.sec"-->
				<!-- //top utility -->
			</div>
            <div class="util-menu">
                <div class="sch" data-role="ui-globalsearch">
					<button type="button" class="btn-ico ctl-frm" data-role="ui-btn-search"><span class="label">Open Search Form</span></button>
					<form onsubmit="return false;">
						<label for="p-schkwd" class="blind">Search Keyword</label>
						<input id="p-schkwd" type="text" placeholder="Search" data-role="ui-search-input" maxlength="100" autocomplete="off">
						<a href="javascript:void(0);" class="txt_del" data-role="ui-search-btn-del" ><img src="/semiconductor/common/img/ico/ico_search_close.png" alt="Text Delete"></a>
						<div class="auto-complete">
							<div class="auto-complete-wrap">
								<h3 class="blind">autocomplete search layer</h3>
								<p class="ac-message">Hmm, we couldn't find that in our records. Try again?</p>
								
								<div class="recently-viewed">
									<h4>Recent</h4>
									<ul data-role="ul-globalsearch-recent-list"></ul>
								</div>
							</div>
							<ul class="autocomplete-list" data-role="ui-globalsearch-autocomplete-list"></ul>
						</div>
						<button type="submit" class="btn-ico submit-sch"><span class="label">search</span></button>
					</form>
                </div>
                <button type="button" class="btn-ico call-personalHistory" data-role="ui-btn-personalhistory"><span class="label">personalhistory</span></button>
            </div>
		</div>
	<div class="history_notification" style="display:none">
		
		<a href="#"  data-role="ui-personalhistory-notification">CHECK OUT NOW THAT HISTORY IS CREATED!</a>
		
	</div>
    </div>
	<!-- //header -->
	<!-- personal history -->
	<!--#include virtual="/semiconductor/global/ssi/header/personal_history.sec"-->
	

	
	<!-- //personal history -->
		


