import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// ─── Language types ───────────────────────────────────────────────────────────

export type Lang = "fr" | "en" | "ar";

export interface LanguageOption {
  code: Lang;
  label: string;
  flag: string; // path inside /public
  dir: "ltr" | "rtl";
}

export const LANGUAGES: LanguageOption[] = [
  { code: "fr", label: "Français", flag: "/france.png", dir: "ltr" },
  { code: "en", label: "English",  flag: "/uk.png",     dir: "ltr" },
  { code: "ar", label: "العربية",  flag: "/morocco.png", dir: "rtl" },
];

// ─── Translation dictionary ───────────────────────────────────────────────────

const translations: Record<Lang, Record<string, string>> = {
  fr: {
    nav_treatments:   "Soins",
    nav_packs:        "Packs & tarifs",
    nav_address:      "Adresse",
    nav_contact:      "Contact",
    nav_open_menu:    "Ouvrir le menu",
    nav_close_menu:   "Fermer le menu",
    brand_label:      "Pearl Smile Clinic, accueil",
    wa_reserve:       "Réserver sur WhatsApp",
    wa_short:         "WhatsApp",
    location_line:    "Agdal, Rabat",
    hero_h1:          "Votre peau mérite une attention rare.",
    hero_lede:        "Soins esthétiques et expertise dermatologique dans un lieu pensé pour ralentir, comprendre votre peau et prendre soin de vous.",
    hero_discover:    "Découvrir les soins",
    strip_hydrafacial:"Hydrafacial",
    strip_needling:   "Needling",
    strip_targeted:   "Soins ciblés",
    hero_visual_label:"Espace photo pour une image de soin Pearl Smile Clinic",
    hero_img_alt:     "Intérieur lumineux Pearl Smile Clinic",
    visual_caption:   "Une approche experte, sans précipitation.",
    section_kicker:   "Carte de soins",
    treatments_h2:    "Choisir le soin qui vous convient aujourd'hui.",
    treatments_sub:   "Des protocoles pensés pour les besoins réels de votre peau.",
    hydrafacial_num:  "01",
    hydrafacial_h3:   "Soins Hydrafacial",
    hydrafacial_sub:  "Nettoyer en profondeur et révéler l'éclat.",
    card_label:       "Hydrafacial",
    hf_basic:         "Soin Basic",
    hf_basic_desc:    "Nettoyage essentiel",
    hf_glow:          "Coup d'Éclat",
    hf_glow_desc:     "Lumière & fraîcheur",
    hf_acne:          "Anti-Acnée",
    hf_acne_desc:     "Peau nette & apaisée",
    hf_clarify:       "Eclaircissement",
    hf_clarify_desc:  "Teint plus homogène",
    needling_num:     "02",
    needling_h3:      "Soin Needling",
    needling_sub:     "Nanoneedling / Microneedling avec soin hydrafacial, masque et LED.",
    needling_category:"Texture & régénération",
    needling_title:   "Nanoneedling / Microneedling",
    needling_caption: "Avec soin hydrafacial et masque + LED",
    needling_best:    "Meilleur Valeur",
    needling_session: "La séance",
    needling_pack5:   "Pack de 5",
    needling_pack10:  "Pack de 10",
    special_num:      "03",
    special_h3:       "Soins Spéciaux",
    special_sub:      "Ajustés à chaque besoin spécifique de votre peau.",
    special_legend:   "Tarification commune",
    special_label:    "Soin spécial",
    special_from:     "À partir de 600 DH",
    special_session:  "Séance",
    special_pack5:    "Pack de 5",
    special_pack10:   "Pack de 10",
    sp_antiage:       "Anti Âge",
    sp_antitaches:    "Anti Tâches",
    sp_antiacne:      "Anti Acnée",
    sp_rosacea:       "Rosacée",
    sp_regard:        "Regard Éclatant",
    sp_hydra:         "Hydratation Intense",
    sp_homme:         "Spécial Homme",
    sp_sourire:       "Spécial Sourire",
    reserve:          "Réserver",
    contact_kicker:   "À Agdal, Rabat",
    contact_h2:       "Votre rendez-vous commence ici.",
    contact_body:     "Retrouvez-nous au centre d'Agdal pour une consultation, un soin ciblé ou simplement pour parler de votre peau.",
    contact_maps:     "Ouvrir dans Google Maps",
    contact_address_label: "Adresse",
    contact_address_line1: "68, Rue Oued Ziz, Appt 4",
    contact_address_line2: "Agdal, Rabat",
    contact_phone_label: "Nous joindre",
    footer_tagline:   "Esthétique & soins dermatologiques, Agdal Rabat",
    footer_instagram: "Instagram Pearl Smile Clinic",
    insta_title:      "Bientôt sur Instagram",
    insta_body:       "Notre page Instagram est en cours de création. Revenez très bientôt pour découvrir nos résultats, nos conseils beauté et l'univers Pearl Smile Clinic.",
    insta_close:      "Fermer",
    booking_title:    "Réserver :",
    booking_formula:  "Formule sélectionnée :",
    booking_hint:     "Choisissez votre créneau et laissez vos coordonnées.",
    booking_name:     "Nom & prénom",
    booking_name_ph:  "Votre nom complet",
    booking_phone:    "Numéro de téléphone",
    booking_phone_ph: "06 00 00 00 00",
    booking_date:     "Date souhaitée",
    booking_date_ph:  "Sélectionner une date",
    booking_submit:   "Confirmer ma réservation sur WhatsApp",
    wa_msg_intro:     "Bonjour Pearl Smile Clinic, je souhaite réserver un soin.",
    wa_msg_treatment: "Soin :",
    wa_msg_name:      "Nom & prénom :",
    wa_msg_phone:     "Téléphone :",
    wa_msg_date:      "Date souhaitée :",
    wa_initial_msg:   "Bonjour%20Pearl%20Smile%20Clinic%2C%20je%20souhaite%20prendre%20rendez-vous.",
    lang_selector:    "Sélectionner la langue",
  },

  en: {
    nav_treatments:   "Treatments",
    nav_packs:        "Packs & prices",
    nav_address:      "Location",
    nav_contact:      "Contact",
    nav_open_menu:    "Open menu",
    nav_close_menu:   "Close menu",
    brand_label:      "Pearl Smile Clinic, home",
    wa_reserve:       "Book on WhatsApp",
    wa_short:         "WhatsApp",
    location_line:    "Agdal, Rabat",
    hero_h1:          "Your skin deserves rare attention.",
    hero_lede:        "Aesthetic treatments and dermatological expertise in a space designed to slow down, understand your skin, and truly care for you.",
    hero_discover:    "Explore treatments",
    strip_hydrafacial:"Hydrafacial",
    strip_needling:   "Needling",
    strip_targeted:   "Targeted care",
    hero_visual_label:"Photo space for a Pearl Smile Clinic treatment image",
    hero_img_alt:     "Bright interior of Pearl Smile Clinic",
    visual_caption:   "Expert care, without rushing.",
    section_kicker:   "Treatment menu",
    treatments_h2:    "Choose the treatment that suits you today.",
    treatments_sub:   "Protocols designed for the real needs of your skin.",
    hydrafacial_num:  "01",
    hydrafacial_h3:   "Hydrafacial Treatments",
    hydrafacial_sub:  "Deep cleansing and radiance revealed.",
    card_label:       "Hydrafacial",
    hf_basic:         "Basic Care",
    hf_basic_desc:    "Essential cleansing",
    hf_glow:          "Glow Boost",
    hf_glow_desc:     "Light & freshness",
    hf_acne:          "Anti-Acne",
    hf_acne_desc:     "Clear & soothed skin",
    hf_clarify:       "Brightening",
    hf_clarify_desc:  "More even complexion",
    needling_num:     "02",
    needling_h3:      "Needling Treatment",
    needling_sub:     "Nanoneedling / Microneedling with hydrafacial, mask, and LED.",
    needling_category:"Texture & regeneration",
    needling_title:   "Nanoneedling / Microneedling",
    needling_caption: "With hydrafacial treatment, mask + LED",
    needling_best:    "Best Value",
    needling_session: "Single session",
    needling_pack5:   "Pack of 5",
    needling_pack10:  "Pack of 10",
    special_num:      "03",
    special_h3:       "Special Treatments",
    special_sub:      "Tailored to each specific need of your skin.",
    special_legend:   "Shared pricing",
    special_label:    "Special care",
    special_from:     "From 600 DH",
    special_session:  "Session",
    special_pack5:    "Pack of 5",
    special_pack10:   "Pack of 10",
    sp_antiage:       "Anti-Aging",
    sp_antitaches:    "Anti-Spots",
    sp_antiacne:      "Anti-Acne",
    sp_rosacea:       "Rosacea",
    sp_regard:        "Radiant Eyes",
    sp_hydra:         "Intense Hydration",
    sp_homme:         "For Men",
    sp_sourire:       "Smile Special",
    reserve:          "Book",
    contact_kicker:   "In Agdal, Rabat",
    contact_h2:       "Your appointment starts here.",
    contact_body:     "Find us in the heart of Agdal for a consultation, a targeted treatment, or simply to talk about your skin.",
    contact_maps:     "Open in Google Maps",
    contact_address_label: "Address",
    contact_address_line1: "68, Rue Oued Ziz, Apt 4",
    contact_address_line2: "Agdal, Rabat",
    contact_phone_label: "Reach us",
    footer_tagline:   "Aesthetics & dermatological care, Agdal Rabat",
    footer_instagram: "Pearl Smile Clinic on Instagram",
    insta_title:      "Coming soon on Instagram",
    insta_body:       "Our Instagram page is being created. Check back soon to discover our results, beauty tips, and the Pearl Smile Clinic universe.",
    insta_close:      "Close",
    booking_title:    "Book:",
    booking_formula:  "Selected package:",
    booking_hint:     "Choose your slot and leave your details.",
    booking_name:     "Full name",
    booking_name_ph:  "Your full name",
    booking_phone:    "Phone number",
    booking_phone_ph: "06 00 00 00 00",
    booking_date:     "Preferred date",
    booking_date_ph:  "Select a date",
    booking_submit:   "Confirm booking on WhatsApp",
    wa_msg_intro:     "Hello Pearl Smile Clinic, I would like to book a treatment.",
    wa_msg_treatment: "Treatment:",
    wa_msg_name:      "Name:",
    wa_msg_phone:     "Phone:",
    wa_msg_date:      "Preferred date:",
    wa_initial_msg:   "Hello%20Pearl%20Smile%20Clinic%2C%20I%20would%20like%20to%20book%20an%20appointment.",
    lang_selector:    "Select language",
  },

  ar: {
    nav_treatments:   "العلاجات",
    nav_packs:        "الباقات والأسعار",
    nav_address:      "الموقع",
    nav_contact:      "تواصل معنا",
    nav_open_menu:    "فتح القائمة",
    nav_close_menu:   "إغلاق القائمة",
    brand_label:      "بيرل سمايل كلينيك، الرئيسية",
    wa_reserve:       "احجز عبر واتساب",
    wa_short:         "واتساب",
    location_line:    "أكدال، الرباط",
    hero_h1:          "بشرتك تستحق اهتمامًا استثنائيًا.",
    hero_lede:        "علاجات تجميلية وخبرة جلدية في مكان صُمِّم لإبطاء الوتيرة، وفهم بشرتك، والاعتناء بك حقًا.",
    hero_discover:    "اكتشف العلاجات",
    strip_hydrafacial:"هيدرافيشيال",
    strip_needling:   "نيدلينج",
    strip_targeted:   "علاجات مستهدفة",
    hero_visual_label:"مساحة صورة لعلاج في بيرل سمايل كلينيك",
    hero_img_alt:     "الداخل المضيء لبيرل سمايل كلينيك",
    visual_caption:   "رعاية متخصصة، دون تسرّع.",
    section_kicker:   "قائمة العلاجات",
    treatments_h2:    "اختر العلاج المناسب لك اليوم.",
    treatments_sub:   "بروتوكولات مصمَّمة لاحتياجات بشرتك الحقيقية.",
    hydrafacial_num:  "٠١",
    hydrafacial_h3:   "علاجات هيدرافيشيال",
    hydrafacial_sub:  "تنظيف عميق وإشراق فائق.",
    card_label:       "هيدرافيشيال",
    hf_basic:         "العناية الأساسية",
    hf_basic_desc:    "تنظيف جوهري",
    hf_glow:          "إشراق مكثف",
    hf_glow_desc:     "إضاءة وانتعاش",
    hf_acne:          "مضاد للحبوب",
    hf_acne_desc:     "بشرة نقية ومهدَّأة",
    hf_clarify:       "تفتيح البشرة",
    hf_clarify_desc:  "بشرة أكثر توحدًا",
    needling_num:     "٠٢",
    needling_h3:      "علاج النيدلينج",
    needling_sub:     "نانو نيدلينج / ميكرو نيدلينج مع هيدرافيشيال وقناع وLED.",
    needling_category:"النسيج والتجديد",
    needling_title:   "نانو نيدلينج / ميكرو نيدلينج",
    needling_caption: "مع علاج هيدرافيشيال وقناع + LED",
    needling_best:    "أفضل قيمة",
    needling_session: "جلسة واحدة",
    needling_pack5:   "باقة 5 جلسات",
    needling_pack10:  "باقة 10 جلسات",
    special_num:      "٠٣",
    special_h3:       "العلاجات الخاصة",
    special_sub:      "مُكيَّفة لكل احتياج خاص لبشرتك.",
    special_legend:   "تسعير موحّد",
    special_label:    "عناية خاصة",
    special_from:     "ابتداءً من 600 درهم",
    special_session:  "جلسة",
    special_pack5:    "باقة 5",
    special_pack10:   "باقة 10",
    sp_antiage:       "مضاد للشيخوخة",
    sp_antitaches:    "مضاد للبقع",
    sp_antiacne:      "مضاد للحبوب",
    sp_rosacea:       "علاج الوردية",
    sp_regard:        "إشراق العيون",
    sp_hydra:         "ترطيب مكثف",
    sp_homme:         "للرجال",
    sp_sourire:       "ابتسامة مشرقة",
    reserve:          "احجز",
    contact_kicker:   "في أكدال، الرباط",
    contact_h2:       "موعدك يبدأ من هنا.",
    contact_body:     "زرنا في قلب أكدال لاستشارة، أو علاج مستهدف، أو للحديث عن بشرتك.",
    contact_maps:     "فتح في خرائط جوجل",
    contact_address_label: "العنوان",
    contact_address_line1: "68، شارع وادي زيز، شقة 4",
    contact_address_line2: "أكدال، الرباط",
    contact_phone_label: "تواصل معنا",
    footer_tagline:   "تجميل وعناية جلدية، أكدال الرباط",
    footer_instagram: "بيرل سمايل كلينيك على إنستغرام",
    insta_title:      "قريبًا على إنستغرام",
    insta_body:       "صفحتنا على إنستغرام قيد الإنشاء. عد قريبًا لاكتشاف نتائجنا ونصائح الجمال وعالم بيرل سمايل كلينيك.",
    insta_close:      "إغلاق",
    booking_title:    "احجز:",
    booking_formula:  "الباقة المختارة:",
    booking_hint:     "اختر موعدك واترك بياناتك.",
    booking_name:     "الاسم الكامل",
    booking_name_ph:  "اسمك الكامل",
    booking_phone:    "رقم الهاتف",
    booking_phone_ph: "06 00 00 00 00",
    booking_date:     "التاريخ المفضّل",
    booking_date_ph:  "اختر تاريخًا",
    booking_submit:   "تأكيد الحجز عبر واتساب",
    wa_msg_intro:     "مرحبًا بيرل سمايل كلينيك، أرغب في حجز جلسة.",
    wa_msg_treatment: "العلاج:",
    wa_msg_name:      "الاسم:",
    wa_msg_phone:     "الهاتف:",
    wa_msg_date:      "التاريخ المفضّل:",
    wa_initial_msg:   "مرحبًا%20بيرل%20سمايل%20كلينيك%2C%20أرغب%20في%20حجز%20موعد.",
    lang_selector:    "اختر اللغة",
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  currentOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  const setLang = (next: Lang) => {
    setLangState(next);
    const option = LANGUAGES.find((l) => l.code === next)!;
    document.documentElement.lang = next;
    document.documentElement.dir = option.dir;
  };

  // Initialise dir on mount
  useEffect(() => {
    const option = LANGUAGES.find((l) => l.code === lang)!;
    document.documentElement.lang = lang;
    document.documentElement.dir = option.dir;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const t = (key: string): string =>
    translations[lang][key] ?? translations["fr"][key] ?? key;

  const currentOption = LANGUAGES.find((l) => l.code === lang)!;
  const dir = currentOption.dir;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir, currentOption }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}

