# Multiselect Web Component

A multiselect widget created using [Web Components](https://www.w3.org/TR/components-intro/).

This repository forked from
![multiselect web component](https://github.com/sitepoint-editors/multiselect-web-component)


## Demo

[https://RichCaloggero.github.io/multiselect-webcomponent/demo/]

## Changes From Original

- Fixed Accessibility 
	+ added messages to indicate item and selected item counts as they change (used `aria` live region to cause screen reader to announce dynamically)
	+ updated keyboard Commands (list at end of this document)
	+ Current selection indicated by buttons rather than separate text and remove button
	+ wrapped the current selection buttons in div with role of group and appropriate `aria-label`
	+ enter toggles selection from within list and does not close list
	+ downArrow opens and focuses in list if in input field or currentSelection region
- Added First Letter Navigation in List 
- Added Search / Filtering
- added new attributes to html element
	+ label: label spoken by screen reader when input field gains focus
	+ showStatusMessages: true to cause status messages meant for screen readers to be shown on-screen
	+ placeholder: still available as per original (see below)


## Usage

Import `multiselect.html` and use `<x-multiselect>` element. Define items with `<li>` elements. To make an item selected add `selected` attribute.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="import" href="multiselect.html">
</head>
<body>
    <x-multiselect placeholder="Select Value">
        <li value="1" selected>Item 1</li>
        <li value="2">Item 2</li>
        <li value="3" selected>Item 3</li>
        <li value="4">Item 4</li>
    </x-multiselect>
</body>
</html>
```


## API

### Attribute `placeholder`

Add attribure `placeholder` to set multiselect placeholder (text to be displayed when no items are selected).

```html
    <x-multiselect placeholder="Multiselect Placeholder">
    ...
    </x-multiselect>
```

### Method `selectedItems()`

Returns selected item values as an Array.

```js
// returns an array of values, e.g. [1, 3]
var selectedItems = multiselect.selectedItems();
```

### Event `change`

Is fired each time selected items are changes.

```js
multiselect.addEventListener('change', function() {
    // print selected items to console
    console.log('Selected items:', this.selectedItems());
});
```

### Keyboard Commands

The following keyboard commands are implemented:

- tab: moves among parts of the widget
- downArrow:
	+ when in input field will open list and move to first item
	+ when in list moves to next item
- upArrow:
	+ moves among items in list
- alphanumerics in input field will filter list
	+ backspace will delete a character from the input and adjust filter accordingly
+ escape closes and returns list to its unfiltered state


## Browser Support

Browser support is limited by support of [Web Components](http://caniuse.com/#search=components).

Add [webcomponentjs](https://github.com/webcomponents/webcomponentsjs) polyfill to be able to use the component in all modern browsers.

## License

The MIT License (MIT)

Copyright (c) 2016 SitePoint

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
