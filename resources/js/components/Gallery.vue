<template>
    <div v-if="normalizedImages.length > 0" class="flex items-center justify-center gap-8 py-24 relative" style="display: flex; align-items: center; justify-content: center; gap: 2rem; padding: 6rem 0; position: relative;">
        <div
            v-for="(image, index) in normalizedImages"
            :key="index"
            class="gallery-image relative"
            :style="{
                transform: getTransform(index),
                zIndex: getZIndex(index),
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0s',
                position: 'relative'
            }"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave()"
        >
            <div
                class="rounded-3xl overflow-hidden -mx-10 transition-all duration-500"
                :class="isHovered(index) ? 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-4 ring-white/20' : 'shadow-2xl'"
                style="border-radius: 1.5rem; overflow: hidden; margin: 0 -2.5rem; transition: all 0.5s;"
            >
                <img
                    :src="image.url"
                    :alt="image.alt || ''"
                    class="rounded-3xl h-[400px] w-[240px] object-cover cursor-pointer transition-all duration-500"
                    :class="isHovered(index) ? 'brightness-105' : ''"
                    style="border-radius: 1.5rem; height: 400px; width: 240px; object-fit: cover; cursor: pointer; transition: all 0.5s;"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
    images: {
        type: [String, Array],
        required: true,
        default: () => []
    }
})

// Parse images from JSON string or use array directly
const parsedImages = computed(() => {
    if (Array.isArray(props.images)) {
        return props.images
    }
    try {
        return JSON.parse(props.images || '[]')
    } catch (e) {
        console.error('Failed to parse images:', e)
        return []
    }
})

// Normalize images to handle different formats from Statamic
const normalizedImages = computed(() => {
    if (!Array.isArray(parsedImages.value) || parsedImages.value.length === 0) {
        return []
    }

    return parsedImages.value.map(img => {
        // Handle Statamic asset objects - they might have url, path, or be a string
        let url = null
        if (typeof img === 'string') {
            url = img
        } else if (img && typeof img === 'object') {
            url = img.url || img.path || img.permalink || null
        }

        const alt = (img && typeof img === 'object') ? (img.alt || img.alt_text || '') : ''

        return { url, alt }
    }).filter(img => img.url) // Filter out any without URLs
})

const hoveredIndex = ref(null)
const baseRotations = ref([])
const baseShifts = ref([])

const rotations = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
const shifts = [-8, -6, -4, -2, 0, 2, 4, 6, 8]

onMounted(() => {
    normalizedImages.value.forEach(() => {
        baseRotations.value.push(rotations[Math.floor(Math.random() * rotations.length)])
        baseShifts.value.push(shifts[Math.floor(Math.random() * shifts.length)])
    })
})

const handleMouseEnter = (index) => {
    hoveredIndex.value = index
}

const handleMouseLeave = () => {
    hoveredIndex.value = null
}

const getTransform = (index) => {
    const baseRotation = baseRotations.value[index] || 0
    const baseShift = baseShifts.value[index] || 0

    if (hoveredIndex.value === null) {
        return `rotate(${baseRotation}deg) translateY(${baseShift}px)`
    }

    const hovered = hoveredIndex.value
    const distance = index - hovered
    const absDistance = Math.abs(distance)

    if (distance === 0) {
        return 'scale(1.15) translateY(-20px)'
    }

    const spread = absDistance * 60
    const direction = distance > 0 ? 1 : -1
    const rotation = direction * Math.min(absDistance * 2, 8)

    return `translateX(${direction * spread}px) rotate(${rotation}deg) scale(0.95)`
}

const getZIndex = (index) => {
    if (hoveredIndex.value === null) return 1
    return index === hoveredIndex.value ? 10 : 1
}

const isHovered = (index) => {
    return hoveredIndex.value === index
}
</script>
