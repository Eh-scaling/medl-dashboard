<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-r from-primary/10 to-emerald-100 rounded-2xl p-5">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-gray-900">Bienvenue, Luc !</h3>
          <p class="text-sm text-gray-700 mt-1">Gérez vos rendez-vous d'état des lieux et suivez leur avancement en temps réel.</p>
        </div>
        <div class="flex gap-3">
          <div class="bg-white rounded-xl px-4 py-3 text-center min-w-[70px] shadow">
            <div class="text-2xl font-bold text-primary">{{ stats.today }}</div>
            <div class="text-xs text-gray-600">Aujourd'hui</div>
          </div>
          <div class="bg-white rounded-xl px-4 py-3 text-center min-w-[70px] shadow">
            <div class="text-2xl font-bold text-primary">{{ stats.week }}</div>
            <div class="text-xs text-gray-600">Cette semaine</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-4 gap-4">
      <div v-for="k in kpis" :key="k.label" class="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
        <div class="flex items-center gap-2 text-xs text-gray-600 mb-2">
          <component :is="k.icon" class="w-4 h-4" />
          {{ k.label }}
        </div>
        <div class="text-3xl font-bold">{{ k.value }}</div>
        <p class="text-xs text-gray-500 mt-1">{{ k.subtitle }}</p>
      </div>
    </div>

    <div class="space-y-4">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input v-model="search" placeholder="Rechercher (référence, client, type, notes...)" class="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
      </div>

      <div class="flex flex-wrap gap-2">
        <button v-for="s in ['Tous', 'En cours', 'En attente', 'Clôturé']" :key="s" @click="statusFilter = s" :class="statusFilter === s ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'" class="px-3 py-1.5 text-xs rounded-full border transition">{{ s }}</button>
      </div>

      <div class="flex flex-wrap gap-2">
        <button v-for="l in ['Tous', 'Liés', 'Non liés']" :key="l" @click="linkFilter = l" :class="linkFilter === l ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'" class="px-3 py-1.5 text-xs rounded-full border transition">{{ l }}</button>
      </div>

      <div class="flex flex-wrap gap-2">
        <button v-for="p in ['Tous', 'Aujourd\'hui', 'Semaine', 'Mois']" :key="p" @click="periodFilter = p" :class="periodFilter === p ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'" class="px-3 py-1.5 text-xs rounded-full border transition">{{ p }}</button>
      </div>
    </div>

    <div v-if="filtered.length === 0" class="bg-white rounded-2xl border-2 border-dashed p-12 text-center">
      <Calendar class="w-8 h-8 mx-auto mb-3 text-gray-400" />
      <p class="text-gray-500">Aucun rendez-vous trouvé</p>
    </div>

    <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      <AppointmentCard v-for="apt in filtered" :key="apt.id" :appointment="apt" @link="$emit('link', apt.id)" @open-property="$emit('open-property', apt.propertyId)" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Calendar, Link2, Clock, CheckCircle, Search } from 'lucide-vue-next'
import AppointmentCard from './AppointmentCard.vue'

const props = defineProps({ appointments: Array, properties: Array })
defineEmits(['link', 'open-property'])

const search = ref('')
const statusFilter = ref('Tous')
const linkFilter = ref('Tous')
const periodFilter = ref('Tous')

const now = new Date()
const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
const endOfWeek = new Date(now.setDate(now.getDate() + 6))
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

const stats = computed(() => ({
  today: props.appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length,
  week: props.appointments.filter(a => {
    const d = new Date(a.date)
    return d >= startOfWeek && d <= endOfWeek
  }).length
}))

const kpis = computed(() => [
  { label: 'Rendez-vous total', value: props.appointments.length, subtitle: 'Nombre total de RDV planifiés', icon: Calendar },
  { label: 'RDV liés', value: props.appointments.filter(a => a.propertyId).length, subtitle: 'Associés à une propriété', icon: Link2 },
  { label: 'RDV non liés', value: props.appointments.filter(a => !a.propertyId).length, subtitle: 'En attente d\'association', icon: Clock },
  { label: 'RDV en cours', value: props.appointments.filter(a => a.statut === 'En cours').length, subtitle: 'Dossiers en traitement', icon: CheckCircle }
])

const filtered = computed(() => {
  let list = [...props.appointments]

  if (statusFilter.value !== 'Tous') list = list.filter(a => a.statut === statusFilter.value)
  if (linkFilter.value === 'Liés') list = list.filter(a => a.propertyId)
  if (linkFilter.value === 'Non liés') list = list.filter(a => !a.propertyId)

  if (periodFilter.value === 'Aujourd\'hui') {
    const today = new Date().toDateString()
    list = list.filter(a => new Date(a.date).toDateString() === today)
  } else if (periodFilter.value === 'Semaine') {
    list = list.filter(a => {
      const d = new Date(a.date)
      return d >= startOfWeek && d <= endOfWeek
    })
  } else if (periodFilter.value === 'Mois') {
    list = list.filter(a => {
      const d = new Date(a.date)
      return d >= startOfMonth && d <= endOfMonth
    })
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(a => 
      a.reference.toLowerCase().includes(q) || 
      a.client.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q)
    )
  }

  return list.sort((a, b) => new Date(a.date) - new Date(b.date))
})
</script>
