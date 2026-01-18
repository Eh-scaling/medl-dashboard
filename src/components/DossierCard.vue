<template>
  <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-5 border border-gray-100 hover:-translate-y-1 cursor-pointer">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-2">
        <FileText class="w-4 h-4 text-primary" />
        <h4 class="font-semibold text-sm">{{ dossier.reference }}</h4>
      </div>
      <span :class="statusClass" class="text-xs px-2 py-1 rounded-full border font-medium">{{ dossier.statut }}</span>
    </div>

    <p class="text-sm text-gray-700 mb-3 line-clamp-2">{{ dossier.libelle }}</p>

    <div class="space-y-2 text-xs text-gray-600 mb-3">
      <div class="flex items-center gap-2">
        <User class="w-3.5 h-3.5" />
        <span>Locataire : <span class="font-medium">{{ dossier.locataire }}</span></span>
      </div>
      <div class="flex items-center gap-2">
        <Building class="w-3.5 h-3.5" />
        <span>Bailleur : <span class="font-medium">{{ dossier.bailleur }}</span></span>
      </div>
    </div>

    <div class="flex items-center gap-3 mb-3 text-xs">
      <span class="inline-flex items-center gap-1 bg-sky-50 text-sky-700 px-2 py-1 rounded-full border border-sky-100">
        <FileText class="w-3 h-3" />
        {{ dossier.docs }} doc(s)
      </span>
      <span class="inline-flex items-center gap-1 bg-violet-50 text-violet-700 px-2 py-1 rounded-full border border-violet-100">
        <Images class="w-3 h-3" />
        {{ dossier.photos }} photo(s)
      </span>
      <span v-if="dossier.remarques > 0" class="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-100">
        <MessageSquare class="w-3 h-3" />
        {{ dossier.remarques }}
      </span>
    </div>

    <div class="text-xs text-gray-500 mb-3">
      Mis à jour : {{ formatDate(dossier.maj) }}
    </div>

    <button class="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition text-sm font-medium flex items-center justify-center gap-2">
      <Eye class="w-4 h-4" />
      Ouvrir le dossier
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FileText, User, Building, Images, MessageSquare, Eye } from 'lucide-vue-next'

const props = defineProps({ dossier: Object })

const statusClass = computed(() => {
  const s = props.dossier.statut
  if (s === 'En cours') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  if (s === 'En attente') return 'bg-amber-50 text-amber-700 border-amber-100'
  return 'bg-gray-50 text-gray-700 border-gray-200'
})

const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-BE', { dateStyle: 'medium', timeStyle: 'short' })
</script>
