import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
  FaRobot, FaArrowRight, FaGlobe, FaMicrochip,
  FaBolt, FaChartLine, FaLayerGroup, FaEnvelope,
  FaWhatsapp, FaInstagram, FaLinkedin, FaXTwitter,
  FaCheck, FaStar, FaPlus, FaMinus, FaRocket,
  FaUsers, FaShop, FaBriefcase, FaHospital, FaCode,
} from 'react-icons/fa6';

import Background3D from './components/Background3D';
import './index.css';

/* ─── INPUT STYLE ─── */
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

/* ─── CONTACT MODAL ─── */
function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Conecta aquí tu backend / Formspree / EmailJS
    setSent(true);
    setTimeout(() => { setSent(false); onClose(); setForm({ name: '', email: '', message: '' }); }, 2500);
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.75)',
        backdropFilter:'blur(12px)', display:'flex', alignItems:'center',
        justifyContent:'center', padding:'1rem' }}
    >
      <motion.div
        initial={{ scale:0.9, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }}
        transition={{ type:'spring', damping:25, stiffness:300 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background:'rgba(12,12,14,0.95)', border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'20px', padding:'clamp(1.5rem,4vw,2.5rem)', width:'100%', maxWidth:'500px',
          boxShadow:'0 40px 80px rgba(0,0,0,0.6)' }}
      >
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <div>
            <span className="tag-ia">Contacto directo</span>
            <h3 style={{ fontSize:'clamp(1.2rem,3vw,1.6rem)', fontWeight:900, lineHeight:1.1 }}>
              Hablemos de tu<br />proyecto
            </h3>
          </div>
          <button onClick={onClose} style={{ color:'rgba(255,255,255,0.4)', fontSize:'1.4rem',
            background:'none', border:'none', cursor:'pointer', lineHeight:1 }}>✕</button>
        </div>

        {sent ? (
          <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
            style={{ textAlign:'center', padding:'2rem 0' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✓</div>
            <p style={{ color:'var(--accent-glow)', fontWeight:700 }}>¡Mensaje enviado!</p>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.85rem', marginTop:'0.5rem' }}>
              Te contactamos en menos de 24h.
            </p>
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
            { icon:<FaWhatsapp />, href:'https://wa.me/34600000000', label:'WhatsApp' },
            { icon:<FaInstagram />, href:'https://instagram.com/jamdagency', label:'Instagram' },
            { icon:<FaLinkedin />, href:'https://linkedin.com/company/jamdagency', label:'LinkedIn' },
            { icon:<FaXTwitter />, href:'https://x.com/jamdagency', label:'X' },
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

/* ─── NAVBAR ─── */
const Navbar = ({ visible, onContact }: { visible: boolean; onContact: () => void }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <motion.nav
      initial={{ y:-100, opacity:0 }}
      animate={visible ? { y:0, opacity:1 } : { y:-100, opacity:0 }}
      transition={{ duration:0.6, ease:[0.23,1,0.32,1] }}
      style={{
        position:'fixed', top: isMobile ? '0.6rem' : '1.5rem',
        left: isMobile ? '0.5rem' : '50%', right: isMobile ? '0.5rem' : 'auto',
        transform: isMobile ? 'none' : 'translateX(-50%)',
        zIndex:100, display:'flex', alignItems:'center', justifyContent:'center',
        gap: isMobile ? '0.3rem' : 'clamp(0.4rem,1.4vw,0.8rem)',
        padding: isMobile ? '0.5rem 0.7rem' : 'clamp(0.4rem,1.4vw,0.7rem) clamp(0.55rem,1.8vw,1rem)',
        borderRadius:'50px', background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)',
        border:'1px solid rgba(255,255,255,0.08)',
        boxShadow:'0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        width: isMobile ? 'calc(100vw - 1rem)' : 'fit-content',
      }}
    >
      <div style={{ display:'flex', gap: isMobile?'0.3rem':'clamp(0.35rem,1.2vw,0.6rem)', alignItems:'center' }}>
        {['Servicios','Proyectos','Proceso','Precios'].map(item => (
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
      <div style={{ fontSize: isMobile?'0.78rem':'clamp(0.72rem,1.6vw,0.95rem)', fontWeight:900,
        letterSpacing:'-0.03em', color:'#fff',
        padding: isMobile?'0.2rem 0.5rem':'clamp(0.18rem,0.8vw,0.28rem) clamp(0.4rem,1.2vw,0.6rem)',
        borderRadius: isMobile?'12px':'clamp(10px,2.2vw,16px)',
        background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
        boxShadow:'inset 0 1px 0 rgba(255,255,255,0.1)', whiteSpace:'nowrap', flexShrink:0 }}>
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

/* ─── ANIMATED TEXT SECTION ─── */
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

/* ─── INTRO AUTO-SCROLL ─── */
function useIntroScroll() {
  useEffect(() => {
    // Empieza a los 800ms (antes era 1800ms)
    const DELAY    = 800;
    // Target aumentado para llegar al centro de la sección "Redefinimos" (1ª AnimatedText)
    // El spacer ocupa 200vh, cada AnimatedText ocupa 200vh; queremos el centro del primero → ~300vh
    const TARGET   = window.innerHeight * 3.2;
    const DURATION = 3000;
    let start: number | null = null;
    let raf: number;
    const ease = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / DURATION, 1);
      window.scrollTo(0, TARGET * ease(progress));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    const timeout = setTimeout(() => { raf = requestAnimationFrame(animate); }, DELAY);
    const cancel = () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
    window.addEventListener('wheel',      cancel, { once:true, passive:true });
    window.addEventListener('touchstart', cancel, { once:true, passive:true });
    window.addEventListener('keydown',    cancel, { once:true });
    return () => {
      clearTimeout(timeout); cancelAnimationFrame(raf);
      window.removeEventListener('wheel',      cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown',    cancel);
    };
  }, []);
}

/* ─── FAQ ACCORDION ITEM ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'1.2rem 0' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
          background:'none', border:'none', cursor:'pointer', color:'#fff',
          fontSize:'clamp(0.9rem,1.8vw,1.05rem)', fontWeight:600, textAlign:'left', gap:'1rem' }}>
        <span>{q}</span>
        <span style={{ color:'var(--accent-glow)', flexShrink:0, fontSize:'0.9rem', transition:'transform 0.3s',
          transform: open ? 'rotate(0deg)' : 'rotate(0deg)' }}>
          {open ? <FaMinus /> : <FaPlus />}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration:0.35, ease:[0.23,1,0.32,1] }}
        style={{ overflow:'hidden' }}>
        <p style={{ color:'var(--silver)', fontSize:'0.9rem', lineHeight:1.7, paddingTop:'0.8rem', maxWidth:'680px' }}>
          {a}
        </p>
      </motion.div>
    </div>
  );
}

/* ─── STAT CARD ─── */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign:'center', padding:'1.5rem', borderRadius:'16px',
      background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color:'#fff',
        background:'linear-gradient(135deg,#fff,var(--accent-glow))',
        WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>
        {value}
      </div>
      <div style={{ color:'var(--silver)', fontSize:'0.8rem', marginTop:'0.3rem', letterSpacing:'0.05em' }}>
        {label}
      </div>
    </div>
  );
}

/* ─── APP ─── */
export default function App() {
  const { scrollYProgress } = useScroll();
  const [scrollVal, setScrollVal] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const smooth = useSpring(scrollYProgress, { damping:30, stiffness:80 });
  useMotionValueEvent(smooth, 'change', (v) => setScrollVal(v));
  const showNav = scrollVal > 0.1;

  useIntroScroll();

  return (
    <>
      <Background3D scrollPercent={scrollVal} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      {/* 2D Letters hero */}
      <motion.div className="hero-letters"
        style={{
          opacity: useTransform(scrollYProgress, [0,0.15,0.25,0.40],[1,1,0.5,0]),
          scale:   useTransform(scrollYProgress, [0,0.30],[1,0.85]),
          filter:  useTransform(scrollYProgress, [0.15,0.30],['blur(0px)','blur(12px)']),
          zIndex:100, position:'fixed', pointerEvents:'none',
          display: scrollVal > 0.40 ? 'none' : 'flex',
        }}
      >
        <div className="letter-row">JA</div>
        <div className="letter-row">MD</div>
      </motion.div>

      <div className="content">
        <Navbar visible={showNav} onContact={() => setContactOpen(true)} />

        {/* Spacer */}
        <div style={{ height:'200vh' }} />

        {/* ══ 1. SLOGAN ══ */}
        <AnimatedText>
          <div style={{ maxWidth:'900px', textAlign:'center', padding:'0 5%' }}>
            <span className="tag-ia">IA + Diseño + Automatización</span>
            <h2 style={{ fontSize:'clamp(3rem,8vw,6rem)', fontWeight:900, lineHeight:0.95,
              marginBottom:'1.5rem',
              background:'linear-gradient(180deg,#fff 40%,var(--silver))',
              WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent' }}>
              Redefinimos<br />lo normal.
            </h2>
            <p style={{ color:'var(--silver)', maxWidth:'520px', margin:'0 auto 2rem',
              fontSize:'1rem', lineHeight:1.6 }}>
              Transformamos la visión de tu negocio a través de inteligencia artificial de vanguardia,
              diseño inmersivo y automatizaciones que trabajan mientras duermes.
            </p>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
              <button className="btn-prm"
                onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior:'smooth' })}>
                Ver servicios
              </button>
              <button className="btn-prm"
                onClick={() => setContactOpen(true)}
                style={{ background:'#fff', color:'#000', borderColor:'#fff' }}>
                Contactar
              </button>
            </div>
          </div>
        </AnimatedText>

        {/* ══ 2. TRUST STRIP ══ */}
        <AnimatedText>
          <div style={{ maxWidth:'1100px', width:'100%', padding:'0 4%' }}>
            <span className="tag-ia">Por qué elegirnos</span>
            <h2 className="section-title">Resultados<br />que importan</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',
              gap:'16px', marginTop:'2rem' }}>
              <StatCard value="+60" label="proyectos entregados" />
              <StatCard value="7d" label="entrega media de landing" />
              <StatCard value="98%" label="satisfacción de clientes" />
              <StatCard value="24h" label="respuesta garantizada" />
              <StatCard value="3x" label="leads de media conseguidos" />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',
              gap:'12px', marginTop:'1.5rem' }}>
              {[
                '✓ Sin contratos anuales',
                '✓ Diseño 100% a medida',
                '✓ IA integrada de serie',
                '✓ Soporte post-lanzamiento',
                '✓ Escalable en cualquier momento',
                '✓ Código limpio y tuyo',
              ].map(t => (
                <div key={t} style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.6)',
                  padding:'0.6rem 1rem', borderRadius:'8px',
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)' }}>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </AnimatedText>

        {/* ══ 3. A QUIÉN AYUDAMOS ══ */}
        <AnimatedText>
          <div style={{ maxWidth:'1100px', width:'100%', padding:'0 4%' }}>
            <span className="tag-ia">A quién ayudamos</span>
            <h2 className="section-title">Hecho para<br />negocios reales</h2>
            <p style={{ color:'var(--silver)', maxWidth:'540px', margin:'0.5rem 0 2rem',
              fontSize:'0.95rem', lineHeight:1.7 }}>
              Trabajamos con startups que quieren crecer rápido y pymes que quieren modernizarse
              sin complicaciones. Si necesitas resultados, somos tu equipo.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'14px' }}>
              {[
                { icon:<FaRocket />,   title:'Startups',       desc:'Lanzamos tu MVP en tiempo récord con IA, diseño y backend listos.' },
                { icon:<FaShop />,     title:'Comercios',      desc:'Tiendas online con pagos, inventario y marketing automatizado.' },
                { icon:<FaBriefcase />,title:'Consultoras',    desc:'Webs de captación con formularios, CRM y seguimiento automático.' },
                { icon:<FaHospital />, title:'Clínicas',       desc:'Agenda online, recordatorios por WhatsApp y ficha de paciente digital.' },
                { icon:<FaUsers />,    title:'Agencias',       desc:'Infraestructura white-label para entregar más proyectos en menos tiempo.' },
                { icon:<FaCode />,     title:'SaaS & Tech',    desc:'Dashboards, APIs, pipelines de datos y despliegues cloud sin fricciones.' },
              ].map((s, i) => (
                <div key={i} className="service-card">
                  <div style={{ fontSize:'1.4rem', color:'var(--accent-glow)', marginBottom:'12px' }}>{s.icon}</div>
                  <h3 style={{ fontSize:'1rem', marginBottom:'6px', color:'#fff' }}>{s.title}</h3>
                  <p style={{ color:'var(--silver)', fontSize:'0.82rem', lineHeight:1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedText>

        {/* ══ 4. SERVICIOS ══ */}
        <AnimatedText>
          <div id="servicios" style={{ maxWidth:'1200px', width:'100%', padding:'0 4%' }}>
            <span className="tag-ia">Nuestros servicios</span>
            <h2 className="section-title">Soluciones que<br />escalan contigo</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',
              gap:'16px', marginTop:'2rem' }}>
              {[
                { icon:<FaGlobe />,     title:'Desarrollo Web',       desc:'Landing pages, webs corporativas y plataformas con diseño 3D inmersivo, transiciones cinematográficas y SEO.' },
                { icon:<FaRobot />,     title:'Agentes IA',           desc:'Asistentes que cualifican leads, agendan citas y resuelven dudas 24/7 sin intervención humana.' },
                { icon:<FaMicrochip />, title:'Automatización',        desc:'Flujos de trabajo conectados con CRM, email marketing y analítica. Todo en piloto automático.' },
                { icon:<FaBolt />,      title:'APIs & Integraciones', desc:'Backends a medida con NLP, visión artificial y conexión a cualquier plataforma existente.' },
                { icon:<FaChartLine />, title:'Growth Marketing',      desc:'Estrategias de crecimiento basadas en datos reales y modelos predictivos de comportamiento.' },
                { icon:<FaLayerGroup />,title:'Infraestructura Cloud', desc:'Despliegues escalables en AWS, GCP o servidor propio con CI/CD, backups y monitorización.' },
                { icon:<FaRobot />,     title:'Chatbots a Medida',    desc:'Asistentes conversacionales personalizados conectados a tus sistemas internos.' },
                { icon:<FaShop />,      title:'E-commerce',           desc:'Tiendas online con pagos, inventario, pedidos y automatización de atención al cliente.' },
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

        {/* ══ 5. PROCESO ══ */}
        <AnimatedText>
          <div id="proceso" style={{ maxWidth:'1000px', width:'100%', padding:'0 4%' }}>
            <span className="tag-ia">Cómo trabajamos</span>
            <h2 className="section-title">De la idea al<br />lanzamiento</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
              gap:'16px', marginTop:'2rem' }}>
              {[
                { step:'01', title:'Descubrimiento',   desc:'Analizamos tu negocio, objetivos y competencia en una llamada de 45 minutos. Cero burocracia.' },
                { step:'02', title:'Diseño',           desc:'Prototipo visual en 48h. Iteras hasta que sea exactamente lo que quieres antes de tocar código.' },
                { step:'03', title:'Desarrollo & IA',  desc:'Construimos con las mejores tecnologías e integramos automatizaciones e inteligencia artificial.' },
                { step:'04', title:'Lanzamiento',      desc:'Desplegamos, optimizamos velocidad y te entregamos todo con formación incluida.' },
              ].map((s, i) => (
                <div key={i} style={{ padding:'1.5rem', borderRadius:'16px',
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
                  position:'relative', overflow:'hidden' }}>
                  <div style={{ fontSize:'3.5rem', fontWeight:900, color:'rgba(255,255,255,0.04)',
                    position:'absolute', top:'-0.3rem', right:'0.8rem', lineHeight:1, userSelect:'none' }}>
                    {s.step}
                  </div>
                  <span className="tag-ia" style={{ marginBottom:'0.8rem', display:'inline-block' }}>Paso {s.step}</span>
                  <h3 style={{ fontSize:'1.1rem', marginBottom:'0.5rem', color:'#fff' }}>{s.title}</h3>
                  <p style={{ color:'var(--silver)', fontSize:'0.84rem', lineHeight:1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:'2rem' }}>
              <button className="btn-prm" onClick={() => setContactOpen(true)}>
                Empezar ahora <FaArrowRight style={{ marginLeft:'8px' }} />
              </button>
            </div>
          </div>
        </AnimatedText>

        {/* ══ 6. CASO DESTACADO ══ */}
        <AnimatedText>
          <div style={{ maxWidth:'1000px', width:'100%', padding:'0 4%' }}>
            <span className="tag-ia">Caso de éxito</span>
            <h2 className="section-title">De 0 a 800 leads<br />en 30 días</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px', marginTop:'2rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {/* Descripción del caso */}
              <div style={{ padding:'2rem', borderRadius:'20px', background:'rgba(255,255,255,0.03)',
                border:'1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ color:'var(--accent-glow)', fontSize:'0.75rem', fontWeight:700,
                  textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:'0.8rem' }}>
                  NexusAI — Plataforma SaaS
                </p>
                <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'1rem', lineHeight:1.7, marginBottom:'1.2rem' }}>
                  NexusAI llegó a nosotros con un producto sin web y sin tracción. En 3 semanas diseñamos,
                  desarrollamos y lanzamos su plataforma con agente IA integrado y automatización de onboarding.
                </p>
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'1rem',
                  display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                  {[
                    'Landing con tasa de conversión del 12%',
                    'Agente IA que cualifica leads en tiempo real',
                    'Email de bienvenida + seguimiento automático',
                    'Dashboard de analítica en tiempo real',
                  ].map(f => (
                    <div key={f} style={{ display:'flex', gap:'8px', alignItems:'flex-start',
                      fontSize:'0.84rem', color:'rgba(255,255,255,0.65)' }}>
                      <FaCheck style={{ color:'var(--accent-glow)', flexShrink:0, marginTop:'3px' }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              {/* Métricas */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', alignContent:'start' }}>
                {[
                  { value:'800+', label:'leads en 30 días' },
                  { value:'12%',  label:'tasa de conversión' },
                  { value:'3 sem', label:'de 0 a live' },
                  { value:'4.9★',  label:'valoración del cliente' },
                ].map((m, i) => (
                  <div key={i} style={{ padding:'1.5rem', borderRadius:'16px', textAlign:'center',
                    background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:900,
                      background:'linear-gradient(135deg,#fff,var(--accent-glow))',
                      WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                      {m.value}
                    </div>
                    <div style={{ color:'var(--silver)', fontSize:'0.75rem', marginTop:'0.2rem' }}>{m.label}</div>
                  </div>
                ))}
                <div style={{ gridColumn:'1/-1', padding:'1.2rem', borderRadius:'16px',
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
                  fontStyle:'italic', color:'rgba(255,255,255,0.6)', fontSize:'0.87rem', lineHeight:1.6 }}>
                  "JAMD no es una agencia más. Entienden el negocio antes de escribir una línea de código.
                  El ROI fue visible desde el primer mes."
                  <div style={{ marginTop:'0.8rem', color:'rgba(255,255,255,0.35)', fontSize:'0.75rem', fontStyle:'normal' }}>
                    — Carlos M., CEO de NexusAI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedText>

        {/* ══ 7. PROYECTOS ══ */}
        <AnimatedText>
          <div id="proyectos" style={{ maxWidth:'1300px', width:'100%', padding:'0 4%' }}>
            <span className="tag-ia">Portfolio</span>
            <h2 className="section-title">Trabajo<br />reciente</h2>
            <div className="projects-grid" style={{ marginTop:'1rem' }}>
              {[
                { title:'NexusAI',    desc:'Plataforma SaaS',        img:'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' },
                { title:'Immerse 3D', desc:'Experiencia Inmersiva',   img:'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800' },
                { title:'DataVault',  desc:'Dashboard IA',            img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' },
                { title:'VoiceFlow',  desc:'Agente Conversacional',   img:'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=800' },
              ].map((p, i) => (
                <div key={i} className="project-card" style={{ cursor:'pointer' }}
                  onClick={() => setContactOpen(true)}>
                  <img src={p.img} alt={p.title} loading="lazy" />
                  <div className="project-info">
                    <h3 style={{ fontSize:'2.2rem', letterSpacing:'-0.03em' }}>{p.title}</h3>
                    <p style={{ color:'var(--accent-glow)', fontWeight:700, fontSize:'0.7rem',
                      letterSpacing:'0.2em', textTransform:'uppercase' }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedText>

        {/* ══ 8. TESTIMONIOS ══ */}
        <AnimatedText>
          <div style={{ maxWidth:'1100px', width:'100%', padding:'0 4%' }}>
            <span className="tag-ia">Lo que dicen nuestros clientes</span>
            <h2 className="section-title">Resultados que<br />hablan por sí solos</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',
              gap:'16px', marginTop:'2rem' }}>
              {[
                { name:'Laura G.', role:'Fundadora, MediClínic', stars:5,
                  text:'En 2 semanas teníamos web nueva, agenda online y recordatorios automáticos por WhatsApp. Nuestras cancelaciones bajaron un 40%.' },
                { name:'Marcos T.', role:'CEO, TechFlow SaaS', stars:5,
                  text:'Lanzamos en tiempo récord y el agente IA ha gestionado más de 2.000 consultas sin intervención humana. Alucinante.' },
                { name:'Ana R.', role:'Directora, Estudio AR', stars:5,
                  text:'El diseño que hicieron es exactamente lo que tenía en la cabeza, y encima con animaciones 3D que dejaron a todos boquiabiertos.' },
                { name:'Pedro S.', role:'Ecommerce Manager', stars:5,
                  text:'Migramos nuestra tienda, integramos el CRM y automatizamos emails de seguimiento. Las ventas subieron un 35% en el primer mes.' },
              ].map((t, i) => (
                <div key={i} style={{ padding:'1.5rem', borderRadius:'16px',
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
                  display:'flex', flexDirection:'column', gap:'0.8rem' }}>
                  <div style={{ display:'flex', gap:'2px' }}>
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <FaStar key={j} style={{ color:'var(--accent-glow)', fontSize:'0.75rem' }} />
                    ))}
                  </div>
                  <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.87rem', lineHeight:1.7,
                    fontStyle:'italic', flex:1 }}>
                    "{t.text}"
                  </p>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'0.85rem', color:'#fff' }}>{t.name}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--silver)' }}>{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedText>

        {/* ══ 9. PRICING ══ */}
        <AnimatedText>
          <div id="precios" style={{ maxWidth:'1100px', width:'100%', padding:'0 4%' }}>
            <span className="tag-ia">Planes</span>
            <h2 className="section-title">Inversión<br />transparente</h2>
            <p style={{ color:'var(--silver)', maxWidth:'500px', margin:'0.5rem 0 2rem',
              fontSize:'0.9rem', lineHeight:1.7 }}>
              Sin sorpresas, sin letra pequeña. Cada plan incluye diseño, desarrollo, entrega y soporte.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'20px' }}>
              {[
                {
                  name:'Starter', price:'1.200€', badge:null,
                  tagline:'Lanza rápido. Sin complicaciones.',
                  features:[
                    'Landing page 3D a medida',
                    'Diseño premium responsive',
                    'SEO técnico básico',
                    'Formulario de contacto',
                    'Entrega en 7 días',
                    '1 mes de soporte',
                  ],
                  outcome:'Ideal para validar tu idea o captar tus primeros clientes online.',
                  cta:'Empezar', highlight:false,
                },
                {
                  name:'Growth', price:'3.500€', badge:'Más popular',
                  tagline:'Crece con IA y automatización.',
                  features:[
                    'Web completa + CMS',
                    'Agente IA integrado',
                    'Automatizaciones n8n',
                    'Analytics avanzado',
                    'Integración CRM',
                    '3 meses de soporte',
                  ],
                  outcome:'Para negocios que quieren más leads, menos trabajo manual y mejor conversión.',
                  cta:'Elegir Growth', highlight:true,
                },
                {
                  name:'Enterprise', price:'A medida', badge:null,
                  tagline:'Escala sin límites con tu equipo.',
                  features:[
                    'Infraestructura cloud',
                    'Pipelines de datos',
                    'Equipo dedicado',
                    'SLA garantizado',
                    'Integraciones ilimitadas',
                    'Soporte 24/7',
                  ],
                  outcome:'Para empresas en crecimiento que necesitan un partner técnico de confianza.',
                  cta:'Contactar', highlight:false,
                },
              ].map((plan, i) => (
                <div key={i} className="service-card" style={{
                  border: plan.highlight ? '1px solid rgba(99,102,241,0.5)' : undefined,
                  background: plan.highlight ? 'rgba(99,102,241,0.08)' : undefined,
                  position:'relative', overflow:'visible',
                }}>
                  {plan.badge && (
                    <div style={{ position:'absolute', top:'-12px', left:'50%', transform:'translateX(-50%)',
                      background:'var(--accent-primary)', color:'#fff', fontSize:'0.6rem', fontWeight:800,
                      letterSpacing:'0.15em', textTransform:'uppercase', padding:'4px 12px',
                      borderRadius:'999px' }}>
                      {plan.badge}
                    </div>
                  )}
                  <span className="tag-ia">{plan.name}</span>
                  <div style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:900, marginBottom:'0.25rem' }}>
                    {plan.price}
                  </div>
                  <p style={{ color:'var(--accent-glow)', fontSize:'0.8rem', fontWeight:600,
                    marginBottom:'1rem' }}>{plan.tagline}</p>
                  <ul style={{ listStyle:'none', marginBottom:'1rem', display:'flex',
                    flexDirection:'column', gap:'0.45rem' }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display:'flex', alignItems:'center', gap:'8px',
                        fontSize:'0.84rem', color:'rgba(255,255,255,0.7)' }}>
                        <FaCheck style={{ color:'var(--accent-glow)', flexShrink:0 }} />{f}
                      </li>
                    ))}
                  </ul>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem', lineHeight:1.5,
                    marginBottom:'1.2rem', fontStyle:'italic' }}>{plan.outcome}</p>
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

        {/* ══ 10. FAQ ══ */}
        <AnimatedText>
          <div style={{ maxWidth:'760px', width:'100%', padding:'0 4%' }}>
            <span className="tag-ia">FAQ</span>
            <h2 className="section-title">Preguntas<br />frecuentes</h2>
            <div style={{ marginTop:'2rem' }}>
              {[
                {
                  q:'¿Cuánto tiempo tardáis en entregar un proyecto?',
                  a:'Depende del alcance. Una landing page la entregamos en 7 días laborables. Un proyecto completo con IA y automatizaciones suele estar listo en 3-4 semanas. Siempre pactamos una fecha de entrega realista antes de empezar.',
                },
                {
                  q:'¿Puedo pedir cambios después de la entrega?',
                  a:'Sí. Todos los planes incluyen al menos 1 mes de soporte con revisiones. Durante el proceso de diseño tienes rondas ilimitadas de feedback antes de pasar a desarrollo.',
                },
                {
                  q:'¿Qué pasa si ya tengo web o herramientas instaladas?',
                  a:'Podemos migrar, mejorar o integrar lo que ya tienes. Hacemos una auditoría previa gratuita para ver qué se puede reutilizar y qué conviene cambiar.',
                },
                {
                  q:'¿Los agentes IA necesitan mantenimiento?',
                  a:'Los primeros 3 meses los monitorizamos nosotros. Después te ofrecemos un plan de mantenimiento opcional o te formamos para gestionarlos tú mismo. No dependes de nosotros para siempre.',
                },
                {
                  q:'¿Trabajáis con empresas fuera de España?',
                  a:'Sí, trabajamos completamente en remoto y tenemos clientes en España, Latinoamérica y Europa. El idioma no es barrera.',
                },
                {
                  q:'¿Está incluido el hosting?',
                  a:'No lo incluimos en el precio para que el proyecto sea tuyo desde el primer día. Te ayudamos a configurar el hosting que más te convenga (Vercel, Coolify, Hetzner, etc.) y te dejamos todo funcionando.',
                },
                {
                  q:'¿Hacéis proyectos pequeños o solo grandes empresas?',
                  a:'Trabajamos con negocios de todos los tamaños. El plan Starter está diseñado específicamente para negocios que empiezan o quieren probar sin grandes inversiones.',
                },
              ].map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </AnimatedText>

        {/* ══ 11. CTA FINAL ══ */}
        <AnimatedText>
          <div id="contacto" style={{ textAlign:'center', maxWidth:'680px', padding:'0 5%' }}>
            <span className="tag-ia">¿Listo para crecer?</span>
            <h2 className="section-title" style={{ marginBottom:'1rem' }}>
              Tu próximo proyecto<br />empieza hoy.
            </h2>
            <p style={{ color:'var(--silver)', fontSize:'0.95rem', lineHeight:1.7, marginBottom:'2rem', maxWidth:'480px', margin:'0 auto 2rem' }}>
              Cuéntanos tu idea. En menos de 24 horas tienes una propuesta real, sin compromiso y sin costes ocultos.
            </p>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
              <button className="btn-prm" onClick={() => setContactOpen(true)}
                style={{ fontSize:'0.9rem', padding:'18px 42px' }}>
                Iniciar proyecto <FaArrowRight style={{ marginLeft:'10px' }} />
              </button>
              <a href="https://wa.me/34600000000" target="_blank" rel="noopener noreferrer"
                className="btn-prm"
                style={{ fontSize:'0.9rem', padding:'18px 42px', display:'flex', alignItems:'center',
                  gap:'8px', textDecoration:'none',
                  background:'rgba(37,211,102,0.1)', borderColor:'rgba(37,211,102,0.4)',
                  color:'#25D366' }}>
                <FaWhatsapp /> WhatsApp directo
              </a>
            </div>
            {/* Respuesta garantizada */}
            <div style={{ marginTop:'2rem', display:'flex', gap:'24px', justifyContent:'center', flexWrap:'wrap' }}>
              {[
                '✓ Respuesta en menos de 24h',
                '✓ Primera consulta gratuita',
                '✓ Sin permanencia',
              ].map(t => (
                <span key={t} style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.4)', letterSpacing:'0.03em' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </AnimatedText>

        {/* ══ FOOTER ══ */}
        <footer style={{ padding:'60px 6% 40px', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto', display:'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'2rem', marginBottom:'3rem' }}>
            {/* Brand */}
            <div>
              <div style={{ fontWeight:900, fontSize:'1.2rem', marginBottom:'0.6rem' }}>
                JAMD<span style={{ color:'var(--accent-glow)', fontWeight:400, marginLeft:'6px',
                  fontSize:'0.65rem', letterSpacing:'0.15em' }}>AGENCY</span>
              </div>
              <p style={{ color:'var(--silver)', fontSize:'0.82rem', lineHeight:1.7, maxWidth:'220px' }}>
                Agencia de IA, diseño y automatización para startups y pymes que quieren crecer de verdad.
              </p>
              <div style={{ display:'flex', gap:'14px', marginTop:'1rem' }}>
                {[
                  { icon:<FaWhatsapp />,  href:'https://wa.me/34600000000',              label:'WhatsApp' },
                  { icon:<FaInstagram />, href:'https://instagram.com/jamdagency',        label:'Instagram' },
                  { icon:<FaLinkedin />,  href:'https://linkedin.com/company/jamdagency', label:'LinkedIn' },
                  { icon:<FaXTwitter />,  href:'https://x.com/jamdagency',                label:'X' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{ color:'rgba(255,255,255,0.3)', fontSize:'1rem', transition:'color 0.2s' }}
                    onMouseOver={e=>(e.currentTarget.style.color='#fff')}
                    onMouseOut={e=>(e.currentTarget.style.color='rgba(255,255,255,0.3)')}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
            {/* Servicios */}
            <div>
              <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase',
                letterSpacing:'0.15em', color:'rgba(255,255,255,0.3)', marginBottom:'1rem' }}>
                Servicios
              </div>
              {['Desarrollo Web','Agentes IA','Automatización','E-commerce','Cloud & APIs','Growth Marketing'].map(s => (
                <div key={s} style={{ marginBottom:'0.5rem' }}>
                  <span onClick={() => setContactOpen(true)}
                    style={{ color:'var(--silver)', fontSize:'0.84rem', cursor:'pointer',
                      transition:'color 0.2s' }}
                    onMouseOver={e=>(e.currentTarget.style.color='#fff')}
                    onMouseOut={e=>(e.currentTarget.style.color='var(--silver)')}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
            {/* Empresa */}
            <div>
              <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase',
                letterSpacing:'0.15em', color:'rgba(255,255,255,0.3)', marginBottom:'1rem' }}>
                Empresa
              </div>
              {['Proyectos','Proceso','Precios','FAQ','Contacto'].map(s => (
                <div key={s} style={{ marginBottom:'0.5rem' }}>
                  <a href={`#${s.toLowerCase()}`}
                    style={{ color:'var(--silver)', fontSize:'0.84rem', textDecoration:'none',
                      transition:'color 0.2s' }}
                    onMouseOver={e=>(e.currentTarget.style.color='#fff')}
                    onMouseOut={e=>(e.currentTarget.style.color='var(--silver)')}>
                    {s}
                  </a>
                </div>
              ))}
            </div>
            {/* Contacto */}
            <div>
              <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase',
                letterSpacing:'0.15em', color:'rgba(255,255,255,0.3)', marginBottom:'1rem' }}>
                Contacto
              </div>
              <div style={{ color:'var(--silver)', fontSize:'0.84rem', lineHeight:2 }}>
                <div>hola@jamdagency.com</div>
                <div>+34 600 000 000</div>
                <div style={{ marginTop:'0.5rem', fontSize:'0.75rem', color:'rgba(255,255,255,0.25)' }}>
                  Lun–Vie · 9:00–18:00 CET<br />
                  Respuesta garantizada en 24h
                </div>
              </div>
              <button className="btn-prm" onClick={() => setContactOpen(true)}
                style={{ marginTop:'1rem', fontSize:'0.78rem', padding:'10px 20px' }}>
                Contactar ahora
              </button>
            </div>
          </div>
          {/* Bottom bar */}
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.04)', paddingTop:'1.5rem',
            display:'flex', flexWrap:'wrap', gap:'1rem', justifyContent:'space-between', alignItems:'center' }}>
            <p style={{ color:'rgba(255,255,255,0.15)', fontSize:'0.65rem',
              textTransform:'uppercase', letterSpacing:'0.2em' }}>
              © 2026 JAMD AI AGENCY — Redefiniendo lo normal.
            </p>
            <p style={{ color:'rgba(255,255,255,0.1)', fontSize:'0.65rem',
              textTransform:'uppercase', letterSpacing:'0.15em' }}>
              Hecho con IA · Diseñado con ♥
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
