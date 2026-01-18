<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-primary/10 to-emerald-100 rounded-2xl p-5">
      <h3 class="text-lg font-bold text-gray-900">Bienvenue, Luc !</h3>
      <p class="text-sm text-gray-700 mt-1">Retrouvez tous vos biens, vos états des lieux et documents importants au même endroit.</p>
    </div>

    <div class="grid md:grid-cols-3 gap-4">
      <div v-for="k in kpis" :key="k.label" class="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div class="flex items-center gap-2 text-xs text-gray-600 mb-2">
          <component :is="k.icon" class="w-4 h-4" />
          {{ k.label }}
        </div>
        <div class="text-3xl font-bold">{{ k.value }}</div>
        <p class="text-xs text-gray-500 mt-1">{{ k.subtitle }}</p>
      </div>
    </div>

    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div class="w-full md:max-w-md">
        <label class="text-xs font-medium text-gray-600 mb-1 block">Rechercher un bien</label>
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input v-model="search" placeholder="Adresse, ville, région, bailleur..." class="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2 text-xs text-gray-600">
          <Filter class="w-3.5 h-3.5" />
          Filtrer par région
        </div>
        <div class="inline-flex bg-white rounded-full p-1 shadow-sm border">
          <button v-for="r in ['Toutes', 'Bruxelles', 'Wallonie', 'Flandre']" :key="r" @click="regionFilter = r" :class="regionFilter === r ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'" class="px-3 py-1 text-xs rounded-full transition">{{ r }}</button>
        </div>
        <p class="text-xs text-gray-500 text-right">{{ filtered.length }} bien(s) trouvé(s)</p>
      </div>
    </div>

    <div v-if="filtered.length === 0" class="bg-white rounded-2xl border-2 border-dashed p-12 text-center">
      <Home class="w-8 h-8 mx-auto mb-3 text-gray-400" />
      <p class="text-gray-500">Aucun bien trouvé</p>
    </div>

    <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      <PropertyCard v-for="p in filtered" :key="p.id" :property="p" :appointments="appointments" @click="$emit('open', p.id)" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Home, FolderOpen, FileText, Search, Filter } from 'lucide-vue-next'
import PropertyCard from './PropertyCard.vue'

const props = defineProps({ properties: Array, appointments: Array })
defineEmits(['open'])

const search = ref('')
const regionFilter = ref('Toutes')

const kpis = computed(() => [
  { label: 'Biens suivis', value: props.properties.length, subtitle: 'Nombre total de biens dans votre espace', icon: Home },
  { label: 'États des lieux en cours', value: props.properties.reduce((acc, p) => acc + p.dossiers.filter(d => d.statut === 'En cours').length, 0), subtitle: 'Dossiers en cours de traitement', icon: FolderOpen },
  { label: 'Dossiers clôturés', value: props.properties.reduce((acc, p) => acc + p.dossiers.filter(d => d.statut === 'Clôturé').length, 0), subtitle: 'Dossiers finalisés, disponibles en PDF', icon: FileText }
])

const filtered = computed(() => {
  let list = [...props.properties]

  if (regionFilter.value !== 'Toutes') list = list.filter(p => p.region === regionFilter.value)

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(p => 
      p.adresse.toLowerCase().includes(q) || 
      p.ville.toLowerCase().includes(q) || 
      p.bailleur.toLowerCase().includes(q)
    )
  }

  return list
})
</script>
