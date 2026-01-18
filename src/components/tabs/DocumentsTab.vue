<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Documents</h3>
      <button @click="$emit('sign')" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition text-sm">
        <FileSignature class="w-4 h-4" />
        Signer électroniquement (9.99€)
      </button>
    </div>

    <div v-if="documents.length === 0" class="text-center py-12 text-gray-500">
      <FileText class="w-8 h-8 mx-auto mb-3 text-gray-400" />
      <p>Aucun document disponible</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="doc in documents" :key="doc.id" class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition border border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText class="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p class="font-medium text-sm">{{ doc.label }}</p>
              <p class="text-xs text-gray-500">{{ doc.size }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="previewDoc(doc)" class="p-2 hover:bg-white rounded-lg transition">
              <Eye class="w-4 h-4 text-gray-600" />
            </button>
            <button @click="downloadDoc(doc)" class="p-2 hover:bg-white rounded-lg transition">
              <Download class="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FileText, FileSignature, Eye, Download } from 'lucide-vue-next'

const props = defineProps({ dossierId: String })
defineEmits(['sign'])

const documents = ref([])

onMounted(async () => {
  documents.value = [
    { id: 'doc1', label: 'État des lieux (PDF)', size: '2.4 Mo', url: '#' },
    { id: 'doc2', label: 'Ordre de mission signé', size: '680 Ko', url: '#' },
    { id: 'doc3', label: 'Archive photos (.zip)', size: '198 Mo', url: '#' }
  ]
})

const previewDoc = (doc) => {
  console.log('Preview:', doc)
}

const downloadDoc = (doc) => {
  console.log('Download:', doc)
}
</script>
