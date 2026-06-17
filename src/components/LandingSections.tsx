import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, Baby, Activity, Compass, Flame, QrCode, 
  UserPlus, ShoppingBag, Scan, CreditCard, Watch, Tag, 
  GraduationCap, Building2, Trophy, Truck, Lock, ShieldCheck, 
  User, Shield
} from 'lucide-react';

// Card interface
interface PourQuiCard {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export function PourQuiSection() {
  const cards: PourQuiCard[] = [
    {
      icon: <span className="text-4xl select-none">👴</span>,
      title: "Seniors",
      desc: "Traitements, antécédents et contacts familiaux disponibles instantanément."
    },
    {
      icon: <span className="text-4xl select-none">👧</span>,
      title: "Enfants",
      desc: "Bracelet sécurisé avec info parentale et allergies alimentaires."
    },
    {
      icon: <span className="text-4xl select-none">🏃</span>,
      title: "Sportifs",
      desc: "Courir, faire du vélo ou du sport extrême en toute sécurité."
    },
    {
      icon: <span className="text-4xl select-none">✈️</span>,
      title: "Voyageurs",
      desc: "Accessible dans n'importe quel pays, sans barrière de langue."
    },
    {
      icon: <span className="text-4xl select-none">💊</span>,
      title: "Patients chroniques",
      desc: "Diabète, épilepsie, maladies cardiaques — une info critique accessible."
    }
  ];

  return (
    <div className="bg-[#061d33] py-16 sm:py-20 px-4 sm:px-6 border-t border-[#183656]/40" id="pour-qui">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-black text-cyan-400 uppercase tracking-widest font-mono">POUR QUI</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-syne tracking-tight leading-none">
            Takk-i est fait <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#00c2e0]">pour tout le monde</span>
          </h2>
          <p className="text-zinc-400 text-sm max-w-2xl mx-auto leading-relaxed font-semibold">
            Toute personne peut bénéficier d'une fiche médicale d'urgence, quel que soit son âge ou son état de santé.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {cards.map((c, idx) => (
            <motion.div 
              key={c.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="bg-[#092241]/80 border border-[#1c3e66]/40 hover:border-[#00c2e0]/30 rounded-3xl p-6 flex flex-col items-center text-center space-y-4 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              id={`pour-qui-card-${idx}`}
            >
              <div className="flex items-center justify-center min-h-[50px]">
                {c.icon}
              </div>
              <h3 className="text-white font-bold text-base tracking-tight font-sans">{c.title}</h3>
              <p className="text-[#8e9fae] text-xs leading-relaxed font-normal">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FonctionnementSection() {
  const steps = [
    {
      num: 1,
      icon: <UserPlus className="w-6 h-6 text-white" />,
      title: "Créez votre profil",
      desc: "Prénom, groupe sanguin, allergies graves et contact d'urgence."
    },
    {
      num: 2,
      icon: <QrCode className="w-6 h-6 text-white" />,
      title: "Recevez votre QR code",
      desc: "Un identifiant unique TAKKI-XXXX, anonyme et sécurisé, généré pour vous."
    },
    {
      num: 3,
      icon: <ShoppingBag className="w-6 h-6 text-white" />,
      title: "Choisissez votre support",
      desc: "Bracelet, carte portefeuille ou sticker — livré à votre adresse."
    },
    {
      num: 4,
      icon: <Scan className="w-6 h-6 text-white" />,
      title: "Les secours scannent",
      desc: "En cas d'urgence, un simple scan affiche vos infos vitales en 2 secondes."
    }
  ];

  return (
    <div className="bg-slate-50 border-y border-slate-200/80 py-16 sm:py-20 px-4 sm:px-6" id="fonctionnement">
      <div className="max-w-7xl mx-auto space-y-14">
        <div className="text-center space-y-3">
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest font-mono">FONCTIONNEMENT</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0B1F3A] uppercase font-syne tracking-tight leading-none">
            Simple à créer, <span className="text-[#3282f6]">vital en urgence</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
            En moins de 5 minutes, votre fiche médicale d'urgence est prête et accessible partout.
          </p>
        </div>

        {/* Timeline wrapper */}
        <div className="relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-7 left-14 right-14 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 -z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((st, idx) => (
              <motion.div 
                key={st.num}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.4 }}
                className="flex flex-col items-center text-center space-y-4"
                id={`step-card-${st.num}`}
              >
                {/* Node circle */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-[#00c2e0] flex items-center justify-center font-bold text-white shadow-[0_4px_20px_rgba(0,194,224,0.3)] border-2 border-white ring-4 ring-blue-100 transition-transform duration-300 hover:scale-110">
                  <span className="text-lg font-black">{st.num}</span>
                </div>

                <div className="space-y-1.5 px-4">
                  <h3 className="text-slate-900 font-extrabold text-sm sm:text-base uppercase tracking-tight">{st.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">{st.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SafeBandSection() {
  return (
    <div className="bg-[#061d33] py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden" id="safeband">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] -z-10" />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
        {/* Left Side */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-black text-cyan-400 uppercase tracking-widest font-mono">TAKK-I SAFEBAND</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-syne tracking-tight leading-xs">
            Le bracelet médical <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">qui parle pour vous</span>
          </h2>
          <p className="text-zinc-300 text-sm leading-relaxed max-w-lg">
            Un QR code gravé sur silicone hypoallergénique. Un scan suffit pour afficher votre fiche d'urgence — sans batterie, sans application.
          </p>

          <div className="space-y-3.5 pt-2">
            {[
              { bullet: "Gravure laser inaltérable", desc: "QR code gravé à vie sur plaque métallique protégée." },
              { bullet: "Silicone médical de haute qualité", desc: "Silicone hypoallergénique, respirant et d'un confort absolu." },
              { bullet: "Totalement passif", desc: "Ne nécessite aucune recharge, batterie ou forfait de données." },
              { bullet: "Résistance extrême", desc: "Idéal pour le sport, la douche, la piscine ou l'océan." }
            ].map((b, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-cyan-400 text-sm font-bold">✓</span>
                <div>
                  <h4 className="text-white text-xs font-bold font-syne uppercase">{b.bullet}</h4>
                  <p className="text-zinc-400 text-[11px] mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side — Elegant Vector/CSS Bracelet display */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-[420px] aspect-square rounded-3xl bg-[#092241] border border-[#16385f]/80 p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />

            <div className="z-10 flex justify-between items-center text-xs font-mono text-zinc-500">
              <span>TAKK-I SAFEBAND v2.1</span>
              <span className="text-[#00c874] animate-pulse">● PRODUIT PHYSIQUE</span>
            </div>

            {/* Simulated 3D representation via CSS */}
            <div className="flex-1 flex flex-col items-center justify-center relative my-4">
              {/* Outer circle of band */}
              <div className="w-56 h-36 rounded-[80px] border-[16px] border-[#0F2D54] shadow-[0_15px_30px_rgba(0,0,0,0.6)] flex items-center justify-center relative bg-[#061d33] overflow-hidden">
                {/* Texture straps on band */}
                <div className="absolute top-0 bottom-0 left-4 w-4 bg-[#0c2444]/60 transform skew-y-12" />
                <div className="absolute top-0 bottom-0 right-4 w-4 bg-[#0c2444]/60 transform -skew-y-12" />

                {/* Laser plate */}
                <div className="w-36 h-20 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900 border-2 border-zinc-600 rounded-xl relative shadow-2xl flex flex-col items-center justify-center p-2 z-20">
                  <div className="absolute top-1 left-2 text-[7px] text-zinc-400 tracking-widest font-black uppercase">URGENCE</div>
                  
                  {/* Miniature Engraved QR code */}
                  <div className="w-10 h-10 bg-white rounded p-1 flex items-center justify-center shadow-inner mt-2">
                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                      <rect x="5" y="5" width="22" height="22" fill="#000"/>
                      <rect x="73" y="5" width="22" height="22" fill="#000"/>
                      <rect x="5" y="73" width="22" height="22" fill="#000"/>
                      <rect x="36" y="36" width="28" height="28" fill="#000" opacity="0.8"/>
                    </svg>
                  </div>
                  <div className="text-[7.5px] font-mono text-zinc-300 mt-1 uppercase font-bold tracking-widest">Takk-i</div>
                </div>
              </div>
            </div>

            <div className="z-10 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Gravé à Dakar</span>
              <p className="text-zinc-500 text-[10.5px]">Livré à domicile en 48h partout au Sénégal par notre réseau logistique.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NosProduitsSection() {
  const supports = [
    {
      id: "takk-i-id",
      title: "Takk-i ID",
      sub: "Idéal pour adultes · Format portefeuille",
      bullets: [
        "Format carte bancaire standard",
        "Plastique résistant à l'eau",
        "Se glisse facilement dans l'étui téléphone",
        "Finition mate anti-rayures"
      ],
      color: "bg-sky-700",
      icon: <CreditCard className="w-12 h-12 text-white" />
    },
    {
      id: "takk-i-safeband",
      title: "Takk-i SafeBand",
      sub: "Idéal enfants & seniors · Gravure laser",
      bullets: [
        "Bracelet personnalisé gravé au laser",
        "QR code gravé à vie, résistant à l'eau",
        "Silicone hypoallergénique réglable",
        "Fermoir sécurisé impossible à perdre"
      ],
      color: "bg-red-700",
      icon: <Watch className="w-12 h-12 text-white" />
    },
    {
      id: "takk-i-safesticker",
      title: "Takk-i SafeSticker",
      sub: "Idéal casques & véhicules · Plastifié",
      bullets: [
        "Sticker plastifié ultra-résistant",
        "Colle forte, supporte chaleur et eau",
        "S'adapte sur casque moto, vélo ou vitre",
        "Lisibilité optimisée par forte luminosité"
      ],
      color: "bg-emerald-700",
      icon: <Tag className="w-12 h-12 text-white" />
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200 py-16 sm:py-20 px-4 sm:px-6" id="produits">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest font-mono">NOS PRODUITS</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0B1F3A] uppercase font-syne tracking-tight leading-none">
            Choisissez <span className="text-blue-600">votre support</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Trois formats adaptés à votre style de vie, tous avec le même QR code sécurisé.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4">
          {supports.map((s, idx) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.45 }}
              className="bg-slate-50 border border-slate-200/80 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col h-full"
              id={s.id}
            >
              {/* Colored Card Header */}
              <div className={`${s.color} py-10 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden`}>
                <div className="absolute w-36 h-36 bg-white/5 rounded-full -top-10 -right-10 blur-xl" />
                <div className="p-3.5 bg-white/10 rounded-2xl mb-3 backdrop-blur-md">
                  {s.icon}
                </div>
                <h3 className="text-white text-xl font-black uppercase tracking-tight font-syne">{s.title}</h3>
                <span className="text-white/80 text-[11px] mt-1 font-mono tracking-wide">{s.sub}</span>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-white text-left">
                <ul className="space-y-3.5">
                  {s.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex gap-2 text-xs text-slate-700 font-medium">
                      <span className="text-[#00c874] font-bold shrink-0">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EntrepriseSection() {
  const cards = [
    {
      icon: <GraduationCap className="w-6 h-6 text-cyan-400" />,
      title: "Écoles & Lycées",
      desc: "Bracelet pour chaque élève. Info médicale disponible pour l'infirmerie et les sorties scolaires."
    },
    {
      icon: <Building2 className="w-6 h-6 text-cyan-400" />,
      title: "Entreprises",
      desc: "Conformité sécurité au travail. Réduction du temps de réaction en cas d'accident sur chantier."
    },
    {
      icon: <Trophy className="w-6 h-6 text-cyan-400" />,
      title: "Clubs Sportifs",
      desc: "Protection des athlètes en compétition et à l'entraînement. Réponse médicale optimisée."
    },
    {
      icon: <Truck className="w-6 h-6 text-cyan-400" />,
      title: "Transporteurs",
      desc: "Carte d'urgence pour chauffeurs longue distance. Sécurité renforcée sur les routes."
    }
  ];

  return (
    <div className="bg-[#061d33] py-16 sm:py-24 px-4 sm:px-6 relative border-t border-[#183656]/40" id="entreprise">
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px]" />
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest font-mono">OFFRE ENTREPRISE</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-syne tracking-tight leading-none leading-xs">
              Takk-i <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#00c2e0]">Entreprise</span>
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Protégez vos équipes, élèves ou membres avec une solution d'identification médicale collective. Idéal pour les structures qui ont une responsabilité de sécurité civile or professionnelle.
            </p>

            <div className="space-y-2 pt-2 text-[12.5px]">
              {[
                "Tableau de bord administrateur centralisé",
                "Inscription en masse de tous les membres",
                "Livraison groupée des bracelets & cartes",
                "Rapport d'activité mensuel",
                "Support dédié & formation sur site",
                "Facturation annuelle avec devis personnalisé"
              ].map((f, i) => (
                <div key={i} className="flex gap-2.5 text-zinc-300">
                  <span className="text-[#00c874] font-bold">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <a href="mailto:contact@takki.sn" className="inline-block bg-[#0e274c] hover:bg-[#153461] border border-[#00c2e0]/20 text-[#00c2e0] font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all">
                Demander un devis B2B
              </a>
            </div>
          </div>

          {/* Right Cards grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {cards.map((c, idx) => (
              <motion.div 
                key={c.title}
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="bg-[#092241]/80 border border-[#1c3e66]/40 hover:border-[#00c2e0]/20 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xl transition-all hover:bg-[#0b274c]"
                id={`ent-card-${idx}`}
              >
                <div className="p-2.5 bg-[#122137] rounded-xl inline-block border border-cyan-500/10">
                  {c.icon}
                </div>
                <h3 className="text-white text-base font-extrabold uppercase tracking-tight font-syne">{c.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export function SecuriteSection() {
  const securityFeatures = [
    {
      id: "sec-public-private",
      title: "Séparation public / privé",
      desc: "Le QR code n'affiche que le prénom et les infos vitales. Votre nom complet et adresse restent invisibles.",
      icon: "🔒",
      bgColor: "bg-blue-50/80 border border-blue-100/60 text-xl"
    },
    {
      id: "sec-aes-encryption",
      title: "Chiffrement AES-256",
      desc: "Toutes les données médicales privées enregistrées sont chiffrées en base de données. Aucun tiers n'est en mesure d'y accéder, même en cas de brèche informatique forcée, assurant la conformité avec la Loi n°2008-12.",
      icon: "🛡️",
      bgColor: "bg-emerald-50/80 border border-emerald-100/60 text-xl"
    },
    {
      id: "sec-pin-access",
      title: "Accès médical par code PIN",
      desc: "Seuls les établissements de santé partenaires ont accès au dossier complet, via un code PIN d'établissement.",
      icon: "📑",
      bgColor: "bg-purple-50/80 border border-purple-100/60 text-xl"
    },
    {
      id: "sec-one-click-deactivation",
      title: "Désactivation en 1 clic",
      desc: "Bracelet perdu ou volé ? Désactivez votre QR code instantanément depuis votre tableau de bord.",
      icon: "⚡",
      bgColor: "bg-orange-50/80 border border-orange-100/60 text-xl"
    },
    {
      id: "sec-secure-roles",
      title: "Rôles et permissions sécurisés",
      desc: "Chaque utilisateur accède uniquement aux données correspondant à son rôle : citizen, health, rescue ou admin. Aucun accès croisé non autorisé.",
      icon: "🔑",
      bgColor: "bg-blue-50/80 border border-blue-100/60 text-xl"
    },
    {
      id: "sec-auth-levels",
      title: "Accès par niveau d'autorisation",
      desc: "Données publiques, médicales et administratives cloisonnées. Un médecin ne voit que ce que son établissement est autorisé à consulter.",
      icon: "📊",
      bgColor: "bg-emerald-50/80 border border-emerald-100/60 text-xl"
    },
    {
      id: "sec-access-logs",
      title: "Journal complet des accès",
      desc: "Chaque consultation de fiche est tracée : qui, quand, depuis où. Conforme aux exigences de traçabilité légale de la CDP Sénégal.",
      icon: "📋",
      bgColor: "bg-purple-50/80 border border-purple-100/60 text-xl"
    }
  ];

  return (
    <div className="bg-white border-y border-slate-200/80 py-16 sm:py-20 px-4 sm:px-6" id="security">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest font-mono">SÉCURITÉ & CONFIDENTIALITÉ</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0B1F3A] uppercase font-syne tracking-tight leading-none text-left md:text-center">
            Vos données, <span className="text-blue-600">strictement protégées</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed text-left md:text-center font-medium">
            La confiance est au cœur de Takk-i. Nous appliquons les standards de sécurité les plus élevés de la législation sénégalaise (CDP).
          </p>
        </div>

        <div className="space-y-5 pt-4">
          {securityFeatures.map((feat, idx) => (
            <motion.div 
              key={feat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="bg-white border border-slate-100 shadow-[0_4px_20px_rgba(11,31,58,0.02)] p-6 sm:p-7 rounded-3xl flex gap-6 items-start hover:shadow-xl hover:border-blue-100 transition-all duration-300"
              id={feat.id}
            >
              <div className={`p-4 ${feat.bgColor} rounded-2xl shrink-0 flex items-center justify-center w-14 h-14 shadow-inner`}>
                <span className="select-none">{feat.icon}</span>
              </div>
              <div className="space-y-1 text-left">
                <h3 className="text-slate-900 text-base sm:text-lg font-black uppercase tracking-tight font-syne">{feat.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InterfaceUtilisateurSection() {
  const dashboards = [
    {
      title: "Dashboard Citoyen",
      badge: "FREE · PREMIUM",
      badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      desc: "Gérer sa propre sécurité au quotidien.",
      icon: <User className="w-5 h-5 text-purple-400" />,
      features: [
        "Mon profil (photo, identité)",
        "Ma santé (sang, allergies, traitements)",
        "Mes contacts d'urgence (1 & 2)"
      ]
    },
    {
      title: "Dashboard Santé",
      badge: "TAKK-I HEALTH",
      badgeColor: "text-[#00c874] bg-[#00c874]/10 border-[#00c874]/20",
      desc: "Pour hôpitaux, cliniques et ambulances. Accéder vite aux infos vitales.",
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      features: [
        "Scanner patient (accès immédiat)",
        "Fiche patient (identité, allergies, traitements)",
        "Historique des interventions"
      ]
    },
    {
      title: "Dashboard Secours",
      badge: "TAKK-I RESCUE",
      badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      desc: "Pompiers, Police, Croix-Rouge. Priorité terrain, interface ultra-simple.",
      icon: <Shield className="w-5 h-5 text-red-400" />,
      features: [
        "Scan rapide (vue critique simplifiée)",
        "Identité • Sang • Allergies • Contacts",
        "Appels rapides (famille + secours)"
      ]
    }
  ];

  return (
    <div className="bg-[#061d33] py-16 sm:py-24 px-4 sm:px-6 relative border-b border-[#183656]/40" id="interfaces">
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#3282f6]/5 rounded-full blur-[140px]" />
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-syne tracking-tight leading-none bg-clip-text text-white">
            Une interface adaptée à <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#00c2e0]">chaque utilisateur</span>
          </h2>
          <p className="text-zinc-400 text-sm max-w-2xl mx-auto leading-relaxed font-semibold">
            Chaque acteur a son espace dédié. Un seul système, plusieurs rôles — plus simple à maintenir, plus cohérent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4">
          {dashboards.map((dash, idx) => (
            <motion.div 
              key={dash.title}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="bg-[#092241]/80 border border-[#1c3e66]/40 hover:border-[#00c2e0]/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
              id={`dash-card-${idx}`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="p-2.5 bg-[#122137] rounded-xl border border-cyan-500/10">
                    {dash.icon}
                  </div>
                  <span className={`text-[9.5px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full border ${dash.badgeColor}`}>
                    {dash.badge}
                  </span>
                </div>

                <div className="space-y-2 text-left">
                  <h3 className="text-white text-lg sm:text-xl font-black uppercase tracking-tight font-syne">{dash.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed font-medium">{dash.desc}</p>
                </div>

                <div className="h-px bg-[#1c2e47]/60" />

                <ul className="space-y-2.5 text-left">
                  {dash.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex gap-2 text-xs text-zinc-300">
                      <span className="text-[#3282f6] font-bold">→</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
