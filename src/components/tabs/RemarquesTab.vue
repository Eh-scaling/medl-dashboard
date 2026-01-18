<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Remarques et commentaires</h3>

    <div v-if="remarques.length === 0" class="text-center py-12 text-gray-500">
      <MessageSquare class="w-8 h-8 mx-auto mb-3 text-gray-400" />
      <p>Aucune remarque pour le moment</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="remark in remarques" :key="remark.id" class="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-sm font-semibold text-primary">{{ remark.author[0] }}</span>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium text-sm">{{ remark.author }}</span>
              <span :class="roleClass(remark.role)" class="text-xs px-2 py-0.5 rounded-full">{{ remark.role }}</span>
              <span class="text-xs text-gray-500">{{ formatDate(remark.createdAt) }}</span>
            </div>
            <p class="text-sm text-gray-700">{{ remark.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 p-4">
      <label class="text-sm font-medium text-gray-700 mb-2 block">Ajouter une remarque</label>
      <textarea v-model="newRemark" placeholder="Votre remarque..." rows="3" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm resize-none" />
      <div class="flex items-center justify-end gap-2 mt-3">
        <button @click="newRemark = ''" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">Annuler</button>
        <button @click="addRemark" :disabled="!newRemark.trim()" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          <Send class="w-4 h-4" />
          Envoyer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MessageSquare, Send } from 'lucide-vue-next'

const props = defineProps({ dossierId: String })

const remarques = ref([])
const newRemark = ref('')

const roleClass = (role) => {
  if (role === 'Expert') return 'bg-sky-100 text-sky-700'
  if (role === 'Client') return 'bg-emerald-100 text-emerald-700'
  return 'bg-gray-100 text-gray-700'
}

const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-BE', { dateStyle: 'medium', timeStyle: 'short' })

const addRemark = () => {
  if (!newRemark.value.trim()) return
  
  remarques.value.push({
    id: Date.now().toString(),
    author: 'Vous',
    role: 'Client',
    createdAt: new Date().toISOString(),
    content: newRemark.value
  })
  
  newRemark.value = ''
}

onMounted(async () => {
  remarques.value = [
    {
      id: '1',
      author: 'Expert immobilier',
      role: 'Expert',
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      content: 'Rapport préliminaire disponible en PDF. Merci de relire la section cuisine.'
    },
    {
      id: '2',
      author: 'Dupont Marie',
      role: 'Client',
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      content: 'Pouvez-vous ajouter les relevés des compteurs en annexe ?'
    }
  ]
})
</script>
