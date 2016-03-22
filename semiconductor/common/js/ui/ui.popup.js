/*!
 * @class	{Class} PopupUI
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