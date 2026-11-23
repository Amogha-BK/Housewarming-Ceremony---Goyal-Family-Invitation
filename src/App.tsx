import { useEffect, useMemo, useRef, useState } from "react";

import { ArrowDown, CalendarDays, MapPin, Menu, Pause, Phone, Music2, X } from "lucide-react";
import { motion } from "motion/react";
import { Celebration, invitationConfig as config } from "./invitationConfig";

const navItems = [
  ["Invitation", "home"],
  ["Celebrations", "celebrations"],
  ["Venue", "venue"],
] as const;

function Monogram({ className = "" }: { className?: string }) {
  return (
    <img className={`monogram ${className}`} src={config.monogram} alt="Mittal family monogram" />
  );
}

function MusicControl() {
  const audio = useRef<HTMLAudioElement>(null);
  const userControlled = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    let disposed = false;
    player.volume = 0.4;

    function removeGestureListeners() {
      document.removeEventListener("pointerdown", startOnInteraction, true);
      document.removeEventListener("touchend", startOnInteraction, true);
      document.removeEventListener("click", startOnInteraction, true);
      document.removeEventListener("keydown", startOnInteraction, true);
    }
    function tryAutoplay() {
      if (disposed || userControlled.current) return;
      void player!
        .play()
        .then(() => {
          if (!disposed) {
            removeGestureListeners();
          }
        })
        .catch(() => {
          // Keep interaction listeners available when the browser blocks audible autoplay.
        });
    }
    function onVisible() {
      if (document.visibilityState === "visible") tryAutoplay();
    }
    function startOnInteraction(event: Event) {
      if (userControlled.current) {
        removeGestureListeners();
        return;
      }
      if (event.target instanceof Element && event.target.closest(".music-wrap")) return;
      tryAutoplay();
    }

    document.addEventListener("pointerdown", startOnInteraction, true);
    document.addEventListener("touchend", startOnInteraction, true);
    document.addEventListener("click", startOnInteraction, true);
    document.addEventListener("keydown", startOnInteraction, true);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", tryAutoplay);
    player.addEventListener("canplay", tryAutoplay);
    tryAutoplay();
    return () => {
      disposed = true;
      removeGestureListeners();
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", tryAutoplay);
      player.removeEventListener("canplay", tryAutoplay);
      player.pause();
    };
  }, []);

  async function toggle() {
    const player = audio.current;
    if (!player) return;
    userControlled.current = true;
    setError("");
    if (!player.paused) {
      player.pause();
      return;
    }
    try {
      await player.play();
    } catch {
      setError("Music could not start. Please tap to try again.");
    }
  }

  return (
    <div className="music-wrap">
      <audio
        ref={audio}
        src={`${import.meta.env.BASE_URL}assets/krishna-bhajan.mp3`}
        autoPlay
        loop
        preload="auto"
        onPlaying={() => {
          setPlaying(true);
          setError("");
        }}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setError("Music could not load. Please refresh to try again.");
        }}
      />
      <button
        type="button"
        className={`music-button ${playing ? "is-playing" : ""}`}
        onClick={toggle}
        aria-label={playing ? "Pause background music" : "Play background music"}
        aria-pressed={playing}
        title="Krishna bhajan background music"
      >
        <span className="music-icon">{playing ? <Pause size={16} /> : <Music2 size={16} />}</span>
        <span>
          {playing ? "Pause music" : "Background music"}
          <small>Krishna bhajan</small>
        </span>
        <span className="sound-bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      </button>
      {error && (
        <span className="music-error" role="status">
          {error}
        </span>
      )}
    </div>
  );
}
function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="site-nav" aria-label="Invitation navigation">
      <a className="nav-mark focus-ring" href="#home" aria-label="Home">
        M <span>·</span> M
      </a>
      <div className={`nav-links ${open ? "nav-links-open" : ""}`}>
        {navItems.map(([label, id]) => (
          <a key={id} className="focus-ring" href={`#${id}`} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </div>
      <button
        className="nav-toggle focus-ring"
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>
    </nav>
  );
}

function localEventToDate(value: string) {
  const match = value.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (!match) return new Date();
  const [, y, m, d, h, min, s] = match;
  return new Date(`${y}-${m}-${d}T${h}:${min}:${s}+05:30`);
}

function Countdown() {
  const target = useMemo(() => {
    const wedding = config.celebrations.find((event) => event.id === "havan");
    return wedding ? { ...wedding, timestamp: localEventToDate(wedding.start).getTime() } : null;
  }, []);
  const [remaining, setRemaining] = useState(() =>
    target ? Math.max(0, target.timestamp - Date.now()) : 0,
  );

  useEffect(() => {
    if (!target) return;
    const timer = window.setInterval(
      () => setRemaining(Math.max(0, target.timestamp - Date.now())),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [target]);

  if (!target || remaining === 0)
    return <p className="countdown-complete">Our housewarming day is here.</p>;
  const values = [
    ["Days", Math.floor(remaining / 86400000)],
    ["Hours", Math.floor((remaining / 3600000) % 24)],
    ["Minutes", Math.floor((remaining / 60000) % 60)],
    ["Seconds", Math.floor((remaining / 1000) % 60)],
  ];
  return (
    <div>
      <p className="countdown-label">Counting down to our housewarming day</p>
      <div className="countdown" aria-label="Countdown to our housewarming day">
        {values.map(([label, value]) => (
          <div key={label}>
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) {
  return (
    <div className="section-heading">
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{children}</h2>
      <div className="botanical-rule">
        <i />
        <b>◆</b>
        <i />
      </div>
    </div>
  );
}

function EventCard({ event, index }: { event: Celebration; index: number }) {
  return (
    <motion.article
      id={event.id}
      className={`event-card event-chapter scene-${event.scene}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.08 }}
    >
      <div className="event-poster">
        <img className="event-artwork" src={event.image} alt={event.imageAlt} loading="lazy" />
        <div className="event-content">
          <Monogram className="event-monogram" />
          {event.id === "lunch" && <p className="event-followed-by">Followed by</p>}
          <h3>{event.title}</h3>
          <p className="event-line">{event.subtitle}</p>
          <div className="event-details">
            <span>
              At <strong>{event.timeLabel}</strong>
            </span>
          </div>
        </div>
      </div>
      <div className="event-venue-panel">
        <h4>{config.venue.name}</h4>
        <p className="event-closing-line">{event.supportingLine}</p>
      </div>
    </motion.article>
  );
}

function SaveDate() {
  function download() {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mittal Family//Housewarming//EN",
      "BEGIN:VEVENT",
      "UID:mittal-housewarming-20261128@invitation.local",
      "DTSTAMP:20261116T000000Z",
      "DTSTART:20261128T014500Z",
      "SUMMARY:Mittal Family House Warming Ceremony",
      `LOCATION:${config.venue.address.replace(/,/g, "\\,")}`,
      "DESCRIPTION:Havan 07.15 AM; Paath Shri Sundar Kaand 10.00 AM; Lunch 12.30 PM. All timings IST.",
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    const url = URL.createObjectURL(
      new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "Mittal-Housewarming-28-November-2026.ics";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <button className="button button-outline focus-ring save-date-button" onClick={download}>
      <CalendarDays /> Save the date · 28 November 2026
    </button>
  );
}

export default function App() {
  return (
    <div className="invitation">
      <Navigation />
      <MusicControl />
      <main>
        <section className="hero housewarming-hero" id="home">
          <div className="paper-grain" />
          <div className="hero-inner">
            <Monogram className="hero-monogram" />
            <p className="ganesh-line">॥ श्री गणेशाय नमः ॥</p>
            <p className="hero-blessings">
              With the heavenly blessings of
              <br />
              <strong>Late Sh. Hari Chand Mittal</strong>
            </p>
            <p className="host-name">Smt. Madhu Mittal</p>
            <p className="hero-invite-line">Cordially invites you to celebrate our</p>
            <h1>
              House Warming
              <br />
              Ceremony
            </h1>
            <div className="hero-date">Saturday, 28 November 2026</div>
            <figure className="house-photo-frame">
              <img
                src={config.houseImage}
                alt="The Mittal family's new home, with ivory arches, palm trees and ornate entrance gates"
                fetchPriority="high"
              />
              <figcaption>Our new home, blessed by your presence.</figcaption>
            </figure>
            <a className="hero-scroll-highlight focus-ring" href="#celebrations">
              <span>
                Scroll down<strong>Explore the celebrations</strong>
              </span>
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
          <div className="hero-artwork" aria-hidden="true">
            <img
              src={`${import.meta.env.BASE_URL}assets/housewarming-opening-v2.png`}
              alt=""
              fetchPriority="high"
            />
          </div>
        </section>

        <section className="family-section" id="invitation">
          <div className="edge-flower edge-flower-left" aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <span className="script-accent">A beautiful new beginning</span>
            <p>{config.invitationLine}</p>
            <span className="presence-line">Awaiting Your Gracious Presence</span>
            <Monogram />
          </motion.div>
        </section>

        <section className="countdown-section">
          <SectionHeading eyebrow="Until we celebrate">
            Counting down to our new beginning
          </SectionHeading>
          <Countdown />
          <SaveDate />
        </section>

        <section className="celebrations-section" id="celebrations">
          <Monogram className="celebrations-monogram" />
          <SectionHeading eyebrow="Saturday, 28 November 2026">
            Prayers, blessings & togetherness
          </SectionHeading>
          <div className="events">
            {config.celebrations.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </section>

        <section className="venue-section housewarming-venue" id="venue">
          <div className="venue-content">
            <SectionHeading eyebrow="Where we gather">Our new home</SectionHeading>
            <MapPin className="venue-pin" />
            <h3>{config.venue.name}</h3>
            <p>
              Street Adjoining Karuna Hospital
              <br />
              Patiala By Pass Road, Sangrur
            </p>
            <figure className="venue-qr">
              <a
                className="venue-qr-link focus-ring"
                href={config.venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${config.venue.name} in Google Maps`}
              >
                <span className="venue-qr-title">Scan for location</span>
                <img
                  src={`${import.meta.env.BASE_URL}assets/house-location-qr.svg`}
                  alt={`Google Maps location QR code for ${config.venue.name}`}
                  width={256}
                  height={256}
                  loading="lazy"
                />
              </a>
              <figcaption>Scan with your camera, or tap the code to open Maps.</figcaption>
            </figure>
            <a
              className="button button-outline focus-ring venue-map-button"
              href={config.venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin /> Open in Google Maps
            </a>
          </div>
        </section>

        <section className="family-acknowledgements" id="family">
          <span className="script-accent">Warm Welcome</span>
          <h2>Priyanka & Shanky Mittal</h2>
          <div className="botanical-rule">
            <i />
            <b>◆</b>
            <i />
          </div>
          <div className="family-names">
            <span className="eyebrow underlined-heading">RSVP</span>
            <p>
              Late Sh. Ved Parkash & Raj Rani Mittal
              <br />
              Sourabh Mittal & Babita Mittal
              <br />
              Gaurav Mittal & Surbhi Mittal
            </p>
          </div>
          <div className="family-names">
            <span className="eyebrow underlined-heading">With Best Compliments From</span>
            <p>
              Nishi Gupta & Aayush Rai Gupta
              <br />
              Ridhi Garg & Rohit Garg
            </p>
          </div>
          <div className="family-names">
            <span className="script-accent">Family’s Flowers</span>
            <p>
              Arnav Mittal, Divam Garg
              <br />
              Vrishti, Sumedha, Divyanshi, Vanika & Ashita
            </p>
          </div>
          <div className="family-names">
            <span className="eyebrow underlined-heading">Contact Details</span>
            <div className="contact-links">
              <a href="tel:+919876350255">
                <Phone />
                98763-50255
              </a>
              <a href="tel:+919888854567">
                <Phone />
                98888-54567
              </a>
            </div>
          </div>
        </section>
        <footer>
          <div className="closing-copy">
            <Monogram />
            <span>With love & blessings,</span>
            <p className="closing-message">
              The Mittal family looks forward to welcoming you to our home and sharing this
              beautiful beginning together.
            </p>
            <div className="closing-rule" aria-hidden="true" />
            <p>
              Save the Date
              <br />
              28 November 2026
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
