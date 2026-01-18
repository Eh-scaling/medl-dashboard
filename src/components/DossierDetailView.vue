<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <button @click="$emit('back')" class="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:bg-gray-50 transition mb-4">
        <ChevronLeft class="w-4 h-4" />
        Retour aux dossiers du bien
      </button>

      <nav class="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <Home class="w-4 h-4" />
        <span>/</span>
        <span class="truncate max-w-[200px]">{{ dossier?.adresse }}</span>
        <span>/</span>
        <span class="font-medium text-gray-900">{{ dossier?.reference }}</span>
      </nav>

      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold mb-2">{{ dossier?.reference }}</h1>
            <p class="text-gray-600">{{ dossier?.adresse }}</p>
          </div>
          <span :class="statusClass" class="px-3 py-1 rounded-full text-sm font-medium border">{{ dossier?.statut }}</span>
        </div>

        <div class="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p class="text-gray-500 mb-1">Locataire</p>
            <p class="font-medium">{{ dossier?.locataire }}</p>
          </div>
          <div>
            <p class="text-gray-500 mb-1">Bailleur</p>
            <p class="font-medium">{{ dossier?.bailleur }}</p>
          </div>
          <div>
            <p class="text-gray-500 mb-1">Date de création</p>
            <p class="font-medium">{{ formatDate(dossier?.dateCreation) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="border-b">
          <div class="flex items-center gap-1 p-2">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'" class="px-4 py-2.5 rounded-lg transition text-sm font-medium inline-flex items-center gap-2">
              <component :is="tab.icon" class="w-4 h-4" />
              {{ tab.label }}
              <span v-if="tab.badge" :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'" class="px-2 py-0.5 rounded-full text-xs font-bold">{{ tab.badge }}</span>
            </button>
          </div>
        </div>

        <div class="p-6">
          <DocumentsTab v-if="activeTab === 'documents'" :dossier-id="dossierId" @sign="showSignModal = true" />
          <PhotosTab v-else-if="activeTab === 'photos'" :dossier-id="dossierId" />
          <RemarquesTab v-else-if="activeTab === 'remarques'" :dossier-id="dossierId" />
        </div>
      </div>
    </div>

    <SignModal v-if="showSignModal" @close="showSignModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronLeft, Home, FileText, Images, MessageSquare } from 'lucide-vue-next'
import DocumentsTab from './tabs/DocumentsTab.vue'
import PhotosTab from './tabs/PhotosTab.vue'
import RemarquesTab from './tabs/RemarquesTab.vue'
import SignModal from './SignModal.vue'

const props = defineProps({ dossierId: String })
defineEmits(['back'])

const activeTab = ref('documents')
const showSignModal = ref(false)
const dossier = ref(null)

const tabs = [
  { id: 'documents', label: 'Documents', icon: FileText, badge: 3 },
  { id: 'photos', label: 'Photos', icon: Images, badge: 120 },
  { id: 'remarques', label: 'Remarques', icon: MessageSquare, badge: 2 }
]

const statusClass = computed(() => {
  const s = dossier.value?.statut
  if (s === 'En cours') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  if (s === 'En attente') return 'bg-amber-50 text-amber-700 border-amber-100'
  return 'bg-gray-50 text-gray-700 border-gray-200'
})

onMounted(async () => {
  dossier.value = {
    id: props.dossierId,
    reference: 'EDL-2025-000001',
    adresse: 'Rue Exemple 12, 1000 Bruxelles',
    locataire: 'Dupont Marie',
    bailleur: 'Immo Atlas',
    statut: 'En cours',
    dateCreation: new Date().toISOString()
  }
})

const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('fr-BE', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
</script>
