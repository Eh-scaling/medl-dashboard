<template>
  <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-5 border border-gray-100 hover:-translate-y-1 cursor-pointer">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-2">
        <Home class="w-5 h-5 text-primary" />
        <h3 class="font-semibold text-gray-900 text-sm">{{ property.adresse }}</h3>
      </div>
      <span :class="statusClass" class="text-xs px-2 py-1 rounded-full border font-medium">{{ property.statut }}</span>
    </div>

    <div class="text-sm text-gray-600 mb-3 flex items-center gap-1.5">
      <MapPin class="w-3.5 h-3.5" />
      {{ property.ville }} · {{ property.region }}
    </div>

    <div class="text-xs text-gray-500 mb-3">
      Locataire : <span class="font-medium">{{ property.dossiers[0]?.locataire || '—' }}</span>
    </div>

    <div class="text-xs text-gray-500 mb-3">
      Bailleur : <span class="font-medium">{{ property.bailleur }}</span>
    </div>

    <div class="flex items-center gap-2 mb-3">
      <span class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs px-2 py-1 rounded-full border border-emerald-100">
        <FolderOpen class="w-3.5 h-3.5" />
        {{ property.dossiers.length }} dossier(s)
      </span>
    </div>

    <div v-if="rdvBreakdown.total > 0" class="flex flex-wrap gap-2 text-xs mb-3">
      <span v-if="rdvBreakdown.entree" class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-1 rounded-full border border-emerald-100">
        <Home class="w-3 h-3" /> Entrée ({{ rdvBreakdown.entree }})
      </span>
      <span v-if="rdvBreakdown.sortie" class="inline-flex items-center gap-1 bg-rose-50 text-rose-800 px-2 py-1 rounded-full border border-rose-100">
        <LogOut class="w-3 h-3" /> Sortie ({{ rdvBreakdown.sortie }})
      </span>
      <span v-if="rdvBreakdown.expertise" class="inline-flex items-center gap-1 bg-sky-50 text-sky-800 px-2 py-1 rounded-full border border-sky-100">
        <Search class="w-3 h-3" /> Expertise ({{ rdvBreakdown.expertise }})
      </span>
      <span v-if="rdvBreakdown.avantTravaux" class="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 px-2 py-1 rounded-full border border-indigo-100">
        <FileText class="w-3 h-3" /> EDL avant travaux ({{ rdvBreakdown.avantTravaux }})
      </span>
      <span v-if="rdvBreakdown.apresTravaux" class="inline-flex items-center gap-1 bg-violet-50 text-violet-800 px-2 py-1 rounded-full border border-violet-100">
        <FileText class="w-3 h-3" /> EDL après travaux ({{ rdvBreakdown.apresTravaux }})
      </span>
    </div>

    <div class="text-xs text-gray-500 mb-3 flex items-center justify-between">
      <span>Dernier dossier : {{ property.dossiers[0]?.reference }}</span>
      <span>Maj : {{ formatDate(property.dossiers[0]?.maj) }}</span>
    </div>

    <button class="w-full bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-emerald-600 transition flex items-center justify-center gap-2 text-sm font-medium">
      Voir les rendez-vous du bien
      <ChevronRight class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Home, MapPin, FolderOpen, ChevronRight, LogOut, Search, FileText } from 'lucide-vue-next'

const props = defineProps({ property: Object, appointments: Array })

const statusClass = computed(() => {
  const s = props.property.statut
  if (s === 'En cours') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  if (s === 'En attente') return 'bg-amber-50 text-amber-700 border-amber-100'
  return 'bg-gray-50 text-gray-700 border-gray-200'
})

const rdvBreakdown = computed(() => {
  const apts = props.appointments.filter(a => a.propertyId === props.property.id)
  return {
    total: apts.length,
    entree: apts.filter(a => a.type === 'Entrée').length,
    sortie: apts.filter(a => a.type === 'Sortie').length,
    expertise: apts.filter(a => a.type === 'Expertise' || a.type === 'Compétence').length,
    avantTravaux: apts.filter(a => a.type === 'Avant travaux').length,
    apresTravaux: apts.filter(a => a.type === 'Après travaux').length
  }
})

const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('fr-BE') : '—'
</script>
