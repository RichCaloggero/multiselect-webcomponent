function debug (text) {//return;var text = $.map ($.makeArray (arguments), function (arg) {	var type = typeof(arg);	if (type === "array" || type == "object") return JSON.stringify(arg) + "\n";	else return arg;}).join (" ");
if ($("#debug").length > 0) {if (! text) {$("#debug").html ("");} else {	$("#debug").append (document.createTextNode(text), "<br>\n");} // if
} else {console.error (text);} // if} // debug
