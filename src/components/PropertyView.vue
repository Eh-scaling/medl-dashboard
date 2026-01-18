<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
    <div class="max-w-6xl mx-auto px-4 py-6">
      <button @click="$emit('back')" class="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:bg-gray-50 transition mb-6">
        <ChevronLeft class="w-4 h-4" />
        Retour au tableau de bord
      </button>

      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
        <div class="flex items-center gap-3 mb-3">
          <Home class="w-6 h-6 text-primary" />
          <h2 class="text-2xl font-bold">{{ property?.adresse }}</h2>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin class="w-4 h-4" />
          {{ property?.ville }} · {{ property?.region }}
        </div>
        <div class="text-sm text-gray-600">
          Bailleur : <span class="font-medium">{{ property?.bailleur }}</span>
        </div>
      </div>

      <h2 class="text-xl font-bold mb-4">Rendez-vous / dossiers réalisés</h2>

      <div v-if="property?.dossiers.length === 0" class="bg-white rounded-2xl border-2 border-dashed p-12 text-center">
        <FolderOpen class="w-8 h-8 mx-auto mb-3 text-gray-400" />
        <p class="text-gray-500">Aucun dossier pour ce bien</p>
      </div>

      <div v-else class="grid md:grid-cols-2 gap-4">
        <div v-for="d in property?.dossiers" :key="d.id" class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-5 border border-gray-100 hover:-translate-y-1">
          <div class="bg-gradient-to-r from-primary/10 to-transparent rounded-lg p-3 mb-3">
            <h3 class="font-bold text-base">{{ d.reference }}</h3>
          </div>

          <div class="space-y-2 text-sm mb-4">
            <div class="flex items-center gap-2">
              <MapPin class="w-3.5 h-3.5 text-gray-500" />
              {{ d.adresse }} · {{ d.ville }} ({{ d.region }})
            </div>
            <div class="flex items-center gap-2">
              <User class="w-3.5 h-3.5 text-gray-500" />
              {{ d.locataire }} · {{ d.bailleur }}
            </div>
            <div>
              <span :class="statusClass(d.statut)" class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border">
                {{ d.statut }}
              </span>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="inline-flex items-center gap-1">
                <FileText class="w-3.5 h-3.5" />
                {{ d.docs }} doc(s)
              </span>
              <span class="inline-flex items-center gap-1">
                <Images class="w-3.5 h-3.5" />
                {{ d.photos }} photo(s)
              </span>
              <span v-if="d.remarques > 0" class="inline-flex items-center gap-1 text-amber-700">
                <MessageSquare class="w-3.5 h-3.5" />
                {{ d.remarques }} remarque(s)
              </span>
            </div>
            <div class="text-xs text-gray-500">
              Dernière mise à jour : {{ formatDate(d.maj) }}
            </div>
          </div>

          <button @click="$emit('open-dossier', d.id)" class="w-full bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-emerald-600 transition font-medium text-sm">
            Ouvrir l'aperçu du dossier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from '../composables/useData'
import { ChevronLeft, Home, MapPin, FolderOpen, FileText, Images, MessageSquare, User } from 'lucide-vue-next'

const props = defineProps({ propertyId: String })
defineEmits(['back', 'open-dossier'])

const { properties } = useData()

const property = computed(() => properties.value.find(p => p.id === props.propertyId))

const statusClass = (statut) => {
  if (statut === 'En cours') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  if (statut === 'En attente') return 'bg-amber-50 text-amber-700 border-amber-100'
  return 'bg-gray-50 text-gray-700 border-gray-200'
}

const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
</script>
