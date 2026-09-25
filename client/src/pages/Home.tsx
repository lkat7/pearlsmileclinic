import { useState, useEffect, type FormEvent } from "react";
import { fr } from "date-fns/locale/fr";
import { ar } from "date-fns/locale/ar";
import { enUS } from "date-fns/locale/en-US";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ArrowUpRight,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import LanguageDropdown from "@/components/LanguageDropdown";
import { useLanguage } from "@/contexts/LanguageContext";

const PHONE_NUMBER = "212670222174";
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=68%20Rue%20Oued%20Ziz%2C%20Agdal%2C%20Rabat";

const treatmentImages = {
  basic:       "/images/soin-basic.jpg",
  glow:        "/images/cou-eclat.jpg",
  acne:        "/images/anti-acnee.jpg",
  clarify:     "/images/eclaircissement.jpg",
  needling:    "/images/microneedling.jpg",
  age:         "/images/anti-age.jpg",
  taches:      "/images/anti-taches.jpg",
  rosacea:     "/images/rosacee.jpg",
  hydratation: "/images/hydratation-intense.jpg",
  homme:       "/images/special-homme.jpg",
  regard:      "/images/regard-eclatant.jpg",
  smile:       "/images/sourire.jpg",
} as const;

const hydrafacialImageKeys = ["basic", "glow", "acne", "clarify"] as const;
const specialImageKeys     = ["age", "taches", "acne", "rosacea", "regard", "hydratation", "homme", "smile"] as const;

const hydrafacialCardKeys = [
  { name: "hf_basic",   desc: "hf_basic_desc",   price: "900 DH" },
  { name: "hf_glow",    desc: "hf_glow_desc",    price: "900 DH" },
  { name: "hf_acne",    desc: "hf_acne_desc",    price: "500 DH" },
  { name: "hf_clarify", desc: "hf_clarify_desc", price: "900 DH" },
] as const;

const specialCardKeys = [
  "sp_antiage", "sp_antitaches", "sp_antiacne", "sp_rosacea",
  "sp_regard",  "sp_hydra",      "sp_homme",    "sp_sourire",
] as const;

const needlingPackKeys = [
  { labelKey: "needling_session", price: "600 DH" },
  { labelKey: "needling_pack5",   price: "2 700 DH" },
  { labelKey: "needling_pack10",  price: "5 000 DH" },
] as const;

function WhatsAppButton({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${t("wa_initial_msg")}`;
  return (
    <a
      className={compact ? "whatsapp-button whatsapp-button--compact" : "whatsapp-button"}
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle size={compact ? 18 : 19} strokeWidth={1.8} />
      <span>{compact ? t("wa_short") : t("wa_reserve")}</span>
    </a>
  );
}

function ServiceImagePlaceholder({ image, alt, large = false }: { image: string; alt: string; large?: boolean }) {
  return (
    <div
      className={large ? "service-image-placeholder service-image-placeholder--large" : "service-image-placeholder"}
      role="img"
      aria-label={alt}
    >
      <img src={image} alt="" />
      <span className="service-image-overlay" aria-hidden="true" />
    </div>
  );
}

function ReserveButton({ onReserve }: { onReserve: () => void }) {
  const { t } = useLanguage();
  return (
    <button className="service-reserve-button" type="button" onClick={onReserve}>
      {t("reserve")} <ArrowUpRight size={15} />
    </button>
  );
}

export default function Home() {
  const { t, lang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingTreatment, setBookingTreatment] = useState("");
  const [bookingPack, setBookingPack] = useState("");
  const [selectedNeedlingPack, setSelectedNeedlingPack] = useState(1);
  const [bookingDate, setBookingDate] = useState<Date>();
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", date: "" });
  const [loading, setLoading] = useState(true);
  const [loadingFading, setLoadingFading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [instagramOpen, setInstagramOpen] = useState(false);

  const calendarLocale = lang === "ar" ? ar : lang === "en" ? enUS : fr;
  const dateLocaleTag   = lang === "ar" ? "ar-MA" : lang === "en" ? "en-GB" : "fr-FR";

  const closeMenu = () => {
    if (isMenuClosing) return;
    setIsMenuClosing(true);
    setTimeout(() => { setMenuOpen(false); setIsMenuClosing(false); }, 200);
  };
  const toggleMenu = () => {
    if (menuOpen && !isMenuClosing) closeMenu();
    else { setMenuOpen(true); setIsMenuClosing(false); }
  };

  useEffect(() => {
    const fadeTimer    = setTimeout(() => setLoadingFading(true), 1800);
    const unmountTimer = setTimeout(() => setLoading(false), 2500);
    return () => { clearTimeout(fadeTimer); clearTimeout(unmountTimer); };
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".service-card, .needling-feature-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const openBooking = (treatment: string, pack = "") => {
    setBookingTreatment(treatment);
    setBookingPack(pack);
    setBookingDate(undefined);
    setBookingForm({ name: "", phone: "", date: "" });
    setBookingOpen(true);
  };

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = [
      t("wa_msg_intro"),
      `${t("wa_msg_treatment")} ${bookingTreatment}`,
      `${t("wa_msg_name")} ${bookingForm.name}`,
      `${t("wa_msg_phone")} ${bookingForm.phone}`,
      `${t("wa_msg_date")} ${bookingForm.date}`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setBookingOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf8f5] text-[#1e293b]">
      {loading && (
        <div className={`loading-screen${loadingFading ? " loading-screen--fading" : ""}`} aria-hidden="true">
          <img className="loading-logo" src="/images/logo.png" alt="Pearl Smile Clinic" />
        </div>
      )}

      <header className="site-header">
        <div className="site-shell header-inner">
          <a className="brand" href="#accueil" onClick={closeMenu} aria-label={t("brand_label")}>
            <img className="brand-logo" src="/images/logo.png" alt="Pearl Smile Clinic" />
          </a>
          <nav className="desktop-nav" aria-label={t("nav_treatments")}>
            <a href="#hydrafacial">{t("nav_treatments")}</a>
            <a href="#needling">{t("nav_packs")}</a>
            <a href="#adresse">{t("nav_address")}</a>
            <a href="#contact">{t("nav_contact")}</a>
          </nav>
          <div className="header-actions">
            <LanguageDropdown />
            <WhatsAppButton compact />
            <button
              className="mobile-menu-button"
              type="button"
              aria-label={menuOpen ? t("nav_close_menu") : t("nav_open_menu")}
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              {menuOpen ? <X size={22} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
        {(menuOpen || isMenuClosing) && (
          <nav className={`mobile-nav${isMenuClosing ? " is-closing" : ""}`} aria-label="Navigation mobile">
            <a href="#hydrafacial" onClick={closeMenu}>{t("nav_treatments")}</a>
            <a href="#needling"    onClick={closeMenu}>{t("nav_packs")}</a>
            <a href="#adresse"     onClick={closeMenu}>{t("nav_address")}</a>
            <a href="#contact"     onClick={closeMenu}>{t("nav_contact")}</a>
            <div className="mobile-lang-row">
              <LanguageDropdown dropUp />
            </div>
            <WhatsAppButton />
          </nav>
        )}
      </header>

      <main>
        <section className="hero" id="accueil">
          <div className="hero-halo hero-halo--top" />
          <div className="hero-halo hero-halo--bottom" />
          <div className="site-shell hero-grid">
            <div className="hero-left-column">
              <div className="hero-copy hero-copy--constrained">
                <p className="location-line"><MapPin size={15} /> {t("location_line")}</p>
                <h1>{t("hero_h1")}</h1>
                <p className="hero-lede">{t("hero_lede")}</p>
              </div>
              <div className="hero-actions-container">
                <div className="hero-ctas">
                  <WhatsAppButton />
                  <a className="hero-secondary-button" href="#hydrafacial">
                    {t("hero_discover")} <ArrowUpRight size={17} />
                  </a>
                </div>
                <div className="treatment-strip" aria-label={t("section_kicker")}>
                  <span>{t("strip_hydrafacial")}</span>
                  <span>{t("strip_needling")}</span>
                  <span>{t("strip_targeted")}</span>
                </div>
              </div>
            </div>
            <div className="hero-visual" aria-label={t("hero_visual_label")}>
              <div className="hero-placeholder">
                <img src="/images/hero-clinic.png" alt={t("hero_img_alt")} />
              </div>
              <div className="visual-caption">
                <Sparkles size={15} />
                <span>{t("visual_caption")}</span>
              </div>
              <div className="gold-orbit gold-orbit--one" />
              <div className="gold-orbit gold-orbit--two" />
            </div>
          </div>
          <div className="hero-bottom-line" />
        </section>

        <section className="treatments-section" id="soins" aria-labelledby="treatments-title">
          <div className="site-shell">
            <div className="section-head section-head--centered">
              <p className="section-kicker"><Sparkles size={15} /> {t("section_kicker")}</p>
              <h2 id="treatments-title">{t("treatments_h2")}</h2>
              <p>{t("treatments_sub")}</p>
            </div>
            <div className="service-menu-content service-menu-content--stack">

              <section className="service-category-section" id="hydrafacial" aria-labelledby="hydrafacial-title">
                <div className="service-category-heading">
                  <div>
                    <span className="service-category-number">{t("hydrafacial_num")}</span>
                    <h3 id="hydrafacial-title">{t("hydrafacial_h3")}</h3>
                  </div>
                  <p>{t("hydrafacial_sub")}</p>
                </div>
                <div className="service-card-grid service-card-grid--four grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {hydrafacialCardKeys.map(({ name, desc, price }, index) => {
                    const displayName = t(name);
                    return (
                      <article
                        className="service-card"
                        key={name}
                        style={{ "--reveal-delay": `${index * 0.06}s` } as React.CSSProperties}
                      >
                        <ServiceImagePlaceholder
                          image={treatmentImages[hydrafacialImageKeys[index]]}
                          alt={`${displayName}, ${t("card_label")}`}
                        />
                        <div className="service-card-body">
                          <div>
                            <span className="service-card-category">{t("card_label")}</span>
                            <h3>{displayName}</h3>
                            <p>{t(desc)}</p>
                          </div>
                          <div className="service-card-footer">
                            <strong>{price}</strong>
                            <ReserveButton onReserve={() => openBooking(displayName, price)} />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="service-category-section" id="needling" aria-labelledby="needling-title">
                <div className="service-category-heading">
                  <div>
                    <span className="service-category-number">{t("needling_num")}</span>
                    <h3 id="needling-title">{t("needling_h3")}</h3>
                  </div>
                  <p>{t("needling_sub")}</p>
                </div>
                <article className="needling-feature-card">
                  <ServiceImagePlaceholder image={treatmentImages.needling} alt={t("needling_title")} large />
                  <div className="needling-feature-copy">
                    <span className="service-card-category">{t("needling_category")}</span>
                    <h3>{t("needling_title")}</h3>
                    <p className="needling-subtitle">{t("needling_caption")}</p>
                    <div className="needling-pricing" aria-label={t("needling_h3")}>
                      {needlingPackKeys.map(({ labelKey, price }, index) => (
                        <button
                          className={`${index === 1 ? "needling-pricing--featured " : ""}${selectedNeedlingPack === index ? "is-selected" : ""}`}
                          key={labelKey}
                          type="button"
                          aria-pressed={selectedNeedlingPack === index}
                          onClick={() => setSelectedNeedlingPack(index)}
                        >
                          <span>{t(labelKey)}</span>
                          <strong>{price}</strong>
                          {index === 1 && <em>{t("needling_best")}</em>}
                        </button>
                      ))}
                    </div>
                    <ReserveButton
                      onReserve={() =>
                        openBooking(
                          t("needling_title"),
                          `${t(needlingPackKeys[selectedNeedlingPack].labelKey)} · ${needlingPackKeys[selectedNeedlingPack].price}`
                        )
                      }
                    />
                  </div>
                </article>
              </section>

              <section className="service-category-section" id="speciaux" aria-labelledby="speciaux-title">
                <div className="service-category-heading">
                  <div>
                    <span className="service-category-number">{t("special_num")}</span>
                    <h3 id="speciaux-title">{t("special_h3")}</h3>
                  </div>
                  <p>{t("special_sub")}</p>
                </div>
                <div className="special-service-wrap">
                  <div className="special-pricing-legend">
                    <span>{t("special_legend")}</span>
                    <div>
                      <strong>{t("special_session")} <b>600 DH</b></strong>
                      <strong>{t("special_pack5")} <b>2 700 DH</b></strong>
                      <strong>{t("special_pack10")} <b>5 000 DH</b></strong>
                    </div>
                  </div>
                  <div className="service-card-grid service-card-grid--eight grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {specialCardKeys.map((key, index) => {
                      const displayName = t(key);
                      return (
                        <article
                          className="service-card service-card--special"
                          key={key}
                          style={{ "--reveal-delay": `${index * 0.05}s` } as React.CSSProperties}
                        >
                          <ServiceImagePlaceholder
                            image={treatmentImages[specialImageKeys[index]]}
                            alt={`${displayName}, ${t("special_label")}`}
                          />
                          <div className="service-card-body">
                            <div>
                              <span className="service-card-category">{t("special_label")}</span>
                              <h3>{displayName}</h3>
                            </div>
                            <div className="service-card-footer">
                              <strong>{t("special_from")}</strong>
                              <ReserveButton onReserve={() => openBooking(displayName, t("special_from"))} />
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </section>

            </div>
          </div>
        </section>

        <section className="contact-section" id="adresse" aria-labelledby="contact-title">
          <div className="site-shell contact-shell">
            <div className="contact-copy">
              <p className="section-kicker"><MapPin size={15} /> {t("contact_kicker")}</p>
              <h2 id="contact-title">{t("contact_h2")}</h2>
              <p>{t("contact_body")}</p>
              <a className="map-link" href={mapsUrl} target="_blank" rel="noreferrer">
                {t("contact_maps")} <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="contact-card" id="contact">
              <div className="contact-card-top">
                <img className="contact-card-logo" src="/images/logo.png" alt="Pearl Smile Clinic" />
              </div>
              <div className="contact-detail">
                <span>{t("contact_address_label")}</span>
                <p>{t("contact_address_line1")}<br />{t("contact_address_line2")}</p>
              </div>
              <div className="contact-detail contact-detail--phones">
                <span>{t("contact_phone_label")}</span>
                <a href="tel:+212537680798"><Phone size={16} /> 05 37 68 07 98</a>
                <a href="tel:+212670222174"><Phone size={16} /> 06 70 22 21 74</a>
              </div>
              <WhatsAppButton />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-shell footer-inner">
          <a className="brand brand--footer" href="#accueil">
            <img className="brand-logo" src="/images/logo.png" alt="Pearl Smile Clinic" />
          </a>
          <p>{t("footer_tagline")}</p>
          <button
            type="button"
            aria-label={t("footer_instagram")}
            onClick={() => setInstagramOpen(true)}
            className="instagram-btn"
          >
            <Instagram size={18} />
          </button>
        </div>
      </footer>

      <a
        className="floating-whatsapp"
        href={`https://wa.me/${PHONE_NUMBER}?text=${t("wa_initial_msg")}`}
        target="_blank"
        rel="noreferrer"
        aria-label={t("wa_reserve")}
      >
        <MessageCircle size={22} />
      </a>

      <Dialog open={instagramOpen} onOpenChange={setInstagramOpen}>
        <DialogContent className="booking-dialog instagram-dialog">
          <DialogHeader>
            <div className="instagram-dialog-icon">
              <Instagram size={32} />
            </div>
            <DialogTitle>{t("insta_title")}</DialogTitle>
            <DialogDescription>{t("insta_body")}</DialogDescription>
          </DialogHeader>
          <button className="booking-submit" type="button" onClick={() => setInstagramOpen(false)}>
            {t("insta_close")}
          </button>
        </DialogContent>
      </Dialog>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="booking-dialog">
          <DialogHeader>
            <DialogTitle>{t("booking_title")} {bookingTreatment}</DialogTitle>
            <DialogDescription>
              {bookingPack ? `${t("booking_formula")} ${bookingPack}` : t("booking_hint")}
            </DialogDescription>
          </DialogHeader>
          <form className="booking-form" onSubmit={submitBooking}>
            <label>
              {t("booking_name")}
              <input
                required
                value={bookingForm.name}
                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                placeholder={t("booking_name_ph")}
              />
            </label>
            <label>
              {t("booking_phone")}
              <input
                required
                type="tel"
                value={bookingForm.phone}
                onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                placeholder={t("booking_phone_ph")}
              />
            </label>
            <label>
              {t("booking_date")}
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button className={`date-picker-trigger ${bookingDate ? "has-date" : ""}`} type="button">
                    <CalendarIcon size={16} />
                    <span>
                      {bookingDate
                        ? bookingDate.toLocaleDateString(dateLocaleTag, { day: "numeric", month: "long", year: "numeric" })
                        : t("booking_date_ph")}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="booking-calendar-popover" align="center" sideOffset={10}>
                  <Calendar
                    className="booking-calendar"
                    mode="single"
                    selected={bookingDate}
                    locale={calendarLocale}
                    weekStartsOn={1}
                    onSelect={(date: Date | undefined) => {
                      setBookingDate(date);
                      setBookingForm({ ...bookingForm, date: date ? date.toLocaleDateString(dateLocaleTag) : "" });
                      if (date) setCalendarOpen(false);
                    }}
                    disabled={{ before: new Date() }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </label>
            <button
              className="booking-submit"
              type="submit"
              disabled={!bookingForm.name || !bookingForm.phone || !bookingDate}
            >
              {t("booking_submit")} <ArrowUpRight size={16} />
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
