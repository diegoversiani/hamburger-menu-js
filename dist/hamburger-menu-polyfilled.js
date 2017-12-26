/**
 * File polyfill-closest.js.
 *
 * Extend browser support for Element.closest and Element.matches all the way back to IE9.
 *
 * Author: MDN
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */

(function () {
  if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;

  if (!Element.prototype.closest)
    Element.prototype.closest = function(s) {
        var el = this;
        var ancestor = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (ancestor.matches(s)) return ancestor;
            ancestor = ancestor.parentElement;
        } while (ancestor !== null); 
        return null;
    };
})();

/**
 * File polyfill-CustomEvents.js.
 *
 * Extend browser support for CustomEvents all the way back to IE9.
 */

(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

/**
 * Hamburger Menu
 * 
 * File hamburger-menu.js.
 *
 * Instantiable plugin for a hamburger menu.
 *
 * Website: https://diegoversiani.me/hamburger-menu-js
 * Github: https://github.com/diegoversiani/hamburger-menu-js
 * 
 * Author: Diego Versiani
 * Contact: https://diegoversiani.me
 *
 * Depends on:
 * shared/polyfill-closest.js
 * shared/polyfill-CustomEvents.js
 */
(function (root, factory) {
  if ( typeof define === 'function' && define.amd ) {
    define([], factory(root));
  } else if ( typeof exports === 'object' ) {
    module.exports = factory(root);
  } else {
    root.HamburgerMenu = factory(root);
  }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

  'use strict';

  //
  // Constants
  //

  var STATE_ACTIVE = 'active',
      STATE_INACTIVE = 'inactive',
      ARIA_EXPANDED = 'aria-expanded',
      ARIA_CONTROLS = 'aria-controls';



  //
  // Global Variables
  //

  var window = root; // Map window to root to avoid confusion


  //
  // Default settings
  //

  var defaults = {
    defaultState: STATE_INACTIVE,
    stateElement: '#menu',
    stateActiveClass: 'is-active',
    stateInactiveClass: '',
    bodyClass: 'hamburger-menu',
    bodyClassActive: 'hamburger-menu--active',
    toggleButton: '#menu-toggle',
    toggleButtonActiveClass: 'is-active',
  };



  //
  // Custom Events
  //

  var hamburgerMenuInit = new CustomEvent( 'hamburger-menu-init', { detail: {}, bubbles: true } );
  var hamburgerMenuDestroy = new CustomEvent( 'hamburger-menu-destroy', { detail: {}, bubbles: true } );
  var hamburgerMenuOpenBefore = new CustomEvent( 'hamburger-menu-open-before', { detail: {}, bubbles: true } );
  var hamburgerMenuOpenAfter = new CustomEvent( 'hamburger-menu-open-after', { detail: {}, bubbles: true } );
  var hamburgerMenuCloseBefore = new CustomEvent( 'hamburger-menu-close-before', { detail: {}, bubbles: true } );
  var hamburgerMenuCloseAfter = new CustomEvent( 'hamburger-menu-close-after', { detail: {}, bubbles: true } );



  //
  // Methods
  //

  /**
   * Merge two or more objects. Returns a new object.
   * @private
   * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
   * @param {Object}   objects  The objects to merge together
   * @returns {Object}          Merged values of defaults and options
   */
  var extend = function () {
    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;

    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0];
      i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
      for ( var prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
          // If deep merge and property is an object, merge properties
          if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            extended[prop] = extend( true, extended[prop], obj[prop] );
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
      var obj = arguments[i];
      merge(obj);
    }

    return extended;
  };


  //
  // Constructor
  //

  /**
   * Construct a new intance of the plugin.
   */
  var BuildHamburgerMenu = function ( selector, options ) {
    var _settings,
        _stateElement,
        _toggleButton;
    var publicMethods = {}; // Placeholder for public methods

    /**
     * Handle click on the document.
     * @param  Event e Event data.
     */
    var handleDocumentClick = function ( e ) {
      // Toggle menu button clicked
      if ( e.target.closest( _settings.toggleButton ) ) {
        publicMethods.toggle();
      }
    };

    /**
     * Return the current state.
     * @return String Current state.
     */
    var getState = function () {
      if ( _stateElement.classList.contains( _settings.stateActiveClass ) ) {
        return STATE_ACTIVE;
      }

      return STATE_INACTIVE;
    };



    //
    // Public Methods
    //

    /**
     * Initializes plugin
     */
    publicMethods.init = function ( selector, options ) {
      // Merge user options with defaults
      _settings = extend( defaults, options || {} );

      // Set stateElement using `selector` param
      if ( selector ) { _settings.stateElement = selector; }
      
      // Get elements
      _stateElement = document.querySelector( _settings.stateElement );
      _toggleButton = document.querySelector( _settings.toggleButton );

      // Bail early if stateElement not found
      if ( !_stateElement ) { return; }

      // Set default state
      if ( _settings.defaultState == STATE_ACTIVE ) {
        publicMethods.open();
      }
      else {
        publicMethods.close();
      }

      // Set initial ARIA attributes
      _toggleButton.setAttribute( ARIA_CONTROLS, _stateElement.id );

      // Set event listeners
      document.addEventListener( 'click', handleDocumentClick );

      // Set body class
      document.body.classList.add( _settings.bodyClass );

      // Dispatch event `hamburger-menu-init`
      _stateElement.dispatchEvent( hamburgerMenuInit );
    };

    /**
     * Destroy the current instance.
     */
    publicMethods.destroy = function () {
      // Remove body classes
      document.body.classList.remove( _settings.bodyClassActive );
      // TODO: Remove body (_settings.bodyClass) class when destroy, check for other instances.

      // Remove state classes
      _toggleButton.classList.remove( _settings.toggleButtonActiveClass );
      _stateElement.classList.remove( _settings.stateActiveClass );
      _stateElement.classList.remove( _settings.stateInactiveClass );

      // Remove ARIA attributes
      _toggleButton.setAttribute( ARIA_CONTROLS, '' );
      _toggleButton.setAttribute( ARIA_EXPANDED, '' );
      _stateElement.setAttribute( ARIA_EXPANDED, '' );

      // Remove event listeners
      document.removeEventListener( 'click', handleDocumentClick );

      // Dispatch event `hamburger-menu-destroy`
      _stateElement.dispatchEvent( hamburgerMenuDestroy );
    };

    /**
     * Toggle menu state.
     */
    publicMethods.toggle = function () {
      if ( getState() == STATE_INACTIVE ) {
        publicMethods.open();
        return;
      }

      // Close
      publicMethods.close();
    };

    /**
     * Open menu.
     */
    publicMethods.open = function () {
      // Dispatch event `hamburger-menu-open-before`
      _stateElement.dispatchEvent( hamburgerMenuOpenBefore );

      // Body
      document.body.classList.add( _settings.bodyClassActive );
      
      // State element
      _stateElement.classList.remove( _settings.stateInactiveClass );
      _stateElement.classList.add( _settings.stateActiveClass );
      _stateElement.setAttribute( ARIA_EXPANDED, true );
      
      // Toggle button
      _toggleButton.classList.add( _settings.toggleButtonActiveClass );
      _toggleButton.setAttribute( ARIA_EXPANDED, true );

      // Dispatch event `hamburger-menu-open-after`
      _stateElement.dispatchEvent( hamburgerMenuOpenAfter );
    };

    /**
     * Close menu.
     */
    publicMethods.close = function () {
      // Dispatch event `hamburger-menu-close-before`
      _stateElement.dispatchEvent( hamburgerMenuCloseBefore );

      // Body
      document.body.classList.remove( _settings.bodyClassActive );
      
      // State element
      _stateElement.classList.remove( _settings.stateActiveClass );
      _stateElement.classList.add( _settings.stateInactiveClass );
      _stateElement.setAttribute( ARIA_EXPANDED, false );

      // Toggle button
      _toggleButton.classList.remove( _settings.toggleButtonActiveClass );
      _toggleButton.setAttribute( ARIA_EXPANDED, false );

      // Dispatch event `hamburger-menu-close-after`
      _stateElement.dispatchEvent( hamburgerMenuCloseAfter );
    };

    // Initialize the instance
    publicMethods.init( selector, options );

    // Return the public methods of the instance
    return publicMethods;
  };


  // Return the constructor
  return BuildHamburgerMenu;

});
