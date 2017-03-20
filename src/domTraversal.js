/// DOM traversal

function nextSibling (node) {
do {
node = node.nextSibling;
} while (node && node.nodeType !== 1);
return node;
} // nextSibling

function previousSibling (node) {
do {
node = node.previousSibling;
} while (node && node.nodeType !== 1);
return node;
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

function index (node) {
var s, p = node.parentNode;
if (! p) return -1;
s = firstChild(p);
var i = 0;

while (s && s !== node) {
s = nextSibling(s);
i += 1;
} // while

return (s)? i : -1;
} // index
