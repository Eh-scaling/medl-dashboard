<template>
  <div>
    <!-- Alerte explicative -->
    <div class="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6">
      <div class="flex items-start gap-3">
        <Info class="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-sky-900 mb-1">Section privée entre parties</h3>
          <p class="text-sm text-sky-700">
            Cette section est destinée aux <strong>occupants/propriétaires</strong> du dossier. 
            Les <strong>experts</strong> et l'équipe <strong>Mon état des lieux</strong> <em>n'y ont pas accès</em>.
          </p>
        </div>
      </div>
    </div>

    <!-- Layout principal : Composer (2/3) + Fil (1/3) -->
    <div class="grid md:grid-cols-3 gap-6">
      
      <!-- Composer (2/3) -->
      <div class="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-primary/10 to-transparent p-6">
          <h2 class="font-bold text-lg">Ajouter une remarque</h2>
        </div>

        <div class="p-6 space-y-6">
          <!-- Textarea message -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Votre message</label>
            <textarea 
              v-model="message" 
              rows="8" 
              placeholder="Exemple : peinture écaillée dans la chambre 2, plinthe abîmée."
              class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm resize-none"
            />
          </div>

          <!-- Zone drag & drop photos -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-gray-700">Photos (optionnel)</label>
            
            <!-- Drop zone -->
            <div 
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="handleDrop"
              @click="$refs.fileInput.click()"
              :class="[
                'rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition',
                isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
              ]"
            >
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*" 
                multiple 
                hidden 
                @change="handleFileSelect"
              />
              <div class="flex items-center justify-center gap-3">
                <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Upload class="h-5 w-5 text-primary" />
                </span>
                <div class="text-left">
                  <div class="font-medium text-sm">Glissez-déposez des photos ici</div>
                  <div class="text-xs text-gray-500">ou cliquez pour parcourir vos fichiers</div>
                </div>
              </div>
            </div>

            <!-- Preview photos -->
            <div v-if="pictures.length > 0" class="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <div 
                v-for="pic in pictures" 
                :key="pic.id" 
                class="border rounded-xl overflow-hidden relative group"
              >
                <img :src="pic.url" :alt="pic.file.name" class="aspect-video object-cover" />
                <div class="p-2 text-xs flex items-center gap-2 bg-white">
                  <Images class="w-3.5 h-3.5 text-gray-600" />
                  <span class="truncate flex-1">{{ pic.file.name }}</span>
                </div>
                <div class="px-2 pb-2 bg-white">
                  <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-primary transition-all duration-300"
                      :style="{ width: `${pic.progress}%` }"
                    />
                  </div>
                </div>
                <!-- Bouton supprimer -->
                <button
                  @click="removePicture(pic.id)"
                  class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Bouton créer le document -->
          <div class="flex items-center justify-end">
            <button
              @click="showConfirmModal = true"
              :disabled="generating || (!message.trim() && pictures.length === 0)"
              class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              <FileText class="w-4 h-4" />
              Créer le document
            </button>
          </div>

          <!-- Alert document prêt -->
          <div v-if="generatedUrl" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <CheckCircle class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 class="font-semibold text-emerald-900 mb-1">Document prêt</h4>
                <p class="text-sm text-emerald-700 mb-2">
                  Votre récapitulatif des remarques et photos est prêt. Ouvrez-le pour vérification, 
                  puis signez-le <strong>électroniquement</strong> ou <strong>manuellement</strong> selon votre préférence.
                </p>
                <a 
                  :href="generatedUrl" 
                  target="_blank" 
                  class="text-sm font-medium text-emerald-700 underline hover:text-emerald-800"
                >
                  Ouvrir le PDF
                </a>
              </div>
            </div>
          </div>

          <!-- Encadré modalités de signature -->
          <div class="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div class="flex items-start gap-3">
              <div class="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
                <FileSignature class="h-5 w-5 text-primary" />
              </div>
              <div class="text-sm">
                <div class="font-medium text-gray-900 mb-1">Validation des remarques</div>
                <p class="text-gray-600 mb-3">
                  Les remarques doivent être <strong>signées par l'ensemble des parties</strong>. 
                  Signature possible <strong>électronique</strong> ou <strong>manuelle</strong>.
                </p>
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 rounded-full text-xs bg-white border border-primary/30 font-medium">
                    Signature électronique
                  </span>
                  <span class="px-3 py-1 rounded-full text-xs bg-white border border-primary/30 font-medium">
                    Signature manuscrite
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fil des remarques (1/3) -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-primary/10 to-transparent p-6">
          <div class="flex items-center gap-2">
            <MessageSquare class="w-5 h-5 text-primary" />
            <h2 class="font-bold text-lg">Fil des remarques par personne</h2>
          </div>
        </div>

        <div class="p-6">
          <div class="border-t pt-4 space-y-6">
            <!-- Groupé par auteur -->
            <div v-for="[author, remarks] in groupedRemarks" :key="author">
              <div class="flex items-center justify-between mb-2">
                <div class="font-medium text-gray-900">{{ author }}</div>
                <div class="text-xs text-gray-500">{{ remarks.length }} remarque(s)</div>
              </div>
              <ul class="space-y-2">
                <li 
                  v-for="remark in remarks" 
                  :key="remark.id" 
                  class="text-xs text-gray-600"
                >
                  <span class="text-gray-500">{{ formatDate(remark.createdAt) }}</span>
                </li>
              </ul>
            </div>

            <!-- Message vide -->
            <div v-if="groupedRemarks.length === 0" class="text-sm text-gray-500 flex items-center gap-2 py-8 justify-center">
              <Info class="w-4 h-4" />
              Aucune remarque à afficher.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation -->
    <div 
      v-if="showConfirmModal" 
      @click="showConfirmModal = false"
      class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
    >
      <div 
        @click.stop 
        class="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4"
      >
        <h3 class="text-xl font-bold">Confirmer la création du document</h3>
        
        <div class="text-sm text-gray-700 space-y-3">
          <p>
            Le <strong>propriétaire</strong> et <strong>toutes les parties liées au dossier</strong> 
            recevront une <strong>notification</strong> et un <strong>e-mail</strong> indiquant que 
            des remarques ont été formulées par <strong>{{ currentUser }}</strong>.
          </p>
          <p>
            Le document créé sera automatiquement <strong>rangé dans les documents du bien</strong>.
          </p>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4">
          <button 
            @click="showConfirmModal = false"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Retour
          </button>
          <button 
            @click="confirmAndGenerate"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  MessageSquare, Upload, Images, X, FileText, FileSignature, 
  Info, CheckCircle 
} from 'lucide-vue-next'

const props = defineProps({ 
  dossierId: String, 
  initialRemarks: Array 
})

// État
const localRemarks = ref([...props.initialRemarks])
const message = ref('')
const pictures = ref([])
const isDragging = ref(false)
const generating = ref(false)
const generatedUrl = ref(null)
const showConfirmModal = ref(false)
const currentUser = 'Dupont Marie' // À récupérer depuis votre système d'auth

// Grouper les remarques par auteur
const groupedRemarks = computed(() => {
  const map = new Map()
  
  localRemarks.value.forEach(remark => {
    if (!map.has(remark.author)) {
      map.set(remark.author, [])
    }
    map.get(remark.author).push(remark)
  })
  
  // Retourner un tableau de [author, remarks[]]
  return Array.from(map.entries())
    .sort((a, b) => b[1].length - a[1].length) // Trier par nombre de remarques
})

// Formater la date
const formatDate = (iso) => {
  return new Date(iso).toLocaleDateString('fr-BE', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Gestion des fichiers
const handleDrop = (e) => {
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
  if (files.length) addPictures(files)
}

const handleFileSelect = (e) => {
  if (e.target.files) {
    const files = Array.from(e.target.files)
    addPictures(files)
  }
}

const addPictures = (files) => {
  const newPics = files.map(file => ({
    id: Math.random().toString(36).slice(2),
    file,
    url: URL.createObjectURL(file),
    progress: 0
  }))
  
  pictures.value = [...pictures.value, ...newPics]
  
  // Simuler l'upload avec progression
  newPics.forEach(pic => {
    simulateUpload(pic)
  })
}

const simulateUpload = (pic) => {
  const interval = setInterval(() => {
    const p = pictures.value.find(p => p.id === pic.id)
    if (p) {
      p.progress = Math.min(100, p.progress + 10)
      if (p.progress >= 100) {
        clearInterval(interval)
      }
    }
  }, 120)
}

const removePicture = (id) => {
  const pic = pictures.value.find(p => p.id === id)
  if (pic) {
    URL.revokeObjectURL(pic.url)
  }
  pictures.value = pictures.value.filter(p => p.id !== id)
}

// Confirmer et générer
const confirmAndGenerate = async () => {
  showConfirmModal.value = false
  
  // Ajouter la remarque si message existe
  if (message.value.trim() || pictures.value.length > 0) {
    const newRemark = {
      id: Date.now().toString(),
      author: currentUser,
      role: 'Client',
      createdAt: new Date().toISOString(),
      content: message.value.trim() || '(photos ajoutées)'
    }
    localRemarks.value.unshift(newRemark)
    message.value = ''
  }
  
  // Générer le document (mock)
  generating.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Simuler une URL de document généré
  generatedUrl.value = '/placeholder/remarques.pdf'
  generating.value = false
  
  // Réinitialiser les photos après génération
  pictures.value.forEach(pic => URL.revokeObjectURL(pic.url))
  pictures.value = []
  
  console.log('Document généré avec succès')
}
</script>
