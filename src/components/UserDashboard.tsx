/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TakkIUser, 
  EmergencyContact, 
  MedicalInfo, 
  QRCodeData, 
  ScanHistoryEntry, 
  SubscriptionData 
} from '../types';

// ── QR CODE FONCTIONNEL ────────────────────────────────────────────────
function QRCodeDisplay({ userId, size = 148 }: { userId: string; size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const qrUrl = `${window.location.origin}/?scan=${userId}`;

  useEffect(() => {
    let mounted = true;
    const generate = () => {
      const el = containerRef.current;
      if (!el || !mounted) return;
      el.innerHTML = '';
      try {
        // @ts-ignore
        new window.QRCode(el, { text: qrUrl, width: size, height: size, colorDark: '#0B1F3A', colorLight: '#ffffff', correctLevel: 2 });
      } catch { if (mounted) setError(true); }
    };
    // @ts-ignore
    if (window.QRCode) { generate(); return; }
    const existing = document.getElementById('qrcode-lib');
    if (existing) { existing.addEventListener('load', generate); return () => { mounted = false; }; }
    const s = document.createElement('script');
    s.id = 'qrcode-lib';
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    s.onload = () => { if (mounted) generate(); };
    s.onerror = () => { if (mounted) setError(true); };
    document.head.appendChild(s);
    return () => { mounted = false; };
  }, [userId, qrUrl, size]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-white p-3 rounded-2xl shadow-md border border-zinc-100" style={{ minWidth: size + 24, minHeight: size + 24, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {error ? <div className="text-xs text-red-400 text-center px-4">Erreur QR</div> : <div ref={containerRef} />}
      </div>
      <p className="font-mono font-bold text-xs text-zinc-400 tracking-widest">{userId}</p>
    </div>
  );
}

import { 
  Plus, Trash2, QrCode, History, AlertTriangle, CheckCircle2,
  Save, ArrowRight, Smile, Wallet, Download, ShieldAlert,
  Shield, Lock, Unlock, Fingerprint, Activity, User,
  Phone, Mail, MapPin, Heart, Stethoscope, FileText,
  ChevronRight, Star, Zap, Package
} from 'lucide-react';

interface UserDashboardProps {
  user: TakkIUser;
  contacts: EmergencyContact[];
  medicalInfo: MedicalInfo | undefined;
  qrCode: QRCodeData | undefined;
  scanHistory: ScanHistoryEntry[];
  subscription: SubscriptionData | undefined;
  onUpdateUserDetails: (u: Partial<TakkIUser>) => void;
  onUpdateMedicalDetails: (m: Partial<MedicalInfo>) => void;
  onAddEmergencyContact: (c: Omit<EmergencyContact, 'id' | 'user_id'>) => void;
  onRemoveEmergencyContact: (id: string) => void;
  onToggleQRStatus: () => void;
  onUpdateSubscription: (type: 'gratuit' | 'premium_mensuel' | 'premium_annuel', provider: 'Wave' | 'Orange Money' | 'Free Money' | 'Aucun') => void;
}

const TABS = [
  { key: 'profile',       label: 'Profil & Médical',     icon: User,     shortLabel: 'Profil' },
  { key: 'contacts',      label: "Contacts d'urgence",   icon: Phone,    shortLabel: 'Contacts' },
  { key: 'materials',     label: 'QR & Supports',        icon: QrCode,   shortLabel: 'QR Code' },
  { key: 'history',       label: 'Journal des scans',    icon: History,  shortLabel: 'Scans' },
  { key: 'subscription',  label: 'Abonnement',           icon: Star,     shortLabel: 'Plan' },
] as const;

type TabKey = typeof TABS[number]['key'];

// ── Composants UI ────────────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] font-bold text-[#5c7da5] uppercase tracking-wider mb-1.5">{children}</label>
);
const Input = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className={`w-full bg-[#0f1b2b] border border-[#1e2d42] text-white text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500/60 transition-colors placeholder:text-zinc-600 ${className}`} {...props} />
);
const Textarea = ({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={`w-full bg-[#0f1b2b] border border-[#1e2d42] text-white text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500/60 transition-colors placeholder:text-zinc-600 resize-none ${className}`} {...props} />
);
const Select = ({ children, className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={`w-full bg-[#0f1b2b] border border-[#1e2d42] text-white text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500/60 transition-colors ${className}`} {...props}>{children}</select>
);
const SaveBtn = ({ label, color = 'cyan' }: { label: string; color?: 'cyan' | 'green' }) => (
  <button type="submit" className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
    color === 'green' 
      ? 'bg-[#00c874] hover:bg-[#00b064] text-[#040d18]' 
      : 'bg-cyan-500 hover:bg-cyan-400 text-[#040d18]'
  }`}>
    <Save className="w-3.5 h-3.5" />{label}
  </button>
);

// ── Dashboard Principal ───────────────────────────────────────────────
export const UserDashboard: React.FC<UserDashboardProps> = ({
  user, contacts, medicalInfo, qrCode, scanHistory, subscription,
  onUpdateUserDetails, onUpdateMedicalDetails, onAddEmergencyContact,
  onRemoveEmergencyContact, onToggleQRStatus, onUpdateSubscription
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');

  // Forms
  const [prenom, setPrenom] = useState(user.prenom);
  const [nom, setNom] = useState(user.nom);
  const [telephone, setTelephone] = useState(user.telephone);
  const [email, setEmail] = useState(user.email);
  const [bloodGroup, setBloodGroup] = useState(user.groupe_sanguin);
  const [region, setRegion] = useState(user.region);
  const [ville, setVille] = useState(user.ville);
  const [quartier, setQuartier] = useState(user.quartier);
  const [allergies, setAllergies] = useState(medicalInfo?.allergies || '');
  const [maladies, setMaladies] = useState(medicalInfo?.maladies || '');
  const [traitements, setTraitements] = useState(medicalInfo?.traitements || '');
  const [antecedents, setAntecedents] = useState(medicalInfo?.antecedents || '');
  const [medecin, setMedecin] = useState(medicalInfo?.medecin_traitant || '');
  const [assurance, setAssurance] = useState(medicalInfo?.assurance || '');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [newContactPriority, setNewContactPriority] = useState<1|2|3>(2);
  const [selectedMaterial, setSelectedMaterial] = useState<'bracelet'|'sticker'|'carte'>('bracelet');
  const [downloadMsg, setDownloadMsg] = useState('');

  // Sûreté : Notice Toasts personnalisés
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const triggerNotice = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotice({ text, type });
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  };

  // Synchronisation des états locaux lorsque activeUser change
  useEffect(() => {
    setPrenom(user.prenom || '');
    setNom(user.nom || '');
    setTelephone(user.telephone || '');
    setEmail(user.email || '');
    setBloodGroup(user.groupe_sanguin);
    setRegion(user.region);
    setVille(user.ville || '');
    setQuartier(user.quartier || '');
    
    setAllergies(medicalInfo?.allergies || '');
    setMaladies(medicalInfo?.maladies || '');
    setTraitements(medicalInfo?.traitements || '');
    setAntecedents(medicalInfo?.antecedents || '');
    setMedecin(medicalInfo?.medecin_traitant || '');
    setAssurance(medicalInfo?.assurance || '');
  }, [user.id, medicalInfo?.id]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserDetails({ prenom, nom, telephone, email, groupe_sanguin: bloodGroup, region, ville, quartier });
    triggerNotice('Votre profil a été sauvegardé avec succès !', 'success');
  };
  const handleUpdateMedical = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMedicalDetails({ allergies, maladies, traitements, antecedents, medecin_traitant: medecin, assurance });
    triggerNotice('Dossier médical crypté (AES-256) et sauvegardé !', 'success');
  };
  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) {
      triggerNotice('Veuillez remplir le nom et le numéro de téléphone.', 'error');
      return;
    }
    onAddEmergencyContact({ nom_contact: newContactName, telephone_contact: newContactPhone, relation: newContactRelation || 'Ami(e)', priorite: newContactPriority });
    setNewContactName(''); setNewContactPhone(''); setNewContactRelation(''); setNewContactPriority(2);
    triggerNotice('Contact d\'urgence ajouté avec succès !', 'success');
  };
  const handleDownloadPDF = () => {
    setDownloadMsg(`PDF généré ! URL d'urgence : takki.sn/u/${user.id.replace('TAKKI-', '')}`);
    setTimeout(() => setDownloadMsg(''), 5000);
  };

  const isActive = qrCode?.statut === 'actif';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-sans relative">

      {/* Sleek Custom Toast/Notice */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] px-5 py-4 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-3 max-w-sm backdrop-blur-md"
            style={{
              backgroundColor: notice.type === 'success' ? 'rgba(0, 42, 30, 0.96)' : notice.type === 'error' ? 'rgba(64, 15, 15, 0.96)' : 'rgba(11, 22, 35, 0.96)',
              borderColor: notice.type === 'success' ? '#00c874' : notice.type === 'error' ? '#ef4444' : '#00C2E0',
              color: 'white',
            }}
          >
            <span className="text-base shrink-0">
              {notice.type === 'success' ? '🟢' : notice.type === 'error' ? '🔴' : '🔵'}
            </span>
            <div className="flex-1 font-sans font-medium text-zinc-100">
              {notice.text}
            </div>
            <button onClick={() => setNotice(null)} className="ml-2 text-zinc-500 hover:text-white font-mono text-xs cursor-pointer">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER PROFIL ── */}
      <div className="mb-6 bg-[#0b1623] border border-[#1e2d42] rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        
        {/* Avatar + infos */}
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-[#121f35] border border-[#1e2d42] flex items-center justify-center text-2xl shrink-0">
            {user.photo || "👨🏾‍💼"}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-white font-bold text-lg leading-tight">{user.prenom} {user.nom}</h2>
              <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest font-mono bg-[#001a2e] text-cyan-400 border border-cyan-500/20">
                {subscription?.type_abonnement === 'gratuit' ? 'FREE' : '⭐ PREMIUM'}
              </span>
            </div>
            <p className="text-zinc-500 font-mono text-xs mt-0.5">{user.id} · {user.region}, {user.ville}</p>
          </div>
        </div>

        {/* QR Status + Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#00c874] animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-xs font-bold font-mono ${isActive ? 'text-[#00c874]' : 'text-red-400'}`}>
              {isActive ? 'QR ACTIF' : 'QR SUSPENDU'}
            </span>
          </div>
          <button
            onClick={onToggleQRStatus}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
              isActive 
                ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20' 
                : 'bg-[#00c874]/10 border border-[#00c874]/30 text-[#00c874] hover:bg-[#00c874]/20'
            }`}
          >
            {isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            {isActive ? 'Désactiver' : 'Réactiver'}
          </button>
        </div>
      </div>

      {/* ── ONGLETS ── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-5" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0"
              style={{
                background: active ? 'rgba(0,194,224,0.12)' : 'rgba(255,255,255,0.04)',
                border: active ? '1px solid rgba(0,194,224,0.35)' : '1px solid rgba(255,255,255,0.07)',
                color: active ? '#00C2E0' : 'rgba(255,255,255,0.4)',
              }}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
              {tab.key === 'history' && scanHistory.length > 0 && (
                <span className="bg-white/10 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-full">{scanHistory.length}</span>
              )}
              {tab.key === 'contacts' && contacts.length > 0 && (
                <span className="bg-white/10 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-full">{contacts.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── CONTENU ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* ══ TAB 1 : PROFIL & MÉDICAL ══ */}
          {activeTab === 'profile' && (
            <div className="space-y-4">

              {/* Formulaire identité */}
              <form onSubmit={handleUpdateProfile} className="bg-[#0b1623] border border-[#1e2d42] rounded-3xl p-6 space-y-5">
                {/* Header section */}
                <div className="flex items-center gap-3 pb-4 border-b border-[#1e2d42]">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Données Publiques</h3>
                    <p className="text-[#5c7da5] text-[11px] font-mono">Visibles après scan du bracelet en urgence</p>
                  </div>
                  <span className="ml-auto text-[9px] font-bold px-2.5 py-1 rounded-full bg-[#0f2a3f] text-cyan-400 border border-cyan-500/15 uppercase tracking-wider font-mono">Public</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Prénom (affiché au scan) *</Label>
                    <Input value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Ex: Demba" required />
                  </div>
                  <div>
                    <Label>Nom de famille (strictement privé)</Label>
                    <Input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex: Thiam" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Groupe sanguin *</Label>
                    <Select value={bloodGroup} onChange={e => setBloodGroup(e.target.value as any)}>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g} value={g}>{g}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input value={telephone} onChange={e => setTelephone(e.target.value)} placeholder="+221 77 000 00 00" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Région</Label>
                    <Select value={region} onChange={e => setRegion(e.target.value)}>
                      {['Dakar','Saint-Louis','Thiès','Touba','Ziguinchor','Kaolack','Diourbel','Louga','Matam','Tambacounda','Kolda','Sédhiou','Kédougou','Fatick'].map(r => <option key={r} value={r}>{r}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label>Ville</Label>
                    <Input value={ville} onChange={e => setVille(e.target.value)} placeholder="Ex: Plateau" />
                  </div>
                  <div>
                    <Label>Quartier</Label>
                    <Input value={quartier} onChange={e => setQuartier(e.target.value)} placeholder="Ex: Médina" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <SaveBtn label="Enregistrer le profil" color="cyan" />
                </div>
              </form>

              {/* Formulaire médical */}
              <form onSubmit={handleUpdateMedical} className="bg-[#0b1623] border border-[#1e2d42] rounded-3xl p-6 space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-[#1e2d42]">
                  <div className="w-8 h-8 rounded-xl bg-[#00c874]/10 border border-[#00c874]/20 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-[#00c874]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Dossier Médical Privé</h3>
                    <p className="text-[#5c7da5] text-[11px] font-mono">Chiffré AES-256 · Accessible uniquement avec PIN établissement</p>
                  </div>
                  <span className="ml-auto text-[9px] font-bold px-2.5 py-1 rounded-full bg-[#0a2e22] text-[#00c874] border border-[#00c874]/15 uppercase tracking-wider font-mono">🔒 Privé</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Allergies graves</Label>
                    <Textarea rows={3} value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="Ex: Pénicilline (choc anaphylactique), Arachides..." />
                  </div>
                  <div>
                    <Label>Maladies / Diagnostics</Label>
                    <Textarea rows={3} value={maladies} onChange={e => setMaladies(e.target.value)} placeholder="Ex: Épilepsie, Diabète type 2, Asthme d'effort..." />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Traitements en cours</Label>
                    <Textarea rows={3} value={traitements} onChange={e => setTraitements(e.target.value)} placeholder="Ex: Ventoline inhalateur, Metformine 850mg..." />
                  </div>
                  <div>
                    <Label>Antécédents & hospitalisations</Label>
                    <Textarea rows={3} value={antecedents} onChange={e => setAntecedents(e.target.value)} placeholder="Ex: Appendicite opérée 2018, CHU Dakar..." />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Médecin traitant</Label>
                    <Input value={medecin} onChange={e => setMedecin(e.target.value)} placeholder="Ex: Dr. Fall · +221 77 000 00 00" />
                  </div>
                  <div>
                    <Label>Mutuelle / Assurance santé</Label>
                    <Input value={assurance} onChange={e => setAssurance(e.target.value)} placeholder="Ex: AXA Sénégal · IPM Ref: XY-2026" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <SaveBtn label="Chiffrer & Enregistrer" color="green" />
                </div>
              </form>
            </div>
          )}

          {/* ══ TAB 2 : CONTACTS ══ */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              {/* Liste contacts */}
              {contacts.length > 0 && (
                <div className="bg-[#0b1623] border border-[#1e2d42] rounded-3xl p-5 space-y-3">
                  <h3 className="text-white font-bold text-sm mb-4">Contacts enregistrés</h3>
                  {contacts.map((c, i) => (
                    <div key={c.id} className="flex items-center gap-3 p-3.5 bg-[#0f1f35] border border-[#1e2d42] rounded-2xl">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        c.priorite === 1 ? 'bg-red-500/15 text-red-400 border border-red-500/20' 
                        : c.priorite === 2 ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                        : 'bg-zinc-700/30 text-zinc-400 border border-zinc-600/20'
                      }`}>
                        {c.priorite === 1 ? '🚨' : c.priorite === 2 ? '2' : '3'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">{c.nom_contact}</p>
                        <p className="text-[#5c7da5] text-xs font-mono">{c.relation} · {c.telephone_contact}</p>
                      </div>
                      <button onClick={() => onRemoveEmergencyContact(c.id)} className="p-2 rounded-xl text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulaire ajout */}
              <form onSubmit={handleCreateContact} className="bg-[#0b1623] border border-[#1e2d42] rounded-3xl p-6 space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-[#1e2d42]">
                  <div className="w-8 h-8 rounded-xl bg-[#00c874]/10 border border-[#00c874]/20 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-[#00c874]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Ajouter un contact</h3>
                    <p className="text-[#5c7da5] text-[11px] font-mono">Alerté automatiquement par SMS en cas de scan</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Nom complet *</Label>
                    <Input value={newContactName} onChange={e => setNewContactName(e.target.value)} placeholder="Ex: Seydou Diallo" required />
                  </div>
                  <div>
                    <Label>Téléphone *</Label>
                    <Input value={newContactPhone} onChange={e => setNewContactPhone(e.target.value)} placeholder="+221 77 000 00 00" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Relation</Label>
                    <Input value={newContactRelation} onChange={e => setNewContactRelation(e.target.value)} placeholder="Ex: Épouse, Père, Médecin..." />
                  </div>
                  <div>
                    <Label>Priorité d'appel</Label>
                    <Select value={newContactPriority} onChange={e => setNewContactPriority(Number(e.target.value) as any)}>
                      <option value={1}>🚨 Priorité 1 — Contact principal</option>
                      <option value={2}>2 — Contact secondaire</option>
                      <option value={3}>3 — Médecin / Autre</option>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#00c874] hover:bg-[#00b064] text-[#040d18] transition-all active:scale-95">
                    <Plus className="w-3.5 h-3.5" />Enregistrer le contact
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ══ TAB 3 : QR & SUPPORTS ══ */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              {/* QR Code */}
              <div className="bg-[#0b1623] border border-[#1e2d42] rounded-3xl p-6">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="shrink-0 flex flex-col items-center gap-3">
                    <QRCodeDisplay userId={user.id} size={160} />
                    <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#e12a2a] hover:bg-red-700 text-white transition-all active:scale-95">
                      <Download className="w-3.5 h-3.5" />Télécharger le PDF
                    </button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-white font-bold text-base">Fiche d'urgence imprimable</h3>
                      <p className="text-[#5c7da5] text-xs mt-1 leading-relaxed">Imprimez au format carte de crédit pour votre portefeuille, ou en sticker pour votre casque ou moto.</p>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { icon:'💳', label:"Format carte de portefeuille (85×54mm)" },
                        { icon:'🏷️', label:"Sticker casque / moto (50×50mm)" },
                        { icon:'📋', label:"Fiche A6 complète avec QR grande taille" },
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-2.5 text-xs text-zinc-400">
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00c874] ml-auto shrink-0" />
                        </div>
                      ))}
                    </div>
                    {downloadMsg && (
                      <div className="bg-[#00c874]/10 border border-[#00c874]/20 text-[#00c874] text-xs p-3 rounded-xl font-mono flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />{downloadMsg}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Supports physiques */}
              <div className="bg-[#0b1623] border border-[#1e2d42] rounded-3xl p-6 space-y-5">
                <h3 className="text-white font-bold text-sm">Supports officiels Takk-i</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key:'bracelet', icon:'⌚', label:'SafeBand', desc:'Bracelet silicone hypoallergénique étanche gravé laser', price:'3 500 FCFA', color:'red' },
                    { key:'sticker',  icon:'🏷️', label:'SafeSticker', desc:'Lot de 3 stickers UV résistants pour casque ou moto', price:'1 500 FCFA', color:'cyan' },
                    { key:'carte',    icon:'💳', label:'Wallet Card', desc:'Carte PVC rigide format portefeuille avec QR premium', price:'2 000 FCFA', color:'green' },
                  ].map(m => (
                    <div
                      key={m.key}
                      onClick={() => setSelectedMaterial(m.key as any)}
                      className="cursor-pointer p-4 rounded-2xl border-2 transition-all space-y-2"
                      style={{
                        background: selectedMaterial === m.key ? 'rgba(0,194,224,0.06)' : 'rgba(255,255,255,0.02)',
                        borderColor: selectedMaterial === m.key ? 'rgba(0,194,224,0.5)' : 'rgba(30,45,66,1)',
                      }}
                    >
                      <div className="text-2xl">{m.icon}</div>
                      <p className="text-white font-bold text-sm">{m.label}</p>
                      <p className="text-zinc-500 text-[11px] leading-relaxed">{m.desc}</p>
                      <p className="text-cyan-400 font-bold font-mono text-xs">{m.price}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between bg-[#0f1f35] border border-[#1e2d42] rounded-2xl p-4">
                  <div>
                    <p className="text-[#5c7da5] text-[10px] font-mono uppercase">Sélectionné</p>
                    <p className="text-white font-bold text-sm">
                      {selectedMaterial === 'bracelet' && 'SafeBand Silicone — Taille Unique'}
                      {selectedMaterial === 'sticker'  && 'SafeSticker UV résistant × 3'}
                      {selectedMaterial === 'carte'    && 'Wallet Card PVC Premium'}
                    </p>
                  </div>
                  <button
                    onClick={() => triggerNotice(`Commande simulée ! Expédition en cours de préparation vers ${ville || 'votre adresse'} par Wave/Orange Money.`, 'success')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#00c874] hover:bg-[#00b064] text-[#040d18] transition-all active:scale-95"
                  >
                    Commander <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ TAB 4 : HISTORIQUE ══ */}
          {activeTab === 'history' && (
            <div className="bg-[#0b1623] border border-[#1e2d42] rounded-3xl p-6 space-y-4">
              <div>
                <h3 className="text-white font-bold text-sm">Journal des scans</h3>
                <p className="text-[#5c7da5] text-[11px] font-mono mt-0.5">Audit transparent de toutes les lectures de votre bracelet</p>
              </div>
              {scanHistory.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#1e2d42] rounded-2xl text-zinc-600 text-xs font-mono">
                  Aucun scan enregistré pour l'instant
                </div>
              ) : (
                <div className="space-y-2.5">
                  {scanHistory.map(scan => (
                    <div key={scan.id} className="flex items-center gap-3.5 p-4 bg-[#0f1f35] border border-[#1e2d42] rounded-2xl hover:border-[#2a3d5a] transition-colors">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        scan.type_scanner === 'professionnel' 
                          ? 'bg-[#00c874]/15 text-[#00c874] border border-[#00c874]/20' 
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        {scan.type_scanner === 'professionnel' ? '🏥' : '👁'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-xs">
                          {scan.type_scanner === 'professionnel' ? 'Consultation médicale autorisée' : "Lecture fiche publique d'urgence"}
                        </p>
                        <p className="text-zinc-500 text-[11px] font-mono truncate">{scan.localisation} · {scan.appareil}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-zinc-400 font-mono text-[10px]">{scan.date_scan}</p>
                        <p className="text-zinc-600 font-mono text-[10px]">{scan.heure_scan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ TAB 5 : ABONNEMENT ══ */}
          {activeTab === 'subscription' && (
            <div className="space-y-4">
              {/* Plan actuel */}
              <div className="bg-gradient-to-br from-[#0b1623] to-[#0f2235] border border-[#1e2d42] rounded-3xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#5c7da5] text-[11px] font-mono uppercase tracking-wider">Plan actuel</p>
                    <h3 className="text-white font-bold text-lg mt-1">
                      {subscription?.type_abonnement === 'premium_annuel' && "Premium Annuel ⭐"}
                      {subscription?.type_abonnement === 'premium_mensuel' && "Premium Mensuel"}
                      {subscription?.type_abonnement === 'gratuit' && "Plan Gratuit"}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase font-mono ${
                    subscription?.statut === 'actif' 
                      ? 'bg-[#00c874]/10 text-[#00c874] border border-[#00c874]/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>{subscription?.statut === 'actif' ? 'Actif' : 'Suspendu'}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-[#0f1f35] border border-[#1e2d42] rounded-xl p-3">
                    <p className="text-zinc-500 text-[10px] mb-1">Expiration</p>
                    <p className="text-white font-bold">{subscription?.date_fin || '—'}</p>
                  </div>
                  <div className="bg-[#0f1f35] border border-[#1e2d42] rounded-xl p-3">
                    <p className="text-zinc-500 text-[10px] mb-1">Paiement</p>
                    <p className="text-white font-bold">{subscription?.mode_paiement || 'Aucun'}</p>
                  </div>
                </div>
                <div className="bg-cyan-500/5 border border-cyan-500/15 rounded-xl p-3 text-xs text-cyan-300 leading-relaxed">
                  💡 Le plan Premium envoie un SMS de géolocalisation à vos contacts dès qu'un citoyen scanne votre bracelet à {user.region}.
                </div>
              </div>

              {/* Plans disponibles */}
              <div className="bg-[#0b1623] border border-[#1e2d42] rounded-3xl p-6 space-y-4">
                <h3 className="text-white font-bold text-sm">Changer de plan</h3>
                <div className="space-y-3">
                  {[
                    { type: 'premium_mensuel' as const, provider: 'Wave' as const, label: 'Premium Mensuel', price: '500 FCFA / mois', desc: 'Alertes SMS scan illimitées', highlight: false },
                    { type: 'premium_annuel' as const, provider: 'Orange Money' as const, label: 'Premium Annuel', price: '5 000 FCFA / an', desc: '2 mois offerts · Recommandé', highlight: true },
                    { type: 'gratuit' as const, provider: 'Aucun' as const, label: 'Revenir au plan Gratuit', price: 'Gratuit', desc: 'Fiche publique uniquement', highlight: false },
                  ].map(plan => (
                    <button
                      key={plan.type}
                      onClick={() => { onUpdateSubscription(plan.type, plan.provider); triggerNotice(`Abonnement activé : Plan ${plan.label} !`, 'success'); }}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left active:scale-[0.98]"
                      style={{
                        background: plan.highlight ? 'rgba(0,200,116,0.06)' : 'rgba(255,255,255,0.02)',
                        borderColor: plan.highlight ? 'rgba(0,200,116,0.3)' : 'rgba(30,45,66,1)',
                      }}
                    >
                      <div>
                        <p className="text-white font-bold text-sm flex items-center gap-2">
                          {plan.label}
                          {plan.highlight && <span className="text-[9px] bg-[#00c874] text-[#040d18] px-2 py-0.5 rounded-full font-black uppercase">Recommandé</span>}
                        </p>
                        <p className="text-zinc-500 text-[11px] mt-0.5">{plan.desc}</p>
                      </div>
                      <span className={`font-bold font-mono text-sm shrink-0 ml-4 ${plan.highlight ? 'text-[#00c874]' : 'text-zinc-400'}`}>{plan.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};
