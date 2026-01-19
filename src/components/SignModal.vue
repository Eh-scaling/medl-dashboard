<template>
  <div 
    @click="$emit('close')" 
    class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 py-10 overflow-y-auto"
  >
    <div 
      @click.stop 
      class="relative w-full max-w-6xl my-auto"
    >
      <div class="rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        <!-- Top bar -->
        <div class="p-5 md:p-6 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div class="flex items-start gap-3">
              <div class="rounded-2xl bg-emerald-100 p-2.5 shrink-0">
                <FileSignature class="h-5 w-5 text-emerald-700" />
              </div>
              <div class="min-w-0">
                <div class="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-medium mb-2">
                  <Lock class="h-3.5 w-3.5" />
                  Signature conforme & juridiquement valable
                </div>
                <h1 class="text-lg md:text-xl font-semibold tracking-tight leading-tight">
                  Envoyez la signature aux parties (bailleurs, locataires, garants)
                </h1>
                <p class="text-xs text-slate-600 mt-1 truncate">
                  <span class="inline-flex items-center gap-1">
                    <Home class="h-3.5 w-3.5" />
                    {{ doc.address }}
                  </span>
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between md:justify-end gap-3">
              <div class="flex items-center gap-4">
                <!-- Pricing card -->
                <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2">
                  <div class="text-right">
                    <p class="text-[10px] text-slate-500 leading-none">Coût unique</p>
                    <p class="text-base font-semibold text-slate-900 leading-tight">
                      {{ SIGN_PRICE_EUR.toFixed(2) }}€ 
                      <span class="text-[10px] font-medium text-slate-500">TTC</span>
                    </p>
                  </div>

                  <div class="h-8 w-px bg-slate-200" />

                  <div class="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 class="h-4 w-4 text-emerald-600" />
                    <span><strong>1 245</strong> signatures</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress -->
          <div class="mt-4">
            <div class="flex items-center justify-between text-[11px] text-slate-500">
              <span :class="{ 'font-medium text-slate-800': step === 1 }">
                1. Ajouter les parties
              </span>
              <span :class="{ 'font-medium text-slate-800': step === 2 }">
                2. Vérifier & envoyer
              </span>
            </div>
            <div class="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div 
                class="h-full rounded-full bg-emerald-600 transition-all duration-300"
                :class="step === 1 ? 'w-1/2' : 'w-full'"
              />
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="p-5 md:p-6">
          <!-- Doc preview -->
          <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <div class="h-12 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-500">
              PDF
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-900 truncate">{{ doc.title }}</p>
              <p class="text-xs text-slate-600 truncate">
                {{ doc.address }} · {{ doc.pages }} pages · 
                <span class="text-slate-500">Réf. {{ doc.id }}</span>
              </p>
            </div>
            <div class="ml-auto hidden sm:flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck class="h-4 w-4 text-emerald-600" />
              <span>Traçabilité & horodatage</span>
            </div>
          </div>

          <!-- Value props -->
          <div class="mt-4 hidden lg:grid grid-cols-3 gap-2 text-[11px] md:text-xs font-medium text-slate-700">
            <div class="flex flex-col items-center gap-1 rounded-2xl bg-emerald-50 py-2.5">
              <ShieldCheck class="h-4 w-4" />
              <span>Sécurisé</span>
            </div>
            <div class="flex flex-col items-center gap-1 rounded-2xl bg-emerald-50 py-2.5">
              <Sparkles class="h-4 w-4" />
              <span>Rapide</span>
            </div>
            <div class="flex flex-col items-center gap-1 rounded-2xl bg-emerald-50 py-2.5">
              <Users class="h-4 w-4" />
              <span>Multi-parties</span>
            </div>
          </div>

          <div class="mt-5">
            <!-- Step 1 -->
            <div v-if="step === 1" class="rounded-2xl border border-slate-200 bg-white p-4">
              <div class="flex items-start gap-2">
                <div class="mt-0.5">
                  <Info class="h-4 w-4 text-slate-500" />
                </div>
                <div class="text-sm text-slate-700">
                  <p class="font-semibold text-slate-900">Ajoutez toutes les personnes qui doivent signer</p>
                  <p class="mt-1 text-xs leading-relaxed text-slate-600">
                    Toutes les <strong>parties mentionnées dans le contrat</strong> doivent signer l'état des lieux.<br />
                    Merci d'indiquer l'adresse e-mail de <strong>chaque bailleur, locataire et garant</strong> 
                    afin qu'ils puissent recevoir leur lien de signature sécurisé.
                  </p>
                </div>
              </div>

              <div class="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  @click="importFromAppointment"
                  class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Users class="h-4 w-4" />
                  Importer les contacts du rendez-vous
                </button>
              </div>

              <!-- Grid des rôles -->
              <div class="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div 
                  v-for="role in roles" 
                  :key="role" 
                  class="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-xs font-semibold text-slate-900">{{ roleTitle(role) }}(s)</p>
                      <p class="text-[11px] text-slate-600 mt-0.5">{{ roleHint(role) }}</p>
                    </div>
                    <button
                      type="button"
                      @click="addParty(role)"
                      class="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Plus class="h-4 w-4 mr-1" />
                      Ajouter
                    </button>
                  </div>

                  <div class="mt-3 space-y-2">
                    <div 
                      v-for="(party, idx) in grouped[role]" 
                      :key="party.id" 
                      class="flex items-center gap-2"
                    >
                      <div class="flex-1">
                        <div class="relative">
                          <Mail class="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="email"
                            v-model="party.email"
                            :class="[
                              'w-full rounded-xl border px-10 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500',
                              getEmailValidationClass(party.email)
                            ]"
                            :placeholder="`${roleTitle(role).toLowerCase()}${idx ? idx + 1 : ''}@exemple.be`"
                          />
                          <span 
                            v-if="party.email.trim().length > 0"
                            :class="[
                              'absolute right-3 top-2.5 text-[11px] font-medium',
                              isEmail(party.email) ? 'text-emerald-700' : 'text-rose-600'
                            ]"
                          >
                            {{ isEmail(party.email) ? 'OK' : 'Email invalide' }}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        @click="removeParty(party.id)"
                        :disabled="!isRemovable(role)"
                        :title="!isRemovable(role) && role !== 'garant' ? 'Au moins 1 bailleur et 1 locataire requis' : 'Supprimer'"
                        :class="[
                          'h-10 w-10 inline-flex items-center justify-center rounded-xl border transition-colors',
                          isRemovable(role)
                            ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        ]"
                      >
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>

                    <p v-if="grouped[role].length === 0 && role === 'garant'" class="text-[11px] text-slate-500">
                      Aucun garant renseigné.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Messages d'erreur -->
              <div class="mt-4 space-y-1">
                <p v-if="!hasMinRoles" class="text-[11px] text-rose-600">
                  Ajoute au minimum <strong>1 bailleur</strong> et <strong>1 locataire</strong>.
                </p>
                <p v-if="invalidCount > 0" class="text-[11px] text-rose-600">
                  {{ invalidCount }} email{{ invalidCount > 1 ? 's' : '' }} invalide{{ invalidCount > 1 ? 's' : '' }}.
                </p>
                <p v-if="duplicates" class="text-[11px] text-rose-600">
                  Des emails sont en double. Chaque signataire doit être unique.
                </p>
              </div>
            </div>

            <!-- Step 2 -->
            <div v-else class="rounded-2xl border border-slate-200 bg-white p-4">
              <div class="flex items-start gap-2">
                <CheckCircle2 class="h-4 w-4 text-emerald-600 mt-0.5" />
                <div>
                  <p class="text-sm font-semibold text-slate-900">Récapitulatif avant envoi</p>
                  <p class="mt-1 text-xs leading-relaxed text-slate-600">
                    Nous allons envoyer un lien de signature sécurisé à chaque personne.
                    <span class="text-slate-500"> Vous pourrez suivre l'avancement depuis votre espace.</span>
                  </p>
                </div>
              </div>

              <div class="mt-4 rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-800">
                <div class="flex items-start gap-2">
                  <span class="mt-0.5">✔</span>
                  <span>
                    <strong>Recommandé</strong> — réduit les contestations et accélère la remise des clés.
                  </span>
                </div>
              </div>

              <!-- Récapitulatif par rôle -->
              <div class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div 
                  v-for="role in roles" 
                  :key="role" 
                  class="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                >
                  <p class="text-xs font-semibold text-slate-900">{{ roleTitle(role) }}(s)</p>
                  <div class="mt-2 space-y-1">
                    <div 
                      v-if="grouped[role].length"
                      v-for="party in grouped[role]" 
                      :key="party.id"
                      class="flex items-center justify-between gap-3 rounded-xl bg-white border border-slate-200 px-3 py-2"
                    >
                      <span class="text-xs text-slate-600 truncate">{{ party.label ?? roleTitle(role) }}</span>
                      <span class="text-xs font-medium text-slate-900 truncate max-w-[65%]">{{ party.email }}</span>
                    </div>
                    <p v-else class="text-[11px] text-slate-500">Aucun</p>
                  </div>
                </div>
              </div>

              <p class="mt-4 text-[10px] text-slate-500 leading-snug">
                RGPD : les emails servent uniquement à la signature de ce document. Traçabilité, horodatage et preuve de
                consentement inclus.
              </p>
            </div>
          </div>
        </div>

        <!-- Barre d'actions sticky -->
        <div class="sticky bottom-0 z-20 px-5 md:px-6 py-4 border-t border-slate-200 bg-white/95 backdrop-blur">
          <div v-if="step === 1" class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <button
              type="button"
              @click="$emit('close')"
              class="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Plus tard
            </button>

            <button
              type="button"
              @click="goNext"
              :disabled="!formOk"
              :class="[
                'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold shadow-sm transition-colors',
                formOk
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              ]"
            >
              Continuer
              <ChevronRight class="h-4 w-4 ml-1" />
            </button>
          </div>

          <div v-else class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <button
              type="button"
              @click="step = 1"
              class="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Modifier
            </button>

            <div class="flex flex-col items-stretch sm:items-end gap-1">
              <button
                type="button"
                @click="submit"
                :disabled="!formOk || busy"
                :class="[
                  'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold shadow-sm transition-colors',
                  formOk && !busy
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                ]"
              >
                <FileSignature class="h-4 w-4 mr-2" />
                {{ busy ? 'Envoi en cours…' : `Envoyer les demandes de signature · ${SIGN_PRICE_EUR.toFixed(2)}€` }}
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 md:px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div class="flex items-center justify-between gap-3 text-[11px] text-slate-600">
            <div class="flex items-center gap-2">
              <Lock class="h-4 w-4 text-emerald-600" />
              <span>Connexion chiffrée</span>
            </div>
            <div class="flex items-center gap-2">
              <ShieldCheck class="h-4 w-4 text-emerald-600" />
              <span>Preuve légale</span>
            </div>
            <div class="hidden sm:flex items-center gap-2">
              <Sparkles class="h-4 w-4 text-emerald-600" />
              <span>Simple & rapide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  FileSignature, ShieldCheck, Sparkles, Lock, ChevronRight, Mail, 
  Home, CheckCircle2, Info, Plus, Trash2, Users 
} from 'lucide-vue-next'

defineEmits(['close'])

// Constants
const SIGN_PRICE_EUR = 9.99
const roles = ['bailleur', 'locataire', 'garant']

// State
const step = ref(1)
const busy = ref(false)

const parties = ref([
  { 
    id: uid(), 
    role: 'bailleur', 
    email: 'bailleur@exemple.be', 
    label: 'Bailleur' 
  },
  { 
    id: uid(), 
    role: 'locataire', 
    email: 'locataire@exemple.be', 
    label: 'Locataire' 
  }
])

const doc = {
  title: "État des lieux d'entrée",
  address: "Rue Exemple 12, 1000 Bruxelles",
  pages: 8,
  id: "EDL-2026-001245"
}

// Helpers
function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

function roleTitle(role) {
  const titles = {
    bailleur: 'Bailleur',
    locataire: 'Locataire',
    garant: 'Garant'
  }
  return titles[role] || role
}

function roleHint(role) {
  const hints = {
    bailleur: 'Reçoit un lien sécurisé pour signer côté propriétaire',
    locataire: 'Reçoit un lien sécurisé pour signer côté locataire',
    garant: 'Reçoit un lien sécurisé pour signer en tant que garant'
  }
  return hints[role] || ''
}

// Computed
const grouped = computed(() => {
  const result = { bailleur: [], locataire: [], garant: [] }
  parties.value.forEach(p => {
    result[p.role].push(p)
  })
  return result
})

const hasMinRoles = computed(() => {
  return grouped.value.bailleur.length >= 1 && grouped.value.locataire.length >= 1
})

const allFilled = computed(() => {
  return parties.value.every(p => p.email.trim().length > 0)
})

const allValid = computed(() => {
  return parties.value.every(p => isEmail(p.email))
})

const invalidCount = computed(() => {
  return parties.value.reduce((acc, p) => {
    return acc + (p.email.trim().length > 0 && !isEmail(p.email) ? 1 : 0)
  }, 0)
})

const duplicates = computed(() => {
  const seen = new Set()
  for (const p of parties.value) {
    const e = p.email.trim().toLowerCase()
    if (!e) continue
    if (seen.has(e)) return true
    seen.add(e)
  }
  return false
})

const formOk = computed(() => {
  return hasMinRoles.value && allFilled.value && allValid.value && !duplicates.value
})

// Methods
function getEmailValidationClass(email) {
  if (email.trim().length === 0) return 'border-slate-200'
  return isEmail(email) ? 'border-emerald-200' : 'border-rose-200'
}

function isRemovable(role) {
  if (role === 'garant') return true
  return grouped.value[role].length > 1
}

function addParty(role) {
  const idx = grouped.value[role].length + 1
  parties.value.push({
    id: uid(),
    role,
    email: '',
    label: `${roleTitle(role)} ${idx}`
  })
}

function removeParty(id) {
  parties.value = parties.value.filter(p => p.id !== id)
}

function importFromAppointment() {
  parties.value = [
    { id: uid(), role: 'bailleur', email: 'bailleur1@exemple.be', label: 'Bailleur 1' },
    { id: uid(), role: 'bailleur', email: 'bailleur2@exemple.be', label: 'Bailleur 2' },
    { id: uid(), role: 'locataire', email: 'locataire@exemple.be', label: 'Locataire' },
    { id: uid(), role: 'garant', email: 'garant@exemple.be', label: 'Garant' }
  ]
}

function goNext() {
  if (step.value === 1) step.value = 2
}

async function submit() {
  if (!formOk.value) return
  
  busy.value = true
  await new Promise(resolve => setTimeout(resolve, 900))
  busy.value = false

  const byRole = {
    bailleur: grouped.value.bailleur.map(p => p.email),
    locataire: grouped.value.locataire.map(p => p.email),
    garant: grouped.value.garant.map(p => p.email)
  }

  alert(
    '✅ Invitations envoyées (démo)\n\n' +
    `Bailleurs: ${byRole.bailleur.join(', ')}\n` +
    `Locataires: ${byRole.locataire.join(', ')}\n` +
    (byRole.garant.length ? `Garants: ${byRole.garant.join(', ')}` : '')
  )
}
</script>
