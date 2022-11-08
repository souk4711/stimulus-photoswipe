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

export interface Options {
  element?: Element
  photoswipe?: Partial<PhotoSwipeOptions>
  handlers?: Handlers
  filters?: Filters
}

export class UsePhotoSwipe {
  lightbox?: PhotoSwipe

  constructor(controller: Controller, options: Options) {
    let element = options.element
    if (element === undefined) {
      element = controller.element
    }

    // https://photoswipe.com/options/
    const pswpOptions = options.photoswipe
    const lightbox = new PhotoSwipeLightbox({
      // @ts-expect-error Allow use Element for the gallery element.
      gallery: element,
      children: 'a',
      pswpModule: PhotoSwipe,
      ...pswpOptions
    })

    // https://photoswipe.com/events/
    if (options.handlers !== undefined) {
      Object.entries(options.handlers).forEach(([eventName, handlers]) => {
        for (let i = 0; i < handlers.length; i++) {
          const handler = handlers[i].bind(controller)
          lightbox.on(eventName as keyof PhotoSwipeEventsMap, handler)
        }
      })
    }

    // https://photoswipe.com/filters/
    if (options.filters !== undefined) {
      Object.entries(options.filters).forEach(([eventName, filters]) => {
        for (let i = 0; i < filters.length; i++) {
          const filter = filters[i].bind(controller)
          lightbox.addFilter(eventName as keyof PhotoSwipeFiltersMap, filter)
        }
      })
    }

    // Initialize lightbox, should be called only once, it's not included in
    // the main constructor, so you may bind events before it.
    lightbox.init()
    this.lightbox = lightbox
  }

  destroy(): void {
    if (this.lightbox !== undefined) {
      this.lightbox.destroy()
      this.lightbox = undefined
    }
  }
}

export function usePhotoSwipe(
  controller: Controller,
  options: Options
): UsePhotoSwipe {
  const photoswipe = new UsePhotoSwipe(controller, options)

  const controllerDisconnect = controller.disconnect.bind(controller)
  Object.assign(controller, {
    disconnect() {
      controllerDisconnect()
      photoswipe.destroy()
    }
  })

  return photoswipe
}
