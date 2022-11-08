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
      element: this.element,
      photoswipe: this.pswpOptionsValue
    }).lightbox
  }
}
