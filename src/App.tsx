import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { useState, useRef } from 'react';
import type { Variants } from 'framer-motion';
import {
  FaRobot,
  FaArrowRight,
  FaGlobe,
  FaMicrochip,
  FaBolt,
  FaChartLine,
  FaLayerGroup
} from 'react-icons/fa6';

/* ────────── Scroll-based Section with Text Reveal ────────── */
function AnimatedSection({ 
  children, 
  sectionKey 
}: { 
  children: React.ReactNode; 
  sectionKey: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  return (
    <motion.div
      ref={sectionRef}
      className="animated-section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {children}
    </motion.div>
  );
}
import Background3D from './components/Background3D';
import CustomCursor from './components/CustomCursor';
import './index.css';

/* ────────── Navbar (Pill Crystal) ────────── */
const Navbar = ({ visible, scrollVal }: { visible: boolean; scrollVal: number }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return (
  <motion.nav
    initial={{ y: -100, opacity: 0 }}
    animate={visible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    style={{
      position: 'fixed', 
      top: isMobile ? '0.6rem' : '1.5rem', 
      left: isMobile ? '0.5rem' : '50%',
      right: isMobile ? '0.5rem' : 'auto',
      margin: isMobile ? '0 auto' : '0 auto',
      transform: isMobile ? 'none' : 'translateX(-50%)',
      zIndex: 100, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: isMobile ? 'clamp(0.3rem, 1.2vw, 0.6rem)' : 'clamp(0.4rem, 1.4vw, 0.8rem)',
      padding: isMobile ? '0.5rem 0.7rem' : 'clamp(0.4rem, 1.4vw, 0.7rem) clamp(0.55rem, 1.8vw, 1rem)',
      borderRadius: '50px',
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      width: isMobile ? 'calc(100vw - 1rem)' : 'fit-content',
      maxWidth: 'none',
      flexWrap: 'nowrap',
    }}
  >
    <div style={{ display: 'flex', gap: isMobile ? '0.3rem' : 'clamp(0.35rem, 1.2vw, 0.6rem)', alignItems: 'center', flexWrap: 'nowrap' }}>
      {['Servicios', 'Proyectos'].map((item) => (
        <a key={item} href={`#${item.toLowerCase()}`}
          style={{
            color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 500,
            fontSize: isMobile ? '0.52rem' : 'clamp(0.5rem, 1.3vw, 0.7rem)', textTransform: 'uppercase', letterSpacing: '0.06em',
            transition: 'all 0.3s', padding: '2px 0', whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >{item}</a>
      ))}
    </div>
    
    <div style={{
      fontSize: isMobile ? '0.78rem' : 'clamp(0.72rem, 1.6vw, 0.95rem)', fontWeight: 900, letterSpacing: '-0.03em',
      color: '#fff', padding: isMobile ? '0.2rem 0.5rem' : 'clamp(0.18rem, 0.8vw, 0.28rem) clamp(0.4rem, 1.2vw, 0.6rem)',
      borderRadius: isMobile ? '12px' : 'clamp(10px, 2.2vw, 16px)', 
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      JAMD<span style={{ color: 'var(--accent-glow)', fontWeight: 400, marginLeft: '1px', fontSize: isMobile ? '0.52rem' : 'clamp(0.45rem, 1.1vw, 0.6rem)', letterSpacing: '0.06em' }}>AGENCY</span>
    </div>
    
    <div style={{ display: 'flex', gap: isMobile ? '0.3rem' : 'clamp(0.35rem, 1.2vw, 0.6rem)', alignItems: 'center', flexWrap: 'nowrap' }}>
      <a href="#contacto"
        style={{
          color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: 500,
          fontSize: isMobile ? '0.52rem' : 'clamp(0.5rem, 1.3vw, 0.7rem)', textTransform: 'uppercase', letterSpacing: '0.06em',
          transition: 'all 0.3s', padding: '2px 0', whiteSpace: 'nowrap'
        }}
        onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }}
        onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
      >Contacto</a>
      <button className="btn-prm" style={{ fontSize: isMobile ? '0.48rem' : 'clamp(0.42rem, 1.1vw, 0.58rem)', padding: isMobile ? '0.28rem 0.55rem' : 'clamp(0.24rem, 0.9vw, 0.35rem) clamp(0.4rem, 1.3vw, 0.6rem)', borderRadius: isMobile ? '12px' : 'clamp(10px, 2.2vw, 14px)', whiteSpace: 'nowrap' }}>
        Hablemos
      </button>
    </div>
  </motion.nav>
  );
};

/* ────────── Animation variants ────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: (d: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 1, delay: d, ease: [0.23, 1, 0.32, 1] }
  })
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

function AnimatedText({ 
  children, 
  sectionKey 
}: { 
  children: React.ReactNode; 
  sectionKey: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Start appearing AFTER JA/MD 2D is FULLY GONE (scroll > 0.40)
  const startPoint = 0.40;
  const opacity = useTransform(scrollYProgress, [0, startPoint, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, startPoint, 0.8, 1], [0.85, 1, 1, 0.85]);
  const y = useTransform(scrollYProgress, [0, startPoint, 0.8, 1], [80, 0, 0, 80]);
  
  return (
    <div ref={ref} style={{ minHeight: '200vh', position: 'relative' }}>
      <motion.div
        style={{ 
          opacity, 
          scale, 
          y,
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ────────── App ────────── */
export default function App() {
  const { scrollYProgress } = useScroll();
  const [scrollVal, setScrollVal] = useState(0);
  const smooth = useSpring(scrollYProgress, { damping: 30, stiffness: 80 });

  useMotionValueEvent(smooth, 'change', (v) => setScrollVal(v));

  // ── UI appears after initial scroll ──
  const uiOpacity = useTransform(scrollYProgress, [0.12, 0.22], [0, 1]);
  const showNav = scrollVal > 0.1;

  return (
    <>
      <Background3D scrollPercent={scrollVal} />
      <CustomCursor />

{/* ── 2D Letters (Starting state, fades out slowly after scroll) ── */}
      <motion.div
        className="hero-letters"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.15, 0.25, 0.40], [1, 1, 0.5, 0]),
          scale: useTransform(scrollYProgress, [0, 0.30], [1, 0.85]),
          filter: useTransform(scrollYProgress, [0.15, 0.30], ['blur(0px)', 'blur(12px)']),
          zIndex: 100,
          position: 'fixed',
          pointerEvents: 'none',
          display: scrollVal > 0.40 ? 'none' : 'flex'
        }}
      >
        <div className="letter-row">JA</div>
        <div className="letter-row">MD</div>
      </motion.div>

      {/* ── Main Content ── */}
      <div className="content">
        <Navbar visible={showNav} scrollVal={0} />

        {/* Scroll spacer - waits for JA MD 2D to fully disappear (scroll 0.40) */}
        <div style={{ height: '200vh' }} />

        {/* ── SLOGAN ── */}
        <AnimatedText sectionKey="slogan">
          <div style={{ maxWidth: '900px', textAlign: 'center', padding: '0 5%' }}>
            <span className="tag-ia">IA + Diseño + Automatización</span>
            <h2 style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900,
              lineHeight: 0.95, marginBottom: '1.5rem',
              background: 'linear-gradient(180deg, #fff 40%, var(--silver))',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'
            }}>
              Redefinimos<br />lo normal.
            </h2>
            <p style={{
              color: 'var(--silver)', maxWidth: '500px', margin: '0 auto 2rem',
              fontSize: '1rem', lineHeight: 1.6
            }}>
              Transformamos la visión de tu negocio a través de inteligencia artificial de vanguardia,
              diseño inmersivo y automatizaciones que trabajan mientras duermes.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-prm">Ver servicios</button>
              <button className="btn-prm" style={{ background: '#fff', color: '#000', borderColor: '#fff' }}>Contactar</button>
            </div>
          </div>
        </AnimatedText>

        {/* ── SERVICIOS ── */}
        <AnimatedText sectionKey="servicios">
          <div style={{ maxWidth: '1200px', width: '100%', padding: '0 4%' }}>
            <span className="tag-ia">Nuestros servicios</span>
            <h2 className="section-title">Soluciones que<br />escalan contigo</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '2rem' }}>
              {[
                { icon: <FaGlobe />, title: 'Desarrollo Web', desc: 'Landing pages, webs corporativas y plataformas con diseño 3D inmersivo, transiciones cinematográficas y SEO.' },
                { icon: <FaRobot />, title: 'Agentes IA', desc: 'Asistentes inteligentes que cualifican leads, agendan citas y resuelven dudas 24/7.' },
                { icon: <FaMicrochip />, title: 'Automatización', desc: 'Flujos de trabajo conectados con CRM, email marketing y analítica. Sin intervención humana.' },
                { icon: <FaBolt />, title: 'APIs & Integraciones', desc: 'Desarrollo de backends e integraciones a medida con NLP y visión artificial.' },
                { icon: <FaChartLine />, title: 'Growth Marketing', desc: 'Estrategias de crecimiento basadas en datos y modelos predictivos.' },
                { icon: <FaLayerGroup />, title: 'Infraestructura Cloud', desc: 'Despliegues escalables en AWS, GCP o tu servidor con CI/CD y monitorización.' },
                { icon: <FaRobot />, title: 'Chatbots a Medida', desc: 'Asistentes conversation customizados para tu negocio con conexión a tus sistemas.' },
                { icon: <FaGlobe />, title: 'E-commerce', desc: 'Tiendas online con integración de pagos, inventario y gestión de pedidos.' },
              ].map((s, i) => (
                <div key={i} className="service-card">
                  <div style={{ fontSize: '1.6rem', color: 'var(--accent-glow)', marginBottom: '16px' }}>{s.icon}</div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', color: '#fff' }}>{s.title}</h3>
                  <p style={{ color: 'var(--silver)', fontSize: '0.85rem', lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedText>

        {/* ── PROYECTOS ── */}
        <AnimatedText sectionKey="proyectos">
          <div style={{ maxWidth: '1300px', width: '100%', padding: '0 4%' }}>
            <span className="tag-ia">Portfolio</span>
            <h2 className="section-title">Trabajo<br />reciente</h2>

            <div className="projects-grid" style={{ marginTop: '1rem' }}>
              {[
                { title: 'NexusAI', desc: 'Plataforma SaaS', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' },
                { title: 'Immerse 3D', desc: 'Experiencia Inmersiva', img: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800' },
                { title: 'DataVault', desc: 'Dashboard IA', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
                { title: 'VoiceFlow', desc: 'Agente Conversacional', img: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800' },
              ].map((p, i) => (
                <div key={i} className="project-card">
                  <img src={p.img} alt={p.title} loading="lazy" />
                  <div className="project-info">
                    <h3 style={{ fontSize: '2.2rem', letterSpacing: '-0.03em' }}>{p.title}</h3>
                    <p style={{ color: 'var(--accent-glow)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedText>

        {/* ── CTA ── */}
        <AnimatedText sectionKey="contacto">
          <div style={{ textAlign: 'center', maxWidth: '600px', padding: '0 5%' }}>
            <span className="tag-ia">¿Tienes un proyecto en mente?</span>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>
              Hagámoslo<br />realidad.
            </h2>
            <button className="btn-prm" style={{ fontSize: '0.9rem', padding: '18px 42px' }}>
              Iniciar proyecto <FaArrowRight style={{ marginLeft: '10px' }} />
            </button>
          </div>
        </AnimatedText>

        {/* ── Footer ── */}
        <footer style={{
          padding: '40px 6%', borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontWeight: 900, fontSize: '1rem', width: '100%', marginBottom: '0.5rem' }}>
            JAMD<span style={{ color: 'var(--accent-glow)', fontWeight: 400, marginLeft: '6px', fontSize: '0.6rem', letterSpacing: '0.15em' }}>AGENCY</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.2em', width: '100%' }}>
            © 2026 JAMD AI AGENCY — Redefiniendo lo normal.
          </p>
        </footer>
      </div>
    </>
  );
}
