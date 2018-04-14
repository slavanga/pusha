/*! Pusha v1.1.0 | MIT License | https://github.com/slavanga/pusha */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.Pusha = factory();
  }
}(this, function(require, exports, module) {
  'use strict';

  var Pusha = function(element, options) {
    var panel = typeof element === 'string' ? document.querySelector(element) : element;

    if (! panel) return false;

    var html = document.documentElement;
    var blockerElement = document.getElementsByClassName('pusha-blocker')[0];
    var closeElement = panel.querySelector('[data-close]');
    var panelContent = panel.querySelector('.pusha-panel__content');
    var transitionEvent = getTransitionEvent();
    var settings = {
      closeOnEsc: true,
      closeOnClick: true,
      disableOverscroll: true,
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
          e.preventDefault();
          api.isOpen = true;
          addClass(html, settings.activeClass);
          addClass(panel, 'pusha-panel--active');

          if (! transitionEvent) {
            addClass(html, 'pusha-animated');
          }

          api.activeElement = e.currentTarget;
          api.activeElement.setAttribute('aria-expanded', true);
          panelContent.focus();
          settings.onOpen(panel);
        }
      },
      close: function(e) {
        if (api.isOpen) {
          e.preventDefault();
          api.isOpen = false;
          removeClass(html, settings.activeClass);
          removeClass(panel, 'pusha-panel--active');

          if (! transitionEvent) {
            removeClass(html, 'pusha-animated');
          }

          api.activeElement.setAttribute('aria-expanded', false);
          api.activeElement.focus();
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
          var currentScroll = el.scrollTop + el.offsetHeight;

          if (el.scrollTop === 0) {
            el.scrollTop = 1;
          } else if (currentScroll === el.scrollHeight) {
            el.scrollTop = el.scrollTop - 1;
          }
        });

        document.body.addEventListener('touchmove', function(e) {
          if (api.isOpen) {
            if (el.scrollHeight <= el.clientHeight) {
              e.preventDefault();
            }
          }
        });
      }
    };

    if (transitionEvent) {
      panel.addEventListener(transitionEvent, function(e) {
        if (e.propertyName == 'opacity') {
          if (api.isOpen) {
            addClass(html, 'pusha-animated');
          } else {
            removeClass(html, 'pusha-animated');
          }
        }
      });
    }

    if (settings.disableOverscroll) {
      api.disableOverscroll(panelContent);
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
      blockerElement.addEventListener('touchstart', api.close);
    }

    if (closeElement) {
      closeElement.addEventListener('click', api.close);
    }

    panelContent.setAttribute('tabindex', '-1');

    return api;
  };

  var regExp = function(name) {
    return new RegExp('(^| )' + name + '( |$)');
  };

  function addClass(element, className) {
    if (element.classList) {
      element.classList.add(className);
    } else {
      element.className += ' ' + className;
    }
  }

  function removeClass(element, className) {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      element.className = element.className.replace(regExp(className), '');
    }
  }

  function getTransitionEvent() {
    var element = document.createElement('div');

    var transitions = {
      'transition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (var t in transitions) {
      if (element.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }

  return Pusha;
}));
