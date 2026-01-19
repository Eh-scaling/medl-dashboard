<template>
  <div>
    <!-- Bandeau titre -->
    <div class="mb-8 animate-fadeIn">
      <div class="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-emerald-800 shadow-sm border border-emerald-100">
        <span class="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        Étape suivante après votre état des lieux
      </div>

      <h1 class="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
        Toutes les actions utiles, au même endroit
      </h1>
      <p class="mt-2 text-sm md:text-base text-gray-600 max-w-2xl">
        Finalisez votre installation en toute sécurité : garantie locative, bail conforme à votre Région, 
        documents juridiques et choix d'un contrat d'énergie avantageux.
      </p>
    </div>

    <!-- Carte d'encadrement + grid -->
    <div class="rounded-3xl border border-emerald-100/60 bg-white/70 shadow-xl backdrop-blur-md animate-fadeInUp">
      <!-- Header de la carte -->
      <div class="flex flex-col gap-4 border-b border-emerald-50/80 px-4 pt-4 pb-4 md:px-6 md:pt-5 md:pb-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-emerald-700/90">
              Portail locataire · Services partenaires
            </p>
            <p class="mt-1 text-xs md:text-sm text-gray-600 max-w-xl">
              Ces services sont proposés avec des partenaires spécialisés en Belgique. 
              Vous restez toujours libre de vos choix.
            </p>
          </div>
          <span class="inline-flex items-center px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50/70 text-emerald-800 text-xs font-medium">
            Recommandé pour gagner du temps
          </span>
        </div>
      </div>

      <!-- Grid des actions -->
      <div class="grid gap-6 p-6 md:grid-cols-2 md:p-8">
        <div 
          v-for="(action, index) in actionsItems" 
          :key="action.key"
          :class="['action-card', { 'animated': !hoverStates[action.key] }]"
          :style="{ animationDelay: `${80 + index * 50}ms` }"
          @mouseenter="hoverStates[action.key] = true"
          @mouseleave="hoverStates[action.key] = false"
        >
          <div class="relative h-full bg-white/80 backdrop-blur rounded-2xl shadow-lg shadow-emerald-100/40 border border-dashed border-primary/10 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-200/50 hover:border-primary/20 overflow-hidden group">
            <!-- Gradient de fond au hover -->
            <div class="absolute inset-x-0 bottom-0 h-12 rounded-b-2xl bg-gradient-to-t from-emerald-50/60 to-transparent opacity-70 pointer-events-none transition-opacity duration-300 group-hover:opacity-100" />
            
            <!-- Header de la carte -->
            <div class="bg-gradient-to-r from-primary/10 via-emerald-50/80 to-transparent rounded-t-2xl p-6 pb-4">
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-100">
                  <component :is="action.icon" class="w-7 h-7" />
                </div>
                <span class="border border-emerald-100 bg-white/70 text-[0.65rem] font-medium uppercase tracking-wider text-emerald-700 px-2.5 py-1.5 rounded-md transition-colors duration-300 group-hover:bg-emerald-50 group-hover:border-emerald-200">
                  {{ action.badge }}
                </span>
              </div>

              <h3 class="text-lg font-bold leading-snug text-gray-900">
                {{ action.title }}
              </h3>
            </div>

            <!-- Contenu de la carte -->
            <div class="p-6 pt-4">
              <p class="text-sm text-gray-600 leading-relaxed mb-3 min-h-[3rem]">
                {{ action.desc }}
              </p>
              <p class="mb-5 text-xs text-emerald-700/90 font-medium flex items-center gap-2">
                <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span>{{ action.bullet }}</span>
              </p>

              <button class="w-full group/btn bg-primary text-white hover:bg-emerald-600 border-0 shadow-md hover:shadow-lg transition-all duration-300 px-4 py-3 rounded-lg flex items-center justify-between text-sm font-medium">
                <span class="flex-1 text-left">{{ action.cta }}</span>
                <ExternalLink class="h-4 w-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ShieldCheck, FileEdit, FilePlus2, Zap, ExternalLink } from 'lucide-vue-next'

const hoverStates = reactive({
  garantie: false,
  bail: false,
  docs: false,
  energie: false
})

const actionsItems = [
  {
    key: 'garantie',
    badge: 'Avant l\'entrée',
    icon: ShieldCheck,
    title: 'Garantie locative en ligne',
    desc: 'Bloquez votre garantie en quelques minutes, 100% digital.',
    bullet: 'Compatible toutes les banques belges',
    cta: 'Démarrer'
  },
  {
    key: 'bail',
    badge: 'Obligatoire',
    icon: FileEdit,
    title: 'Créer un contrat de bail',
    desc: '+ clauses adaptées à la Région, signature en ligne.',
    bullet: 'Toujours à jour avec la législation belge',
    cta: 'Créer'
  },
  {
    key: 'docs',
    badge: 'Pratique',
    icon: FilePlus2,
    title: '+50 documents personnalisés',
    desc: 'Modèles juridiques, lettres types, attestations, check-lists.',
    bullet: 'Gagnez du temps sur toute la vie du bail',
    cta: 'Explorer'
  },
  {
    key: 'energie',
    badge: 'Budget',
    icon: Zap,
    title: 'Contrat d\'énergie le moins cher (BE)',
    desc: 'Comparez et signez une offre avantageuse en 5 min.',
    bullet: 'Sans coupure, sans paperasse inutile',
    cta: 'Comparer'
  }
]
</script>

<style scoped>
/* Animations CSS natives pour remplacer framer-motion */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}

.animate-fadeInUp {
  animation: fadeInUp 0.45s ease-out;
  animation-delay: 50ms;
  animation-fill-mode: both;
}

.action-card.animated {
  animation: slideInUp 0.4s ease-out both;
}

/* Amélioration de l'effet hover - désactiver l'animation après completion */
.action-card {
  animation-fill-mode: forwards;
}

.action-card:hover {
  animation: none;
  transform: translateY(0);
}
</style>
