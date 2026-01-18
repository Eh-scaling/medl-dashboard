<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
      <div class="bg-gradient-to-r from-primary/10 to-emerald-100 p-5 flex items-center gap-3">
        <Link2 class="w-6 h-6 text-primary" />
        <div>
          <h3 class="text-lg font-bold text-gray-900">Lier le rendez-vous à un bien</h3>
          <p class="text-sm text-gray-700">Associez ce RDV à une propriété existante</p>
        </div>
      </div>

      <div class="p-5 space-y-4 overflow-y-auto flex-1">
        <div class="bg-sky-50 border border-sky-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle class="w-5 h-5 text-sky-700 mt-0.5" />
          <div class="text-xs text-sky-900">
            <p class="font-semibold mb-1">💡 Conseil</p>
            <p>Liez ce rendez-vous à un bien pour faciliter le suivi. Vous pourrez consulter tous les RDV d'une propriété depuis la vue "Dossiers". Si aucun bien ne correspond, vous pouvez laisser ce RDV non lié.</p>
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700 mb-2 block">Rechercher un bien</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input v-model="search" placeholder="Adresse, ville, région, bailleur..." class="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm" />
          </div>
          <p class="text-xs text-gray-500 mt-1">{{ filtered.length }} bien(s) trouvé(s)</p>
        </div>

        <div v-if="selectedProperty" class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-emerald-700" />
              <span class="text-sm font-semibold text-emerald-900">Bien sélectionné</span>
            </div>
          </div>
          <div class="flex items-center gap-2 mb-1">
            <Home class="w-4 h-4 text-emerald-700" />
            <span class="text-sm font-semibold text-emerald-900">{{ selectedProperty.adresse }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-emerald-800">
            <MapPin class="w-3.5 h-3.5" />
            {{ selectedProperty.ville }} · {{ selectedProperty.region }}
          </div>
          <div class="text-xs text-emerald-800 mt-1">
            Bailleur : <span class="font-medium">{{ selectedProperty.bailleur }}</span>
          </div>
          <div class="text-xs text-emerald-800 mt-1">
            {{ selectedProperty.dossiers.length }} dossier(s)
          </div>
        </div>

        <div class="space-y-2 max-h-[300px] overflow-y-auto">
          <div v-for="p in filtered" :key="p.id" @click="selectedProperty = p" :class="selectedProperty?.id === p.id ? 'bg-emerald-50 border-emerald-300' : 'bg-white hover:bg-gray-50'" class="border rounded-lg p-4 cursor-pointer transition">
            <div class="flex items-center gap-2 mb-1">
              <Home class="w-4 h-4 text-primary" />
              <span class="text-sm font-semibold text-gray-900">{{ p.adresse }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-600">
              <MapPin class="w-3.5 h-3.5" />
              {{ p.ville }} · {{ p.region }}
            </div>
            <div class="text-xs text-gray-600 mt-1">
              Bailleur : {{ p.bailleur }}
            </div>
            <div class="text-xs text-emerald-700 mt-1">
              {{ p.dossiers.length }} dossier(s)
            </div>
          </div>
        </div>

        <div v-if="filtered.length === 0" class="bg-white rounded-lg border-2 border-dashed p-8 text-center">
          <Home class="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p class="text-sm text-gray-500">Aucun bien trouvé</p>
        </div>
      </div>

      <div class="border-t p-5 flex items-center justify-between bg-gray-50">
        <button @click="selectedProperty = null; $emit('confirm', null)" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
          <AlertCircle class="w-4 h-4" />
          Ne pas lier
        </button>
        <div class="flex gap-2">
          <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition">Annuler</button>
          <button @click="$emit('confirm', selectedProperty?.id || null)" :disabled="!selectedProperty" :class="selectedProperty ? 'bg-primary text-white hover:bg-emerald-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'" class="px-4 py-2 text-sm font-medium rounded-lg transition inline-flex items-center gap-2">
            <Link2 class="w-4 h-4" />
            Confirmer la liaison
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Link2, Search, Home, MapPin, AlertCircle, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps({ appointmentId: String, properties: Array, currentPropertyId: String })
defineEmits(['close', 'confirm'])

const search = ref('')
const selectedProperty = ref(props.currentPropertyId ? props.properties.find(p => p.id === props.currentPropertyId) : null)

const filtered = computed(() => {
  if (!search.value.trim()) return props.properties

  const q = search.value.toLowerCase()
  return props.properties.filter(p => 
    p.adresse.toLowerCase().includes(q) || 
    p.ville.toLowerCase().includes(q) || 
    p.bailleur.toLowerCase().includes(q)
  )
})
</script>
