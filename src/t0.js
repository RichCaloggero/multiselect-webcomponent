function test (dom) {
var count = dom[0].querySelectorAll(".content p").length;
var buttonCount = dom[0].querySelectorAll(".content button").length;
var html = dom[0].innerHTML;
debug ("external test.js:");
debug ("button count: ", buttonCount);
debug ("count: ", count);
debug ("html: ", html);
} // test

