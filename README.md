# [Pusha](https://slavanga.github.io/pusha/)

Pusha is a lightweight but complete off-canvas solution.


## Setup

* Output panels before the ```pusha-wrapper```
* Use the ```pusha-push``` class on fixed elements (e.g. header)
* Close events are bound to the first element with a ```data-close``` attribute inside a panel

```html
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="dist/css/pusha.min.css" />
  </head>
  <body>
    <div class="pusha-panel pusha-panel--left" aria-hidden="true">
      <div class="pusha-panel__content">
        <p>Panel</p>
        <button data-close>Close Panel</button>
      </div>
    </div>

    <header class="header-fixed pusha-push">
      <p>Header</p>
    </header>

    <div class="pusha-wrapper">
      <p>Content</p>
      <button class="js-open-panel" aria-expanded="false">Open Panel</button>
    </div>

    <script src="dist/js/pusha.min.js"></script>
    <script>
      var panel = new Pusha('.pusha-panel--left');

      document.querySelector('.js-open-panel').addEventListener('click', panel.open);
    </script>
  </body>
</html>
```

## Styling (Using Sass)

### Variables

```scss
$pusha-z-index: 200;
$pusha-duration: 0.3s;
$pusha-easing: ease;
$pusha-blocker-z-index: $pusha-z-index + 10;
$pusha-blocker-duration: $pusha-duration;
$pusha-blocker-bg: rgba(0, 0, 0, 0.5);
```

### Mixins

```scss
.my-panel {
  @include pusha-panel(
    $direction: left, // left, right, top, bottom
    $mode: push, // push, pull, overlay, fade
    $width: 260px,
    $height: 100%,
    $background: #fff
  );
}
```


## Options

```js
new Pusha('.my-panel', {
  closeOnEsc: true,
  closeOnClick: true,
  disableOverscroll: true,
  activeClass: 'pusha-active',
  onOpen: function(panel) {},
  onClose: function(panel) {}
});
```


## API
```js
var panel = new Pusha('.my-panel');

// Public methods
panel.open();
panel.close();
panel.toggle();

// Public properties
panel.isOpen;
```


## License
The code is released under the [MIT license](https://github.com/slavanga/pusha/blob/master/LICENSE).
