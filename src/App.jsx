import { useState, useEffect, useRef, useCallback } from "react";
import { Eye, EyeOff, Heart, ChevronRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   INJECT FONTS + KEYFRAMES
═══════════════════════════════════════════════════════════ */
function GlobalStyle() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Lora:ital,wght@0,400;0,600;1,400&family=Dancing+Script:wght@600;700&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; overflow: hidden; background: #fff0f6; }
      ::-webkit-scrollbar { display: none; }

      @keyframes gradAnim {
        0%,100% { background-position: 0% 50%; }
        50%      { background-position: 100% 50%; }
      }
      @keyframes glitter {
        0%,100% { text-shadow: 0 0 8px #f9a8d4, 0 0 22px #ec4899, 0 0 40px #f472b6; }
        25%      { text-shadow: 0 0 12px #fde68a, 0 0 26px #fbbf24, 0 0 48px #f59e0b; }
        50%      { text-shadow: 0 0 10px #c4b5fd, 0 0 24px #a78bfa, 0 0 44px #7c3aed; }
        75%      { text-shadow: 0 0 14px #fda4af, 0 0 30px #fb7185, 0 0 52px #f43f5e; }
      }
      @keyframes nameGlow {
        0%,100% { filter: drop-shadow(0 0 8px rgba(236,72,153,.65)); }
        50%      { filter: drop-shadow(0 0 20px rgba(244,114,182,.9)); }
      }
      @keyframes floatBounce {
        0%,100% { transform: translateY(0) rotate(0deg); }
        50%      { transform: translateY(-18px) rotate(5deg); }
      }
      @keyframes heartFloat {
        0%,100% { transform: translateY(0) scale(1); }
        50%      { transform: translateY(-12px) scale(1.1); }
      }
      @keyframes heartbeat {
        0%,100% { transform: scale(1); }
        14%      { transform: scale(1.24); }
        28%      { transform: scale(1); }
        42%      { transform: scale(1.16); }
        70%      { transform: scale(1); }
      }
      @keyframes pulseSoft {
        0%,100% { transform: scale(1); }
        50%      { transform: scale(1.1); }
      }
      @keyframes twinkle {
        0%,100% { opacity: 0; transform: scale(0) rotate(0deg); }
        50%      { opacity: 1; transform: scale(1) rotate(45deg); }
      }
      @keyframes blink {
        0%,100% { opacity: 1; }
        50%      { opacity: 0; }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(22px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes stepIn {
        from { opacity: 0; transform: scale(.96) translateY(16px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes inputShake {
        0%,100% { transform: translateX(0); }
        20%      { transform: translateX(-9px); }
        40%      { transform: translateX(9px); }
        60%      { transform: translateX(-7px); }
        80%      { transform: translateX(7px); }
      }
      @keyframes giftShake {
        0%,100% { transform: translateX(0) rotate(0deg); }
        8%       { transform: translateX(-13px) rotate(-4.5deg); }
        16%      { transform: translateX(13px)  rotate(4.5deg); }
        24%      { transform: translateX(-12px) rotate(-3.5deg); }
        32%      { transform: translateX(12px)  rotate(3.5deg); }
        40%      { transform: translateX(-11px) rotate(-4deg); }
        48%      { transform: translateX(11px)  rotate(4deg); }
        56%      { transform: translateX(-9px)  rotate(-2.5deg); }
        64%      { transform: translateX(9px)   rotate(2.5deg); }
        72%      { transform: translateX(-6px)  rotate(-1.5deg); }
        80%      { transform: translateX(6px)   rotate(1.5deg); }
        88%      { transform: translateX(-3px)  rotate(-.8deg); }
        96%      { transform: translateX(3px)   rotate(.8deg); }
      }
      @keyframes lidFly {
        0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
        35%  { transform: translateY(-35px) rotate(-20deg) scale(1.04); opacity: .95; }
        100% { transform: translateY(-130px) rotate(-50deg) scale(.55); opacity: 0; }
      }
      @keyframes starPop {
        0%   { transform: translate(0,0) scale(0) rotate(0deg); opacity: 1; }
        75%  { opacity: .88; }
        100% { transform: translate(var(--tx),var(--ty)) scale(1.15) rotate(var(--tr)); opacity: 0; }
      }
      @keyframes msgReveal {
        from { opacity: 0; transform: scale(.82) translateY(20px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes bounce {
        0%,100% { transform: translateY(0); }
        50%      { transform: translateY(-8px); }
      }
      @keyframes rippleOut {
        0%   { transform: scale(1); opacity: .55; }
        100% { transform: scale(4.5); opacity: 0; }
      }
      @keyframes shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position:  200% 0; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      try { document.head.removeChild(link); } catch(e) {}
      try { document.head.removeChild(style); } catch(e) {}
    };
  }, []);
  return null;
}

/* ═══════════════════════════════════════════════════════════
   CANVAS CONFETTI + HEARTS
═══════════════════════════════════════════════════════════ */
const PETALS = [
  "#f9a8d4","#f472b6","#fda4af","#fb7185",
  "#fce7f3","#fbcfe8","#fde68a","#ffffff","#c4b5fd","#a5f3fc",
];

function useConfetti(active) {
  const canvasRef = useRef(null);
  const ptsRef    = useRef([]);
  const rafRef    = useRef(null);

  const burst = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    for (let i = 0; i < 140; i++) {
      const heart = Math.random() > 0.52;
      ptsRef.current.push({
        x: Math.random() * c.width,
        y: -25 - Math.random() * 70,
        vx: (Math.random() - 0.5) * 2.2,
        vy: 1.3 + Math.random() * 2.4,
        r:  heart ? 7 + Math.random() * 9 : 4 + Math.random() * 7,
        col: PETALS[Math.floor(Math.random() * PETALS.length)],
        alpha: 1,
        type: heart ? "heart" : (Math.random() > 0.5 ? "circle" : "rect"),
        rot: Math.random() * 360,
        rotS: (Math.random() - 0.5) * 2.2,
        wob: Math.random() * Math.PI * 2,
        wobS: 0.03 + Math.random() * 0.03,
        decay: 0.0017 + Math.random() * 0.001,
      });
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");

    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    burst();
    const t2 = setTimeout(burst, 1500);
    const t3 = setTimeout(burst, 3100);

    const drawHeart = (cx, cy, s, col, a) => {
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = col;
      ctx.beginPath();
      const h = s * 0.5;
      ctx.moveTo(cx, cy + h * 0.38);
      ctx.bezierCurveTo(cx, cy, cx - h, cy, cx - h, cy + h * 0.38);
      ctx.bezierCurveTo(cx - h, cy + h * 0.75, cx, cy + h * 1.15, cx, cy + h * 1.42);
      ctx.bezierCurveTo(cx, cy + h * 1.15, cx + h, cy + h * 0.75, cx + h, cy + h * 0.38);
      ctx.bezierCurveTo(cx + h, cy, cx, cy, cx, cy + h * 0.38);
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      ptsRef.current.forEach(p => {
        p.wob += p.wobS;
        p.x += p.vx + Math.sin(p.wob) * 0.45;
        p.y += p.vy;
        p.rot += p.rotS;
        p.alpha = Math.max(0, p.alpha - p.decay);
        if (p.type === "heart") {
          drawHeart(p.x, p.y, p.r, p.col, p.alpha * 0.88);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.fillStyle = p.col;
          if (p.type === "rect") ctx.fillRect(-p.r / 2, -p.r * 0.3, p.r, p.r * 0.55);
          else { ctx.beginPath(); ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2); ctx.fill(); }
          ctx.restore();
        }
      });
      ptsRef.current = ptsRef.current.filter(p => p.alpha > 0 && p.y < c.height + 90);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(t2); clearTimeout(t3);
      window.removeEventListener("resize", resize);
    };
  }, [active, burst]);

  return canvasRef;
}

/* ═══════════════════════════════════════════════════════════
   TYPEWRITER HOOK
═══════════════════════════════════════════════════════════ */
const LETTER_TEXT =
  "Chúc mừng sinh nhật Nguyệt! \u{1F382}\n\n" +
  "Tuổi 16, chúc mày luôn giữ được nụ cười rạng rỡ đó nhé. " +
  "Dù khác trường, không thể gặp nhau mỗi ngày — nhưng tao vẫn luôn ở đây, " +
  "sẵn sàng nghe mày kể mọi chuyện bất cứ lúc nào.\n\n" +
  "Chúc mày luôn xinh đẹp, học tốt và mãi là một người bạn " +
  "đặc biệt nhất trong lòng tao.\n\n" +
  "Sinh nhật vui vẻ nhé! \u{1F338}";

function useTypewriter(text, active, speed) {
  const [shown, setShown] = useState("");
  const [done,  setDone]  = useState(false);
  const idx = useRef(0);
  const spd = speed || 33;

  useEffect(() => {
    if (!active) return;
    idx.current = 0; setShown(""); setDone(false);
    const iv = setInterval(() => {
      if (idx.current >= text.length) { setDone(true); clearInterval(iv); return; }
      setShown(text.slice(0, idx.current + 1));
      idx.current++;
    }, spd);
    return () => clearInterval(iv);
  }, [active, text, spd]);

  return { shown, done };
}

/* ═══════════════════════════════════════════════════════════
   SHARED UI COMPONENTS
═══════════════════════════════════════════════════════════ */
function TwinkleStars() {
  const stars = useRef(
    Array.from({ length: 26 }, function() {
      return {
        left:  (Math.random() * 94 + 1).toFixed(1) + "%",
        top:   (Math.random() * 94 + 1).toFixed(1) + "%",
        size:  (3 + Math.random() * 5.5).toFixed(1),
        delay: (Math.random() * 5).toFixed(2) + "s",
        dur:   (2 + Math.random() * 3).toFixed(2) + "s",
      };
    })
  );

  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
      {stars.current.map(function(s, i) {
        return (
          <div key={i} style={{
            position:"absolute", left:s.left, top:s.top,
            width:s.size+"px", height:s.size+"px",
            borderRadius:"50%",
            background:"radial-gradient(circle,#fff 0%,#f9a8d4 55%,transparent 100%)",
            boxShadow:"0 0 6px 2px rgba(249,168,212,.5)",
            animation:"twinkle "+s.dur+" "+s.delay+" ease-in-out infinite",
          }}/>
        );
      })}
    </div>
  );
}

function BlobLights() {
  var blobs = [
    { w:380, h:380, top:"-18%", right:"-14%", c:"rgba(249,168,212,.48)" },
    { w:320, h:320, bottom:"-14%", left:"-12%", c:"rgba(244,114,182,.32)" },
    { w:220, h:220, top:"38%", left:"-10%", c:"rgba(252,231,243,.65)" },
  ];
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
      {blobs.map(function(b, i) {
        var s = {
          position:"absolute", width:b.w, height:b.h, borderRadius:"50%",
          background:"radial-gradient(circle,"+b.c+" 0%,transparent 70%)",
          filter:"blur(62px)",
        };
        if (b.top)    s.top    = b.top;
        if (b.bottom) s.bottom = b.bottom;
        if (b.left)   s.left   = b.left;
        if (b.right)  s.right  = b.right;
        return <div key={i} style={s}/>;
      })}
    </div>
  );
}

function NextBtn(props) {
  var onClick = props.onClick;
  var label   = props.label;
  var [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={function(){ setHov(true); }}
      onMouseLeave={function(){ setHov(false); }}
      onTouchStart={function(){ setHov(true); }}
      onTouchEnd={function(){ setHov(false); }}
      style={{
        display:"inline-flex", alignItems:"center", gap:10,
        padding:"15px 36px", borderRadius:99,
        border:"none", cursor:"pointer",
        background:"linear-gradient(135deg,#ec4899,#f472b6,#fda4af)",
        color:"#fff", fontWeight:700,
        fontSize:15, letterSpacing:"0.04em",
        fontFamily:"'Playfair Display',serif",
        boxShadow: hov
          ? "0 14px 42px rgba(236,72,153,.65),0 0 0 4px rgba(249,168,212,.3)"
          : "0 8px 30px rgba(236,72,153,.42)",
        transform: hov ? "scale(1.06) translateY(-3px)" : "scale(1)",
        transition:"transform .28s cubic-bezier(.34,1.56,.64,1),box-shadow .25s ease",
        animation:"fadeUp .55s .15s ease both",
      }}
    >
      {label || "Sang phần tiếp theo nào! ✨"}
      <ChevronRight size={18} color="#fff"/>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOCK SCREEN
═══════════════════════════════════════════════════════════ */
function LockScreen(props) {
  var onUnlock = props.onUnlock;
  var [val,   setVal]   = useState("");
  var [show,  setShow]  = useState(false);
  var [err,   setErr]   = useState("");
  var [shake, setShake] = useState(false);
  var [fade,  setFade]  = useState(false);

  function submit() {
    if (val.trim() === "22/10") {
      setErr(""); setFade(true);
      setTimeout(onUnlock, 880);
    } else {
      setErr("Nhập sai rồi bạn mình ơi! Nhập lại thử xem! 🙄");
      setShake(true);
      setTimeout(function(){ setShake(false); }, 520);
      setVal("");
    }
  }

  var floaters = [
    { emoji:"💗", sz:22, l:"7%",  t:"14%", d:3.2, dl:0 },
    { emoji:"🌸", sz:26, l:"88%", t:"10%", d:2.8, dl:.4 },
    { emoji:"💕", sz:18, l:"5%",  t:"72%", d:3.5, dl:.8 },
    { emoji:"✨", sz:20, l:"90%", t:"65%", d:2.6, dl:.2 },
    { emoji:"🌸", sz:16, l:"50%", t:"6%",  d:3.8, dl:.6 },
    { emoji:"💗", sz:30, l:"80%", t:"82%", d:2.9, dl:.3 },
    { emoji:"💕", sz:14, l:"20%", t:"88%", d:3.3, dl:.9 },
    { emoji:"✨", sz:24, l:"65%", t:"88%", d:2.7, dl:.5 },
  ];

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:50,
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:24,
      background:"linear-gradient(135deg,#fff0f6 0%,#fce7f3 30%,#fdf2f8 65%,#fbcfe8 100%)",
      backgroundSize:"300% 300%",
      animation:"gradAnim 8s ease infinite",
      transition:"opacity .88s ease",
      opacity: fade ? 0 : 1,
      pointerEvents: fade ? "none" : "auto",
      overflow:"hidden",
    }}>
      <TwinkleStars/>
      <BlobLights/>

      {floaters.map(function(f, i) {
        return (
          <div key={i} style={{
            position:"absolute", fontSize:f.sz+"px",
            left:f.l, top:f.t, opacity:.12,
            pointerEvents:"none", userSelect:"none",
            animation:"heartFloat "+f.d+"s "+f.dl+"s ease-in-out infinite alternate",
          }}>{f.emoji}</div>
        );
      })}

      <div style={{
        position:"relative", zIndex:2,
        width:"100%", maxWidth:400,
        display:"flex", flexDirection:"column", alignItems:"center", gap:28,
        animation:"stepIn .6s ease",
      }}>
        {/* Icon + Title */}
        <div style={{ textAlign:"center" }}>
          <div style={{
            width:74, height:74, borderRadius:"50%",
            display:"flex", alignItems:"center", justifyContent:"center",
            background:"linear-gradient(135deg,#f9a8d4,#ec4899,#db2777)",
            boxShadow:"0 10px 36px rgba(236,72,153,.52)",
            margin:"0 auto 16px",
            animation:"heartbeat 2.5s ease-in-out infinite",
          }}>
            <Heart size={34} fill="#fff" color="#fff"/>
          </div>
          <h1 style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:26, fontWeight:700, color:"#9d174d",
          }}>Trang riêng tư ✨</h1>
          <p style={{
            fontFamily:"'Lora',serif", fontStyle:"italic",
            fontSize:13, color:"rgba(190,24,93,.55)", marginTop:7,
          }}>Chỉ dành cho một người rất đặc biệt 🌸</p>
        </div>

        {/* Form card */}
        <div style={{
          width:"100%", borderRadius:32, padding:"30px 26px",
          background:"rgba(255,255,255,.9)", backdropFilter:"blur(24px)",
          boxShadow:"0 24px 70px rgba(236,72,153,.18),0 2px 10px rgba(249,168,212,.28)",
          border:"1.5px solid rgba(252,231,243,.95)",
          display:"flex", flexDirection:"column", gap:18,
        }}>
          <label style={{
            fontSize:11, fontWeight:700, letterSpacing:".18em",
            textTransform:"uppercase", color:"#db2777",
          }}>Mật khẩu bí mật</label>

          <div style={{
            display:"flex", alignItems:"center",
            borderRadius:18, overflow:"hidden",
            border: err ? "1.5px solid #f43f5e" : "1.5px solid #fbcfe8",
            background:"#fff8fb",
            boxShadow:"inset 0 2px 8px rgba(249,168,212,.1)",
            animation: shake ? "inputShake .5s ease" : "none",
          }}>
            <input
              type={show ? "text" : "password"}
              value={val}
              placeholder="Nhập ngày sinh của bạn (DD/MM)..."
              onChange={function(e){ setVal(e.target.value); setErr(""); }}
              onKeyDown={function(e){ if (e.key === "Enter") submit(); }}
              style={{
                flex:1, padding:"15px 18px", fontSize:14,
                outline:"none", background:"transparent",
                color:"#9d174d", fontFamily:"'Lora',serif",
              }}
            />
            <button
              type="button"
              onClick={function(){ setShow(function(v){ return !v; }); }}
              style={{
                padding:"0 16px", background:"none", border:"none", cursor:"pointer",
                display:"flex", alignItems:"center",
                color: show ? "#ec4899" : "#fda4af",
                transition:"color .2s",
              }}
            >
              {show ? <EyeOff size={19}/> : <Eye size={19}/>}
            </button>
          </div>

          {err && (
            <p style={{
              fontSize:12, color:"#f43f5e",
              fontFamily:"'Lora',serif", marginTop:-8,
              animation:"fadeUp .3s ease",
            }}>{err}</p>
          )}

          <button
            onClick={submit}
            style={{
              width:"100%", padding:"16px 0", borderRadius:20,
              border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#ec4899,#f472b6)",
              boxShadow:"0 8px 28px rgba(236,72,153,.46)",
              color:"#fff", fontWeight:700, fontSize:14,
              letterSpacing:".1em", textTransform:"uppercase",
              fontFamily:"'Playfair Display',serif",
              transition:"transform .15s ease,box-shadow .15s ease",
            }}
            onMouseEnter={function(e){
              e.currentTarget.style.transform="scale(1.02)";
              e.currentTarget.style.boxShadow="0 13px 38px rgba(236,72,153,.58)";
            }}
            onMouseLeave={function(e){
              e.currentTarget.style.transform="scale(1)";
              e.currentTarget.style.boxShadow="0 8px 28px rgba(236,72,153,.46)";
            }}
          >✨ Mở khóa</button>
        </div>

        <p style={{ fontSize:12, color:"rgba(249,168,212,.85)", fontFamily:"'Lora',serif" }}>
          💌 Hint: Ngày sinh của Như Nguyệt là gì nhỉ?
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 1 — HERO + GLITTER + CONFETTI
═══════════════════════════════════════════════════════════ */
function Step1(props) {
  var onNext = props.onNext;
  var confettiRef = useConfetti(true);

  var line1 = "HAPPY BIRTHDAY".split("");
  var line2 = "NHƯ NGUYỆT".split("");

  var bgEmojis = [
    { e:"🌸", sz:20, l:"4%",  t:"12%", d:2.8, dl:0 },
    { e:"💗", sz:28, l:"88%", t:"10%", d:3.1, dl:.3 },
    { e:"💕", sz:16, l:"6%",  t:"68%", d:3.4, dl:.7 },
    { e:"✨", sz:22, l:"91%", t:"60%", d:2.5, dl:.1 },
    { e:"🌸", sz:18, l:"48%", t:"5%",  d:3.7, dl:.5 },
    { e:"💗", sz:14, l:"78%", t:"85%", d:2.9, dl:.4 },
    { e:"🌺", sz:24, l:"15%", t:"82%", d:3.2, dl:.8 },
  ];

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:10,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"0 24px",
      background:"linear-gradient(155deg,#fff0f6 0%,#fce7f3 28%,#fdf4ff 62%,#fbcfe8 100%)",
      backgroundSize:"200% 200%",
      animation:"gradAnim 10s ease infinite",
      textAlign:"center", overflow:"hidden",
    }}>
      <canvas ref={confettiRef} style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:100 }}/>
      <TwinkleStars/>

      {bgEmojis.map(function(f, i) {
        return (
          <span key={i} style={{
            position:"absolute", fontSize:f.sz+"px",
            left:f.l, top:f.t, opacity:.13,
            userSelect:"none", pointerEvents:"none",
            animation:"floatBounce "+f.d+"s "+f.dl+"s ease-in-out infinite alternate",
          }}>{f.e}</span>
        );
      })}

      <div style={{ position:"relative", zIndex:2, animation:"stepIn .6s ease" }}>

        {/* Date badge */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:9,
          padding:"8px 22px", borderRadius:99, marginBottom:32,
          background:"rgba(255,255,255,.78)", backdropFilter:"blur(14px)",
          border:"1px solid rgba(252,231,243,.95)",
          boxShadow:"0 2px 18px rgba(249,168,212,.28)",
          animation:"fadeUp .5s ease",
        }}>
          <span style={{ fontSize:17 }}>🎂</span>
          <span style={{
            fontSize:11, fontWeight:700, letterSpacing:".22em",
            textTransform:"uppercase", color:"#f472b6",
          }}>22 · 10 · 2025</span>
          <span style={{ fontSize:17 }}>🎂</span>
        </div>

        {/* Glitter line 1 */}
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", marginBottom:4 }}>
          {line1.map(function(ch, i) {
            return (
              <span key={i} style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(20px,5.5vw,38px)",
                fontWeight:700, color:"#9d174d",
                display:"inline-block",
                animation:"glitter "+(1.5+(i%5)*.28)+"s "+(i*.06)+"s ease-in-out infinite",
                whiteSpace: ch === " " ? "pre" : "normal",
              }}>{ch === " " ? "\u00A0" : ch}</span>
            );
          })}
        </div>

        {/* Glitter line 2 */}
        <div style={{
          display:"flex", flexWrap:"wrap", justifyContent:"center",
          marginBottom:48,
          animation:"nameGlow 2.5s ease-in-out infinite",
        }}>
          {line2.map(function(ch, i) {
            return (
              <span key={i} style={{
                fontFamily:"'Dancing Script',cursive",
                fontSize:"clamp(36px,10vw,66px)",
                fontWeight:700, display:"inline-block",
                background:"linear-gradient(135deg,#9d174d,#ec4899,#f472b6,#fda4af)",
                WebkitBackgroundClip:"text",
                WebkitTextFillColor:"transparent",
                backgroundClip:"text",
                animation:"glitter "+(1.3+(i%4)*.3)+"s "+(i*.07+.3)+"s ease-in-out infinite",
                whiteSpace: ch === " " ? "pre" : "normal",
              }}>{ch === " " ? "\u00A0\u00A0" : ch}</span>
            );
          })}
        </div>

        <NextBtn onClick={onNext} label="Xem lời chúc nào! 💌"/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 2 — TYPEWRITER LETTER
═══════════════════════════════════════════════════════════ */
function Step2(props) {
  var onNext = props.onNext;
  var tw = useTypewriter(LETTER_TEXT, true, 33);
  var shown = tw.shown;
  var done  = tw.done;

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:10,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"16px 20px",
      background:"linear-gradient(145deg,#fff0f6 0%,#fce7f3 50%,#fdf2f8 100%)",
      backgroundSize:"200% 200%",
      animation:"gradAnim 10s ease infinite",
      overflow:"hidden",
    }}>
      <TwinkleStars/>

      <div style={{
        width:"100%", maxWidth:448,
        display:"flex", flexDirection:"column", gap:16,
        animation:"stepIn .5s ease",
        position:"relative", zIndex:2,
      }}>
        {/* Label */}
        <div style={{ textAlign:"center" }}>
          <span style={{
            fontSize:10, fontWeight:700, letterSpacing:".3em",
            textTransform:"uppercase", color:"rgba(249,168,212,.95)",
          }}>✦ từ trái tim ✦</span>
          <h2 style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(20px,5vw,26px)", fontWeight:700,
            color:"#9d174d", marginTop:7,
          }}>Một lá thư nhỏ 💌</h2>
        </div>

        {/* Letter card */}
        <div style={{
          borderRadius:28, padding:"22px 24px",
          background:"#fff",
          boxShadow:"0 18px 62px rgba(236,72,153,.16),0 2px 12px rgba(249,168,212,.2)",
          border:"1.5px solid #fce7f3",
          position:"relative", overflow:"hidden",
        }}>
          {/* Ruled lines */}
          {Array.from({ length:12 }, function(_,i){
            return (
              <div key={i} style={{
                position:"absolute", left:0, right:0,
                top:62+i*30, height:1,
                background:"rgba(252,231,243,.6)",
              }}/>
            );
          })}

          {/* Header */}
          <div style={{
            display:"flex", alignItems:"center", gap:11,
            marginBottom:18, position:"relative", zIndex:1,
          }}>
            <div style={{
              width:40, height:40, borderRadius:"50%", flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              background:"linear-gradient(135deg,#f9a8d4,#ec4899)",
              boxShadow:"0 4px 14px rgba(236,72,153,.42)",
              animation:"pulseSoft 2s ease-in-out infinite",
            }}>
              <Heart size={18} fill="#fff" color="#fff"/>
            </div>
            <div>
              <p style={{
                fontSize:10, fontWeight:700, letterSpacing:".16em",
                textTransform:"uppercase", color:"#db2777",
              }}>Happy Birthday!</p>
              <p style={{ fontSize:10, color:"#f9a8d4", marginTop:2 }}>22 · 10 · 2025 🌸</p>
            </div>
          </div>

          {/* Typewriter text */}
          <div style={{ minHeight:130, position:"relative", zIndex:1 }}>
            <p style={{
              fontSize:13.5, lineHeight:1.95, color:"#9d174d",
              fontFamily:"'Lora',serif", whiteSpace:"pre-wrap",
            }}>
              {shown}
              {!done && (
                <span style={{
                  display:"inline-block", width:2, height:15,
                  marginLeft:2, verticalAlign:"middle",
                  background:"#ec4899",
                  animation:"blink .75s step-end infinite",
                }}/>
              )}
            </p>
          </div>

          {/* Signature */}
          {done && (
            <div style={{
              marginTop:14, paddingTop:12,
              borderTop:"1px solid #fce7f3",
              textAlign:"right", position:"relative", zIndex:1,
              animation:"fadeUp .65s ease",
            }}>
              <p style={{
                fontFamily:"'Dancing Script',cursive",
                fontSize:17, fontWeight:600, color:"#f472b6",
              }}>— Người bạn thân của bạn 🤍</p>
            </div>
          )}
        </div>

        {done && (
          <div style={{ display:"flex", justifyContent:"center" }}>
            <NextBtn onClick={onNext} label="Còn có bất ngờ cho bạn! 🎁"/>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STEP 3 — 3D GIFT BOX
═══════════════════════════════════════════════════════════ */
function BowDecoration() {
  return (
    <div style={{ position:"absolute", top:-28, left:"50%", transform:"translateX(-50%)" }}>
      <div style={{
        position:"absolute", width:42, height:27,
        background:"linear-gradient(135deg,#be185d,#db2777)",
        borderRadius:"50% 50% 50% 10%",
        top:0, right:19, transform:"rotate(-38deg)",
        boxShadow:"2px 3px 8px rgba(0,0,0,.22)",
      }}/>
      <div style={{
        position:"absolute", width:42, height:27,
        background:"linear-gradient(135deg,#be185d,#db2777)",
        borderRadius:"50% 50% 10% 50%",
        top:0, left:19, transform:"rotate(38deg)",
        boxShadow:"2px 3px 8px rgba(0,0,0,.22)",
      }}/>
      <div style={{
        position:"absolute", width:20, height:20,
        background:"#9d174d", borderRadius:"50%",
        top:7, left:"50%", transform:"translateX(-50%)",
        boxShadow:"0 2px 8px rgba(0,0,0,.3)", zIndex:2,
      }}/>
      <div style={{
        position:"absolute", width:22, height:17,
        background:"#be185d", borderRadius:"0 0 50% 40%",
        top:20, left:5, transform:"rotate(-14deg)",
      }}/>
      <div style={{
        position:"absolute", width:22, height:17,
        background:"#be185d", borderRadius:"0 0 40% 50%",
        top:20, right:5, transform:"rotate(14deg)",
      }}/>
    </div>
  );
}

function StarBurst() {
  var data = useRef(null);
  if (!data.current) {
    var shapes = ["⭐","✨","💖","🌟","💫","🌸","💕","🎀","✦","💗","🌺","⚡"];
    data.current = Array.from({ length:26 }, function(_, i) {
      var angle = (i / 26) * 360;
      var dist  = 60 + Math.floor(Math.random() * 95);
      return {
        tx:    Math.round(Math.cos(angle * Math.PI / 180) * dist) + "px",
        ty:    Math.round(Math.sin(angle * Math.PI / 180) * dist) + "px",
        tr:    Math.round(Math.random() * 360) + "deg",
        delay: (i * 0.022).toFixed(3) + "s",
        emoji: shapes[i % shapes.length],
        size:  11 + Math.floor(Math.random() * 15),
      };
    });
  }

  return (
    <div style={{
      position:"absolute", inset:0,
      display:"flex", alignItems:"center", justifyContent:"center",
      pointerEvents:"none",
    }}>
      {data.current.map(function(s, i) {
        return (
          <div key={i} style={{
            position:"absolute", fontSize:s.size+"px",
            "--tx":s.tx, "--ty":s.ty, "--tr":s.tr,
            animation:"starPop 1s "+s.delay+" cubic-bezier(.15,-.2,.8,1.1) forwards",
          }}>{s.emoji}</div>
        );
      })}
    </div>
  );
}

function GiftBox(props) {
  var opened = props.opened;

  return (
    <div style={{ position:"relative", width:164, height:186 }}>

      {/* LID */}
      <div style={{
        position:"absolute", top:0, left:-11, right:-11, height:60,
        transformOrigin:"top center",
        animation: opened ? "lidFly .88s .08s cubic-bezier(.3,0,.6,1) forwards" : "none",
        zIndex:3,
      }}>
        <BowDecoration/>
        <div style={{
          width:"100%", height:50,
          background:"linear-gradient(145deg,#ec4899,#db2777)",
          borderRadius:"13px 13px 0 0",
          position:"relative", overflow:"hidden",
          boxShadow:"0 -2px 0 rgba(0,0,0,.1) inset,3px 0 0 rgba(255,255,255,.12) inset",
        }}>
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:"44%",
            background:"linear-gradient(to bottom,rgba(255,255,255,.26),transparent)",
            borderRadius:"13px 13px 0 0",
          }}/>
          <div style={{
            position:"absolute", top:0, bottom:0,
            left:"50%", transform:"translateX(-50%)",
            width:18, background:"#9d174d", opacity:.82,
          }}/>
        </div>
        <div style={{
          width:"100%", height:10,
          background:"linear-gradient(to bottom,rgba(0,0,0,.22),rgba(0,0,0,.08))",
          borderRadius:"0 0 2px 2px",
        }}/>
        <div style={{
          position:"absolute", top:0, right:-7, bottom:10, width:7,
          background:"rgba(0,0,0,.18)", transform:"skewY(-2deg)",
          borderRadius:"0 3px 3px 0",
        }}/>
      </div>

      {/* BOX BODY */}
      <div style={{
        position:"absolute", top:52, left:0, right:0, bottom:0,
        borderRadius:"0 0 15px 15px",
        background:"linear-gradient(145deg,#f472b6,#fda4af)",
        overflow:"hidden",
        boxShadow:"6px 10px 30px rgba(236,72,153,.48),2px 0 0 rgba(255,255,255,.14) inset",
      }}>
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:"38%",
          background:"linear-gradient(to bottom,rgba(255,255,255,.24),transparent)",
        }}/>
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          background:"linear-gradient(105deg,transparent 30%,rgba(255,255,255,.18) 50%,transparent 70%)",
          backgroundSize:"200% 100%",
          animation:"shimmer 3s ease infinite",
        }}/>
        <div style={{
          position:"absolute", top:0, bottom:0,
          left:"50%", transform:"translateX(-50%)",
          width:18, background:"#9d174d", opacity:.72,
        }}/>
        <div style={{
          position:"absolute", left:0, right:0,
          top:"42%", transform:"translateY(-50%)",
          height:18, background:"#9d174d", opacity:.72,
        }}/>
        {[
          {top:"17%",left:"15%"},{top:"17%",right:"15%"},
          {top:"68%",left:"15%"},{top:"68%",right:"15%"},
        ].map(function(p, i) {
          return (
            <div key={i} style={{
              position:"absolute", width:10, height:10,
              borderRadius:"50%", background:"rgba(255,255,255,.32)", ...p,
            }}/>
          );
        })}
        <div style={{
          position:"absolute", top:0, bottom:0, right:-9, width:9,
          background:"rgba(0,0,0,.17)", transform:"skewY(1.5deg)",
          borderRadius:"0 4px 4px 0",
        }}/>
        <div style={{
          position:"absolute", bottom:-8, left:0, right:0, height:8,
          background:"rgba(0,0,0,.13)", borderRadius:"0 0 4px 4px",
        }}/>
      </div>
    </div>
  );
}

function Step3() {
  var [giftState, setGiftState] = useState("idle");
  var [showBurst, setShowBurst] = useState(false);
  var [showMsg,   setShowMsg]   = useState(false);
  var [ripple,    setRipple]    = useState(false);

  function handleClick() {
    if (giftState !== "idle") return;
    setRipple(true);
    setTimeout(function(){ setRipple(false); }, 700);
    setGiftState("shaking");
    setTimeout(function() {
      setGiftState("opened");
      setShowBurst(true);
      setTimeout(function() {
        setShowBurst(false);
        setShowMsg(true);
      }, 1100);
    }, 2700);
  }

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:10,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"0 24px",
      background:"linear-gradient(145deg,#fff0f6 0%,#fce7f3 45%,#fdf4ff 100%)",
      backgroundSize:"200% 200%",
      animation:"gradAnim 10s ease infinite",
      textAlign:"center", overflow:"hidden",
    }}>
      <TwinkleStars/>

      <div style={{
        position:"relative", zIndex:2,
        display:"flex", flexDirection:"column",
        alignItems:"center", gap:22,
        animation:"stepIn .5s ease",
      }}>
        {/* Header */}
        <div>
          <span style={{
            fontSize:10, fontWeight:700, letterSpacing:".3em",
            textTransform:"uppercase", color:"rgba(249,168,212,.95)",
          }}>✦ bất ngờ cuối cùng ✦</span>
          <h2 style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(20px,5.5vw,28px)", fontWeight:700,
            color:"#9d174d", marginTop:7,
          }}>Hộp quà đang chờ bạn! 🎁</h2>
        </div>

        {/* Gift + effects */}
        <div
          onClick={handleClick}
          style={{
            position:"relative",
            cursor: giftState === "idle" ? "pointer" : "default",
            animation: giftState === "shaking" ? "giftShake 2.7s ease forwards" : "none",
            marginBottom:4,
          }}
        >
          <GiftBox opened={giftState === "opened"}/>
          {showBurst && <StarBurst/>}
          {ripple && (
            <div style={{
              position:"absolute", inset:0, borderRadius:"50%",
              border:"2px solid rgba(236,72,153,.6)",
              animation:"rippleOut .7s ease forwards",
              pointerEvents:"none",
            }}/>
          )}
        </div>

        {giftState === "idle" && (
          <p style={{
            fontFamily:"'Lora',serif", fontStyle:"italic",
            fontSize:13, color:"#be185d",
            animation:"bounce 1.4s ease-in-out infinite",
          }}>👆 Nhấn vào hộp quà nào!</p>
        )}

        {giftState === "shaking" && (
          <p style={{
            fontFamily:"'Lora',serif", fontStyle:"italic",
            fontSize:13, color:"#be185d",
          }}>🤩 Có gì bên trong thế này nhỉ...?</p>
        )}

        {showMsg && (
          <div style={{
            padding:"20px 28px", borderRadius:26, maxWidth:330,
            background:"rgba(255,255,255,.92)", backdropFilter:"blur(18px)",
            border:"2px solid #fbcfe8",
            boxShadow:"0 18px 55px rgba(236,72,153,.26)",
            animation:"msgReveal .65s cubic-bezier(.34,1.56,.64,1) both",
          }}>
            <div style={{ fontSize:26, marginBottom:10 }}>🎁 🌟 🎁</div>
            <p style={{
              fontFamily:"'Dancing Script',cursive",
              fontSize:"clamp(17px,5vw,23px)",
              fontWeight:700, color:"#9d174d", lineHeight:1.5,
            }}>
              XUỐNG DƯỚI ĐI,<br/>
              MÌNH CÓ BẤT NGỜ<br/>
              CHO BẠN!
            </p>
            <p style={{
              fontFamily:"'Lora',serif", fontStyle:"italic",
              fontSize:12, color:"#f472b6",
              marginTop:12, lineHeight:1.65,
            }}>
              Ngoài đời thực, quà thật đang chờ bạn 🎀<br/>
              Happy Birthday, Như Nguyệt! 🌸💕
            </p>
            <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:14 }}>
              {["🌸","💗","🌸","💗","🌸"].map(function(e, i){
                return (
                  <span key={i} style={{
                    fontSize:16, display:"inline-block",
                    animation:"heartFloat "+(1.6+i*.2)+"s "+(i*.18)+"s ease-in-out infinite alternate",
                  }}>{e}</span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  var [screen, setScreen] = useState("lock");

  var unlock  = useCallback(function(){ setScreen("step1"); }, []);
  var toStep2 = useCallback(function(){ setScreen("step2"); }, []);
  var toStep3 = useCallback(function(){ setScreen("step3"); }, []);

  return (
    <>
      <GlobalStyle/>
      {screen === "lock"  && <LockScreen onUnlock={unlock}/>}
      {screen === "step1" && <Step1 onNext={toStep2}/>}
      {screen === "step2" && <Step2 onNext={toStep3}/>}
      {screen === "step3" && <Step3/>}
    </>
  );
}
export default function App() {
  return (
    <>
      <GlobalStyle />
      <LockScreen onUnlock={() => alert("Đã mở khóa! Chúc mừng sinh nhật!")} />
    </>
  );
}