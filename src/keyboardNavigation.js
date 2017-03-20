"use strict";

function keyboardNavigation (container, options) {
var focusedNode = null;
var keymap, actions;

var defaultOptions = {
type: "list", // list, tree, or menu
embedded: false, // if embedded in another widget, will not maintain tabindex="0" on container or child element
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
options = options || {};

if (nodeName(container) === "select") return;

//debug ("user options before: ", options.toSource());
options = Object.assign ({}, defaultOptions, options);
//debug ("user options after assign: ", options.toSource());
options.keymap = Object.assign ({}, defaultOptions.keymap, options.keymap);
options.actions = Object.assign ({}, defaultOptions.actions, options.actions);

//debug ("keymap before: ", options.keymap.toSource());
options.keymap = processKeymap (options.keymap);
//debug ("keymap after: ", options.keymap.toSource());

if (container.matches("ul")) {
container.style.listStyleType = "none";
Array.from(container.querySelectorAll (nodeName(container)))
.forEach (e => e.style.listStyleType = "none");
} // if


if (options.applyAria) applyAria (container, options.type);
setFocusedNode(initialFocus());

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
var newNode = action.call (container, getFocus());
//debug ("performAction: ", e.target.outerHTML, newNode.outerHTML);

if (newNode !== e.target) current (newNode);
} // performAction


function current (node) {
if (node) {
//debug ("setting focusedNode");
setFocusedNode (node);
node.focus ();
return node;
} else {
return getFocus ();
} // if
} // current

function initialFocus () {
if (options.type === "list") return container.querySelector("[role=option]");
else if (options.type === "tree") return container.querySelector("[role=treeitem]");
} // initialFocus

function getFocus () {
return focusedNode;
} // getFocus

function setFocusedNode (node) {
var oldNode;
if (! node) return;
focusedNode = node;
if (! options.embedded) {
oldNode = container.querySelector ("[tabindex='0']");
if (oldNode) oldNode.setAttribute ("tabindex", "-1");
focusedNode.setAttribute ("tabindex", "0");
} // if
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
debug ("applyAria to ", type, nodeName(container));

if (nodeName(firstChild(container)) === "slot") children = firstChild(container).assignedNodes();
else children = container.childNodes;
children = Array.from(children)
.filter(e => e.nodeType === 1);
debug ("applying aria to ", children.length + " children");


if (type === "list") {
container.setAttribute("role", "listbox");
children.forEach (e => {
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

/// default actions

function nextItem (node) {
return nextSibling (node);
} // nextItem

function prevItem (node) {
return previousSibling (node);
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

/// API		
return current;
} // keyboardNavigation

alert ("keyboardNavigation.js loaded");
