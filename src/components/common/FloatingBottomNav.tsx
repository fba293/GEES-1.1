/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Custom Liquid Glass Floating Mobile Bottom Navigation Bar (Nimbus "Waterline" Edition)
 *
 * Combines the GEES navigation architecture with fluid liquid-glass water physics:
 * - A pill of water: the active drop stretches toward the item you pick, splits into
 *   droplets on long jumps and merges back with a ripple.
 * - Real WebGL waterline shader drawing water caustics, Fresnel iridescence, lens refraction,
 *   and surface tension physics; with seamless CSS drop fallback.
 * - Tactile micro-interaction scenes for each icon (glow, spin, pop, drop, wave).
 * - Automatic dark/light mode tone synchronization via MutationObserver.
 * - Integrated GEES V3 Minimal iOS Quick Actions popup with AnimatePresence.
 * - Guaranteed 44x44px minimum touch targets and safe-area inset support.
 */

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useWishlist } from '../../context/WishlistContext.tsx';
import { motion, AnimatePresence } from 'framer-motion';

export interface FloatingBottomNavProps {
  currentView: string;
  onNavigate: (view: string, payload?: any) => void;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenConsultation?: (counselorNote?: string) => void;
  sound?: boolean;
}

export type NimbusFx = "plane" | "drop" | "spin" | "glow" | "wave" | "pop" | "none";

const PAD = 14; // canvas bleed around the pill, for shadows and ripples

/* ---------- WebGL Shaders for Liquid Glass Waterline ---------- */
const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uDpr;uniform float uTime;uniform vec4 uPill;
uniform vec4 uBlob[6];uniform float uSy[6];uniform vec4 uRip[6];uniform vec3 uMouse;uniform float uDark;uniform float uAmb;
float sdRB(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float sdCap(vec2 p,vec4 B,float sy){p-=B.xy;p.y/=sy;p.x=max(abs(p.x)-B.z,0.);return(length(p)-B.w)*min(1.,sy);}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float dropD(vec2 p){float d=1e4;for(int i=0;i<6;i++){if(uBlob[i].w>.5){d=smin(d,sdCap(p,uBlob[i],uSy[i]),13.);}}return d;}
float pillD(vec2 p){vec2 h=uPill.zw*.5;return sdRB(p-uPill.xy-h,h,h.y);}
float lens(float d,float w){float t=clamp(-d/w,0.,1.);return sqrt(1.-(1.-t)*(1.-t));}
float waves(vec2 p){float w=0.;
 for(int i=0;i<6;i++){vec4 R=uRip[i];if(R.w>0.){float x=length(p-R.xy)-R.z*240.;w+=R.w*exp(-R.z*1.7)*sin(x*.3)*exp(-x*x/700.);}}
 vec2 m=p-uMouse.xy;w+=uMouse.z*3.6*exp(-dot(m,m)/1000.);
 w+=uAmb*(sin(p.x*.05+uTime*1.2)*.45+sin(p.x*.13-uTime*.85+p.y*.2)*.25);return w;}
float H(vec2 p){float dp=pillD(p);return lens(dp,uPill.w*.36)*2.4+lens(dropD(p),11.)*7.5+waves(p)*smoothstep(0.,7.,-dp);}
float caus(vec2 p,float t){vec2 q=p;float c=0.;for(int i=0;i<3;i++){q+=vec2(sin(q.y*1.1+t),cos(q.x*1.3-t*.7))*.6;c+=1./(1.+16.*abs(sin(q.x)*sin(q.y)));}return c/3.;}
void main(){
 vec2 p=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
 float dp=pillD(p);float dd=dropD(p);
 float h0=H(p);vec3 n=normalize(vec3(h0-H(p+vec2(1.,0.)),h0-H(p+vec2(0.,1.)),1.));
 vec3 V=vec3(0.,0.,1.);
 float spec=pow(max(dot(reflect(-normalize(vec3(-.45,-.8,.85)),n),V),0.),70.);
 float spec2=pow(max(dot(reflect(-normalize(vec3(.6,.75,.7)),n),V),0.),22.)*.3;
 float fres=clamp((1.-n.z)*4.,0.,1.);
 vec3 irid=.5+.5*cos(6.2831*(vec3(0.08,.38,.72)+fres*.85+p.x*.0028+uTime*.035));
 float pm=smoothstep(1.,-1.,dp);float dm=smoothstep(1.,-1.,dd)*smoothstep(1.,-2.,dp);
 float sh=smoothstep(9.,-9.,dropD(p-vec2(0.,5.)))*(1.-dm)*pm*(.14+.08*uDark);
 vec3 c=vec3(0.04,.14,.36)*sh;float a=sh;
 float pa=clamp(pm*(fres*.5+spec*.9+spec2),0.,1.);
 c=mix(vec3(1.),irid,.5*fres)*pa+c*(1.-pa);a=pa+a*(1.-pa);
 float th=lens(dd,11.);
 float cs=caus((p+n.xy*th*18.)*.085,uTime*.9);
 vec3 tint=mix(vec3(.98,.88,.65),vec3(.98,.72,.22),uDark);
 float rim=dm*(1.-smoothstep(0.,8.,-dd));
 float cres=dm*smoothstep(.12,.55,dot(n.xy,normalize(vec2(.55,.85))))*smoothstep(0.,3.,-dd);
 float body=.5+.5*clamp(-n.y*3.,-1.,1.);
 float da=dm*(.26+.14*body)*(1.-.35*uDark);vec3 dc=mix(tint,vec3(1.),body*.6);
 float la=rim*.22;vec3 lc=mix(vec3(.9,.55,.1),vec3(.98,.72,.2),uDark);dc=lc*la+dc*da*(1.-la);da=la+da*(1.-la);
 la=clamp(cres*.7+smoothstep(.6,1.,cs)*.28*th*dm,0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=clamp(dm*(spec*1.2+spec2*.5),0.,1.);dc=vec3(1.)*la+dc*(1.-la);da=la+da*(1.-la);
 la=dm*smoothstep(-2.,0.,dd)*.4;dc=mix(vec3(1.),irid,.35)*la+dc*(1.-la);da=la+da*(1.-la);
 c=dc+c*(1.-da);a=da+a*(1.-da);
 gl_FragColor=vec4(c,a);
}`;

type Body = { x: number; v: number };
type Sat = { x: number; y: number; vx: number; vy: number; r: number; k: number };
type Rip = { x: number; y: number; age: number; amp: number };

function makeState() {
  return {
    a: { x: 0, v: 0 } as Body,
    b: { x: 0, v: 0 } as Body,
    sy: { s: 1, v: 0 },
    lead: 0 as 0 | 1,
    lagFrom: 0,
    sats: [] as Sat[],
    rips: [] as Rip[],
    t: { x: 0, cy: 0, q: 0, r: 21 },
    q: 0,
    mouse: { x: 0, y: 0, s: 0, on: false },
    moving: false,
    split: false,
    ready: false,
    w: 0,
    h: 0,
    visible: true,
    reduce: false,
    raf: 0,
    last: 0,
    time: 0,
    glc: null as null | { gl: WebGLRenderingContext; u: Record<string, WebGLUniformLocation | null> },
  };
}

function initGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }) as WebGLRenderingContext | null;
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT);
  const fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  gl.useProgram(p);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(p, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u: Record<string, WebGLUniformLocation | null> = {};
  for (const n of ["uRes", "uDpr", "uTime", "uPill", "uBlob", "uSy", "uRip", "uMouse", "uDark", "uAmb"]) {
    u[n] = gl.getUniformLocation(p, n);
  }
  return { gl, u };
}

function supportsRefraction() {
  if (typeof window === "undefined" || typeof CSS === "undefined") return false;
  const ua = navigator.userAgent;
  return /Chrome\/|Chromium\/|Edg\//.test(ua) && !/Firefox\//.test(ua) && !!(CSS as any).supports?.("backdrop-filter", "url(#a)");
}

/* ---------- CSS for Fluid Navigation & Icons ---------- */
const LIQUID_NAV_CSS = `
.gees-liquid-nav{--n-tint:rgba(255,255,255,.92);--n-fg:#0B132B;--n-fg-soft:rgba(11,19,43,.62);--n-rim:rgba(255,255,255,.95);
  position:relative;display:flex;align-items:center;justify-content:space-around;width:100%;height:64px;padding:4px 8px env(safe-area-inset-bottom, 12px);border-radius:0;border-top:1px solid rgba(0,0,0,0.08);isolation:isolate;
  font-family:ui-sans-serif,-apple-system,"SF Pro Text","Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased;user-select:none;-webkit-tap-highlight-color:transparent}
.gees-liquid-nav[data-tone="dark"]{--n-tint:rgba(12,20,39,.92);--n-fg:#FBB034;--n-fg-soft:rgba(241,247,255,.65);--n-rim:rgba(251,176,52,.35)}
.gees-liquid-glass{position:absolute;inset:0;border-radius:inherit;z-index:-2;overflow:hidden;background:var(--n-tint);
  -webkit-backdrop-filter:blur(16px) saturate(1.3) brightness(1.05);backdrop-filter:blur(16px) saturate(1.3) brightness(1.05);
  box-shadow:inset 0 1px 1.5px var(--n-rim),inset 0 0 0 1px rgba(255,255,255,.25),0 12px 36px -12px rgba(0,20,50,.28),0 3px 10px rgba(0,20,50,.08)}
.gees-liquid-nav[data-tone="dark"] .gees-liquid-glass{
  box-shadow:inset 0 1px 1.5px var(--n-rim),inset 0 0 0 1px rgba(251,176,52,.18),0 14px 44px -8px rgba(0,0,0,.75),0 4px 14px rgba(0,0,0,.45)}
.gees-liquid-nav[data-refract="on"] .gees-liquid-glass{-webkit-backdrop-filter:url(#gees-nimbus-refract) blur(3px) saturate(1.3) brightness(1.05);backdrop-filter:url(#gees-nimbus-refract) blur(3px) saturate(1.3) brightness(1.05)}
.gees-liquid-water{position:absolute;left:${-PAD}px;top:${-PAD}px;z-index:-1;pointer-events:none}
.gees-liquid-nav[data-gl="off"] .gees-liquid-water{display:none}
.gees-liquid-drop{display:none;position:absolute;top:4px;bottom:4px;left:0;border-radius:999px;z-index:-1;pointer-events:none;will-change:transform,width;
  background:radial-gradient(120% 140% at 30% 0%,rgba(251,176,52,.48),rgba(251,176,52,0) 65%),rgba(251,176,52,.22);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.95),inset 0 -2px 6px rgba(245,158,11,.3),inset 0 0 0 1px rgba(251,176,52,.4),0 6px 16px -6px rgba(251,176,52,.35)}
.gees-liquid-nav[data-gl="off"] .gees-liquid-drop{display:block}
.gees-liquid-item{position:relative;z-index:1;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;flex:1;height:100%;min-height:44px;padding:2px 0;border:0;border-radius:999px;background:none;color:var(--n-fg-soft);
  font-family:inherit;font-weight:600;font-size:10px;line-height:1;letter-spacing:-.01em;text-decoration:none;cursor:pointer;touch-action:manipulation;transition:color .25s,transform .15s}
.gees-liquid-item:active{transform:scale(0.95)}
.gees-liquid-item:hover,.gees-liquid-item[aria-current="page"]{color:var(--n-fg)}
.gees-liquid-label{font-size:10.5px;font-weight:600;line-height:1;margin-top:2px;letter-spacing:-0.01em;transition:color .2s,font-weight .2s}
.gees-liquid-item[aria-current="page"] .gees-liquid-label{color:#FBB034;font-weight:700}
.gees-nv-ico{position:relative;display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;flex:none}
.gees-nv-ico svg{transition:transform .45s cubic-bezier(.3,1.6,.5,1)}
.gees-liquid-item[aria-current="page"] .gees-nv-ico svg{transform:translateY(-1px) scale(1.12)}
.nv-door{fill:transparent}
.gees-nv-ico[data-fx="pop"] svg{animation:nvPop .5s cubic-bezier(.3,1.6,.5,1) both}
@keyframes nvPop{0%{transform:scale(.72)}60%{transform:scale(1.25)}100%{transform:translateY(-1px) scale(1.12)}}
.gees-nv-ico[data-fx="spin"] svg{animation:nvSpin 1s cubic-bezier(.2,.75,.25,1) both}
@keyframes nvSpin{0%{transform:perspective(80px) rotateY(0)}100%{transform:perspective(80px) rotateY(360deg) translateY(-1px) scale(1.12)}}
.gees-nv-ico[data-fx="glow"] svg{animation:nvHop .8s cubic-bezier(.3,1.4,.5,1) both;transform-origin:50% 100%}
@keyframes nvHop{0%{transform:none}30%{transform:translateY(-5px) scale(1.04,.96)}55%{transform:translateY(0) scale(1.14,.86)}75%{transform:translateY(-2px) scale(.98,1.04)}100%{transform:translateY(-1px) scale(1.12)}}
.gees-nv-ico[data-fx="glow"] .nv-door{animation:nvDoor 1.3s ease both}
@keyframes nvDoor{0%{fill:transparent}30%{fill:#FFF3A8}100%{fill:rgba(251,176,52,.6)}}
.gees-nv-ico[data-fx="drop"] svg{animation:nvDrop .95s cubic-bezier(.4,0,.3,1) both;transform-origin:50% 100%}
@keyframes nvDrop{0%{transform:translateY(-1px)}26%{transform:translateY(-12px) scale(.88,1.12)}46%{transform:translateY(3px) scale(1.3,.68)}62%{transform:translateY(-3px) scale(.92,1.08)}80%{transform:translateY(0) scale(1.04,.97)}100%{transform:translateY(-1px) scale(1.12)}}
.gees-nv-ico[data-fx="drop"]::before,.gees-nv-ico[data-fx="drop"]::after{content:"";position:absolute;bottom:0;left:50%;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:#FBB034;opacity:0;pointer-events:none}
.gees-nv-ico[data-fx="drop"]::before{animation:nvSplashL .95s ease-out both}
.gees-nv-ico[data-fx="drop"]::after{animation:nvSplashR .95s ease-out both}
@keyframes nvSplashL{0%,44%{opacity:0;transform:none}50%{opacity:.9;transform:translate(-6px,-6px)}75%,100%{opacity:0;transform:translate(-12px,1px) scale(.4)}}
@keyframes nvSplashR{0%,44%{opacity:0;transform:none}50%{opacity:.9;transform:translate(6px,-7px)}75%,100%{opacity:0;transform:translate(13px,1px) scale(.4)}}
.gees-nv-ico[data-fx="wave"] svg{animation:nvWave .9s ease-in-out both;transform-origin:50% 92%}
@keyframes nvWave{0%{transform:none}20%{transform:rotate(-15deg)}40%{transform:rotate(12deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(4deg)}100%{transform:translateY(-1px) scale(1.12)}}
@media (prefers-reduced-motion:reduce){.gees-nv-ico svg,.gees-nv-ico::before,.gees-nv-ico::after,.nv-door{animation:none!important;transition:none}}
`;

export const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenMobileMenu,
  onOpenSearch,
  onOpenConsultation,
  sound = false
}) => {
  const { wishlist } = useWishlist();
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Map currentView to tab index:
  const getActiveIndexFromView = (view: string): number => {
    if (view === 'home') return 0;
    if (view === 'universities' || view === 'courses' || view === 'destinations') return 1;
    if (view === 'wishlist' || view === 'saved-courses') return 4;
    return 0;
  };

  const activeIndex = getActiveIndexFromView(currentView);

  // Liquid State & Refs
  const navRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const audio = useRef<AudioContext | null>(null);
  const st = useRef(makeState());
  const [gl, setGl] = useState<"on" | "off">("on");
  const [refract, setRefract] = useState(false);
  const [fx, setFx] = useState({ i: -1, n: 0 });

  // Dark mode tone detection
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const dark = isDark ? 1 : 0;
  const darkRef = useRef(dark);
  darkRef.current = dark;

  // Listen for mobile search bottom sheet toggle event
  const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleSheetToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.isOpen === 'boolean') {
        setIsSearchSheetOpen(customEvent.detail.isOpen);
      }
    };
    window.addEventListener('gees-hero-search-sheet', handleSheetToggle);
    return () => {
      window.removeEventListener('gees-hero-search-sheet', handleSheetToggle);
    };
  }, []);

  // Sync dark mode tone on html class change
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  /* ---- Liquid Physics Drawing ---- */
  const draw = useCallback(() => {
    const s = st.current;
    const T = s.t;
    const sep = Math.abs(s.a.x - s.b.x);
    const thin = Math.min(sep / (2 * (s.q + T.r) || 1), 1);
    const r = T.r * (1 - 0.3 * thin);

    if (s.glc) {
      const { gl: g, u } = s.glc;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
      g.uniform2f(u.uRes, s.w + PAD * 2, s.h + PAD * 2);
      g.uniform1f(u.uDpr, dpr);
      g.uniform1f(u.uTime, s.time);
      g.uniform4f(u.uPill, PAD, PAD, s.w, s.h);
      const blobs = new Float32Array(24);
      const sy = new Float32Array(6).fill(1);
      const head = s.lead === 0 ? s.a : s.b, tail = s.lead === 0 ? s.b : s.a;
      blobs.set([head.x, T.cy, s.q * (1 - 0.25 * thin), T.r * (1 - 0.12 * thin), tail.x, T.cy, s.q * (1 - 0.8 * thin), T.r * (1 - 0.5 * thin)], 0);
      sy[0] = sy[1] = s.sy.s;
      s.sats.slice(0, 4).forEach((d, i) => blobs.set([d.x, d.y, 0, d.r], 8 + i * 4));
      g.uniform4fv(u.uBlob, blobs);
      g.uniform1fv(u.uSy, sy);
      const rips = new Float32Array(24);
      s.rips.slice(-6).forEach((p, i) => rips.set([p.x, p.y, p.age, p.amp], i * 4));
      g.uniform4fv(u.uRip, rips);
      g.uniform3f(u.uMouse, s.mouse.x, s.mouse.y, s.mouse.s);
      g.uniform1f(u.uDark, darkRef.current);
      g.uniform1f(u.uAmb, s.reduce ? 0 : 1);
      g.clearColor(0, 0, 0, 0);
      g.clear(g.COLOR_BUFFER_BIT);
      g.drawArrays(g.TRIANGLES, 0, 3);
    } else if (dropRef.current) {
      const left = Math.min(s.a.x, s.b.x) - s.q - r - PAD;
      const width = sep + 2 * (s.q + r);
      dropRef.current.style.width = `${width}px`;
      dropRef.current.style.transform = `translateX(${left}px) scaleY(${s.sy.s})`;
    }
  }, []);

  /* ---- Surface Tension Physics Step ---- */
  const step = useCallback((dt: number, now: number) => {
    const s = st.current;
    const T = s.t;
    s.time += dt;
    s.q += (T.q - s.q) * Math.min(1, dt * 12);
    const bodies = [s.a, s.b];
    let still = true;

    if (s.reduce) {
      s.a.x = s.b.x = T.x; s.a.v = s.b.v = 0; s.sy.s = 1; s.sats = [];
    } else {
      bodies.forEach((B, i) => {
        const lead = i === s.lead;
        const k = lead ? 210 : 72;
        const c = lead ? 25 : 13;
        const f = !lead && now < s.lagFrom ? 0.08 : 1;
        B.v += (k * (T.x - B.x) - c * B.v) * dt * f;
        B.x += B.v * dt;
        const lo = PAD + 6 + s.q + T.r - 3, hi = PAD + s.w - 6 - s.q - T.r + 3;
        if (B.x < lo || B.x > hi) {
          s.sy.v -= Math.min(Math.abs(B.v), 900) * 0.0016;
          B.x = Math.max(lo, Math.min(hi, B.x));
          B.v *= -0.25;
        }
        if (Math.abs(T.x - B.x) > 0.3 || Math.abs(B.v) > 3) still = false;
      });

      const L = bodies[s.lead];
      const syT = 1 - 0.2 * Math.min(Math.abs(L.v) / 1500, 1);
      s.sy.v += (280 * (syT - s.sy.s) - 9 * s.sy.v) * dt;
      s.sy.s += s.sy.v * dt;
      if (Math.abs(s.sy.s - 1) > 0.002 || Math.abs(s.sy.v) > 0.02) still = false;

      const sep = Math.abs(s.a.x - s.b.x);
      const r = T.r * (1 - 0.3 * Math.min(sep / (2 * (s.q + T.r) || 1), 1));
      if (!s.split && s.moving && sep - 2 * s.q - 2 * r > -6) {
        s.split = true;
        const lo = bodies[1 - s.lead], hi = bodies[s.lead];
        [0.3, 0.5, 0.72].forEach((t, j) => {
          s.sats.push({
            x: lo.x + (hi.x - lo.x) * t + (Math.random() - 0.5) * 6,
            y: T.cy + (Math.random() - 0.5) * 10,
            vx: (lo.v + hi.v) * 0.45,
            vy: (Math.random() - 0.5) * 60,
            r: 5 + Math.random() * 3 - j * 0.5,
            k: 70 + Math.random() * 90,
          });
        });
      }

      s.sats = s.sats.filter((d) => {
        d.vx += (d.k * (T.x - d.x) - 9 * d.vx) * dt;
        d.vy += (90 * (T.cy - d.y) - 7 * d.vy) * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.x = Math.max(PAD + 8 + d.r, Math.min(PAD + s.w - 8 - d.r, d.x));
        d.y = Math.max(T.cy - T.r + d.r, Math.min(T.cy + T.r - d.r, d.y));
        if (Math.abs(T.x - d.x) < s.q + T.r * 0.5) d.r -= dt * 26;
        return d.r > 0.6;
      });
      if (s.sats.length) still = false;
    }

    if (s.moving && still) {
      s.moving = false;
      if (s.split || !s.reduce) s.rips.push({ x: T.x, y: T.cy, age: 0, amp: s.split ? 1.2 : 0.7 });
    }

    s.rips.forEach((p) => (p.age += dt));
    s.rips = s.rips.filter((p) => p.age < 2.4);
    const target = s.mouse.on ? 1 : 0;
    s.mouse.s += (target - s.mouse.s) * Math.min(1, dt * 7);
  }, []);

  const loop = useCallback(() => {
    const s = st.current;
    if (s.raf) return;
    s.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - s.last) / 1000, 1 / 30);
      s.last = now;
      step(dt, now);
      draw();
      const busy = s.moving || s.rips.length || s.sats.length || s.mouse.s > 0.01;
      if (s.visible && (!s.reduce || busy)) s.raf = requestAnimationFrame(tick);
      else s.raf = 0;
    };
    s.raf = requestAnimationFrame(tick);
  }, [draw, step]);

  /* ---- Measure Pill and Item Coordinates ---- */
  const measure = useCallback(() => {
    const nav = navRef.current;
    const targetIndex = isQuickActionsOpen ? 2 : activeIndex;
    const el = itemRefs.current[targetIndex];
    if (!nav || !el) return;
    const s = st.current;
    s.w = nav.offsetWidth;
    s.h = nav.offsetHeight;
    const T = s.t;
    T.r = el.offsetHeight / 2;
    T.q = Math.max(0, el.offsetWidth / 2 - T.r);
    T.cy = PAD + el.offsetTop + el.offsetHeight / 2;
    const nx = PAD + el.offsetLeft + el.offsetWidth / 2;

    if (!s.ready) {
      s.a.x = s.b.x = nx;
      s.q = T.q;
      s.ready = true;
    } else if (Math.abs(nx - T.x) > 0.5) {
      s.lead = Math.abs(nx - s.a.x) <= Math.abs(nx - s.b.x) ? 0 : 1;
      s.lagFrom = performance.now() + 70;
      s.moving = true;
      s.split = false;
    }
    T.x = nx;

    const cv = canvasRef.current;
    if (cv) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = s.w + PAD * 2, Hh = s.h + PAD * 2;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(Hh * dpr)) {
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(Hh * dpr);
        cv.style.width = `${W}px`;
        cv.style.height = `${Hh}px`;
      }
    }
    loop();
  }, [activeIndex, isQuickActionsOpen, loop]);

  useEffect(() => {
    setRefract(supportsRefraction());
    const s = st.current;
    s.reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const cv = canvasRef.current;
    s.glc = cv ? initGL(cv) : null;
    if (!s.glc) setGl("off");
    const lost = (e: Event) => { e.preventDefault(); s.glc = null; setGl("off"); };
    cv?.addEventListener("webglcontextlost", lost);
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; if (s.visible) loop(); });
    if (navRef.current) io.observe(navRef.current);
    const vis = () => { s.visible = document.visibilityState === "visible"; if (s.visible) loop(); };
    document.addEventListener("visibilitychange", vis);
    return () => {
      cv?.removeEventListener("webglcontextlost", lost);
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [loop]);

  useLayoutEffect(() => { measure(); }, [measure]);
  const measureRef = useRef(measure);
  measureRef.current = measure;

  useEffect(() => {
    let lastW = -1;
    const ro = new ResizeObserver(() => {
      const w = navRef.current?.offsetWidth ?? 0;
      if (w !== lastW) { lastW = w; st.current.ready = false; measureRef.current(); }
    });
    if (navRef.current) ro.observe(navRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => { loop(); }, [isDark, loop]);

  /* ---- Tactile Sound Plip & Ripple ---- */
  const local = (clientX: number, clientY: number) => {
    const r = navRef.current!.getBoundingClientRect();
    return { x: clientX - r.left + PAD, y: clientY - r.top + PAD };
  };

  const ripple = (x: number, y: number, amp: number) => {
    const s = st.current;
    if (s.reduce) return;
    s.rips.push({ x, y, age: 0, amp });
    loop();
  };

  const iconCenter = (i: number) => {
    const el = iconRefs.current[i];
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return local(b.left + b.width / 2, b.top + b.height / 2);
  };

  const plip = () => {
    if (!sound) return;
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = (audio.current ||= new AC());
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(420 + Math.random() * 80, t);
      o.frequency.exponentialRampToValueAtTime(1500, t + 0.07);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.18);
    } catch {
      // Audio policy safe
    }
  };

  // Close quick actions modal if user clicks outside or presses Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isQuickActionsOpen &&
        quickActionsRef.current &&
        !quickActionsRef.current.contains(e.target as Node)
      ) {
        setIsQuickActionsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQuickActionsOpen) {
        setIsQuickActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isQuickActionsOpen]);

  // Tab click handler with fluid spring animation
  const handleTabClick = (index: number) => {
    const tabFx: NimbusFx = index === 0 ? "glow" : index === 1 ? "spin" : index === 2 ? "pop" : index === 3 ? "drop" : "wave";
    setFx((f) => ({ i: index, n: f.n + 1 }));
    plip();

    const c = iconCenter(index);
    if (c) {
      if (tabFx === "drop") setTimeout(() => ripple(c.x, st.current.t.cy, 1.4), 430);
      else ripple(c.x, c.y, 0.7);
    }

    if (index === 0) {
      setIsQuickActionsOpen(false);
      onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (index === 1) {
      setIsQuickActionsOpen(false);
      onNavigate('universities');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (index === 2) {
      setIsQuickActionsOpen((prev) => !prev);
    } else if (index === 3) {
      setIsQuickActionsOpen(false);
      onOpenSearch();
    } else if (index === 4) {
      setIsQuickActionsOpen(false);
      onNavigate('wishlist');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const p = local(e.clientX, e.clientY);
    const s = st.current;
    s.mouse.x = p.x;
    s.mouse.y = p.y;
    s.mouse.on = true;
    loop();
  };

  const tabs: { label: string; fx: NimbusFx; icon: React.ReactNode; ariaLabel: string }[] = [
    {
      label: 'Home',
      fx: 'glow',
      ariaLabel: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3.5 11.2 12 4l8.5 7.2" />
          <path d="M6 9.6V20h12V9.6" />
          <path className="nv-door" d="M10 20v-5h4v5Z" />
        </svg>
      )
    },
    {
      label: 'Explore',
      fx: 'spin',
      ariaLabel: 'Explore Universities & Destinations',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.15" />
        </svg>
      )
    },
    {
      label: 'Actions',
      fx: 'pop',
      ariaLabel: 'Fast-Track Quick Actions',
      icon: (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform duration-250 ${isQuickActionsOpen ? 'rotate-45' : ''}`}
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )
    },
    {
      label: 'Search',
      fx: 'drop',
      ariaLabel: 'Search Programs & Universities',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7.5" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
      )
    },
    {
      label: 'Saved',
      fx: 'wave',
      ariaLabel: 'Saved Wishlist Courses',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* GEES V3 Minimal iOS Quick Actions Menu (Triggered by Tab 2) */}
      <AnimatePresence>
        {isQuickActionsOpen && (
          <motion.div
            ref={quickActionsRef}
            role="dialog"
            aria-label="Quick Actions"
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.985 }}
            transition={{
              duration: 0.26,
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{
              zIndex: 9998,
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)'
            }}
            className="xl:hidden fixed bottom-[72px] xs:bottom-[76px] inset-x-3.5 sm:inset-x-4 max-w-[420px] mx-auto rounded-[22px] bg-white dark:bg-[#0B1329] border border-slate-200/90 dark:border-slate-800 text-[#0B132B] dark:text-slate-100 select-none max-h-[72vh] overflow-y-auto no-scrollbar"
          >
            {/* Header: Quick Actions + Close Icon */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h3 className="text-[15px] font-bold text-[#0B132B] dark:text-white tracking-tight">
                Quick Actions
              </h3>
              <button
                type="button"
                onClick={() => setIsQuickActionsOpen(false)}
                className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer active:scale-95"
                aria-label="Close menu"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Five Compact Menu Items */}
            <div className="py-1">
              {/* 1. Universities */}
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  onNavigate('universities');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full min-h-[52px] sm:min-h-[56px] px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="material-symbols-outlined text-[21px] text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors shrink-0">
                    school
                  </span>
                  <span className="text-[14px] sm:text-[15px] font-semibold text-[#0B132B] dark:text-white tracking-tight truncate">
                    Universities
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">
                    233+
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-transform group-hover:translate-x-0.5">
                    chevron_right
                  </span>
                </div>
              </button>

              {/* 2. Study Destinations */}
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  onNavigate('countries');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full min-h-[52px] sm:min-h-[56px] px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="material-symbols-outlined text-[21px] text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors shrink-0">
                    public
                  </span>
                  <span className="text-[14px] sm:text-[15px] font-semibold text-[#0B132B] dark:text-white tracking-tight truncate">
                    Study Destinations
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">
                    15 Countries
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-transform group-hover:translate-x-0.5">
                    chevron_right
                  </span>
                </div>
              </button>

              {/* Saved Wishlist */}
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  onNavigate('wishlist');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full min-h-[52px] sm:min-h-[56px] px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="material-symbols-outlined text-[21px] text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors shrink-0">
                    favorite
                  </span>
                  <span className="text-[14px] sm:text-[15px] font-semibold text-[#0B132B] dark:text-white tracking-tight truncate">
                    Saved Wishlist
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${wishlist.length === 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'}`}>
                    {wishlist.length}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-transform group-hover:translate-x-0.5">
                    chevron_right
                  </span>
                </div>
              </button>

              {/* 3. Scholarships */}
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  onNavigate('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full min-h-[52px] sm:min-h-[56px] px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="material-symbols-outlined text-[21px] text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors shrink-0">
                    military_tech
                  </span>
                  <span className="text-[14px] sm:text-[15px] font-semibold text-[#0B132B] dark:text-white tracking-tight truncate">
                    Scholarships
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">
                    Up to 100%
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-transform group-hover:translate-x-0.5">
                    chevron_right
                  </span>
                </div>
              </button>

              {/* Subtle divider only between Scholarships and Free Consultation */}
              <div className="mx-4 my-1 border-t border-slate-100 dark:border-slate-800" />

              {/* 4. Free Consultation */}
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  if (onOpenConsultation) {
                    onOpenConsultation('Mobile Minimalist Quick Actions');
                  } else {
                    onNavigate('contact');
                  }
                }}
                className="w-full min-h-[52px] sm:min-h-[56px] px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="material-symbols-outlined text-[21px] text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors shrink-0">
                    event_available
                  </span>
                  <span className="text-[14px] sm:text-[15px] font-semibold text-[#0B132B] dark:text-white tracking-tight truncate">
                    Free Consultation
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500">
                    Free
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-transform group-hover:translate-x-0.5">
                    chevron_right
                  </span>
                </div>
              </button>

              {/* 5. Visa Tracker */}
              <button
                type="button"
                onClick={() => {
                  setIsQuickActionsOpen(false);
                  onNavigate('track-visa');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full min-h-[52px] sm:min-h-[56px] px-4 pb-4 pt-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className="material-symbols-outlined text-[21px] text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors shrink-0">
                    description
                  </span>
                  <span className="text-[14px] sm:text-[15px] font-semibold text-[#0B132B] dark:text-white tracking-tight truncate">
                    Visa Tracker
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="material-symbols-outlined text-[18px] text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-transform group-hover:translate-x-0.5">
                    chevron_right
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Island Navigation Dock with Real WebGL Liquid Glass Waterline */}
      {!isSearchSheetOpen && (
      <div
        aria-label="Mobile Bottom Navigation Wrapper"
        className="xl:hidden fixed bottom-0 inset-x-0 z-40 w-full select-none pointer-events-auto"
        data-purpose="ios-native-bottom-nav-wrapper"
      >
        <style dangerouslySetInnerHTML={{ __html: LIQUID_NAV_CSS }} />

        {/* SVG Filter for Optical Light Refraction */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <filter id="gees-nimbus-refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.02" numOctaves="2" seed="7" result="noise" />
            <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
            <feDisplacementMap in="SourceGraphic" in2="soft" scale="60" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        {/* Liquid Water Nav Pill */}
        <nav
          ref={navRef as any}
          className="gees-liquid-nav"
          data-tone={isDark ? "dark" : "light"}
          data-gl="off"
          data-refract="off"
          aria-label="Main Navigation"
          onPointerMove={onMove}
          onPointerLeave={() => { st.current.mouse.on = false; loop(); }}
          onPointerDown={(e) => { const p = local(e.clientX, e.clientY); }}
        >
          {/* Frosted Glass Base Surface */}
          <span className="gees-liquid-glass" aria-hidden="true" />

          {/* WebGL Canvas for Surface Tension Water Shader */}
          <canvas className="gees-liquid-water" ref={canvasRef} aria-hidden="true" />

          {/* CSS Drop Fallback when WebGL is unmounted or disabled */}
          <span className="gees-liquid-drop" ref={dropRef} aria-hidden="true" />

          {/* 5 Liquid Interactive Tabs */}
          {tabs.map((tab, idx) => {
            const isTabActive = isQuickActionsOpen ? idx === 2 : activeIndex === idx;
            const playing = fx.i === idx && tab.fx !== "none";

            return (
              <button
                key={tab.label}
                ref={(el) => { itemRefs.current[idx] = el; }}
                type="button"
                onClick={() => handleTabClick(idx)}
                aria-label={tab.ariaLabel}
                aria-current={isTabActive ? 'page' : undefined}
                className="gees-liquid-item"
              >
                {/* Micro-interactive animated icon */}
                <span
                  className="gees-nv-ico"
                  key={playing ? fx.n : 0}
                  data-fx={playing ? tab.fx : undefined}
                  ref={(el) => { iconRefs.current[idx] = el; }}
                >
                  {tab.icon}
                </span>

                {/* Tab Label */}
                <span className="gees-liquid-label">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      )}
    </>
  );
};

export default FloatingBottomNav;
