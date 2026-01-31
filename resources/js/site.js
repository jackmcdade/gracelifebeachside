import { createApp } from 'vue'
import ImageGallery from './components/ImageGallery.vue'

// Create app and register component globally
const app = createApp({})
app.component('image-gallery', ImageGallery)

// Mount app
app.mount('#app')
