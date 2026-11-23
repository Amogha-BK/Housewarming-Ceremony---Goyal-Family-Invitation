import { useEffect, useRef, useState } from "react";

import { ArrowDown, CalendarDays, MapPin, Menu, Pause, Phone, Music2, X } from "lucide-react";
import { motion } from "motion/react";
import { asset, invitationConfig as config, type Celebration } from "./invitationConfig";

const navItems = [
  ["Invitation", "invitation"],
  ["Programme", "celebrations"],
  ["Venue", "venue"],
  ["Contact", "contact"],
] as const;

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
        G <span>·</span> G
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

function Countdown() {
  const target = Date.parse(config.dateTime);
  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  if (remaining === 0) return null;
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-heading">
      <h2>{children}</h2>
      <div className="botanical-rule" aria-hidden="true">
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
      className="event-card event-chapter"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.08 }}
    >
      <div className="event-poster">
        <img className="event-artwork" src={event.image} alt="" loading="lazy" />
        <div className="event-content">
          <h3>{event.title}</h3>
          <p className="event-line">{event.subtitle}</p>
          <div className="event-details">
            <strong>{event.time}</strong>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function SaveDate() {
  function download() {
    const toCalendarTime = (date: Date) => date.toISOString().replace(/[-:]|\.\d{3}/g, "");
    const description = config.programme.map(({ title, time }) => `${title} ${time}`).join("\\n");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Goyal Family//Housewarming//EN",
      "BEGIN:VEVENT",
      "UID:goyal-housewarming-20261203@invitation.local",
      `DTSTAMP:${toCalendarTime(new Date())}`,
      `DTSTART:${toCalendarTime(new Date(config.dateTime))}`,
      "SUMMARY:Goyal Family House Warming Ceremony",
      `LOCATION:${`${config.venue.name}, ${config.venue.address}`.replace(/,/g, "\\,")}`,
      `DESCRIPTION:${description}\\nAll timings IST.`,
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    const calendar = lines
      .flatMap((line) => [
        line.slice(0, 75),
        ...(line.slice(75).match(/.{1,74}/g) ?? []).map((chunk) => ` ${chunk}`),
      ])
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([`${calendar}\r\n`], { type: "text/calendar;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "Goyal-Housewarming-3-December-2026.ics";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <button className="button button-outline focus-ring save-date-button" onClick={download}>
      <CalendarDays /> {config.dateShort}
    </button>
  );
}

export default function App() {
  return (
    <div className="invitation">
      <Navigation />
      <MusicControl />
      <main>
        <section className="hero housewarming-hero goyal-opening" id="home" aria-label="Invocation">
          <div className="paper-grain" />
          <div className="hero-inner">
            <div className="invocation-symbols" aria-hidden="true">
              <span>ॐ</span>
              <span className="invocation-swastik">卐</span>
              <span>ॐ</span>
            </div>
            <p className="invocation-title">Shree Ganeshay Namah</p>
            <a className="hero-scroll-highlight focus-ring" href="#blessings">
              <span>
                <strong>View invitation</strong>
              </span>
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
          <div className="hero-artwork" aria-hidden="true">
            <img src={asset("housewarming-opening-v2.png")} alt="" fetchPriority="high" />
          </div>
        </section>

        <section className="family-section goyal-blessings" id="blessings">
          <div className="edge-flower edge-flower-left" aria-hidden="true" />
          <div>
            <SectionHeading>With the Divine Blessings of</SectionHeading>
            <p>Shreeji &amp; Thakurji</p>
            <span className="script-accent" aria-hidden="true">
              &amp;
            </span>
            <p>
              Dr. Deepak Acharya ji
              <br />
              <small>(Mohali)</small>
            </p>
          </div>
        </section>

        <section className="hero housewarming-hero goyal-invite" id="invitation">
          <div className="hero-inner">
            <p className="host-name">Smt. Yogita Rani</p>
            <p className="family-relation">(W/o Late Sh. Madan Lal Goyal)</p>
            <p className="hero-invite-line">Cordially invites you to celebrate the</p>
            <h1>
              House Warming
              <br />
              Ceremony
            </h1>
            <p className="invite-of">of</p>
            <p className="host-name">Gaurav Goyal &amp; Kashish Goyal</p>
            <p className="family-relation">
              (D/o Late Sh. Ashok Singhania &amp; Late Smt. Ritu Singhania)
            </p>
            <div className="house-photo-frame" aria-hidden="true">
              <div className="house-photo-space" />
            </div>
            <a className="hero-scroll-highlight focus-ring" href="#celebrations">
              <span>
                <strong>View programme</strong>
              </span>
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="celebrations-section" id="celebrations">
          <SectionHeading>Programme</SectionHeading>
          <p className="programme-date">
            <time dateTime="2026-12-03">{config.date}</time>
          </p>
          <ul className="programme-schedule">
            {config.programme.map((event) => (
              <li key={event.id}>
                <a className="focus-ring" href={`#${event.id}`}>
                  {event.title}
                </a>
                <span>{event.time}</span>
              </li>
            ))}
          </ul>
          <div className="events goyal-programme">
            {config.programme.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </section>

        <section className="venue-section housewarming-venue" id="venue">
          <div className="venue-content">
            <SectionHeading>Venue</SectionHeading>
            <MapPin className="venue-pin" aria-hidden="true" />
            <h3>{config.venue.name}</h3>
            <p>{config.venue.address}</p>
            <figure className="venue-qr">
              <a
                className="venue-qr-link focus-ring"
                href={config.venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Find ${config.venue.name} in Google Maps`}
              >
                <span className="venue-qr-title">Scan for location</span>
                <img src={config.venue.qr} alt="" width={256} height={256} loading="lazy" />
              </a>
            </figure>
            <a
              className="button button-outline focus-ring venue-map-button"
              href={config.venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin aria-hidden="true" /> Open in Google Maps
            </a>
          </div>
        </section>

        <section className="family-section goyal-welcome" id="family">
          <div>
            <p className="goyal-presence">Awaiting Your Gracious Presence</p>
            <SectionHeading>Warm Welcome</SectionHeading>
            <ul className="welcome-names">
              <li>Jayesha Goyal</li>
              <li>Harisha Goyal</li>
            </ul>
          </div>
        </section>

        <section className="family-acknowledgements" id="compliments">
          <SectionHeading>With Best Compliments From</SectionHeading>
          <ul className="welcome-names">
            <li>Goyal Family</li>
            <li>Gupta Family</li>
          </ul>
        </section>

        <footer id="contact">
          <SectionHeading>Contact Details</SectionHeading>
          <div className="contact-links">
            {config.contacts.map((number) => (
              <a key={number} className="focus-ring" href={`tel:+91${number.replace("-", "")}`}>
                <Phone aria-hidden="true" />
                {number}
              </a>
            ))}
          </div>
          <div className="closing-copy">
            <h3 className="script-accent">Save the Date</h3>
            <SaveDate />
          </div>
          <Countdown />
        </footer>
      </main>
    </div>
  );
}
