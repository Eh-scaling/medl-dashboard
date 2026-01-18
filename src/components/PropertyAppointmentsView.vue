<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <button @click="$emit('back')" class="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:bg-gray-50 transition">
        <ChevronLeft class="w-4 h-4" />
        Retour
      </button>

      <div class="inline-flex bg-white rounded-full p-1 shadow-md border">
        <button @click="showDossiers = false" :class="!showDossiers ? 'bg-primary text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'" class="px-6 py-2.5 rounded-full transition text-sm font-medium inline-flex items-center gap-2">
          <Calendar class="w-4 h-4" />
          Rendez-vous du bien
        </button>
        <button @click="showDossiers = true" :class="showDossiers ? 'bg-primary text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'" class="px-6 py-2.5 rounded-full transition text-sm font-medium inline-flex items-center gap-2">
          <FolderOpen class="w-4 h-4" />
          Dossiers du bien
        </button>
      </div>
    </div>

    <DossiersListView v-if="showDossiers" :property-id="propertyId" @back="showDossiers = false" @open-dossier="$emit('open-dossier', $event)" />

    <div v-else>
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
      <div class="flex items-center gap-3 mb-3">
        <Home class="w-6 h-6 text-primary" />
        <h2 class="text-2xl font-bold">{{ property?.adresse }}</h2>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <MapPin class="w-4 h-4" />
        {{ property?.ville }} · {{ property?.region }}
      </div>
      <div class="text-sm text-gray-600 mb-4">
        Bailleur : <span class="font-medium">{{ property?.bailleur }}</span>
      </div>
      <div class="flex gap-3 text-xs">
        <span class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
          <Calendar class="w-3 h-3" />
          {{ stats.total }} RDV
        </span>
        <span class="inline-flex items-center gap-1 bg-sky-50 text-sky-700 px-3 py-1 rounded-full border border-sky-100">
          {{ stats.enCours }} en cours
        </span>
        <span class="inline-flex items-center gap-1 bg-gray-50 text-gray-700 px-3 py-1 rounded-full border border-gray-100">
          {{ stats.clotures }} clôturés
        </span>
      </div>
    </div>

    <div class="mb-6 space-y-4">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input v-model="search" placeholder="Rechercher..." class="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
      </div>

      <div class="flex flex-wrap gap-2">
        <button v-for="s in ['Tous', 'En cours', 'En attente', 'Clôturé']" :key="s" @click="statusFilter = s" :class="statusFilter === s ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'" class="px-3 py-1.5 text-xs rounded-full border transition">{{ s }}</button>
      </div>

      <div class="flex flex-wrap gap-2">
        <button v-for="t in ['Tous', 'Entrée', 'Sortie', 'Expertise', 'Avant travaux', 'Après travaux']" :key="t" @click="typeFilter = t" :class="typeFilter === t ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'" class="px-3 py-1.5 text-xs rounded-full border transition">{{ t }}</button>
      </div>
    </div>

    <div v-if="filteredAppointments.length === 0" class="bg-white rounded-2xl border-2 border-dashed p-12 text-center">
      <Calendar class="w-8 h-8 mx-auto mb-3 text-gray-400" />
      <p class="text-gray-500">Aucun rendez-vous trouvé</p>
    </div>

    <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      <AppointmentCard v-for="apt in filteredAppointments" :key="apt.id" :appointment="apt" />
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useData } from '../composables/useData'
import { ChevronLeft, Home, MapPin, Calendar, Search, FolderOpen } from 'lucide-vue-next'
import AppointmentCard from './AppointmentCard.vue'
import DossiersListView from './DossiersListView.vue'

const props = defineProps({ propertyId: String })
defineEmits(['back', 'open-dossier'])

const { properties, appointments } = useData()

const search = ref('')
const statusFilter = ref('Tous')
const typeFilter = ref('Tous')
const showDossiers = ref(false)

const property = computed(() => properties.value.find(p => p.id === props.propertyId))
const propertyAppointments = computed(() => appointments.value.filter(a => a.propertyId === props.propertyId))

const stats = computed(() => ({
  total: propertyAppointments.value.length,
  enCours: propertyAppointments.value.filter(a => a.statut === 'En cours').length,
  clotures: propertyAppointments.value.filter(a => a.statut === 'Clôturé').length
}))

const filteredAppointments = computed(() => {
  let list = [...propertyAppointments.value]

  if (statusFilter.value !== 'Tous') list = list.filter(a => a.statut === statusFilter.value)
  if (typeFilter.value !== 'Tous') list = list.filter(a => a.type === typeFilter.value)

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(a => 
      a.reference.toLowerCase().includes(q) || 
      a.client.toLowerCase().includes(q)
    )
  }

  return list.sort((a, b) => new Date(a.date) - new Date(b.date))
})
</script>
