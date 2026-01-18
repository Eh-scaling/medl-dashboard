<template>
  <div class="grid md:grid-cols-3 gap-6">
    <!-- Fil des remarques -->
    <div class="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div class="flex items-center gap-2 mb-6 bg-gradient-to-r from-primary/10 to-transparent rounded-lg p-3">
        <MessageSquare class="w-5 h-5 text-primary" />
        <h2 class="font-bold">Fil des remarques</h2>
      </div>

      <div class="space-y-6">
        <div v-for="remark in localRemarks" :key="remark.id" class="flex gap-3">
          <div :class="roleColor(remark.role)" class="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0" />
          <div class="flex-1">
            <div class="text-sm">
              <span class="font-medium">{{ remark.author }}</span>
              <span class="text-gray-500"> · {{ formatDate(remark.createdAt) }}</span>
            </div>
            <p class="text-sm leading-relaxed mt-1 text-gray-700">{{ remark.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Ajouter une remarque -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div class="bg-gradient-to-r from-primary/10 to-transparent rounded-lg p-3 mb-4">
        <h3 class="font-bold">Ajouter une remarque</h3>
      </div>

      <div class="space-y-3">
        <label class="text-sm font-medium text-gray-700">Votre message</label>
        <textarea v-model="message" rows="6" placeholder="Votre remarque..." class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm resize-none" />
        
        <div class="flex flex-col gap-3">
          <span class="text-xs text-gray-500">Délai de réponse moyen : &lt; 24h</span>
          <button @click="addRemark" :disabled="!message.trim() || sending" class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
            <Send class="w-4 h-4" />
            Envoyer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MessageSquare, Send } from 'lucide-vue-next'

const props = defineProps({ dossierId: String, initialRemarks: Array })

const localRemarks = ref([...props.initialRemarks])
const message = ref('')
const sending = ref(false)

const roleColor = (role) => {
  if (role === 'Expert') return 'bg-emerald-500'
  if (role === 'Client') return 'bg-sky-500'
  return 'bg-gray-400'
}

const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const addRemark = async () => {
  if (!message.value.trim()) return
  
  sending.value = true
  
  const newRemark = {
    id: Date.now().toString(),
    author: 'Vous',
    role: 'Client',
    createdAt: new Date().toISOString(),
    content: message.value.trim()
  }
  
  localRemarks.value.unshift(newRemark)
  message.value = ''
  sending.value = false
}
</script>
