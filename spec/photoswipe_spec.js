/* global fixture */

import { Application } from '@hotwired/stimulus'
import { expect } from 'chai'
import { PhotoSwipeController } from '../dist'
import { findController, aTimeout, click } from './helpers'

class CustomPhotoSwipeController extends PhotoSwipeController {
  pswpOptions() {
    return {
      showHideAnimationType: 'fade',
      handlers: {
        beforeOpen: [this.beforeOpenHandler]
      },
      filters: {
        numItems: [this.numItemsFilter]
      }
    }
  }

  beforeOpenHandler() {
    this.beforeOpenHandlerInvoked = true
  }

  numItemsFilter(numItems, dataSource) {
    this.numItemsFilterInvoked = true
    this.numItemsFilterArgsNumItems = numItems
    return numItems
  }
}

describe('PhotoSwipeController', () => {
  let application

  before(() => {
    application = Application.start()
    application.register('lightbox', PhotoSwipeController)
    application.register('custom-lightbox', CustomPhotoSwipeController)
  })

  after(() => {
    application.stop()
  })

  describe('#defaultOptions', () => {
    beforeEach(async () => {
      fixture.set(`
<div data-controller="lightbox" id="gallery--eins">
  <a href="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg"
    data-pswp-width="1669"
    data-pswp-height="2500"
    target="_blank">
    <img src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-200.jpg" alt="" />
  </a>
</div>
        `)
      await aTimeout(1000)
    })

    it('inits with #defaultOptions', async () => {
      const controller = findController(
        application,
        '#gallery--eins',
        'lightbox'
      )
      const options = controller.lightbox.options
      expect(options.gallery).to.equal('#gallery--eins')
      expect(options.children).to.equal('a')
      expect(options.showHideAnimationType).to.equal(undefined)

      click('#gallery--eins a')
      await aTimeout(1000)
      const data = controller.lightbox.pswp.currSlide.data
      expect(data.src).to.equal(
        'https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg'
      )
    })
  })

  describe('#pswpOptionsValue', () => {
    beforeEach(async () => {
      fixture.set(`
<div data-controller="lightbox" data-lightbox-pswp-options-value='{"children":".lightbox-item","showHideAnimationType":"zoom"}' id="gallery--zwei">
  <a class="lightbox-item" href="https://cdn.photoswipe.com/photoswipe-demo-images/photos/7/img-2500.jpg"
    data-pswp-width="1875"
    data-pswp-height="2500"
    data-cropped="true"
    target="_blank">
    <img src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/7/img-200.jpg" alt="" />
    Cropped
  </a>
</div>
        `)
      await aTimeout(1000)
    })

    it('inits with #pswpOptionsValue', async () => {
      const controller = findController(
        application,
        '#gallery--zwei',
        'lightbox'
      )
      const options = controller.lightbox.options
      expect(options.gallery).to.equal('#gallery--zwei')
      expect(options.children).to.equal('.lightbox-item')
      expect(options.showHideAnimationType).to.equal('zoom')

      click('#gallery--zwei .lightbox-item')
      await aTimeout(1000)
      const data = controller.lightbox.pswp.currSlide.data
      expect(data.src).to.equal(
        'https://cdn.photoswipe.com/photoswipe-demo-images/photos/7/img-2500.jpg'
      )
    })
  })

  describe('#pswpOptions', () => {
    beforeEach(async () => {
      fixture.set(`
<div data-controller="custom-lightbox" id="gallery--drei">
  <a href="https://unsplash.com"
    data-pswp-src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-2500.jpg"
    data-pswp-width="2500"
    data-pswp-height="1666"
    target="_blank">
    <img src="https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-200.jpg" alt="" />
  </a>
</div>
        `)
      await aTimeout(1000)
    })

    it('inits with #pswpOptionsValue', async () => {
      const controller = findController(
        application,
        '#gallery--drei',
        'custom-lightbox'
      )
      const options = controller.lightbox.options
      expect(options.gallery).to.equal('#gallery--drei')
      expect(options.children).to.equal('a')
      expect(options.showHideAnimationType).to.equal('fade')

      click('#gallery--drei a')
      await aTimeout(1000)
      const data = controller.lightbox.pswp.currSlide.data
      expect(data.src).to.equal(
        'https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-2500.jpg'
      )

      expect(controller.beforeOpenHandlerInvoked).to.equal(true)
      expect(controller.numItemsFilterInvoked).to.equal(true)
      expect(controller.numItemsFilterArgsNumItems).to.equal(1)
    })
  })
})
