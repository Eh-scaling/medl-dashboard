<template>
  <div @click="$emit('close')" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
    <div @click.stop class="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <div class="border-b p-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <component :is="docIcon" class="w-5 h-5 text-primary" />
          <h3 class="font-bold">{{ doc?.label }}</h3>
        </div>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-lg transition">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="flex-1 overflow-auto p-6">
        <!-- PDF -->
        <div v-if="doc?.type === 'pdf'" class="h-[60vh] rounded-lg overflow-hidden border">
          <iframe :src="doc.url" class="w-full h-full" :title="doc.label" />
        </div>

        <!-- Image -->
        <div v-else-if="doc?.type === 'image'" class="flex items-center justify-center">
          <img :src="doc.url" :alt="doc.label" class="max-h-[60vh] rounded-xl" />
        </div>

        <!-- Autre -->
        <div v-else class="text-sm text-gray-600 text-center py-12">
          Ce fichier n'est pas prévisualisable. Utilisez le bouton Télécharger.
        </div>
      </div>

      <div class="border-t p-4 flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Fermer</button>
        <button @click="$emit('download', doc)" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 inline-flex items-center gap-2">
          <Download class="w-4 h-4" />
          Télécharger
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FileText, Images, Download, X } from 'lucide-vue-next'

const props = defineProps({ doc: Object })
defineEmits(['close', 'download'])

const docIcon = computed(() => {
  if (props.doc?.type === 'pdf') return FileText
  if (props.doc?.type === 'image') return Images
  return Download
})
</script>
