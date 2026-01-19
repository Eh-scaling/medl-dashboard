<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
    <div class="max-w-6xl mx-auto px-4 py-6">
      <!-- Breadcrumb -->
      <nav class="mb-3 flex items-center gap-2 text-sm text-gray-600">
        <button @click="$emit('back')" class="hover:underline flex items-center gap-1">
          <Home class="w-4 h-4" />
          <span>Accueil</span>
        </button>
        <span>/</span>
        <span class="truncate max-w-xs">{{ meta?.adresse || 'Bien' }}</span>
        <span>/</span>
        <span class="font-medium text-gray-900">{{ meta?.reference || 'Dossier' }}</span>
      </nav>

      <!-- Header -->
      <div class="rounded-2xl p-6 mb-6 bg-gradient-to-r from-primary to-emerald-400 text-white shadow-xl">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs opacity-90">Aperçu</div>
            <h1 class="text-3xl font-bold tracking-tight">Portail dossier</h1>
            <div class="text-sm mt-1 opacity-90">Référence : {{ meta?.reference || '—' }}</div>
          </div>
          <span v-if="meta?.statut" :class="statusClass(meta.statut)" class="px-3 py-1 rounded-full text-sm font-medium border">
            {{ meta.statut }}
          </span>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="sticky top-2 z-30 mb-6 bg-white/95 backdrop-blur rounded-2xl border border-gray-200 shadow-lg p-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <FileText class="w-4 h-4 text-primary" />
            <span>Actions rapides · {{ meta?.reference }}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button @click="mainDoc && handlePreview(mainDoc)" :disabled="!mainDoc" class="px-3 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 inline-flex items-center gap-2">
              <Eye class="w-4 h-4" />
              Voir l'état des lieux
            </button>
            <button @click="showSignModal = true" class="px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-emerald-600 inline-flex items-center gap-2">
              <FileSignature class="w-4 h-4" />
              Signature en ligne
            </button>
            <button @click="activeTab = 'photos'" class="px-3 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50 inline-flex items-center gap-2">
              <Images class="w-4 h-4" />
              Voir les photos
            </button>
          </div>
        </div>
      </div>

      <!-- Info dossier -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <div class="flex items-center gap-2 mb-4">
          <FolderOpen class="w-5 h-5 text-primary" />
          <h2 class="text-lg font-bold">Aperçu du dossier</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <div class="text-gray-500 mb-1">Adresse</div>
            <div class="font-medium">{{ meta?.adresse || '—' }}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1">Locataire</div>
            <div class="font-medium">{{ meta?.locataire || '—' }}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1">Bailleur</div>
            <div class="font-medium">{{ meta?.bailleur || '—' }}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1">Créé le</div>
            <div class="font-medium">{{ meta ? formatDate(meta.dateCreation) : '—' }}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1">Référence</div>
            <div class="font-medium">{{ meta?.reference || '—' }}</div>
          </div>
          <div>
            <div class="text-gray-500 mb-1">Identifiant</div>
            <div class="font-medium">{{ meta?.id || '—' }}</div>
          </div>
        </div>
      </div>

      <!-- Onglets -->
      <div class="mb-6">
        <div class="grid grid-cols-4 gap-2 bg-primary/10 rounded-xl p-1">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:bg-white/50'" class="px-4 py-2 rounded-lg font-medium text-sm transition inline-flex items-center justify-center gap-2">
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Contenu Documents -->
      <div v-if="activeTab === 'documents'" class="space-y-4">
        <p class="text-sm text-gray-600">Voici tous les documents liés à ce dossier. Le rapport principal est indiqué comme <span class="font-medium">document principal</span>.</p>
        
        <div class="grid md:grid-cols-2 gap-4">
          <DocCard v-for="(doc, idx) in pdfDocs" :key="doc.id" :doc="doc" :is-main="idx === 0" @preview="handlePreview" @sign="showSignModal = true" @download="handleDownload" />
        </div>

        <div v-if="otherDocs.length > 0" class="space-y-3">
          <div class="border-t pt-4">
            <h3 class="text-sm font-medium mb-3">Autres fichiers</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <DocCard v-for="doc in otherDocs" :key="doc.id" :doc="doc" @preview="handlePreview" @sign="showSignModal = true" @download="handleDownload" />
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu Photos -->
      <PhotosGallery v-else-if="activeTab === 'photos'" :photos="photos" @open="handlePreview" />

      <!-- Contenu Remarques -->
      <RemarquesSection v-else-if="activeTab === 'remarques'" :dossier-id="dossierId" :initial-remarks="remarks" />

      <!-- Contenu Actions -->
      <ActionsSection v-else-if="activeTab === 'actions'" />
    </div>

    <!-- Modal Preview -->
    <PreviewModal v-if="showPreview" :doc="previewDoc" @close="handlePreviewClose" @download="handleDownload" />

    <!-- Modal Signature -->
    <SignModal v-if="showSignModal" @close="showSignModal = false" />

    <!-- Pop-up d'évaluation -->
    <RatingModal 
      v-if="showRatingModal" 
      @close="closeRatingModal" 
      @submit="handleRatingSubmit" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Home, FileText, FolderOpen, Eye, FileSignature, Images, MessageSquare, Sparkles } from 'lucide-vue-next'
import DocCard from './dossier/DocCard.vue'
import PhotosGallery from './dossier/PhotosGallery.vue'
import RemarquesSection from './dossier/RemarquesSection.vue'
import ActionsSection from './dossier/ActionsSection.vue'
import PreviewModal from './dossier/PreviewModal.vue'
import SignModal from './SignModal.vue'
import RatingModal from './RatingModal.vue'

const props = defineProps({ dossierId: String })
defineEmits(['back'])

const meta = ref(null)
const docs = ref([])
const photos = ref([])
const remarks = ref([])
const activeTab = ref('documents')
const showPreview = ref(false)
const previewDoc = ref(null)
const showSignModal = ref(false)
const showRatingModal = ref(false)
const ratingTimer = ref(null)
const shouldShowRatingOnClose = ref(false)

const tabs = [
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'photos', label: 'Photos', icon: Images },
  { id: 'remarques', label: 'Remarques', icon: MessageSquare },
  { id: 'actions', label: 'Actions', icon: Sparkles }
]

const pdfDocs = computed(() => docs.value.filter(d => d.type === 'pdf'))
const otherDocs = computed(() => docs.value.filter(d => d.type !== 'pdf'))
const mainDoc = computed(() => pdfDocs.value[0] || null)

const statusClass = (statut) => {
  if (statut === 'En cours') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  if (statut === 'En attente') return 'bg-amber-50 text-amber-700 border-amber-100'
  return 'bg-gray-50 text-gray-700 border-gray-200'
}

const formatDate = (iso) => new Date(iso).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const handlePreview = (doc) => {
  // Ouvrir le preview immédiatement
  previewDoc.value = doc
  showPreview.value = true
  
  // Vérifier si c'est le document "État des lieux (PDF)"
  if (doc.label === 'État des lieux (PDF)') {
    // Vérifier si l'utilisateur a déjà évalué
    const hasRated = localStorage.getItem(`rating_submitted_${props.dossierId}`)
    
    if (!hasRated) {
      // Marquer qu'on doit afficher le pop-up à la fermeture
      shouldShowRatingOnClose.value = true
      
      // Démarrer un timer de 45 secondes
      ratingTimer.value = setTimeout(() => {
        // Afficher le pop-up après 45 secondes
        showRatingModal.value = true
        shouldShowRatingOnClose.value = false // Annuler l'affichage à la fermeture
      }, 45000) // 45 secondes = 45000 millisecondes
      
      console.log('⏱️ Timer de 45s démarré pour le pop-up d\'évaluation')
    }
  }
}

const handlePreviewClose = () => {
  // Fermer le preview
  showPreview.value = false
  
  // Annuler le timer s'il existe
  if (ratingTimer.value) {
    clearTimeout(ratingTimer.value)
    ratingTimer.value = null
    console.log('⏱️ Timer annulé')
  }
  
  // Si on doit afficher le pop-up à la fermeture
  if (shouldShowRatingOnClose.value) {
    shouldShowRatingOnClose.value = false
    // Afficher le pop-up immédiatement
    setTimeout(() => {
      showRatingModal.value = true
      console.log('🎯 Pop-up affiché à la fermeture du PDF')
    }, 300) // Petit délai pour une transition fluide
  }
}

const handleDownload = (doc) => {
  // Déclencher le téléchargement du fichier
  const link = document.createElement('a')
  link.href = doc.url
  link.download = doc.label || 'document.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  console.log('📥 Téléchargement déclenché:', doc.label)
  
  // Vérifier si c'est le document "État des lieux (PDF)"
  if (doc.label === 'État des lieux (PDF)') {
    // Vérifier si l'utilisateur a déjà évalué
    const hasRated = localStorage.getItem(`rating_submitted_${props.dossierId}`)
    
    if (!hasRated) {
      // Afficher le pop-up immédiatement après le téléchargement
      showRatingModal.value = true
      console.log('🎯 Pop-up affiché après téléchargement')
    }
  }
}

const closeRatingModal = () => {
  showRatingModal.value = false
  // Marquer comme "plus tard" - ne pas redemander dans cette session
  sessionStorage.setItem(`rating_postponed_${props.dossierId}`, 'true')
}

const handleRatingSubmit = async (data) => {
  // Sauvegarder l'évaluation en localStorage (temporaire)
  // À remplacer par un appel API vers votre BDD
  localStorage.setItem(`rating_submitted_${props.dossierId}`, 'true')
  localStorage.setItem(`rating_data_${props.dossierId}`, JSON.stringify({
    rating: data.rating,
    feedback: data.feedback,
    timestamp: new Date().toISOString(),
    dossierId: props.dossierId
  }))
  
  console.log('Rating soumis:', data)
  
  // Fermer le modal et ouvrir le PDF
  showRatingModal.value = false
  
  // Maintenant on peut afficher le document
  const mainDocument = pdfDocs.value[0]
  if (mainDocument) {
    previewDoc.value = mainDocument
    showPreview.value = true
  }
}

onMounted(async () => {
  // Mock data
  meta.value = {
    id: props.dossierId,
    reference: 'EDL-2025-000231',
    statut: 'En cours',
    adresse: 'Rue de la Loi 16, 1000 Bruxelles',
    locataire: 'Dupont Marie',
    bailleur: 'Société Immo Atlas',
    dateCreation: new Date().toISOString()
  }

  docs.value = [
    { id: 'doc1', label: 'État des lieux (PDF)', type: 'pdf', size: '2.4 Mo', url: '#' },
    { id: 'doc2', label: 'Ordre de mission signé', type: 'pdf', size: '680 Ko', url: '#' },
    { id: 'doc3', label: 'Archive photos (.zip)', type: 'autre', size: '198 Mo', url: '#' }
  ]

  photos.value = Array.from({ length: 120 }).map((_, i) => ({
    id: `img_${i + 1}`,
    label: `Photo ${i + 1}`,
    type: 'image',
    url: `https://picsum.photos/seed/edl_${i + 1}/400/400`
  }))

  remarks.value = [
    { id: '1', author: 'Expert immobilier', role: 'Expert', createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), content: 'Rapport préliminaire disponible en PDF.' },
    { id: '2', author: 'Dupont Marie', role: 'Client', createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), content: 'Pouvez-vous ajouter les relevés des compteurs ?' }
  ]
})
</script>
