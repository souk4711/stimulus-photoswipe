# Stimulus PhotoSwipe

A Stimulus controller for [PhotoSwipe].

## Installation

### Using npm

```sh
npm i stimulus-photoswipe
```

### Using yarn

```sh
yarn add stimulus-photoswipe
```

## Usage

### Setup

Add this in your JavaScript file:

```javascript
// Installing Stimulus in Your Application
import { Application } from '@hotwired/stimulus'
const application = Application.start()

// Registering Controllers Manually
import { PhotoSwipeController } from 'stimulus-photoswipe'
application.register('lightbox', PhotoSwipeController)
```

And add this in your CSS file:

```css
@import 'stimulus-photoswipe/dist/style.css';
```

### Initialize with default options

```html
<div data-controller="lightbox">
  <a
    href="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg"
    data-pswp-width="1669"
    data-pswp-height="2500"
    target="_blank"
  >
    <img
      src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-200.jpg"
    />
  </a>
</div>
```

### Initialize with `data-[identifier]-pswp-options-value`

```html
<div
  data-controller="lightbox"
  data-lightbox-pswp-options-value='{"children":".lightbox-item","showHideAnimationType":"zoom"}'
>
  <a
    class="lightbox-item"
    href="https://cdn.photoswipe.com/photoswipe-demo-images/photos/7/img-2500.jpg"
    data-pswp-width="1875"
    data-pswp-height="2500"
    data-cropped="true"
    target="_blank"
  >
    <img
      src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/7/img-200.jpg"
    />
    Cropped
  </a>
</div>
```

### Use `data-action="click->[identifier]#loadAndOpen"`

```html
<div
  data-controller="lightbox"
  data-lightbox-pswp-options-value='{"children":".lightbox-item"}'
>
  <a
    class="lightbox-item hidden"
    href="https://cdn.photoswipe.com/photoswipe-demo-images/photos/4/img-2500.jpg"
    data-pswp-width="1875"
    data-pswp-height="2500"
  ></a>
  <a
    class="btn"
    data-action="click->lightbox#loadAndOpen"
    data-pswp-slide-index="0"
    >loadAndOpen</a
  >
</div>
```

### Extending Controller

```javascript
import { Controller } from '@hotwired/stimulus'
import { usePhotoSwipe } from 'stimulus-photoswipe'

class CustomPhotoSwipeController extends Controller {
  connect() {
    this.lightbox = usePhotoSwipe(this, {
      // https://photoswipe.com/options/
      photoswipe: {
        showHideAnimationType: 'fade'
      },

      // https://photoswipe.com/events/
      handlers: {
        beforeOpen: [this.beforeOpenHandler]
      },

      // https://photoswipe.com/filters/
      filters: {
        numItems: [this.numItemsFilter]
      }
    }).lightbox
  }

  beforeOpenHandler() {
    console.log('beforeOpen')
  }

  numItemsFilter(numItems, dataSource) {
    console.log('numItems')
    return numItems
  }
}
```

[photoswipe]: https://github.com/dimsemenov/photoswipe
