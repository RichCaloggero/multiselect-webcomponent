"use strict";
/// DOM traversal

function nextSibling (node, selector = "*") {
while (node) {
node = node.nextSibling;
if (node && node.nodeType === 1 && node.matches(selector)) return node;
} // while
return null;
} // nextSibling

function previousSibling (node, selector = "*") {
while (node) {
node = node.previousSibling;
if (node && node.nodeType === 1 && node.matches(selector)) return node;
} // while
return null;
} // previousSibling

function firstChild (node) {
node = node.firstChild;
if (node.nodeType === 1) return node;
else return nextSibling(node);
} // firstChild

function lastChild (node) {
node = node.lastChild;
if (node.nodeType === 1) return node;
else return previousSibling(node);
} // firstChild

function nodeName (node) {
if (! node) return "";
if (! node.nodeName) {
throw Error ("bad node: " + JSON.stringify(node));
} // if
return node.nodeName.toLowerCase();
} // nodeName

function indexOf (node) {
var s, p = node.parentNode;
if (! p) return -1;
s = firstChild(p);
var i = 0;

while (s && s !== node) {
s = nextSibling(s);
i += 1;
} // while

return (s)? i : -1;
} // indexOf
