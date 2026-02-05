import { createApp } from 'vue'
import ImageGallery from './components/ImageGallery.vue'

// Create app and register component globally
const app = createApp({})
app.component('image-gallery', ImageGallery)

// Mount app
app.mount('#app')

// Rough animation on the twos (hover only)
document.addEventListener('DOMContentLoaded', () => {
    const filters = ['rough-1', 'rough-2', 'rough-3', 'rough-4']

    // Find all elements that have rough-animate in their class (including hover:rough-animate)
    const elements = document.querySelectorAll('[class*="rough-animate"]')

    elements.forEach(el => {
        let frameIndex = 0
        let intervalId = null

        el.addEventListener('mouseenter', () => {
            if (intervalId) return

            intervalId = setInterval(() => {
                frameIndex = (frameIndex + 1) % filters.length
                el.style.filter = `url(#${filters[frameIndex]})`
            }, 166) // ~166ms = 6fps effective (animation on the twos)
        })

        el.addEventListener('mouseleave', () => {
            if (intervalId) {
                clearInterval(intervalId)
                intervalId = null
                el.style.filter = '' // Reset to default
            }
        })
    })
})
