import { Controller } from '@hotwired/stimulus'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import { usePhotoSwipe } from './use-photoswipe'

export class PhotoSwipeController extends Controller {
  lightbox?: PhotoSwipeLightbox

  // @ts-expect-error Stimulus automatically generates getter, setter, and
  // existential properties for each value defined in a controller.
  pswpOptionsValue: object
  static values = {
    pswpOptions: Object
  }

  connect(): void {
    this.lightbox = usePhotoSwipe(this, {
      element: this.element as HTMLElement,
      photoswipe: this.pswpOptionsValue
    }).lightbox
  }

  loadAndOpen(e: Event): void {
    const currentTarget = e.currentTarget as HTMLElement
    const slideIndex = currentTarget.dataset.pswpSlideIndex ?? '0'
    this.lightbox?.loadAndOpen(parseInt(slideIndex), {
      gallery: this.element as HTMLElement
    })
  }
}
