<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Photos ({{ photos.length }})</h3>
      <div class="flex items-center gap-2">
        <select v-model="photosPerPage" class="px-3 py-2 text-sm border rounded-lg bg-white">
          <option :value="20">20 par page</option>
          <option :value="50">50 par page</option>
          <option :value="100">100 par page</option>
        </select>
        <button class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition text-sm">
          <Download class="w-4 h-4" />
          Télécharger tout
        </button>
      </div>
    </div>

    <div v-if="photos.length === 0" class="text-center py-12 text-gray-500">
      <Images class="w-8 h-8 mx-auto mb-3 text-gray-400" />
      <p>Aucune photo disponible</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="photo in paginatedPhotos" :key="photo.id" @click="selectedPhoto = photo" class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition">
          <img :src="photo.url" :alt="photo.label" class="w-full h-full object-cover" />
        </div>
      </div>

      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
        <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          Précédent
        </button>
        <span class="text-sm text-gray-600">Page {{ currentPage }} / {{ totalPages }}</span>
        <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
          Suivant
        </button>
      </div>
    </div>

    <div v-if="selectedPhoto" @click="selectedPhoto = null" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <button @click.stop="selectedPhoto = null" class="absolute top-4 right-4 text-white hover:text-gray-300">
        <X class="w-8 h-8" />
      </button>
      <img :src="selectedPhoto.url" :alt="selectedPhoto.label" class="max-w-full max-h-full object-contain" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Images, Download, X } from 'lucide-vue-next'

const props = defineProps({ dossierId: String })

const photos = ref([])
const currentPage = ref(1)
const photosPerPage = ref(20)
const selectedPhoto = ref(null)

const totalPages = computed(() => Math.ceil(photos.value.length / photosPerPage.value))

const paginatedPhotos = computed(() => {
  const start = (currentPage.value - 1) * photosPerPage.value
  return photos.value.slice(start, start + photosPerPage.value)
})

onMounted(async () => {
  photos.value = Array.from({ length: 120 }).map((_, i) => ({
    id: `img_${i + 1}`,
    label: `Photo ${i + 1}`,
    url: `https://picsum.photos/seed/edl_${i + 1}/400/400`
  }))
})
</script>
