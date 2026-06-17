/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TakkIUser, EmergencyContact, MedicalInfo, QRCodeData, ScanHistoryEntry,
  ScanAlert, ServiceUrgenceRegion, MedicalFacility, SubscriptionData, AuditLog, BloodGroup
} from './types';
import { 
  initialUsers, initialEmergencyContacts, initialMedicalInfos, initialQRCodes,
  initialScanHistory, initialRegionalServices, initialAlerts, initialSubscriptions,
  initialAuditLogs, initialFacilities
} from './data';
import { PublicProfileView } from './components/PublicProfileView';
import { UserDashboard } from './components/UserDashboard';
import { AdminConsole } from './components/AdminConsole';
import { Plus, Menu, X, Settings, Lock, Unlock } from 'lucide-react';
import { 
  PourQuiSection, FonctionnementSection, SafeBandSection, 
  NosProduitsSection, EntrepriseSection, SecuriteSection, 
  InterfaceUtilisateurSection 
} from './components/LandingSections';

export default function App() {

  const [users, setUsers] = useState<TakkIUser[]>(() => {
    const local = localStorage.getItem('takki_users');
    return local ? JSON.parse(local) : initialUsers;
  });
  const [medicalInfos, setMedicalInfos] = useState<MedicalInfo[]>(() => {
    const local = localStorage.getItem('takki_medical_infos');
    return local ? JSON.parse(local) : initialMedicalInfos;
  });
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    const local = localStorage.getItem('takki_contacts');
    return local ? JSON.parse(local) : initialEmergencyContacts;
  });
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>(() => {
    const local = localStorage.getItem('takki_qrcodes');
    return local ? JSON.parse(local) : initialQRCodes;
  });
  const [scanHistory, setScanHistory] = useState<ScanHistoryEntry[]>(() => {
    const local = localStorage.getItem('takki_scan_history');
    return local ? JSON.parse(local) : initialScanHistory;
  });
  const [alerts, setAlerts] = useState<ScanAlert[]>(() => {
    const local = localStorage.getItem('takki_alerts');
    return local ? JSON.parse(local) : initialAlerts;
  });
  const [facilities, setFacilities] = useState<MedicalFacility[]>(() => {
    const local = localStorage.getItem('takki_facilities');
    return local ? JSON.parse(local) : initialFacilities;
  });
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>(() => {
    const local = localStorage.getItem('takki_subscriptions');
    return local ? JSON.parse(local) : initialSubscriptions;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const local = localStorage.getItem('takki_audit');
    return local ? JSON.parse(local) : initialAuditLogs;
  });
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('takki_admin_unlocked') === 'true';
  });

  const [currentView, setView] = useState<'scan' | 'citizen' | 'admin'>('scan');
  const [selectedUserID, setSelectedUserID] = useState<string>('TAKKI-4821');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scannedId = params.get('scan');
    if (scannedId) {
      const found = users.find(u => u.id === scannedId);
      if (found) {
        setSelectedUserID(found.id);
        setView('scan');
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentView === 'admin' && !isAdminUnlocked) setView('scan');
  }, [currentView, isAdminUnlocked]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setMobileMenuOpen(false);
  }, [currentView]);

  const handleUnlockAdmin = () => {
    if (isAdminUnlocked) {
      const confirmLock = window.confirm("Souhaitez-vous reverrouiller la Console d'administration ?");
      if (confirmLock) {
        localStorage.removeItem('takki_admin_unlocked');
        setIsAdminUnlocked(false);
        if (currentView === 'admin') setView('scan');
      }
      return;
    }
    const email = window.prompt("Saisir l'adresse e-mail administrateur :");
    if (email) {
      if (email.trim().toLowerCase() === 'sunustorymedia@gmail.com') {
        localStorage.setItem('takki_admin_unlocked', 'true');
        setIsAdminUnlocked(true);
        alert("Accès administration validé !");
        setView('admin');
      } else {
        alert("Accès refusé.");
      }
    }
  };

  const [demoStepIndex, setDemoStepIndex] = useState(1);
  const [demoStatusText, setDemoStatusText] = useState('Prêt à scanner...');
  const [demoScanning, setDemoScanning] = useState(false);
  const [demoBeamActive, setDemoBeamActive] = useState(false);
  const [demoResultVisible, setDemoResultVisible] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);

  const runQRDemo = () => {
    if (demoRunning) return;
    setDemoRunning(true);
    setDemoStepIndex(1); setDemoScanning(false); setDemoBeamActive(false);
    setDemoResultVisible(false); setDemoStatusText('Scan en cours...');
    setTimeout(() => setDemoScanning(true), 400);
    setTimeout(() => setDemoBeamActive(true), 1000);
    setTimeout(() => { setDemoStepIndex(2); setDemoStatusText('Fiche chargée ✓'); }, 2400);
    setTimeout(() => { setDemoResultVisible(true); setDemoStepIndex(3); }, 3000);
    setTimeout(() => { setDemoRunning(false); setDemoStatusText('Prêt à scanner...'); }, 5500);
  };

  useEffect(() => {
    if (currentView === 'scan') {
      const t = setTimeout(() => runQRDemo(), 1200);
      return () => clearTimeout(t);
    }
  }, [currentView]);

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [regPrenom, setRegPrenom] = useState('');
  const [regNom, setRegNom] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBlood, setRegBlood] = useState<BloodGroup>('O+');
  const [regRegion, setRegRegion] = useState('Dakar');
  const [regCity, setRegCity] = useState('');

  useEffect(() => { localStorage.setItem('takki_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('takki_medical_infos', JSON.stringify(medicalInfos)); }, [medicalInfos]);
  useEffect(() => { localStorage.setItem('takki_contacts', JSON.stringify(emergencyContacts)); }, [emergencyContacts]);
  useEffect(() => { localStorage.setItem('takki_qrcodes', JSON.stringify(qrCodes)); }, [qrCodes]);
  useEffect(() => { localStorage.setItem('takki_scan_history', JSON.stringify(scanHistory)); }, [scanHistory]);
  useEffect(() => { localStorage.setItem('takki_alerts', JSON.stringify(alerts)); }, [alerts]);
  useEffect(() => { localStorage.setItem('takki_facilities', JSON.stringify(facilities)); }, [facilities]);
  useEffect(() => { localStorage.setItem('takki_subscriptions', JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { localStorage.setItem('takki_audit', JSON.stringify(auditLogs)); }, [auditLogs]);

  const activeUser = users.find(u => u.id === selectedUserID) || users[0];
  const activeContacts = emergencyContacts.filter(c => c.user_id === activeUser.id);
  const activeMedical = medicalInfos.find(m => m.user_id === activeUser.id);
  const activeQR = qrCodes.find(q => q.user_id === activeUser.id);
  const activeSubscription = subscriptions.find(s => s.user_id === activeUser.id);
  const regionalService = initialRegionalServices.find(s => s.region === activeUser.region) || initialRegionalServices[0];
  const activeScanCount = scanHistory.filter(s => s.user_id === activeUser.id).length;

  const addAuditLog = (action: string, actor: string, details: string) => {
    const newLog: AuditLog = {
      id: "AUD-" + Math.floor(Math.random() * 900000 + 100000),
      date_heure: new Date().toISOString().replace('T', ' ').substring(0, 19),
      action, acteur: actor, details,
      ip: `196.207.${Math.floor(Math.random() * 254 + 1)}.${Math.floor(Math.random() * 254 + 1)}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleMedicalAccessLogged = (facilityName: string, facilityId: string) => {
    const newScan: ScanHistoryEntry = {
      id: "SCAN-" + Math.floor(Math.random() * 900000 + 100000),
      qr_code_id: activeUser.id, user_id: activeUser.id,
      date_scan: new Date().toISOString().substring(0, 10),
      heure_scan: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type_scanner: 'professionnel', gps_scan_lat: activeUser.gps_latitude,
      gps_scan_long: activeUser.gps_longitude, localisation: facilityName,
      appareil: "Borne Scanner Médicale d'Urgence", code_etablissement: facilityId
    };
    setScanHistory(prev => [newScan, ...prev]);
    addAuditLog('LECTURE_DOSSIER_MED', `${facilityName} (PIN validé)`, `Dossier de ${activeUser.prenom} ${activeUser.nom} consulté.`);
  };

  const handleTriggerEmergencyAlert = () => {
    setUsers(prev => prev.map(u => u.id === activeUser.id ? { ...u, mode_urgence: true } : u));
    const deviceModels = ["Téléphone Android · Orange SN","Téléphone iPhone · Free SN","Téléphone Chrome · Orange SN","Borne Sapeurs-Pompiers","Appareil Indéterminé · Dakar"];
    const newScans: ScanHistoryEntry[] = [];
    for (let i = 0; i < 5; i++) {
      newScans.push({
        id: "SCAN-PANIC-" + i + "-" + Math.floor(Math.random() * 90000 + 10000),
        qr_code_id: activeUser.id, user_id: activeUser.id,
        date_scan: new Date().toISOString().substring(0, 10),
        heure_scan: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type_scanner: i === 0 ? 'assistant' : 'citoyen',
        gps_scan_lat: activeUser.gps_latitude, gps_scan_long: activeUser.gps_longitude,
        localisation: activeUser.region + " Plateau", appareil: deviceModels[i % deviceModels.length]
      });
    }
    setScanHistory(prev => [...newScans, ...prev]);
    const newAlert: ScanAlert = {
      id: "AL-" + Math.floor(Math.random() * 90000 + 10000),
      user_id: activeUser.id, qr_code_id: activeUser.id,
      date_alerte: new Date().toISOString().substring(0, 10),
      heure_alerte: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      description: `${newScans.length + 1} scans — Alerte pour ${activeUser.prenom} à ${activeUser.region}!`,
      scans_count: newScans.length + 1, statut: 'actif'
    };
    setAlerts(prev => [newAlert, ...prev]);
    addAuditLog('DECLENCHEMENT_URGENCE', `${activeUser.prenom} (Citoyen)`, `SOS déclenché.`);
    alert("🚨 Signal d'urgence Takk-i activé !");
  };

  const handleToggleQRStatus = (userId: string = activeUser.id) => {
    setQrCodes(prev => prev.map(q => {
      if (q.user_id === userId) {
        const nextStatus = q.statut === 'actif' ? 'suspendu' : 'actif';
        addAuditLog(nextStatus === 'suspendu' ? 'SUSPENSION_QR_CODE' : 'REACTIVATION_QR_CODE',
          userId === activeUser.id ? `${activeUser.prenom} (Propriétaire)` : 'Super-Admin',
          `QR Code de ${userId} ${nextStatus === 'suspendu' ? 'désactivé' : 'réactivé'}.`);
        return { ...q, statut: nextStatus };
      }
      return q;
    }));
  };

  const handleUpdateUserDetails = (updatedData: Partial<TakkIUser>) => {
    setUsers(prev => prev.map(u => u.id === activeUser.id ? { ...u, ...updatedData } : u));
    addAuditLog('MISE_A_JOUR_PROFIL', `${activeUser.prenom}`, `Profil mis à jour.`);
  };

  const handleUpdateMedicalDetails = (updatedMed: Partial<MedicalInfo>) => {
    setMedicalInfos(prev => {
      const match = prev.find(m => m.user_id === activeUser.id);
      if (match) return prev.map(m => m.user_id === activeUser.id ? { ...m, ...updatedMed } : m);
      return [...prev, { id: "MED-" + Math.floor(Math.random() * 90000 + 10000), user_id: activeUser.id,
        maladies: updatedMed.maladies || '', allergies: updatedMed.allergies || '',
        traitements: updatedMed.traitements || '', antecedents: updatedMed.antecedents || '',
        medecin_traitant: updatedMed.medecin_traitant || '', assurance: updatedMed.assurance || '',
        notes_medicales: updatedMed.notes_medicales || '' }];
    });
    addAuditLog('MISE_A_JOUR_DOSSIER_MED', `${activeUser.prenom}`, `Dossier médical réenregistré.`);
  };

  const handleAddEmergencyContact = (newContact: Omit<EmergencyContact, 'id' | 'user_id'>) => {
    setEmergencyContacts(prev => [...prev, { id: "C-MOCK-" + Math.floor(Math.random() * 90000 + 10000), user_id: activeUser.id, ...newContact }]);
    addAuditLog('AJOUT_CONTACT_URGENCE', `${activeUser.prenom}`, `Contact ajouté : ${newContact.nom_contact}`);
  };

  const handleRemoveEmergencyContact = (contactId: string) => {
    const target = emergencyContacts.find(c => c.id === contactId);
    setEmergencyContacts(prev => prev.filter(c => c.id !== contactId));
    if (target) addAuditLog('RETRAIT_CONTACT_URGENCE', `${activeUser.prenom}`, `Contact retiré : ${target.nom_contact}`);
  };

  const handleUpdateSubscription = (type: 'gratuit' | 'premium_mensuel' | 'premium_annuel', provider: 'Wave' | 'Orange Money' | 'Free Money' | 'Aucun') => {
    setSubscriptions(prev => {
      const match = prev.find(s => s.user_id === activeUser.id);
      if (match) return prev.map(s => s.user_id === activeUser.id ? { ...s, type_abonnement: type, mode_paiement: provider, date_fin: type === 'premium_annuel' ? '2027-06-03' : '2026-07-03' } : s);
      return [...prev, { id: "SUB-" + Math.floor(Math.random() * 90000 + 10000), user_id: activeUser.id, type_abonnement: type, date_debut: new Date().toISOString().substring(0, 10), date_fin: type === 'premium_annuel' ? '2027-06-03' : '2026-07-03', statut: 'actif', mode_paiement: provider }];
    });
    addAuditLog('MISE_A_JOUR_ABONNEMENT', `${activeUser.prenom}`, `Abonnement → ${type} via ${provider}.`);
  };

  const handleAddFacility = (fac: Omit<MedicalFacility, 'id'>) => {
    const newFac: MedicalFacility = { id: fac.nom.substring(0,3).toUpperCase() + "-" + Math.floor(Math.random() * 90 + 10), ...fac };
    setFacilities(prev => [...prev, newFac]);
    addAuditLog('CREATION_ETABLISSEMENT', 'Super-Admin', `Établissement créé : ${newFac.nom}`);
  };

  const handleRevokeFacility = (id: string) => {
    const fac = facilities.find(f => f.id === id);
    setFacilities(prev => prev.filter(f => f.id !== id));
    if (fac) addAuditLog('REVOCATION_FACILITY', 'Super-Admin', `PIN révoqué : ${fac.nom}`);
  };

  const handleRenewFacilityPIN = (id: string) => {
    setFacilities(prev => prev.map(f => {
      if (f.id !== id) return f;
      const extendedDate = new Date();
      extendedDate.setMonth(extendedDate.getMonth() + 6);
      const randomPIN = Math.floor(Math.random() * 900000 + 100000).toString();
      addAuditLog('RENOUVELLEMENT_PIN_FACILITY', 'Super-Admin', `PIN renouvelé : ${f.nom}`);
      return { ...f, code_pin: randomPIN, date_expiration: extendedDate.toISOString() };
    }));
  };

  const handleClearAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, statut: 'resolu' } : a));
    const targetAlert = alerts.find(a => a.id === alertId);
    if (targetAlert) {
      setUsers(prev => prev.map(u => u.id === targetAlert.user_id ? { ...u, mode_urgence: false } : u));
      addAuditLog('ACQUITTEMENT_ALERTE', 'Super-Admin', `Alerte close pour ${targetAlert.qr_code_id}.`);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setMedicalInfos(prev => prev.filter(m => m.user_id !== userId));
    setEmergencyContacts(prev => prev.filter(c => c.user_id !== userId));
    setQrCodes(prev => prev.filter(q => q.user_id !== userId));
    setSubscriptions(prev => prev.filter(s => s.user_id !== userId));
    addAuditLog('SUPPRESSION_CITOYEN', 'Super-Admin', `Citoyen ${userId} supprimé.`);
    alert(`Données purgées (CDP Loi n°2008-12).`);
  };

  const handleRegisterUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regPrenom || !regNom || !regEmail) { alert("Remplissez les champs obligatoires."); return; }
    const uniqueIdNum = Math.floor(Math.random() * 9000 + 1000);
    const newUserId = `TAKKI-${uniqueIdNum}`;
    const newUser: TakkIUser = {
      id: newUserId, nom: regNom, prenom: regPrenom, date_naissance: "1998-05-20", photo: "👤",
      telephone: regPhone || "+221 77 111 22 33", email: regEmail, mot_de_passe: "$2a$10$hash",
      groupe_sanguin: regBlood, region: regRegion, ville: regCity || "Dakar Plateau",
      quartier: "Centre-ville", gps_latitude: 14.693, gps_longitude: -17.447,
      mode_urgence: false, date_creation: new Date().toISOString()
    };
    setUsers(prev => [newUser, ...prev]);
    setMedicalInfos(prev => [{ id: `MED-${uniqueIdNum}`, user_id: newUserId, maladies: '', allergies: 'Aucune allergie', traitements: '', antecedents: '' }, ...prev]);
    setQrCodes(prev => [{ id: `QR-${uniqueIdNum}`, user_id: newUserId, code_unique: newUserId, url_profil: `${window.location.origin}/?scan=${newUserId}`, date_creation: new Date().toISOString(), statut: 'actif' }, ...prev]);
    setSubscriptions(prev => [{ id: `SUB-${uniqueIdNum}`, user_id: newUserId, type_abonnement: 'gratuit', date_debut: new Date().toISOString().substring(0, 10), date_fin: '2029-06-03', statut: 'actif', mode_paiement: 'Aucun' }, ...prev]);
    setSelectedUserID(newUserId);
    setShowRegisterForm(false);
    setRegPrenom(''); setRegNom(''); setRegEmail(''); setRegPhone('');
    addAuditLog('INSCRIPTION_CITOYEN', regPrenom, `Compte créé : ${newUserId}`);
    alert(`Bienvenue ! Votre code d'urgence : ${newUserId}`);
  };

  const navLinks = [
    { label: 'Le problème', href: '#probleme' },
    { label: 'Comment ça marche', href: '#demo' },
    { label: 'Nos produits', href: '#tarifs' },
    { label: 'Entreprise', href: '#entreprise' },
    { label: 'Sécurité', href: '#security' },
    { label: 'Contact', href: '#testimonials' },
  ];

  return (
    <div className="min-h-screen bg-[#061d33] text-zinc-100 font-sans pb-16 flex flex-col selection:bg-cyan-500 selection:text-slate-900" style={{ overflowX: 'hidden' }}>

      {/* ── BANDE PILOTE ── */}
      <div className="w-full py-2 px-4 text-center text-xs font-bold tracking-wider"
        style={{ background: 'linear-gradient(90deg,#0e2f56,#0a223f)', color: '#00C2E0', borderBottom: '1px solid rgba(0,194,224,0.15)' }}>
        <span className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C2E0] animate-ping inline-block" />
          🚀 Version pilote gratuite — actuellement en phase de test
        </span>
      </div>

      {/* ── NAVBAR RESPONSIVE ── */}
      <nav className="sticky top-0 z-50 w-full bg-[#061d33]/95 backdrop-blur-md border-b border-[#183656]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

          {/* Logo */}
          <button onClick={() => setView('scan')} className="flex items-center gap-2 shrink-0">
            <span className="text-white font-black text-2xl tracking-tighter font-syne">
              Takk<span className="text-[#00c2e0]">-i</span>
            </span>
          </button>

          {/* Liens desktop */}
          <div className="hidden lg:flex items-center gap-5 text-sm text-zinc-400 font-medium">
            {navLinks.map(l => (
              <a key={l.label} href={l.href}
                onClick={() => { if (currentView !== 'scan') setView('scan'); }}
                className="hover:text-white transition-colors cursor-pointer whitespace-nowrap text-[13px]">
                {l.label}
              </a>
            ))}
            {isAdminUnlocked && (
              <button onClick={() => setView('admin')} className={`hover:text-amber-400 transition-colors cursor-pointer whitespace-nowrap text-[13px] font-bold flex items-center gap-1 ${currentView === 'admin' ? 'text-amber-400' : 'text-zinc-400'}`}>
                <Settings className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> Console Admin
              </button>
            )}
          </div>

          {/* Boutons desktop */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Bouton Lock Admin */}
            <button
              onClick={handleUnlockAdmin}
              className={`p-2 rounded-xl border transition-all active:scale-95 ${
                isAdminUnlocked ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-[#0f1b2b] border-[#1e2d42]/60 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
              title={isAdminUnlocked ? "Verrouiller Admin" : "Déverrouiller l'accès administrateur"}
            >
              {isAdminUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>

            <button onClick={() => setView('citizen')}
              className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-300 hover:text-white border border-[#213554]/70 hover:border-[#213554] transition-all whitespace-nowrap">
              Se connecter
            </button>
            <button onClick={() => { setView('citizen'); setShowRegisterForm(true); }}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg,#00c874,#00a85e)' }}>
              Créer ma fiche d'urgence
            </button>
          </div>

          {/* Burger mobile */}
          <button onClick={() => setMobileMenuOpen(v => !v)}
            className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu mobile déroulant */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden border-t border-[#183656]/60 bg-[#061d33]"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(l => (
                  <a key={l.label} href={l.href}
                    onClick={() => { if (currentView !== 'scan') setView('scan'); setMobileMenuOpen(false); }}
                    className="block px-4 py-3 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                    {l.label}
                  </a>
                ))}
                {isAdminUnlocked && (
                  <button onClick={() => { setView('admin'); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-amber-400 font-bold hover:bg-amber-500/10 transition-colors">
                    <Settings className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} /> Console Admin
                  </button>
                )}
                <div className="pt-3 border-t border-[#1c2e47]/60 space-y-2">
                  <button onClick={() => { setView('citizen'); setMobileMenuOpen(false); }}
                    className="w-full px-4 py-3 rounded-xl text-sm font-bold text-zinc-300 border border-[#213554]/70 text-left hover:bg-white/5 transition-colors">
                    Se connecter
                  </button>
                  <button onClick={() => { setView('citizen'); setShowRegisterForm(true); setMobileMenuOpen(false); }}
                    className="w-full px-4 py-3 rounded-xl text-sm font-bold text-white text-center"
                    style={{ background: 'linear-gradient(135deg,#00c874,#00a85e)' }}>
                    Créer ma fiche d'urgence
                  </button>
                  {/* Verrouiller/Déverrouiller Administration */}
                  <button onClick={() => { handleUnlockAdmin(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-zinc-400 border border-[#1c2e47]/60 hover:text-white bg-[#0a1523]/40">
                    {isAdminUnlocked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                        Verrouiller Administration
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Déverrouiller Administration
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">

        {/* FORMULAIRE INSCRIPTION */}
        {showRegisterForm && currentView === 'citizen' && (
          <div className="max-w-xl mx-auto my-6 mx-4 p-6 bg-[#0f1b2b] border border-[#213554]/60 rounded-3xl shadow-2xl text-zinc-100">
            <div className="flex items-center justify-between mb-4 border-b pb-3 border-[#1c2a3f]">
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wide">Fiche d'Inscription Takk-i 🇸🇳</h3>
              <button onClick={() => setShowRegisterForm(false)} className="text-zinc-400 hover:text-white font-bold text-xs">Fermer</button>
            </div>
            <form onSubmit={handleRegisterUserSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Prénom *</label>
                  <input type="text" value={regPrenom} onChange={e => setRegPrenom(e.target.value)} className="w-full bg-[#090f19] border border-[#213554]/60 text-white p-2 rounded-xl focus:border-cyan-400 outline-none" placeholder="Ex: Demba" required />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Nom *</label>
                  <input type="text" value={regNom} onChange={e => setRegNom(e.target.value)} className="w-full bg-[#090f19] border border-[#213554]/60 text-white p-2 rounded-xl focus:border-cyan-400 outline-none" placeholder="Ex: Thiam" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Email *</label>
                  <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} className="w-full bg-[#090f19] border border-[#213554]/60 text-white p-2 rounded-xl focus:border-cyan-400 outline-none" placeholder="demba@gmail.com" required />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Téléphone</label>
                  <input type="text" value={regPhone} onChange={e => setRegPhone(e.target.value)} className="w-full bg-[#090f19] border border-[#213554]/60 text-white p-2 rounded-xl focus:border-cyan-400 outline-none" placeholder="+221 77 567 12 34" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Groupe Sanguin</label>
                  <select value={regBlood} onChange={e => setRegBlood(e.target.value as any)} className="w-full bg-[#090f19] border border-[#213554]/60 text-white p-2 rounded-xl outline-none cursor-pointer">
                    {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Région</label>
                  <select value={regRegion} onChange={e => setRegRegion(e.target.value)} className="w-full bg-[#090f19] border border-[#213554]/60 text-white p-2 rounded-xl outline-none cursor-pointer">
                    {['Dakar','Thiès','Saint-Louis','Touba','Ziguinchor'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Ville</label>
                  <input type="text" value={regCity} onChange={e => setRegCity(e.target.value)} placeholder="Plateau" className="w-full bg-[#090f19] border border-[#213554]/60 text-white p-2 rounded-xl focus:border-cyan-400 outline-none" />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowRegisterForm(false)} className="bg-[#14233c] hover:bg-[#1b2f4e] text-zinc-300 py-2.5 px-4 rounded-xl text-xs">Annuler</button>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-xl uppercase tracking-wider text-xs">Créer ma fiche TAKK-I</button>
              </div>
            </form>
          </div>
        )}

        <div id="central-view-routing" className="mt-2">
          <AnimatePresence mode="wait">

            {/* ── VUE SCAN / LANDING ── */}
            {currentView === 'scan' && (
              <motion.div key="scan-view" initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-15 }} transition={{ duration:0.35,ease:"easeInOut" }}>

                {/* HERO */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-20">
                  <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">

                    {/* LEFT */}
                    <div className="lg:col-span-7 text-left space-y-6 sm:space-y-8">
                      <div className="inline-flex items-center gap-2 bg-[#092b4d] text-[#00c2e0] font-black text-[12px] tracking-wider px-4 py-2 rounded-full border border-[#00c2e0]/20 uppercase">
                        <span className="w-2 h-2 rounded-full bg-[#00c2e0] animate-pulse shrink-0" />
                        Service actif au Sénégal
                      </div>

                      <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-black text-white uppercase tracking-tight leading-[0.92] font-syne">
                        Votre <br />
                        identité <br />
                        médicale, <br />
                        <span className="text-[#00c2e0]">accessible <br />en urgence</span>
                      </h1>

                      <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
                        Un QR code sur votre poignet suffit pour que les secouristes accèdent à vos informations vitales en quelques secondes — sans application, sans connexion complexe.
                      </p>

                      {/* Feature cards — 1 col mobile, 2 col desktop */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-[#092241]/80 border border-[#1c3e66]/40 p-4 rounded-2xl flex gap-3 hover:border-[#00c2e0]/20 transition-all">
                          <span className="shrink-0 text-lg">🚨</span>
                          <div>
                            <h4 className="text-white text-[12px] font-bold uppercase tracking-wider">Alerte Multi-Scan</h4>
                            <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">5+ scans en 1h basculent le SAMU 15 en alerte rouge.</p>
                          </div>
                        </div>
                        <div className="bg-[#092241]/80 border border-[#1c3e66]/40 p-4 rounded-2xl flex gap-3 hover:border-emerald-500/20 transition-all">
                          <span className="shrink-0 text-lg">🔒</span>
                          <div>
                            <h4 className="text-white text-[12px] font-bold uppercase tracking-wider">Protection CDP</h4>
                            <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">Conforme Loi n°2008-12. Dossier chiffré par PIN.</p>
                          </div>
                        </div>
                        <div className="bg-[#092241]/80 border border-[#1c3e66]/40 p-4 rounded-2xl flex gap-3 hover:border-blue-500/20 transition-all">
                          <span className="shrink-0 text-lg">📍</span>
                          <div>
                            <h4 className="text-white text-[12px] font-bold uppercase tracking-wider">SMS GPS Secours</h4>
                            <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">Position transmise par SMS à vos proches au scan.</p>
                          </div>
                        </div>
                        <div className="bg-[#092241]/80 border border-[#1c3e66]/40 p-4 rounded-2xl flex gap-3 hover:border-amber-500/20 transition-all">
                          <span className="shrink-0 text-lg">🇸🇳</span>
                          <div>
                            <h4 className="text-white text-[12px] font-bold uppercase tracking-wider">Intégration SAMU 15</h4>
                            <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">Numéros régionaux pré-configurés Dakar→Saint-Louis.</p>
                          </div>
                        </div>
                      </div>

                      {/* CTA buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button onClick={() => { setView('citizen'); setShowRegisterForm(true); }}
                          className="bg-[#00c874] hover:bg-[#00b064] text-white py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg transition-all hover:scale-[1.02] text-center cursor-pointer">
                          Créer ma fiche d'urgence
                        </button>
                        <button onClick={() => { setView('citizen'); setShowRegisterForm(false); }}
                          className="bg-[#0e274c] hover:bg-[#153461] border border-[#00c2e0]/20 text-zinc-300 hover:text-white py-4 px-6 rounded-2xl font-bold text-xs transition-all text-center cursor-pointer">
                          Gérer mes fiches citoyen
                        </button>
                      </div>

                      <div className="pt-4 border-t border-[#1c2a3f] flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-zinc-500 font-mono">
                        <span className="text-[#5c7da5] font-bold uppercase tracking-widest">Standard Sénégal :</span>
                        <span>• Pompiers (18)</span>
                        <span>• SAMU (15)</span>
                        <span>• Gendarmerie (800 00 20 20)</span>
                      </div>
                    </div>

                    {/* RIGHT — Mockup téléphone, caché sur très petit écran */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center relative mt-6 lg:mt-0">
                      <div className="absolute w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -z-10" />
                      <div className="absolute w-56 h-56 bg-cyan-500/8 rounded-full blur-[100px] -z-10 animate-pulse" />

                      {/* Badge flottant */}
                      <div className="absolute -right-2 sm:-right-6 bottom-24 bg-[#0c1422]/90 border border-emerald-500/20 p-2.5 rounded-2xl shadow-2xl items-center gap-2 z-20 hidden sm:flex animate-bounce" style={{ animationDuration:'9s' }}>
                        <div className="bg-[#00c874]/10 p-1.5 rounded-lg text-[#00c874] font-bold text-xs">✓</div>
                        <div>
                          <div className="text-white font-extrabold text-[10px] uppercase leading-none">Dossier Validé</div>
                          <div className="text-zinc-400 text-[9px] mt-0.5 font-mono">Sain & Vérifié</div>
                        </div>
                      </div>

                      {/* Phone frame */}
                      <div className="w-[325px] sm:w-[350px] h-[645px] bg-[#050b12] rounded-[48px] p-3 border-[6px] border-[#1e2d42] shadow-[0_25px_60px_-15px_rgba(0,194,224,0.18)] relative overflow-hidden flex flex-col z-10 transition-transform duration-300 hover:scale-[1.01]">
                        {/* Speaker & Camera Notch */}
                        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#050b12] rounded-b-2xl z-30 flex items-center justify-center gap-1.5 border-b border-zinc-800/20">
                          <span className="w-8 h-1 bg-zinc-800 rounded-full" />
                          <span className="w-2 h-2 bg-[#121f35] border border-cyan-500/20 rounded-full" />
                        </div>
                        
                        <div className="flex-1 w-full rounded-[38px] overflow-hidden relative">
                          <PublicProfileView
                            user={activeUser}
                            contacts={activeContacts}
                            medicalInfo={activeMedical}
                            regionService={regionalService}
                            facilities={facilities}
                            isQRActive={activeQR ? activeQR.statut === 'actif' : true}
                            onMedicalAccessLogged={handleMedicalAccessLogged}
                            triggerEmergencyAlert={handleTriggerEmergencyAlert}
                            activeScanCount={activeScanCount}
                            qrCode={activeQR}
                            scanHistory={scanHistory.filter(s => s.user_id === activeUser.id)}
                            subscription={activeSubscription}
                            onUpdateUserDetails={handleUpdateUserDetails}
                            onUpdateMedicalDetails={handleUpdateMedicalDetails}
                            onAddEmergencyContact={handleAddEmergencyContact}
                            onRemoveEmergencyContact={handleRemoveEmergencyContact}
                            onToggleQRStatus={handleToggleQRStatus}
                            onUpdateSubscription={handleUpdateSubscription}
                            currentView={currentView}
                          />
                        </div>
                      </div>

                      {/* Interactive Scan Simulator widget */}
                      <div className="mt-5 w-full max-w-[350px] bg-[#0c1c30]/90 border border-[#00c2e0]/20 rounded-2xl p-4 shadow-xl z-20">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">🩺</span>
                          <span className="text-xs font-black text-white uppercase tracking-wider font-syne">simulation de scan médical</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mb-3 leading-snug">
                          Sélectionnez un citoyen test ci-dessous pour simuler instantanément la lecture physique de son QR code Takk-i par un médecin ou un secouriste :
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {users.slice(0, 4).map(u => {
                            const isActive = u.id === selectedUserID;
                            return (
                              <button
                                key={u.id}
                                onClick={() => {
                                  setSelectedUserID(u.id);
                                  addAuditLog('SIMULATION_SCAN', 'Secouriste', `Scan virtuel de ${u.prenom} ${u.nom}`);
                                }}
                                className={`flex flex-col text-left p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-[#00c2e0]/10 border-[#00c2e0] text-white shadow-[0_0_12px_rgba(0,194,224,0.15)] scale-[1.02]'
                                    : 'bg-[#091524] border-[#18293e] text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                                }`}
                              >
                                <span className="font-bold truncate">{u.prenom} {u.nom}</span>
                                <span className="text-[9px] font-mono opacity-60 mt-0.5">{u.id}</span>
                                {u.mode_urgence && (
                                  <span className="mt-1 inline-flex items-center gap-1 text-[9px] text-red-400 font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    Urgence active 🚨
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <p className="mt-3 text-[10px] text-[#00c2e0] font-mono uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#00c2e0] rounded-full inline-block animate-pulse" />
                        Aperçu temps réel • Simulateur Interactif
                      </p>
                    </div>
                  </div>

                  {/* STATS */}
                  <div className="grid grid-cols-3 gap-1 bg-[#0f2d4e] border border-[#1e3d64]/40 rounded-3xl overflow-hidden mt-10 sm:mt-12 shadow-2xl">
                    <div className="bg-[#081a32] p-4 sm:p-6 text-center space-y-1 hover:bg-[#0c2547] transition-colors">
                      <div className="text-cyan-400 font-syne text-2xl sm:text-4xl font-extrabold">120+</div>
                      <div className="text-[10px] sm:text-xs text-zinc-400">Familles inscrites</div>
                    </div>
                    <div className="bg-[#081a32] p-4 sm:p-6 text-center space-y-1 hover:bg-[#0c2547] transition-colors">
                      <div className="text-[#00c874] font-syne text-2xl sm:text-4xl font-extrabold">340+</div>
                      <div className="text-[10px] sm:text-xs text-zinc-400">Fiches créées</div>
                    </div>
                    <div className="bg-[#081a32] p-4 sm:p-6 text-center space-y-1 hover:bg-[#0c2547] transition-colors">
                      <div className="text-red-500 font-syne text-2xl sm:text-4xl font-extrabold">&lt;2s</div>
                      <div className="text-[10px] sm:text-xs text-zinc-400">Affichage fiche</div>
                    </div>
                  </div>
                </div>

                <PourQuiSection />

                {/* PROBLÈME */}
                <div className="bg-white border-y border-slate-200 py-14 sm:py-20 px-4 sm:px-6" id="probleme">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                      <h2 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase font-syne tracking-tight">
                        En cas d'urgence, <span className="text-red-600">chaque seconde compte</span>
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      <div className="bg-red-50 border border-red-200 p-6 sm:p-8 rounded-3xl space-y-3 hover:shadow-lg transition-all">
                        <div className="text-3xl">🚨</div>
                        <h3 className="text-red-950 font-bold text-base sm:text-lg font-syne">Pas d'information</h3>
                        <p className="text-slate-700 text-xs leading-relaxed">Le patient est inconscient. Les pompiers ignorent son groupe sanguin ou ses allergies critiques.</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-3 hover:shadow-lg transition-all">
                        <div className="text-3xl">📱</div>
                        <h3 className="text-slate-900 font-bold text-base sm:text-lg font-syne">Téléphone verrouillé</h3>
                        <p className="text-slate-600 text-xs leading-relaxed">Le smartphone est cassé ou protégé par empreinte. Les numéros SOS restent inaccessibles.</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 p-6 sm:p-8 rounded-3xl space-y-3 hover:shadow-lg transition-all">
                        <div className="text-3xl">✅</div>
                        <h3 className="text-emerald-900 font-bold text-base sm:text-lg font-syne">Takk-i résout ça</h3>
                        <p className="text-slate-700 text-xs leading-relaxed">Un bracelet avec QR Code. Aucune application requise. L'information vitale s'affiche immédiatement.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <FonctionnementSection />

                {/* DEMO QR */}
                <div className="bg-slate-50 border-y border-slate-200 py-14 sm:py-20 px-4 sm:px-6 relative overflow-hidden" id="demo">
                  <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                      <div className="space-y-5">
                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest font-mono">Démonstration de terrain 📱</span>
                        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-syne uppercase tracking-tight">
                          Un simple Scan QR,<br /><span className="text-[#00c874]">Une vie sauvée</span>
                        </h2>
                        <p className="text-slate-600 text-sm leading-relaxed">N'importe quel médecin scanne le QR code. L'information vitale s'affiche en moins de 2 secondes.</p>
                        <div className="space-y-3">
                          {[
                            { n:1, title:'Le secouriste scanne', desc:'Compatible 100% smartphones, sans app.' },
                            { n:2, title:'Fiche chargée < 2s', desc:'Groupe sanguin, allergies, numéros immédiats.' },
                            { n:3, title:'Décision immédiate', desc:"Appels directs famille en 1 clic." },
                          ].map(step => (
                            <div key={step.n} className={`p-4 rounded-2xl border flex gap-4 items-center transition-all duration-300 ${demoStepIndex === step.n ? (step.n === 3 ? 'bg-emerald-50 border-emerald-200 translate-x-1 shadow-md' : 'bg-blue-50 border-blue-200 translate-x-1 shadow-md') : 'bg-white border-slate-200/60 opacity-75'}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${demoStepIndex === step.n ? (step.n === 3 ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white') : 'bg-slate-100 text-slate-500'}`}>{step.n}</div>
                              <div>
                                <h4 className={`text-xs font-bold uppercase ${demoStepIndex === step.n ? 'text-slate-950' : 'text-slate-700'}`}>{step.title}</h4>
                                <p className="text-slate-500 text-[11px]">{step.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-5">
                        <div className="w-full max-w-[280px] sm:w-[310px] h-[280px] sm:h-[310px] bg-gradient-to-b from-[#0b1623] to-[#04080e] border border-[#213554]/60 rounded-3xl p-4 shadow-2xl relative overflow-hidden flex items-center justify-center">
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[9px] font-mono uppercase text-zinc-500">
                            <span className="flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${demoRunning ? 'bg-red-500 animate-ping' : 'bg-cyan-500'}`} />
                              {demoStatusText}
                            </span>
                            <span>{activeUser.id}</span>
                          </div>
                          <div className={`absolute left-0 right-0 z-30 flex flex-col items-center transition-all duration-700 ${demoScanning ? 'top-10 opacity-100' : '-top-20 opacity-0'}`}>
                            <div className="bg-[#121f35]/90 border border-cyan-400 text-cyan-400 text-[9px] font-mono uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5">📷 Smart Scanner Takk-i</div>
                            <div className={`w-[160px] h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-1 ${demoBeamActive ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
                          </div>
                          <div className={`transition-all duration-300 flex flex-col items-center ${demoResultVisible ? 'opacity-20 scale-75 blur-sm' : 'opacity-90'}`}>
                            <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-2">
                              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                                <rect x="5" y="5" width="22" height="22" stroke="#0B1F3A" strokeWidth="2.5" rx="3"/>
                                <rect x="10" y="10" width="12" height="12" fill="#0B1F3A" opacity="0.6"/>
                                <rect x="73" y="5" width="22" height="22" stroke="#0B1F3A" strokeWidth="2.5" rx="3"/>
                                <rect x="78" y="10" width="12" height="12" fill="#0B1F3A" opacity="0.6"/>
                                <rect x="5" y="73" width="22" height="22" stroke="#0B1F3A" strokeWidth="2.5" rx="3"/>
                                <rect x="10" y="78" width="12" height="12" fill="#0B1F3A" opacity="0.6"/>
                                <rect x="36" y="5" width="6" height="6" fill="#00c874"/>
                                <rect x="48" y="5" width="6" height="6" fill="#0B1F3A"/>
                                <rect x="60" y="5" width="6" height="6" fill="#00c874"/>
                                <rect x="36" y="44" width="6" height="6" fill="#0B1F3A"/>
                                <rect x="48" y="44" width="6" height="6" fill="#00c874"/>
                                <rect x="60" y="44" width="6" height="6" fill="#0B1F3A"/>
                                <rect x="36" y="56" width="6" height="6" fill="#00c874"/>
                                <rect x="60" y="56" width="6" height="6" fill="#00c874"/>
                              </svg>
                            </div>
                            <div className="font-mono text-[#5c7da5] text-[10px] mt-2 tracking-widest uppercase">{activeUser.id}</div>
                          </div>
                          <div className={`absolute bottom-3 left-3 right-3 bg-white rounded-2xl shadow-2xl border-l-4 border-red-500 transition-all duration-500 z-40 ${demoResultVisible ? 'translate-y-0 opacity-100' : 'translate-y-48 opacity-0'}`}>
                            <div className="bg-[#0b1623] text-white text-[9px] px-3 py-1.5 font-mono uppercase rounded-tr flex justify-between">
                              <span>🚨 Fiche Décryptée</span>
                              <span className="text-[#00c874] text-[8px]">SÉCURISÉ</span>
                            </div>
                            <div className="p-3 space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-[#0B1F3A]">{activeUser.prenom}</span>
                                <span className="bg-red-100 text-[#e12a2e] px-2 py-0.5 rounded text-xs font-black">{activeUser.groupe_sanguin}</span>
                              </div>
                              <div className="text-[10px] text-zinc-600">
                                {activeMedical?.maladies ? `🩺 ${activeMedical.maladies}` : '✅ Aucun antécédent critique'}
                              </div>
                              {activeContacts[0] && (
                                <div className="font-mono text-[10px] text-zinc-900 bg-zinc-50 rounded p-1 flex justify-between">
                                  <span>📞</span><span>{activeContacts[0].telephone_contact}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <button onClick={runQRDemo} disabled={demoRunning}
                          className={`py-3 px-6 rounded-2xl text-[11px] uppercase tracking-wider font-semibold border transition-all ${demoRunning ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 text-white border-transparent shadow-md hover:scale-[1.01]'}`}>
                          {demoRunning ? '⏳ Simulation...' : '▶ Rejouer la simulation'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TÉMOIGNAGES */}
                <div className="bg-[#070e17] py-14 sm:py-20 px-4 sm:px-6" id="testimonials">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                      <span className="text-xs font-bold text-[#3282f6] uppercase tracking-widest font-mono">Ils font confiance à Takk-i</span>
                      <h2 className="text-2xl sm:text-4xl font-black text-white uppercase font-syne mt-2">Déjà adopté par <span className="text-cyan-400">120 familles</span></h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                      <div className="bg-[#0b1623]/60 border border-[#213554]/40 p-5 sm:p-6 rounded-2xl space-y-3">
                        <div className="text-amber-500 text-xs">★★★★★</div>
                        <p className="text-zinc-300 text-xs leading-relaxed italic">"Mon fils fait du sport à Thiès. Avec son bracelet Takk-i, les secours auront ses infos en cas d'accident."</p>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1e70e4] flex items-center justify-center font-bold text-xs text-white shrink-0">FD</div>
                          <div><h4 className="text-white text-xs font-bold">Fatou Diallo</h4><span className="text-[10px] text-zinc-500">Mère de famille, Dakar</span></div>
                        </div>
                      </div>
                      <div className="bg-[#0b1623]/90 border border-emerald-500/30 p-5 sm:p-6 rounded-2xl space-y-3 relative">
                        <div className="absolute top-3 right-3 bg-emerald-500/10 text-[#00c874] text-[8px] font-extrabold uppercase px-2 py-0.5 rounded border border-emerald-500/30">⭐ Vérifié</div>
                        <div className="text-amber-500 text-xs">★★★★★</div>
                        <p className="text-zinc-300 text-xs leading-relaxed italic">"Je suis épileptique. Un médecin de l'Hôpital de Saint-Louis a lu mes médicaments en 3 secondes."</p>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#e12a2e] flex items-center justify-center font-bold text-xs text-white shrink-0">MS</div>
                          <div><h4 className="text-white text-xs font-bold">Mamadou Sarr</h4><span className="text-[10px] text-zinc-500">Commercial, Thiès</span></div>
                        </div>
                      </div>
                      <div className="bg-[#0b1623]/60 border border-[#213554]/40 p-5 sm:p-6 rounded-2xl space-y-3 sm:col-span-2 md:col-span-1">
                        <div className="text-amber-500 text-xs">★★★★★</div>
                        <p className="text-zinc-300 text-xs leading-relaxed italic">"Je recommande Takk-i à tous mes patients chroniques. Simple, fiable et adapté à nos hôpitaux."</p>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#00c874] flex items-center justify-center font-bold text-xs text-white shrink-0">AN</div>
                          <div><h4 className="text-white text-xs font-bold">Aissatou Ndiaye</h4><span className="text-[10px] text-zinc-500">Infirmière, CHU de Dakar</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <SafeBandSection />
                <NosProduitsSection />
                <EntrepriseSection />
                <SecuriteSection />
                <InterfaceUtilisateurSection />

                {/* TARIFS */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center" id="tarifs">
                  <h2 className="text-2xl sm:text-4xl font-black text-white uppercase font-syne tracking-tight mb-8 sm:mb-10">
                    Une offre pour <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c874] to-cyan-400">chaque besoin</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
                    <div className="bg-[#080f18] border border-[#213554]/40 rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest block">Takk-i Free</span>
                          <div className="text-white text-2xl font-black font-syne mt-1">0 <span className="text-xs font-normal text-zinc-400">FCFA</span></div>
                          <span className="text-[10px] text-zinc-400 block mt-1">Pour démarrer</span>
                        </div>
                        <div className="h-px bg-zinc-800" />
                        <ul className="space-y-2">{['Profil basique','ID TAKKI-XXXX','2 contacts inclus'].map(f => <li key={f} className="flex gap-2 text-[11px] text-zinc-300">✓ <span>{f}</span></li>)}</ul>
                      </div>
                      <button onClick={() => { setView('citizen'); handleUpdateSubscription('gratuit','Aucun'); }} className="w-full py-3 rounded-xl text-xs font-bold uppercase mt-6 bg-[#14233c] hover:bg-[#1a2d4b] text-white transition-colors">Choisir Free</button>
                    </div>

                    <div className="bg-[#080f18] border-2 border-[#00c874] rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/5">
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00c874] text-[#060b13] font-mono uppercase font-black text-[9px] px-3.5 py-1 rounded-full whitespace-nowrap">⭐ Recommandé</div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-widest block font-bold">Takk-i Premium</span>
                          <div className="text-white text-3xl font-black font-syne mt-1">2 500 <span className="text-xs font-normal text-zinc-400">FCFA/mois</span></div>
                          <span className="text-[10px] text-zinc-400 block mt-1">20 000 FCFA/an</span>
                        </div>
                        <div className="h-px bg-zinc-800" />
                        <ul className="space-y-2">{['Modifications illimitées','SMS au scan','Dossier clinique complet','Désactivation 1-clic'].map(f => <li key={f} className="flex gap-2 text-[11px] text-zinc-200">✓ <span className="text-[#00c874] font-bold">{f}</span></li>)}</ul>
                      </div>
                      <button onClick={() => { setView('citizen'); handleUpdateSubscription('premium_annuel','Wave'); }} className="w-full py-3 rounded-xl text-xs font-bold uppercase mt-6 bg-[#00c874] hover:bg-[#00b064] text-[#060b13] transition-colors">Souscrire Premium</button>
                    </div>

                    <div className="bg-[#080f18] border border-[#213554]/40 rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest block">Takk-i Health</span>
                          <div className="text-white text-2xl font-black font-syne mt-1">35 000+ <span className="text-xs font-normal text-zinc-400">FCFA</span></div>
                          <span className="text-[10px] text-zinc-400 block mt-1">Cliniques &amp; SAMU</span>
                        </div>
                        <div className="h-px bg-zinc-800" />
                        <ul className="space-y-2">{['Accès dossiers réels','Console médicale','PIN urgentistes','Journal audit'].map(f => <li key={f} className="flex gap-2 text-[11px] text-zinc-300">✓ <span>{f}</span></li>)}</ul>
                      </div>
                      <button onClick={() => isAdminUnlocked ? setView('admin') : handleUnlockAdmin()} className="w-full py-3 rounded-xl text-xs font-bold uppercase mt-6 bg-[#14233c] hover:bg-[#1a2d4b] text-cyan-400 border border-cyan-500/20 transition-colors">Espace Établissement</button>
                    </div>

                    <div className="bg-[#080f18] border border-[#213554]/40 rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest block">Takk-i Rescue</span>
                          <div className="text-white text-2xl font-black font-syne mt-1">50 000+ <span className="text-xs font-normal text-zinc-400">FCFA</span></div>
                          <span className="text-[10px] text-zinc-400 block mt-1">Sécurité &amp; Gendarmerie</span>
                        </div>
                        <div className="h-px bg-zinc-800" />
                        <ul className="space-y-2">{['Scan terrain','Géolocalisation','Alertes temps réel','Support dédié'].map(f => <li key={f} className="flex gap-2 text-[11px] text-zinc-300">✓ <span>{f}</span></li>)}</ul>
                      </div>
                      <button onClick={() => alert('contact@takki.sn')} className="w-full py-3 rounded-xl text-xs font-bold uppercase mt-6 bg-[#14233c] hover:bg-[#1a2d4b] text-white transition-colors">B2B Secours</button>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ── VUE CITOYEN ── */}
            {currentView === 'citizen' && (
              <motion.div key="citizen-view" initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-15 }} transition={{ duration:0.35,ease:"easeInOut" }} className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                
                {/* Header section structure */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#183656]/50">
                  <div className="text-left space-y-1.5 flex-1 select-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest font-mono bg-[#092b4d] text-cyan-400 border border-[#00c2e0]/20 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      Portail Citoyen Sécurisé
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-syne">
                      Espace <span className="text-cyan-400">Citoyen</span>
                    </h2>
                    <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                      Gérez vos informations de santé, configurez vos contacts d'urgence avisés par SMS, suivez le journal d'audit de vos scans de sécurité, et commandez vos supports physiques officiels Takk-i 🇸🇳.
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    {!showRegisterForm && (
                      <button 
                        onClick={() => setShowRegisterForm(true)} 
                        className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold px-5 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-emerald-100" /> Créer un nouveau compte
                      </button>
                    )}
                  </div>
                </div>

                {/* Account Toggle Widget */}
                <div className="w-full bg-[#0a1420]/80 border border-[#1e2d42]/60 rounded-3xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-mono">Simulateur de Connexion Citoyenne</span>
                    <h3 className="text-white font-black text-sm uppercase">Sélectionner un compte de test :</h3>
                    <p className="text-zinc-400 text-[11px]">Basculez instantanément pour tester les fiches médicales, types d'abonnements, et configurations de Seydou, Demba, etc.</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {users.map(u => {
                      const isSelected = u.id === activeUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => setSelectedUserID(u.id)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected 
                              ? 'bg-[#00c2e0] text-[#061d33] font-black shadow-[0_0_15px_rgba(0,194,224,0.25)] scale-[1.01]' 
                              : 'bg-[#101b2a] hover:bg-[#18293e]/80 text-zinc-300 border border-[#1e2d42]/60'
                          }`}
                        >
                          <span className="text-xs">{u.photo || "👨🏾‍💼"}</span>
                          <span>{u.prenom} {u.nom}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Main page wide Citizen Dashboard component */}
                <div className="bg-[#061424] border border-[#183656]/50 rounded-[32px] overflow-hidden shadow-2xl">
                  <UserDashboard
                    user={activeUser}
                    contacts={activeContacts}
                    medicalInfo={activeMedical}
                    qrCode={activeQR}
                    scanHistory={scanHistory.filter(s => s.user_id === activeUser.id)}
                    subscription={activeSubscription}
                    onUpdateUserDetails={handleUpdateUserDetails}
                    onUpdateMedicalDetails={handleUpdateMedicalDetails}
                    onAddEmergencyContact={handleAddEmergencyContact}
                    onRemoveEmergencyContact={handleRemoveEmergencyContact}
                    onToggleQRStatus={handleToggleQRStatus}
                    onUpdateSubscription={handleUpdateSubscription}
                  />
                </div>

              </motion.div>
            )}

            {/* ── VUE ADMIN ── */}
            {currentView === 'admin' && (
              <motion.div key="admin-view" initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-15 }} transition={{ duration:0.35,ease:"easeInOut" }}>
                <AdminConsole
                  users={users} qrCodes={qrCodes} facilities={facilities} alerts={alerts} auditLogs={auditLogs}
                  onToggleUserQRStatus={handleToggleQRStatus} onAddFacility={handleAddFacility}
                  onRevokeFacility={handleRevokeFacility} onRenewFacilityPIN={handleRenewFacilityPIN}
                  onClearAlert={handleClearAlert} onDeleteUser={handleDeleteUser}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 text-center text-zinc-400 text-xs py-10 border-t border-[#1c2e4a]/60 bg-[#060b13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3">
          <div className="text-xl font-wide text-white uppercase tracking-tighter">Takk<span className="text-[#3282f6]">-i</span> Sénégal</div>
          <p className="font-mono text-zinc-400 text-[11px] uppercase tracking-wider">Dispositif d'urgence mobile dématérialisé conforme CDP</p>
          <p className="text-[10px] text-zinc-500 max-w-xl mx-auto leading-relaxed">Homologué conformément à la Loi n°2008-12. Chiffrement bout-en-bout.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-[9.5px] font-mono pt-2">
            <span className="text-[#3282f6]/60">© {new Date().getFullYear()} Takk-i Dakar Inc.</span>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <button onClick={handleUnlockAdmin} className="hover:text-zinc-300 underline cursor-pointer text-zinc-500 transition-colors">
              {isAdminUnlocked ? "🔓 Console Administration déverrouillée" : "🔒 Accès Administrateur"}
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
