<template>
  <div class="space-y-4">
    <!-- DEBUG PANEL -->
    <div class="bg-red-100 border-2 border-red-500 rounded-lg p-4">
      <h4 class="font-bold text-red-900 mb-2">🔍 PANNEAU DE DEBUG</h4>
      <p class="text-xs text-red-800 mb-2">showRatingModal: {{ showRatingModal }}</p>
      <p class="text-xs text-red-800 mb-2">dossierId: {{ dossierId || 'NON DÉFINI' }}</p>
      <button 
        @click="testClick" 
        class="bg-red-600 text-white px-4 py-2 rounded font-bold"
      >
        🧪 CLIC DE TEST (ouvrez la console F12)
      </button>
    </div>

    <!-- BOUTON DE TEST TEMPORAIRE -->
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
      <span class="text-xs text-yellow-800">🧪 Mode test - Cliquez pour tester le pop-up</span>
      <button 
        @click="showRatingModal = true; console.log('BOUTON CLIQUÉ! showRatingModal =', showRatingModal)" 
        class="bg-yellow-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-yellow-600"
      >
        Tester le pop-up
      </button>
    </div>
    
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Documents</h3>
      <button @click="$emit('sign')" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition text-sm">
        <FileSignature class="w-4 h-4" />
        Signer électroniquement (9.99€)
      </button>
    </div>

    <div v-if="documents.length === 0" class="text-center py-12 text-gray-500">
      <FileText class="w-8 h-8 mx-auto mb-3 text-gray-400" />
      <p>Aucun document disponible</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="doc in documents" :key="doc.id" class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition border border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText class="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p class="font-medium text-sm">{{ doc.label }}</p>
              <p class="text-xs text-gray-500">{{ doc.size }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="previewDoc(doc)" class="p-2 hover:bg-white rounded-lg transition">
              <Eye class="w-4 h-4 text-gray-600" />
            </button>
            <button @click="downloadDoc(doc)" class="p-2 hover:bg-white rounded-lg transition">
              <Download class="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pop-up d'évaluation -->
    <div v-if="showRatingModal" class="fixed inset-0 bg-purple-500/50 z-[9999] flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg max-w-md">
        <h2 class="text-2xl font-bold mb-4">🎉 LE POP-UP FONCTIONNE !</h2>
        <p class="mb-4">Si vous voyez ce message, le RatingModal devrait aussi fonctionner.</p>
        <button @click="showRatingModal = false" class="bg-purple-600 text-white px-4 py-2 rounded">
          Fermer ce test
        </button>
      </div>
    </div>

    <RatingModal 
      v-if="showRatingModal" 
      @close="closeRatingModal" 
      @submit="handleRatingSubmit" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FileText, FileSignature, Eye, Download } from 'lucide-vue-next'
import RatingModal from '../RatingModal.vue'

const props = defineProps({ dossierId: String })
defineEmits(['sign'])

const documents = ref([])
const showRatingModal = ref(false)

// Fonction de test ultra-debug
const testClick = () => {
  console.log('=== TEST DE DEBUG ===')
  console.log('1. showRatingModal AVANT:', showRatingModal.value)
  showRatingModal.value = true
  console.log('2. showRatingModal APRÈS:', showRatingModal.value)
  console.log('3. RatingModal importé?', RatingModal)
  console.log('4. dossierId:', props.dossierId)
  console.log('===================')
}

onMounted(async () => {
  console.log('📋 DocumentsTab monté!')
  console.log('dossierId:', props.dossierId)
  
  documents.value = [
    { id: 'doc1', label: 'État des lieux (PDF)', size: '2.4 Mo', url: '#' },
    { id: 'doc2', label: 'Ordre de mission signé', size: '680 Ko', url: '#' },
    { id: 'doc3', label: 'Archive photos (.zip)', size: '198 Mo', url: '#' }
  ]
  
  console.log('Documents chargés:', documents.value)
})

const previewDoc = (doc) => {
  console.log('Preview:', doc)
  
  // Vérifier si c'est le document "État des lieux (PDF)"
  if (doc.label === 'État des lieux (PDF)') {
    console.log('🎯 Document État des lieux détecté!')
    
    // Vérifier si l'utilisateur a déjà évalué
    const hasRated = localStorage.getItem(`rating_submitted_${props.dossierId}`)
    console.log('hasRated?', hasRated)
    
    if (!hasRated) {
      console.log('✅ Affichage du pop-up!')
      showRatingModal.value = true
    } else {
      console.log('❌ Utilisateur a déjà évalué')
    }
  }
}

const downloadDoc = (doc) => {
  console.log('Download:', doc)
}

const closeRatingModal = () => {
  console.log('Fermeture du modal')
  showRatingModal.value = false
  sessionStorage.setItem(`rating_postponed_${props.dossierId}`, 'true')
}

const handleRatingSubmit = async (data) => {
  console.log('Rating soumis:', data)
  
  localStorage.setItem(`rating_submitted_${props.dossierId}`, 'true')
  localStorage.setItem(`rating_data_${props.dossierId}`, JSON.stringify({
    rating: data.rating,
    feedback: data.feedback,
    timestamp: new Date().toISOString(),
    dossierId: props.dossierId
  }))
  
  showRatingModal.value = false
}
</script>
