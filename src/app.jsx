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

      gsap.to('.navbar', {
        scrollTrigger: { trigger: '.main-landing-wrapper', start: 'top 5%', toggleActions: 'play none none reverse' },
        autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out'
      });

      // Background color dynamic to theme, so we can't hardcode GSAP bg color shift. 
      // It's handled by pure CSS custom properties now.

      // SECTION 1: GSAP RIGID PIN
      const images = gsap.utils.toArray('.stacked-img');
      const fallbacks = gsap.utils.toArray('.image-fallback');
      const textScroller = document.querySelector('.layout-left-scroller');
      
      if (images[0]) gsap.set(images[0], { opacity: 1 });
      if (fallbacks[0]) gsap.set(fallbacks[0], { opacity: 1 });

      const pinnedTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.layout-editorial-pinned',
          start: 'top top', 
          end: '+=250%', 
          scrub: 1,
          pin: true,
          pinSpacing: true
        }
      });

      pinnedTl.to(textScroller, { y: -150, duration: 6, ease: 'none' }, 0);
      
      pinnedTl.to([images[0], fallbacks[0]], { opacity: 0, duration: 2 }, 1)
              .to([images[1], fallbacks[1]], { opacity: 1, duration: 2 }, 1);
              
      pinnedTl.to([images[1], fallbacks[1]], { opacity: 0, duration: 2 }, 4)
              .to([images[2], fallbacks[2]], { opacity: 1, duration: 2 }, 4);

      pinnedTl.to({}, { duration: 1.5 });

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

  const handleNavClick = (e) => {
    e.preventDefault();
    gsap.timeline().to(e.currentTarget, { scale: 1.03, duration: 0.15, ease: 'power2.out' }).to(e.currentTarget, { scale: 1, duration: 0.15, ease: 'power2.in' });
  };

  return (
    <div ref={containerRef} className="app-container">
      
      <nav className="navbar">
        <div className="nav-left" onClick={handleNavClick}>
          {/* Dynamically imported SFLogo instead of logo.png */}
          <img src={SFLogo} alt="Street Fury" className="logo" />
        </div>
        <div className={`nav-right ${isMobileMenuOpen ? 'menu-open' : ''}`}>
          <a href="#" onClick={(e) => { handleNavClick(e); setIsMobileMenuOpen(false); }}>Events</a>
          <a href="#" onClick={(e) => { handleNavClick(e); setIsMobileMenuOpen(false); }}>About</a>
          <a href="#" onClick={(e) => { handleNavClick(e); setIsMobileMenuOpen(false); }}>Gallery</a>
          <a href="#" onClick={(e) => { handleNavClick(e); setIsMobileMenuOpen(false); }}>Contact</a>
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

      <section className="hero">
        <div className="hero-top-text" style={{ transform: 'translateY(-20px)', opacity: 0 }}>
          <p>“Street culture collective<br/>from Northeast India.”</p>
        </div>
        <div className="hero-title-container">
          <h1 className="hero-title">
            {titleChars.map((char, index) => (
               <span key={index} className="hero-char">{char === " " ? "\u00A0" : char}</span>
            ))}
          </h1>
        </div>
      </section>

      <div className="main-landing-wrapper">
        
        {/* SECTION 1: Rigid Pin GSAP Scroll */}
        <section className="layout-editorial-pinned">
          <div className="layout-left-scroller">
            <div className="single-text-block">
              <h2>Event Series</h2>
              <p>— High-energy street gatherings blending skateboarding, BMX, and live music into one continuous experience.</p>
              <br/>
              <p>We don’t just organize events — we create spaces where movement, music, and identity collide. Experience the raw energy.</p>
              <a href="#" className="cta-link">→ Explore Events</a>
            </div>
          </div>
          
          <div className="layout-right-pinned">
            <div className="pinned-image-stack parallax-img">
              <div className="image-fallback fb-1">Image 1</div>
              <img src="/img1.jpg" alt="Event 1" className="stacked-img img-1" onError={(e) => { e.target.style.display='none'; e.target.previousSibling.style.display='flex'; }} />
              
              <div className="image-fallback fb-2">Image 2</div>
              <img src="/img2.jpg" alt="Event 2" className="stacked-img img-2" onError={(e) => { e.target.style.display='none'; e.target.previousSibling.style.display='flex'; }} />
              
              <div className="image-fallback fb-3">Image 3</div>
              <img src="/img3.jpg" alt="Event 3" className="stacked-img img-3" onError={(e) => { e.target.style.display='none'; e.target.previousSibling.style.display='flex'; }} />
            </div>
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
        <section className="reveal-section gallery-section">
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
        <section className="about-section" style={{ minHeight: '80vh', padding: '10rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="about-manifesto">
            {manifestoLines.map((line, i) => (
               <p key={i} className="manifesto-line">{line}</p>
            ))}
          </div>
        </section>

        {/* FOOTER v2 Exact Match to Brief */}
        <footer className="footer-v2">
          <div className="footer-v2-main">
            
            <div className="footer-v2-col-left">
              <h3 className="footer-v2-logo">STREET FURY</h3>
              <p className="footer-v2-desc">A street culture collective built from movement, community, and raw expression.</p>
              <p className="footer-v2-copy">© Street Fury — All rights reserved</p>
            </div>
            
            <div className="footer-v2-links">
               <div className="footer-v2-nav-col">
                 <a href="#">Events</a>
                 <a href="#">About</a>
                 <a href="#">Gallery</a>
                 <a href="#">Contact</a>
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
