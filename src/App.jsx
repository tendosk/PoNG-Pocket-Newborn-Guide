import { useState, useCallback, createContext, useContext, useEffect, useRef, Fragment } from "react";
import {
  Baby, Heart, Frown, Wind, Hospital, Link2, Settings,
  Syringe, Thermometer, Pill, FlaskConical, Stethoscope, Scale, BarChart3,
  Brain, Bug, Activity, ShieldAlert, Snowflake, Wrench, Ruler, CircleAlert,
  Sun, Moon, Monitor, Eye, Ear, Milk, FileText, LineChart, HandHeart,
  HeartPulse, Droplets, CircleDot, Zap, BookOpen, Ribbon, PersonStanding,
  ClipboardCheck, TrendingUp, TestTubes, Waves, Sparkles, AlertTriangle,
  Search, X, ChevronLeft
} from "lucide-react";

// ─── Theme System ────────────────────────────────────────────────────
const light = {
  bg: "#F8FAFC", bg2: "#FFFFFF", bg3: "#F1F5F9", surface: "rgba(255,255,255,0.8)", surfaceSolid: "#FFFFFF",
  text: "#0F172A", text2: "#475569", text3: "#94A3B8",
  border: "rgba(148,163,184,0.2)", borderSolid: "#E2E8F0",
  shadow: "0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",
  shadowLg: "0 8px 30px rgba(0,0,0,0.06)",
  hdrGrad: "linear-gradient(135deg, #F8FAFC 0%, #EEF2F7 50%, #E2E8F0 100%)",
  tabBg: "rgba(249,249,249,0.85)",
  tabBorder: "rgba(0,0,0,0.12)",
  tabShadow: "none",
  cardBg: "rgba(255,255,255,0.85)",
  inputBg: "#F8FAFC",
  acc: "#3B82F6", accL: "#EFF6FF", accD: "#2563EB",
  red: "#EF4444", redL: "#FEF2F2", grn: "#10B981", grnL: "#ECFDF5",
  org: "#F59E0B", orgL: "#FFFBEB", pur: "#8B5CF6", purL: "#F5F3FF",
  tea: "#14B8A6", teaL: "#F0FDFA", pnk: "#EC4899", ylw: "#EAB308",
  mode: "light",
};

const dark = {
  bg: "#0B0F1A", bg2: "#111827", bg3: "#1E293B", surface: "rgba(30,41,59,0.7)", surfaceSolid: "#1E293B",
  text: "#F1F5F9", text2: "#CBD5E1", text3: "#A0AEC0",
  border: "rgba(148,163,184,0.1)", borderSolid: "#334155",
  shadow: "0 2px 12px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.3)",
  shadowLg: "0 8px 30px rgba(0,0,0,0.3)",
  hdrGrad: "linear-gradient(135deg, #0B0F1A 0%, #1E293B 50%, #1E3A5F 100%)",
  tabBg: "rgba(22,22,22,0.85)",
  tabBorder: "rgba(255,255,255,0.08)",
  tabShadow: "none",
  cardBg: "rgba(30,41,59,0.6)",
  inputBg: "#1E293B",
  acc: "#60A5FA", accL: "#1E3A5F33", accD: "#3B82F6",
  red: "#F87171", redL: "#450a0a44", grn: "#34D399", grnL: "#052e1633",
  org: "#FBBF24", orgL: "#451a0344", pur: "#A78BFA", purL: "#2e1065aa",
  tea: "#2DD4BF", teaL: "#042f2e44", pnk: "#F472B6", ylw: "#FACC15",
  mode: "dark",
};

const ThemeCtx = createContext(light);
const useT = () => useContext(ThemeCtx);

// ─── Shared Style Generators ─────────────────────────────────────────
const mkS = (t) => { const lg = t.largeText; const sz = (n) => n <= 15 ? (lg ? n + 2 : n) : n; return ({
  app: { width: "100%", margin: "0 auto", fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif', background: t.bg, height: "100dvh", color: t.text, fontSize: sz(15), lineHeight: 1.5, position: "relative", WebkitFontSmoothing: "antialiased", display: "flex", flexDirection: "column", overflow: "hidden" },
  hdr: { background: t.hdrGrad, color: t.mode === "dark" ? "#F8FAFC" : "#0F172A", padding: "60px 20px 16px", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" },
  hdrT: { fontSize: 28, fontWeight: 800, letterSpacing: -0.5, fontFamily: '"Poppins", sans-serif', textShadow: t.mode === "dark" ? "0 0 20px rgba(96,165,250,0.4), 0 0 40px rgba(96,165,250,0.15)" : "none" },
  hdrS: { fontSize: sz(11), opacity: 0.6, marginTop: 2, fontWeight: 400 },
  back: { background: t.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)", border: "none", color: t.mode === "dark" ? "#F8FAFC" : "#334155", width: 38, height: 38, borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 },
  card: { background: t.cardBg, backdropFilter: "blur(16px)", borderRadius: 16, padding: "16px 18px", margin: "0 16px 10px", boxShadow: t.shadow, border: `1px solid ${t.border}` },
  secT: { fontSize: sz(12), fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: t.text3, margin: "20px 20px 10px", fontFamily: '"Poppins", sans-serif' },
  mi: { display: "flex", alignItems: "center", padding: "14px 18px", background: t.surfaceSolid, borderBottom: `1px solid ${t.border}`, cursor: "pointer", gap: 14, transition: "background 0.15s" },
  mIc: { width: 38, height: 38, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 },
  mLb: { fontSize: sz(14), fontWeight: 600, color: t.text, fontFamily: '"Poppins", sans-serif' },
  mDs: { fontSize: sz(11), color: t.text2, marginTop: 2 },
  chv: { marginLeft: "auto", color: t.text3, fontSize: 16, opacity: 0.5 },
  pill: { display: "inline-block", padding: "7px 14px", borderRadius: 20, fontSize: sz(12), fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.2s ease" },
  tH: { background: t.mode === "dark" ? t.bg3 : "#0F172A", color: "#F8FAFC", fontWeight: 600, fontSize: sz(11), padding: "10px 8px", textAlign: "center", borderRight: `1px solid ${t.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)"}`, borderBottom: `1px solid ${t.border}` },
  tC: { padding: "10px 8px", textAlign: "center", fontSize: sz(12), borderBottom: `1px solid ${t.border}`, borderRight: `1px solid ${t.border}`, color: t.text },
  cnt: { paddingBottom: 90 },
  info: (accent) => ({ background: t.mode === "dark" ? `${accent}15` : `${accent}12`, border: `1px solid ${accent}30`, borderRadius: 14, padding: "14px 16px", margin: "0 16px 10px", fontSize: sz(12), lineHeight: 1.6, color: t.text }),
  sBdg: (bg, c) => ({ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 12, background: bg, color: c, fontSize: 18, fontWeight: 800, cursor: "pointer", border: "none", transition: "all 0.2s" }),
  menuList: { borderRadius: 16, overflow: "hidden", margin: "0 16px", border: `1px solid ${t.border}`, boxShadow: t.shadow },
  input: { width: "100%", padding: "14px 16px", fontSize: 18, fontWeight: 700, borderRadius: 14, border: `2px solid ${t.border}`, background: t.inputBg, color: t.text, outline: "none", boxSizing: "border-box", textAlign: "center", transition: "border-color 0.2s" },
  brand: { fontFamily: '"Poppins", sans-serif', fontWeight: 800, background: "linear-gradient(135deg, #06D6A0 0%, #00E5CC 40%, #00F5D4 60%, #56FFF3 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  brandLogo: { filter: "none" },
  sz,
})};

// ─── Helpers ─────────────────────────────────────────────────────────
function MenuList({ items, onTap }) {
  const t = useT(); const s = mkS(t);
  return (
    <div style={s.menuList}>
      {items.map((it, i) => (
        <div key={it.id} style={{ ...s.mi, borderBottom: i < items.length - 1 ? `1px solid ${t.border}` : "none" }} onClick={() => onTap(it.id)}>
          <div style={{ ...s.mIc, background: `${it.color}18`, color: it.color }}>{it.icon}</div>
          <div style={{ flex: 1 }}><div style={s.mLb}>{it.label}</div><div style={s.mDs}>{it.desc}</div></div>
          <span style={s.chv}>›</span>
        </div>
      ))}
    </div>
  );
}

function Page({ title, sub, onBack, children }) {
  const t = useT(); const s = mkS(t);
  return (
    <div>
      <div style={{ ...s.hdr, paddingTop: onBack ? 76 : 92 }}>
        {onBack ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={s.back} onClick={onBack}><ChevronLeft size={20} strokeWidth={2.5} /></button>
            <div>
              <div style={s.hdrT}>{title}</div>
              {sub && <div style={s.hdrS}>{sub}</div>}
            </div>
          </div>
        ) : (
          <>
            <div style={s.hdrT}>{title}</div>
            {sub && <div style={s.hdrS}>{sub}</div>}
          </>
        )}
      </div>
      <div style={s.cnt}>{children}</div>
    </div>
  );
}

// shorthand hooks
function useS() { const t = useT(); return mkS(t); }
function useSz() { const t = useT(); return (n) => t.largeText ? n + 2 : n; }

// ═══════════════════════════════════════════════════════════════════════
// SEARCH INDEX & COMPONENT
// ═══════════════════════════════════════════════════════════════════════
const SEARCH_INDEX = [
  // Quick Tools & Newborn sections
  { id: "vitals", label: "Vital Signs", desc: "Normal newborn ranges, heart rate, respiratory rate, temperature, blood pressure", section: "Newborn" },
  { id: "apgar", label: "APGAR Score", desc: "Appearance pulse grimace activity respirations scoring tool calculator", section: "Newborn" },
  { id: "fenton", label: "Fenton 2025 Weight Cutoffs", desc: "Growth charts preterm weight percentile third generation", section: "Newborn" },
  { id: "glucose", label: "Blood Glucose Screening", desc: "Hypoglycemia protocol asymptomatic screening dextrose glucose gel", section: "Newborn" },
  { id: "delivery", label: "Delivery & NRP", desc: "Neonatal resuscitation program birth APGAR equipment", section: "Newborn" },
  { id: "routine", label: "Routine Newborn Care", desc: "Well baby nursery maternal factors medications screenings", section: "Newborn" },
  { id: "sepsis", label: "Early Onset Sepsis", desc: "EOS risk assessment kaiser sepsis calculator antibiotics GBS", section: "Newborn" },
  { id: "complications", label: "Complications", desc: "Hypothermia TTN transient tachypnea extracranial injuries birth trauma", section: "Newborn" },
  // Routine care sub-pages
  { id: "infections", label: "Maternal Infections", desc: "GBS PROM hepatitis B C HIV HSV syphilis", section: "Routine Care" },
  { id: "maternal_conditions", label: "Maternal Conditions", desc: "Diabetes HTN thyroid Graves substance use IDM pre-eclampsia", section: "Routine Care" },
  { id: "obstetric", label: "Obstetric & Birth Factors", desc: "Delivery mode meconium cesarean vacuum forceps medications", section: "Routine Care" },
  { id: "neonatal_meds", label: "Neonatal Medications", desc: "Vitamin K Hep B vaccine erythromycin Beyfortus nirsevimab RSV", section: "Routine Care" },
  { id: "feeding", label: "Feeding", desc: "Breastfeeding donor milk formula lactation latch colostrum", section: "Routine Care" },
  { id: "voiding", label: "Voiding & Stooling", desc: "Wet diapers meconium stool patterns day of life", section: "Routine Care" },
  { id: "bilirubin", label: "Bilirubin", desc: "Jaundice hyperbilirubinemia phototherapy screening nomogram", section: "Routine Care" },
  { id: "hearing", label: "Hearing Screen", desc: "Hearing screen follow-up ABR OAE audiology", section: "Routine Care" },
  { id: "additional_screenings", label: "Additional Screenings", desc: "CMV cytomegalovirus pelviectasis hydronephrosis renal ultrasound VCUG", section: "Routine Care" },
  { id: "cchd", label: "CCHD Screening", desc: "Critical congenital heart disease pulse oximetry SpO2", section: "Routine Care" },
  { id: "nbs", label: "Newborn Screen", desc: "Metabolic genetic screening PKU thyroid sickle cell", section: "Routine Care" },
  // Delivery sub-pages
  { id: "nrp", label: "NRP Algorithm", desc: "Neonatal resuscitation PPV chest compressions epinephrine MR SOPA", section: "Delivery" },
  { id: "equipment", label: "Equipment Estimates", desc: "ETT sizing depth blade laryngoscope weight-based", section: "Delivery" },
  { id: "resuscmeds", label: "NRP Meds", desc: "Epinephrine normal saline volume expansion emergency NRP", section: "Delivery" },
  // Complications sub-pages
  { id: "hypothermia", label: "Hypothermia", desc: "Cold stress temperature prevention rewarming management", section: "Complications" },
  { id: "nows", label: "NOWS / ESC", desc: "Neonatal opioid withdrawal eat sleep console Finnegan", section: "ICN" },
  { id: "ttn", label: "TTN", desc: "Transient tachypnea newborn respiratory distress tachypnea", section: "Complications" },
  { id: "extracranial", label: "Extracranial Injuries", desc: "Caput succedaneum cephalohematoma subgaleal hemorrhage birth trauma scalp", section: "Complications" },
  // ICN
  { id: "uvcuac", label: "UVC / UAC Calculator", desc: "Umbilical venous arterial catheter insertion depth line", section: "ICN" },
  { id: "sarnat", label: "Modified Sarnat", desc: "HIE hypoxic ischemic encephalopathy staging consciousness tone", section: "ICN" },
  { id: "cooling", label: "HIE", desc: "Cooling HIE protocol 33.5 degrees neuroprotection criteria", section: "ICN" },
  { id: "codemeds", label: "Code Meds", desc: "Neonatal code resuscitation epinephrine dopamine dobutamine phenobarbital acyclovir ampicillin gentamicin adenosine calcium surfactant", section: "ICN" },
];

function SearchBar({ onNav }) {
  const t = useT(); const s = useS();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const results = query.length >= 2 ? SEARCH_INDEX.filter(item => {
    const q = query.toLowerCase();
    return item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.section.toLowerCase().includes(q);
  }).slice(0, 8) : [];

  const handleSelect = (id) => {
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
    onNav(id);
  };

  return (
    <div style={{ padding: "12px 16px 4px", position: "relative" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
        background: t.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
        borderRadius: 12, border: `1px solid ${focused ? t.acc + "60" : t.border}`,
        transition: "border-color 0.2s",
      }}>
        <Search size={16} style={{ color: t.text3, flexShrink: 0 }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search tools, topics, meds..."
          style={{
            flex: 1, border: "none", background: "none", outline: "none",
            fontSize: s.sz(14), color: t.text, fontFamily: '"Inter", sans-serif',
          }}
        />
        {query && <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}><X size={16} style={{ color: t.text3 }} /></button>}
      </div>
      {focused && results.length > 0 && (
        <div style={{
          position: "absolute", left: 16, right: 16, top: "100%", marginTop: 4,
          background: t.surfaceSolid, borderRadius: 14, border: `1px solid ${t.border}`,
          boxShadow: t.shadowLg, zIndex: 300, overflow: "hidden",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        }}>
          {results.map((r, i) => (
            <div key={r.id} onMouseDown={() => handleSelect(r.id)} style={{
              padding: "12px 16px", cursor: "pointer",
              borderBottom: i < results.length - 1 ? `1px solid ${t.border}` : "none",
              transition: "background 0.1s",
            }}>
              <div style={{ fontSize: s.sz(13), fontWeight: 600, color: t.text, fontFamily: '"Poppins", sans-serif' }}>{r.label}</div>
              <div style={{ fontSize: s.sz(10), color: t.text3, marginTop: 2 }}>{r.section}</div>
            </div>
          ))}
        </div>
      )}
      {focused && query.length >= 2 && results.length === 0 && (
        <div style={{
          position: "absolute", left: 16, right: 16, top: "100%", marginTop: 4,
          background: t.surfaceSolid, borderRadius: 14, border: `1px solid ${t.border}`,
          boxShadow: t.shadowLg, zIndex: 300, padding: "16px", textAlign: "center",
        }}>
          <div style={{ fontSize: s.sz(13), color: t.text3 }}>No results for "{query}"</div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// APGAR TOOL
// ═══════════════════════════════════════════════════════════════════════
const APGAR = [
  { name: "Appearance", sub: "(Skin Color)", icon: <Baby size={18} />, opts: [{ s: 0, l: "Blue/Pale all over" }, { s: 1, l: "Body pink, extremities blue" }, { s: 2, l: "Completely pink" }] },
  { name: "Pulse", sub: "(Heart Rate)", icon: <HeartPulse size={18} />, opts: [{ s: 0, l: "Absent" }, { s: 1, l: "< 100 bpm" }, { s: 2, l: "≥ 100 bpm" }] },
  { name: "Grimace", sub: "(Reflex Irritability)", icon: <Frown size={18} />, opts: [{ s: 0, l: "No response" }, { s: 1, l: "Grimace/weak cry" }, { s: 2, l: "Cry or pull away" }] },
  { name: "Activity", sub: "(Muscle Tone)", icon: <PersonStanding size={18} />, opts: [{ s: 0, l: "Limp, no movement" }, { s: 1, l: "Some flexion" }, { s: 2, l: "Active motion, good flexion" }] },
  { name: "Respirations", sub: "(Breathing)", icon: <Wind size={18} />, opts: [{ s: 0, l: "Absent" }, { s: 1, l: "Slow, irregular, weak cry" }, { s: 2, l: "Good cry, regular" }] },
];

function ApgarTool({ onBack, scrollRef }) {
  const t = useT(); const s = useS();
  const [scores, setScores] = useState({});
  const [tp, setTp] = useState("1min");
  const cur = scores[tp] || {};
  const total = Object.values(cur).reduce((a, b) => a + b, 0);
  const done = Object.keys(cur).length === 5;
  const interp = done ? (total >= 7 ? { c: t.grn, bg: t.grnL } : total >= 4 ? { c: t.org, bg: t.orgL } : { c: t.red, bg: t.redL }) : null;
  const wasDone = useRef(false);
  useEffect(() => {
    if (done && !wasDone.current && scrollRef?.current) scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    wasDone.current = done;
  }, [done]);
  useEffect(() => { wasDone.current = false; }, [tp]);
  const tps = [{ k: "1min", l: "1 min" }, { k: "5min", l: "5 min" }, { k: "10min", l: "10 min" }];

  return (
    <Page title="APGAR Score" onBack={onBack}>
      <div style={{ display: "flex", gap: 8, padding: "16px 16px 8px" }}>
        {tps.map(x => { const sc = scores[x.k] || {}; const tot = Object.values(sc).reduce((a, b) => a + b, 0); const c = Object.keys(sc).length === 5;
          return <button key={x.k} onClick={() => setTp(x.k)} style={{ ...s.pill, flex: 1, textAlign: "center", background: tp === x.k ? t.acc : t.surfaceSolid, color: tp === x.k ? "#fff" : t.text, boxShadow: tp === x.k ? `0 4px 12px ${t.acc}40` : s.shadow }}>{x.l}{c && <span style={{ marginLeft: 4, fontWeight: 800 }}>{tot}</span>}</button>;
        })}
      </div>
      {done && interp && <div style={{ ...s.card, background: interp.bg, textAlign: "center", marginTop: 8 }}><div style={{ fontSize: 42, fontWeight: 800, color: interp.c }}>{total}</div></div>}
      {tp === "10min" && <div style={{ ...s.info(t.org), marginTop: 8 }}>A 10-minute Apgar score is needed if the 5-minute score is less than 7. Repeat every 5 minutes until 20 minutes if the score remains less than 7.</div>}
      {APGAR.map(cr => (
        <div key={cr.name} style={{ ...s.card, marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><div style={{ color: t.acc, display: "flex" }}>{cr.icon}</div><div><div style={{ fontWeight: 700, fontSize: s.sz(15) }}>{cr.name}</div><div style={{ fontSize: s.sz(10), color: t.text3 }}>{cr.sub}</div></div></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {cr.opts.map(o => { const sel = cur[cr.name] === o.s; return (
              <button key={o.s} onClick={() => setScores(p => ({ ...p, [tp]: { ...p[tp], [cr.name]: o.s } }))} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, border: sel ? `2px solid ${t.acc}` : `1px solid ${t.border}`, background: sel ? t.accL : "transparent", cursor: "pointer", textAlign: "left", fontSize: s.sz(13), color: t.text, transition: "all 0.15s" }}>
                <span style={s.sBdg(sel ? t.acc : t.bg3, sel ? "#fff" : t.text)}>{o.s}</span>
                <span style={{ fontWeight: sel ? 600 : 400 }}>{o.l}</span>
              </button>);
            })}
          </div>
        </div>
      ))}
      <div style={{ padding: "16px 16px" }}><button onClick={() => setScores(p => ({ ...p, [tp]: {} }))} style={{ width: "100%", padding: 14, borderRadius: 14, border: `1px solid ${t.border}`, background: "transparent", fontSize: s.sz(13), fontWeight: 600, cursor: "pointer", color: t.red }}>Clear {tps.find(x => x.k === tp)?.l} Scores</button></div>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SARNAT
// ═══════════════════════════════════════════════════════════════════════
const SARNAT = [
  { name: "Level of Consciousness", n: 1, opts: [{ st: "Normal", s: 0, l: "Awake, alert, follows stimuli" },{ st: "Mild HIE", s: 1, l: "Irritable, hyperalert, poor feeding" },{ st: "Moderate HIE", s: 2, l: "Lethargic" },{ st: "Severe HIE", s: 3, l: "Stupor or coma" }] },
  { name: "Spontaneous Activity", n: 2, opts: [{ st: "Normal", s: 0, l: "Frequent spontaneous movements" },{ st: "Mild", s: 1, l: "Increased/exaggerated, jittery" },{ st: "Moderate", s: 2, l: "Decreased activity" },{ st: "Severe", s: 3, l: "No activity" }] },
  { name: "Posture", n: 3, opts: [{ st: "Normal", s: 0, l: "Normal flexed" },{ st: "Mild", s: 1, l: "Mild distal flexion" },{ st: "Moderate", s: 2, l: "Distal flexion, extension" },{ st: "Severe", s: 3, l: "Decerebrate" }] },
  { name: "Tone", n: 4, opts: [{ st: "Normal", s: 0, l: "Normal" },{ st: "Mild", s: 1, l: "Slightly increased" },{ st: "Moderate", s: 2, l: "Hypotonia" },{ st: "Severe", s: 3, l: "Flaccid" }] },
  { name: "Primitive Reflexes", n: 5, opts: [{ st: "Normal", s: 0, l: "Strong suck; Moro complete" },{ st: "Mild", s: 1, l: "Uncoordinated; exaggerated" },{ st: "Moderate", s: 2, l: "Weak/bite; incomplete" },{ st: "Severe", s: 3, l: "Absent" }] },
  { name: "Autonomic System", n: 6, opts: [{ st: "Normal", s: 0, l: "Reactive pupils; Normal HR/RR" },{ st: "Mild", s: 1, l: "Dilated pupils; Tachycardia" },{ st: "Moderate", s: 2, l: "Constricted; Bradycardia" },{ st: "Severe", s: 3, l: "Non-reactive; Resp failure" }] },
];

function SarnatTool({ onBack, scrollRef }) {
  const t = useT(); const s = useS();
  const [scores, setScores] = useState({});
  const done = Object.keys(scores).length === 6;
  const wasDone = useRef(false);
  useEffect(() => {
    if (done && !wasDone.current && scrollRef?.current) scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    wasDone.current = done;
  }, [done]);
  const stColors = { 0: t.grn, 1: t.org, 2: t.org, 3: t.red };
  const stBgs = { 0: t.grnL, 1: t.orgL, 2: t.orgL, 3: t.redL };
  const getCounts = () => { const c = { Normal: 0, Mild: 0, Moderate: 0, Severe: 0 }; Object.entries(scores).forEach(([cat, v]) => { const f = SARNAT.find(x => x.name === cat)?.opts.find(o => o.s === v); if (f) { if (f.st.includes("Normal")) c.Normal++; else if (f.st.includes("Mild")) c.Mild++; else if (f.st.includes("Moderate")) c.Moderate++; else c.Severe++; } }); return c; };
  const overall = done ? (() => { const c = getCounts(); if (c.Severe >= 3) return { stage: "Severe HIE (Stage 3)", c: t.red, bg: t.redL, note: "≥3 Severe → therapeutic hypothermia" }; if (c.Moderate >= 3) return { stage: "Moderate HIE (Stage 2)", c: t.org, bg: t.orgL, note: "≥3 Moderate → eligible for cooling" }; if (c.Mild >= 3) return { stage: "Mild HIE (Stage 1)", c: t.org, bg: t.orgL, note: "≥3 Mild" }; return { stage: "Mixed — use clinical judgment", c: t.acc, bg: t.accL, note: "No single stage ≥3" }; })() : null;

  return (
    <Page title="Modified Sarnat" onBack={onBack}>
      {done && overall && <div style={{ ...s.card, background: overall.bg, marginTop: 14 }}><div style={{ fontWeight: 800, fontSize: 17, color: overall.c }}>{overall.stage}</div><div style={{ fontSize: s.sz(11), color: overall.c, marginTop: 4 }}>{overall.note}</div></div>}
      <div style={{ ...s.info(t.acc), marginTop: 12 }}><strong>Cooling eligibility:</strong> ≥3 of 6 categories Moderate or Severe. For Reflexes & Autonomic, use highest score.</div>
      {SARNAT.map(cat => (
        <div key={cat.name} style={{ ...s.card, marginTop: 8 }}>
          <div style={{ fontWeight: 700, fontSize: s.sz(14), marginBottom: 10 }}>{cat.n}. {cat.name}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {cat.opts.map(o => { const sel = scores[cat.name] === o.s; const c = stColors[o.s]; return (
              <button key={o.s} onClick={() => setScores(p => ({ ...p, [cat.name]: o.s }))} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 12, border: sel ? `2px solid ${c}` : `1px solid ${t.border}`, background: sel ? stBgs[o.s] : "transparent", cursor: "pointer", textAlign: "left", fontSize: s.sz(12), color: t.text, transition: "all 0.15s" }}>
                <span style={{ minWidth: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: s.sz(10), background: sel ? c : t.bg3, color: sel ? "#fff" : t.text, flexShrink: 0 }}>S{o.s}</span>
                <div><div style={{ fontWeight: 600, fontSize: s.sz(11), color: c }}>{o.st}</div><div style={{ fontSize: s.sz(11), color: t.text2 }}>{o.l}</div></div>
              </button>);
            })}
          </div>
        </div>
      ))}
      <div style={{ padding: "16px 16px" }}><button onClick={() => setScores({})} style={{ width: "100%", padding: 14, borderRadius: 14, border: `1px solid ${t.border}`, background: "transparent", fontSize: s.sz(13), fontWeight: 600, cursor: "pointer", color: t.red }}>Clear All</button></div>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// FENTON TABLE
// ═══════════════════════════════════════════════════════════════════════
function FentonTable({ onBack }) {
  const t = useT(); const s = useS();
  const data = [["34.0–34.6","< 1756","> 2583","< 1845","> 2676"],["35.0–35.6","< 1941","> 2837","< 2038","> 2938"],["36.0–36.6","< 2128","> 3093","< 2231","> 3196"],["37.0–37.6","< 2314","> 3355","< 2420","> 3448"],["38.0–38.6","< 2494","> 3617","< 2608","> 3698"],["39.0–39.6","< 2668","> 3872","< 2796","> 3948"],["40.0–40.6","< 2837","> 4117","< 2986","> 4199"],["41.0–41.6","< 3002","> 4348","< 3175","> 4450"]];
  return (
    <Page title="Fenton 2025 Weight Cutoffs" onBack={onBack}>
      <div style={{ ...s.card, marginTop: 14, padding: 0, overflow: "hidden" }}>
        <div style={{ background: t.mode === "dark" ? t.bg3 : "#0F172A", color: "#F8FAFC", textAlign: "center", padding: 10, fontWeight: 700, fontSize: s.sz(13) }}>Weight in grams</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: s.sz(11) }}>
            <thead>
              <tr><th rowSpan={2} style={s.tH}>GA</th><th colSpan={2} style={{ ...s.tH, background: t.pnk }}>Female</th><th colSpan={2} style={{ ...s.tH, background: t.acc }}>Male</th></tr>
              <tr><th style={{ ...s.tH, background: t.pnk, fontSize: s.sz(9) }}>SGA &lt;10%</th><th style={{ ...s.tH, background: t.pnk, fontSize: s.sz(9) }}>LGA &gt;90%</th><th style={{ ...s.tH, background: t.acc, fontSize: s.sz(9) }}>SGA &lt;10%</th><th style={{ ...s.tH, background: t.acc, fontSize: s.sz(9) }}>LGA &gt;90%</th></tr>
            </thead>
            <tbody>
              {data.map(([ga,fS,fL,mS,mL], i) => (
                <tr key={ga} style={{ background: i % 2 === 0 ? t.surfaceSolid : t.bg3 }}>
                  <td style={{ ...s.tC, fontWeight: 700, ...(i === 0 && { borderTop: `1px solid ${t.border}` }) }}>{ga}</td><td style={{ ...s.tC, ...(i === 0 && { borderTop: `1px solid ${t.border}` }) }}>{fS}</td><td style={{ ...s.tC, ...(i === 0 && { borderTop: `1px solid ${t.border}` }) }}>{fL}</td><td style={{ ...s.tC, ...(i === 0 && { borderTop: `1px solid ${t.border}` }) }}>{mS}</td><td style={{ ...s.tC, ...(i === 0 && { borderTop: `1px solid ${t.border}` }) }}>{mL}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ padding: "16px 16px" }}><a href="https://peditools.org/fenton2025/" target="_blank" rel="noopener noreferrer" className="btn-link" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 14, background: `${t.grn}12`, border: `1px solid ${t.grn}30`, color: t.grn, fontWeight: 600, fontSize: s.sz(13), textDecoration: "none" }}><TrendingUp size={16} /> Fenton 2025 Calculator — PediTools</a></div>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// GLUCOSE PROTOCOL
// ═══════════════════════════════════════════════════════════════════════
function GlucoseProtocol({ onBack }) {
  const t = useT(); const s = useS();
  const [tab, setTab] = useState("criteria");
  const tabs = [{ k: "criteria", l: "Criteria" }, { k: "pathway", l: "Pathway" }, { k: "dosing", l: "Dosing" }, { k: "sx", l: "Symptoms" }];
  const [showPdf, setShowPdf] = useState(null);
  return (
    <Page title="Blood Glucose Screening" onBack={onBack}>
      {showPdf !== null && <ImageViewer pages={["/glucose-protocol-p1.png", "/glucose-protocol-p2.png"]} activePage={showPdf} onClose={() => setShowPdf(null)} onPageChange={setShowPdf} />}
      <div style={{ padding: "28px 16px 14px" }}><button onClick={() => setShowPdf(0)} className="btn-link" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 14, background: `${t.pur}12`, border: `1px solid ${t.pur}30`, color: t.pur, fontWeight: 600, fontSize: s.sz(13), cursor: "pointer" }}><FileText size={16} /> View Protocol PDF</button></div>
      <div style={{ display: "flex", gap: 6, padding: "14px 16px 4px" }}>
        {tabs.map(x => <button key={x.k} onClick={() => setTab(x.k)} style={{ ...s.pill, flex: 1, textAlign: "center", fontSize: s.sz(11), background: tab === x.k ? t.pur : t.surfaceSolid, color: tab === x.k ? "#fff" : t.text, boxShadow: tab === x.k ? `0 4px 12px ${t.pur}40` : "none" }}>{x.l}</button>)}
      </div>
      {tab === "criteria" && <div>
        <div style={s.secT}>Inclusion</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>• SGA or LGA (Fenton 2025)<br/>• Infant of diabetic mother (IDM)<br/>• Late preterm (35.0–36.6w)</div></div>
        <div style={s.secT}>Exclusion</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>• Symptomatic hypoglycemia<br/>• &gt; 48 hours old<br/>• Unable to feed</div></div>
        <div style={s.secT}>Completion</div><div style={s.card}><div style={{ fontWeight: 700, fontSize: s.sz(12), color: t.pur, marginBottom: 4 }}>LGA / IDM:</div><div style={{ fontSize: s.sz(12) }}>≥ <strong>12 hrs</strong> AND 3 consecutive AC ≥ 45</div><div style={{ borderTop: `1px solid ${t.border}`, margin: "10px 0", paddingTop: 10 }}><div style={{ fontWeight: 700, fontSize: s.sz(12), color: t.pur, marginBottom: 4 }}>SGA / Late preterm:</div><div style={{ fontSize: s.sz(12) }}>≥ <strong>24 hrs</strong> AND 3 consecutive AC ≥ 45</div></div></div>
      </div>}
      {tab === "pathway" && <div>
        <div style={s.secT}>Path A: First Feed</div>
        <div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>• Feed within 1 hr of birth<br/>• POC glucose <strong>30 min AFTER</strong> feed (≤ 90 min)</div>
          <div style={{ marginTop: 10, padding: 12, background: t.redL, borderRadius: 12 }}><div style={{ fontWeight: 700, fontSize: s.sz(12), color: t.red }}>If &lt; 35:</div><div style={{ fontSize: s.sz(11), lineHeight: 1.7, marginTop: 3 }}>Glucose gel → feed → STS → notify MD → recheck 1 hr</div></div>
          <div style={{ marginTop: 6, padding: 12, background: t.grnL, borderRadius: 12 }}><div style={{ fontWeight: 700, fontSize: s.sz(12), color: t.grn }}>If ≥ 35: Path A complete → Path B</div></div>
          <div style={{ marginTop: 8, fontSize: s.sz(11), lineHeight: 1.7, color: t.text2 }}><strong>Recheck &lt;25:</strong> Gel, feed, STS, MD, 1hr → &lt;45: OFF PATHWAY<br/><strong>Recheck 25-34:</strong> Gel, feed, STS, MD, 1hr<br/><strong>Recheck ≥35:</strong> Path A complete → Path B</div>
        </div>
        <div style={s.secT}>Path B: All Other Feeds</div>
        <div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>• Feed q3 hrs<br/>• POC q3 hrs <strong>BEFORE</strong> feeds (AC)<br/>• Goal: <strong>≥ 45</strong></div>
          <div style={{ marginTop: 10, padding: 12, background: t.redL, borderRadius: 12 }}><div style={{ fontWeight: 700, fontSize: s.sz(12), color: t.red }}>If &lt; 45:</div><div style={{ fontSize: s.sz(11), lineHeight: 1.7, marginTop: 3 }}>Gel → feed → STS → MD → recheck 1hr → &lt;45: OFF PATHWAY</div></div>
          <div style={{ marginTop: 6, padding: 12, background: t.grnL, borderRadius: 12 }}><div style={{ fontWeight: 700, fontSize: s.sz(12), color: t.grn }}>If ≥ 45: Repeat until criteria met</div></div>
        </div>
      </div>}
      {tab === "dosing" && <div>
        <div style={s.secT}>Glucose Gel (40% Dextrose)</div>
        <div style={s.info(t.pur)}><strong>0.5 mL/kg</strong> buccal mucosa prior to feeding. Round UP to nearest 0.5 kg.</div>
        <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr><th style={s.tH}>Weight</th><th style={s.tH}>Dose</th></tr></thead><tbody>
            {[["2 kg","1 mL"],["2.5 kg","1.25 mL"],["3 kg","1.5 mL"],["3.5 kg","1.75 mL"],["4 kg","2 mL"],["4.5 kg","2.25 mL"]].map(([w,d],i) => <tr key={w} style={{ background: i%2===0?t.surfaceSolid:t.bg3 }}><td style={{ ...s.tC, fontWeight: 600, ...(i === 0 && { borderTop: `1px solid ${t.border}` }) }}>{w}</td><td style={{ ...s.tC, ...(i === 0 && { borderTop: `1px solid ${t.border}` }) }}>{d}</td></tr>)}
          </tbody></table>
        </div>
        <div style={s.secT}>Feeds</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.7 }}>Breastfeeding preferred. If unavailable, ≥5 mL donor milk or formula (verbal consent).</div></div>
        <div style={s.secT}>Skin-to-Skin</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.7 }}>Stabilizes temp, HR, RR, glucose. Continue uninterrupted until recheck.</div></div>
      </div>}
      {tab === "sx" && <div>
        <div style={{ ...s.info(t.red), marginTop: 14 }}><strong style={{ color: t.red }}>Symptomatic hypoglycemia = immediate intervention</strong></div>
        <div style={s.secT}>Signs & Symptoms</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>• Tremors, jitteriness<br/>• Exaggerated Moro<br/>• Weak/high-pitched cry<br/>• Lethargy, hypotonia<br/>• Cyanosis, apnea, tachypnea<br/>• Hypothermia</div></div>
        <div style={s.secT}>Actions</div><div style={{ ...s.card, borderLeft: `4px solid ${t.red}` }}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>• POC glucose stat<br/>• Notify MD<br/>• If &lt; 45 → STAT serum glucose and treat</div></div>
      </div>}
      <div style={{ textAlign: "center", padding: 8, fontSize: s.sz(9), color: t.text3 }}>Updated 8/21/25 · Tendo Kironde, MD</div>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// UVC/UAC CALCULATOR
// ═══════════════════════════════════════════════════════════════════════
function UvcUacCalc({ onBack }) {
  const t = useT(); const s = useS();
  const [wt, setWt] = useState("");
  const bw = parseFloat(wt); const uac = !isNaN(bw) && bw > 0 ? (3*bw+9).toFixed(1) : null; const uvc = uac ? (0.5*parseFloat(uac)+1).toFixed(1) : null;
  return (
    <Page title="UVC / UAC Calculator" onBack={onBack}>
      <div style={{ ...s.card, marginTop: 14 }}><div style={{ fontWeight: 700, marginBottom: 10, fontSize: s.sz(13) }}>Birth Weight (kg)</div><input type="number" step="0.1" min="0.3" max="6" placeholder="Enter weight" value={wt} onChange={e => setWt(e.target.value)} style={s.input} /></div>
      {uac && uvc && <>
        <div style={{ ...s.card, textAlign: "center", borderLeft: `4px solid ${t.red}` }}><div style={{ fontSize: s.sz(11), color: t.red, fontWeight: 600 }}>UAC High Line</div><div style={{ fontSize: 34, fontWeight: 800, color: t.red }}>{uac} cm</div><div style={{ fontSize: s.sz(10), color: t.text3 }}>(3 × {bw}) + 9</div></div>
        <div style={{ ...s.card, textAlign: "center", borderLeft: `4px solid ${t.acc}` }}><div style={{ fontSize: s.sz(11), color: t.acc, fontWeight: 600 }}>UVC Length</div><div style={{ fontSize: 34, fontWeight: 800, color: t.acc }}>{uvc} cm</div><div style={{ fontSize: s.sz(10), color: t.text3 }}>(0.5 × {uac}) + 1</div></div>
      </>}
      <div style={s.secT}>Formulas</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}><strong>UAC</strong> = (3 × BW) + 9<br/><strong>UVC</strong> = 0.5 × UAC + 1</div></div>
      <div style={s.info(t.org)}><strong>Tip:</strong> Confirm with X-ray. UAC: T6–T10. UVC: T8–T10.</div>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// VITAL SIGNS
// ═══════════════════════════════════════════════════════════════════════
function VitalSigns({ onBack }) {
  const t = useT(); const s = useS();
  return (
    <Page title="Vital Signs" onBack={onBack}>
      <div style={s.secT}>Normal Newborn Vitals</div>
      <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr><th style={s.tH}>Parameter</th><th style={s.tH}>Normal</th></tr></thead><tbody>
          {[["Heart Rate","100–160 bpm"],["Respiratory Rate","30–60/min"],["Temp (axillary)","36.5–37.5°C"],["SpO2 (preductal)","≥95% after 10 min"],["BP (term)","60–80/35–55"],["MAP","≈ GA (wks)"]].map(([p,v],i) => <tr key={p} style={{ background: i%2===0?t.surfaceSolid:t.bg3 }}><td style={{ ...s.tC, fontWeight: 600, textAlign: "left", paddingLeft: 14 }}>{p}</td><td style={s.tC}>{v}</td></tr>)}
        </tbody></table>
      </div>
      <div style={s.secT}>Target SpO2 After Birth</div>
      <div style={{ ...s.card, padding: 0, overflow: "hidden" }}><table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr><th style={s.tH}>Time</th><th style={s.tH}>SpO2</th></tr></thead><tbody>
        {[["1 min","60–65%"],["2 min","65–70%"],["3 min","70–75%"],["4 min","75–80%"],["5 min","80–85%"],["10 min","85–95%"]].map(([x,v],i) => <tr key={x} style={{ background: i%2===0?t.surfaceSolid:t.bg3 }}><td style={{ ...s.tC, fontWeight: 600 }}>{x}</td><td style={s.tC}>{v}</td></tr>)}
      </tbody></table></div>
      <div style={s.secT}>Pre/Post-ductal SpO2</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.7 }}><strong>Pre:</strong> Right hand · <strong>Post:</strong> Either foot<br/>Difference &gt;3% → R-to-L shunt through PDA</div></div>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// NRP ALGORITHM
// ═══════════════════════════════════════════════════════════════════════
function NRPAlgorithm({ onBack }) {
  const t = useT(); const s = useS();
  const steps = [
    { n: 1, title: "Birth", desc: "Term? Good tone? Breathing?", action: "YES → Stay with mother, routine care", color: t.grn },
    { n: 2, title: "Initial Steps (30s)", desc: "Warm, dry, stimulate, position", action: "Assess HR, breathing, tone", color: t.acc },
    { n: 3, title: "HR <100 / Apnea", desc: "PPV at 40–60 breaths/min", action: "SpO2 + ECG. MR SOPA if not improving.", color: t.org },
    { n: 4, title: "HR <60 despite PPV", desc: "PPV + Chest Compressions 3:1", action: "Consider intubation. Reassess q60s.", color: t.red },
    { n: 5, title: "HR still <60", desc: "Epinephrine", action: "IV 0.01–0.03 mg/kg. ET 0.05–0.1 mg/kg. Volume 10 mL/kg NS.", color: t.red },
  ];
  return (
    <Page title="NRP Algorithm" onBack={onBack}>
      {steps.map(x => (
        <Fragment key={x.n}>
          <div style={{ ...s.card, marginTop: 8, borderLeft: `4px solid ${x.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}><span style={{ width: 28, height: 28, borderRadius: "50%", background: x.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: s.sz(12), flexShrink: 0 }}>{x.n}</span><div style={{ fontWeight: 700, fontSize: s.sz(14), color: x.color }}>{x.title}</div></div>
            <div style={{ fontSize: s.sz(12), color: t.text2, marginBottom: 4 }}>{x.desc}</div>
            <div style={{ fontSize: s.sz(12), fontWeight: 500, lineHeight: 1.6 }}>{x.action}</div>
          </div>
          {x.n === 3 && <div style={{ ...s.info(t.org), marginTop: 8 }}><strong>MR SOPA:</strong> Mask · Reposition · Suction · Open mouth · Pressure ↑ · Airway alternative</div>}
        </Fragment>
      ))}
      <div style={s.secT}>Cord Clamping</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.7 }}>Delay ≥30–60s for vigorous infants.</div></div>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// EQUIPMENT ESTIMATES
// ═══════════════════════════════════════════════════════════════════════
function EquipmentEstimates({ onBack }) {
  const t = useT(); const s = useS();
  return (
    <Page title="Equipment Estimates" onBack={onBack}>
      <div style={{ ...s.card, padding: 0, overflow: "hidden", marginTop: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: s.sz(11) }}><thead><tr><th style={s.tH}>GA</th><th style={s.tH}>Wt (g)</th><th style={s.tH}>ETT</th><th style={s.tH}>Depth</th></tr></thead><tbody>
          {[["23–24","500–600","2.5","5.5"],["25–26","700–800","2.5","6.0"],["27–29","900–1000","2.5","6.5"],["30–32","1100–1400","2.5–3.0","7.0"],["33–34","1500–1800","3.0","7.5"],["35–37","1800–2500","3.0–3.5","8.0"],["38–40","2500–3100","3.5","8.5"],[">40",">3100","3.5–4.0","9.0"]].map(([g,w,e,d],i) => <tr key={g} style={{ background: i%2===0?t.surfaceSolid:t.bg3 }}><td style={{ ...s.tC, fontWeight: 600, ...(i === 0 && { borderTop: `1px solid ${t.border}` }) }}>{g}</td><td style={{ ...s.tC, ...(i === 0 && { borderTop: `1px solid ${t.border}` }) }}>{w}</td><td style={{ ...s.tC, fontWeight: 700, color: t.acc, ...(i === 0 && { borderTop: `1px solid ${t.border}` }) }}>{e}</td><td style={{ ...s.tC, fontWeight: 700, color: t.org, ...(i === 0 && { borderTop: `1px solid ${t.border}` }) }}>{d}</td></tr>)}
        </tbody></table>
      </div>
      <div style={s.secT}>Formulas</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}><strong>Lip-to-tip:</strong> Wt (kg) + 6<br/><strong>Nasal:</strong> Wt (kg) + 7<br/><strong>Blade:</strong> Miller 0 (preterm), Miller 1 (term)</div></div>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// RESUSCITATION MEDS
// ═══════════════════════════════════════════════════════════════════════
function ResuscMeds({ onBack }) {
  const t = useT(); const s = useS();
  const wts = ["0.5 kg", "1 kg", "2 kg", "3 kg", "4 kg"];
  const thC = { ...s.tH, fontSize: s.sz(10), padding: "8px 5px" };
  const tdC = { ...s.tC, fontSize: s.sz(11), padding: "7px 5px", lineHeight: 1.4 };
  const tdH = { ...tdC, fontWeight: 700, textAlign: "left", paddingLeft: 8, background: t.mode === "dark" ? t.bg3 + "80" : "#F1F5F9" };
  return (
    <Page title="NRP Meds" onBack={onBack}>
      <div style={{ ...s.secT, marginTop: 14 }}>Epinephrine IV/IO</div>
      <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", background: t.mode === "dark" ? t.red + "20" : "#FEF2F2", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ fontSize: s.sz(12), fontWeight: 700, color: t.red }}>Dose: 0.02 mg/kg (= 0.2 mL/kg)</div>
          <div style={{ fontSize: s.sz(11), color: t.text2, marginTop: 2 }}>Concentration: 0.1 mg/mL (1 mg/10 mL)</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 360 }}>
            <thead><tr><th style={thC}></th>{wts.map(w => <th key={w} style={thC}>{w}</th>)}</tr></thead>
            <tbody>
              <tr><td style={tdH}>IV Dose</td><td style={tdC}>0.01 mg</td><td style={tdC}>0.02 mg</td><td style={tdC}>0.04 mg</td><td style={tdC}>0.06 mg</td><td style={tdC}>0.08 mg</td></tr>
              <tr><td style={tdH}>Volume</td><td style={tdC}>0.1 mL</td><td style={tdC}>0.2 mL</td><td style={tdC}>0.4 mL</td><td style={tdC}>0.6 mL</td><td style={tdC}>0.8 mL</td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 14px", fontSize: s.sz(11), color: t.text2, borderTop: `1px solid ${t.border}`, lineHeight: 1.6 }}>
          <strong style={{ color: t.text }}>Administration:</strong> IV/IO rapid push. Flush with 3 mL NS. Repeat every 3–5 minutes if heart rate less than 60 bpm.
        </div>
      </div>

      {/* Epinephrine ETT */}
      <div style={s.secT}>Epinephrine ETT</div>
      <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", background: t.mode === "dark" ? t.org + "20" : "#FFFBEB", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ fontSize: s.sz(12), fontWeight: 700, color: t.org }}>Dose: 0.1 mg/kg (= 1 mL/kg)</div>
          <div style={{ fontSize: s.sz(11), color: t.text2, marginTop: 2 }}>Concentration: 0.1 mg/mL (1 mg/10 mL)</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 360 }}>
            <thead><tr><th style={thC}></th>{wts.map(w => <th key={w} style={thC}>{w}</th>)}</tr></thead>
            <tbody>
              <tr><td style={tdH}>ET Dose</td><td style={tdC}>0.05 mg</td><td style={tdC}>0.1 mg</td><td style={tdC}>0.2 mg</td><td style={tdC}>0.3 mg</td><td style={tdC}>0.4 mg</td></tr>
              <tr><td style={tdH}>Volume</td><td style={tdC}>0.5 mL</td><td style={tdC}>1 mL</td><td style={tdC}>2 mL</td><td style={tdC}>3 mL</td><td style={tdC}>4 mL</td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 14px", fontSize: s.sz(11), color: t.text2, borderTop: `1px solid ${t.border}`, lineHeight: 1.6 }}>
          <strong style={{ color: t.text }}>Administration:</strong> May administer while vascular access is being established. ETT rapid push. No need for flush. Provide PPV breaths to distribute into lungs.
        </div>
      </div>

      {/* Normal Saline */}
      <div style={s.secT}>Normal Saline IV</div>
      <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", background: t.mode === "dark" ? t.acc + "20" : "#EFF6FF", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ fontSize: s.sz(12), fontWeight: 700, color: t.acc }}>Dose: 10 mL/kg — 0.9% NaCl</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 360 }}>
            <thead><tr><th style={thC}></th>{wts.map(w => <th key={w} style={thC}>{w}</th>)}</tr></thead>
            <tbody>
              <tr><td style={tdH}>Volume</td><td style={tdC}>5 mL IV</td><td style={tdC}>10 mL IV</td><td style={tdC}>20 mL IV</td><td style={tdC}>30 mL IV</td><td style={tdC}>40 mL IV</td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 14px", fontSize: s.sz(11), color: t.text2, borderTop: `1px solid ${t.border}`, lineHeight: 1.6 }}>
          <strong style={{ color: t.text }}>Administration:</strong> Give over 5–10 min.
        </div>
      </div>

      {/* Footnotes */}
      <div style={{ ...s.card, marginTop: 16, fontSize: s.sz(10), lineHeight: 1.7, color: t.text3 }}>
        <div>*IV/IO recommended dose range: 0.01–0.03 mg/kg (= 0.1–0.3 mL/kg).</div>
        <div style={{ marginTop: 4 }}>*ETT recommended dose range: 0.05–0.1 mg/kg (= 0.5–1 mL/kg).</div>
        <div style={{ marginTop: 6, fontStyle: "italic" }}>These suggested epinephrine doses are based on a desire to simplify dosing for educational efficiency and do not endorse any particular dose within the recommended dosing range.</div>
        <div style={{ marginTop: 6, fontWeight: 600, color: t.text2 }}>Source: NRP 8th Edition Code Medications Card</div>
      </div>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CODE MEDS (ICN — from Neonatal Code Meds Orderset)
// ═══════════════════════════════════════════════════════════════════════
function CodeMeds({ onBack }) {
  const t = useT(); const s = useS();
  return (
    <Page title="Code Meds" onBack={onBack}>

      <div style={{ ...s.info(t.acc), marginTop: 14 }}><strong>Source:</strong> Neonatal Code Resuscitation Meds Orderset</div>

      {/* IV Fluids */}
      <div style={s.secT}>IV Fluids</div>
      <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", background: t.mode === "dark" ? t.acc + "20" : "#EFF6FF", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ fontSize: s.sz(12), fontWeight: 700, color: t.acc }}>D10 Bolus</div>
          <div style={{ fontSize: s.sz(11), color: t.text2, marginTop: 2 }}>2 mL/kg IV one time for hypoglycemia</div>
        </div>
        <div style={{ padding: "10px 14px" }}>
          <div style={{ fontSize: s.sz(12), fontWeight: 700, color: t.acc }}>Normal Saline Bolus</div>
          <div style={{ fontSize: s.sz(11), color: t.text2, marginTop: 2 }}>10 mL/kg IV one time — infuse over 10 minutes</div>
        </div>
      </div>

      {/* UAC/UVC Fluids */}
      <div style={s.secT}>UAC / UVC Fluids</div>
      <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ fontSize: s.sz(12), fontWeight: 700, color: t.tea }}>UAC Fluid</div>
          <div style={{ fontSize: s.sz(11), color: t.text2, marginTop: 2 }}>NS with 1 unit heparin/mL — 1 mL/hr</div>
        </div>
        <div style={{ padding: "10px 14px" }}>
          <div style={{ fontSize: s.sz(12), fontWeight: 700, color: t.tea }}>UVC Fluid</div>
          <div style={{ fontSize: s.sz(11), color: t.text2, marginTop: 2 }}>D10W with 0.5 units heparin/mL — per TF of 80 mL/kg/day</div>
        </div>
      </div>

      {/* Antibiotics */}
      <div style={s.secT}>Antibiotics</div>
      <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
        {[
          { name: "Acyclovir", dose: "20 mg/kg IV" },
          { name: "Ampicillin", dose: "100 mg/kg/dose IV" },
          { name: "Gentamicin", dose: "4 mg/kg/dose IV", sub: "GA ≥35 wk, PNA ≤7 days" },
          { name: "Gentamicin", dose: "4.5 mg/kg/dose IV", sub: "GA 30–34 wk, PNA 0–7 days" },
          { name: "Gentamicin", dose: "4 mg/kg/dose IV", sub: "GA ≤29 wk, PNA 0–7 days" },
          { name: "Vancomycin", dose: "10 mg/kg/dose IV" },
        ].map((med, i, arr) => (
          <div key={i} style={{ padding: "10px 14px", borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : "none" }}>
            <div style={{ fontSize: s.sz(12), fontWeight: 700, color: t.org }}>{med.name}</div>
            <div style={{ fontSize: s.sz(11), color: t.text2, marginTop: 2 }}>{med.dose}</div>
            {med.sub && <div style={{ fontSize: s.sz(10), color: t.text3, marginTop: 1, fontStyle: "italic" }}>{med.sub}</div>}
          </div>
        ))}
      </div>

      {/* Medications */}
      <div style={s.secT}>Medications</div>
      <div style={{ ...s.card, padding: 0, overflow: "hidden" }}>
        {[
          { name: "Adenosine", dose: "0.1 mg/kg IV rapid push (max 6 mg)", sub: "If ineffective: 0.2 mg/kg (max 12 mg)" },
          { name: "Calcium Gluconate 10%", dose: "100–200 mg/kg/dose IV" },
          { name: "Dobutamine", dose: "2–25 mcg/kg/min IV continuous infusion", sub: "Titrate to desired response" },
          { name: "Dopamine", dose: "2–20 mcg/kg/min IV continuous infusion", sub: "Titrate to desired response" },
          { name: "Epinephrine (0.1 mg/mL)", dose: "0.02 mg/kg IV", sub: "May repeat every 3–5 min. Flush with 3 mL NS." },
          { name: "Glucose Gel (2.25 mL)", dose: "0.5 mL/kg buccal PRN hypoglycemia" },
          { name: "Lorazepam", dose: "0.05–0.1 mg/kg slow IV push", sub: "May repeat based on clinical response" },
          { name: "Naloxone", dose: "0.1 mg/kg IV (max 2 mg)", sub: "Repeat every 2–3 min if needed" },
          { name: "Phenobarbital", dose: "Loading: 20 mg/kg IV", sub: "Additional 10 mg/kg q20–30 min PRN (max total 40 mg/kg)" },
          { name: "Poractant alfa (Curosurf)", dose: "2.5 mL/kg intratracheal", sub: "Initial dose" },
          { name: "Vecuronium", dose: "0.1 mg/kg IV", sub: "Maintenance: 0.03–0.15 mg/kg q1–2h PRN paralysis" },
        ].map((med, i, arr) => (
          <div key={i} style={{ padding: "10px 14px", borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : "none" }}>
            <div style={{ fontSize: s.sz(12), fontWeight: 700, color: t.red }}>{med.name}</div>
            <div style={{ fontSize: s.sz(11), color: t.text2, marginTop: 2 }}>{med.dose}</div>
            {med.sub && <div style={{ fontSize: s.sz(10), color: t.text3, marginTop: 1, fontStyle: "italic" }}>{med.sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: 16, fontSize: s.sz(9), color: t.text3 }}>Neonatal Code Meds Orderset · Updated 5/11/23</div>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// EARLY ONSET SEPSIS
// ═══════════════════════════════════════════════════════════════════════
function EOSSection({ onBack }) {
  const t = useT(); const s = useS();
  return (
    <Page title="Early Onset Sepsis" onBack={onBack}>
      <div style={s.secT}>Maternal Risk Factors</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>• Intrapartum fever ≥38.0°C or chorioamnionitis<br/>• GBS positive with inadequate intrapartum antibiotic prophylaxis<br/>• Rupture of membranes ≥18 hours<br/>• Preterm labor<br/>• Prior infant with invasive GBS disease</div></div>
      <div style={s.secT}>Neonatal Risk Factors</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>• Prematurity and very low birth weight<br/>• Fetal tachycardia<br/>• Meconium-stained amniotic fluid<br/>• Apgar score 0–3 at 5 minutes</div></div>
      <div style={s.secT}>Evaluation Approaches</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>• <strong>Categorical risk assessment:</strong> Threshold-based algorithm. Any risk factor crossed → observation or antibiotics.<br/>• <strong>Multivariate (Sepsis Calculator):</strong> Uses GA, temp, GBS, ROM, IAP type to estimate infection probability.<br/>• <strong>Enhanced clinical observation:</strong> Serial exams regardless of risk. Treat only if clinical signs develop.</div></div>
      <div style={s.info(t.tea)}><strong>Calculator:</strong> <a href="https://neonatalsepsiscalculator.kaiserpermanente.org/InfectionProbabilityCalculator.aspx" target="_blank" rel="noopener noreferrer" style={{ color: t.tea }}>neonatalsepsiscalculator.kaiserpermanente.org</a></div>
      <div style={s.secT}>Labs</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>• <strong>Blood culture:</strong> Gold standard. Obtain before starting antibiotics. Allow 36–48 hrs for incubation.<br/>• <strong>CBC with differential:</strong> WBC &lt;5,000 is concerning. I:T ratio &gt;0.3 suggests infection.<br/>• <strong>CRP:</strong> Adjunct to guide duration of therapy. A single normal CRP does not rule out infection.</div></div>
      <div style={s.secT}>Empiric Therapy</div><div style={{ ...s.card, borderLeft: `4px solid ${t.tea}` }}><div style={{ fontWeight: 700, fontSize: s.sz(14), color: t.tea }}>Ampicillin + Gentamicin</div><div style={{ fontSize: s.sz(12), lineHeight: 1.8, marginTop: 6 }}><strong>Amp:</strong> 50 mg/kg IV q12h (meningitis: 100 mg/kg)<br/><strong>Gent:</strong> 4–5 mg/kg IV q24–48h (interval by GA)<br/><br/>Discontinue at 36–48 hrs if cultures negative and infant is well.</div></div>
      <div style={s.info(t.org)}><strong>Stewardship:</strong> Prolonged empiric antibiotics without positive culture → ↑ NEC, candidiasis, resistance.</div>
      <div style={{ fontSize: s.sz(11), color: t.text3, marginTop: 10, padding: "0 16px", fontStyle: "italic", lineHeight: 1.6 }}>AAP Clinical Report: Management of Neonates Born at ≥35 Weeks' Gestation With Suspected or Proven Early-Onset Bacterial Sepsis (2018).</div>
    </Page>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ROUTINE NEWBORN CARE + ALL SUB-PAGES
// ═══════════════════════════════════════════════════════════════════════
function RoutineNewborn({ onBack, onNav }) {
  const t = useT();
  return (<Page title="Maternal Factors" onBack={onBack}><div style={{ marginTop: 12 }}><MenuList items={[
    { id: "infections", label: "Maternal Infections", desc: "GBS, PROM, Hep B/C, HIV, HSV, Syphilis", icon: <Bug size={18} />, color: t.tea },
    { id: "maternal_conditions", label: "Maternal Conditions", desc: "Diabetes, HTN, Thyroid, Substance use", icon: <PersonStanding size={18} />, color: t.pur },
    { id: "obstetric", label: "Obstetric & Birth Factors", desc: "Delivery mode, meconium, meds", icon: <Hospital size={18} />, color: t.acc },
  ]} onTap={onNav} /></div></Page>);
}

function ImageViewer({ pages, activePage, onClose, onPageChange }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const pinchStart = useRef(null);
  const panStart = useRef(null);
  const lastTranslate = useRef({ x: 0, y: 0 });
  const swipeStartX = useRef(0);
  const swipeStartY = useRef(0);
  const isSwiping = useRef(false);

  // Reset transform when page changes
  useEffect(() => { setScale(1); setTranslate({ x: 0, y: 0 }); lastTranslate.current = { x: 0, y: 0 }; }, [activePage]);

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStart.current = { dist: Math.sqrt(dx * dx + dy * dy), scale };
      isSwiping.current = false;
    } else if (e.touches.length === 1) {
      if (scale > 1) {
        panStart.current = { x: e.touches[0].clientX - translate.x, y: e.touches[0].clientY - translate.y };
        isSwiping.current = false;
      } else {
        swipeStartX.current = e.touches[0].clientX;
        swipeStartY.current = e.touches[0].clientY;
        isSwiping.current = true;
        panStart.current = null;
      }
    }
  }, [scale, translate]);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && pinchStart.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const newScale = Math.min(Math.max(pinchStart.current.scale * (dist / pinchStart.current.dist), 1), 5);
      setScale(newScale);
      if (newScale === 1) { setTranslate({ x: 0, y: 0 }); lastTranslate.current = { x: 0, y: 0 }; }
    } else if (e.touches.length === 1 && panStart.current && scale > 1) {
      e.preventDefault();
      const nx = e.touches[0].clientX - panStart.current.x;
      const ny = e.touches[0].clientY - panStart.current.y;
      setTranslate({ x: nx, y: ny });
      lastTranslate.current = { x: nx, y: ny };
    }
  }, [scale]);

  const onTouchEnd = useCallback((e) => {
    pinchStart.current = null;
    if (isSwiping.current && pages.length > 1 && scale <= 1) {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - swipeStartX.current;
      const dy = Math.abs(touch.clientY - swipeStartY.current);
      if (Math.abs(dx) > 60 && dy < 100) {
        if (dx < 0 && activePage < pages.length - 1) onPageChange(activePage + 1);
        else if (dx > 0 && activePage > 0) onPageChange(activePage - 1);
      }
    }
    panStart.current = null;
    isSwiping.current = false;
  }, [pages.length, activePage, onPageChange, scale]);

  const onDoubleTap = useCallback(() => {
    if (scale > 1) { setScale(1); setTranslate({ x: 0, y: 0 }); lastTranslate.current = { x: 0, y: 0 }; }
    else { setScale(2.5); }
  }, [scale]);
  const lastTap = useRef(0);
  const handleTap = useCallback((e) => {
    const now = Date.now();
    if (now - lastTap.current < 300) { e.preventDefault(); onDoubleTap(); }
    lastTap.current = now;
  }, [onDoubleTap]);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: "rgba(0,0,0,0.92)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "54px 16px 10px" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {pages.length > 1 && pages.map((_, i) => (
            <button key={i} onClick={() => onPageChange(i)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: activePage === i ? "#8B5CF6" : "rgba(255,255,255,0.15)", color: "#fff", border: "none", cursor: "pointer" }}>Page {i + 1}</button>
          ))}
        </div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
      </div>
      {pages.length > 1 && <div style={{ display: "flex", justifyContent: "center", gap: 6, paddingBottom: 8 }}>
        {pages.map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: activePage === i ? "#fff" : "rgba(255,255,255,0.3)", transition: "background 0.2s" }} />)}
      </div>}
      <div ref={containerRef} style={{ flex: 1, overflow: "hidden", touchAction: "none", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px 20px" }}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onClick={handleTap}>
        <img src={`${import.meta.env.BASE_URL.replace(/\/$/,'')}${pages[activePage]}`} alt={`Page ${activePage + 1}`} style={{ width: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8, transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`, transition: scale === 1 ? "transform 0.2s ease" : "none", userSelect: "none", WebkitUserSelect: "none", pointerEvents: "none" }} draggable={false} />
      </div>
    </div>
  );
}

function InfectionCard({ title, bullets, reference, extraContent, topContent, t, s, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  const liS = { fontSize: s.sz(12), lineHeight: 1.75, marginBottom: 6, paddingLeft: 4 };
  const subLiS = { fontSize: s.sz(11.5), lineHeight: 1.7, marginBottom: 4, paddingLeft: 2, color: t.text2 };
  return (
    <div style={{ ...s.card, marginTop: 10, padding: 0, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 10 }}>
        <div style={{ fontWeight: 700, fontSize: s.sz(14), color: t.text, fontFamily: '"Poppins", sans-serif', flex: 1 }}>{title}</div>
        <div style={{ fontSize: 16, color: t.text3, transition: "transform 0.25s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>▼</div>
      </button>
      {open && (
        <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${t.border}` }}>
          {topContent}
          <ul style={{ margin: 0, paddingLeft: 18, paddingTop: 12 }}>
            {bullets.map((b, i) => <li key={i} style={liS}>{b.text || b}{b.sub && (
              <ul style={{ margin: "4px 0 2px", paddingLeft: 16, listStyleType: "disc" }}>
                {b.sub.map((sb, j) => <li key={j} style={subLiS}>{sb}</li>)}
              </ul>
            )}</li>)}
          </ul>
          {extraContent}
          <div style={{ fontSize: s.sz(11), color: t.text3, marginTop: 10, fontStyle: "italic", lineHeight: 1.6, borderTop: `1px solid ${t.border}`, paddingTop: 8 }}>{reference}</div>
        </div>
      )}
    </div>
  );
}

function MaternalInfections({ onBack, highlight }) {
  const t = useT(); const s = useS();
  const [showAlgo, setShowAlgo] = useState(false);
  return (
    <Page title="Maternal Infections" onBack={onBack}>
      {showAlgo && <ImageViewer pages={["/syphilis-algorithm.png"]} activePage={0} onClose={() => setShowAlgo(false)} onPageChange={() => {}} />}

      <InfectionCard t={t} s={s} title="Group B Streptococcus (GBS)" reference='See AAP Clinical Report: "Management of Infants at Risk for Group B Streptococcal Disease" (Puopolo et al., Pediatrics 2019).' bullets={[
        <span><strong>Adequate prophylaxis:</strong> Penicillin G, ampicillin, or cefazolin given at least 4 hours before delivery. Clindamycin or vancomycin alone are not adequate for neonatal risk assessment.</span>,
        <span><a href="https://neonatalsepsiscalculator.kaiserpermanente.org/InfectionProbabilityCalculator.aspx" target="_blank" rel="noopener noreferrer" style={{ color: t.tea, fontWeight: 600 }}>Open Neonatal Sepsis Calculator →</a></span>,
        { text: <span><strong>Enhanced Observation approach:</strong></span>, sub: [
          <span>Signs of illness at birth → blood cultures and empiric antibiotics. Consider lumbar puncture for critically ill infants.</span>,
          <span>Maternal temp ≥38°C or inadequate GBS prophylaxis → serial exams and vital signs for 36 to 48 hours. Cultures and antibiotics only if signs of illness develop.</span>,
          <span>No risk factors → routine newborn care.</span>,
        ]},
      ]} />

      <InfectionCard t={t} s={s} title="Prolonged Rupture of Membranes (PROM)" bullets={[
        <span><strong>Definition:</strong> Membranes ruptured for 18 hours or more before delivery.</span>,
        <span><strong>Enhanced observation:</strong> Consider Q4 vital signs; consider monitoring for 36 to 48 hours minimum before discharge.</span>,
        <span><strong>Maternal fever or intraamniotic infection:</strong> Monitor with Q4 vital signs and evaluate for sepsis with a CBC, blood culture, and consideration of empiric antibiotics depending on sepsis risk score and clinical status. May obtian CRP at 12 hours of age and again the following day. <a href="https://neonatalsepsiscalculator.kaiserpermanente.org/InfectionProbabilityCalculator.aspx" target="_blank" rel="noopener noreferrer" style={{ color: t.tea, fontWeight: 600 }}>Open Neonatal Sepsis Calculator →</a></span>,
      ]} />

      <InfectionCard t={t} s={s} title="Hepatitis B" defaultOpen={highlight === "hepb"} reference='See AAP Red Book' bullets={[
        { text: <span><strong>Birthing parent HBsAg positive:</strong></span>, sub: [
          <span>All newborns at all birth weights: Hepatitis B vaccine <strong>and</strong> HBIG within 12 hours of birth.</span>,
        ]},
        { text: <span><strong>Birthing parent HBsAg negative:</strong></span>, sub: [
          <span>Birth weight ≥2000 g: Hepatitis B vaccine within 24 hours of birth.</span>,
          <span>Birth weight &lt;2000 g: Hepatitis B vaccine at 1 month of age or at hospital discharge, whichever is first.</span>,
        ]},
        { text: <span><strong>Birthing parent HBsAg unknown:</strong></span>, sub: [
          <span>All newborns at all birth weights: Hepatitis B vaccine within 12 hours of birth.</span>,
          <span>Birth weight ≥2000 g: Give HBIG within 7 days of birth if parent's status is confirmed positive, or by 7 days of life or at hospital discharge (whichever is first) if status remains unknown.</span>,
          <span>Birth weight &lt;2000 g: Give HBIG within 12 hours of birth unless parent's status is confirmed negative by that time.</span>,
        ]},
        <span><strong>Note:</strong> For newborns with birth weight &lt;2000 g, the birth dose will not count toward total doses in the series.</span>,
        <span><strong>Follow-up testing:</strong> Check HBsAg and anti-HBs at 9 to 12 months of age to confirm the infant is protected and not infected.</span>,
        <span><strong>Breastfeeding:</strong> Safe and should be encouraged once the infant has received the vaccine and HBIG.</span>,
      ]} />

      <InfectionCard t={t} s={s} title="Hepatitis C" reference="See AAP Red Book" bullets={[
        <span><strong>No prophylaxis available:</strong> There is currently no vaccine or postexposure prophylaxis for hepatitis C. The goal is early identification of infected infants.</span>,
        <span><strong>Testing:</strong> Hepatitis C RNA (HCV RNA) at 2 to 6 months of age, and/or hepatitis C antibody (anti-HCV) at 18 months or older. Antibody testing before 18 months is unreliable due to maternal antibodies.</span>,
        <span><strong>Breastfeeding:</strong> Considered safe unless the mother has cracked or bleeding nipples.</span>,
        <span><strong>Referral:</strong> Infants who test positive should be referred to pediatric gastroenterology for monitoring and potential treatment.</span>,
      ]} />

      <InfectionCard t={t} s={s} title="HIV" reference="See AAP Red Book and the HHS Perinatal HIV Guidelines for detailed risk stratification and antiretroviral prophylaxis regimens." bullets={[
        <span><strong>Timing:</strong> Antiretroviral therapy should be started within 6 hours of birth. Consult infectious diseases STAT.</span>,
        <span><strong>Low risk</strong> (mother on antiretroviral therapy with suppressed viral load): Zidovudine (ZDV) for 4 weeks.</span>,
        <span><strong>High risk</strong> (detectable viral load near delivery, no prenatal care, or new diagnosis at delivery): Three-drug regimen of zidovudine, lamivudine, and nevirapine.</span>,
        <span><strong>Breastfeeding:</strong> Not recommended in resource-rich settings due to the risk of postnatal transmission.</span>,
        <span><strong>Testing schedule:</strong> HIV PCR at birth, 14 to 21 days, 1 to 2 months, and 4 to 6 months.</span>,
      ]} />

      <InfectionCard t={t} s={s} title="Herpes Simplex Virus (HSV)" reference='See AAP Red Book' bullets={[
        <span><strong>Delivery:</strong> Cesarean delivery is recommended if active genital lesions are present at the time of delivery.</span>,
        { text: <span><strong>Asymptomatic infant — mother with known recurrent HSV:</strong></span>, sub: [
          <span>Obtain surface cultures (conjunctivae, mouth, nasopharynx, rectum — may combine into one viral transport tube) and HSV blood PCR at approximately 24 hours of life.</span>,
          <span>Preemptive acyclovir is not required if the infant remains well-appearing.</span>,
        ]},
        { text: <span><strong>Asymptomatic infant — mother with no history of genital herpes but lesions at delivery (possible primary infection):</strong></span>, sub: [
          <span>Send maternal HSV-1 and HSV-2 type-specific IgG to determine if the outbreak is primary versus recurrent.</span>,
          <span>Full infant evaluation: surface viral cultures, HSV blood PCR, lumbar puncture with CSF HSV PCR, and serum ALT.</span>,
          <span>Start IV acyclovir (60 mg/kg/day divided every 8 hours) pending results.</span>,
        ]},
        <span><strong>Symptomatic infant:</strong> If the infant develops any concerning signs (fever, lethargy, vesicles, seizures, irritability, thrombocytopenia), perform a full diagnostic evaluation and start IV acyclovir immediately.</span>,
        <span><strong>Warning signs:</strong> Neonatal HSV can present as skin/eye/mouth disease (45%), CNS disease (30%), or disseminated disease (25%) — early recognition and treatment are critical.</span>,
      ]} />

      <InfectionCard t={t} s={s} title="Syphilis" reference='See AAP Red Book (2024–2027), Syphilis chapter, and CDC STI Treatment Guidelines for the complete evaluation and treatment algorithm.' bullets={[
        { text: <span><strong>Evaluation of the infant (maternal reactive serology):</strong></span>, sub: [
          <span>Infant RPR or VDRL (quantitative, to compare with maternal titer)</span>,
          <span>CBC with differential and platelets</span>,
          <span>CSF analysis (cell count, protein) and CSF VDRL</span>,
          <span>Long-bone radiographs</span>,
          <span>Liver function tests and other clinically indicated studies (chest radiograph, eye exam, auditory brainstem response)</span>,
        ]},
        { text: <span><strong>Treatment — Confirmed or probable congenital syphilis:</strong></span>, sub: [
          <span>Aqueous crystalline penicillin G: 50,000 units/kg IV every 12 hours for the first 7 days of life, then every 8 hours, for a total of 10 days.</span>,
        ]},
        { text: <span><strong>Treatment — Less likely congenital syphilis (normal evaluation, adequate maternal treatment):</strong></span>, sub: [
          <span>Benzathine penicillin G: 50,000 units/kg IM as a single dose.</span>,
          <span>If any part of the evaluation is abnormal, not performed, or follow-up is uncertain, treat with the full 10-day IV penicillin G course instead.</span>,
        ]},
        <span><strong>Adequate maternal treatment:</strong> Completion of a stage-appropriate penicillin regimen at least 30 days before delivery, with a documented decline in titers.</span>,
        <span><strong>Infant follow-up:</strong> Repeat the infant's RPR or VDRL every 2 to 3 months after treatment until nonreactive. The infant's titers should decline by 3 months and be nonreactive by 6 months if adequately treated.</span>,
      ]} topContent={
        <div style={{ padding: "12px 0 4px" }}><button onClick={() => setShowAlgo(true)} className="btn-link" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 14, background: `${t.tea}12`, border: `1px solid ${t.tea}30`, color: t.tea, fontWeight: 600, fontSize: s.sz(13), cursor: "pointer" }}><FileText size={16} /> View Syphilis Algorithm</button></div>
      } />

    </Page>
  );
}

function MaternalConditions({ onBack }) {
  const t = useT(); const s = useS();
  return (
    <Page title="Maternal Conditions" onBack={onBack}>

      <InfectionCard t={t} s={s} title="Infant of a Diabetic Mother (IDM)" reference="See AAP guidelines on neonatal hypoglycemia screening for glucose management protocols." bullets={[
        { text: <span><strong>Risks to the newborn:</strong></span>, sub: [
          <span>Hypoglycemia (screen per institutional glucose protocol)</span>,
          <span>Macrosomia and birth injury</span>,
          <span>Polycythemia and hyperviscosity</span>,
          <span>Hypocalcemia and hypomagnesemia</span>,
          <span>Hyperbilirubinemia</span>,
          <span>Hypertrophic cardiomyopathy</span>,
        ]},
        <span><strong>Glucose screening:</strong> Begin within 1 hour of birth per protocol. See the Blood Glucose Screening section for the full pathway.</span>,
        <span><strong>Echocardiogram:</strong> Consider if the infant develops respiratory distress, a murmur, or signs of heart failure.</span>,
      ]} />

      <InfectionCard t={t} s={s} title="Hypertension / Pre-eclampsia" bullets={[
        <span><strong>Growth restriction:</strong> Infants may be small for gestational age due to chronic placental insufficiency. Plot birth weight on Fenton or appropriate growth chart.</span>,
        { text: <span><strong>Neonatal risks:</strong></span>, sub: [
          <span>Thrombocytopenia and neutropenia (may persist for several days)</span>,
          <span>Hypoglycemia (especially if mother received labetalol)</span>,
        ]},
        { text: <span><strong>Maternal medication effects on the newborn:</strong></span>, sub: [
          <span>Magnesium sulfate: may cause hypotonia, respiratory depression, and poor feeding in the first 24 to 48 hours</span>,
          <span>Labetalol: may cause bradycardia and hypoglycemia</span>,
        ]},
      ]} />

      <InfectionCard t={t} s={s} title="Thyroid — Hyperthyroidism (Graves' Disease)" reference={`See van der Kaay et al., "Management of Neonates Born to Mothers With Graves' Disease" (Pediatrics, 2016) for the complete algorithm.`} bullets={[
        { text: <span><strong>Risk stratification:</strong></span>, sub: [
          <span>Maternal TRAb positive or unknown in the 2nd or 3rd trimester → infant is "at risk" and requires monitoring</span>,
          <span>Maternal TRAb negative → low-risk newborn, no specific thyroid follow-up needed</span>,
        ]},
        { text: <span><strong>Testing schedule for at-risk infants:</strong></span>, sub: [
          <span>Day of life 1: history and physical examination; send TRAb in cord blood if assay is available</span>,
          <span>Day of life 3 to 5: repeat history and physical; send fT4 and TSH; if abnormal, see treatment below</span>,
          <span>Day of life 10 to 14: repeat history and physical; repeat fT4 and TSH; send TRAb if not yet done</span>,
        ]},
        <span><strong>If TRAb negative and infant asymptomatic with normal thyroid function:</strong> No further thyroid-specific follow-up is needed.</span>,
        { text: <span><strong>Signs of neonatal hyperthyroidism:</strong></span>, sub: [
          <span>Tachycardia, irritability, poor weight gain, diarrhea, flushing</span>,
          <span>Goiter, stare or eyelid retraction, warm moist skin, small fontanelle</span>,
          <span>Severe cases: heart failure, hypertension, respiratory distress</span>,
        ]},
        { text: <span><strong>Treatment of neonatal hyperthyroidism:</strong></span>, sub: [
          <span>Methimazole (MMI): 0.2 to 0.5 mg/kg/day divided in 2 doses</span>,
          <span>Sympathetic hyperactivity: add propranolol 2 mg/kg/day in 2 doses for 1 to 2 weeks</span>,
          <span>Refractory or hemodynamically unstable: Lugol solution 1 drop (0.05 mL) 3 times daily or potassium iodide 1 drop daily, given at least 1 hour after the first MMI dose</span>,
          <span>Treatment duration is typically 1 to 2 months as TRAb clears from the infant's circulation</span>,
        ]},
        <span><strong>Note:</strong> Maternal antithyroid drugs can delay presentation of neonatal hyperthyroidism. Follow the same testing schedule even if the mother was treated during pregnancy.</span>,
      ]} />

      <InfectionCard t={t} s={s} title="Thyroid — Hypothyroidism" reference="See AAP and state newborn screening guidelines for congenital hypothyroidism management." bullets={[
        <span><strong>Newborn screening:</strong> All infants are screened via the state newborn screen (typically TSH-based). Results are usually available within 1 to 2 weeks of life.</span>,
        { text: <span><strong>Signs of congenital hypothyroidism:</strong></span>, sub: [
          <span>Poor feeding, lethargy, prolonged jaundice, hypotonia</span>,
          <span>Dry skin, large fontanelle, distended abdomen, umbilical hernia</span>,
          <span>Reduced linear growth</span>,
        ]},
        <span><strong>Treatment:</strong> Levothyroxine 10 to 15 μg/kg/day, started as soon as the diagnosis is confirmed. Early treatment is essential for normal neurodevelopment.</span>,
        <span><strong>Infants born to mothers with Graves' disease:</strong> Central or primary hypothyroidism can also occur in these infants due to transplacental passage of TSH-receptor blocking antibodies. Monitor fT4 and TSH at the same intervals as for hyperthyroidism risk.</span>,
      ]} />

      <InfectionCard t={t} s={s} title="Substance Use" reference="See AAP Clinical Report on NOWS, the Eat Sleep Console model, and AAP policy on contraindications to breastfeeding." bullets={[
        { text: <span><strong>Safety of mother's milk:</strong></span>, sub: [
          <span><strong>Safe:</strong> Stable methadone or buprenorphine maintenance without active illicit use. May reduce NOWS severity.</span>,
          <span><strong>Contraindicated:</strong> Active cocaine, PCP, or illicit stimulant use. Relapse into illicit drug use within 30 days of delivery.</span>,
          <span><strong>Case-by-case:</strong> Marijuana — AAP recommends against due to limited infant safety data.</span>,
          <span><strong>HIV:</strong> Contraindicated in resource-rich settings. <strong>Hep C:</strong> avoid if cracked or bleeding nipples.</span>,
        ]},
        { text: <span><strong>Suggested minimum observation:</strong></span>, sub: [
          <span>Opioid-exposed infants: minimum 3 to 5 days (longer-acting opioids such as methadone may require 5 to 7 days)</span>,
          <span>Stimulant-exposed (cocaine, amphetamines): 24 to 48 hours for acute toxicity signs</span>,        ]},
        { text: <span><strong>Eat Sleep Console (ESC) for NOWS:</strong></span>, sub: [
          <span><strong>Eat:</strong> Can the infant eat at least 1 oz or breastfeed well?</span>,
          <span><strong>Sleep:</strong> Can the infant sleep at least 1 hour undisturbed?</span>,
          <span><strong>Console:</strong> Can the infant be consoled within 10 minutes?</span>,
          <span>Non-pharmacologic first: swaddling, skin-to-skin, low stimulation, rooming-in. If ESC criteria consistently not met, start morphine or methadone per institutional protocol.</span>,
        ]},
      ]} />

    </Page>
  );
}

function ObstetricFactors({ onBack }) {
  const t = useT(); const s = useS();
  return (
    <Page title="Obstetric & Birth Factors" onBack={onBack}>

      <InfectionCard t={t} s={s} title="Delivery Mode" bullets={[
        { text: <span><strong>Vaginal delivery:</strong></span>, sub: [
          <span>Lower risk of transient tachypnea of the newborn (TTN)</span>,
          <span>Operative vaginal delivery (forceps or vacuum): monitor for cephalohematoma, caput succedaneum, and subgaleal hemorrhage</span>,
        ]},
        { text: <span><strong>Cesarean delivery:</strong></span>, sub: [
          <span>Without labor: increased risk of TTN due to delayed lung fluid clearance</span>,
          <span>Monitor respiratory status closely in the first 2 to 4 hours</span>,
        ]},
        <span><strong>Subgaleal hemorrhage:</strong> Can present with a fluctuant, boggy scalp swelling that crosses suture lines. This is a medical emergency — monitor for pallor, tachycardia, and falling hematocrit.</span>,
      ]} />

      <InfectionCard t={t} s={s} title="Meconium-Stained Amniotic Fluid" bullets={[
        <span><strong>Vigorous infant:</strong> Routine care. Suctioning of the airway is not required.</span>,
        <span><strong>Non-vigorous infant:</strong> Begin standard resuscitation steps (warmth, stimulation, PPV if needed). Routine intubation for tracheal suctioning is no longer recommended.</span>,
        { text: <span><strong>Monitor for meconium aspiration syndrome (MAS):</strong></span>, sub: [
          <span>Respiratory distress (tachypnea, grunting, retractions) within the first hours of life</span>,
          <span>May require supplemental oxygen, CPAP, or mechanical ventilation</span>,
          <span>Chest radiograph if symptomatic: hyperinflation with patchy opacities</span>,
        ]},
      ]} />

      <InfectionCard t={t} s={s} title="Maternal Medications at Delivery" bullets={[
        { text: <span><strong>Opioids</strong> (given during labor for pain):</span>, sub: [
          <span>May cause respiratory depression, decreased tone, and poor feeding</span>,
          <span>Naloxone is generally not recommended in neonatal resuscitation per NRP</span>,
        ]},
        { text: <span><strong>Magnesium sulfate:</strong></span>, sub: [
          <span>Hypotonia, respiratory depression, and poor feeding in the first 24 to 48 hours</span>,
          <span>Effects are dose-dependent and self-limited</span>,
        ]},
        { text: <span><strong>SSRIs / SNRIs:</strong></span>, sub: [
          <span>Neonatal adaptation syndrome: jitteriness, irritability, poor feeding, and respiratory distress in the first few days</span>,
          <span>Usually mild and self-limited. Supportive care only.</span>,
        ]},
        <span><strong>Beta-blockers</strong> (labetalol, propranolol): may cause neonatal bradycardia and hypoglycemia. Monitor heart rate and glucose.</span>,
        <span><strong>General anesthesia:</strong> May cause transient respiratory depression and decreased tone at birth.</span>,
      ]} />

    </Page>
  );
}

function NeonatalMeds({ onBack, onNav }) {
  const t = useT(); const s = useS();
  const [showVkdb, setShowVkdb] = useState(null);
  return (<Page title="Newborn Medications" onBack={onBack}>
    {showVkdb !== null && <ImageViewer pages={["/vkdb-factsheet-p1.png", "/vkdb-factsheet-p2.png"]} activePage={showVkdb} onClose={() => setShowVkdb(null)} onPageChange={setShowVkdb} />}

    <InfectionCard t={t} s={s} title="Vitamin K (Phytonadione)" reference="AAP Policy Statement: Prevention of Vitamin K Deficiency Bleeding in Newborns." bullets={[
      <span><strong>Dose:</strong> 1 mg IM for term infants. 0.3 to 0.5 mg/kg IM for preterm infants under 1500 grams.</span>,
      <span><strong>Timing:</strong> Within the first 6 hours of life.</span>,
      <span><strong>Purpose:</strong> Prevents vitamin K deficiency bleeding (VKDB), including late-onset hemorrhagic disease which can cause intracranial hemorrhage.</span>,
      <span><strong>Route:</strong> Intramuscular injection is the preferred route. Oral vitamin K is not recommended due to unreliable absorption and inferior protection against late VKDB.</span>,
      <span><strong>If parents decline:</strong> A provider must personally review the refusal with the family. Provide the VKDB Fact Sheet (below), counsel on the risk of life-threatening bleeding including intracranial hemorrhage, and recommend reconsideration. Document the discussion and refusal in the medical record.</span>,
    ]} extraContent={
      <div style={{ padding: "32px 16px 32px" }}><button onClick={() => setShowVkdb(0)} className="btn-link" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 14, background: `${t.org}12`, border: `1px solid ${t.org}30`, color: t.org, fontWeight: 600, fontSize: s.sz(13), cursor: "pointer" }}><FileText size={16} /> View VKDB Fact Sheet</button></div>
    } />

    <InfectionCard t={t} s={s} title="Hepatitis B Vaccine" reference="See AAP Red Book for the complete birth dose algorithm." bullets={[
      <span><strong>Dose:</strong> 0.5 mL intramuscular.</span>,
      <span><strong>Timing:</strong> Within 12 hours of birth for all medically stable infants weighing 2000 grams or more.</span>,
      <span><strong>Maternal HBsAg positive or unknown:</strong> Administer vaccine plus HBIG (0.5 mL IM) at a different injection site as soon as possible.</span>,
      <span><strong>Low birth weight (under 2000 g):</strong> If maternal HBsAg negative, delay first dose until 1 month of age or hospital discharge.</span>,
      <span><strong>See also:</strong> <a onClick={(e) => { e.stopPropagation(); onNav && onNav("infections", { highlight: "hepb" }); }} style={{ color: t.tea, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Maternal Hepatitis B</a> in Maternal Infections for the full birth dose algorithm by maternal status.</span>,
    ]} />

    <InfectionCard t={t} s={s} title="Erythromycin Eye Ointment" bullets={[
      <span><strong>Dose:</strong> 0.5% erythromycin ophthalmic ointment, a 1 cm ribbon in each eye.</span>,
      <span><strong>Timing:</strong> Within 24 hours of life, sooner being ideal.</span>,
      <span><strong>Purpose:</strong> Prophylaxis against gonococcal ophthalmia neonatorum. Required by law in most states.</span>,
      <span><strong>Note:</strong> Does not prevent chlamydial conjunctivitis. If chlamydia exposure is suspected, systemic treatment is needed.</span>,
    ]} />

    <InfectionCard t={t} s={s} title="Beyfortus (Nirsevimab)" reference="AAP Policy: Updated Guidance for Palivizumab and Nirsevimab for RSV Prevention (2023)." bullets={[
      <span><strong>Dose:</strong> 50 mg IM if under 5 kg. 100 mg IM if 5 kg or greater.</span>,
      <span><strong>Timing:</strong> Single dose before the infant's first RSV season.</span>,
      <span><strong>Eligibility:</strong> All infants under 8 months entering their first RSV season, and select high-risk infants aged 8 to 19 months entering their second season.</span>,
      <span><strong>Duration:</strong> Provides approximately 5 months of passive immunity via a monoclonal antibody against RSV F protein.</span>,
    ]} />

  </Page>);
}

function Feeding({ onBack }) {
  const t = useT(); const s = useS();
  return (<Page title="Feeding" onBack={onBack}>
    <div style={s.secT}>Breastfeeding</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>Place skin-to-skin and encourage the first feed within 1 hour of birth. Feed on demand, approximately every 2–3 hours (8–12 times per day).<br/><br/><strong>Expected intake:</strong> Day 1: 2–5 mL/feed (colostrum) → Day 3–4: 30–60 mL/feed as milk transitions in.<br/><br/><strong>Adequate intake signs:</strong> Audible swallowing, 4+ wet diapers and 3+ stools by day 4.<br/><br/><strong>Weight loss:</strong> Acceptable loss is &lt;7% by day 3. Greater than 10% warrants evaluation of feeding adequacy.</div></div>
    <div style={s.secT}>Donor Milk</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>When the mother's own milk is unavailable and supplementation is needed. Start with ≥5 mL per supplemental feed. Verbal consent is typically required per institutional policy. Use pasteurized donor human milk from an accredited milk bank (e.g., HMBANA).</div></div>
    <div style={s.secT}>Formula</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>Standard: 20 kcal/oz, iron-fortified. Appropriate for most term newborns when human milk is not available. Consider specialized formulas if concern for cow's milk protein allergy, malabsorption, or metabolic disorders.</div></div>
    <div style={s.info(t.grn)}><a href="https://www.ncbi.nlm.nih.gov/books/NBK501922/" target="_blank" rel="noopener noreferrer" style={{ color: t.grn, fontWeight: 700 }}>LactMed →</a> Drug safety in breastfeeding</div>
    <div style={{ fontSize: s.sz(11), color: t.text3, marginTop: 10, padding: "0 16px", fontStyle: "italic", lineHeight: 1.6 }}>AAP Policy Statement: Breastfeeding and the Use of Human Milk (2022).</div>
  </Page>);
}

function VoidingStooling({ onBack }) {
  const t = useT(); const s = useS();
  return (<Page title="Voiding & Stooling" onBack={onBack}>
    <div style={{ ...s.card, padding: 0, overflow: "hidden", marginTop: 14 }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: s.sz(11) }}><thead><tr><th style={s.tH}>Day</th><th style={s.tH}>Wet</th><th style={s.tH}>Stools</th><th style={s.tH}>Type</th></tr></thead><tbody>
      {[["1","1+","1+","Meconium"],["2","2+","1–2","Transitional"],["3","3+","2+","Green/brown"],["4","4+","3+","Yellow, seedy"],["5–7","6+","3–4+","Soft, formed"]].map(([d,w,st,ty],i) => <tr key={d} style={{ background: i%2===0?t.surfaceSolid:t.bg3 }}><td style={{ ...s.tC, fontWeight: 600 }}>{d}</td><td style={s.tC}>{w}</td><td style={s.tC}>{st}</td><td style={{ ...s.tC, fontSize: s.sz(10), textAlign: "left", paddingLeft: 8 }}>{ty}</td></tr>)}
    </tbody></table></div>
    <div style={s.info(t.org)}><strong>Red flags:</strong> No urine by 24 hrs (dehydration, renal anomaly, posterior urethral valves). No stool by 48 hrs (consider Hirschsprung, meconium ileus). Brick dust urine after day 3 (inadequate intake).</div>
  </Page>);
}

function BilirubinSection({ onBack }) {
  const t = useT(); const s = useS();
  return (<Page title="Bilirubin" onBack={onBack}>
    <div style={{ padding: "32px 16px 12px" }}><button onClick={() => window.open("https://bilitool.org/", "_blank")} className="btn-link" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 14, background: `${t.ylw}12`, border: `1px solid ${t.ylw}30`, color: t.ylw, fontWeight: 600, fontSize: s.sz(13), cursor: "pointer" }}><FileText size={16} /> Open BiliTool</button></div>
    <div style={s.secT}>Risk Factors</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>• Jaundice in the first 24 hours (always pathologic)<br/>• ABO/Rh incompatibility + positive DAT<br/>• GA 35–36 weeks (immature hepatic conjugation)<br/>• Prior sibling with phototherapy<br/>• Cephalohematoma or significant bruising<br/>• Exclusive breastfeeding with suboptimal intake<br/>• East Asian race</div></div>
    <div style={s.secT}>Screening</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>Predischarge TcB or TSB for all infants. Plot on the hour-specific Bhutani nomogram. Schedule follow-up based on risk zone — high-risk infants should be seen within 1 day of discharge.</div></div>
    <div style={s.secT}>Management</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}><strong>Phototherapy:</strong> Initiate when TSB reaches the hour-specific threshold for gestational age and risk factors.<br/><br/><strong>Exchange transfusion:</strong> Consider if TSB approaches exchange level despite intensive phototherapy, or if signs of acute bilirubin encephalopathy (lethargy, hypotonia, poor feeding, high-pitched cry).</div></div>
    <div style={{ fontSize: s.sz(11), color: t.text3, marginTop: 10, padding: "0 16px", fontStyle: "italic", lineHeight: 1.6 }}>AAP Clinical Practice Guideline: Management of Hyperbilirubinemia in the Newborn Infant (2022 Revision).</div>
  </Page>);
}

function HearingScreen({ onBack }) {
  const t = useT(); const s = useS();
  return (<Page title="Hearing Screen" onBack={onBack}>
    <div style={s.secT}>Method</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>Otoacoustic emissions (OAE) or auditory brainstem response (ABR) before hospital discharge.</div></div>
    <div style={s.secT}>1-3-6 Benchmarks</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>• Screen by <strong>1 month</strong> of age<br/>• Diagnostic audiology evaluation by <strong>3 months</strong> if failed<br/>• Intervention (amplification, early intervention services) by <strong>6 months</strong></div></div>
    <div style={s.info(t.pnk)}><strong>Failed screen:</strong> Refer for outpatient diagnostic ABR. Do not delay — early identification and intervention are critical for language development.</div>
    <div style={{ fontSize: s.sz(11), color: t.text3, marginTop: 10, padding: "0 16px", fontStyle: "italic", lineHeight: 1.6 }}>Joint Committee on Infant Hearing (JCIH) Position Statement (2019).</div>
  </Page>);
}

function AdditionalScreenings({ onBack }) {
  const t = useT(); const s = useS();
  return (<Page title="Additional Screenings" onBack={onBack}>

    <InfectionCard t={t} s={s} title="Congenital CMV Screening" reference="AAP: Congenital Cytomegalovirus Infection Screening and Management." bullets={[
      <span><strong>When to test:</strong> Any infant who fails the newborn hearing screen should be tested for congenital CMV before 21 days of life.</span>,
      <span><strong>Method:</strong> CMV PCR on saliva or urine. Saliva is preferred for ease of collection, but a positive result should be confirmed with urine.</span>,
      <span><strong>Why it matters:</strong> CMV is the leading non-genetic cause of sensorineural hearing loss in children. Hearing loss may be present at birth or develop progressively.</span>,
      <span><strong>Treatment consideration:</strong> Valganciclovir may be considered for symptomatic congenital CMV with CNS involvement, including hearing loss. Refer to pediatric infectious disease.</span>,
    ]} />

    <InfectionCard t={t} s={s} title="Fetal Pelviectasis" bullets={[
      <span><strong>Definition:</strong> Dilation of the renal pelvis (anteroposterior diameter 4 mm or greater on prenatal ultrasound). Also referred to as prenatal hydronephrosis.</span>,
      { text: <span><strong>Postnatal evaluation:</strong></span>, sub: [
        <span>Renal and bladder ultrasound after 48 hours of life (earlier imaging may underestimate dilation due to physiologic dehydration)</span>,
        <span>If prenatal dilation was bilateral or severe (APD ≥10 mm), obtain ultrasound sooner and consider voiding cystourethrogram (VCUG)</span>,
      ]},
      { text: <span><strong>Grading (Society for Fetal Urology):</strong></span>, sub: [
        <span>Mild (APD 4–7 mm): Postnatal ultrasound at 1 to 4 weeks. Most resolve spontaneously.</span>,
        <span>Moderate (APD 7–10 mm): Postnatal ultrasound within the first week. Follow-up imaging at 1 to 3 months.</span>,
        <span>Severe (APD ≥10 mm): Postnatal ultrasound within the first few days. VCUG to evaluate for vesicoureteral reflux. Consider pediatric urology referral.</span>,
      ]},
      <span><strong>Antibiotic prophylaxis:</strong> May be considered for moderate to severe dilation or confirmed reflux, per institutional protocol. Commonly amoxicillin 20 mg/kg/day in a single daily dose.</span>,
      <span><strong>Counseling:</strong> Most mild cases resolve by 12 to 18 months. Emphasize the importance of follow-up imaging even if the infant appears well.</span>,
    ]} />

  </Page>);
}

function CCHDScreen({ onBack }) {
  const t = useT(); const s = useS();
  return (<Page title="CCHD Screening" onBack={onBack}>
    <div style={{ ...s.info(t.acc), marginTop: 14 }}><strong>At 24–48 hrs</strong> or before discharge. Right hand (preductal) + either foot (postductal).</div>
    {[{ r: "PASS", c: "Both ≥95% AND difference ≤3%", color: t.grn, bg: t.grnL },{ r: "REPEAT", c: "Either site 90–94%, OR difference >3%. Rescreen in 1 hr (×3 max).", color: t.org, bg: t.orgL },{ r: "FAIL", c: "Either site <90%, OR 3 failed screens. Notify MD → echocardiogram.", color: t.red, bg: t.redL }].map(x => <div key={x.r} style={{ ...s.card, background: x.bg, marginTop: 8 }}><div style={{ fontWeight: 800, fontSize: s.sz(15), color: x.color }}>{x.r}</div><div style={{ fontSize: s.sz(12), marginTop: 2 }}>{x.c}</div></div>)}
    <div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.7 }}>Does NOT detect all CHD — lesions without significant desaturation (coarctation, small VSDs) may be missed. False positives can occur with transitional physiology or hypothermia. Clinical exam remains essential: auscultate for murmurs, assess pulses in all four extremities.</div></div>
    <div style={{ fontSize: s.sz(11), color: t.text3, marginTop: 10, padding: "0 16px", fontStyle: "italic", lineHeight: 1.6 }}>AAP/AHA: Endorsement of HHS Recommendation for Pulse Oximetry Screening for CCHD.</div>
  </Page>);
}

function NewbornScreen({ onBack }) {
  const t = useT(); const s = useS();
  return (<Page title="Newborn Screen" onBack={onBack}>
    <div style={s.secT}>Timing</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>Collect at <strong>24–48 hours of life</strong>, ideally after the first feed (amino acid detection requires protein intake). If discharged before 24 hrs, collect before discharge and repeat outpatient. Second screen at 1–2 weeks per state guidelines.</div></div>
    <div style={s.secT}>California NBS Panel</div><div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>• Amino acid disorders (PKU, MSUD)<br/>• Fatty acid oxidation disorders (MCADD, VLCADD)<br/>• Organic acid disorders<br/>• Hemoglobinopathies (sickle cell disease)<br/>• Congenital hypothyroidism<br/>• Congenital adrenal hyperplasia (CAH)<br/>• Cystic fibrosis<br/>• Galactosemia · Biotinidase deficiency<br/>• SCID · SMA · X-ALD · MPS I · Pompe</div></div>
    <div style={s.info(t.acc)}><a href="https://www.cdph.ca.gov/Programs/CFH/DGDS/Pages/nbs/default.aspx" target="_blank" rel="noopener noreferrer" style={{ color: t.acc, fontWeight: 700 }}>CA NBS Program →</a> Full panel and follow-up protocols</div>
  </Page>);
}

// ═══════════════════════════════════════════════════════════════════════
// COMPLICATIONS
// ═══════════════════════════════════════════════════════════════════════
function ComplicationsNav({ onBack, onNav }) {
  const t = useT();
  return (<Page title="Other Complications" onBack={onBack}><div style={{ marginTop: 12 }}><MenuList items={[
    { id: "hypothermia", label: "Hypothermia", desc: "Prevention & management", icon: <Thermometer size={18} />, color: t.acc },
    { id: "ttn", label: "TTN", desc: "Transient tachypnea", icon: <Wind size={18} />, color: t.tea },
    { id: "extracranial", label: "Extracranial Injuries", desc: "Birth trauma scalp injuries", icon: <CircleAlert size={18} />, color: t.red },
  ]} onTap={onNav} /></div></Page>);
}

function Hypothermia({ onBack }) {
  const t = useT(); const s = useS();
  return (<Page title="Hypothermia" onBack={onBack}>

    <InfectionCard t={t} s={s} title="Temperature Classification (WHO)" reference="WHO: Thermal Protection of the Newborn — A Practical Guide." bullets={[
      <span><strong>Normal:</strong> 36.5 to 37.5°C (97.7 to 99.5°F).</span>,
      <span><strong>Cold stress (mild hypothermia):</strong> 36.0 to 36.4°C (96.8 to 97.5°F).</span>,
      <span><strong>Moderate hypothermia:</strong> 32.0 to 35.9°C (89.6 to 96.6°F).</span>,
      <span><strong>Severe hypothermia:</strong> Below 32.0°C (89.6°F).</span>,
    ]} />

    <InfectionCard t={t} s={s} title="Prevention" bullets={[
      <span><strong>Delivery room temperature:</strong> Maintain at 25°C (77°F) or higher.</span>,
      <span><strong>Immediately after birth:</strong> Dry thoroughly, place skin-to-skin, and cover with a warm blanket and hat.</span>,
      <span><strong>Delay bath:</strong> Wait at least 12 to 24 hours after birth.</span>,
      <span><strong>Extremely preterm (under 32 weeks):</strong> Place in a polyethylene bag or wrap (without drying first) to reduce evaporative heat loss.</span>,
    ]} />

    <InfectionCard t={t} s={s} title="Management" bullets={[
      <span><strong>Rewarming rate:</strong> Increase temperature by no more than 0.5°C per hour to avoid apnea and arrhythmia.</span>,
      <span><strong>Methods:</strong> Skin-to-skin contact, radiant warmer, or incubator depending on severity.</span>,
      <span><strong>Monitor glucose:</strong> Hypothermia increases metabolic demand and can cause hypoglycemia.</span>,
      <span><strong>Consider underlying cause:</strong> If hypothermia is persistent or recurrent, evaluate for sepsis, endocrine abnormalities (hypothyroidism, adrenal insufficiency), or CNS pathology.</span>,
    ]} />

  </Page>);
}

function NOWS({ onBack }) {
  const t = useT(); const s = useS();
  return (<Page title="NOWS / ESC" onBack={onBack}>

    <InfectionCard t={t} s={s} title="Eat, Sleep, Console (ESC) Assessment" reference="Grossman, M. et al. 'An Initiative to Improve the Quality of Care of Infants With Neonatal Abstinence Syndrome.' Pediatrics (2017)." bullets={[
      <span><strong>ESC replaces Finnegan scoring</strong> as the preferred functional assessment for neonatal opioid withdrawal syndrome.</span>,
      { text: <span><strong>Can the infant EAT?</strong></span>, sub: [
        <span>Taking 1 ounce or more per feed (or breastfeeding effectively)</span>,
        <span>Coordinated suck and swallow</span>,
      ]},
      { text: <span><strong>Can the infant SLEEP?</strong></span>, sub: [
        <span>Sleeping at least 1 hour undisturbed between care times</span>,
      ]},
      { text: <span><strong>Can the infant be CONSOLED?</strong></span>, sub: [
        <span>Consoled within 10 minutes using non-pharmacologic measures (swaddling, holding, rocking)</span>,
      ]},
      <span><strong>If all three are met:</strong> Continue non-pharmacologic care. If consistently unmet despite optimized supportive measures, consider pharmacologic therapy.</span>,
    ]} />

    <InfectionCard t={t} s={s} title="Non-Pharmacologic Management (First Line)" bullets={[
      <span><strong>Environment:</strong> Low-light, low-stimulation room. Minimize handling and noise.</span>,
      <span><strong>Comfort:</strong> Swaddling, skin-to-skin contact, pacifier, gentle rocking.</span>,
      <span><strong>Feeding:</strong> Small, frequent feeds. Breastfeeding encouraged when not contraindicated (see Maternal Conditions — Substance Use).</span>,
      <span><strong>Rooming-in:</strong> Keeping the infant with the parent improves outcomes and reduces length of stay.</span>,
    ]} />

    <InfectionCard t={t} s={s} title="Pharmacologic Therapy" reference="AAP Clinical Report: Neonatal Opioid Withdrawal Syndrome (2020)." bullets={[
      <span><strong>First-line:</strong> Morphine sulfate 0.04 to 0.08 mg/kg orally every 3 to 4 hours.</span>,
      <span><strong>Weaning:</strong> Once ESC criteria are consistently met for 24 to 48 hours, wean by 10 to 20% of the dose every 24 to 48 hours.</span>,
      <span><strong>Adjunctive agents:</strong> Clonidine or phenobarbital may be added for refractory symptoms or polysubstance exposure.</span>,
      <span><strong>Goal:</strong> Functional comfort (eating, sleeping, consolable) — not elimination of all withdrawal signs.</span>,
    ]} />

  </Page>);
}

function TTN({ onBack }) {
  const t = useT(); const s = useS();
  return (<Page title="Transient Tachypnea of the Newborn" onBack={onBack}>

    <InfectionCard t={t} s={s} title="Risk Factors and Pathophysiology" bullets={[
      <span><strong>Strongest risk factor:</strong> Cesarean delivery without labor. Labor triggers catecholamine release, which activates epithelial sodium channels (ENaC) to clear fetal lung fluid.</span>,
      <span><strong>Other risk factors:</strong> Male sex, macrosomia, maternal diabetes, lower gestational age, and family history of asthma.</span>,
      <span><strong>Mechanism:</strong> Delayed clearance of fetal lung fluid results in transient pulmonary edema and respiratory distress.</span>,
    ]} />

    <InfectionCard t={t} s={s} title="Clinical Features" bullets={[
      <span><strong>Onset:</strong> Respiratory distress within the first hours of life, typically improving by 24 to 72 hours.</span>,
      <span><strong>Signs:</strong> Tachypnea (respiratory rate 60 to 100+), nasal flaring, mild retractions, grunting, and a barrel-shaped chest appearance.</span>,
      <span><strong>Natural course of grunting:</strong> Resolves in approximately 68% of infants by 30 minutes and 93% by 2 hours.</span>,
    ]} />

    <InfectionCard t={t} s={s} title="Diagnosis" bullets={[
      <span><strong>TTN is a diagnosis of exclusion.</strong> Must rule out respiratory distress syndrome (RDS), pneumonia, pneumothorax, and congenital heart disease.</span>,
      <span><strong>Chest radiograph (if obtained):</strong> Perihilar streaking, fluid in the interlobar fissures, and mild hyperinflation. Findings typically resolve within 48 to 72 hours.</span>,
    ]} />

    <InfectionCard t={t} s={s} title="Management" bullets={[
      <span><strong>Supportive care:</strong> Supplemental oxygen to maintain SpO2 of 92% or higher. CPAP if needed for persistent distress.</span>,
      <span><strong>Feeding:</strong> NPO if respiratory rate exceeds 60 to 80 due to aspiration risk. Initiate IV fluids as needed.</span>,
      <span><strong>Diuretics are not indicated</strong> and have not been shown to be beneficial.</span>,
      <span><strong>Empiric antibiotics:</strong> Consider if sepsis cannot be excluded based on clinical picture and risk factors.</span>,
    ]} />

  </Page>);
}

function ExtracranialInjuries({ onBack }) {
  const t = useT(); const s = useS();
  const [showImg, setShowImg] = useState(false);
  return (
    <Page title="Extracranial Injuries" onBack={onBack}>
      {showImg && <ImageViewer pages={["/extracranial-injuries.jpg"]} activePage={0} onClose={() => setShowImg(false)} onPageChange={() => {}} />}

      <div style={{ padding: "32px 16px 12px" }}><button onClick={() => setShowImg(true)} className="btn-link" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 14, background: `${t.red}12`, border: `1px solid ${t.red}30`, color: t.red, fontWeight: 600, fontSize: s.sz(13), cursor: "pointer" }}><FileText size={16} /> View Anatomy Diagram</button></div>

      <InfectionCard t={t} s={s} title="Caput Succedaneum" bullets={[
        <span><strong>What it is:</strong> Soft, diffuse swelling of the scalp caused by pressure against the dilating cervix during labor. It crosses suture lines.</span>,
        <span><strong>Appearance:</strong> Boggy, pitting edema that may extend across the midline. Often present at birth. May include bruising or petechiae.</span>,
        <span><strong>Course:</strong> Benign and self-resolving, typically within 24 to 48 hours. No treatment needed.</span>,
        <span><strong>Key distinction:</strong> Crosses suture lines (unlike cephalohematoma). Not fluctuant.</span>,
      ]} />

      <InfectionCard t={t} s={s} title="Cephalohematoma" bullets={[
        <span><strong>What it is:</strong> Subperiosteal collection of blood. Confined to a single cranial bone because the periosteum is tightly bound at suture lines.</span>,
        <span><strong>Appearance:</strong> Firm, well-circumscribed swelling that does not cross suture lines. May not be apparent until hours after birth and can enlarge over the first day.</span>,
        { text: <span><strong>Monitoring:</strong></span>, sub: [
          <span>Track head circumference to detect expansion</span>,
          <span>Monitor for jaundice — resorption of the hematoma increases bilirubin load</span>,
          <span>Rarely associated with underlying linear skull fracture</span>,
        ]},
        <span><strong>Course:</strong> Resolves over 2 weeks to 3 months. Do not aspirate — risk of infection. May calcify if large.</span>,
      ]} />

      <InfectionCard t={t} s={s} title="Subgaleal Hemorrhage" reference="This is a medical emergency. If suspected, escalate care immediately." bullets={[
        <span><strong>What it is:</strong> Bleeding into the potential space between the periosteum and the galea aponeurotica. This space can hold a significant volume of blood (up to 260 mL).</span>,
        <span><strong>Risk factors:</strong> Vacuum-assisted delivery is the strongest risk factor. Also associated with forceps delivery and coagulopathy.</span>,
        <span><strong>Appearance:</strong> Fluctuant, boggy swelling that crosses suture lines and may shift with repositioning. Swelling increases over hours.</span>,
        { text: <span><strong>Warning signs:</strong></span>, sub: [
          <span>Increasing head circumference</span>,
          <span>Pallor, tachycardia, hypotension</span>,
          <span>Falling hematocrit</span>,
        ]},
        { text: <span><strong>Management:</strong></span>, sub: [
          <span>Serial head circumference measurements (every 2 to 4 hours initially)</span>,
          <span>Serial hemoglobin and hematocrit</span>,
          <span>Type and crossmatch — transfusion may be required</span>,
          <span>Coagulation studies and correction of any coagulopathy</span>,
          <span>Volume resuscitation as needed</span>,
        ]},
      ]} />

    </Page>
  );
}

function TherapeuticHypothermia({ onBack, onNav }) {
  const t = useT(); const s = useS();
  return (<Page title="HIE" onBack={onBack}>
    <div style={{ padding: "32px 16px 12px" }}><button onClick={() => onNav("sarnat")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 14, background: `${t.org}12`, border: `1px solid ${t.org}30`, color: t.org, fontWeight: 600, fontSize: s.sz(13), cursor: "pointer" }}><Brain size={16} /> Modified Sarnat Exam</button></div>
    <div style={s.secT}>Eligibility Criteria</div>
    <div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>
      <strong>Time window:</strong> Must be initiated within 6 hours of birth.<br/><br/>
      <strong>Step 1 — Perinatal criteria</strong> (at least one):<br/>
      • Gestational age ≥36 weeks and birth weight ≥1800 g<br/>
      • Acute perinatal event (abruption, cord prolapse, uterine rupture)<br/>
      • Cord or postnatal pH ≤7.0, or base excess −16 or worse<br/>
      • Apgar ≤5 at 10 minutes, or continued need for ventilation at 10 min<br/><br/>
      <strong>Step 2 — Neurologic exam</strong> (Modified Sarnat):<br/>
      • Moderate or severe encephalopathy in ≥3 of 6 categories
    </div></div>
    <div style={s.secT}>Cooling Protocol</div>
    <div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>
      • <strong>Target temperature:</strong> 33.5°C ± 0.5°C (whole-body cooling)<br/>
      • <strong>Duration:</strong> 72 hours of active cooling<br/>
      • <strong>Rewarming:</strong> Increase by no more than 0.5°C/hr over 6–12 hours<br/>
      • <strong>Continuous monitoring:</strong> Temperature, heart rate, blood pressure, and pulse oximetry throughout cooling and rewarming
    </div></div>
    <div style={s.secT}>Monitoring During Cooling</div>
    <div style={s.card}><div style={{ fontSize: s.sz(12), lineHeight: 1.8 }}>
      • <strong>Neuromonitoring:</strong> Continuous aEEG or conventional EEG<br/>
      • <strong>Labs:</strong> ABG, glucose, electrolytes, LFTs, coagulation studies, lactate<br/>
      • <strong>Nutrition:</strong> NPO during cooling. Provide TPN and IV fluids.<br/>
      • <strong>Seizure management:</strong> Phenobarbital is first-line. Monitor for subclinical seizures on EEG.<br/>
      • <strong>MRI:</strong> Obtain brain MRI on day 4–7 of life for prognostic assessment
    </div></div>
    <div style={{ fontSize: s.sz(11), color: t.text3, marginTop: 10, padding: "0 16px", fontStyle: "italic", lineHeight: 1.6 }}>Shankaran, S. et al. "Whole-Body Hypothermia for Neonates with Hypoxic-Ischemic Encephalopathy." NEJM (2005). See also institutional cooling protocol.</div>
  </Page>);
}

// ═══════════════════════════════════════════════════════════════════════
// LINKS
// ═══════════════════════════════════════════════════════════════════════
function LinksSection() {
  const t = useT(); const s = useS();
  const links = [
    { name: "BiliTool", url: "https://bilitool.org/", desc: "Bilirubin nomogram", icon: <Sun size={18} />, color: t.ylw },
    { name: "CA Newborn Screening", url: "https://www.cdph.ca.gov/Programs/CFH/DGDS/Pages/nbs/default.aspx", desc: "California NBS", icon: <Hospital size={18} />, color: t.acc },
    { name: "Fenton 2025 Calculator", url: "https://peditools.org/fenton2025/", desc: "Preterm growth", icon: <TrendingUp size={18} />, color: t.grn },
    { name: "LactMed", url: "https://www.ncbi.nlm.nih.gov/books/NBK501922/", desc: "Drugs & Lactation", icon: <HandHeart size={18} />, color: t.pur },
    { name: "Sarnat Exam", url: "https://med.stanford.edu/stanfordmedicine25/the25/neonatal-encephalopathy-exam.html", desc: "Stanford Med 25", icon: <Brain size={18} />, color: t.red },
    { name: "Sepsis Calculator", url: "https://neonatalsepsiscalculator.kaiserpermanente.org/InfectionProbabilityCalculator.aspx", desc: "Kaiser EOS", icon: <Bug size={18} />, color: t.tea },
    { name: "Stanford Newborns", url: "https://med.stanford.edu/newborns.html", desc: "Nursery resources", icon: <Baby size={18} />, color: t.acc },
    { name: "NEWT", url: "https://newbornweight.org/", desc: "Weight loss tool", icon: <Scale size={18} />, color: t.org },
    { name: "PediTools", url: "https://peditools.org/", desc: "Growth calculators", icon: <BarChart3 size={18} />, color: t.pnk },
  ];
  return (
    <div><div style={{ ...s.hdr, paddingTop: 92 }}><div style={s.hdrT}>Links</div></div>
      <div style={s.cnt}><div style={{ ...s.menuList, marginTop: 14 }}>
        {links.map((lk, i) => <a key={lk.name} href={lk.url} target="_blank" rel="noopener noreferrer" style={{ ...s.mi, textDecoration: "none", color: t.text, borderBottom: i < links.length - 1 ? `1px solid ${t.border}` : "none" }}><div style={{ ...s.mIc, background: `${lk.color}18`, color: lk.color }}>{lk.icon}</div><div style={{ flex: 1 }}><div style={s.mLb}>{lk.name}</div><div style={s.mDs}>{lk.desc}</div></div><span style={{ ...s.chv, fontSize: s.sz(13) }}>↗</span></a>)}
      </div></div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// GUIDELINES
// ═══════════════════════════════════════════════════════════════════════
function GuidelinesSection() {
  const t = useT(); const s = useS();
  const g = [
    { title: "AAP Early-Onset Sepsis", org: "AAP", icon: <Bug size={18} />, color: t.tea, desc: "EOS risk assessment, Sepsis Calculator, empiric antibiotics." },
    { title: "AAP Hyperbilirubinemia", org: "AAP 2022", icon: <Sun size={18} />, color: t.ylw, desc: "Phototherapy thresholds, risk factors, bilirubin nomogram." },
    { title: "HIE / Encephalopathy", org: "JAMA Peds", icon: <Brain size={18} />, color: t.red, desc: "Sarnat staging, therapeutic hypothermia, neuroprotection." },
    { title: "Neonatal Hypoglycemia", org: "PIR", icon: <Droplets size={18} />, color: t.pur, desc: "Screening, glucose gel, monitoring protocols." },
    { title: "Transient Tachypnea", org: "PIR", icon: <Wind size={18} />, color: t.acc, desc: "Diagnosis of exclusion, supportive care." },
    { title: "Infants of Graves Mothers", org: "Pediatrics", icon: <Ribbon size={18} />, color: t.org, desc: "TRAb monitoring, thyroid function, treatment." },
  ];
  return (
    <div><div style={{ ...s.hdr, paddingTop: 92 }}><div style={s.hdrT}>Guidelines</div></div>
      <div style={s.cnt}>{g.map(item => <div key={item.title} style={{ ...s.card, marginTop: 10 }}><div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}><div style={{ ...s.mIc, background: `${item.color}18`, color: item.color }}>{item.icon}</div><div><div style={{ fontWeight: 700, fontSize: s.sz(13) }}>{item.title}</div><div style={{ fontSize: s.sz(10), color: t.text3 }}>{item.org}</div></div></div><div style={{ fontSize: s.sz(12), lineHeight: 1.6, color: t.text2 }}>{item.desc}</div></div>)}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// OPTIONS TAB
// ═══════════════════════════════════════════════════════════════════════
function OptionsTab({ themeMode, setThemeMode, largeText, setLargeText }) {
  const t = useT(); const s = useS();
  const modes = [{ k: "system", l: "System", icon: <Monitor size={16} /> }, { k: "light", l: "Light", icon: <Sun size={16} /> }, { k: "dark", l: "Dark", icon: <Moon size={16} /> }];
  const textSizes = [{ k: false, l: "Default" }, { k: true, l: "Large" }];
  return (
    <div>
      <div style={{ ...s.hdr, paddingTop: 92 }}><div style={s.hdrT}>Options</div></div>
      <div style={s.cnt}>
        <div style={s.secT}>Appearance</div>
        <div style={s.card}>
          <div style={{ fontWeight: 600, fontSize: s.sz(13), marginBottom: 12 }}>Theme</div>
          <div style={{ display: "flex", gap: 8 }}>
            {modes.map(m => (
              <button key={m.k} onClick={() => setThemeMode(m.k)} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 14,
                background: themeMode === m.k ? t.accL : "transparent",
                border: themeMode === m.k ? `2px solid ${t.acc}` : `1px solid ${t.border}`,
                cursor: "pointer", transition: "all 0.2s",
              }}>
                <span style={{ display: "flex", color: themeMode === m.k ? t.acc : t.text2 }}>{m.icon}</span>
                <span style={{ fontSize: s.sz(12), fontWeight: themeMode === m.k ? 700 : 500, color: themeMode === m.k ? t.acc : t.text2 }}>{m.l}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={s.card}>
          <div style={{ fontWeight: 600, fontSize: s.sz(13), marginBottom: 12 }}>Text Size</div>
          <div style={{ display: "flex", gap: 8 }}>
            {textSizes.map(sz => (
              <button key={String(sz.k)} onClick={() => setLargeText(sz.k)} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "14px 8px", borderRadius: 14,
                background: largeText === sz.k ? t.accL : "transparent",
                border: largeText === sz.k ? `2px solid ${t.acc}` : `1px solid ${t.border}`,
                cursor: "pointer", transition: "all 0.2s",
              }}>
                <span style={{ fontSize: sz.k ? 16 : 13, fontWeight: largeText === sz.k ? 700 : 500, color: largeText === sz.k ? t.acc : t.text2 }}>A</span>
                <span style={{ fontSize: s.sz(12), fontWeight: largeText === sz.k ? 700 : 500, color: largeText === sz.k ? t.acc : t.text2 }}>{sz.l}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={s.secT}>About</div>
        <div style={s.card}>
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ color: "#00E5CC", display: "flex" }}><Baby size={32} /></div>
              <div style={{ ...s.brand, fontSize: 30, letterSpacing: -0.5 }}>PoNG</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: '"Poppins", sans-serif', letterSpacing: -0.3, marginTop: 2, color: t.mode === "dark" ? "#F8FAFC" : "#334155" }}>Pocket Newborn Guide</div>
            <div style={{ fontSize: s.sz(12), color: t.text2, marginTop: 4 }}>Version 1.0</div>
            <div style={{ width: 40, height: 2, borderRadius: 1, background: t.mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)", margin: "16px auto" }} />
            <div style={{ fontSize: s.sz(14), fontWeight: 600, fontFamily: '"Poppins", sans-serif' }}>Created by Tendo Kironde, MD</div>
            <div style={{ fontSize: s.sz(12), color: t.text2, marginTop: 8, lineHeight: 1.6 }}>
              For educational purposes only.<br />
              Verify information independently.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// NAV PAGES
// ═══════════════════════════════════════════════════════════════════════
function NewbornHome({ onNav }) {
  const t = useT(); const s = useS();
  const quick = [{ id: "vitals", label: "Vitals", icon: <HeartPulse size={18} />, color: t.red },{ id: "apgar", label: "APGAR", icon: <ClipboardCheck size={18} />, color: t.acc },{ id: "fenton", label: "Fenton 2025", icon: <TrendingUp size={18} />, color: t.grn },{ id: "glucose", label: "Glucose Screening", icon: <Droplets size={18} />, color: t.pur }];
  const items = [
    { id: "delivery", label: "Delivery & NRP", desc: "APGAR, NRP, equipment", icon: <Hospital size={18} />, color: t.acc },
    { id: "routine", label: "Maternal Factors", desc: "Infections, conditions, obstetric", icon: <PersonStanding size={18} />, color: t.grn },
    { id: "neonatal_meds", label: "Neonatal Medications", desc: "Vit K, Hep B, Erythromycin, Beyfortus", icon: <Pill size={18} />, color: t.org },
    { id: "fenton", label: "Weights & Growth", desc: "Fenton 2025 cutoffs", icon: <TrendingUp size={18} />, color: t.tea },
    { id: "feeding", label: "Feeding", desc: "Breast, donor milk, formula", icon: <Milk size={18} />, color: t.grn },
    { id: "voiding", label: "Voiding & Stooling", desc: "Patterns by day of life", icon: <Droplets size={18} />, color: t.acc },
    { id: "bilirubin", label: "Bilirubin", desc: "Screening, phototherapy", icon: <Sun size={18} />, color: t.ylw },
    { id: "cchd", label: "CCHD Screen", desc: "Pulse oximetry", icon: <Heart size={18} />, color: t.red },
    { id: "hearing", label: "Hearing Screen", desc: "OAE, ABR, 1-3-6", icon: <Ear size={18} />, color: t.pnk },
    { id: "nbs", label: "Newborn Screen", desc: "Metabolic screening", icon: <TestTubes size={18} />, color: t.pur },
    { id: "glucose", label: "Glucose Screening", desc: "Hypoglycemia protocol", icon: <Droplets size={18} />, color: t.pur },
    { id: "additional_screenings", label: "Additional Screenings", desc: "CMV, pelviectasis", icon: <Search size={18} />, color: t.tea },
    { id: "complications", label: "Complications", desc: "Hypothermia, TTN, extracranial injuries", icon: <AlertTriangle size={18} />, color: t.ylw },
  ];
  return (
    <div>
      <div style={{ ...s.hdr, paddingTop: 92, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ color: "#00E5CC", display: "flex", filter: s.brand.filter }}><Baby size={32} /></div>
          <div style={{ ...s.hdrT, ...s.brand, fontSize: 30 }}>PoNG</div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, fontFamily: '"Poppins", sans-serif', letterSpacing: -0.3, marginTop: 2, color: t.mode === "dark" ? "#F8FAFC" : "#334155" }}>Pocket Newborn Guide</div>
      </div>
      <div style={s.cnt}>
        <SearchBar onNav={onNav} />
        <div style={s.secT}>Quick Tools</div>
        <div style={{ display: "flex", gap: 10, padding: "0 16px", overflowX: "auto" }}>
          {quick.map(q => (
            <div key={q.id} onClick={() => onNav(q.id)} style={{ flex: 1, minWidth: 0, textAlign: "center", cursor: "pointer", padding: "14px 10px", borderRadius: 16, background: t.cardBg, backdropFilter: "blur(10px)", border: `1px solid ${t.border}`, boxShadow: s.shadow, transition: "transform 0.15s" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${q.color}18`, color: q.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>{q.icon}</div>
              <div style={{ fontSize: s.sz(11), fontWeight: 600 }}>{q.label}</div>
            </div>
          ))}
        </div>
        <div style={s.secT}>Newborn</div>
        <MenuList items={items} onTap={onNav} />
      </div>
    </div>
  );
}

function DeliverySection({ onBack, onNav }) {
  const t = useT();
  return (<Page title="Delivery & NRP" onBack={onBack}><div style={{ marginTop: 12 }}><MenuList items={[
    { id: "apgar", label: "APGAR Calculator", desc: "1, 5, 10 min scores", icon: <ClipboardCheck size={18} />, color: t.acc },
    { id: "nrp", label: "NRP Algorithm", desc: "Resuscitation steps", icon: <Wind size={18} />, color: t.red },
    { id: "equipment", label: "Equipment", desc: "ETT sizing, blades", icon: <Wrench size={18} />, color: t.tea },
    { id: "resuscmeds", label: "NRP Meds", desc: "Epi, volume, NS", icon: <Pill size={18} />, color: t.pur },
  ]} onTap={onNav} /></div></Page>);
}

function ICNHome({ onNav }) {
  const t = useT(); const s = useS();
  return (<div><div style={{ ...s.hdr, paddingTop: 92 }}><div style={s.hdrT}>ICN</div></div><div style={s.cnt}><SearchBar onNav={onNav} /><div style={{ marginTop: 14 }}><MenuList items={[
    { id: "sepsis", label: "Early Onset Sepsis", desc: "Risk & management", icon: <Bug size={18} />, color: t.org },
    { id: "cooling", label: "HIE", desc: "Cooling protocol", icon: <Snowflake size={18} />, color: t.acc },
    { id: "nows", label: "NOWS / ESC", desc: "Opioid withdrawal", icon: <Pill size={18} />, color: t.pur },
    { id: "codemeds", label: "Code Meds", desc: "Neonatal code orderset", icon: <Pill size={18} />, color: t.pur },
    { id: "uvcuac", label: "UVC / UAC", desc: "Line depth calculator", icon: <Ruler size={18} />, color: t.red },
  ]} onTap={onNav} /></div></div></div>);
}

// ═══════════════════════════════════════════════════════════════════════
// SWIPE BACK HOOK
// ═══════════════════════════════════════════════════════════════════════
function useSwipeBack(onBack, enabled) {
  const startX = useRef(0);
  const startY = useRef(0);
  const swiping = useRef(false);

  const onTouchStart = useCallback((e) => {
    if (!enabled) return;
    const touch = e.touches[0];
    if (touch.clientX < 30) {
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      swiping.current = true;
    }
  }, [enabled]);

  const onTouchEnd = useCallback((e) => {
    if (!swiping.current || !enabled) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startX.current;
    const dy = Math.abs(touch.clientY - startY.current);
    swiping.current = false;
    if (dx > 80 && dy < 100) onBack();
  }, [enabled, onBack]);

  return { onTouchStart, onTouchEnd };
}

// ═══════════════════════════════════════════════════════════════════════
// SLIDE TRANSITION WRAPPER
// ═══════════════════════════════════════════════════════════════════════
function SlideTransition({ children, navKey, direction }) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [animClass, setAnimClass] = useState("");
  const prevKey = useRef(navKey);

  useEffect(() => {
    if (navKey !== prevKey.current) {
      const dir = direction === "back" ? "slide-out" : "slide-in";
      setAnimClass(dir + "-enter");
      const t = setTimeout(() => {
        setDisplayChildren(children);
        setAnimClass(dir + "-active");
        const t2 = setTimeout(() => setAnimClass(""), 300);
        return () => clearTimeout(t2);
      }, 10);
      prevKey.current = navKey;
      return () => clearTimeout(t);
    } else {
      setDisplayChildren(children);
    }
  }, [navKey, children, direction]);

  return <div className={animClass} style={{ width: "100%", minHeight: "100%" }}>{displayChildren}</div>;
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════
export default function NewbornPocketPro() {
  const [themeMode, setThemeMode] = useState("system");
  const [largeText, setLargeText] = useState(false);
  const [systemDark, setSystemDark] = useState(false);
  const [activeTab, setActiveTab] = useState("newborn");
  const [navStack, setNavStack] = useState({ newborn: [], icn: [], links: [], guidelines: [], options: [] });
  const [navDirection, setNavDirection] = useState("forward");
  const [navParams, setNavParams] = useState({});

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (mq) { setSystemDark(mq.matches); const h = (e) => setSystemDark(e.matches); mq.addEventListener?.("change", h); return () => mq.removeEventListener?.("change", h); }
  }, []);

  const isDark = themeMode === "dark" || (themeMode === "system" && systemDark);
  const theme = { ...(isDark ? dark : light), largeText };
  const s = mkS(theme);
  useEffect(() => { document.body.style.backgroundColor = theme.bg; }, [theme.bg]);

  const currentStack = navStack[activeTab] || [];
  const currentPage = currentStack.length > 0 ? currentStack[currentStack.length - 1] : null;

  const goTo = useCallback((page, params) => { setNavDirection("forward"); if (params) setNavParams(prev => ({ ...prev, [page]: params })); setNavStack(prev => ({ ...prev, [activeTab]: [...(prev[activeTab] || []), page] })); }, [activeTab]);
  const goBack = useCallback(() => { setNavDirection("back"); setNavStack(prev => ({ ...prev, [activeTab]: (prev[activeTab] || []).slice(0, -1) })); }, [activeTab]);
  const handleTab = (id) => { setNavDirection("forward"); if (id === activeTab) setNavStack(prev => ({ ...prev, [id]: [] })); else setActiveTab(id); };

  const canGoBack = currentStack.length > 0;
  const swipeHandlers = useSwipeBack(goBack, canGoBack);
  const scrollRef = useRef(null);

  // Scroll to top on navigation
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activeTab, currentPage]);

  const TABS = [
    { id: "newborn", label: "Newborn", icon: <Baby size={22} strokeWidth={1.8} /> },
    { id: "icn", label: "ICN", icon: <Stethoscope size={22} strokeWidth={1.8} /> },
    { id: "links", label: "Links", icon: <Link2 size={22} strokeWidth={1.8} /> },
    { id: "guidelines", label: "Guidelines", icon: <BookOpen size={22} strokeWidth={1.8} /> },
    { id: "options", label: "Options", icon: <Settings size={22} strokeWidth={1.8} /> },
  ];

  const renderContent = () => {
    const p = currentPage;
    if (p === "apgar") return <ApgarTool onBack={goBack} scrollRef={scrollRef} />;
    if (p === "sarnat") return <SarnatTool onBack={goBack} scrollRef={scrollRef} />;
    if (p === "fenton") return <FentonTable onBack={goBack} />;
    if (p === "glucose") return <GlucoseProtocol onBack={goBack} />;
    if (p === "uvcuac") return <UvcUacCalc onBack={goBack} />;
    if (p === "resuscmeds") return <ResuscMeds onBack={goBack} />;
    if (p === "codemeds") return <CodeMeds onBack={goBack} />;
    if (p === "cooling") return <TherapeuticHypothermia onBack={goBack} onNav={goTo} />;
    if (p === "vitals") return <VitalSigns onBack={goBack} />;
    if (p === "delivery") return <DeliverySection onBack={goBack} onNav={goTo} />;
    if (p === "nrp") return <NRPAlgorithm onBack={goBack} />;
    if (p === "equipment") return <EquipmentEstimates onBack={goBack} />;
    if (p === "routine") return <RoutineNewborn onBack={goBack} onNav={goTo} />;
    if (p === "infections") return <MaternalInfections onBack={goBack} highlight={navParams.infections?.highlight} />;
    if (p === "maternal_conditions") return <MaternalConditions onBack={goBack} />;
    if (p === "obstetric") return <ObstetricFactors onBack={goBack} />;
    if (p === "neonatal_meds") return <NeonatalMeds onBack={goBack} onNav={goTo} />;
    if (p === "feeding") return <Feeding onBack={goBack} />;
    if (p === "voiding") return <VoidingStooling onBack={goBack} />;
    if (p === "bilirubin") return <BilirubinSection onBack={goBack} />;
    if (p === "hearing") return <HearingScreen onBack={goBack} />;
    if (p === "additional_screenings") return <AdditionalScreenings onBack={goBack} />;
    if (p === "cchd") return <CCHDScreen onBack={goBack} />;
    if (p === "nbs") return <NewbornScreen onBack={goBack} />;
    if (p === "sepsis") return <EOSSection onBack={goBack} />;
    if (p === "complications") return <ComplicationsNav onBack={goBack} onNav={goTo} />;
    if (p === "hypothermia") return <Hypothermia onBack={goBack} />;
    if (p === "nows") return <NOWS onBack={goBack} />;
    if (p === "ttn") return <TTN onBack={goBack} />;
    if (p === "extracranial") return <ExtracranialInjuries onBack={goBack} />;
    if (activeTab === "newborn") return <NewbornHome onNav={goTo} />;
    if (activeTab === "icn") return <ICNHome onNav={goTo} />;
    if (activeTab === "links") return <LinksSection />;
    if (activeTab === "guidelines") return <GuidelinesSection />;
    if (activeTab === "options") return <OptionsTab themeMode={themeMode} setThemeMode={setThemeMode} largeText={largeText} setLargeText={setLargeText} />;
    return <NewbornHome onNav={goTo} />;
  };

  return (
    <ThemeCtx.Provider value={theme}>
      <div style={s.app} className={isDark ? "theme-dark" : ""}>
        <div ref={scrollRef} {...swipeHandlers} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", paddingBottom: 84 }}>
          <SlideTransition navKey={`${activeTab}-${currentPage || "home"}`} direction={navDirection}>
            {renderContent()}
          </SlideTransition>
        </div>
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          width: "100%",
          background: theme.tabBg, backdropFilter: "blur(25px) saturate(180%)", WebkitBackdropFilter: "blur(25px) saturate(180%)",
          borderTop: `0.5px solid ${theme.tabBorder}`,
          display: "flex", alignItems: "stretch", justifyContent: "space-around",
          paddingTop: 4, paddingBottom: "env(safe-area-inset-bottom, 20px)",
          zIndex: 200,
        }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            const inactiveColor = theme.mode === "dark" ? "#8E8E93" : "#999";
            return (
              <button key={tab.id} onClick={() => handleTab(tab.id)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                padding: "6px 0 2px", background: "none", border: "none", cursor: "pointer",
                minWidth: 50, flex: 1, WebkitTapHighlightColor: "transparent",
              }}>
                <div style={{ color: active ? theme.acc : inactiveColor, display: "flex" }}>{tab.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 500, color: active ? theme.acc : inactiveColor, letterSpacing: 0.1, fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif" }}>{tab.label}</div>
              </button>
            );
          })}
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
