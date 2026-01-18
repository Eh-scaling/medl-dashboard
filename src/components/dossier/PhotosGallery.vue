<template>
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <Images class="w-5 h-5 text-primary" />
        <h2 class="font-bold">Photos du dossier ({{ photos.length }})</h2>
      </div>
      <select v-model="pageSize" class="px-3 py-2 text-sm border rounded-lg bg-white">
        <option :value="24">24 par page</option>
        <option :value="48">48 par page</option>
        <option :value="96">96 par page</option>
      </select>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <button v-for="photo in paginatedPhotos" :key="photo.id" @click="$emit('open', photo)" class="relative overflow-hidden rounded-lg border hover:shadow-lg transition group">
        <img :src="photo.url" :alt="photo.label" class="w-full h-36 object-cover group-hover:scale-105 transition" loading="lazy" />
        <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent text-white p-2 text-xs flex items-center gap-1">
          <Images class="w-3 h-3" />
          {{ photo.label }}
        </div>
      </button>
    </div>

    <div v-if="totalPages > 1" class="flex items-center justify-between text-sm">
      <span class="text-gray-600">Page {{ currentPage }} / {{ totalPages }}</span>
      <div class="flex gap-2">
        <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Précédent</button>
        <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Suivant</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Images } from 'lucide-vue-next'

const props = defineProps({ photos: Array })
defineEmits(['open'])

const currentPage = ref(1)
const pageSize = ref(24)

const totalPages = computed(() => Math.ceil(props.photos.length / pageSize.value))
const paginatedPhotos = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return props.photos.slice(start, start + pageSize.value)
})
</script>
