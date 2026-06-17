/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  TakkIUser, 
  EmergencyContact, 
  MedicalInfo, 
  QRCodeData, 
  ScanHistoryEntry, 
  ScanAlert, 
  ServiceUrgenceRegion, 
  MedicalFacility, 
  SubscriptionData,
  AuditLog
} from './types';

// French and Wolof translations dictionary
export const translations = {
  fr: {
    app_name: "Takk-i",
    subtitle: "Votre identité médicale d'urgence au Sénégal",
    warning_confidentiality: "Les informations affichées sont destinées uniquement à aider cette personne en cas d'urgence. Merci de respecter la confidentialité des données. Service sécurisé Takk-i.",
    blood_group: "Groupe Sanguin",
    severe_allergies: "Allergies graves",
    emergency_contacts: "Contacts d'urgence",
    call_contact: "Appeler le contact",
    call_samu: "Appeler le SAMU (15)",
    call_police: "Appeler la Police (17)",
    call_pompiers: "Sapeurs-Pompiers (18)",
    medical_access_secured: "Accès médical sécurisé",
    enter_facility_pin: "Veuillez saisir le code PIN de l'établissement de santé pour accéder aux données privées détaillées.",
    invalid_pin: "Code PIN incorrect ou expiré. Veuillez vérifier auprès de votre établissement.",
    submit: "Valider",
    cancel: "Annuler",
    verified_facility: "Établissement vérifié",
    autonomous_protection: "Sécurisé par la CDP · Loi n°2008-12",
    private_data_header: "Données privées (Accès médical restreint)",
    phone: "Téléphone",
    address: "Adresse personnelle",
    treatments: "Traitements en cours",
    medical_history: "Antécédents médicaux",
    treating_physician: "Médecin traitant",
    assurance_provider: "Assurance médicale / Mutuelle",
    notes: "Notes cliniques",
    days_left: "jours restants",
    qr_suspended: "Ce QR code a été désactivé",
    qr_suspended_desc: "Ce support d'urgence (bracelet, carte ou sticker) a été signalé perdu ou volé par son propriétaire. Les informations médicales ont été verrouillées par mesure de sécurité.",
    lost_stolen_report: "Signaler perdu/volé",
    active_state: "Actif",
    inactive_state: "Désactivé",
    language: "Langue",
    home: "Accueil",
    my_dashboard: "Mon Tableau de bord",
    admin_space: "Espace Admin",
    scan_public_link: "Scan public",
  },
  wo: {
    app_name: "Takk-i",
    subtitle: "Sa rënnu wér-gi-yaram ci jami urgence",
    warning_confidentiality: "Sart yiy wone ci xët wi rëndu na ngir jappale kii ci jami nattu. Nanu rëndu lëkkale gu dëgër gi. Takk-i dakar dëgër na.",
    blood_group: "Déreét (Groupe)",
    severe_allergies: "Allergi yu rëy",
    emergency_contacts: "Ku jokkoo bu jami nattu",
    call_contact: "Wootel jokkoo bi",
    call_samu: "Wootel SAMU (15)",
    call_police: "Wootel Police (17)",
    call_pompiers: "Sapeurs-Pompiers (18)",
    medical_access_secured: "Ubbil dottoré bi mu dëgër",
    enter_facility_pin: "Mbindal PIN lakk (6 sunu nimero) bi hopital bi am ngir guiss leppa ci mbir yi lal.",
    invalid_pin: "PIN bi baaxul mba talli na. Seetal hopital bi.",
    submit: "Weral",
    cancel: "Dembere",
    verified_facility: "Hopital bi werr na",
    autonomous_protection: "Dëgëral na CDP · Loi n°2008-12",
    private_data_header: "Sa mbir yi lal (Dottoré rek)",
    phone: "Téléphone",
    address: "Kër gu mu dëkk",
    treatments: "Fadj yi mu nékkë",
    medical_history: "Mbir wér-gi-yaram yi passé",
    treating_physician: "Dottoré wem",
    assurance_provider: "Faddë ga (Assurance / Mutuelle)",
    notes: "Tékkital fadj",
    days_left: "fann des na",
    qr_suspended: "QR Code bi dafay dakkal",
    qr_suspended_desc: "Takk-i bracelet, karte mba etiket bi reer na wala da nu ko sathie. Mbiram yi dañu ko tëj ngir mu baax.",
    lost_stolen_report: "Wone ne reer na / sathie na",
    active_state: "Nekka ci jokkoo",
    inactive_state: "Dax na",
    language: "Lakk",
    home: "Diouway",
    my_dashboard: "Sama xët",
    admin_space: "Espace Admin",
    scan_public_link: "Scan dëgër",
  }
};

// Initial health facilities authorized with PIN codes (L’accès médical fonctionne via un code PIN à 6 chiffres attribué par établissement de santé)
export const initialFacilities: MedicalFacility[] = [
  {
    id: "HPD",
    nom: "Hôpital Principal de Dakar",
    ville: "Dakar",
    code_pin: "151515",
    date_expiration: "2026-10-15T00:00:00Z" // active for 6 months
  },
  {
    id: "HDO",
    nom: "Hôpital de Grand Yoff (HOGY)",
    ville: "Dakar",
    code_pin: "151700",
    date_expiration: "2026-10-01T00:00:00Z"
  },
  {
    id: "HRP",
    nom: "Hôpital Régional de Thiès",
    ville: "Thiès",
    code_pin: "700140",
    date_expiration: "2026-11-20T00:00:00Z"
  },
  {
    id: "CHSL",
    nom: "Centre Hospitalier Régional de Saint-Louis",
    ville: "Saint-Louis",
    code_pin: "320320",
    date_expiration: "2026-04-12T00:00:00Z" // expired / soon to register
  },
  {
    id: "PAST",
    nom: "Clinique Pasteur",
    ville: "Dakar",
    code_pin: "444222",
    date_expiration: "2026-12-05T00:00:00Z"
  }
];

// Initial users in Senegal
export const initialUsers: TakkIUser[] = [
  {
    id: "TAKKI-4821",
    nom: "Tidiane",
    prenom: "Amadou",
    date_naissance: "1994-10-18",
    photo: "👨🏾‍💼", // Avatar model decoration
    telephone: "+221 77 318 26 43",
    email: "amadou.tidiane@gmail.com",
    mot_de_passe: "$2a$10$UnX81n88jGsmG9Fp/y4oH.D46M7BdfIidWeeEw2b2Yp7Gv399vFDe", // Simulating encrypted pw
    groupe_sanguin: "A+",
    region: "Dakar",
    ville: "Dakar Plateau",
    quartier: "Sandaga",
    gps_latitude: 14.6756,
    gps_longitude: -17.4358,
    mode_urgence: false,
    date_creation: "2025-12-10T11:42:00Z"
  },
  {
    id: "TAKKI-1190",
    nom: "Diallo",
    prenom: "Mariama",
    date_naissance: "1989-11-03",
    photo: "👩🏾‍⚕️",
    telephone: "+221 76 345 88 12",
    email: "mariama.diallo89@yahoo.fr",
    mot_de_passe: "$2a$10$vG/p7vKqZ7X5MepX8H12I.S98Q7Zdf91ee9w0bMb1pGGv99vFD11",
    groupe_sanguin: "O-",
    region: "Thiès",
    ville: "Thiès",
    quartier: "Mbour I",
    gps_latitude: 14.7912,
    gps_longitude: -16.9234,
    mode_urgence: true, // Emergency triggered! 
    date_creation: "2025-11-05T09:12:00Z"
  },
  {
    id: "TAKKI-8812",
    nom: "Diop",
    prenom: "Amadou",
    date_naissance: "1975-04-25",
    photo: "👨🏾",
    telephone: "+221 78 890 22 11",
    email: "amadou.diop.galsen@gmail.com",
    mot_de_passe: "$2a$10$oY7nMpW6S8K9GepV9H.O4P.Z99Wdf91eeEw0v9bMb7pGQv99vJDff",
    groupe_sanguin: "B-",
    region: "Saint-Louis",
    ville: "Saint-Louis",
    quartier: "Ndar",
    gps_latitude: 16.0244,
    gps_longitude: -16.4891,
    mode_urgence: false,
    date_creation: "2026-02-14T17:35:00Z"
  },
  {
    id: "TAKKI-7733",
    nom: "Sow",
    prenom: "Penda",
    date_naissance: "2001-07-22",
    photo: "👩🏾",
    telephone: "+221 70 234 11 99",
    email: "penda.sow.touba@gmail.com",
    mot_de_passe: "$2a$10$bUnX6nI2xGepK8Fp/y4oH.Z9M7YdfIidWeeEw2b2Yp7Gv399vFDe22",
    groupe_sanguin: "B+",
    region: "Diourbel",
    ville: "Touba",
    quartier: "Gouye Mame Diarra",
    gps_latitude: 14.8611,
    gps_longitude: -15.8856,
    mode_urgence: false,
    date_creation: "2026-03-20T08:14:00Z"
  }
];

// Initial medical information records (Private or public depending on level)
export const initialMedicalInfos: MedicalInfo[] = [
  {
    id: "MED-4821",
    user_id: "TAKKI-4821",
    maladies: "je suis epileptique",
    allergies: "Chocolat",
    traitements: "Képpra 500mg (1 comprimé matin et soir)",
    antecedents: "Crises convulsives identifiées depuis 2018",
    medecin_traitant: "Dr. Lamine Ndiaye (+221 77 123 45 67)",
    assurance: "IPM Senelec - N° Ref: SL-2025-48",
    notes_medicales: "Patient très rigoureux sur ses prises. Pression systolique moyenne de 125 mmHg."
  },
  {
    id: "MED-1190",
    user_id: "TAKKI-1190",
    maladies: "Diabète de type 1 insulino-dépendant",
    allergies: "ALLERGIE GRAVE À LA PÉNICILLINE (choc anaphylactique)",
    traitements: "Lantus 24 UI au coucher, Novorapide avec les repas (3 fois par jour)",
    antecedents: "Hospitalisation pour acidocétose en 2024",
    medecin_traitant: "Dr. Aissatou Fall (+221 76 998 88 12)",
    assurance: "AXA Sénégal - Police N° AX-990-21D",
    notes_medicales: "Porteuse d'une pompe à insuline ou seringue dans son sac en permanence."
  },
  {
    id: "MED-8812",
    user_id: "TAKKI-8812",
    maladies: "Insuffisance cardiaque légère stable",
    allergies: "Allergie aux sulfamides",
    traitements: "Ramipril 2.5mg, Furosémide 40mg (uniquement si œdème)",
    antecedents: "Chirurgie de revascularisation coronaire en France en 2021",
    medecin_traitant: "Dr. Olivier Sagna (+221 70 887 77 22)",
    assurance: "Mutuelle de la Santé Publique du Sénégal",
    notes_medicales: "Surveillance de la fonction cardiaque requise chaque trimestre."
  },
  {
    id: "MED-7733",
    user_id: "TAKKI-7733",
    maladies: "Asthme d'effort",
    allergies: "Allergie aux acariens et à la poussière",
    traitements: "Ventoline inhalateur (au besoin)",
    antecedents: "Aucun antécédent chirurgical majeur",
    medecin_traitant: "Docteur de garde Poste de Santé Touba",
    assurance: "Aucune (Régime Direct)",
    notes_medicales: "Asthme bien contrôlé, pas de crise rapportée nécessitant une corticothérapie orale récente."
  }
];

// Initial emergency contacts (Primary and secondary)
export const initialEmergencyContacts: EmergencyContact[] = [
  {
    id: "C-4821-1",
    user_id: "TAKKI-4821",
    nom_contact: "Fatou Diop",
    telephone_contact: "+221 773182643",
    relation: "Cousine",
    priorite: 1
  },
  {
    id: "C-4821-2",
    user_id: "TAKKI-4821",
    nom_contact: "Ami Aw",
    telephone_contact: "772091413",
    relation: "Tante",
    priorite: 2
  },
  {
    id: "C-1190-1",
    user_id: "TAKKI-1190",
    nom_contact: "Abdou Diallo",
    telephone_contact: "+221 77 810 99 99",
    relation: "Époux",
    priorite: 1
  },
  {
    id: "C-8812-1",
    user_id: "TAKKI-8812",
    nom_contact: "Seynabou Diop",
    telephone_contact: "+221 78 505 44 44",
    relation: "Fille",
    priorite: 1
  },
  {
    id: "C-7733-1",
    user_id: "TAKKI-7733",
    nom_contact: "Modou Sow",
    telephone_contact: "+221 70 514 11 22",
    relation: "Père",
    priorite: 1
  }
];

// Initial QR codes configuration 
export const initialQRCodes: QRCodeData[] = [
  {
    id: "QR-4821",
    user_id: "TAKKI-4821",
    code_unique: "TAKKI-4821",
    url_profil: "takki.sn/u/4821",
    date_creation: "2025-12-10T11:42:00Z",
    statut: "actif"
  },
  {
    id: "QR-1190",
    user_id: "TAKKI-1190",
    code_unique: "TAKKI-1190",
    url_profil: "takki.sn/u/1190",
    date_creation: "2025-11-05T09:12:00Z",
    statut: "actif"
  },
  {
    id: "QR-8812",
    user_id: "TAKKI-8812",
    code_unique: "TAKKI-8812",
    url_profil: "takki.sn/u/8812",
    date_creation: "2026-02-14T17:35:00Z",
    statut: "suspendu" // Loss / Stolen reported in Spec 3.4 & 3.5 & 4
  },
  {
    id: "QR-7733",
    user_id: "TAKKI-7733",
    code_unique: "TAKKI-7733",
    url_profil: "takki.sn/u/7733",
    date_creation: "2026-03-20T08:14:00Z",
    statut: "actif"
  }
];

// Initial scan activity logs (Spec 4: "Historique des scans")
export const initialScanHistory: ScanHistoryEntry[] = [
  {
    id: "SCAN-001",
    qr_code_id: "TAKKI-4821",
    user_id: "TAKKI-4821",
    date_scan: "2026-06-03",
    heure_scan: "14:22",
    type_scanner: "citoyen",
    gps_scan_lat: 14.6756,
    gps_scan_long: -17.4358,
    localisation: "Dakar Plateau",
    appareil: "Téléphone Android · Orange SN"
  },
  {
    id: "SCAN-002",
    qr_code_id: "TAKKI-4821",
    user_id: "TAKKI-4821",
    date_scan: "2026-06-03",
    heure_scan: "09:04",
    type_scanner: "professionnel",
    gps_scan_lat: 14.6811,
    gps_scan_long: -17.4262,
    localisation: "Hôpital Principal",
    appareil: "Clinique Mobile · Code HPD-15",
    code_etablissement: "HPD"
  },
  {
    id: "SCAN-003",
    qr_code_id: "TAKKI-4821",
    user_id: "TAKKI-4821",
    date_scan: "2026-06-02",
    heure_scan: "18:51",
    type_scanner: "citoyen",
    gps_scan_lat: 14.7912,
    gps_scan_long: -16.9234,
    localisation: "Thiès Gare",
    appareil: "Téléphone iPhone · Free SN"
  },
  {
    id: "SCAN-004",
    qr_code_id: "TAKKI-4821",
    user_id: "TAKKI-4821",
    date_scan: "2026-05-31",
    heure_scan: "11:15",
    type_scanner: "professionnel",
    gps_scan_lat: 14.6854,
    gps_scan_long: -17.4478,
    localisation: "Clinique Pasteur",
    appareil: "Médecin d'Urgence · Code PAST-44",
    code_etablissement: "PAST"
  },
  {
    id: "SCAN-1191",
    qr_code_id: "TAKKI-1190",
    user_id: "TAKKI-1190",
    date_scan: "2026-06-03",
    heure_scan: "15:05",
    type_scanner: "citoyen",
    gps_scan_lat: 14.795,
    gps_scan_long: -16.921,
    localisation: "Thiès centre",
    appareil: "Téléphone Android · Orange SN"
  },
  {
    id: "SCAN-1192",
    qr_code_id: "TAKKI-1190",
    user_id: "TAKKI-1190",
    date_scan: "2026-06-03",
    heure_scan: "15:10",
    type_scanner: "citoyen",
    gps_scan_lat: 14.794,
    gps_scan_long: -16.920,
    localisation: "Thiès Mbour I",
    appareil: "Téléphone Android · Orange SN"
  },
  {
    id: "SCAN-1193",
    qr_code_id: "TAKKI-1190",
    user_id: "TAKKI-1190",
    date_scan: "2026-06-03",
    heure_scan: "15:12",
    type_scanner: "assistant",
    gps_scan_lat: 14.793,
    gps_scan_long: -16.919,
    localisation: "Thiès Mbour I",
    appareil: "Téléphone iPhone · Free SN"
  },
  {
    id: "SCAN-1194",
    qr_code_id: "TAKKI-1190",
    user_id: "TAKKI-1190",
    date_scan: "2026-06-03",
    heure_scan: "15:13",
    type_scanner: "citoyen",
    gps_scan_lat: 14.792,
    gps_scan_long: -16.918,
    localisation: "Thiès Mbour I",
    appareil: "Téléphone Android · Orange SN"
  },
  {
    id: "SCAN-1195",
    qr_code_id: "TAKKI-1190",
    user_id: "TAKKI-1190",
    date_scan: "2026-06-03",
    heure_scan: "15:14",
    type_scanner: "citoyen",
    gps_scan_lat: 14.791,
    gps_scan_long: -16.917,
    localisation: "Thiès Mbour I",
    appareil: "Téléphone Chrome · Orange SN"
  } // Sum is 5+ scans in the current hour, creating an active alert in global view!
];

// Initial regional emergency contacts (Spec 3.7: "Table Services Urgence")
export const initialRegionalServices: ServiceUrgenceRegion[] = [
  {
    id: "SRV-DKR",
    region: "Dakar",
    ville: "Dakar",
    police: "17",
    pompiers: "18",
    samu: "15",
    hopital_reference: "Hôpital Principal de Dakar (HPD)"
  },
  {
    id: "SRV-THS",
    region: "Thiès",
    ville: "Thiès",
    police: "+221 33 951 10 17",
    pompiers: "18",
    samu: "15",
    hopital_reference: "Hôpital Régional de Thiès"
  },
  {
    id: "SRV-STL",
    region: "Saint-Louis",
    ville: "Saint-Louis",
    police: "+221 33 961 10 17",
    pompiers: "18",
    samu: "15",
    hopital_reference: "CH Saint-Louis"
  }
];

// Preloaded active alert triggers
export const initialAlerts: ScanAlert[] = [
  {
    id: "AL-101",
    user_id: "TAKKI-1190",
    qr_code_id: "TAKKI-1190",
    date_alerte: "2026-06-03",
    heure_alerte: "15:14",
    description: "9 scans détectés en 45 min — Possible cas d'urgence grave sur la voie publique à Thiès Mbour I",
    scans_count: 9,
    statut: "actif"
  }
];

// Subscriptions
export const initialSubscriptions: SubscriptionData[] = [
  {
    id: "SUB-4821",
    user_id: "TAKKI-4821",
    type_abonnement: "premium_annuel",
    date_debut: "2026-01-01",
    date_fin: "2027-01-01",
    statut: "actif",
    mode_paiement: "Wave"
  },
  {
    id: "SUB-1190",
    user_id: "TAKKI-1190",
    type_abonnement: "premium_mensuel",
    date_debut: "2026-05-15",
    date_fin: "2026-06-15",
    statut: "actif",
    mode_paiement: "Orange Money"
  },
  {
    id: "SUB-8812",
    user_id: "TAKKI-8812",
    type_abonnement: "gratuit",
    date_debut: "2026-02-14",
    date_fin: "2030-02-14",
    statut: "actif",
    mode_paiement: "Aucun"
  },
  {
    id: "SUB-7733",
    user_id: "TAKKI-7733",
    type_abonnement: "gratuit",
    date_debut: "2026-03-20",
    date_fin: "2030-03-20",
    statut: "actif",
    mode_paiement: "Aucun"
  }
];

// Audit trail logs
export const initialAuditLogs: AuditLog[] = [
  {
    id: "AUD-001",
    date_heure: "2026-06-03 14:22:15",
    action: "LECTURE_DOSSIER_MED",
    acteur: "Hôpital Principal (Code validé HPD)",
    details: "Dossier médical privé de Demba Thiam consulté de manière sécurisée",
    ip: "196.207.244.12"
  },
  {
    id: "AUD-002",
    date_heure: "2026-06-02 23:17:00",
    action: "SUSPENSION_QR_CODE",
    acteur: "Amadou Diop (Citoyen)",
    details: "QR code TAKKI-8812 signalé perdu. Bracelet désactivé immédiatement par l'utilisateur.",
    ip: "196.207.240.5"
  },
  {
    id: "AUD-003",
    date_heure: "2026-06-01 10:44:03",
    action: "LECTURE_DOSSIER_MED",
    acteur: "Clinique du Cap (Code validé)",
    details: "Dossier médical de Amadou Diop consulté",
    ip: "196.207.244.18"
  },
  {
    id: "AUD-004",
    date_heure: "2026-05-30 08:30:00",
    action: "RENOUVELLEMENT_PIN",
    acteur: "Clinique Pasteur (Admin)",
    details: "Formulaire en ligne de renouvellement de code PIN validé manuellement par Takk-i Admin",
    ip: "196.207.199.31"
  }
];


// Help build visual QR values / simulate high res QR scan sheet downloads
export const drawTakkIQR = (code: string) => {
  // Simple hash function to seed or generate deterministic values
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = (hash << 5) - hash + code.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  // Linear Congruential Generator (PRNG with seed)
  let seed = Math.abs(hash) || 123456789;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const rects: string[] = [];
  
  // Standard size 100x100
  // Finder patterns are at:
  // - Top-Left: x: 5 to 25, y: 5 to 25
  // - Top-Right: x: 75 to 95, y: 5 to 25
  // - Bottom-Left: x: 5 to 25, y: 75 to 95
  // - Center Logo: x: 38 to 62, y: 38 to 62
  
  for (let col = 0; col < 20; col++) {
    for (let row = 0; row < 20; row++) {
      const x = 5 + col * 4.5;
      const y = 5 + row * 4.5;
      
      // Check if it's protected inside any of the finder patterns or center logo
      const inTopLeft = (x >= 4 && x <= 26 && y >= 4 && y <= 26);
      const inTopRight = (x >= 74 && x <= 96 && y >= 4 && y <= 26);
      const inBottomLeft = (x >= 4 && x <= 26 && y >= 74 && y <= 96);
      const inCenter = (x >= 36 && x <= 64 && y >= 36 && y <= 64);
      
      if (!inTopLeft && !inTopRight && !inBottomLeft && !inCenter) {
        // Deterministically decide whether to draw a block (e.g. 40% probability)
        if (random() < 0.38) {
          rects.push(`<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="3.5" height="3.5" rx="0.5" fill="currentColor" />`);
        }
      }
    }
  }

  return `
    <svg viewBox="0 0 100 100" class="w-full h-full text-zinc-900 bg-white p-2 rounded-xl" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Finder Patterns -->
      <rect x="5" y="5" width="20" height="20" fill="currentColor" rx="2" stroke="white" stroke-width="1.5" />
      <rect x="9" y="9" width="12" height="12" fill="white" rx="1" />
      <rect x="12" y="12" width="6" height="6" fill="currentColor" rx="0.5" />

      <rect x="75" y="5" width="20" height="20" fill="currentColor" rx="2" stroke="white" stroke-width="1.5" />
      <rect x="79" y="9" width="12" height="12" fill="white" rx="1" />
      <rect x="82" y="12" width="6" height="6" fill="currentColor" rx="0.5" />

      <rect x="5" y="75" width="20" height="20" fill="currentColor" rx="2" stroke="white" stroke-width="1.5" />
      <rect x="9" y="79" width="12" height="12" fill="white" rx="1" />
      <rect x="12" y="82" width="6" height="6" fill="currentColor" rx="0.5" />

      <!-- Unique QR Noise points -->
      ${rects.join('\n      ')}

      <!-- Central Medical cross / Takk-i Center logo -->
      <rect x="38" y="38" width="24" height="24" rx="4" fill="white" stroke="currentColor" stroke-width="1.5" />
      <rect x="47" y="42" width="6" height="16" fill="#dc2626" rx="1" />
      <rect x="42" y="47" width="16" height="6" fill="#dc2626" rx="1" />
    </svg>
  `;
};
