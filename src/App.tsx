import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
  FaRobot, FaArrowRight, FaGlobe, FaMicrochip,
  FaBolt, FaChartLine, FaLayerGroup, FaEnvelope,
  FaWhatsapp, FaInstagram, FaLinkedin, FaXTwitter,
  FaCheck,
} from 'react-icons/fa6';

import Background3D from './components/Background3D';
import CustomCursor from './components/CustomCursor';
import './index.css';

/* ────────── Modal de Contacto ────────── */
function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí conectarías tu backend / Formspree / emailjs
    setSent(true);
    setTimeout(() => { setSent(false); onClose(); setForm({ name: '', email: '', message: '' }); }, 2500);
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(12,12,14,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', padding: 'clamp(1.5rem,4vw,2.5rem)',
          width: '100%', maxWidth: '500px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <div>
            <span className="tag-ia">Contacto directo</span>
            <h3 style={{ fontSize:'clamp(1.2rem,3vw,1.6rem)', fontWeight:900, lineHeight:1.1 }}>Hablemos de tu<br />proyecto</h3>
          </div>
          <button onClick={onClose} style={{ color:'rgba(255,255,255,0.4)', fontSize:'1.4rem', background:'none', border:'none', cursor:'pointer', lineHeight:1 }}>✕</button>
        </div>

        {sent ? (
          <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
            style={{ textAlign:'center', padding:'2rem 0' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✓</div>
            <p style={{ color:'var(--accent-glow)', fontWeight:700 }}>¡Mensaje enviado!</p>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.85rem', marginTop:'0.5rem' }}>Te contactaremos en menos de 24h.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <input required value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
              placeholder="Tu nombre" style={inputStyle} />
            <input required type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}
              placeholder="tu@email.com" style={inputStyle} />
            <textarea required value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))}
              placeholder="Cuéntanos tu proyecto..." rows={4} style={{ ...inputStyle, resize:'vertical' }} />
            <button type="submit" className="btn-prm" style={{ width:'100%', marginTop:'0.5rem' }}>
              Enviar mensaje <FaEnvelope style={{ marginLeft:'8px' }} />
            </button>
          </form>
        )}

        <div style={{ display:'flex', gap:'12px', justifyContent:'center', marginTop:'1.5rem' }}>
          {[
            { icon: <FaWhatsapp />, href: 'https://wa.me/34600000000', label:'WhatsApp' },
            { icon: <FaInstagram />, href: 'https://instagram.com/jamdagency', label:'Instagram' },
            { icon: <FaLinkedin />, href: 'https://linkedin.com/company/jamdagency', label:'LinkedIn' },
            { icon: <FaXTwitter />, href: 'https://x.com/jamdagency', label:'X' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              aria-label={s.label}
              style={{ color:'rgba(255,255,255,0.3)', fontSize:'1.1rem', transition:'color 0.2s' }}
              onMouseOver={e=>(e.currentTarget.style.color='#fff')}
              onMouseOut={e=>(e.currentTarget.style.color='rgba(255,255,255,0.3)')}>
              {s.icon}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  padding: '0.75rem 1rem',
  color: '#fff',
  fontSize: '0.9rem',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
};

/* ────────── Navbar ────────── */
const Navbar = ({ visible, onContact }: { visible: boolean; onContact: () => void }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      style={{
        position: 'fixed', top: isMobile ? '0.6rem' : '1.5rem',
        left: isMobile ? '0.5rem' : '50%', right: isMobile ? '0.5rem' : 'auto',
        transform: isMobile ? 'none' : 'translateX(-50%)',
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: isMobile ? '0.3rem' : 'clamp(0.4rem,1.4vw,0.8rem)',
        padding: isMobile ? '0.5rem 0.7rem' : 'clamp(0.4rem,1.4vw,0.7rem) clamp(0.55rem,1.8vw,1rem)',
        borderRadius: '50px',
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        width: isMobile ? 'calc(100vw - 1rem)' : 'fit-content',
      }}
    >
      <div style={{ display:'flex', gap: isMobile?'0.3rem':'clamp(0.35rem,1.2vw,0.6rem)', alignItems:'center' }}>
        {['Servicios','Proyectos'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`}
            style={{ color:'rgba(255,255,255,0.5)', textDecoration:'none', fontWeight:500,
              fontSize: isMobile?'0.52rem':'clamp(0.5rem,1.3vw,0.7rem)', textTransform:'uppercase',
              letterSpacing:'0.06em', transition:'color 0.3s', whiteSpace:'nowrap' }}
            onMouseOver={e=>{ e.currentTarget.style.color='#fff'; }}
            onMouseOut={e=>{ e.currentTarget.style.color='rgba(255,255,255,0.5)'; }}>
            {item}
          </a>
        ))}
      </div>
      <div style={{
        fontSize: isMobile?'0.78rem':'clamp(0.72rem,1.6vw,0.95rem)', fontWeight:900, letterSpacing:'-0.03em',
        color:'#fff', padding: isMobile?'0.2rem 0.5rem':'clamp(0.18rem,0.8vw,0.28rem) clamp(0.4rem,1.2vw,0.6rem)',
        borderRadius: isMobile?'12px':'clamp(10px,2.2vw,16px)',
        background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
        boxShadow:'inset 0 1px 0 rgba(255,255,255,0.1)', whiteSpace:'nowrap', flexShrink:0,
      }}>
        JAMD<span style={{ color:'var(--accent-glow)', fontWeight:400, marginLeft:'1px',
          fontSize: isMobile?'0.52rem':'clamp(0.45rem,1.1vw,0.6rem)', letterSpacing:'0.06em' }}>AGENCY</span>
      </div>
      <div style={{ display:'flex', gap: isMobile?'0.3rem':'clamp(0.35rem,1.2vw,0.6rem)', alignItems:'center' }}>
        <a href="#contacto"
          style={{ color:'rgba(255,255,255,0.5)', textDecoration:'none', fontWeight:500,
            fontSize: isMobile?'0.52rem':'clamp(0.5rem,1.3vw,0.7rem)', textTransform:'uppercase',
            letterSpacing:'0.06em', transition:'color 0.3s', whiteSpace:'nowrap' }}
          onMouseOver={e=>{ e.currentTarget.style.color='#fff'; }}
          onMouseOut={e=>{ e.currentTarget.style.color='rgba(255,255,255,0.5)'; }}>
          Contacto
        </a>
        <button className="btn-prm" onClick={onContact}
          style={{ fontSize: isMobile?'0.48rem':'clamp(0.42rem,1.1vw,0.58rem)',
            padding: isMobile?'0.28rem 0.55rem':'clamp(0.24rem,0.9vw,0.35rem) clamp(0.4rem,1.3vw,0.6rem)',
            borderRadius: isMobile?'12px':'clamp(10px,2.2vw,14px)', whiteSpace:'nowrap' }}>
          Hablemos
        </button>
      </div>
    </motion.nav>
  );
};

/* ────────── AnimatedText section ────────── */
function AnimatedText({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const startPoint = 0.40;
  const opacity = useTransform(scrollYProgress, [0, startPoint, 0.8, 1], [0, 1, 1, 0]);
  const scale   = useTransform(scrollYProgress, [0, startPoint, 0.8, 1], [0.85, 1, 1, 0.85]);
  const y       = useTransform(scrollYProgress, [0, startPoint, 0.8, 1], [80, 0, 0, 80]);
  return (
    <div ref={ref} style={{ minHeight:'200vh', position:'relative' }}>
      <motion.div style={{ opacity, scale, y, position:'sticky', top:0, left:0, right:0, bottom:0,
        display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ────────── Intro auto-scroll ────────── */
function useIntroScroll() {
  useEffect(() => {
    // Wait for scene to load, then animate scroll automatically
    const DELAY   = 1800; // ms before starting
    const TARGET  = window.innerHeight * 4.2; // scroll target = primer contenido
    const DURATION = 3200; // ms total animation

    let start: number | null = null;
    let raf: number;

    // Ease in-out cubic
    const ease = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / DURATION, 1);
      window.scrollTo(0, TARGET * ease(progress));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(animate);
    }, DELAY);

    // Cancel if user touches/scrolls manually
    const cancel = () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
    window.addEventListener('wheel',     cancel, { once: true, passive: true });
    window.addEventListener('touchstart', cancel, { once: true, passive: true });
    window.addEventListener('keydown',   cancel, { once: true });

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel',     cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown',   cancel);
    };
  }, []);
}

/* ────────── App ────────── */
export default function App() {
  const { scrollYProgress } = useScroll();
  const [scrollVal, setScrollVal] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const smooth = useSpring(scrollYProgress, { damping: 30, stiffness: 80 });
  useMotionValueEvent(smooth, 'change', (v) => setScrollVal(v));
  const showNav = scrollVal > 0.1;

  // Trigger auto intro animation on mount
  useIntroScroll();

  return (
    <>
      <Background3D scrollPercent={scrollVal} />
      <CustomCursor />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      {/* 2D Letters */}
      <motion.div className="hero-letters"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.15, 0.25, 0.40], [1, 1, 0.5, 0]),
          scale:   useTransform(scrollYProgress, [0, 0.30], [1, 0.85]),
          filter:  useTransform(scrollYProgress, [0.15, 0.30], ['blur(0px)', 'blur(12px)']),
          zIndex: 100, position: 'fixed', pointerEvents: 'none',
          display: scrollVal > 0.40 ? 'none' : 'flex',
        }}
      >
        <div className="letter-row">JA</div>
        <div className="letter-row">MD</div>
      </motion.div>

      <div className="content">
        <Navbar visible={showNav} onContact={() => setContactOpen(true)} />

        {/* Spacer */}
        <div style={{ height: '200vh' }} />

        {/* ── SLOGAN ── */}
        <AnimatedText>
          <div style={{ maxWidth:'900px', textAlign:'center', padding:'0 5%' }}>
            <span className="tag-ia">IA + Diseño + Automatización</span>
            <h2 style={{ fontSize:'clamp(3rem,8vw,6rem)', fontWeight:900, lineHeight:0.95, marginBottom:'1.5rem',
              background:'linear-gradient(180deg,#fff 40%,var(--silver))',
              WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent' }}>
              Redefinimos<br />lo normal.
            </h2>
            <p style={{ color:'var(--silver)', maxWidth:'500px', margin:'0 auto 2rem', fontSize:'1rem', lineHeight:1.6 }}>
              Transformamos la visión de tu negocio a través de inteligencia artificial de vanguardia,
              diseño inmersivo y automatizaciones que trabajan mientras duermes.
            </p>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
              <button className="btn-prm" onClick={() => { document.getElementById('servicios')?.scrollIntoView({ behavior:'smooth' }); }}>
                Ver servicios
              </button>
              <button className="btn-prm" onClick={() => setContactOpen(true)}
                style={{ background:'#fff', color:'#000', borderColor:'#fff' }}>Contactar</button>
            </div>
          </div>
        </AnimatedText>

        {/* ── SERVICIOS ── */}
        <AnimatedText>
          <div id="servicios" style={{ maxWidth:'1200px', width:'100%', padding:'0 4%' }}>
            <span className="tag-ia">Nuestros servicios</span>
            <h2 className="section-title">Soluciones que<br />escalan contigo</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'16px', marginTop:'2rem' }}>
              {[
                { icon:<FaGlobe />,     title:'Desarrollo Web',        desc:'Landing pages, webs corporativas y plataformas con diseño 3D inmersivo, transiciones cinematográficas y SEO.' },
                { icon:<FaRobot />,     title:'Agentes IA',            desc:'Asistentes inteligentes que cualifican leads, agendan citas y resuelven dudas 24/7.' },
                { icon:<FaMicrochip />, title:'Automatización',         desc:'Flujos de trabajo conectados con CRM, email marketing y analítica. Sin intervención humana.' },
                { icon:<FaBolt />,      title:'APIs & Integraciones',  desc:'Desarrollo de backends e integraciones a medida con NLP y visión artificial.' },
                { icon:<FaChartLine />, title:'Growth Marketing',       desc:'Estrategias de crecimiento basadas en datos y modelos predictivos.' },
                { icon:<FaLayerGroup />,title:'Infraestructura Cloud',  desc:'Despliegues escalables en AWS, GCP o tu servidor con CI/CD y monitorización.' },
                { icon:<FaRobot />,     title:'Chatbots a Medida',      desc:'Asistentes conversacionales personalizados con conexión a tus sistemas internos.' },
                { icon:<FaGlobe />,     title:'E-commerce',             desc:'Tiendas online con integración de pagos, inventario y gestión de pedidos.' },
              ].map((s, i) => (
                <div key={i} className="service-card">
                  <div style={{ fontSize:'1.6rem', color:'var(--accent-glow)', marginBottom:'16px' }}>{s.icon}</div>
                  <h3 style={{ fontSize:'1.15rem', marginBottom:'8px', color:'#fff' }}>{s.title}</h3>
                  <p style={{ color:'var(--silver)', fontSize:'0.85rem', lineHeight:1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
              <button className="btn-prm" onClick={() => setContactOpen(true)}>
                Solicitar presupuesto <FaArrowRight style={{ marginLeft:'8px' }} />
              </button>
            </div>
          </div>
        </AnimatedText>

        {/* ── PROYECTOS ── */}
        <AnimatedText>
          <div id="proyectos" style={{ maxWidth:'1300px', width:'100%', padding:'0 4%' }}>
            <span className="tag-ia">Portfolio</span>
            <h2 className="section-title">Trabajo<br />reciente</h2>
            <div className="projects-grid" style={{ marginTop:'1rem' }}>
              {[
                { title:'NexusAI',    desc:'Plataforma SaaS',         img:'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' },
                { title:'Immerse 3D', desc:'Experiencia Inmersiva',    img:'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800' },
                { title:'DataVault',  desc:'Dashboard IA',             img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
                { title:'VoiceFlow',  desc:'Agente Conversacional',    img:'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800' },
              ].map((p, i) => (
                <div key={i} className="project-card" style={{ cursor:'pointer' }}
                  onClick={() => setContactOpen(true)}>
                  <img src={p.img} alt={p.title} loading="lazy" />
                  <div className="project-info">
                    <h3 style={{ fontSize:'2.2rem', letterSpacing:'-0.03em' }}>{p.title}</h3>
                    <p style={{ color:'var(--accent-glow)', fontWeight:700, fontSize:'0.7rem', letterSpacing:'0.2em', textTransform:'uppercase' }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedText>

        {/* ── PRICING ── */}
        <AnimatedText>
          <div style={{ maxWidth:'1100px', width:'100%', padding:'0 4%' }}>
            <span className="tag-ia">Planes</span>
            <h2 className="section-title">Inversión<br />transparente</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'20px', marginTop:'2rem' }}>
              {[
                {
                  name:'Starter', price:'1.200€', desc:'Ideal para validar tu idea o lanzar rápido.',
                  features:['Landing page 3D','Diseño premium','SEO básico','Entrega en 7 días','1 mes de soporte'],
                  cta:'Empezar', highlight:false,
                },
                {
                  name:'Growth', price:'3.500€', desc:'El más popular. Cubre web + automatización + IA.',
                  features:['Web completa + CMS','Agente IA integrado','Automatizaciones n8n','Analytics avanzado','3 meses de soporte'],
                  cta:'Elegir Growth', highlight:true,
                },
                {
                  name:'Enterprise', price:'Personalizado', desc:'Para empresas que quieren escalar sin límites.',
                  features:['Infraestructura cloud','Pipelines de datos','Equipo dedicado','SLA garantizado','Soporte 24/7'],
                  cta:'Contactar', highlight:false,
                },
              ].map((plan, i) => (
                <div key={i} className="service-card" style={{
                  border: plan.highlight ? '1px solid rgba(99,102,241,0.5)' : undefined,
                  background: plan.highlight ? 'rgba(99,102,241,0.08)' : undefined,
                  position:'relative', overflow:'visible',
                }}>
                  {plan.highlight && (
                    <div style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)',
                      background:'var(--accent-primary)', color:'#fff', fontSize:'0.6rem', fontWeight:800,
                      letterSpacing:'0.15em', textTransform:'uppercase', padding:'4px 12px', borderRadius:'999px' }}>
                      Más popular
                    </div>
                  )}
                  <span className="tag-ia">{plan.name}</span>
                  <div style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:900, marginBottom:'0.5rem' }}>{plan.price}</div>
                  <p style={{ color:'var(--silver)', fontSize:'0.85rem', marginBottom:'1.2rem', lineHeight:1.5 }}>{plan.desc}</p>
                  <ul style={{ listStyle:'none', marginBottom:'1.5rem', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'0.85rem', color:'rgba(255,255,255,0.7)' }}>
                        <FaCheck style={{ color:'var(--accent-glow)', flexShrink:0 }} />{f}
                      </li>
                    ))}
                  </ul>
                  <button className="btn-prm" onClick={() => setContactOpen(true)} style={{ width:'100%',
                    background: plan.highlight ? 'var(--accent-primary)' : undefined,
                    borderColor: plan.highlight ? 'var(--accent-primary)' : undefined }}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </AnimatedText>

        {/* ── CTA Final ── */}
        <AnimatedText>
          <div id="contacto" style={{ textAlign:'center', maxWidth:'600px', padding:'0 5%' }}>
            <span className="tag-ia">¿Tienes un proyecto en mente?</span>
            <h2 className="section-title" style={{ marginBottom:'1rem' }}>Hagámoslo<br />realidad.</h2>
            <button className="btn-prm" onClick={() => setContactOpen(true)}
              style={{ fontSize:'0.9rem', padding:'18px 42px' }}>
              Iniciar proyecto <FaArrowRight style={{ marginLeft:'10px' }} />
            </button>
          </div>
        </AnimatedText>

        {/* ── Footer ── */}
        <footer style={{ padding:'40px 6%', borderTop:'1px solid rgba(255,255,255,0.04)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem', textAlign:'center' }}>
          <div style={{ fontWeight:900, fontSize:'1rem' }}>
            JAMD<span style={{ color:'var(--accent-glow)', fontWeight:400, marginLeft:'6px', fontSize:'0.6rem', letterSpacing:'0.15em' }}>AGENCY</span>
          </div>
          <div style={{ display:'flex', gap:'20px' }}>
            {[
              { icon:<FaWhatsapp />,  href:'https://wa.me/34600000000',        label:'WhatsApp' },
              { icon:<FaInstagram />, href:'https://instagram.com/jamdagency', label:'Instagram' },
              { icon:<FaLinkedin />,  href:'https://linkedin.com/company/jamdagency', label:'LinkedIn' },
              { icon:<FaXTwitter />,  href:'https://x.com/jamdagency',         label:'X' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                aria-label={s.label}
                style={{ color:'rgba(255,255,255,0.3)', fontSize:'1.1rem', transition:'color 0.2s' }}
                onMouseOver={e=>(e.currentTarget.style.color='#fff')}
                onMouseOut={e=>(e.currentTarget.style.color='rgba(255,255,255,0.3)')}>
                {s.icon}
              </a>
            ))}
          </div>
          <p style={{ color:'rgba(255,255,255,0.15)', fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.2em' }}>
            © 2026 JAMD AI AGENCY — Redefiniendo lo normal.
          </p>
        </footer>
      </div>
    </>
  );
}
