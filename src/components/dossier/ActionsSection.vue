<template>
  <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
    <div v-for="action in actions" :key="action.title" class="bg-white rounded-2xl shadow-lg border border-dashed border-gray-200 hover:shadow-xl hover:-translate-y-1 transition p-5">
      <div class="bg-gradient-to-r from-primary/10 to-transparent rounded-lg p-3 mb-4">
        <div class="flex items-center gap-2">
          <component :is="action.icon" class="w-6 h-6 text-primary" />
          <h3 class="font-bold text-sm">{{ action.title }}</h3>
        </div>
      </div>
      
      <p class="text-sm text-gray-600 mb-4">{{ action.desc }}</p>
      
      <button class="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition inline-flex items-center justify-center gap-2">
        <ExternalLink class="w-4 h-4" />
        {{ action.cta }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ShieldCheck, FileEdit, FilePlus2, Zap, ExternalLink } from 'lucide-vue-next'

const actions = [
  {
    icon: ShieldCheck,
    title: 'Garantie locative en ligne',
    desc: 'Bloquez votre garantie en quelques minutes, 100% digital.',
    cta: 'Démarrer'
  },
  {
    icon: FileEdit,
    title: 'Créer un contrat de bail',
    desc: '+ clauses adaptées à la Région, signature en ligne.',
    cta: 'Créer'
  },
  {
    icon: FilePlus2,
    title: '+50 documents personnalisés',
    desc: 'Modèles juridiques, lettres types, attestations, check-lists.',
    cta: 'Explorer'
  },
  {
    icon: Zap,
    title: 'Contrat d\'énergie le moins cher',
    desc: 'Comparez et signez une offre avantageuse en 5 min.',
    cta: 'Comparer'
  }
]
</script>
