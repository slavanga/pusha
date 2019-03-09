/*! Pusha v1.3.0 | MIT License | https://github.com/slavanga/pusha */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Pusha = factory();
  }
}(this, function() {
  'use strict';

  var supportsPassive = false;
  try {
    var options = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
      }
    });
    window.addEventListener('testPassive', null, options);
    window.removeEventListener('testPassive', null, options);
  } catch (e) {}

  function getScrollbarSize() {
    var scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
    document.body.appendChild(scrollDiv);
    var scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    return scrollbarSize;
  }

  var scrollbarSize = getScrollbarSize();

  var Pusha = function(element, options) {
    var panel = typeof element === 'string' ? document.querySelector(element) : element;

    if (! panel) return false;

    var html = document.documentElement;
    var blockerElement = document.getElementsByClassName('pusha-blocker')[0];
    var closeElement = panel.querySelector('[data-close]');
    var panelContent = panel.querySelector('.pusha-panel__content');
    var settings = {
      closeOnEsc: true,
      closeOnClick: true,
      disableOverscroll: true,
      disableBodyscroll: false,
      activeClass: 'pusha-active',
      onOpen: function() {},
      onClose: function() {}
    };

    for (var key in options) {
      if (settings.hasOwnProperty(key)) {
        settings[key] = options[key];
      }
    }

    var api = {
      isOpen: false,
      open: function(e) {
        if (! api.isOpen) {
          api.isOpen = true;
          html.classList.add(settings.activeClass);
          panel.classList.add('pusha-panel--active');

          if (e) {
            api.activeElement = e.currentTarget;
            api.activeElement.setAttribute('aria-expanded', true);
          }

          panel.setAttribute('aria-hidden', false);
          panelContent.focus();
          settings.onOpen(panel);
        }
      },
      close: function(e) {
        if (api.isOpen) {
          api.isOpen = false;
          html.classList.remove(settings.activeClass);
          panel.classList.remove('pusha-panel--active');

          if (api.activeElement) {
            api.activeElement.setAttribute('aria-expanded', false);
            api.activeElement.focus();
          }

          panel.setAttribute('aria-hidden', true);
          settings.onClose(panel);
        }
      },
      toggle: function(e) {
        if (api.isOpen) {
          api.close(e);
        } else {
          api.open(e);
        }
      },
      disableOverscroll: function(el) {
        el.addEventListener('touchstart', function() {
          if (el.scrollTop === 0) {
            el.scrollTop = 1;
          } else if (el.scrollTop + el.offsetHeight === el.scrollHeight) {
            el.scrollTop = el.scrollTop - 1;
          }
        });
      },
      disableBodyscroll: function(el) {
        document.body.addEventListener('touchmove', function(e) {
          if (api.isOpen) {
            if (el.scrollHeight <= el.clientHeight) {
              e.preventDefault();
            }
          }
        }, supportsPassive ? { passive: false } : false);
      }
    };

    panel.addEventListener('transitionend', function(e) {
      if (e.propertyName == 'opacity') {
        if (api.isOpen) {
          html.classList.add('pusha-animated');

          if (document.body.scrollHeight > window.innerHeight) {
            html.style.paddingRight = scrollbarSize + 'px';

            Array.prototype.forEach.call(document.getElementsByClassName('pusha-push'), function(el) {
              el.style.paddingRight = scrollbarSize + 'px';
            });
          }
        } else {
          html.classList.remove('pusha-animated');
          html.style.paddingRight = '';

          Array.prototype.forEach.call(document.getElementsByClassName('pusha-push'), function(el) {
            el.style.paddingRight = '';
          });
        }
      }
    });

    if (! (window.CSS && CSS.supports('overscroll-behavior', 'contain'))) {
      if (settings.disableOverscroll) {
        api.disableOverscroll(panelContent);
      }

      if (settings.disableBodyscroll) {
        api.disableBodyscroll(panelContent);
      }
    }

    if (settings.closeOnEsc) {
      document.addEventListener('keydown', function(e) {
        if (e.keyCode === 27) {
          api.close(e);
        }
      });
    }

    if (typeof blockerElement === 'undefined') {
      blockerElement = document.createElement('div');
      blockerElement.className = 'pusha-blocker';
      document.body.appendChild(blockerElement);
    }

    if (settings.closeOnClick) {
      blockerElement.addEventListener('click', api.close);
      blockerElement.addEventListener('touchstart', api.close, supportsPassive ? { passive: true } : false);
    }

    if (closeElement) {
      closeElement.addEventListener('click', api.close);
    }

    panelContent.setAttribute('tabindex', '-1');
    panel.pusha = api;

    return api;
  };

  return Pusha;
}));
