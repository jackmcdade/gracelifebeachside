<template>
    <div v-if="normalizedImages.length > 0" class="flex items-center justify-center gap-8 py-24 relative">
        <div
            v-for="(image, index) in normalizedImages"
            :key="index"
            class="gallery-image relative"
            :style="{
                transform: getTransform(index),
                zIndex: getZIndex(index),
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), z-index 0s'
            }"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave()"
        >
            <div
                class="rounded-3xl overflow-hidden -mx-10 transition-all duration-500"
                :class="isHovered(index) ? 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ring-4 ring-white/20' : 'shadow-2xl'"
            >
                <img
                    :src="image.url"
                    :alt="image.alt || ''"
                    class="rounded-3xl object-cover cursor-pointer transition-all duration-500"
                    :class="[sizeClass, isHovered(index) ? 'brightness-105' : '']"
                />
            </div>
        </div>
    </div>
    <div ref="slotContainer" class="hidden">
        <slot />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
    orientation: {
        type: String,
        required: false,
        default: 'vertical'
    }
})

const sizeClass = computed(() => {
    return props.orientation === 'vertical' ? 'h-[400px] w-[240px]' : 'h-[240px] w-[400px]'
})

const slotContainer = ref(null)
const normalizedImages = ref([])
const hoveredIndex = ref(null)
const baseRotations = ref([])
const baseShifts = ref([])

const rotations = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
const shifts = [-8, -6, -4, -2, 0, 2, 4, 6, 8]

onMounted(() => {
    // Parse images from slot
    if (slotContainer.value) {
        const imgTags = slotContainer.value.querySelectorAll('img')
        normalizedImages.value = Array.from(imgTags).map(img => ({
            url: img.getAttribute('src') || '',
            alt: img.getAttribute('alt') || ''
        })).filter(img => img.url) // Filter out any images without a URL

        // Initialize rotations and shifts
        normalizedImages.value.forEach(() => {
            baseRotations.value.push(rotations[Math.floor(Math.random() * rotations.length)])
            baseShifts.value.push(shifts[Math.floor(Math.random() * shifts.length)])
        })
    }
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
