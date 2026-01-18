<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
    <!-- Niveau 3 : Détail du dossier -->
    <DossierPortailClient v-if="selectedDossierId" :dossier-id="selectedDossierId" @back="selectedDossierId = null" />
    
    <!-- Niveau 2 : Vue du bien (liste des dossiers) -->
    <PropertyView v-else-if="selectedPropertyId" 
      :property-id="selectedPropertyId" 
      @back="selectedPropertyId = null"
      @open-dossier="selectedDossierId = $event" />
    
    <!-- Niveau 1 : Dashboard principal -->
    <div v-else class="max-w-7xl mx-auto px-4 py-6">
      <header class="bg-gradient-to-r from-primary to-emerald-600 rounded-2xl p-6 text-white shadow-xl mb-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs mb-2">
              <span class="w-2 h-2 rounded-full bg-emerald-300" />
              {{ viewMode === 'appointments' ? 'Tableau de bord' : 'Espace client' }} · Mon état des lieux
            </div>
            <h1 class="text-2xl md:text-3xl font-bold">Bienvenue, Luc !</h1>
            <p class="text-sm opacity-90 mt-1">
              {{ viewMode === 'appointments' ? 'Gérez vos rendez-vous et dossiers en un seul endroit' : 'Retrouvez tous vos biens et états des lieux' }}
            </p>
          </div>
          <div class="flex gap-3">
            <div class="bg-white/20 rounded-xl px-4 py-3 text-center min-w-[70px]">
              <div class="text-2xl font-bold">{{ appointments.length }}</div>
              <div class="text-xs opacity-90">RDV total</div>
            </div>
            <div class="bg-white/20 rounded-xl px-4 py-3 text-center min-w-[70px]">
              <div class="text-2xl font-bold">{{ properties.length }}</div>
              <div class="text-xs opacity-90">Biens</div>
            </div>
          </div>
        </div>
      </header>

      <div class="flex items-center justify-between mb-6">
        <p class="text-sm text-gray-600">Sélectionnez votre vue</p>
        <div class="inline-flex bg-white rounded-full p-1 shadow-md border">
          <button @click="viewMode = 'appointments'" :class="viewMode === 'appointments' ? 'bg-primary text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'" class="px-6 py-2.5 rounded-full transition text-sm font-medium inline-flex items-center gap-2">
            <Calendar class="w-4 h-4" />
            Mes rendez-vous
            <span :class="viewMode === 'appointments' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'" class="px-2 py-0.5 rounded-full text-xs font-bold">{{ appointments.length }}</span>
          </button>
          <button @click="viewMode = 'properties'" :class="viewMode === 'properties' ? 'bg-primary text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'" class="px-6 py-2.5 rounded-full transition text-sm font-medium inline-flex items-center gap-2">
            <FolderOpen class="w-4 h-4" />
            Mes biens
            <span :class="viewMode === 'properties' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'" class="px-2 py-0.5 rounded-full text-xs font-bold">{{ properties.length }}</span>
          </button>
        </div>
      </div>

      <AppointmentsView v-if="viewMode === 'appointments'" :appointments="appointments" :properties="properties" @link="openLinkModal" @open-property="selectedPropertyId = $event" />
      <PropertiesView v-else :properties="properties" :appointments="appointments" @open="selectedPropertyId = $event" />
    </div>

    <LinkModal v-if="showLinkModal" :appointment-id="linkingAppointmentId" :properties="properties" :current-property-id="currentPropertyId" @close="showLinkModal = false" @confirm="handleLinkConfirm" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useData } from '../composables/useData'
import { Calendar, FolderOpen } from 'lucide-vue-next'
import AppointmentsView from './AppointmentsView.vue'
import PropertiesView from './PropertiesView.vue'
import PropertyView from './PropertyView.vue'
import DossierPortailClient from './DossierPortailClient.vue'
import LinkModal from './LinkModal.vue'

const { properties, appointments, linkAppointment } = useData()
const viewMode = ref('appointments')
const selectedPropertyId = ref(null)
const selectedDossierId = ref(null)
const showLinkModal = ref(false)
const linkingAppointmentId = ref(null)

const currentPropertyId = computed(() => {
  const apt = appointments.value.find(a => a.id === linkingAppointmentId.value)
  return apt?.propertyId || null
})

function openLinkModal(aptId) {
  linkingAppointmentId.value = aptId
  showLinkModal.value = true
}

function handleLinkConfirm(propId) {
  linkAppointment(linkingAppointmentId.value, propId)
  showLinkModal.value = false
  linkingAppointmentId.value = null
}
</script>
