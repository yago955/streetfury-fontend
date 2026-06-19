import { useEffect, useRef, useState } from 'preact/hooks';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import decathlonLogo from './assets/decathlonLogo.png';
import dropsLogo from './assets/dropsLogo.jpeg';
import fpLogo from './assets/fpLogo.jpeg';
import kalimpongLogo from './assets/kalimpongLogo.jpeg';
import redbullLogo from './assets/redbullLogo.png';
import skateGuwahati from './assets/skateGuwahati.jpeg';
import skateTripuraLogo from './assets/skateTripuraLogo.jpeg';
import skatearunachalLogo from './assets/skatearunachalLogo.jpeg';
import skatemanipurLogo from './assets/skatemanipurLogo.jpeg';
import skatenagalandLogo from './assets/skatenagalandLogo.jpeg';
import skatenamchiLogo from './assets/skatenamchiLogo.jpeg';
import ssmLogo from './assets/ssmLogo.jpeg';
import turaLogo from './assets/turaLogo.jpeg';
import wandalLogo from './assets/wandalLogo.jpeg';

import SFLogo from './assets/SFLogo.png';

const brandLogos = [decathlonLogo, dropsLogo, fpLogo, kalimpongLogo, redbullLogo, skateGuwahati, skateTripuraLogo, skatearunachalLogo, skatemanipurLogo, skatenagalandLogo, skatenamchiLogo, ssmLogo, turaLogo, wandalLogo];

const manifestoLines = [
  "Street Fury is a street culture collective based in Northeast India, born from concrete, chaos, and community.",
  "This is where riders, artists, and creators come together — not as spectators, but as participants in a shared culture.",
  "No rules. Just flow.",
  "Street Fury exists for the ones who ride harder, create louder, and live outside the lines."
];

export function App() {
  const containerRef = useRef(null);
  const lenisRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const titleText = "STREET FURY";
  const titleChars = titleText.split("");

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = (e) => {
    e.preventDefault();
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tickerCallback = (time) => { lenis.raf(time * 1000); };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0, 0);

    const ctx = gsap.context(() => {

      gsap.set('.navbar', { autoAlpha: 0, y: -20 });

      const introTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      introTl.fromTo('.hero-char',
        { y: '120%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 2, delay: 0.2, stagger: { from: "end", each: 0.08 } }
      );

      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '220%', 
          scrub: 1
        }
      });

      heroScrollTl.to('.hero-top-text', { opacity: 1, y: 0, duration: 1 });
      heroScrollTl.to({}, { duration: 1 }); 
      heroScrollTl.to('.hero-top-text', { opacity: 0, y: -30, duration: 1.5 });
      heroScrollTl.to('.hero-title-container', { scale: 0.92, opacity: 0.15, y: '-10vh', duration: 2.5 }, "-=0.2");
      heroScrollTl.to('.hero-bg-image', { scale: 1.12, duration: 3 }, 0);
      heroScrollTl.to('.hero-overlay', { opacity: 1.5, duration: 3 }, 0);

      gsap.to('.navbar', {
        scrollTrigger: { trigger: '.main-landing-wrapper', start: 'top 5%', toggleActions: 'play none none reverse' },
        autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out'
      });

      // Background color dynamic to theme, so we can't hardcode GSAP bg color shift. 
      // It's handled by pure CSS custom properties now.

      // CASCADING SECTION REVEALS
      const revealSections = gsap.utils.toArray('.reveal-section:not(.layout-editorial-pinned, .about-section)');
      revealSections.forEach((sec) => {
        gsap.from(sec, { scrollTrigger: { trigger: sec, start: 'top 85%' }, y: 60, opacity: 0, duration: 1.8, ease: 'power3.out' });
      });

      gsap.utils.toArray('.parallax-img').forEach((img) => {
        gsap.fromTo(img, { y: -30 }, { y: 30, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true } });
      });

      // TEXT FADING MANIFESTO (Scroll Focal Trigger)
      gsap.utils.toArray('.manifesto-line').forEach(line => {
         // Start deeply muted
         gsap.set(line, { opacity: 0.15 });

         const tl = gsap.timeline({
           scrollTrigger: {
             trigger: line,
             start: "top 70%",
             end: "bottom 30%",
             scrub: true
           }
         });
         
         tl.to(line, { opacity: 1, duration: 0.2, ease: "none" })
           .to(line, { opacity: 1, duration: 0.6, ease: "none" }) // Hold state for middle focus
           .to(line, { opacity: 0.15, duration: 0.2, ease: "none" }); // Fade out as it leaves
      });

      // FOOTER FADE IN
      gsap.from('.footer-v2', {
        scrollTrigger: { trigger: '.footer-v2', start: 'top 95%' },
        y: 40, opacity: 0, duration: 1.5, ease: 'power3.out'
      });

    }, containerRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
       if (selectedImage) {
          lenisRef.current.stop();
          document.body.style.overflow = 'hidden';
       } else {
          lenisRef.current.start();
          document.body.style.overflow = '';
       }
    }
  }, [selectedImage]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    gsap.timeline()
      .to(e.currentTarget, { scale: 1.03, duration: 0.15, ease: 'power2.out' })
      .to(e.currentTarget, { scale: 1, duration: 0.15, ease: 'power2.in' });

    const targetElement = document.querySelector(targetId);
    if (targetElement && lenisRef.current) {
      const navbar = document.querySelector('.navbar');
      const offset = navbar ? navbar.offsetHeight : 80;
      lenisRef.current.scrollTo(targetElement, {
        offset: -offset,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  };

  return (
    <div ref={containerRef} className="app-container">
      
      <nav className="navbar">
        <div className="nav-left" onClick={(e) => handleNavClick(e, '#home')}>
          {/* Dynamically imported SFLogo instead of logo.png */}
          <img src={SFLogo} alt="Street Fury" className="logo" />
        </div>
        <div className={`nav-right ${isMobileMenuOpen ? 'menu-open' : ''}`}>
          <a href="#home" onClick={(e) => { handleNavClick(e, '#home'); setIsMobileMenuOpen(false); }}>Home</a>
          <a href="#about" onClick={(e) => { handleNavClick(e, '#about'); setIsMobileMenuOpen(false); }}>About</a>
          <a href="#team" onClick={(e) => { handleNavClick(e, '#team'); setIsMobileMenuOpen(false); }}>Team</a>
          <a href="#events" onClick={(e) => { handleNavClick(e, '#events'); setIsMobileMenuOpen(false); }}>Events</a>
          <a href="#gallery" onClick={(e) => { handleNavClick(e, '#gallery'); setIsMobileMenuOpen(false); }}>Gallery</a>
          <a href="#contact" onClick={(e) => { handleNavClick(e, '#contact'); setIsMobileMenuOpen(false); }}>Contact</a>
          <span className="nav-separator" style={{opacity: 0.2}}>&bull;</span>
          <a href="#" onClick={(e) => { toggleTheme(e); setIsMobileMenuOpen(false); }}>Theme ({theme === 'light' ? 'Dark' : 'Light'})</a>
        </div>
        <div className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
           <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
           <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </div>
      </nav>

      {/* LIGHTBOX OVERLAY */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} className="lightbox-img" alt="Focus View" />
        </div>
      )}

      <section id="home" className="hero">
        {/* Full-bleed background image */}
        <img
          src="/hero-bg.jpg"
          alt="Street Fury community"
          className="hero-bg-image"
          draggable="false"
        />
        {/* Cinematic gradient overlay */}
        <div className="hero-overlay" />

        {/* Text content layer */}
        <div className="hero-content">
          <div className="hero-top-text" style={{ transform: 'translateY(-20px)', opacity: 0 }}>
            <p>"Street culture collective<br/>from Northeast India."</p>
          </div>
          <div className="hero-title-container">
            <h1 className="hero-title">
              {titleChars.map((char, index) => (
                 <span key={index} className="hero-char">{char === " " ? "\u00A0" : char}</span>
              ))}
            </h1>
          </div>
        </div>
      </section>

      <div className="main-landing-wrapper">
        
        {/* SECTION 1: Events Section */}
        <section id="events" className="reveal-section event-section">
          <div className="event-poster-container">
            <img 
              src="/images/events/go-skate-day-2026-poster.jpg" 
              alt="Guwahati Go Skate Day 2026 Poster" 
              className="event-poster-img"
              draggable="false"
            />
          </div>
          <div className="event-text-container">
            <h2 className="event-heading">GUWAHATI GO SKATE DAY 2026</h2>
            <div className="event-paragraphs">
              <p>The wheels are rolling back into Guwahati.</p>
              <p>Join us at NF Railway Skatepark for Go Skate Day 2026, a full-day celebration of skateboarding, creativity, music, and street culture. From first-timers stepping on a board for the very first time to seasoned riders battling it out in the Street Fury Skate League Finals, this is where the city's skate scene comes alive.</p>
              <p>Expect open sessions, the legendary Game of SKATE, community jams, live music, giveaways, and non-stop energy from sunrise to sundown. Whether you're skating, spectating, filming, or just soaking in the atmosphere, this is your invitation to be part of a movement that continues to push skateboarding and youth culture forward in Northeast India.</p>
              <p>One park. One community. One day to skate.</p>
            </div>
            <div className="event-info-list">
              <div className="event-info-item">
                <span className="event-info-icon">📍</span>
                <span className="event-info-val">NF Railway Skatepark, Guwahati</span>
              </div>
              <div className="event-info-item">
                <span className="event-info-icon">🗓️</span>
                <span className="event-info-val">20 June 2026</span>
              </div>
              <div className="event-info-item">
                <span className="event-info-icon">🛹</span>
                <span className="event-info-val">Street Fury Skate League Finals</span>
              </div>
              <div className="event-info-item">
                <span className="event-info-icon">🎸</span>
                <span className="event-info-val">Live performances by Anita, 5 Stacks Height, After Dark & Arseniic</span>
              </div>
            </div>
            <p className="event-conclusion">
              No matter your skill level—grab your board, bring your crew, and celebrate Go Skate Day the way it's meant to be celebrated: loud, fast, and together.
            </p>
            <a href="#contact" className="cta-link" onClick={(e) => handleNavClick(e, '#contact')}>→ Explore Events</a>
          </div>
        </section>

        {/* SECTION 2: Text Feature Block */}
        <section className="reveal-section section-text-feature">
          <h2>Built for the streets.<br/>Designed for movement.<br/>Engineered for culture.</h2>
          <p>From raw skate sessions under open skies to high-energy BMX showcases and underground live performances, every Street Fury event is designed to feel alive, unpredictable, and real.</p>
        </section>

        {/* SECTION 3: Reversed Split Image Layout */}
        <section className="reveal-section section-split-reversed">
          <div className="split-left parallax-img">
            <img src="/img4.jpg" alt="Street Fury Feature" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            <div className="image-placeholder dominant-image-placeholder" style={{ display: 'none' }}><p>Dominant Image</p></div>
          </div>
          <div className="split-right">
            <img src="/img5.jpg" alt="Street Fury Small Feature" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            <div className="image-placeholder small-image-placeholder" style={{ display: 'none' }}><p>Smaller Image</p></div>
            <p className="split-text">We believe in building platforms, not stages. We believe in community over crowd. We believe in pushing boundaries — not just in tricks, but in how events are experienced.</p>
          </div>
        </section>

        {/* BRAND CAROUSEL (Transparent Match with the Website Panel Background) */}
        <section className="brand-carousel-section">
          <div className="brand-carousel-track">
            {/* Array mapped twice for seamless infinity loop */}
            {[...brandLogos, ...brandLogos].map((src, i) => (
              <img key={i} src={src} className="brand-logo" alt={`Brand Logo ${i}`} />
            ))}
          </div>
        </section>

        {/* SECTION 4: Gallery Grid (Staggered 3:4 blocks) */}
        <section id="gallery" className="reveal-section gallery-section">
          <div className="gallery-header">
            <h2>Street Fury Gallery</h2>
            <p>A glimpse into the movement — moments captured from sessions, events, and everything in between.</p>
          </div>
          <div className="gallery-grid-masonry">
             {[6,7,8,9,10,11,12,13,14,15,16,18,19,20,21,22].map(num => (
               <div className="masonry-item" key={num} onClick={() => setSelectedImage(`/img${num}.jpg`)}>
                 <img src={`/img${num}.jpg`} className="masonry-img" loading="lazy" alt={`Gallery ${num}`} onError={(e) => { e.target.style.display='none'; }}/>
               </div>
             ))}
          </div>
        </section>

        {/* SECTION 5: About Section Core Text - SCROLL FADE FOCUS */}
        <section id="about" className="about-section" style={{ minHeight: '80vh', padding: '10rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="about-manifesto">
            {manifestoLines.map((line, i) => (
               <p key={i} className="manifesto-line">{line}</p>
            ))}
          </div>
        </section>

        {/* SECTION 6: Team Section */}
        <section id="team" className="reveal-section team-section">
          <div className="team-header">
            <h2>The Crew</h2>
            <p>The driving force behind Street Fury — riders, builders, and creators pushing action sports culture forward.</p>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-card-image-wrapper">
                <img src="/images/team/bikram-sarkar.jpg" alt="Bikram Sarkar" className="team-card-img" />
              </div>
              <div className="team-card-content">
                <h3 className="team-card-name">Bikram Sarkar</h3>
                <div className="team-card-nickname">Known as BikramBMX</div>
                <div className="team-card-title">Founder, Street Fury | Professional BMX Flatland Rider</div>
                <div className="team-card-tagline">Building the future of BMX and action sports culture in Northeast India.</div>
                <div className="team-card-bio">
                  <p>Bikram Sarkar, widely known as BikramBMX, is the founder of Street Fury and a professional BMX Flatland rider from Assam, India. Passionate about action sports and youth culture, he is dedicated to growing the BMX and skateboarding community through events, competitions, workshops, and grassroots initiatives.</p>
                  <p>Since founding Street Fury in 2023, Bikram has worked to create opportunities for riders and athletes while promoting action sports across the region. Through his riding, event management, and community-building efforts, he continues to inspire and support the next generation of action sports enthusiasts.</p>
                  <p>His vision is to build a strong and inclusive platform that develops talent, promotes creativity, and advances BMX, skateboarding, and urban culture throughout India.</p>
                </div>
              </div>
            </div>

            <div className="team-card">
              <div className="team-card-image-wrapper">
                <img src="/images/team/ashish-das.jpg" alt="Ashish Das" className="team-card-img" />
              </div>
              <div className="team-card-content">
                <h3 className="team-card-name">Ashish Das</h3>
                <div className="team-card-title">Skateboarder | Downhill Longboarder | Coach | Community Builder</div>
                <div className="team-card-tagline">Growing skateboarding culture and empowering the next generation of riders.</div>
                <div className="team-card-bio">
                  <p>Ashish Das is a skateboarder, downhill longboarder, coach, and community builder from Guwahati, Assam. Through Street Fury and Skate Guwahati, he has spent years developing skateboarding culture across Northeast India through coaching programs, events, competitions, and grassroots community initiatives.</p>
                  <p>Driven by a deep passion for action sports and youth culture, Ashish continues to push progression both on and off the board. His dedication to mentorship and community development has helped create opportunities for new riders while strengthening the region's skateboarding ecosystem.</p>
                </div>
              </div>
            </div>

            <div className="team-card">
              <div className="team-card-image-wrapper">
                <img src="/images/team/anubhab-baruah.jpg" alt="Anubhab Baruah" className="team-card-img" />
              </div>
              <div className="team-card-content">
                <h3 className="team-card-name">Anubhab Baruah</h3>
                <div className="team-card-nickname">Known as Bob</div>
                <div className="team-card-title">Filmmaker & Web Developer</div>
                <div className="team-card-tagline">Combining storytelling, technology, and creative media to inspire communities.</div>
                <div className="team-card-bio">
                  <p>Anubhab Baruah is a filmmaker and web developer from Assam with a passion for storytelling, digital innovation, and creative media. Blending technical expertise with visual creativity, he has contributed to a variety of projects in filmmaking, content creation, and web development.</p>
                  <p>Through his work, Anubhab aims to create impactful digital experiences and document stories that inspire communities and youth culture. At Street Fury, he is responsible for visual storytelling, media production, content development, and digital experiences that showcase the growth of action sports across the region.</p>
                  <p><strong>Role at Street Fury:</strong> Filmmaker & Web Developer — responsible for visual storytelling, media production, content creation, and digital development for Street Fury events, campaigns, and community initiatives.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER v2 Exact Match to Brief */}
        <footer id="contact" className="footer-v2">
          <div className="footer-v2-main">
            
            <div className="footer-v2-col-left">
              <h3 className="footer-v2-logo">STREET FURY</h3>
              <p className="footer-v2-desc">A street culture collective built from movement, community, and raw expression.</p>
              <p className="footer-v2-copy">© Street Fury — All rights reserved</p>
            </div>
            
            <div className="footer-v2-links">
               <div className="footer-v2-nav-col">
                 <a href="#events" onClick={(e) => handleNavClick(e, '#events')}>Events</a>
                 <a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About</a>
                 <a href="#gallery" onClick={(e) => handleNavClick(e, '#gallery')}>Gallery</a>
                 <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>
               </div>
               <div className="footer-v2-nav-col">
                 <a href="#">Press</a>
                 <a href="#">Collaborate</a>
               </div>
            </div>

            <div className="footer-v2-newsletter">
              <h2>STAY CONNECTED</h2>
              <p>Stay updated with upcoming events, drops, and street sessions.</p>
              <form action="mailto:operations@streetfury.in?subject=New%20Subscriber%20—%20Street%20Fury" method="post" encType="text/plain" className="footer-v2-form">
                <input type="email" placeholder="Email address" name="mail" required />
                <button type="submit">Enter</button>
              </form>
            </div>
            
          </div>
          
          <div className="footer-v2-bottom">
            <div className="footer-email">
                <a href="mailto:operations@streetfury.in">operations@streetfury.in</a>
            </div>
            <div className="footer-socials">
                <a href="https://www.instagram.com/streetfuryofficial?igsh=dzFkMjFrdm0wa253" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://www.youtube.com/@Streetfuryofficial" target="_blank" rel="noopener noreferrer">YouTube</a>
                <a href="#">Twitter / X</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
