import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Art direction / performance controls. All geometry is generated once per tier.
export const BRAIN_SETTINGS = {
  desktopParticles: 18000,
  mobileParticles: 8000,
  desktopNodes: 1100,
  mobileNodes: 480,
  connectionRadius: 0.24,
  maxConnections: 3,
  colors: ["#6d4aff", "#a897ff", "#d4caff"],
  pulseSpeed: 0.28,
  introSeconds: 2.2,
  bloomStrength: 0.38,
  bloomThreshold: 0.72,
  pixelRatioCap: 1.5,
  mobilePixelRatioCap: 1.25,
  scrollDistance: 1000,
} as const;

const TAU = Math.PI * 2;
const clamp = THREE.MathUtils.clamp;

function randomGenerator(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

/** Winding, domain-warped sulci, rather than independent spherical lobes.
 * Narrow troughs alternate with broad rounded gyri. The same field builds the
 * actual skin geometry and its shadow/particle-density attributes. */
function corticalGroove(x: number, y: number, z: number) {
  const warp = 1.8 * Math.sin(z * 4.1 + x * 2.2) + 0.85 * Math.sin(x * 7.3 - z * 3.2);
  const phase = y * 14.5 + warp + 1.3 * Math.sin(z * 8.2 + y * 2.6);
  const channel = Math.exp(-Math.pow(Math.sin(phase) / 0.25, 2));
  const branch = Math.exp(-Math.pow(Math.sin(z * 12 + x * 5 + Math.sin(y * 6)) / 0.16, 2));
  return Math.max(channel, branch * (0.4 + 0.4 * Math.sin(y * 3 + z * 2)));
}

/** One continuous half-cortex, mirrored at the midline. The inferior surface
 * tucks inward; the front/back contours have different radii. */
function cortexPoint(theta: number, phi: number, side: number): [number, number, number, number] {
  const dx = Math.sin(theta) * Math.cos(phi);
  const dy = Math.cos(theta);
  const dz = Math.sin(theta) * Math.sin(phi);
  const groove = corticalGroove(dx, dy, dz);
  const fold = 1 - groove * 0.085 + Math.sin(dz * 5 + dy * 3) * 0.012;
  const lower = Math.max(0, -dy);
  const x = side * (0.045 + dx * 0.72 * fold * (1 - lower * 0.18));
  const y = 0.12 + dy * 0.76 * fold;
  const z = dz * (dz > 0 ? 1.02 : 0.94) * fold - 0.035 + lower * 0.1;
  return [x, y, z, groove];
}

function buildSkin(mobile: boolean) {
  const positions: number[] = [];
  const grooves: number[] = [];
  const hemispheres: number[] = [];
  const indices: number[] = [];
  const rings = mobile ? 48 : 72;
  const columns = mobile ? 64 : 96;

  // Triangulated continuous hemispheres. No lobe spheres, downloaded model,
  // texture, or runtime asset request. Normals come from the folded geometry.
  for (const side of [-1, 1]) {
    const offset = positions.length / 3;
    for (let r = 0; r <= rings; r++) {
      for (let c = 0; c <= columns; c++) {
        const [x, y, z, groove] = cortexPoint(
          (r / rings) * Math.PI,
          (c / columns - 0.5) * Math.PI,
          side,
        );
        positions.push(x, y, z);
        grooves.push(groove);
        hemispheres.push(side);
      }
    }
    for (let r = 0; r < rings; r++) {
      for (let c = 0; c < columns; c++) {
        const a = offset + r * (columns + 1) + c;
        const b = a + columns + 1;
        if (side === 1) indices.push(a, a + 1, b, b, a + 1, b + 1);
        else indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }

  // Cerebellum: a tucked-under, transversely folded skirt. Stem: a narrowing
  // curved column. Both are sampled as part of the same skin/point system.
  const addSurface = (rows: number, cols: number, point: (u: number, v: number) => number[]) => {
    const offset = positions.length / 3;
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const p = point(r / rows, c / cols);
        positions.push(p[0], p[1], p[2]);
        grooves.push(p[3]);
        hemispheres.push(0);
      }
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const a = offset + r * (cols + 1) + c;
        const b = a + cols + 1;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
  };
  addSurface(28, 48, (u, v) => {
    const theta = u * Math.PI;
    const phi = v * TAU;
    const groove = 0.5 + 0.5 * Math.sin(theta * 48);
    const fold = 1 - groove * 0.045;
    return [
      Math.sin(theta) * Math.cos(phi) * 0.45 * fold,
      -0.56 + Math.cos(theta) * 0.23,
      -0.52 + Math.sin(theta) * Math.sin(phi) * 0.4 * fold,
      groove,
    ];
  });
  addSurface(20, 20, (u, v) => {
    const radius = 0.11 * (1 - u * 0.62);
    return [
      Math.cos(v * TAU) * radius,
      -0.61 - u * 0.48,
      -0.18 + u * 0.13 + Math.sin(v * TAU) * radius,
      0.2,
    ];
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aGroove", new THREE.Float32BufferAttribute(grooves, 1));
  geometry.setAttribute("aHemisphere", new THREE.Float32BufferAttribute(hemispheres, 1));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

type BrainBuffers = {
  skin: THREE.BufferGeometry;
  particles: THREE.BufferGeometry;
  lines: THREE.BufferGeometry;
};

/** Area-weighted surface sampling avoids a dense pole / sparse equator. A
 * spatial grid builds the network once; no O(n²) search or CPU particle work
 * happens in the animation loop. */
function buildBrain(mobile: boolean): BrainBuffers {
  const skin = buildSkin(mobile);
  const source = skin.getAttribute("position");
  const normals = skin.getAttribute("normal");
  const groove = skin.getAttribute("aGroove");
  const hemisphere = skin.getAttribute("aHemisphere");
  const index = skin.index!;
  const triangleCount = index.count / 3;
  const areas = new Float32Array(triangleCount);
  const a = new THREE.Vector3(),
    b = new THREE.Vector3(),
    c = new THREE.Vector3();
  let area = 0;
  for (let t = 0; t < triangleCount; t++) {
    a.fromBufferAttribute(source, index.getX(t * 3));
    b.fromBufferAttribute(source, index.getX(t * 3 + 1));
    c.fromBufferAttribute(source, index.getX(t * 3 + 2));
    b.sub(a);
    c.sub(a);
    area += b.cross(c).length() * 0.5;
    areas[t] = area;
  }
  const count = mobile ? BRAIN_SETTINGS.mobileParticles : BRAIN_SETTINGS.desktopParticles;
  const nodeCount = mobile ? BRAIN_SETTINGS.mobileNodes : BRAIN_SETTINGS.desktopNodes;
  const positions = new Float32Array(count * 3);
  const normal = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const folds = new Float32Array(count);
  const sides = new Float32Array(count);
  const rng = randomGenerator(871203);
  for (let i = 0; i < count; i++) {
    let t = 0,
      u = 0,
      v = 0,
      w = 0,
      fold = 0;
    // Keep some particles just inside troughs, while leaving visible sulci.
    for (let attempt = 0; attempt < 8; attempt++) {
      const target = rng() * area;
      let lo = 0,
        hi = triangleCount - 1;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (areas[mid] < target) lo = mid + 1;
        else hi = mid;
      }
      t = lo;
      u = Math.sqrt(rng());
      v = rng();
      w = 1 - u;
      u *= 1 - v;
      v = 1 - w - u;
      fold =
        groove.getX(index.getX(t * 3)) * w +
        groove.getX(index.getX(t * 3 + 1)) * u +
        groove.getX(index.getX(t * 3 + 2)) * v;
      if (rng() > fold * 0.78) break;
    }
    const ia = index.getX(t * 3),
      ib = index.getX(t * 3 + 1),
      ic = index.getX(t * 3 + 2);
    a.fromBufferAttribute(normals, ia).multiplyScalar(w);
    b.fromBufferAttribute(normals, ib).multiplyScalar(u);
    c.fromBufferAttribute(normals, ic).multiplyScalar(v);
    a.add(b).add(c).normalize();
    const inset = i % 7 === 0 ? -0.012 : 0.008;
    for (let d = 0; d < 3; d++) {
      const coord = d === 0 ? "getX" : d === 1 ? "getY" : "getZ";
      positions[i * 3 + d] =
        source[coord](ia) * w +
        source[coord](ib) * u +
        source[coord](ic) * v +
        a.getComponent(d) * inset;
      normal[i * 3 + d] = a.getComponent(d);
      scatter[i * 3 + d] = (rng() - 0.5) * 5.5;
    }
    seeds[i] = rng();
    folds[i] = fold;
    sides[i] = hemisphere.getX(ia);
  }
  const particles = new THREE.BufferGeometry();
  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particles.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  particles.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
  particles.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  particles.setAttribute("aGroove", new THREE.BufferAttribute(folds, 1));
  particles.setAttribute("aHemisphere", new THREE.BufferAttribute(sides, 1));

  const radius = BRAIN_SETTINGS.connectionRadius;
  const cells = new Map<string, number[]>();
  const key = (x: number, y: number, z: number) => `${x},${y},${z}`;
  for (let i = 0; i < nodeCount; i++) {
    const k = key(
      Math.floor(positions[i * 3] / radius),
      Math.floor(positions[i * 3 + 1] / radius),
      Math.floor(positions[i * 3 + 2] / radius),
    );
    const bucket = cells.get(k) ?? [];
    bucket.push(i);
    cells.set(k, bucket);
  }
  const linePosition: number[] = [],
    lineNormal: number[] = [],
    lineScatter: number[] = [];
  const lineSeed: number[] = [],
    lineSide: number[] = [],
    lineProgress: number[] = [],
    linePhase: number[] = [];
  const pairs = new Set<string>();
  for (let i = 0; i < nodeCount; i++) {
    const x = positions[i * 3],
      y = positions[i * 3 + 1],
      z = positions[i * 3 + 2];
    const cx = Math.floor(x / radius),
      cy = Math.floor(y / radius),
      cz = Math.floor(z / radius);
    const nearby: { j: number; distance: number }[] = [];
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++) {
          for (const j of cells.get(key(cx + dx, cy + dy, cz + dz)) ?? []) {
            if (i === j) continue;
            const distance = Math.hypot(
              x - positions[j * 3],
              y - positions[j * 3 + 1],
              z - positions[j * 3 + 2],
            );
            if (distance > 0.055 && distance < radius) nearby.push({ j, distance });
          }
        }
    nearby.sort((a, b) => a.distance - b.distance);
    for (const { j } of nearby.slice(0, BRAIN_SETTINGS.maxConnections)) {
      const pair = `${Math.min(i, j)}:${Math.max(i, j)}`;
      if (pairs.has(pair)) continue;
      pairs.add(pair);
      const phase = rng();
      for (const [end, n] of [
        [i, 0],
        [j, 1],
      ]) {
        linePosition.push(...positions.subarray(end * 3, end * 3 + 3));
        lineNormal.push(...normal.subarray(end * 3, end * 3 + 3));
        lineScatter.push(...scatter.subarray(end * 3, end * 3 + 3));
        lineSeed.push(seeds[end]);
        lineSide.push(sides[end]);
        lineProgress.push(n);
        linePhase.push(phase);
      }
    }
  }
  const lines = new THREE.BufferGeometry();
  for (const [name, data, size] of [
    ["position", linePosition, 3],
    ["normal", lineNormal, 3],
    ["aScatter", lineScatter, 3],
    ["aSeed", lineSeed, 1],
    ["aHemisphere", lineSide, 1],
    ["aProgress", lineProgress, 1],
    ["aPhase", linePhase, 1],
  ] as [string, number[], number][])
    lines.setAttribute(name, new THREE.Float32BufferAttribute(data, size));
  return { skin, particles, lines };
}

/* GLSL 3D simplex noise: Ashima Arts / Ian McEwan, MIT license.
 * Copyright (C) 2011 Ashima Arts. All rights reserved.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE. */
// https://github.com/ashima/webgl-noise (copyright 2011 Ashima Arts).
const SIMPLEX = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 invSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
 const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
 vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
 vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g;
 vec3 i1=min(g.xyz,l.zxy),i2=max(g.xyz,l.zxy);
 vec3 x1=x0-i1+C.xxx,x2=x0-i2+C.yyy,x3=x0-D.yyy;
 i=mod289(i); vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
 float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
 vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z),y_=floor(j-7.0*x_);
 vec4 x=x_*ns.x+ns.yyyy,y=y_*ns.x+ns.yyyy,h=1.0-abs(x)-abs(y);
 vec4 b0=vec4(x.xy,y.xy),b1=vec4(x.zw,y.zw);
 vec4 s0=floor(b0)*2.0+1.0,s1=floor(b1)*2.0+1.0,sh=-step(h,vec4(0.0));
 vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy,a1=b1.xzyw+s1.xzyw*sh.zzww;
 vec3 p0=vec3(a0.xy,h.x),p1=vec3(a0.zw,h.y),p2=vec3(a1.xy,h.z),p3=vec3(a1.zw,h.w);
 vec4 norm=invSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
 p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
 vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
 m=m*m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const UNIFORMS = `
uniform float uTime,uAssemble,uOpen,uMotion,uOpacity;
uniform vec3 uColorA,uColorB,uColorC;
uniform vec2 uPointer;
uniform float uPointerActive;
attribute float aHemisphere;
${SIMPLEX}
vec3 deform(vec3 p,vec3 n){
 p.x+=aHemisphere*uOpen*0.32;
 float breath=sin(uTime*0.72)*0.009*uMotion;
 float noise=snoise(p*2.8+vec3(uTime*0.12))*0.012*uMotion;
 return p*(1.0+breath)+n*noise;
}
vec3 palette(vec3 p){
 float gradient=clamp(p.y*0.38+p.z*0.16+0.48,0.0,1.0);
 return mix(uColorA,uColorB,gradient);
}`;

const PARTICLE_VERTEX = `
${UNIFORMS}
uniform float uPixelRatio;
attribute vec3 aScatter;
attribute float aSeed,aGroove;
varying vec3 vColor;
varying float vAlpha,vActivation;
void main(){
 vec3 p=mix(aScatter,deform(position,normal),uAssemble);
 vec4 mv=modelViewMatrix*vec4(p,1.0);
 vec4 clip=projectionMatrix*mv;
 vec2 screen=clip.xy/clip.w;
 float local=exp(-dot(screen-uPointer,screen-uPointer)*12.0)*uPointerActive*uMotion;
 // Local activation preserves alignment between nodes and their connections.
 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv;
 vec3 n=(normalMatrix*normal)*inversesqrt(max(dot(normalMatrix*normal,normalMatrix*normal),0.000001));
 float fresnel=pow(clamp(1.0-abs(dot(n,normalize(-mv.xyz))),0.0,1.0),2.0);
 float light=max(0.0,dot(n,normalize(vec3(-0.4,0.7,1.0))));
 float regional=pow(max(0.0,sin(position.z*3.0+position.y*2.0-uTime*0.65)),12.0)*uMotion;
 vActivation=regional+local*0.65;
 vColor=mix(palette(position),uColorC,fresnel*0.5+vActivation*0.26);
 vAlpha=(0.32+light*0.34+fresnel*0.32)*(1.0-aGroove*0.72);
 vAlpha*=(1.0-smoothstep(2.5,6.5,-mv.z))*uAssemble*uOpacity;
 gl_PointSize=clamp((1.3+aSeed*1.4+fresnel*0.45+vActivation*0.65)*uPixelRatio*4.4/max(1.0,-mv.z),1.0,6.0*uPixelRatio);
}`;
const PARTICLE_FRAGMENT = `
varying vec3 vColor; varying float vAlpha,vActivation;
void main(){
 float r=length(gl_PointCoord-0.5)*2.0;if(r>1.0)discard;
 float glow=exp(-r*r*4.5);float core=exp(-r*r*25.0);
 gl_FragColor=vec4(vColor*(0.8+core*0.55+vActivation*0.55),glow*vAlpha);
}`;
const SKIN_VERTEX = `
${UNIFORMS}
attribute float aGroove;
varying vec3 vNormal,vView,vPosition;
varying float vGroove;
void main(){
 vec3 p=deform(position,normal);
 vec4 mv=modelViewMatrix*vec4(p,1.0);
 vNormal=(normalMatrix*normal)*inversesqrt(max(dot(normalMatrix*normal,normalMatrix*normal),0.000001));vView=-mv.xyz;vPosition=position;vGroove=aGroove;
 gl_Position=projectionMatrix*mv;
}`;
const SKIN_FRAGMENT = `
uniform float uAssemble,uOpen,uOpacity;
uniform vec3 uColorA,uColorB,uColorC;
varying vec3 vNormal,vView,vPosition;
varying float vGroove;
void main(){
 vec3 n=vNormal*inversesqrt(max(dot(vNormal,vNormal),0.000001)),view=normalize(vView);
 float diffuse=max(0.0,dot(n,normalize(vec3(-0.7,0.9,1.2))));
 float fresnel=pow(clamp(1.0-abs(dot(n,view)),0.0,1.0),3.0);
 float spec=pow(max(0.0,dot(reflect(-normalize(vec3(-0.7,0.9,1.2)),n),view)),22.0);
 vec3 color=mix(uColorA,uColorB,clamp(vPosition.y*0.3+0.5,0.0,1.0));
 color*=0.028+diffuse*0.09+fresnel*0.13+spec*0.045;
 color*=1.0-vGroove*0.8;
 float alpha=smoothstep(0.5,1.0,uAssemble)*(1.0-uOpen*0.82)*uOpacity;
 if(alpha<0.001)discard;
 gl_FragColor=vec4(color,alpha);
}`;
const LINE_VERTEX = `
${UNIFORMS}
attribute vec3 aScatter;
attribute float aProgress,aPhase;
varying float vProgress,vPhase,vDepth;
varying vec3 vColor;
void main(){
 vec3 p=mix(aScatter,deform(position,normal),uAssemble);
 vec4 mv=modelViewMatrix*vec4(p,1.0);
 gl_Position=projectionMatrix*mv;vProgress=aProgress;vPhase=aPhase;vDepth=(1.0-smoothstep(2.5,6.5,-mv.z));
 vColor=palette(position);
}`;
const LINE_FRAGMENT = `
uniform float uTime,uSpeed,uOpen,uAssemble,uMotion,uOpacity;
uniform vec3 uColorC;
varying float vProgress,vPhase,vDepth;varying vec3 vColor;
void main(){
 float cycle=fract(uTime*uSpeed*(0.7+vPhase*0.6)+vPhase*9.0);
 float head=cycle*2.0-0.3;
 float distance=head-vProgress;
 float pulse=exp(-distance*distance*240.0);
 float trail=exp(-max(distance,0.0)*10.0)*step(0.0,distance)*step(distance,0.38);
 float firingGate=smoothstep(0.5,0.85,sin(vPhase*123.0+floor(uTime*0.15+vPhase)));
 float firing=(pulse+trail*0.3)*firingGate*uMotion;
 float alpha=(0.045+uOpen*0.11+firing*0.7)*vDepth*smoothstep(0.65,1.0,uAssemble)*uOpacity;
 gl_FragColor=vec4(mix(vColor,uColorC,clamp(firing,0.0,1.0))*(0.6+firing*1.7),alpha);
}`;

const FINISH_SHADER = {
  uniforms: { tDiffuse: { value: null }, uResolution: { value: new THREE.Vector2(1, 1) } },
  vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  fragmentShader: `
   uniform sampler2D tDiffuse;uniform vec2 uResolution;varying vec2 vUv;
   void main(){
    vec2 p=vUv-0.5;vec2 offset=p*dot(p,p)*1.1/uResolution;
    vec4 color=texture2D(tDiffuse,vUv);
    color.r=texture2D(tDiffuse,vUv+offset).r;color.b=texture2D(tDiffuse,vUv-offset).b;
    float vignette=1.0-smoothstep(0.22,0.7,length(p))*0.52;
    gl_FragColor=vec4(color.rgb*vignette,color.a);
   }`,
};

type Motion = {
  assemble: number;
  yaw: number;
  pitch: number;
  cameraZ: number;
  open: number;
  opacity: number;
};

function NeuralBrain({
  mobile,
  reduced,
  active,
  onContextLost,
}: {
  mobile: boolean;
  reduced: boolean;
  active: boolean;
  onContextLost: (lost: boolean) => void;
}) {
  const { gl, scene, camera, size, invalidate } = useThree();
  useEffect(() => {
    const lost = () => onContextLost(true);
    gl.domElement.addEventListener("webglcontextlost", lost);
    // R3F intentionally releases its context during a breakpoint remount.
    // Remove this listener first so that teardown cannot trigger the fallback.
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onContextLost]);
  const group = useRef<THREE.Group>(null);
  const time = useRef(0);
  const idleAngle = useRef(0);
  const pointer = useRef(new THREE.Vector2());
  const targetPointer = useRef(new THREE.Vector2());
  const pointerActive = useRef(0);
  const stage = useRef<HTMLElement | null>(null);
  const lastOpacity = useRef(-1);
  const intro = useRef<gsap.core.Tween | null>(null);
  const motion = useRef<Motion>({
    assemble: reduced ? 1 : 0,
    yaw: 0.32,
    pitch: 0.32,
    cameraZ: mobile ? 4.7 : 4.4,
    open: 0,
    opacity: 1,
  });
  const buffers = useMemo(() => buildBrain(mobile), [mobile]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAssemble: { value: reduced ? 1 : 0 },
      uOpen: { value: 0 },
      uMotion: { value: reduced ? 0 : 1 },
      uOpacity: { value: 1 },
      uColorA: { value: new THREE.Color(BRAIN_SETTINGS.colors[0]) },
      uColorB: { value: new THREE.Color(BRAIN_SETTINGS.colors[1]) },
      uColorC: { value: new THREE.Color(BRAIN_SETTINGS.colors[2]) },
      uPointer: { value: new THREE.Vector2() },
      uPointerActive: { value: 0 },
      uPixelRatio: { value: gl.getPixelRatio() },
      uSpeed: { value: BRAIN_SETTINGS.pulseSpeed },
    }),
    [gl, reduced],
  );
  const materials = useMemo(
    () => ({
      skin: new THREE.ShaderMaterial({
        uniforms,
        vertexShader: SKIN_VERTEX,
        fragmentShader: SKIN_FRAGMENT,
        transparent: true,
        depthWrite: true,
        side: THREE.DoubleSide,
      }),
      particles: new THREE.ShaderMaterial({
        uniforms,
        vertexShader: PARTICLE_VERTEX,
        fragmentShader: PARTICLE_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      lines: new THREE.ShaderMaterial({
        uniforms,
        vertexShader: LINE_VERTEX,
        fragmentShader: LINE_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    }),
    [uniforms],
  );
  const pipeline = useMemo(() => {
    const composer = new EffectComposer(gl);
    const render = new RenderPass(scene, camera);
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      BRAIN_SETTINGS.bloomStrength,
      0.45,
      BRAIN_SETTINGS.bloomThreshold,
    );
    const finish = new ShaderPass(FINISH_SHADER);
    const output = new OutputPass();
    composer.addPass(render);
    composer.addPass(bloom);
    composer.addPass(finish);
    composer.addPass(output);
    return { composer, bloom, finish, render, output };
  }, [gl, scene, camera]);

  useEffect(() => {
    stage.current = gl.domElement.closest("[data-brain-scene]");
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      mobile ? BRAIN_SETTINGS.mobilePixelRatioCap : BRAIN_SETTINGS.pixelRatioCap,
    );
    gl.setPixelRatio(dpr);
    pipeline.composer.setPixelRatio(dpr);
    pipeline.composer.setSize(size.width, size.height);
    pipeline.finish.uniforms.uResolution.value.set(size.width * dpr, size.height * dpr);
    uniforms.uPixelRatio.value = dpr;
    invalidate();
  }, [size.width, size.height, mobile, gl, pipeline, uniforms, invalidate]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const state = motion.current;
      if (reduced) {
        Object.assign(state, {
          assemble: 1,
          yaw: 0.32,
          pitch: 0.32,
          cameraZ: mobile ? 4.7 : 4.4,
          open: 0,
          opacity: 1,
        });
        invalidate();
        return;
      }
      intro.current = gsap.fromTo(
        state,
        { assemble: 0 },
        { assemble: 1, duration: BRAIN_SETTINGS.introSeconds, ease: "power3.out" },
      );
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#brain-hero",
          start: "top top",
          end: mobile ? "bottom top" : `+=${BRAIN_SETTINGS.scrollDistance}`,
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });
      timeline
        .to(
          state,
          {
            yaw: 0.18,
            pitch: 0.4,
            cameraZ: mobile ? 4.25 : 3.8,
            duration: 0.2,
            ease: "power2.inOut",
          },
          0,
        )
        .to(
          state,
          {
            open: 0.85,
            yaw: -0.35,
            cameraZ: mobile ? 4.65 : 4.15,
            duration: 0.65,
            ease: "power2.inOut",
          },
          0.2,
        );
      if (!mobile) timeline.to(state, { opacity: 0, duration: 0.25, ease: "power2.inOut" }, 0.75);
    });
    return () => {
      context.revert();
      intro.current = null;
    };
  }, [mobile, reduced, invalidate]);

  useEffect(() => {
    if (active) intro.current?.resume();
    else intro.current?.pause();
    if (active) invalidate();
  }, [active, reduced, invalidate]);

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch" || reduced) return;
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetPointer.current.set(clamp(x, -1, 1), clamp(y, -1, 1));
      pointerActive.current = Math.abs(x) <= 1 && Math.abs(y) <= 1 ? 1 : 0;
    };
    const reset = () => {
      targetPointer.current.set(0, 0);
      pointerActive.current = 0;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("blur", reset);
      document.removeEventListener("pointerleave", reset);
    };
  }, [gl, reduced]);

  useEffect(
    () => () => {
      for (const geometry of Object.values(buffers)) geometry.dispose();
    },
    [buffers],
  );
  useEffect(
    () => () => {
      for (const material of Object.values(materials)) material.dispose();
    },
    [materials],
  );
  useEffect(
    () => () => {
      pipeline.bloom.dispose();
      pipeline.finish.dispose();
      pipeline.output.dispose();
      pipeline.render.dispose();
      pipeline.composer.dispose();
    },
    [pipeline],
  );

  // Positive priority takes ownership of rendering: one composer frame, never
  // a second R3F render. No vectors, geometries or materials allocated per frame.
  useFrame((_, delta) => {
    if (!active) return;
    const dt = Math.min(delta, 0.05);
    if (!reduced) time.current += dt;
    const t = time.current;
    const state = motion.current;
    const ease = 1 - Math.exp(-dt * 5);
    pointer.current.lerp(targetPointer.current, ease);
    uniforms.uTime.value = t;
    uniforms.uAssemble.value = state.assemble;
    uniforms.uOpen.value = state.open;
    uniforms.uOpacity.value = 1;
    if (stage.current && Math.abs(lastOpacity.current - state.opacity) > 0.001) {
      stage.current.style.opacity = String(state.opacity);
      lastOpacity.current = state.opacity;
    }
    uniforms.uMotion.value = reduced ? 0 : 1;
    uniforms.uPointer.value.copy(pointer.current);
    uniforms.uPointerActive.value += (pointerActive.current - uniforms.uPointerActive.value) * ease;
    if (!reduced && state.open < 0.01) {
      idleAngle.current += dt * 0.018 * (1 - uniforms.uPointerActive.value);
    }
    if (group.current) {
      group.current.rotation.set(
        state.pitch + (reduced ? 0 : pointer.current.y * 0.08 + Math.sin(t * 0.17) * 0.035),
        state.yaw + (reduced ? 0 : pointer.current.x * 0.12 + idleAngle.current),
        -0.08,
      );
      group.current.position.y = 0.06 + (reduced ? 0 : Math.sin(t * 0.4) * 0.025);
    }
    camera.position.z = state.cameraZ;
    camera.position.x = reduced ? 0 : pointer.current.x * 0.045;
    camera.lookAt(0, 0, 0);
    materials.skin.depthWrite = state.open < 0.2;
    pipeline.composer.render(dt);
  }, 1);

  return (
    <group ref={group} dispose={null}>
      <mesh geometry={buffers.skin} material={materials.skin} frustumCulled={false} />
      <points geometry={buffers.particles} material={materials.particles} frustumCulled={false} />
      <lineSegments geometry={buffers.lines} material={materials.lines} frustumCulled={false} />
    </group>
  );
}

class BrainBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error("[Brain] WebGL unavailable:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** A quiet, brand-matched fallback for unavailable/lost WebGL contexts. */
function BrainFallback() {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full opacity-60" fill="none" aria-hidden>
      <g stroke="#a897ff" strokeWidth="1.4">
        <path d="M144 57C109 38 61 58 48 93C18 130 43 189 83 202C103 226 127 215 143 207M156 57C191 38 239 58 252 93C282 130 257 189 217 202C197 226 173 215 157 207M149 63V204M151 213L165 249L181 246L172 209" />
        <path d="M126 67C86 59 66 79 75 99C104 117 119 92 121 82M69 111C48 132 67 157 87 146C107 137 92 120 113 113M56 164C77 159 90 168 83 186M124 132C101 149 106 176 128 184M174 67C214 59 234 79 225 99C196 117 181 92 179 82M231 111C252 132 233 157 213 146C193 137 208 120 187 113M244 164C223 159 210 168 217 186M176 132C199 149 194 176 172 184" />
      </g>
    </svg>
  );
}

export default function BrainCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(() => window.innerWidth < 1024);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [active, setActive] = useState(!document.hidden);
  const [lost, setLost] = useState(false);
  useEffect(() => {
    const small = window.matchMedia("(max-width: 1023px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const resize = () => setMobile(small.matches);
    const motion = () => setReduced(reduce.matches);
    small.addEventListener("change", resize);
    reduce.addEventListener("change", motion);
    let inView = true;
    const sync = () =>
      setActive(
        inView &&
          !document.hidden &&
          (small.matches || window.scrollY < BRAIN_SETTINGS.scrollDistance + window.innerHeight),
      );
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "100px" },
    );
    if (ref.current) observer.observe(ref.current);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("scroll", sync, { passive: true });
    return () => {
      small.removeEventListener("change", resize);
      reduce.removeEventListener("change", motion);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("scroll", sync);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      data-brain-scene
      className="brain-stage pointer-events-none relative h-[350px] w-full sm:h-[450px] lg:fixed lg:right-[2vw] lg:top-[120px] lg:z-0 lg:h-[min(74vh,720px)] lg:w-[49vw]"
    >
      <div className="brain-stage-halo absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          maskImage: "radial-gradient(ellipse at center,black 40%,transparent 74%)",
          WebkitMaskImage: "radial-gradient(ellipse at center,black 40%,transparent 74%)",
        }}
      >
        <BrainBoundary fallback={<BrainFallback />}>
          {lost ? (
            <BrainFallback />
          ) : (
            <Canvas
              key={mobile ? "mobile" : "desktop"}
              frameloop={!active ? "never" : reduced ? "demand" : "always"}
              camera={{ position: [0, 0, mobile ? 4.7 : 4.4], fov: 38, near: 0.1, far: 30 }}
              dpr={[1, mobile ? BRAIN_SETTINGS.mobilePixelRatioCap : BRAIN_SETTINGS.pixelRatioCap]}
              gl={{ alpha: false, antialias: false, powerPreference: "high-performance" }}
              fallback={<BrainFallback />}
              onCreated={({ gl, scene }) => {
                gl.setClearColor("#0d0b18", 1);
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.1;
                scene.background = new THREE.Color("#0d0b18");
              }}
            >
              <NeuralBrain
                mobile={mobile}
                reduced={reduced}
                active={active}
                onContextLost={setLost}
              />
            </Canvas>
          )}
        </BrainBoundary>
      </div>
    </div>
  );
}
