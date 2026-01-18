<template>
  <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-5 border border-gray-100">
    <div class="bg-gradient-to-r from-primary/10 to-transparent rounded-lg p-3 mb-3">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <component :is="docIcon" class="w-4 h-4 text-primary flex-shrink-0" />
          <h3 class="font-bold text-base truncate">{{ doc.label }}</h3>
        </div>
        <div class="flex flex-wrap gap-1 justify-end">
          <span v-if="isMain" class="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs font-medium uppercase">Principal</span>
          <span class="bg-gray-50 text-gray-600 border px-2 py-0.5 rounded text-xs uppercase">{{ typeLabel }}</span>
          <span v-if="doc.id === 'doc2'" class="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded text-xs font-medium uppercase">Signé</span>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <div class="text-xs text-gray-600">
        <span class="inline-flex items-center bg-gray-100 px-2 py-1 rounded-full">Taille : {{ doc.size }}</span>
      </div>

      <div class="flex flex-wrap gap-2">
        <button @click="$emit('preview', doc)" class="flex-1 px-3 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50 inline-flex items-center justify-center gap-2">
          <Eye class="w-4 h-4" />
          Voir
        </button>
        <button v-if="isPdf && doc.id !== 'doc2'" @click="$emit('sign')" class="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-emerald-600 inline-flex items-center justify-center gap-2">
          <FileSignature class="w-4 h-4" />
          Signer
        </button>
        <a :href="doc.url" download class="flex-1">
          <button class="w-full px-3 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50 inline-flex items-center justify-center gap-2">
            <Download class="w-4 h-4" />
            Télécharger
          </button>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FileText, Images, Download, Eye, FileSignature } from 'lucide-vue-next'

const props = defineProps({
  doc: Object,
  isMain: Boolean
})

defineEmits(['preview', 'sign'])

const isPdf = computed(() => props.doc.type === 'pdf')
const typeLabel = computed(() => {
  if (props.doc.type === 'pdf') return 'PDF'
  if (props.doc.type === 'image') return 'Image'
  return 'Fichier'
})
const docIcon = computed(() => {
  if (props.doc.type === 'pdf') return FileText
  if (props.doc.type === 'image') return Images
  return Download
})
</script>
