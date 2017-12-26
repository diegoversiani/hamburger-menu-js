# Hamburger Menu

Instantiable plugin for hamburger menus.

__Enjoy using Hamburger Menu?__

If you enjoy using Hamburger Menu and want to support it's development, you can leave me a small tip.
All payments are securely handled through [PayPal](https://paypal.com).

<a href='https://ko-fi.com/A0212ZQ' target='_blank'><img height='32' style='border:0px;height:32px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=a' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Installation

Setting up is pretty straight-forward. Just download the script from `dist` folder and include it in your HTML:

```html
<script type="text/javascript" src="path/to/hamburger-menu.min.js"></script>
```

Hamburger Menu also supports AMD / CommonJS

```js
// AMD
require(["path/to/hamburger-menu-js"], function(HamburgerMenu) {});

// CommonJS
var HamburgerMenu = require("hamburger-menu-js");
```

#### Get from NPM

Hamburger Menu is also available on NPM:

```sh
$ npm install hamburger-menu-js
```

#### Polyfills

The plugin provides the polyfills for `closest` and `CustomEvents` to extend support back to IE9. Include the file `/dist/hamburger-menu-polyfilled.min.js` or use the polyfill files from the folder `/src/shared`.

## Basic Usage

Create an instance of `HamburgerMenu` and pass in the `selector` for the menu element and, optionally, your custom options.

```html
<script type="text/javascript">
    var menu = new HamburgerMenu( '#menu-mobile__wrapper', {
      toggleButton: '#menu-toggle',
      stateActiveClass: 'menu-mobile--open',
      stateInactiveClass: 'menu-mobile--closed',
    });
</script>
```

## Options

Option | Default Value | Comments
--- | --- | ---
`defaultState` | `inactive` | Accepts `active` and `inactive` as starting state.
`stateElement` | `#menu` | Selector for the menu element.
`stateActiveClass` | `is-active` | Css class name for the active state applied to the `stateElement`.
`stateInactiveClass` | (empty) | Css class name for the inactive state applied to the `stateElement`.
`bodyClass` | `hamburger-menu` | Css class name applied to the body element when the component is initialized.
`bodyClassActive` | `hamburger-menu--active` | Css class name applied to the body element when the current instance of HamburgerMenu is in active state.
`toggleButton` | `#menu-toggle` | Selector for the button element.
`toggleButtonActiveClass` | `is-active` | Css class name for the active state applied to the `toggleButton`.

## Contributing to Development

Pull requests and contributions are very wellcome.

You can get your copy up and running for development quickly by cloning the repo and running [npm](http://npmjs.org/) install:

```sh
$ npm install
```

This will install all the necessary tools for compiling minified files.

Make your changes then generate new compiled files running [gulp](http://gulpjs.org/):

```sh
$ gulp build-scripts
```

Or _watch_ for file changes in the `src` folder running:

```sh
$ gulp
```

## Change Log

__1.0.0__

- Initial release

## License

Licensed under MIT. Enjoy.

## Acknowledgement

Hamburger Menu was created by [Diego Versiani](https://diegoversiani.me) for a better menu for mobile and perhaps other devices.
