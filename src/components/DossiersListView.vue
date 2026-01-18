<template>
  <div class="space-y-6">
    <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div class="flex items-center gap-3 mb-3">
        <Home class="w-6 h-6 text-primary" />
        <h3 class="text-2xl font-bold">{{ property?.adresse }}</h3>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <MapPin class="w-4 h-4" />
        {{ property?.ville }} · {{ property?.region }}
      </div>
      <div class="text-sm text-gray-600">
        Bailleur : <span class="font-medium">{{ property?.bailleur }}</span>
      </div>
    </div>

    <div class="space-y-4">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input v-model="search" placeholder="Rechercher un dossier (référence, locataire...)" class="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" />
        </div>

        <div class="flex items-center gap-3">
          <div class="inline-flex items-center gap-2 bg-white rounded-lg border p-1">
            <button v-for="s in ['Tous', 'En cours', 'En attente', 'Clôturé']" :key="s" @click="statusFilter = s" :class="statusFilter === s ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'" class="px-3 py-1.5 text-xs rounded-md transition">{{ s }}</button>
          </div>

          <select v-model="sortBy" class="px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
            <option value="recent">Plus récent</option>
            <option value="reference">Par référence</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="filtered.length === 0" class="bg-white rounded-2xl border-2 border-dashed p-12 text-center">
      <FolderOpen class="w-8 h-8 mx-auto mb-3 text-gray-400" />
      <p class="text-gray-500">Aucun dossier trouvé</p>
    </div>

    <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      <DossierCard v-for="d in filtered" :key="d.id" :dossier="d" @click="$emit('open-dossier', d.id)" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useData } from '../composables/useData'
import { Home, MapPin, Search, FolderOpen } from 'lucide-vue-next'
import DossierCard from './DossierCard.vue'

const props = defineProps({ propertyId: String })
defineEmits(['back', 'open-dossier'])

const { properties } = useData()

const search = ref('')
const statusFilter = ref('Tous')
const sortBy = ref('recent')

const property = computed(() => properties.value.find(p => p.id === props.propertyId))

const filtered = computed(() => {
  const dossiers = property.value?.dossiers || []
  let list = [...dossiers]

  if (statusFilter.value !== 'Tous') {
    list = list.filter(d => d.statut === statusFilter.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(d => 
      d.reference.toLowerCase().includes(q) || 
      d.libelle.toLowerCase().includes(q) || 
      d.locataire.toLowerCase().includes(q)
    )
  }

  if (sortBy.value === 'recent') {
    list.sort((a, b) => new Date(b.maj) - new Date(a.maj))
  } else {
    list.sort((a, b) => a.reference.localeCompare(b.reference))
  }

  return list
})
</script>
