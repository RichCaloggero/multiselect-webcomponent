"use strict";

function keyboardNavigation (container, options) {
var focusedNode = null;
var searchTimer = null;
var searchText = "";
var searchTimeout = 400; // milliseconds
var keymap, actions;

var defaultOptions = {
type: "list", // list, tree, or menu
embedded: false, // if embedded in another widget, will not maintain tabindex="0" on container or child element
applyAria: true,
activeNodeSelector: ":not([hidden])",
wrap: false,

keymap: {
search: "[_-0-9a-zA-Z]",
next: ["ArrowDown", "ArrowRight"],
prev: ["ArrowUp", "ArrowLeft"],
first: ["Home"],
last: ["End"]
}, // keymap

actions: {
next: nextItem,
prev: prevItem,
first: firstItem,
last: lastItem,

up: upLevel,
down: downLevel,
out: function () {}
} // actions
}; // defaultOptions
options = options || {};

if (container.matches("select")) return;

//debug ("user options before: ", options.toSource());
options = Object.assign ({}, defaultOptions, options);
//debug ("user options after assign: ", options.toSource());
options.keymap = Object.assign ({}, defaultOptions.keymap, options.keymap);
options.actions = Object.assign ({}, defaultOptions.actions, options.actions);

//debug ("keymap before: ", options.keymap.toSource());
options.keymap = processKeymap (options.keymap);
//debug ("keymap after: ", options.keymap.toSource());

if (container.matches("ul")) removeBullets (container);


if (options.applyAria) applyAria (container, options.type);
setFocusedNode(initialFocus());

container.addEventListener ("keydown", function (e) {
var key = e.key || e.which || e.keyCode;
var actionName = options.keymap[key];
var action = options.actions[actionName]; // action
var character = e.char || String.fromCharCode (e.which || e.keyCode);

if (! key) {
alert ("invalid key: " + key);
throw new Error ("invalid key: " + key);
} // if
//debug ("key: ", key, actionName, typeof(action));
stopTimer ();

if (isAlphanumeric(character)) return handleSearchKey (character);

if (! action) return true;

if (action instanceof Function) {
//debug ("- call function");
performAction (action, e);
} else if (typeof(action) === "string") {
//debug ("- fire event ", action);
e.target.dispatchEvent (new CustomEvent(action));
} else {
alert ("invalid type: " + action);
return true;
} // if

return false;
}); // keydown

function performAction (action, e) {
var newNode = action.call (container, getFocusedNode());
//debug ("performAction: ", e.target.outerHTML, newNode.outerHTML);

if (newNode !== e.target) current (newNode);
} // performAction


function current (node) {
if (node) {
setFocusedNode (node);
node.focus ();
return node;
} else {
return getFocusedNode ();
} // if
} // current

function initialFocus () {
var node = getNodes(container)[0];
//debug ("initialFocus: ", node.outerHTML);
return node;
} // initialFocus

function getFocusedNode () {
//debug ("getFocusedNode: ", focusedNode.outerHTML);
return focusedNode;
} // getFocusedNode

function setFocusedNode (node) {
var oldNode;
if (! node) return;
focusedNode = node;
if (! options.embedded) {
oldNode = container.querySelector ("[tabindex='0']");
if (oldNode) oldNode.setAttribute ("tabindex", "-1");
focusedNode.setAttribute ("tabindex", "0");
} // if

//debug ("setFocus to ", node.outerHTML);
} // setFocusedNode



// create an observer instance
var observer = new MutationObserver(function(mutations) {
mutations.forEach(function(mutation) {
//debug ("mutation: ", mutation);
if (options.applyAria) applyAria (container, options.type);
setFocusedNode (initialFocus());
}); // forEach Mutations

}); // new Observer

// pass in the target node, as well as the observer options
//observer.observe(container, {childList: true});

// later, you can stop observing
//observer.disconnect();

function processKeymap (_keymap) {
var keymap = {};
for (var action in _keymap) {
//debug ("- action: ", action);

for (var key of _keymap[action]) {
//debug ("- key: ", key);
keymap[key] = action;
} // for
} // for

return keymap;
} // processKeymap

function applyAria (container, type) {
var name, branches, children;
type = type.toLowerCase();
//debug ("applyAria to ", type, nodeName(container));



if (type === "list") {
container.setAttribute("role", "listbox");
getNodes(container).forEach (e => {
e.setAttribute ("role", "option");
e.setAttribute ("tabindex", "-1");
});
//debug ("aria applied to ", type);

} else if (type === "tree") {
name = nodeName (container);
//debug ("tree: nodeName = ", name);
Array.from(container.querySelectorAll(name))
.forEach (e => e.setAttribute ("role", "group"));

name = nodeName(container.firstChild);
branches = Array.from(container.querySelectorAll(name))
.forEach (e => {e.setAttribute("role", "treeitem"); e.setAttribute("tabindex", "-1");});
container.setAttribute("role", "tree");

// add aria-expanded to nodes only if they are not leaf nodes
Array.from(container.querySelectorAll("[role=treeitem] > [role=group]"))
.forEach (e => e.parentNode.setAttribute("aria-expanded", "false"));

} // if

} // applyAria

function getNodes (container) {
return Array.from(
(nodeName(firstChild(container)) === "slot")? 
firstChild(container).assignedNodes()
: container.childNodes
).filter(e => e.nodeType === 1)
.filter (e => e.matches(options.activeNodeSelector));
} // getNodes

function removeBullets (container) {
debug ("removeBullets: ", container.nodeName, container.className);
container.style.listStyleType = "none";

getNodes(container).forEach (function (e) {
var list = e.querySelector("ul,ol");
if (list) removeBullets (list);
}); // forEach
} // removeBullets



/// default actions

function nextItem (node) {
return nextSibling (node, options.activeNode);
} // nextItem

function prevItem (node) {
return previousSibling (node, options.activeNode);
} // prevItem

function firstItem (node) {
return firstChild(node.parentNode);
} // firstItem 

function lastItem (node) {
return lastChild(node.parentNode);
} // lastItem 


function upLevel (node) {
var root = node.closest ("[role=tree]");
var up = node.parentNode.closest("[role=treeitem]");
if (up && root.contains(up)) return up;
else return node;
} // upLevel

function downLevel (node) {
var down = node.querySelector("[role=group] > [role=treeitem]");
if (down) return down;
else return node;
} // downLevel

/// search

function handleSearchKey (character) {
searchText += character;

searchTimer = setTimeout (function () {
searchList (searchText);
searchText = "";
}, searchTimeout || 200); // milliseconds
} // handleListSearch

function searchList (text) {
if (text) {
text = text.toLowerCase().trim();
var node = find (getNodes(container), function (element) {
var elementText = element.textContent.toLowerCase().trim();
//debug ("- ", elementText);
return elementText.startsWith (text);
}, indexOf(current()));

if (node) current (node);
return node;
} // if

return null;

function find (list, test, start, index) {
//debug ("findIndex: ", start);
start = start || 0;
var length = list.length;

if (length === 0) return (index)? -1 : null;
if (start < 0) start = length+start;
start = (start+1) % length;

for (var i=start; i<length; i++) {
if (test(list[i])) return (index)? i : list[i];
} // for

if (start > 0) {
for (var i=0; i<start; i++) {
if (test(list[i])) return (index)? i : list[i];
} // for
} // if

//debug ("found nothing");
return (index)? -1 : null;
} // findIndex
} // searchList

function stopTimer () {
clearTimeout (searchTimer);
} // stopTimer

function isAlphanumeric (x) {
var result = /\w/.test (x);
//alert ("isAlphanumeric " + x + " is " + result);
return result;
} // isAlphanumeric

/// API		
return current;
} // keyboardNavigation

alert ("keyboardNavigation.js loaded");
