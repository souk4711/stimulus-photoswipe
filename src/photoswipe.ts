import { Controller } from '@hotwired/stimulus'
import PhotoSwipe, {
  PhotoSwipeOptions,
  PhotoSwipeEventsMap,
  PhotoSwipeFiltersMap
} from 'photoswipe'
import PhotoSwipeLightbox from 'photoswipe/lightbox'

export type Func = any
export type Handlers = {
  [E in keyof PhotoSwipeEventsMap]: Func[]
}
export type Filters = {
  [E in keyof PhotoSwipeFiltersMap]: Func[]
}
export type ExtendedPhotoSwipeOptions = PhotoSwipeOptions & {
  handlers?: Handlers
  filters?: Filters
}

export class PhotoSwipeController extends Controller {
  lightbox?: PhotoSwipeLightbox

  // @ts-expect-error Stimulus automatically generates getter, setter, and
  // existential properties for each value defined in a controller.
  pswpOptionsValue: object
  static values = {
    pswpOptions: Object
  }

  connect(): void {
    // https://photoswipe.com/options/
    const pswpOptions = this.pswpOptions() as Partial<ExtendedPhotoSwipeOptions>
    const lightbox = new PhotoSwipeLightbox({
      // @ts-expect-error Allow use Element for the gallery element.
      gallery: this.element,
      children: 'a',
      pswpModule: PhotoSwipe,
      ...this.pswpOptionsValue,
      ...pswpOptions
    })

    // https://photoswipe.com/events/
    if (pswpOptions.handlers !== undefined) {
      Object.entries(pswpOptions.handlers).forEach(([eventName, handlers]) => {
        for (let i = 0; i < handlers.length; i++) {
          const handler = handlers[i].bind(this)
          lightbox.on(eventName as keyof PhotoSwipeEventsMap, handler)
        }
      })
    }

    // https://photoswipe.com/filters/
    if (pswpOptions.filters !== undefined) {
      Object.entries(pswpOptions.filters).forEach(([eventName, filters]) => {
        for (let i = 0; i < filters.length; i++) {
          const filter = filters[i].bind(this)
          lightbox.addFilter(eventName as keyof PhotoSwipeFiltersMap, filter)
        }
      })
    }

    // Initialize lightbox, should be called only once, it's not included in
    // the main constructor, so you may bind events before it.
    lightbox.init()
    this.lightbox = lightbox
  }

  disconnect(): void {
    if (this.lightbox !== undefined) {
      // Unbinds all events, closes PhotoSwipe if it's open
      this.lightbox.destroy()
      this.lightbox = undefined
    }
  }

  pswpOptions(): object {
    return {}
  }
}
