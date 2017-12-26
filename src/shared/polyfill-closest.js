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
