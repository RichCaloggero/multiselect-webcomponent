"use strict";

function keyboardNavigation (container, options) {
var focusedNode = null;
var keymap, actions;

var defaultOptions = {
type: "list", // list, tree, or menu
embedded: false, // if embedded in another widget, will not maintain tabindex="0" on container or child element
selected: true,
wrap: false,
applyAria: true,


keymap: {
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

if (nodeName(container) === "select") return;

options = Object.assign ({}, defaultOptions, options);
options.keymap = Object.assign ({}, defaultOptions.keymap, options.keymap);
options.actions = Object.assign ({}, defaultOptions.actions, options.actions);
options.keymap = processKeymap (options.keymap);


if (options.applyAria) applyAria (container, options.type);
current (initialFocus());

container.addEventListener ("keydown", function (e) {
var key = e.key || e.which || e.keyCode;
var actionName = options.keymap[key];
var action = options.actions[actionName]; // action

if (! key) {
alert ("invalid key: " + key);
throw new Error ("invalid key: " + key);
} // if
//debug ("key: ", key, actionName, typeof(action));

if (! action) return true;

if (action instanceof Function) {
debug ("- call function");
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
} // if

function performAction (action, e) {
newNode = action.call (e.target, e);

if (newNode !== e.target) current (newNode);
} // performAction


function current (node) {
if (node) {
debug ("setting focusedNode");
setFocus (node);
return node;
} else {
return getFocus ();
} // if
} // current

function initialFocus () {
return container.querySelector("[role=option]");
} // initialFocus

function getFocus () {
return focusedNode;
} // getFocus

function setFocus (node) {
focusedNode = node;
} // setFocus

function nodeName (node) {
if (! node) return "";
return node.nodeName.toLowerCase();
} // nodeName


// create an observer instance
var observer = new MutationObserver(function(mutations) {
mutations.forEach(function(mutation) {
//debug ("mutation: ", mutation);
if (options.applyAria) applyAria (container, options.type);
current ();
}); // forEach Mutations

}); // new Observer

// pass in the target node, as well as the observer options
observer.observe(container, {childList: true});

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

function applyAria ($container, type) {
var name, $groups, $branches, $hasChildren;
type = type.toLowerCase();

if (type === "list") {
container.setAttribute("role", "listbox");
(container.querySelectorAll ("li, div, span"))
.forEach (e => {
e.setAttribute ("role", "option");
e.setAttribute ("tabindex", "-1");
});
debug ("aria applied to ", type);

} else if (type === "tree") {
name = nodeName (container);
Array.from(container.querySelectorAll(name))
.forEach (e => setAttribute ("role", "group"));

name = nodeName(container.firstChild);
branches = Array.from(container.querySelectorAll(name))
.forEach (e => setAttribute("role", "treeitem"));
container.setAttribute("role", "tree");

// add aria-expanded to nodes only if they are not leaf nodes
Array.from(container.querySelectorAll("[role=treeitem] > [role=group]"))
.forEach (e => e.setAttribute("aria-expanded", "false"));

} // if

} // applyAria

/// default actions
function nextItem () {
return nextSibling (this);
} // nextItem

function prevItem () {
return previousSibling (this);
} // prevItem

function firstItem () {
return firstChild(this.parentNode);
} // firstItem 

function lastItem () {
return lastChild(this.parentNode);
} // lastItem 


function upLevel () {
var $root = $(this).parent().closest ("[role=tree]");
var $up = $(this).parent().closest("[role=treeitem]");
if (!$up || !$up.length || !jQuery.contains($root[0], $up[0])) return $(this);
return $up;
} // upLevel

function downLevel () {
var $down = $(this).find("[role=group]:first > [role=treeitem]:first");
if (!$down || !$down.length) return $(this);
return $down;
} // downLevel


/// API
return current;
} // keyboardNavigation

