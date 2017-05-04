/*! Pusha v1.0.0 | MIT License | https://github.com/slavanga/pusha */

(function(window, document, undefined) {
	'use strict';

	function Pusha(element, options) {
		var panel = typeof element === 'string' ? document.querySelector(element) : element;

		if(! panel) return false;

		var html = document.documentElement;
		var blockerElement = document.getElementsByClassName('pusha-blocker')[0];
		var closeElement = panel.querySelector('[data-close]');
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
			open: function() {
				if (! api.isOpen) {
					api.isOpen = true;
					addClass(html, settings.activeClass);
					addClass(panel, 'pusha-panel--active');

					if(! transitionEvent) {
						addClass(html, 'pusha-animated');
					}

					api.activeElement = document.activeElement;
					settings.onOpen();
				}
			},
			close: function() {
				if (api.isOpen) {
					api.isOpen = false;
					removeClass(html, settings.activeClass);
					removeClass(panel, 'pusha-panel--active');

					if(! transitionEvent) {
						removeClass(html, 'pusha-animated');
					}

					api.activeElement.focus();
					settings.onClose();
				}
			},
			toggle: function() {
				if (api.isOpen) {
					api.close();
				} else {
					api.open();
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
						if(el.scrollHeight <= el.clientHeight) {
							e.preventDefault();
						}
					}
				}, { passive: false });
			}
		};

		if(transitionEvent) {
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
			api.disableOverscroll(panel.querySelector('.pusha-panel__content'));
		}

		if (settings.closeOnEsc) {
			document.addEventListener('keydown', function(e) {
				var isEscape = false;

				if ('key' in e) {
					isEscape = (e.key == 'Escape' || e.key == 'Esc');
				} else {
					isEscape = (e.keyCode == 27);
				}

				if (isEscape) {
					e.preventDefault();
					api.close();
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

		if(closeElement) {
			closeElement.addEventListener('click', function(e) {
				e.preventDefault();
				api.close();
			});
		}

		return api;
	}

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

	window.Pusha = Pusha;
}(window, document));
