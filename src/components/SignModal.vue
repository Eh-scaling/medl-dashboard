<template>
  <div @click="$emit('close')" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
    <div @click.stop class="bg-white rounded-2xl shadow-xl max-w-xl w-full">
      <div class="bg-gradient-to-r from-primary/10 to-emerald-100 p-5 rounded-t-2xl">
        <div class="flex items-center gap-3">
          <FileSignature class="w-6 h-6 text-primary" />
          <div>
            <h3 class="text-lg font-bold">Signature électronique</h3>
            <p class="text-sm text-gray-700">Le document peut être signé en une seule fois par l'ensemble des parties</p>
          </div>
        </div>
      </div>

      <div class="p-6 space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-700 mb-1 block">Email du bailleur</label>
            <input v-model="bailleurEmail" type="email" placeholder="bailleur@exemple.be" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 mb-1 block">Email du locataire</label>
            <input v-model="locataireEmail" type="email" placeholder="locataire@exemple.be" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
          </div>
        </div>

        <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
          <ShieldCheck class="w-5 h-5 text-amber-700 mt-0.5" />
          <div class="text-xs text-amber-900">
            <p class="font-semibold mb-1">Sécurité et confidentialité</p>
            <p>Un lien sécurisé sera envoyé à chaque partie. Le service a un coût de <span class="font-bold">9.99€</span> TTC.</p>
          </div>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Un lien sécurisé sera envoyé à chaque partie</span>
          <span class="font-bold text-primary">9.99€</span>
        </div>
      </div>

      <div class="border-t p-5 flex items-center justify-end gap-2 bg-gray-50 rounded-b-2xl">
        <button @click="$emit('close')" class="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition">Annuler</button>
        <button @click="handleSign" :disabled="!bothValid" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-emerald-600 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          <FileSignature class="w-4 h-4" />
          Continuer · 9.99€
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FileSignature, ShieldCheck } from 'lucide-vue-next'

defineEmits(['close'])

const bailleurEmail = ref('')
const locataireEmail = ref('')

const isEmail = (s) => /.+@.+\..+/.test(s)

const bothValid = computed(() => isEmail(bailleurEmail.value) && isEmail(locataireEmail.value))

const handleSign = () => {
  if (!bothValid.value) return
  alert('Demande de signature envoyée aux deux parties !')
}
</script>
