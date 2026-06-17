/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TakkIUser, 
  MedicalFacility, 
  ScanAlert, 
  AuditLog, 
  BloodGroup,
  QRCodeData
} from '../types';
import { 
  Users, 
  FileLock2, 
  Bell, 
  ShieldCheck, 
  ClipboardList, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Search, 
  ShieldAlert, 
  RotateCw,
  Power,
  Calendar,
  Building,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface AdminConsoleProps {
  users: TakkIUser[];
  qrCodes: QRCodeData[];
  facilities: MedicalFacility[];
  alerts: ScanAlert[];
  auditLogs: AuditLog[];
  onToggleUserQRStatus: (userId: string) => void;
  onAddFacility: (facility: Omit<MedicalFacility, 'id'>) => void;
  onRevokeFacility: (id: string) => void;
  onRenewFacilityPIN: (id: string) => void;
  onClearAlert: (id: string) => void;
  onDeleteUser: (id: string) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  users,
  qrCodes,
  facilities,
  alerts,
  auditLogs,
  onToggleUserQRStatus,
  onAddFacility,
  onRevokeFacility,
  onRenewFacilityPIN,
  onClearAlert,
  onDeleteUser
}) => {
  const [adminTab, setAdminTab] = useState<'users' | 'clinics' | 'alerts' | 'audit'>('users');
  const [searchTerm, setSearchTerm] = useState('');

  // Form states to create clinical Facility
  const [newFacilityName, setNewFacilityName] = useState('');
  const [newFacilityCity, setNewFacilityCity] = useState('Dakar');
  const [newFacilityPIN, setNewFacilityPIN] = useState('');

  const filteredUsers = users.filter(u => {
    const matchStr = `${u.prenom} ${u.nom} ${u.id} ${u.region} ${u.ville}`.toLowerCase();
    return matchStr.includes(searchTerm.toLowerCase());
  });

  const getQRStatus = (userId: string): 'actif' | 'suspendu' => {
    const qr = qrCodes.find(q => q.user_id === userId);
    return qr ? qr.statut : 'suspendu';
  };

  const handleCreateFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacilityName || newFacilityPIN.length !== 6) {
      alert("Veuillez saisir un nom d'établissement valide et un code PIN à 6 chiffres.");
      return;
    }
    
    // Create six-month expiration date
    const expDate = new Date();
    expDate.setMonth(expDate.getMonth() + 6);

    onAddFacility({
      nom: newFacilityName,
      ville: newFacilityCity,
      code_pin: newFacilityPIN,
      date_expiration: expDate.toISOString()
    });

    // Reset values
    setNewFacilityName('');
    setNewFacilityPIN('');
    alert("L'établissement de santé a été créé ! Le code PIN expirera automatiquement dans 6 mois conformement aux exigences MVP.");
  };

  // Stats calculation
  const totalUsers = users.length;
  const activeAlertsCount = alerts.filter(a => a.statut === 'actif').length;
  const activeQRCodesCount = qrCodes.filter(q => q.statut === 'actif').length;
  const suspendedQRCodesCount = qrCodes.filter(q => q.statut === 'suspendu').length;

  return (
    <div className="max-w-6xl mx-auto my-6 px-4 font-sans space-y-6">
      
      {/* HEADER STATEMENT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 border border-zinc-100 p-5 rounded-3xl">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5.5 h-5.5 text-rose-600" />
            <span>Pôle de Contrôle Admin & SAMU Sénégal</span>
          </h2>
          <p className="text-zinc-500 text-xs font-mono mt-0.5">
            Administration centrale TAKK-I ID · Supervision des anomalies sanitaires
          </p>
        </div>
        <div className="bg-red-50 text-red-700 text-xs font-mono px-3 py-1.5 rounded-xl border border-red-150 flex items-center gap-1.5 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <span>{activeAlertsCount} Alerte(s) d'urgence active(s)</span>
        </div>
      </div>

      {/* KPI METRIC CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Users KPI */}
        <div className="bg-white border border-zinc-100 p-4.5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-mono tracking-tight uppercase block">Utilisateurs inscrits</span>
            <span className="text-xl font-extrabold text-zinc-800">{totalUsers} citoyens</span>
          </div>
        </div>

        {/* QR Active KPI */}
        <div className="bg-white border border-zinc-100 p-4.5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-mono tracking-tight uppercase block">Supports Actifs</span>
            <span className="text-xl font-extrabold text-zinc-800">{activeQRCodesCount} bracelets</span>
          </div>
        </div>

        {/* QR suspended Lost KPI */}
        <div className="bg-white border border-zinc-100 p-4.5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-mono tracking-tight uppercase block">Supports Perdus (Désactivés)</span>
            <span className="text-xl font-extrabold text-zinc-800">{suspendedQRCodesCount} perdu(s)</span>
          </div>
        </div>

        {/* Clinics Authorized KPI */}
        <div className="bg-white border border-zinc-100 p-4.5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-mono tracking-tight uppercase block">Cliniques Certifiées</span>
            <span className="text-xl font-extrabold text-zinc-800">{facilities.length} hopitaux</span>
          </div>
        </div>

      </div>

      {/* CORE ADMINISTRATIVE INTERACTION WINDOW */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* NAV SELECTION TAB PANEL */}
        <div className="lg:col-span-1 bg-white border border-zinc-100 p-3 rounded-2xl flex flex-col gap-1.5 self-start">
          <button
            onClick={() => setAdminTab('users')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              adminTab === 'users' ? 'bg-zinc-900 text-white font-extrabold shadow-sm' : 'text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gestion Citoyens</span>
          </button>

          <button
            onClick={() => setAdminTab('clinics')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              adminTab === 'clinics' ? 'bg-zinc-900 text-white font-extrabold shadow-sm' : 'text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Hôpitaux & Codes PIN</span>
          </button>

          <button
            onClick={() => setAdminTab('alerts')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              adminTab === 'alerts' ? 'bg-zinc-900 text-white font-extrabold shadow-sm' : 'text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="flex-1">Alertes Abus / Urgences</span>
            {activeAlertsCount > 0 && (
              <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                {activeAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('audit')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              adminTab === 'audit' ? 'bg-zinc-900 text-white font-extrabold shadow-sm' : 'text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Journal d'Audit Transparence</span>
          </button>
        </div>

        {/* PRIMARY DISPLAY CONTENT OF SELECTED ADMIN TAB */}
        <div className="lg:col-span-3 bg-white border border-zinc-100 p-5 rounded-2xl shadow-xs">
          
          {/* TAB A: USER CHANNELS AND LOSS DEACTIVATION (La désactivation de QR code perdu/volé en 1 clic) */}
          {adminTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">Répertoire National des QR Codes</h3>
                  <p className="text-zinc-400 text-xs">Mettre à jour les dossiers, suspendre les supports perdus et supprimer les fiches demandées.</p>
                </div>

                {/* SEARCH INTUITIVE */}
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Chercher par nom, ID..."
                    className="w-full text-xs pl-9 pr-3 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 bg-slate-50"
                  />
                </div>
              </div>

              {/* CITIZENS CENTRAL TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[10px] text-zinc-400 font-mono tracking-wider uppercase bg-slate-50">
                      <th className="py-2.5 px-3">Citoyen (ID)</th>
                      <th className="py-2.5 px-3">Région / Ville</th>
                      <th className="py-2.5 px-3">Sang</th>
                      <th className="py-2.5 px-3 text-center">Statut Support (1-Clic)</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => {
                      const qrStatus = getQRStatus(u.id);
                      return (
                        <tr key={u.id} className="border-b border-zinc-100 hover:bg-slate-50/50">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{u.photo || "👨🏾‍💼"}</span>
                              <div>
                                <span className="font-bold text-zinc-800 block">{u.prenom} {u.nom}</span>
                                <span className="text-[10px] text-zinc-400 font-mono font-bold block">{u.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-zinc-600 block">{u.region}</span>
                            <span className="text-[10px] text-zinc-400 font-mono block">{u.ville}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="bg-rose-50 text-rose-700 font-mono font-extrabold px-1.5 py-0.5 rounded border border-rose-200/50">
                              {u.groupe_sanguin}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => {
                                onToggleUserQRStatus(u.id);
                              }}
                              id={`toggle-qr-status-${u.id}`}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                                qrStatus === 'actif'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                              }`}
                              title={qrStatus === 'actif' ? "Signaler perdu/volé" : "Réactiver"}
                            >
                              {qrStatus === 'actif' ? 'ACTIF (Désactiver)' : 'PERDU (Réactiver)'}
                            </button>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement le compte de ${u.prenom} ${u.nom} ? Cette action est irréversible.`)) {
                                  onDeleteUser(u.id);
                                }
                              }}
                              className="text-zinc-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all inline-block"
                              title="Supprimer la fiche"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB B: MANAGING CLINICS SECURE CODES (Gérer les codes médicaux par établissement, Expiration automatique sous 6 mois, Renouvellement manuel) */}
          {adminTab === 'clinics' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-zinc-900 text-sm">Gestion des Codes d'Accès Médicaux</h3>
                <p className="text-zinc-400 text-xs">Configurez les codes PIN à 6 chiffres attribués par établissement d'urgence sénégalais. Les codes expirent au bout de 6 mois.</p>
              </div>

              {/* LIST OF CURRENT FACILITIES */}
              <div className="space-y-3">
                {facilities.map((fac) => {
                  const expirationDate = new Date(fac.date_expiration);
                  const isExpired = expirationDate.getTime() < new Date().getTime();
                  return (
                    <div key={fac.id} className={`border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs relative ${
                      isExpired ? 'border-red-200 bg-red-50/20' : 'border-zinc-150 bg-slate-50/50'
                    }`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-zinc-500" />
                          <strong className="text-zinc-800 font-sans text-sm">{fac.nom}</strong>
                          <span className="bg-zinc-200 font-mono text-[9px] px-1.5 py-0.5 rounded text-zinc-600 uppercase font-bold">
                            {fac.id}
                          </span>
                        </div>
                        <p className="text-zinc-500 font-mono mt-1">
                          Ville : {fac.ville} • Code PIN : <span className="font-bold text-zinc-900 bg-white px-1 border select-all">{fac.code_pin}</span> 
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-1 font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Expire le : {expirationDate.toLocaleDateString('fr-FR')} </span>
                          {isExpired ? (
                            <span className="text-red-650 font-bold bg-red-100 px-1 py-0.1 rounded lowercase">Expiré !</span>
                          ) : (
                            <span className="text-emerald-700 font-bold bg-emerald-100 px-1 py-0.1 rounded lowercase">Validé</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onRenewFacilityPIN(fac.id)}
                          className="bg-slate-900 hover:bg-black text-white py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all"
                        >
                          <RotateCw className="w-3 h-3" />
                          <span>Renouveler (6 mois)</span>
                        </button>
                        <button
                          onClick={() => onRevokeFacility(fac.id)}
                          className="text-red-700 hover:bg-red-50 border border-red-200 py-1.5 px-3 rounded-lg text-[10px] font-bold"
                          title="Révoquer l'accès"
                        >
                          Révoquer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* NEW CLINIC FORM GENERATOR */}
              <form onSubmit={handleCreateFacility} className="border border-zinc-100 p-4.5 rounded-xl space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">Enregistrer un nouvel établissement hospitalier</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                  <div>
                    <label className="text-zinc-500 block mb-1">Nom de l'Etablissement</label>
                    <input
                      type="text"
                      value={newFacilityName}
                      onChange={(e) => setNewFacilityName(e.target.value)}
                      placeholder="Ex: Clinique du Cap Dakar"
                      className="w-full border border-zinc-200 p-2 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Ville</label>
                    <select
                      value={newFacilityCity}
                      onChange={(e) => setNewFacilityCity(e.target.value)}
                      className="w-full border border-zinc-200 p-2 rounded-xl bg-white"
                    >
                      <option value="Dakar">Dakar</option>
                      <option value="Thiès">Thiès</option>
                      <option value="Saint-Louis">Saint-Louis</option>
                      <option value="Touba">Touba</option>
                      <option value="Ziguinchor">Ziguinchor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">Code PIN à 6 Chiffres d'Urgence</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={newFacilityPIN}
                      onChange={(e) => setNewFacilityPIN(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Ex: 750015"
                      className="w-full border border-zinc-200 p-2 rounded-xl font-mono text-center tracking-[0.2em] font-extrabold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-xl flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Créer le PIN de garde</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB C: ALERTS DETECTOR (Si un QR code est scanné plus de 5 fois en moins d’une heure, déclencher une alerte administrative) */}
          {adminTab === 'alerts' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-zinc-900 text-sm">Système de Détection d'Abus ou Cas Graves</h3>
                <p className="text-zinc-400 text-xs text-rose-700">
                  Règle Takk-i : Si un QR est scanné plus de 5 fois en moins d'une heure, une alerte d'urgence majeure est levée pour coordonner les secours.
                </p>
              </div>

              {alerts.length === 0 ? (
                <div className="text-center py-10 border border-dashed text-zinc-400 text-xs">
                  Aucune alerte active signalée pour le moment.
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((al) => (
                    <div key={al.id} className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                      al.statut === 'actif' ? 'border-red-200 bg-red-50/50' : 'border-zinc-200 bg-slate-50/20'
                    }`}>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${al.statut === 'actif' ? 'bg-red-650 animate-ping' : 'bg-zinc-400'}`} />
                          <strong className="text-zinc-800 text-sm">Alerte Déclenchée sur {al.qr_code_id}</strong>
                          <span className="font-mono bg-red-100 text-red-800 font-extrabold px-1.5 rounded">
                            {al.scans_count} scans / h
                          </span>
                        </div>
                        <p className="text-zinc-650 leading-relaxed font-semibold">{al.description}</p>
                        <p className="text-zinc-405 font-mono text-[10px]">Déclenchée à {al.heure_alerte} le {al.date_alerte}</p>
                      </div>

                      {al.statut === 'actif' && (
                        <button
                          onClick={() => {
                            onClearAlert(al.id);
                            alert("Alerte résolue ! Le signal sanitaire est repassé au vert pour cet utilisateur.");
                          }}
                          className="bg-red-600 hover:bg-black text-white shrink-0 text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition-all"
                        >
                          Acquitter / Résoudre
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB D: SECURE AUDIT LOG JOURNAL (Loi sénégalaise n°2008-12 protection des données) */}
          {adminTab === 'audit' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-zinc-900 text-sm">Registre des Traitements & Journal d'Audit CDN</h3>
                <p className="text-zinc-400 text-xs">
                  Toute consultation de dossier médical est obligatoirement tracée conformément à la loi sénégalaise n°2008-12 de la CDP.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-150 text-[10px] text-zinc-400 font-mono tracking-wider uppercase bg-slate-50">
                      <th className="py-2.5 px-3">Date-Heure (UTC)</th>
                      <th className="py-2.5 px-3">Action CDP</th>
                      <th className="py-2.5 px-3">Acteur Responsable</th>
                      <th className="py-2.5 px-3">Détails consultés</th>
                      <th className="py-2.5 px-3 text-right">Adresse IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b border-zinc-100 hover:bg-slate-50/50 font-mono text-[11px]">
                        <td className="py-2.5 px-3 text-zinc-500">{log.date_heure}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] ${
                            log.action === 'LECTURE_DOSSIER_MED' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-zinc-800">{log.acteur}</td>
                        <td className="py-2.5 px-3 text-zinc-600">{log.details}</td>
                        <td className="py-2.5 px-3 text-zinc-400 text-right">{log.ip || "Serveur" }</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
