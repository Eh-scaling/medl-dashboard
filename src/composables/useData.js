import { ref } from 'vue'

const MOCK_PROPERTIES = Array.from({ length: 18 }).map((_, i) => ({
  id: `prop_${i + 1}`,
  adresse: `Rue Exemple ${i + 12}, ${1000 + i}`,
  ville: ['Bruxelles', 'Liège', 'Namur', 'Anvers', 'Charleroi', 'Gand'][i % 6],
  region: ['Bruxelles', 'Wallonie', 'Flandre'][i % 3],
  bailleur: ['Immo Atlas', 'SCI Horizon', 'Particulier', 'Foncière Nord'][i % 4],
  statut: ['En cours', 'Clôturé', 'En attente'][i % 3],
  dossiers: Array.from({ length: 3 }).map((__, j) => ({
    id: `dsr_${i + 1}_${j + 1}`,
    reference: `EDL-2025-${String(i * 3 + j + 1).padStart(6, '0')}`,
    libelle: ['État des lieux d\'entrée – 2024', 'État des lieux de sortie – 2025', 'État des lieux d\'entrée – 2025/05/25'][j],
    statut: ['En cours', 'Clôturé', 'En attente'][j % 3],
    locataire: ['Dupont Marie', 'Martin Jean', 'Lefèvre Paul'][j],
    docs: 1 + j,
    photos: 6 + j * 2,
    remarques: j % 2 === 0 ? 1 : 0,
    maj: new Date(Date.now() - (i * 3 + j) * 36e5).toISOString()
  }))
}))

const MOCK_APPOINTMENTS = [
  { id: 'apt_1', reference: 'RDV-2025-000001', date: new Date(Date.now() + 2 * 86400000).toISOString(), heure: '14:30', type: 'Entrée', statut: 'En cours', client: 'Dupont Marie', propertyId: 'prop_1' },
  { id: 'apt_2', reference: 'RDV-2025-000002', date: new Date(Date.now() + 5 * 86400000).toISOString(), heure: '10:00', type: 'Sortie', statut: 'En cours', client: 'Martin Jean', propertyId: 'prop_2' },
  { id: 'apt_3', reference: 'RDV-2025-000003', date: new Date(Date.now() - 2 * 86400000).toISOString(), heure: '16:00', type: 'Expertise', statut: 'Clôturé', client: 'Lefèvre Paul', propertyId: 'prop_3' },
  { id: 'apt_4', reference: 'RDV-2025-000004', date: new Date(Date.now() + 1 * 86400000).toISOString(), heure: '09:00', type: 'Entrée', statut: 'En attente', client: 'Nouveau Client', propertyId: null },
  { id: 'apt_5', reference: 'RDV-2025-000005', date: new Date(Date.now() + 7 * 86400000).toISOString(), heure: '11:30', type: 'Avant travaux', statut: 'En cours', client: 'Société Réno+', propertyId: null },
  { id: 'apt_6', reference: 'RDV-2025-000006', date: new Date(Date.now() + 3 * 86400000).toISOString(), heure: '15:00', type: 'Sortie', statut: 'En cours', client: 'Garcia Lopez', propertyId: 'prop_1' },
  { id: 'apt_7', reference: 'RDV-2025-000007', date: new Date(Date.now() + 10 * 86400000).toISOString(), heure: '13:00', type: 'Après travaux', statut: 'En cours', client: 'Chen Wei', propertyId: null },
  { id: 'apt_8', reference: 'RDV-2025-000008', date: new Date(Date.now() + 4 * 86400000).toISOString(), heure: '08:30', type: 'Entrée', statut: 'En attente', client: 'Sophie Martin', propertyId: 'prop_5' },
  { id: 'apt_9', reference: 'RDV-2025-000009', date: new Date(Date.now() + 6 * 86400000).toISOString(), heure: '14:00', type: 'Compétence', statut: 'En cours', client: 'Tech Expert SARL', propertyId: 'prop_2' },
  { id: 'apt_10', reference: 'RDV-2025-000010', date: new Date(Date.now() + 8 * 86400000).toISOString(), heure: '10:30', type: 'Avant travaux', statut: 'En cours', client: 'Reno Pro', propertyId: 'prop_4' }
]

export function useData() {
  const properties = ref(MOCK_PROPERTIES)
  const appointments = ref(MOCK_APPOINTMENTS)

  const linkAppointment = (aptId, propId) => {
    const apt = appointments.value.find(a => a.id === aptId)
    if (apt) apt.propertyId = propId
  }

  return { properties, appointments, linkAppointment }
}
