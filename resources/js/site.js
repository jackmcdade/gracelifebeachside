import { defineCustomElement } from 'vue'
import ImageGallery from './components/Gallery.vue'

// Convert Vue component to custom element
const ImageGalleryElement = defineCustomElement(ImageGallery)

// Register as custom element (both kebab-case and allow PascalCase in HTML)
customElements.define('image-gallery', ImageGalleryElement)
