<template>
  <!-- Pop-up positionné en bas à droite -->
  <div class="fixed bottom-6 right-6 z-50 max-w-md w-full px-4">
    <div class="relative rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 md:p-7">
      <!-- Titre -->
      <p class="text-[11px] md:text-xs text-emerald-700 font-medium inline-flex items-center gap-1 mb-1">
        Merci pour votre confiance
      </p>
      <h2 class="text-lg md:text-xl font-semibold tracking-tight leading-tight">
        Comment évalueriez-vous votre expérience&nbsp;?
      </h2>
      <p class="text-xs md:text-sm text-slate-600 mt-2">
        Votre avis compte beaucoup pour nous et aide d'autres personnes à choisir un expert de confiance.
      </p>

      <!-- Étoiles -->
      <div class="mt-5 flex flex-col items-center gap-2">
        <div class="flex items-center gap-1.5">
          <button
            v-for="index in 5"
            :key="index"
            type="button"
            @click="rating = index"
            @mouseenter="hover = index"
            @mouseleave="hover = null"
            class="focus:outline-none"
            :aria-label="`${index} étoile${index > 1 ? 's' : ''}`"
          >
            <Star
              :class="[
                'h-8 w-8 md:h-9 md:w-9 transition-transform duration-200 ease-out hover:scale-110 active:scale-95',
                isFilled(index)
                  ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] scale-105'
                  : index <= 2
                    ? 'text-slate-300 opacity-70 hover:text-amber-300'
                    : 'text-slate-300 hover:text-amber-400 hover:drop-shadow'
              ]"
              :fill="isFilled(index) ? 'currentColor' : 'none'"
            />
          </button>
        </div>
        <p class="text-[11px] md:text-xs text-slate-600 min-h-[1.25rem]">
          {{ currentLabel }}
        </p>
        <p class="text-[10px] md:text-[11px] text-slate-500 mt-1 text-center">
          Une excellente expérience&nbsp;? Aidez d'autres clients à faire le bon choix&nbsp;!<br />
          Nous lisons chaque retour avec attention ❤️
        </p>
      </div>

      <!-- CTA -->
      <div class="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-[11px] md:text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
        >
          Plus tard
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="!rating"
          :class="[
            'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-xs md:text-sm font-semibold shadow-sm w-full md:w-auto',
            rating
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 transition-colors'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          ]"
        >
          Envoyer mon avis
        </button>
      </div>

      <!-- Pop-up feedback pour notes 1 à 3 (retour interne) -->
      <div
        v-if="showFeedback"
        class="absolute inset-0 bg-white/95 flex items-center justify-center rounded-2xl"
      >
        <div class="w-full rounded-2xl bg-white shadow-xl border border-slate-200 p-4 md:p-5 max-w-sm">
          <h3 class="text-sm md:text-base font-semibold text-slate-900">
            Votre évaluation a bien été prise en compte
          </h3>
          <p class="text-[11px] md:text-xs text-slate-600 mt-2">
            Nous sommes désolés que l'expérience ne soit pas parfaite. Pouvez-vous nous dire en quelques mots ce que nous pourrions améliorer&nbsp;?
          </p>
          <textarea
            v-model="feedback"
            class="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs md:text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 min-h-[80px] resize-none"
            placeholder="Exemple : délai, clarté des explications, accueil, rapport..."
          />
          <div class="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] md:text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
              @click="showFeedback = false"
            >
              Fermer
            </button>
            <button
              type="button"
              :disabled="!feedback.trim()"
              @click="handleFeedbackSubmit"
              :class="[
                'inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-[11px] md:text-xs font-semibold shadow-sm',
                feedback.trim()
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 transition-colors'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              ]"
            >
              Envoyer mon retour
            </button>
          </div>
        </div>
      </div>

      <!-- Pop-up de remerciement (après envoi, toutes notes) -->
      <div
        v-if="submitted && !showFeedback"
        class="absolute inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center rounded-2xl"
      >
        <div class="w-full rounded-2xl bg-white shadow-xl border border-slate-200 p-4 md:p-5 max-w-xs text-center">
          <h3 class="text-sm md:text-base font-semibold text-slate-900 mb-2">
            Merci beaucoup !
          </h3>
          <p class="text-[11px] md:text-xs text-slate-600 mb-4">
            <template v-if="rating && rating >= 4">
              Votre avis aidera de nombreuses personnes à faire le bon choix.
              <br />
              La page d'évaluation s'est ouverte dans un nouvel onglet juste à côté. 👇
            </template>
            <template v-else>
              Vos retours sont précieux et nous aident à vous offrir une expérience toujours meilleure.
            </template>
          </p>
          <button
            type="button"
            @click="handleCloseThankYou"
            class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-[11px] md:text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors w-full"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Star } from 'lucide-vue-next'

const emit = defineEmits(['close', 'submit'])

const RATING_LABELS = [
  'Très insatisfaisant',
  'Insatisfaisant',
  'Correct',
  'Satisfaisant',
  'Excellent'
]

const rating = ref(null)
const hover = ref(null)
const showFeedback = ref(false)
const feedback = ref('')
const submitted = ref(false)

const current = computed(() => hover.value ?? rating.value)

const currentLabel = computed(() => {
  return current.value
    ? RATING_LABELS[current.value - 1]
    : 'Sélectionnez une note entre 1 et 5 étoiles'
})

const isFilled = (index) => {
  return current.value ? index <= current.value : false
}

const handleSubmit = () => {
  if (!rating.value) return

  if (rating.value <= 3) {
    // Notes 1 à 3 → on demande un retour détaillé en interne
    showFeedback.value = true
  } else {
    // Notes 4 ou 5 → on ouvre la page d'avis public (Google) dans un nouvel onglet
    window.open(
      'https://search.google.com/local/writereview?placeid=ChIJJYVtvN-PwUcReakOMC4wkAw',
      '_blank'
    )
    submitted.value = true
  }
}

const handleFeedbackSubmit = () => {
  // Émettre l'événement avec les données pour sauvegarde en BDD
  emit('submit', { rating: rating.value, feedback: feedback.value })
  console.log('Feedback négatif', { rating: rating.value, feedback: feedback.value })
  showFeedback.value = false
  submitted.value = true
}

const handleCloseThankYou = () => {
  // Émettre l'événement de fermeture finale
  emit('submit', { rating: rating.value, feedback: feedback.value || null })
  emit('close')
}
</script>
