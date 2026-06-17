/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'citoyen' | 'professionnel_sante' | 'admin';

export interface TakkIUser {
  id: string; // e.g., "TAKKI-4821"
  nom: string;
  prenom: string;
  date_naissance: string;
  photo: string; // URL string or emoji representation
  telephone: string;
  email: string;
  mot_de_passe: string;
  groupe_sanguin: BloodGroup;
  region: string; // e.g., "Dakar", "Thiès", "Saint-Louis"
  ville: string;
  quartier: string;
  gps_latitude?: number;
  gps_longitude?: number;
  mode_urgence: boolean; // Is active emergency broadcast
  date_creation: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  nom_contact: string;
  telephone_contact: string;
  relation: string; // Parent, Conjoint, Ami, Médecin, etc.
  priorite: 1 | 2 | 3;
}

export interface MedicalInfo {
  id: string;
  user_id: string;
  maladies: string; // Underling chronic diseases, e.g. Diabète, Hypertension
  allergies: string; // Allergies graves
  traitements: string; // Active medical treatment, e.g. Insuline, Anticoagulant (Private description)
  antecedents: string; // Operations or medical history (Private description)
  medecin_traitant?: string; // Nom & contact médecin
  assurance?: string; // Mutual reference or IPM provider
  notes_medicales?: string; // Private medical notes
}

export interface UserDocument {
  id: string;
  user_id: string;
  type_document: 'carte_identite' | 'permis_conduire' | 'carnet_sante' | 'assurance';
  document_name: string;
  datei_upload: string;
  url_fichier: string;
}

export interface QRCodeData {
  id: string;
  user_id: string;
  code_unique: string; // "TAKKI-XXXX"
  url_profil: string; // "takki.sn/u/XXXX"
  date_creation: string;
  statut: 'actif' | 'suspendu';
}

export interface ScanHistoryEntry {
  id: string;
  qr_code_id: string; // "TAKKI-XXXX"
  user_id: string;
  date_scan: string; // YYYY-MM-DD
  heure_scan: string; // HH:MM
  type_scanner: 'citoyen' | 'assistant' | 'professionnel' | 'admin';
  gps_scan_lat?: number;
  gps_scan_long?: number;
  localisation: string; // Dakar, Thiès, Saint-Louis, etc.
  appareil: string; // browser details, e.g., "Android · Orange SN", "iPhone · Free SN"
  code_etablissement?: string; // Linked to medical scan if type_scanner is professionnel
}

export interface ScanAlert {
  id: string;
  user_id: string;
  qr_code_id: string;
  date_alerte: string;
  heure_alerte: string;
  description: string;
  scans_count: number;
  statut: 'actif' | 'resolu' | 'annule';
}

export interface ServiceUrgenceRegion {
  id: string;
  region: string;
  ville: string;
  police: string;
  pompiers: string;
  samu: string;
  hopital_reference: string;
}

export interface MedicalFacility {
  id: string; // Health Facility ID e.g. "HPD"
  nom: string; // "Hôpital Principal de Dakar"
  ville: string; // "Dakar"
  code_pin: string; // 6 digits, e.g., "151515"
  date_expiration: string; // ISO string 6 months validity
}

export interface SubscriptionData {
  id: string;
  user_id: string;
  type_abonnement: 'gratuit' | 'premium_mensuel' | 'premium_annuel';
  date_debut: string;
  date_fin: string;
  statut: 'actif' | 'expire' | 'suspendu';
  mode_paiement: 'Wave' | 'Orange Money' | 'Free Money' | 'Carte Bancaire' | 'Aucun';
}

export interface AuditLog {
  id: string;
  date_heure: string;
  action: string;
  acteur: string; // e.g. "Admin (sunustorymedia@gmail.com)" or "Dr. Fall (HPD)"
  details: string;
  ip?: string;
}
