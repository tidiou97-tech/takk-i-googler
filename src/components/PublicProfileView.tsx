/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  TakkIUser, 
  EmergencyContact, 
  MedicalInfo, 
  MedicalFacility, 
  ServiceUrgenceRegion,
  QRCodeData,
  ScanHistoryEntry,
  SubscriptionData
} from '../types';
import { translations } from '../data';
import { 
  Heart, 
  PhoneCall, 
  ShieldAlert, 
  User, 
  FileLock2, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  MapPin, 
  X, 
  Check, 
  Languages,
  Clock,
  Settings,
  QrCode,
  History,
  Star,
  Trash2,
  Plus,
  Save,
  Lock,
  Unlock,
  ChevronRight
} from 'lucide-react';

// ── QR CODE DISPLAY ──────────────────────────────────────────────────
function QRCodeDisplay({ userId }: { userId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [qrReady, setQrReady] = useState(false);
  const [error, setError] = useState(false);

  const qrUrl = `${window.location.origin}/?scan=${userId}`;

  useEffect(() => {
    let isMounted = true;

    const generateQR = () => {
      const container = containerRef.current;
      if (!container || !isMounted) return;

      container.innerHTML = '';

      try {
        // @ts-ignore
        new window.QRCode(container, {
          text: qrUrl,
          width: 130,
          height: 130,
          colorDark: '#0B1F3A',
          colorLight: '#ffffff',
          correctLevel: 2, // H
        });
        if (isMounted) setQrReady(true);
      } catch (e) {
        if (isMounted) setError(true);
      }
    };

    // Si la lib est déjà chargée
    // @ts-ignore
    if (window.QRCode) {
      generateQR();
      return;
    }

    // Sinon on la charge
    const existingScript = document.getElementById('qrcode-lib');
    if (existingScript) {
      existingScript.addEventListener('load', generateQR);
      return () => { isMounted = false; };
    }

    const script = document.createElement('script');
    script.id = 'qrcode-lib';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.onload = () => { if (isMounted) generateQR(); };
    script.onerror = () => { if (isMounted) setError(true); };
    document.head.appendChild(script);

    return () => { isMounted = false; };
  }, [userId, qrUrl]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Conteneur QR */}
      <div
        className="bg-white p-2.5 rounded-2xl shadow-inner border border-zinc-200"
        style={{ minWidth: 140, minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {error ? (
          <div className="text-center text-xs text-red-400 px-2">
            <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
            Erreur QR
          </div>
        ) : (
          <div ref={containerRef} />
        )}
      </div>

      {/* ID + URL */}
      <p className="font-mono font-bold text-xs text-zinc-300 tracking-wider mb-1">ID: {userId}</p>

      {/* Bouton copier le lien */}
      <button
        onClick={() => {
          navigator.clipboard?.writeText(qrUrl).then(() => {
            alert('Lien copié : ' + qrUrl);
          });
        }}
        className="text-[9px] text-cyan-400 hover:text-cyan-300 font-mono underline underline-offset-1 transition-colors"
      >
        Copier le lien d'urgence
      </button>
    </div>
  );
}

interface PublicProfileViewProps {
  user: TakkIUser;
  contacts: EmergencyContact[];
  medicalInfo: MedicalInfo | undefined;
  regionService: ServiceUrgenceRegion | undefined;
  facilities: MedicalFacility[];
  isQRActive: boolean;
  onMedicalAccessLogged: (facilityName: string, facilityId: string) => void;
  triggerEmergencyAlert: () => void;
  activeScanCount: number;

  // Integrated Dashboard Callbacks for State Management
  qrCode: QRCodeData | undefined;
  scanHistory: ScanHistoryEntry[];
  subscription: SubscriptionData | undefined;
  onUpdateUserDetails: (u: Partial<TakkIUser>) => void;
  onUpdateMedicalDetails: (m: Partial<MedicalInfo>) => void;
  onAddEmergencyContact: (c: Omit<EmergencyContact, 'id' | 'user_id'>) => void;
  onRemoveEmergencyContact: (id: string) => void;
  onToggleQRStatus: () => void;
  onUpdateSubscription: (type: 'gratuit' | 'premium_mensuel' | 'premium_annuel', provider: 'Wave' | 'Orange Money' | 'Free Money' | 'Aucun') => void;
  currentView: 'scan' | 'citizen' | 'admin';
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  user,
  contacts,
  medicalInfo,
  regionService,
  facilities,
  isQRActive,
  onMedicalAccessLogged,
  triggerEmergencyAlert,
  activeScanCount,

  qrCode,
  scanHistory,
  subscription,
  onUpdateUserDetails,
  onUpdateMedicalDetails,
  onAddEmergencyContact,
  onRemoveEmergencyContact,
  onToggleQRStatus,
  onUpdateSubscription,
  currentView
}) => {
  const [lang, setLang] = useState<'fr' | 'wo'>('fr');
  const [pinInput, setPinInput] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [isMedicalAuthorized, setIsMedicalAuthorized] = useState(false);
  const [authorizedFacility, setAuthorizedFacility] = useState<MedicalFacility | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [triggerPanicAnimation, setTriggerPanicAnimation] = useState(user.mode_urgence);

  // Active inner screen mode inside the visual phone screen layout
  const [activeMobileTab, setActiveMobileTab] = useState<'emergency' | 'profile' | 'contacts' | 'settings'>('emergency');

  // Synchronise native mobile screen selection with wide app navigation
  useEffect(() => {
    if (currentView === 'citizen') {
      setActiveMobileTab('profile');
    } else {
      setActiveMobileTab('emergency');
    }
  }, [currentView]);

  // Handle local states for the integrated dashboard inputs
  const [editPrenom, setEditPrenom] = useState(user.prenom);
  const [editNom, setEditNom] = useState(user.nom);
  const [editTel, setEditTel] = useState(user.telephone);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editBlood, setEditBlood] = useState(user.groupe_sanguin);
  const [editRegion, setEditRegion] = useState(user.region);
  const [editVille, setEditVille] = useState(user.ville);
  
  const [editAllergies, setEditAllergies] = useState(medicalInfo?.allergies || '');
  const [editMaladies, setEditMaladies] = useState(medicalInfo?.maladies || '');
  const [editTraitements, setEditTraitements] = useState(medicalInfo?.traitements || '');
  const [editAntecedents, setEditAntecedents] = useState(medicalInfo?.antecedents || '');
  const [editMedecin, setEditMedecin] = useState(medicalInfo?.medecin_traitant || '');
  const [editAssurance, setEditAssurance] = useState(medicalInfo?.assurance || '');

  // Add Contact Form States
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [newContactPriority, setNewContactPriority] = useState<1|2|3>(2);

  // Update input when current user changes (Demo select switches context)
  useEffect(() => {
    setEditPrenom(user.prenom);
    setEditNom(user.nom);
    setEditTel(user.telephone);
    setEditEmail(user.email);
    setEditBlood(user.groupe_sanguin);
    setEditRegion(user.region);
    setEditVille(user.ville);

    setEditAllergies(medicalInfo?.allergies || '');
    setEditMaladies(medicalInfo?.maladies || '');
    setEditTraitements(medicalInfo?.traitements || '');
    setEditAntecedents(medicalInfo?.antecedents || '');
    setEditMedecin(medicalInfo?.medecin_traitant || '');
    setEditAssurance(medicalInfo?.assurance || '');
  }, [user, medicalInfo]);

  const handleUpdateProfileLocal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserDetails({ 
      prenom: editPrenom, 
      nom: editNom, 
      telephone: editTel, 
      email: editEmail, 
      groupe_sanguin: editBlood, 
      region: editRegion, 
      ville: editVille 
    });
    onUpdateMedicalDetails({
      allergies: editAllergies,
      maladies: editMaladies,
      traitements: editTraitements,
      antecedents: editAntecedents,
      medecin_traitant: editMedecin,
      assurance: editAssurance
    });
    alert('Fiche d\'urgence mise à jour avec succès !');
  };

  const handleCreateContactLocal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) {
      alert('Veuillez saisir le nom et le téléphone.');
      return;
    }
    onAddEmergencyContact({
      nom_contact: newContactName,
      telephone_contact: newContactPhone,
      relation: newContactRelation || 'Famille',
      priorite: newContactPriority
    });
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelation('');
    setNewContactPriority(2);
    alert('Contact d\'urgence ajouté !');
  };

  const primaryContact = contacts.find(c => c.priorite === 1) || contacts[0];
  const t = translations[lang];

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    const facilityMatched = facilities.find(f => f.code_pin === pinInput);

    if (facilityMatched) {
      const expirationDate = new Date(facilityMatched.date_expiration);
      const isExpired = expirationDate.getTime() < new Date().getTime();

      if (isExpired) {
        setErrorMessage(
          lang === 'fr' 
            ? `Le code de l'établissement ${facilityMatched.nom} a expiré (validité de 6 mois dépassée).` 
            : `Code PIN ${facilityMatched.nom} talli na.`
        );
        return;
      }

      setIsMedicalAuthorized(true);
      setAuthorizedFacility(facilityMatched);
      setShowPinModal(false);
      setPinInput('');
      onMedicalAccessLogged(facilityMatched.nom, facilityMatched.id);
    } else {
      setErrorMessage(t.invalid_pin);
    }
  };

  const handlePanicClick = () => {
    triggerEmergencyAlert();
    setTriggerPanicAnimation(true);
  };

  // IF QR IS INACTIVE - EMERGENCY TABS SHUTS DOWN OR WARNS
  if (!isQRActive && activeMobileTab === 'emergency') {
    return (
      <div className="flex flex-col h-full bg-[#0a121e]">
        {/* TOP COMPONENT */}
        <div className="flex-1 p-5 flex flex-col justify-center items-center text-center">
          <div className="w-14 h-14 bg-red-950/80 text-red-500 rounded-full flex items-center justify-center mb-5 border border-red-800">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold font-syne tracking-tight mb-2 text-red-500 uppercase">
            {t.qr_suspended}
          </h2>
          <div className="text-zinc-500 text-xs mb-3 font-mono">{user.id}</div>
          <p className="text-zinc-300 text-[11px] leading-relaxed max-w-sm">
            {t.qr_suspended_desc}
          </p>
          <button 
            onClick={() => setActiveMobileTab('settings')}
            className="mt-6 px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-extrabold text-[10px] uppercase rounded-xl"
          >
            Aller aux paramètres du compte
          </button>
        </div>

        {/* BOTTOM NAV */}
        <div className="bg-[#0c1424] border-t border-slate-800/80 px-2 py-2 flex justify-around items-center shrink-0">
          <button onClick={() => setActiveMobileTab('emergency')} className="flex flex-col items-center gap-1 text-red-500 text-[9px] font-extrabold flex-1">
            <Heart className="w-4 h-4" />
            <span>Fiche</span>
          </button>
          <button onClick={() => setActiveMobileTab('profile')} className="flex flex-col items-center gap-1 text-zinc-500 text-[9px] font-extrabold flex-1 hover:text-zinc-300">
            <User className="w-4 h-4" />
            <span>Profil</span>
          </button>
          <button onClick={() => setActiveMobileTab('contacts')} className="flex flex-col items-center gap-1 text-zinc-500 text-[9px] font-extrabold flex-1 hover:text-zinc-300">
            <PhoneCall className="w-4 h-4" />
            <span>Contacts</span>
          </button>
          <button onClick={() => setActiveMobileTab('settings')} className="flex flex-col items-center gap-1 text-zinc-500 text-[9px] font-extrabold flex-1 hover:text-zinc-300">
            <Settings className="w-4 h-4" />
            <span>Compte & QR</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a121e] select-none text-left relative">
      
      {/* HEADER BAR (Simulated notch & network bar) */}
      <div className="bg-[#0f1b2b] px-4 pt-1.5 pb-2 flex justify-between items-center text-[9px] text-zinc-400 font-mono tracking-wider shrink-0 border-b border-[#1c2a3f]">
        <span>Senegal Secours LTE 🇸🇳</span>
        <div className="flex items-center gap-1">
          <Activity className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
          <span>99%</span>
        </div>
      </div>

      {/* LANGUAGE SELECTOR */}
      <div className="absolute top-8 right-3.5 z-20 flex items-center gap-1 bg-[#121f35]/95 backdrop-blur px-1.5 py-0.5 rounded-full border border-slate-700/60">
        <button 
          onClick={() => setLang('fr')} 
          className={`text-[8px] font-extrabold px-1 py-0.5 rounded ${lang === 'fr' ? 'bg-[#ff3b30] text-white' : 'text-zinc-400'}`}
        >FR</button>
        <button 
          onClick={() => setLang('wo')} 
          className={`text-[8px] font-extrabold px-1 py-0.5 rounded ${lang === 'wo' ? 'bg-[#ff3b30] text-white' : 'text-zinc-400'}`}
        >WO</button>
      </div>

      {/* SCROLLABLE MAIN BODY */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* ── SCREEN 1: EMERGENCY PASS CARD ── */}
        {activeMobileTab === 'emergency' && (
          <div className="space-y-3.5 pb-6">
            {/* Red alert card header */}
            <div className="bg-[#e12a2a] p-4 flex items-center gap-3 relative shadow-md">
              <div className="shrink-0 bg-white/10 p-2 rounded-full border border-white/20">
                <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
              </div>
              <div className="min-w-0">
                <span className="text-[8px] font-extrabold tracking-wider text-[#ffe3e3] uppercase block">
                  {lang === 'fr' ? "Fiche d'Urgence Active" : "NDIMBAL URGENCE"}
                </span>
                <h1 className="text-lg font-black text-white uppercase mt-0.5 truncate max-w-[210px]">
                  {user.prenom}
                </h1>
              </div>
            </div>

            {/* Emergency flash */}
            {user.mode_urgence && (
              <div className="bg-amber-500 text-slate-950 text-[9px] font-bold py-1.5 px-3 font-mono tracking-tight text-center flex items-center justify-center gap-1 animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>SOS URGENCE TRANSMIS PAR SMS</span>
              </div>
            )}

            <div className="p-3.5 space-y-4">
              
              {/* Regional localization & ID */}
              <div className="bg-[#121f35]/50 border border-slate-800/80 px-3 py-2 rounded-xl flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-500" />{user.region}, {user.ville}</span>
                <span>ID: {user.id}</span>
              </div>

              {/* Blood group */}
              <div className="bg-[#121f35] p-3.5 border border-[#1e2d42]/60 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="bg-[#e12a2a] p-2.5 rounded-xl flex items-center justify-center text-white shrink-0">
                    <svg className="w-5 h-5 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                      <path d="M12 21.5c4.5 0 8-3.5 8-8c0-4-8-11.5-8-11.5S4 9.5 4 13.5c0 4.5 3.5 8 8 8z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="text-zinc-400 text-[9px] font-mono uppercase tracking-wide">{t.blood_group}</span>
                    <div className="text-white text-xl font-black font-syne leading-none mt-0.5">{user.groupe_sanguin}</div>
                  </div>
                </div>
                <div className="bg-[#00c874]/15 text-[#00c874] border border-[#00c874]/20 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase">
                  Protégé
                </div>
              </div>

              {/* Emergency numbers speed dial */}
              <div className="bg-[#121f35] p-3 border border-[#1e2d42]/60 rounded-2xl space-y-2">
                <span className="text-[9px] font-bold tracking-wider text-zinc-500 font-mono block uppercase">Secours Sénégal</span>
                <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                  <a href="tel:15" className="bg-[#1b2c48] border border-red-500/20 py-2 rounded-xl block">
                    <div className="text-[#e12a2a] text-base font-bold">15</div>
                    <div className="text-[8px] text-zinc-400 uppercase">SAMU</div>
                  </a>
                  <a href="tel:18" className="bg-[#1b2c48] border border-amber-500/20 py-2 rounded-xl block">
                    <div className="text-[#e15a3c] text-base font-bold">18</div>
                    <div className="text-[8px] text-zinc-400 uppercase">Pompiers</div>
                  </a>
                  <a href="tel:800002020" className="bg-[#1b2c48] border border-blue-500/20 py-2 rounded-xl block">
                    <div className="text-[#3282f6] text-[11px] font-bold mt-1">SOS 800</div>
                    <div className="text-[8px] text-zinc-400 uppercase leading-none">Gendarme</div>
                  </a>
                </div>
              </div>

              {/* Main chronic message */}
              <div className="bg-[#241a2a] p-3 rounded-xl border border-red-900/30">
                <div className="flex items-center gap-1.5 text-rose-500 text-[10px] font-bold uppercase">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Message critique d'urgence</span>
                </div>
                <p className="text-white text-xs font-semibold mt-1">
                  {medicalInfo?.maladies ? medicalInfo.maladies : "Aucun dossier médical critique - Transmettre assistance."}
                </p>
              </div>

              {/* Severe allergies */}
              <div className="bg-[#121f35] p-3.5 border border-[#1e2d42]/60 rounded-2xl">
                <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-bold uppercase mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.severe_allergies}</span>
                </div>
                <p className="text-white text-xs">
                  {medicalInfo?.allergies || "Aucune allergie critique enregistrée."}
                </p>
              </div>

              {/* Fast Emergency Contacts list inside Phone */}
              <div className="bg-[#121f35] p-3.5 border border-[#1e2d42]/60 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase mb-1">
                  <PhoneCall className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                  <span>Familles & Contacts SOS</span>
                </div>
                <div className="space-y-2">
                  {contacts.length > 0 ? contacts.map(c => (
                    <div key={c.id} className="flex justify-between items-center text-xs py-1.5 border-b border-zinc-800/40 last:border-0">
                      <div>
                        <div className="font-bold text-white text-[11px]">{c.nom_contact}</div>
                        <div className="text-[9px] text-[#5c7da5]">{c.relation}</div>
                      </div>
                      <a href={`tel:${c.telephone_contact}`} className="bg-[#00c874] text-[#050b12] font-mono font-black text-[9px] px-2 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <PhoneCall className="w-2.5 h-2.5 fill-current" />
                        <span>{c.telephone_contact}</span>
                      </a>
                    </div>
                  )) : (
                    <div className="text-center text-[10px] text-zinc-500 py-1">Aucun contact</div>
                  )}
                </div>
              </div>

              {/* Secure PIN Doctor Lock access button */}
              <div>
                {!isMedicalAuthorized ? (
                  <button
                    onClick={() => { setErrorMessage(''); setShowPinModal(true); }}
                    className="w-full bg-[#121f35] border border-cyan-500/25 hover:bg-[#1a2d4b] text-cyan-400 text-[10px] uppercase font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FileLock2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Dossier médical restreint PIN</span>
                  </button>
                ) : (
                  <div className="bg-[#122822] border border-emerald-500/30 p-3 rounded-2xl space-y-2.5">
                    <div className="flex justify-between items-center border-b border-emerald-400/20 pb-2">
                      <span className="text-[9px] font-bold text-emerald-300">✓ {authorizedFacility?.nom}</span>
                      <button onClick={() => setIsMedicalAuthorized(false)} className="text-zinc-500 hover:text-zinc-200">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Private Diagnostic information */}
                    <div className="space-y-2 text-[11px]">
                      <div>
                        <span className="text-[8px] text-[#5c7da5] block uppercase font-mono">Traitements actifs :</span>
                        <span className="text-white font-medium">{medicalInfo?.traitements || 'Aucun traitement majeur'}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-[#5c7da5] block uppercase font-mono">Antécédents cliniques :</span>
                        <span className="text-white">{medicalInfo?.antecedents || 'Aucun antécédent listé'}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-[#5c7da5] block uppercase font-mono">Médecin principal :</span>
                        <span className="text-cyan-300">{medicalInfo?.medecin_traitant || 'Non renseigné'}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-[#5c7da5] block uppercase font-mono">Assurance :</span>
                        <span className="text-emerald-300">{medicalInfo?.assurance || 'AXA / IPM Privé'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SOS Emergency Manual Panic Trigger */}
              {!user.mode_urgence ? (
                <button
                  onClick={handlePanicClick}
                  className="w-full bg-gradient-to-r from-[#e12a2a] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-xl text-[10px] uppercase tracking-wide flex items-center justify-center gap-1 border border-red-500/20"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Activer Alerte Médicale 🚨</span>
                </button>
              ) : (
                <div className="bg-red-950/40 border border-red-500/30 p-2.5 rounded-xl text-center">
                  <span className="text-[9px] text-red-400 font-extrabold block">🚨 Balise d'urgence active ! SMS envoyés avec coordonnées.</span>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── SCREEN 2: PROFILE EDITOR (Espace Citoyen) ── */}
        {activeMobileTab === 'profile' && (
          <form onSubmit={handleUpdateProfileLocal} className="p-4 space-y-4 pb-10">
            {/* Form title */}
            <div className="border-b border-zinc-800 pb-2.5 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <h3 className="text-white font-bold text-xs uppercase tracking-wide">Modifier mes données</h3>
                <p className="text-zinc-500 text-[9px] font-mono">{user.id} · Espace propriétaire</p>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Prénom (Secours) *</label>
                <input 
                  type="text" 
                  value={editPrenom} 
                  onChange={e => setEditPrenom(e.target.value)} 
                  className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-3 py-2 rounded-xl focus:border-cyan-500 outline-none text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Nom de famille (Privé)</label>
                <input 
                  type="text" 
                  value={editNom} 
                  onChange={e => setEditNom(e.target.value)} 
                  className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-3 py-2 rounded-xl focus:border-cyan-500 outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Groupe Sanguin</label>
                  <select 
                    value={editBlood} 
                    onChange={e => setEditBlood(e.target.value as any)}
                    className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-2 py-2 rounded-xl outline-none text-xs cursor-pointer"
                  >
                    {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Téléphone</label>
                  <input 
                    type="text" 
                    value={editTel} 
                    onChange={e => setEditTel(e.target.value)} 
                    className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-3 py-2 rounded-xl focus:border-cyan-500 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Région (Sénégal)</label>
                  <select 
                    value={editRegion} 
                    onChange={e => setEditRegion(e.target.value)}
                    className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-2 py-2 rounded-xl outline-none text-xs cursor-pointer"
                  >
                    {['Dakar','Thiès','Saint-Louis','Touba','Ziguinchor'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Ville</label>
                  <input 
                    type="text" 
                    value={editVille} 
                    onChange={e => setEditVille(e.target.value)} 
                    className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-3 py-2 rounded-xl focus:border-cyan-500 outline-none text-xs"
                  />
                </div>
              </div>

              {/* Medical data */}
              <div className="border-t border-zinc-800 pt-3 mt-1">
                <span className="text-[9px] text-emerald-400 font-extrabold uppercase font-mono block mb-2">🩺 Dossier clinique Chiffré</span>
              </div>

              <div>
                <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Maladies graves / diagnostics</label>
                <textarea 
                  rows={2}
                  value={editMaladies} 
                  onChange={e => setEditMaladies(e.target.value)} 
                  className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-3 py-2 rounded-xl focus:border-cyan-500 outline-none text-xs resize-none"
                  placeholder="Épilepsie, Asthme d'effort..."
                />
              </div>

              <div>
                <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Allergies graves</label>
                <textarea 
                  rows={2}
                  value={editAllergies} 
                  onChange={e => setEditAllergies(e.target.value)} 
                  className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-3 py-2 rounded-xl focus:border-cyan-500 outline-none text-xs resize-none"
                  placeholder="Pénicilline, Abeilles, Arachides..."
                />
              </div>

              <div>
                <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Traitements en cours (PIN requis)</label>
                <textarea 
                  rows={2}
                  value={editTraitements} 
                  onChange={e => setEditTraitements(e.target.value)} 
                  className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-3 py-2 rounded-xl focus:border-cyan-500 outline-none text-xs resize-none"
                  placeholder="Insuline, Anticoagulant..."
                />
              </div>

              <div>
                <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Antécédents / Hospitalisations (PIN requis)</label>
                <textarea 
                  rows={2}
                  value={editAntecedents} 
                  onChange={e => setEditAntecedents(e.target.value)} 
                  className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-3 py-2 rounded-xl focus:border-cyan-500 outline-none text-xs resize-none"
                  placeholder="Greffe rénale, pontage opératoire..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Médecin traitant</label>
                  <input 
                    type="text" 
                    value={editMedecin} 
                    onChange={e => setEditMedecin(e.target.value)} 
                    placeholder="Dr. Sarr"
                    className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-3 py-2 rounded-xl focus:border-cyan-500 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Assurance santé</label>
                  <input 
                    type="text" 
                    value={editAssurance} 
                    onChange={e => setEditAssurance(e.target.value)} 
                    placeholder="AXA / IPM"
                    className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-3 py-2 rounded-xl focus:border-cyan-500 outline-none text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 mt-3 shadow-md active:scale-[0.98] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder ma fiche</span>
            </button>
          </form>
        )}

        {/* ── SCREEN 3: EMERGENCY SOS CONTACTS MANAGER ── */}
        {activeMobileTab === 'contacts' && (
          <div className="p-4 space-y-4 pb-10">
            <div className="border-b border-zinc-800 pb-2.5 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-white font-bold text-xs uppercase tracking-wide">Contacts d'urgence</h3>
                <p className="text-zinc-500 text-[9px] font-mono">Alertés immédiatement par SMS lors du scan</p>
              </div>
            </div>

            {/* List contacts */}
            <div className="space-y-2">
              {contacts.length > 0 ? contacts.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-[#121f35] border border-[#1e2d42]/60 rounded-xl">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                    c.priorite === 1 ? 'bg-red-500/10 text-red-400 border border-red-500/25' : 'bg-slate-800 text-zinc-400'
                  }`}>
                    {c.priorite === 1 ? '🚨' : '2'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-xs truncate">{c.nom_contact}</p>
                    <p className="text-zinc-400 text-[10px] font-mono">{c.relation} · {c.telephone_contact}</p>
                  </div>
                  <button 
                    onClick={() => { onRemoveEmergencyContact(c.id); alert('Contact supprimé !'); }} 
                    className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )) : (
                <div className="text-center text-zinc-500 text-[11px] py-4">Aucun contact enregistré.</div>
              )}
            </div>

            {/* Add contact form */}
            <form onSubmit={handleCreateContactLocal} className="bg-[#121f35]/50 border border-slate-800/80 p-3.5 rounded-2xl space-y-3">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono block">Nouveau contact</span>
              
              <div>
                <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Nom complet *</label>
                <input 
                  type="text" 
                  value={newContactName} 
                  onChange={e => setNewContactName(e.target.value)} 
                  placeholder="Seydou Thiam"
                  className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-3 py-1.5 rounded-xl focus:border-cyan-500 outline-none text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Téléphone Secours *</label>
                <input 
                  type="text" 
                  value={newContactPhone} 
                  onChange={e => setNewContactPhone(e.target.value)} 
                  placeholder="+221 77 123 45 67"
                  className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-3 py-1.5 rounded-xl focus:border-cyan-500 outline-none text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Lien / Relation</label>
                  <input 
                    type="text" 
                    value={newContactRelation} 
                    onChange={e => setNewContactRelation(e.target.value)} 
                    placeholder="Épouse, Ami, Frère..."
                    className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-3 py-1.5 rounded-xl focus:border-cyan-500 outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-zinc-400 font-mono block uppercase mb-1">Priorité</label>
                  <select 
                    value={newContactPriority} 
                    onChange={e => setNewContactPriority(Number(e.target.value) as any)}
                    className="w-full bg-[#121f35] border border-[#1e2d42] text-white px-2 py-1.5 rounded-xl outline-none text-xs cursor-pointer"
                  >
                    <option value={1}>🚨 Contact Principal</option>
                    <option value={2}>Contact SOS 2</option>
                    <option value={3}>SOS 3 / Autre</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#00c874] hover:bg-[#00b064] text-slate-950 font-bold py-2 px-3 rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-1 mt-2 active:scale-[0.98] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter ce contact</span>
              </button>
            </form>
          </div>
        )}

        {/* ── SCREEN 4: QR ACCESSIBILITY, PLANS & SERVICES (Espace Citoyen) ── */}
        {activeMobileTab === 'settings' && (
          <div className="p-4 space-y-4 pb-10">
            <div className="border-b border-zinc-800 pb-2.5 flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <h3 className="text-white font-bold text-xs uppercase tracking-wide">Paramètres de mon compte</h3>
                <p className="text-zinc-500 text-[9px] font-mono">Administration, QR Code et historique</p>
              </div>
            </div>

            {/* Unique QR Display Block */}
            <div className="bg-[#121f35] p-4 border border-[#1e2d42]/60 rounded-2xl flex flex-col items-center text-center">
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest font-mono block mb-3">Télécharger mon QR Code d'Urgence</span>
              <QRCodeDisplay userId={user.id} />
            </div>

            {/* Toggle QR Activation Status */}
            <div className="bg-[#121f35] p-3.5 border border-[#1e2d42]/60 rounded-2xl flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-[9px] font-bold text-zinc-400 font-mono block uppercase">Statut matériel</span>
                <span className={`text-xs font-black uppercase ${isQRActive ? 'text-[#00c874]' : 'text-red-400'}`}>
                  {isQRActive ? '🟢 Actif et Scannable' : '🔴 Suspendu / Égaré'}
                </span>
              </div>
              <button
                onClick={onToggleQRStatus}
                className={`px-3 py-1.5 rounded-lg text-[9px] uppercase font-bold text-white shadow transition-all active:scale-[0.95] ${
                  isQRActive ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isQRActive ? 'Désactiver' : 'Réactiver'}
              </button>
            </div>

            {/* Subscriptions Premium Level Up Checkout simulation */}
            <div className="bg-[#121f35] p-4 border border-[#1e2d42]/60 rounded-2xl space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-zinc-400 font-mono block uppercase">Formule Takk-i</span>
                <span className="bg-[#00c874]/15 text-[#00c874] border border-[#00c874]/20 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase">
                  {subscription?.type_abonnement === 'premium_annuel' ? '⭐ Premium' : 'Free Trial'}
                </span>
              </div>
              <p className="text-[10px] text-zinc-300 leading-relaxed">
                {subscription?.type_abonnement === 'premium_annuel' 
                ? 'Abonnement actif jusqu\'au 03/06/2027. Paiement sécurisé via Wave.'
                : 'Passez à la formule Premium (2 500 FCFA/mois) pour activer l\'envoi automatique de SMS géolocalisés aux contacts de confiance lors des scans.'}
              </p>
              {subscription?.type_abonnement !== 'premium_annuel' && (
                <div className="pt-1 flex gap-1.5">
                  <button 
                    onClick={() => { onUpdateSubscription('premium_annuel', 'Wave'); alert('Paiement simulé ! Formule Premium activée via Wave S.N. ✓'); }}
                    className="flex-1 bg-[#00c874] hover:bg-[#00b064] text-slate-950 font-bold py-1.5 rounded-lg text-[9px] uppercase shadow"
                  >
                    Activer via WAVE
                  </button>
                  <button 
                    onClick={() => { onUpdateSubscription('premium_annuel', 'Orange Money'); alert('Paiement simulé ! Formule Premium activée via Orange Money ✓'); }}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 rounded-lg text-[9px] uppercase shadow"
                  >
                    ORANGE MONEY
                  </button>
                </div>
              )}
            </div>

            {/* Scan History Log inside Phone Screen */}
            <div className="bg-[#121f35] p-3.5 border border-[#1e2d42]/60 rounded-2xl space-y-2">
              <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono border-b border-zinc-800 pb-1.5">
                <History className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Journal des Scans ({scanHistory.length})</span>
              </div>
              <div className="space-y-2 max-h-[140px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                {scanHistory.map((s, idx) => (
                  <div key={s.id || idx} className="text-[10px] border-b border-zinc-800/40 pb-1.5 last:pb-0 last:border-0 text-zinc-400 flex justify-between gap-1.5">
                    <div className="min-w-0">
                      <div className="font-bold text-zinc-200 truncate">{s.localisation}</div>
                      <div className="text-[8px] opacity-60">{s.appareil}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-cyan-400 text-[9px]">{s.heure_scan}</div>
                      <div className="text-[8px] font-mono opacity-50">{s.date_scan}</div>
                    </div>
                  </div>
                ))}
                {scanHistory.length === 0 && (
                  <div className="text-center text-[9px] text-zinc-600 py-2">Aucun scan enregistré.</div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* PHONE NAVIGATION TABS (Bottom bar mimicking native app tabs) */}
      <div className="bg-[#0f1b2b] border-t border-[#1c2a3f] px-2 py-2 flex justify-around items-center shrink-0 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.5)] z-10">
        <button 
          onClick={() => setActiveMobileTab('emergency')} 
          className={`flex flex-col items-center gap-0.5 text-[9px] font-extrabold flex-1 transition-colors ${activeMobileTab === 'emergency' ? 'text-red-500 font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Heart className="w-4 h-4 shrink-0" />
          <span>Fiche</span>
        </button>
        <button 
          onClick={() => setActiveMobileTab('profile')} 
          className={`flex flex-col items-center gap-0.5 text-[9px] font-extrabold flex-1 transition-colors ${activeMobileTab === 'profile' ? 'text-cyan-400 font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <User className="w-4 h-4 shrink-0" />
          <span>Profil</span>
        </button>
        <button 
          onClick={() => setActiveMobileTab('contacts')} 
          className={`flex flex-col items-center gap-0.5 text-[9px] font-extrabold flex-1 transition-colors ${activeMobileTab === 'contacts' ? 'text-emerald-400 font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <PhoneCall className="w-4 h-4 shrink-0" />
          <span>Contacts</span>
        </button>
        <button 
          onClick={() => setActiveMobileTab('settings')} 
          className={`flex flex-col items-center gap-0.5 text-[9px] font-extrabold flex-1 transition-colors ${activeMobileTab === 'settings' ? 'text-amber-500 font-black' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Ajustements</span>
        </button>
      </div>

      {/* SECURE PIN INPUT MODAL (Rescuers access) */}
      {showPinModal && (
        <div className="absolute inset-0 bg-slate-950/95 flex flex-col justify-center p-4 z-40 animate-fade-in">
          <div className="text-center font-sans text-white max-w-xs mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileLock2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <h3 className="font-bold text-white text-[11px] tracking-wider uppercase">PIN Médical Requis</h3>
              </div>
              <button onClick={() => setShowPinModal(false)} className="text-zinc-500 hover:text-zinc-300 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-zinc-400 text-[10px] text-left leading-relaxed">
              {t.enter_facility_pin}
              <span className="font-medium text-[#00c874] block mt-1.5 font-mono text-[9px]">
                💡 Démo : <span className="text-rose-500 underline">151515</span> (Hôpital) ou <span className="text-rose-500 underline">444222</span> (Clinique)
              </span>
            </p>
            
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="······"
                className="w-full text-center text-2xl font-extrabold tracking-[0.5em] text-white bg-[#121c2c] border border-zinc-700 py-2.5 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                autoFocus
              />
              
              {errorMessage && (
                <div className="bg-red-950/80 text-red-400 text-[9px] border border-red-900/40 p-2 rounded-xl flex items-start gap-1 font-semibold text-left">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
              
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowPinModal(false)} className="flex-1 bg-[#172336] hover:bg-[#1f2f47] text-zinc-300 font-bold py-2 rounded-xl text-[9px] uppercase">
                  {t.cancel}
                </button>
                <button type="submit" className="flex-1 bg-[#00c874] hover:bg-[#00b064] text-slate-950 font-bold py-2 rounded-xl text-[9px] uppercase">
                  {t.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
