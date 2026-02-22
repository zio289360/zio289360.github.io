import { useState, useEffect, useRef, useCallback } from "react";
import { Eye, EyeOff, Heart, ChevronRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   INJECT FONTS + KEYFRAMES
═══════════════════════════════════════════════════════════ */
function GlobalStyle() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Lora:ital,wght@0,400;0,600;1,400&family=Dancing+Script:wght@600;700&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; overflow: hidden; background: #fff0f6; }
      ::-webkit-scrollbar { display: none; }
      @keyframes gradAnim { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      @keyframes glitter { 0%,100% { text-shadow: 0 0 8px #f9a8d4, 0 0 22px #ec4899; } 50% { text-shadow: 0 0 12px #fde68a, 0 0 26px #fbbf24; } }
      @keyframes nameGlow { 0%,100% { filter: drop-shadow(0 0 8px rgba(236,72,153,.65)); } 50% { filter: drop-shadow(0 0 20px rgba(244,114,182,.9)); } }
      @keyframes floatBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px) rotate(5deg); } }
      @keyframes heartFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px) scale(1.1); } }
      @keyframes heartbeat { 0%,100% { transform: scale(1); } 14% { transform: scale(1.24); } 28% { transform: scale(1); } }
      @keyframes pulseSoft { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
      @keyframes twinkle { 0%,100% { opacity: 0; transform: scale(0); } 50% { opacity: 1; transform: scale(1); } }
      @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes stepIn { from { opacity: 0; transform: scale(.96) translateY(16px); } to { opacity: 1; transform: scale(1); } }
      @keyframes inputShake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-9px); } 40% { transform: translateX(9px); } }
      @keyframes giftShake { 0%,100% { transform: rotate(0); } 20% { transform: rotate(-5deg); } 40% { transform: rotate(5deg); } }
      @keyframes lidFly { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-150px) rotate(-45deg); opacity: 0; } }
      @keyframes starPop { 0% { transform: translate(0,0) scale(0); opacity: 1; } 100% { transform: translate(var(--tx),var(--ty)) scale(1); opacity: 0; } }
      @keyframes msgReveal { from { opacity: 0; transform: scale(.8) translateY(20px); } to { opacity: 1; transform: scale(1); } }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);
  return null;
}

/* ═══════════════════════════════════════════════════════════
   UTILITIES (Confetti, Typewriter, Stars)
═══════════════════════════════════════════════════════════ */
const PETALS = ["#f9a8d4","#f472b6","#fda4af","#fb7185","#ffffff","#c4b5fd"];

function useConfetti(active) {
  const canvasRef = useRef(null);
  const ptsRef = useRef([]);
  useEffect(() => {
    if (!active) return;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    for (let i = 0; i < 100; i++) {
      ptsRef.current.push({
        x: Math.random() * c.width, y: -20,
        vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 3,
        r: 5 + Math.random() * 5, col: PETALS[Math.floor(Math.random() * PETALS.length)],
        alpha: 1, decay: 0.002 + Math.random() * 0.002
      });
    }
    const loop = () => {
      ctx.clearRect(0,0,c.width,c.height);
      ptsRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      });
      requestAnimationFrame(loop);
    };
    loop();
  }, [active]);
  return canvasRef;
}

const LETTER_TEXT = "Chúc mừng sinh nhật Nguyệt! 🎂\n\nTuổi 16 rạng rỡ nhé. Dù khác trường, tao vẫn luôn ở đây nghe mày kể mọi chuyện. Chúc mày luôn xinh đẹp, học tốt và mãi là người bạn đặc biệt của tao! 🌸";

function useTypewriter(text, active) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) return;
    let i = 0;
    const iv = setInterval(() => {
      setShown(text.slice(0, i + 1));
      i++;
      if (i >= text.length) { setDone(true); clearInterval(iv); }
    }, 40);
    return () => clearInterval(iv);
  }, [active, text]);
  return { shown, done };
}

function TwinkleStars() {
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          position:"absolute", left: Math.random()*100+"%", top: Math.random()*100+"%",
          width: "4px", height: "4px", background: "#fff", borderRadius: "50%",
          animation: `twinkle ${2+Math.random()*2}s infinite`
        }} />
      ))}
    </div>
  );
}

function BlobLights() {
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", filter:"blur(60px)", opacity:0.4 }}>
      <div style={{ position:"absolute", width:300, height:300, background:"#f9a8d4", borderRadius:"50%", top:"-10%", right:"-10%" }} />
      <div style={{ position:"absolute", width:300, height:300, background:"#f472b6", borderRadius:"50%", bottom:"-10%", left:"-10%" }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPONENTS (Lock, Step1, Step2, Step3)
═══════════════════════════════════════════════════════════ */
function LockScreen({ onUnlock }) {
  const [val, setVal] = useState("");
  const [shake, setShake] = useState(false);
  const submit = () => {
    if (val === "22/10") onUnlock();
    else { setShake(true); setTimeout(() => setShake(false), 500); setVal(""); }
  };
  return (
    <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#fff0f6", textAlign:"center", padding:20 }}>
      <div style={{ animation: shake ? "inputShake 0.5s" : "stepIn 0.6s", background:"#fff", padding:40, borderRadius:30, boxShadow:"0 20px 50px rgba(0,0,0,0.05)" }}>
        <Heart size={50} color="#ec4899" fill="#ec4899" style={{ marginBottom:20, animation:"heartbeat 2s infinite" }} />
        <h2 style={{ fontFamily:"'Playfair Display'", color:"#9d174d", marginBottom:10 }}>Trang riêng tư ✨</h2>
        <input 
          type="text" placeholder="Ngày sinh (DD/MM)..." 
          value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          style={{ width:"100%", padding:15, borderRadius:15, border:"1px solid #fbcfe8", marginBottom:15, textAlign:"center", outline:"none" }}
        />
        <button onClick={submit} style={{ width:"100%", padding:15, background:"#ec4899", color:"#fff", border:"none", borderRadius:15, fontWeight:"bold", cursor:"pointer" }}>Mở khóa</button>
      </div>
    </div>
  );
}

function Step1({ onNext }) {
  const conf = useConfetti(true);
  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:20 }}>
      <canvas ref={conf} style={{ position:"absolute", inset:0 }} />
      <h1 style={{ fontFamily:"'Dancing Script'", fontSize:"4rem", color:"#9d174d", animation:"glitter 2s infinite" }}>Như Nguyệt</h1>
      <p style={{ fontFamily:"'Lora'", color:"#db2777", marginBottom:30 }}>Happy Birthday 22.10</p>
      <button onClick={onNext} style={{ padding:"15px 30px", background:"#ec4899", color:"#fff", border:"none", borderRadius:99, cursor:"pointer", zIndex:10 }}>Xem quà 🎁</button>
    </div>
  );
}

function Step2({ onNext }) {
  const { shown, done } = useTypewriter(LETTER_TEXT, true);
  return (
    <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ maxWidth:400, background:"#fff", padding:30, borderRadius:20, boxShadow:"0 10px 30px rgba(0,0,0,0.05)", position:"relative" }}>
        <p style={{ fontFamily:"'Lora'", lineHeight:1.8, color:"#9d174d", whiteSpace:"pre-wrap" }}>{shown}</p>
        {done && <button onClick={onNext} style={{ marginTop:20, width:"100%", padding:10, background:"#f472b6", color:"#fff", border:"none", borderRadius:10, cursor:"pointer" }}>Tiếp tục ✨</button>}
      </div>
    </div>
  );
}

function GiftBox({ opened }) {
  return (
    <div style={{ position:"relative", width:150, height:150, cursor:"pointer", animation: !opened ? "giftShake 2s infinite" : "none" }}>
      <div style={{ position:"absolute", width:"100%", height:"100%", background:"#ec4899", borderRadius:10, zIndex:1 }} />
      <div style={{ position:"absolute", top:0, width:"100%", height:40, background:"#db2777", borderRadius:"10px 10px 0 0", zIndex:2, animation: opened ? "lidFly 1s forwards" : "none" }} />
      {opened && <div style={{ position:"absolute", top:20, left:"25%", fontSize:40, zIndex:0 }}>💎</div>}
    </div>
  );
}

function Step3() {
  const [opened, setOpened] = useState(false);
  const conf = useConfetti(opened);
  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      <canvas ref={conf} style={{ position:"absolute", inset:0 }} />
      <h2 style={{ marginBottom:30, color:"#9d174d" }}>{opened ? "Chúc mừng sinh nhật!" : "Chạm để mở quà"}</h2>
      <div onClick={() => setOpened(true)}><GiftBox opened={opened} /></div>
      {opened && <p style={{ marginTop:30, color:"#db2777", animation:"fadeUp 1s" }}>Tặng cậu ngàn trái tim! ❤️</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("lock");
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <GlobalStyle />
      <TwinkleStars />
      <BlobLights />
      {screen === "lock" && <LockScreen onUnlock={() => setScreen("step1")} />}
      {screen === "step1" && <Step1 onNext={() => setScreen("step2")} />}
      {screen === "step2" && <Step2 onNext={() => setScreen("step3")} />}
      {screen === "step3" && <Step3 />}
    </div>
  );
}
