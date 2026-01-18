<template>
  <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-5 border border-gray-100 hover:-translate-y-1 relative">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-2">
        <Calendar class="w-4 h-4 text-primary" />
        <h4 class="font-semibold text-sm">{{ appointment.reference }}</h4>
      </div>
      <span :class="statusClass" class="text-xs px-2 py-1 rounded-full border font-medium">{{ appointment.statut }}</span>
    </div>

    <div class="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
      <Clock class="w-3.5 h-3.5" />
      {{ formatDate(appointment.date) }} à {{ appointment.heure }}
    </div>

    <div class="mb-3">
      <span :class="typeClass" class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border">
        <component :is="typeIcon" class="w-3 h-3" />
        {{ appointment.type }}
      </span>
    </div>

    <div class="flex items-center gap-2 text-xs text-gray-600 mb-3">
      <User class="w-3.5 h-3.5" />
      <span class="font-medium">{{ appointment.client }}</span>
    </div>

    <div v-if="isPast" class="mb-3">
      <span class="inline-flex items-center gap-1 bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded-full border border-gray-200">
        <Clock class="w-3 h-3" />
        Passé
      </span>
    </div>

    <div v-if="appointment.propertyId" class="mb-3">
      <button @click.stop="$emit('open-property', appointment.propertyId)" class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs px-2 py-1 rounded-full border border-emerald-200 transition">
        <Home class="w-3 h-3" />
        Lié à un bien
      </button>
    </div>

    <button v-if="!appointment.propertyId" @click.stop="$emit('link')" class="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition text-sm font-medium flex items-center justify-center gap-2">
      <Link2 class="w-4 h-4" />
      Lier à un bien
    </button>
    <button v-else @click.stop="$emit('open-property', appointment.propertyId)" class="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition text-sm font-medium flex items-center justify-center gap-2">
      Voir les RDV du bien
      <ChevronRight class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Calendar, Clock, User, Link2, Home, ChevronRight, LogOut, Search, FileText, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps({ appointment: Object })
defineEmits(['link', 'open-property'])

const isPast = computed(() => new Date(props.appointment.date) < new Date())

const statusClass = computed(() => {
  const s = props.appointment.statut
  if (s === 'En cours') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  if (s === 'En attente') return 'bg-amber-50 text-amber-700 border-amber-100'
  return 'bg-gray-50 text-gray-700 border-gray-200'
})

const typeClass = computed(() => {
  const t = props.appointment.type
  if (t === 'Entrée') return 'bg-emerald-50 text-emerald-800 border-emerald-100'
  if (t === 'Sortie') return 'bg-rose-50 text-rose-800 border-rose-100'
  if (t === 'Expertise' || t === 'Compétence') return 'bg-sky-50 text-sky-800 border-sky-100'
  if (t === 'Avant travaux') return 'bg-indigo-50 text-indigo-800 border-indigo-100'
  return 'bg-violet-50 text-violet-800 border-violet-100'
})

const typeIcon = computed(() => {
  const t = props.appointment.type
  if (t === 'Entrée') return Home
  if (t === 'Sortie') return LogOut
  if (t === 'Expertise' || t === 'Compétence') return Search
  if (t === 'Avant travaux') return FileText
  return CheckCircle2
})

const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-BE')
</script>
