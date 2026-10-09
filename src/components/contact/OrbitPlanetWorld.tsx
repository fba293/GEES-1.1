/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - 3D Orbit Globe & Courier Hero (Three.js WebGL Engine)
 * Features:
 * - Hosted whimsical world 3D globe GLB + Courier 3D character GLB with DRACO decompression
 * - Full character kinematics: run-cycle blending, idle breathing, bag inertia suspension, greeting wave
 * - Interactive pointer drag rotation with inertia and touch/mouse controls
 * - Theme adaptive lighting & responsive orthographic projection
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const ASSET_BASE = 'https://cdn.jsdelivr.net/gh/fadeichev2121/planet@b3f70fbf4b577845b1d9d5947c9410fb4d925dae/';
const DRACO_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';
const GAIT_DISTANCE = 0.44;
const MODEL_SCALE = 0.76 / 1.7;

// --- Physics & Kinematics Helpers ---
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const damp = (value: number, target: number, lambda: number, dt: number) =>
  value + (target - value) * (1 - Math.exp(-lambda * dt));
const smoothstep = (value: number, min: number, max: number) => {
  const t = clamp((value - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
};

interface MotionState {
  planetAngle: number;
  planetVelocity: number;
  dragTarget: number;
  characterTarget: number;
  characterAngle: number;
  characterVelocity: number;
  phase: number;
  activity: number;
  direction: number;
  time: number;
  dragging: boolean;
  lastInteraction: number;
  pitchAngle: number;
  pitchVelocity: number;
  pitchTarget: number;
  heading?: number;
  cameraHeading?: number;
}

const createMotion = (): MotionState => ({
  planetAngle: 0,
  planetVelocity: 0,
  dragTarget: 0,
  characterTarget: 0,
  characterAngle: 0,
  characterVelocity: 0,
  phase: 0,
  activity: 0,
  direction: 1,
  time: 0,
  dragging: false,
  lastInteraction: 0,
  pitchAngle: 0,
  pitchVelocity: 0,
  pitchTarget: 0,
});

function stepPlanet(m: MotionState, dt: number, auto: boolean, reduced: boolean, autoRoll = -0.032) {
  m.time += dt;
  if (!auto) {
    m.dragging = false;
    m.planetVelocity = m.pitchVelocity = 0;
    m.dragTarget = m.planetAngle;
    m.pitchTarget = m.pitchAngle;
    return;
  }
  if (m.dragging) {
    const acceleration = 90 * (m.dragTarget - m.planetAngle) - 18 * m.planetVelocity;
    m.planetVelocity += acceleration * dt;
  } else {
    const desired = auto && !reduced && m.time - m.lastInteraction > 3.5 ? autoRoll : 0;
    m.planetVelocity = damp(m.planetVelocity, desired, reduced ? 12 : 5, dt);
  }
  m.planetVelocity = clamp(m.planetVelocity, -1.15, 1.15);
  m.planetAngle += m.planetVelocity * dt;
}

function createGlobeMotion() {
  return {
    delta: new THREE.Quaternion(),
    orientation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0.5, 0)),
    angular: new THREE.Vector3(),
    route: 0,
  };
}

function stepGlobeMotion(
  globe: ReturnType<typeof createGlobeMotion>,
  m: MotionState,
  dt: number,
  auto: boolean,
  reduced: boolean
) {
  const roaming = auto && !reduced && !m.dragging && m.time - m.lastInteraction > 3.5;
  if (roaming) globe.route += 0.24 * dt;
  stepPlanet(m, dt, auto, reduced, -0.24 * Math.cos(globe.route));
  if (!auto) {
    globe.angular.set(0, 0, 0);
    return;
  }
  if (m.dragging) m.pitchVelocity += (70 * (m.pitchTarget - m.pitchAngle) - 17 * m.pitchVelocity) * dt;
  else m.pitchVelocity = THREE.MathUtils.damp(m.pitchVelocity, roaming ? 0.24 * Math.sin(globe.route) : 0, 6, dt);
  m.pitchVelocity = THREE.MathUtils.clamp(m.pitchVelocity, -0.55, 0.55);
  m.pitchAngle += m.pitchVelocity * dt;
  globe.angular.set(m.pitchVelocity, m.planetVelocity * 0.45, -m.planetVelocity);
  const speed = globe.angular.length();
  if (speed > 1e-8) {
    globe.delta.setFromAxisAngle(globe.angular.multiplyScalar(1 / speed), speed * dt);
    globe.orientation.premultiply(globe.delta).normalize();
  }
}

function createSurfaceMotion() {
  return {
    current: new THREE.Vector3(0, 1, 0),
    target: new THREE.Vector3(0, 1, 0),
    velocity: new THREE.Vector3(),
    error: new THREE.Vector3(),
    worldNormal: new THREE.Vector3(),
    worldVelocity: new THREE.Vector3(),
    inverse: new THREE.Quaternion(),
    initialized: false,
  };
}

function stepSurface(
  s: ReturnType<typeof createSurfaceMotion>,
  m: MotionState,
  rotation: THREE.Quaternion,
  screenUp: THREE.Vector3,
  dt: number,
  reduced: boolean,
  paused = false
) {
  s.inverse.copy(rotation).invert();
  s.target.copy(screenUp).applyQuaternion(s.inverse).normalize();
  if (!s.initialized) {
    s.current.copy(s.target);
    s.initialized = true;
  }
  if (paused) {
    s.velocity.set(0, 0, 0);
    s.worldVelocity.set(0, 0, 0);
    s.worldNormal.copy(s.current).applyQuaternion(rotation);
    m.characterVelocity = 0;
    m.activity = THREE.MathUtils.damp(m.activity, 0, 10, dt);
    return;
  }
  const cosine = THREE.MathUtils.clamp(s.current.dot(s.target), -1, 1);
  const angle = Math.acos(cosine);
  s.error.copy(s.target).addScaledVector(s.current, -cosine);
  if (s.error.lengthSq() > 1e-12) s.error.normalize().multiplyScalar(angle);
  const stiffness = reduced ? 110 : 48;
  const dampingRatio = reduced ? 21 : 11;
  s.velocity.addScaledVector(s.error, stiffness * dt).multiplyScalar(Math.exp(-dampingRatio * dt));
  s.velocity.addScaledVector(s.current, -s.velocity.dot(s.current));
  s.current.addScaledVector(s.velocity, dt).normalize();
  s.velocity.addScaledVector(s.current, -s.velocity.dot(s.current));
  s.worldNormal.copy(s.current).applyQuaternion(rotation);
  s.worldVelocity.copy(s.velocity).applyQuaternion(rotation);
  const speed = s.velocity.length();
  m.characterTarget = Math.atan2(s.target.x, s.target.y);
  m.characterAngle = Math.atan2(s.current.x, s.current.y);
  if (Math.abs(s.worldVelocity.x) > 0.012) m.direction = Math.sign(s.worldVelocity.x);
  m.characterVelocity = speed * m.direction;
  m.activity = THREE.MathUtils.damp(m.activity, smoothstep(speed, 4e-3, 0.022), 9, dt);
  m.phase += (speed * 2.25 / GAIT_DISTANCE) * Math.PI * 2 * dt;
}

// --- Animation Processors ---
function makeSeamlessRun(source: THREE.AnimationClip): THREE.AnimationClip {
  const reference = source.tracks.reduce((best, track) =>
    track.times.length > best.times.length ? track : best
  );
  const start = reference.times[0];
  const last = reference.times[reference.times.length - 1];
  const intervals = Array.from(reference.times)
    .slice(1)
    .map((time, i) => time - reference.times[i])
    .sort((a, b) => a - b);
  const step = intervals.length ? intervals[Math.floor(intervals.length / 2)] : 1 / 24;
  const period = Math.max(step, last - start + step);
  const frames = Math.max(40, Math.ceil(period * 120));
  const quaternion = new THREE.Quaternion();

  const tracks = source.tracks.map((track) => {
    const count = track.times.length;
    const size = track.getValueSize();
    const knots = Array.from(track.times, (time) => time - start);
    const samples = Array.from(track.values);
    const isRotation = track.name.endsWith('.quaternion');
    const isMorph = track.name.endsWith('.morphTargetInfluences');

    if (isRotation) {
      for (let i = 1; i < count; i++) {
        let dot = 0;
        for (let c = 0; c < 4; c++) dot += samples[(i - 1) * 4 + c] * samples[i * 4 + c];
        if (dot < 0) {
          for (let c = 0; c < 4; c++) samples[i * 4 + c] *= -1;
        }
      }
    }

    const times: number[] = [];
    const values: number[] = [];

    for (let frame = 0; frame <= frames; frame++) {
      const time = frame === frames ? 0 : (frame / frames) * period;
      times.push((frame / frames) * period);
      let index = 0;
      while (index < count - 1 && knots[index + 1] <= time) index++;
      const previous = (index - 1 + count) % count;
      const next = (index + 1) % count;
      const after = (index + 2) % count;
      const t1 = knots[index];
      const t2 = next === 0 ? period + knots[0] : knots[next];
      const t0 = previous > index ? knots[previous] - period : knots[previous];
      const t3 = after <= next ? knots[after] + period : knots[after];
      const afterTime = t3 <= t2 ? t3 + period : t3;
      const length = Math.max(t2 - t1, 1e-6);
      const u = Math.max(0, Math.min(1, (time - t1) / length));

      for (let c = 0; c < size; c++) {
        const p0 = samples[previous * size + c];
        const p1 = samples[index * size + c];
        const p2 = samples[next * size + c];
        const p3 = samples[after * size + c];
        const a = count < 3 ? 0 : ((p2 - p0) / Math.max(t2 - t0, 1e-6)) * length;
        const b = count < 3 ? 0 : ((p3 - p1) / Math.max(afterTime - t1, 1e-6)) * length;
        values.push(
          count === 1
            ? p1
            : isMorph
            ? p1 + (p2 - p1) * u
            : (2 * u ** 3 - 3 * u ** 2 + 1) * p1 +
              (u ** 3 - 2 * u ** 2 + u) * a +
              (-2 * u ** 3 + 3 * u ** 2) * p2 +
              (u ** 3 - u ** 2) * b
        );
      }

      if (isRotation) {
        quaternion.fromArray(values, values.length - 4).normalize();
        quaternion.toArray(values, values.length - 4);
      }
    }

    const result = track.clone();
    result.times = new Float32Array(times);
    result.values = new Float32Array(values);
    return result;
  });

  return new THREE.AnimationClip('Courier_Run_Seamless', period, tracks);
}

function makeIdle(scene: THREE.Group): THREE.AnimationClip {
  const tracks: THREE.KeyframeTrack[] = [];
  const breath = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 9e-3);
  scene.traverse((node) => {
    if (node instanceof THREE.Mesh && node.morphTargetInfluences?.length) {
      const zeros = new Array(node.morphTargetInfluences.length).fill(0);
      tracks.push(
        new THREE.NumberKeyframeTrack(`${node.name}.morphTargetInfluences`, [0, 3], [...zeros, ...zeros])
      );
    }
    if (!(node instanceof THREE.Bone)) return;
    const q = node.quaternion.clone();
    const middle = q.clone();
    if (node.name === 'Spine02' || node.name === 'neck') middle.multiply(breath);
    tracks.push(
      new THREE.QuaternionKeyframeTrack(
        `${node.name}.quaternion`,
        [0, 1.5, 3],
        [...q.toArray(), ...middle.toArray(), ...q.toArray()]
      )
    );
    const p = node.position.clone();
    const inhale = p.clone();
    if (node.name === 'Hips') inhale.y += 4e-3;
    tracks.push(
      new THREE.VectorKeyframeTrack(
        `${node.name}.position`,
        [0, 1.5, 3],
        [...p.toArray(), ...inhale.toArray(), ...p.toArray()]
      )
    );
    tracks.push(
      new THREE.VectorKeyframeTrack(
        `${node.name}.scale`,
        [0, 3],
        [...node.scale.toArray(), ...node.scale.toArray()]
      )
    );
  });
  return new THREE.AnimationClip('Courier_Idle', 3, tracks);
}

class BagSuspension {
  bone: THREE.Bone;
  restOrientation = new THREE.Quaternion();
  animatedOrientation = new THREE.Quaternion();
  animatedPosition = new THREE.Vector3();
  localAnchor = new THREE.Vector3();
  gravityTilt = new THREE.Quaternion();
  pelvisYaw = new THREE.Quaternion();
  inverseRest = new THREE.Quaternion();
  xAxis = new THREE.Vector3(1, 0, 0);
  hangingOrientation = new THREE.Quaternion();
  sceneOrientation = new THREE.Quaternion();
  parentOrientation = new THREE.Quaternion();
  swing = new THREE.Quaternion();
  angles = new THREE.Euler();
  inverseScene = new THREE.Matrix4();
  anchor = new THREE.Vector3();
  previousAnchor = new THREE.Vector3();
  velocity = new THREE.Vector3();
  previousVelocity = new THREE.Vector3();
  acceleration = new THREE.Vector3();
  initialized = false;
  applied = false;
  pitch = 0;
  roll = 8e-3;
  pitchVelocity = 0;
  rollVelocity = 0;

  constructor(public scene: THREE.Group) {
    const b = scene.getObjectByName('CourierBag');
    if (!(b instanceof THREE.Bone)) {
      // create safe fallback dummy bone if not found
      this.bone = new THREE.Bone();
      return;
    }
    this.bone = b;
    scene.updateWorldMatrix(true, true);
    scene.getWorldQuaternion(this.sceneOrientation);
    this.bone.getWorldQuaternion(this.restOrientation);
    this.restOrientation.premultiply(this.sceneOrientation.invert());
    this.inverseRest.copy(this.restOrientation).invert();
  }

  restore() {
    if (!this.applied) return;
    this.bone.position.copy(this.animatedPosition);
    this.bone.quaternion.copy(this.animatedOrientation);
    this.applied = false;
  }

  update(dt: number, activity: number, _phase: number, turnRate: number, reduced: boolean, bodyLean = 0) {
    if (dt <= 0 || !this.bone.parent) return;
    this.animatedPosition.copy(this.bone.position);
    this.animatedOrientation.copy(this.bone.quaternion);
    this.inverseScene.copy(this.scene.matrixWorld).invert();
    this.bone.getWorldPosition(this.anchor).applyMatrix4(this.inverseScene);
    if (!this.initialized) {
      this.previousAnchor.copy(this.anchor);
      this.initialized = true;
    }
    this.velocity.copy(this.anchor).sub(this.previousAnchor).divideScalar(dt);
    this.acceleration.copy(this.velocity).sub(this.previousVelocity).divideScalar(dt);
    this.previousVelocity.lerp(this.velocity, 1 - Math.exp(-14 * dt));
    this.previousAnchor.copy(this.anchor);
    const gravity = Math.max(4, 9.81 + this.acceleration.y);
    const targetPitch = reduced ? 0 : clamp(Math.atan2(this.acceleration.z, gravity), -0.1, 0.1);
    const targetRoll = reduced
      ? 0
      : clamp(Math.atan2(-this.acceleration.x, gravity) + Math.abs(turnRate) * 1e-3, -0.012, 0.045);
    const steps = Math.ceil(dt / (1 / 120));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      this.pitchVelocity += ((targetPitch - this.pitch) * 72 - this.pitchVelocity * 11) * h;
      this.rollVelocity += ((targetRoll - this.roll) * 64 - this.rollVelocity * 10) * h;
      this.pitch = clamp(this.pitch + this.pitchVelocity * h, -0.12, 0.12);
      this.roll = clamp(this.roll + this.rollVelocity * h, -0.012, 0.05);
    }
    this.scene.getWorldQuaternion(this.sceneOrientation);
    this.bone.getWorldQuaternion(this.pelvisYaw)
      .premultiply(this.parentOrientation.copy(this.sceneOrientation).invert())
      .multiply(this.inverseRest);
    this.pelvisYaw.set(0, this.pelvisYaw.y, 0, this.pelvisYaw.w).normalize();
    this.bone.parent.getWorldQuaternion(this.parentOrientation).invert();
    this.swing.setFromEuler(this.angles.set(this.pitch, 0, this.roll));
    this.gravityTilt.setFromAxisAngle(this.xAxis, -bodyLean);
    this.hangingOrientation.copy(this.parentOrientation)
      .multiply(this.sceneOrientation)
      .multiply(this.gravityTilt)
      .multiply(this.pelvisYaw)
      .multiply(this.swing)
      .multiply(this.restOrientation);
    this.bone.quaternion.copy(this.animatedOrientation).slerp(this.hangingOrientation, 1 - activity * 0.3);
    this.localAnchor.copy(this.anchor).addScaledVector(this.xAxis, -9e-3 * (1 - activity * 0.5));
    this.localAnchor.y -= 0.027;
    this.localAnchor.applyMatrix4(this.scene.matrixWorld);
    this.bone.parent.worldToLocal(this.localAnchor);
    this.bone.position.copy(this.localAnchor);
    this.bone.updateWorldMatrix(false, true);
    this.applied = true;
  }
}

class CourierGreeting {
  joints: Array<{
    bone: THREE.Bone;
    rest: THREE.Quaternion;
    direction: THREE.Vector3;
    palm: THREE.Vector3;
    animated: THREE.Quaternion;
  }> = [];
  sceneRotation = new THREE.Quaternion();
  inverseParent = new THREE.Quaternion();
  aim = new THREE.Quaternion();
  twist = new THREE.Quaternion();
  target = new THREE.Quaternion();
  direction = new THREE.Vector3();
  palm = new THREE.Vector3();
  wantedPalm = new THREE.Vector3();
  cross = new THREE.Vector3();
  restBendNormal = new THREE.Vector3();
  bendNormal = new THREE.Vector3();
  upperDirection = new THREE.Vector3(-0.55, -0.65, 0.52).normalize();
  forearmDirection = new THREE.Vector3();
  phase = 0;
  applied = false;
  weight = 0;

  constructor(public scene: THREE.Group) {
    const up = new THREE.Vector3(0, 1, 0);
    scene.updateWorldMatrix(true, true);
    const inverseScene = scene.getWorldQuaternion(new THREE.Quaternion()).invert();
    const names = ['RightArm', 'RightForeArm', 'RightHand'];
    this.joints = names
      .map((name) => {
        const bone = scene.getObjectByName(name);
        if (!(bone instanceof THREE.Bone)) return null;
        const rest = bone.getWorldQuaternion(new THREE.Quaternion()).premultiply(inverseScene);
        const dir = up.clone().applyQuaternion(rest).normalize();
        const plm = new THREE.Vector3(1, 0, 0).addScaledVector(dir, -dir.x).normalize();
        return { bone, rest, direction: dir, palm: plm, animated: bone.quaternion.clone() };
      })
      .filter(Boolean) as any;

    if (this.joints.length >= 2) {
      this.restBendNormal.crossVectors(this.joints[0].direction, this.joints[1].direction).normalize();
    }
  }

  restore() {
    if (!this.applied) return;
    for (const joint of this.joints) joint.bone.quaternion.copy(joint.animated);
    this.applied = false;
  }

  step(dt: number, ready: boolean, reduced: boolean) {
    this.weight = THREE.MathUtils.damp(this.weight, ready ? 1 : 0, ready ? 4 : 9, dt);
    if (this.weight < 1e-4) {
      this.weight = 0;
      this.phase = 0;
    }
    if (ready && this.weight > 0.85 && !reduced) this.phase += dt * Math.PI * 2 * 0.9;
  }

  apply(reduced: boolean) {
    if (this.weight === 0 || this.joints.length < 2) return;
    this.scene.getWorldQuaternion(this.sceneRotation);
    const wave = Math.sin(this.phase) * (reduced ? 0 : 0.12) * smoothstep(this.weight, 0.85, 0.99);
    this.forearmDirection.set(-0.08 + wave * 0.35, 0.94, 0.33).normalize();
    this.bendNormal.crossVectors(this.upperDirection, this.forearmDirection).normalize();
    this.joints.forEach((joint, index) => {
      joint.animated.copy(joint.bone.quaternion);
      if (index === 0) this.direction.copy(this.upperDirection);
      else if (index === 1) this.direction.copy(this.forearmDirection);
      else this.direction.set(-0.06 + wave, 0.97, 0.22);
      this.direction.normalize();
      this.aim.setFromUnitVectors(joint.direction, this.direction);
      this.target.copy(this.aim).multiply(joint.rest);
      this.palm
        .copy(this.restBendNormal)
        .addScaledVector(joint.direction, -this.restBendNormal.dot(joint.direction))
        .normalize()
        .applyQuaternion(this.aim);
      this.wantedPalm.copy(this.bendNormal).addScaledVector(this.direction, -this.bendNormal.dot(this.direction)).normalize();
      const angle = Math.atan2(
        this.direction.dot(this.cross.crossVectors(this.palm, this.wantedPalm)),
        this.palm.dot(this.wantedPalm)
      );
      this.twist.setFromAxisAngle(this.direction, angle);
      this.target.premultiply(this.twist);
      if (joint.bone.parent) {
        joint.bone.parent.getWorldQuaternion(this.inverseParent).invert();
        this.target.premultiply(this.sceneRotation).premultiply(this.inverseParent);
      }
      joint.bone.quaternion.slerp(this.target, this.weight);
      joint.bone.updateWorldMatrix(false, true);
    });
    this.applied = true;
  }
}

function optimizeRigidBag(scene: THREE.Group) {
  scene.updateWorldMatrix(true, true);
  const candidates: THREE.SkinnedMesh[] = [];
  scene.traverse((node) => {
    if (node instanceof THREE.SkinnedMesh && node.name.startsWith('Delivery_Bag')) {
      candidates.push(node);
    }
  });
  for (const mesh of candidates) {
    if (mesh.geometry.morphAttributes && Object.keys(mesh.geometry.morphAttributes).length) continue;
    const weights = mesh.geometry.getAttribute('skinWeight');
    const indices = mesh.geometry.getAttribute('skinIndex');
    if (!weights || !indices) continue;
    let joint = -1;
    let rigid = true;
    for (let vertex = 0; vertex < weights.count && rigid; vertex++) {
      let total = 0;
      for (let channel = 0; channel < 4; channel++) {
        const weight = weights.getComponent(vertex, channel);
        if (weight < 1e-6) continue;
        const index = indices.getComponent(vertex, channel);
        if (joint < 0) joint = index;
        if (index !== joint) {
          rigid = false;
          break;
        }
        total += weight;
      }
      if (Math.abs(total - 1) > 1e-4) rigid = false;
    }
    if (!rigid || joint < 0 || !mesh.skeleton.bones[joint]) continue;
    const bone = mesh.skeleton.bones[joint];
    const bind = new THREE.Matrix4().multiplyMatrices(mesh.skeleton.boneInverses[joint], mesh.bindMatrix);
    const geometry = mesh.geometry.clone().applyMatrix4(bind);
    geometry.deleteAttribute('skinIndex');
    geometry.deleteAttribute('skinWeight');
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    const bag = new THREE.Mesh(geometry, mesh.material);
    bag.name = mesh.name;
    bag.castShadow = mesh.castShadow;
    bag.receiveShadow = mesh.receiveShadow;
    bag.renderOrder = mesh.renderOrder;
    bag.matrixAutoUpdate = false;
    mesh.removeFromParent();
    bone.add(bag);
  }
}

interface OrbitPlanetWorldProps {
  onMeetCourier?: () => void;
  className?: string;
}

export const OrbitPlanetWorld: React.FC<OrbitPlanetWorldProps> = ({
  onMeetCourier,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isAuto, setIsAuto] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const motionRef = useRef(createMotion());
  const dragRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const isAutoRef = useRef(isAuto);
  isAutoRef.current = isAuto;

  const toggleMotion = () => {
    setIsAuto((prev) => {
      const next = !prev;
      const m = motionRef.current;
      m.dragging = false;
      m.planetVelocity = m.pitchVelocity = 0;
      m.dragTarget = m.planetAngle;
      m.pitchTarget = m.pitchAngle;
      if (next) m.lastInteraction = m.time - 4;
      return next;
    });
  };

  const nudge = (direction: number) => {
    if (!isAutoRef.current) return;
    motionRef.current.planetVelocity += direction * 0.65;
    motionRef.current.lastInteraction = motionRef.current.time;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let disposed = false;
    let animationFrameId = 0;

    // 1. Scene & Renderer Setup
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 550;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const scene = new THREE.Scene();

    // Responsive Orthographic Camera
    const aspect = width / height;
    const zoom = width / (width < 700 ? 5.65 : 5.25);
    const camera = new THREE.OrthographicCamera(
      -width / (2 * zoom),
      width / (2 * zoom),
      height / (2 * zoom),
      -height / (2 * zoom),
      0.1,
      30
    );
    camera.position.set(0, 0, 9);
    camera.lookAt(0, 0, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xf1f5ff, 0x8aabc5, 1.4);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff8f1, 2.6);
    dirLight1.position.set(-3, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xc5deff, 1.8);
    dirLight2.position.set(3, 2, -2);
    scene.add(dirLight2);

    // Planet Root Group
    const centerY = (height / zoom) * (width < 700 ? 0.08 : 0.19) - 2.17;
    const worldGroup = new THREE.Group();
    worldGroup.position.set(0, centerY, 0);
    scene.add(worldGroup);

    const planetGroup = new THREE.Group();
    planetGroup.scale.setScalar(2.25);
    worldGroup.add(planetGroup);

    const runnerGroup = new THREE.Group();
    worldGroup.add(runnerGroup);

    // Facing & Lean Hierarchy for Courier
    const facingGroup = new THREE.Group();
    facingGroup.rotation.y = Math.PI / 2;
    runnerGroup.add(facingGroup);

    const leanGroup = new THREE.Group();
    facingGroup.add(leanGroup);

    const modelGroup = new THREE.Group();
    modelGroup.scale.setScalar(MODEL_SCALE);
    leanGroup.add(modelGroup);

    // Kinematics Data
    const globe = createGlobeMotion();
    const surface = createSurfaceMotion();
    const upVector = new THREE.Vector3(0, 1, 0);
    const screenUp = new THREE.Vector3();
    const localVelocity = new THREE.Vector3();
    const cameraFront = new THREE.Vector3();
    const inverseRunner = new THREE.Quaternion();
    const radiusRef = { current: 2.2 };
    let courierTurnVelocity = 0;
    let greetingTurn = false;

    // Loaders
    const draco = new DRACOLoader();
    draco.setDecoderPath(DRACO_PATH);
    draco.setWorkerLimit(2);
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    let mixer: THREE.AnimationMixer | null = null;
    let runAction: THREE.AnimationAction | null = null;
    let idleAction: THREE.AnimationAction | null = null;
    let bagSuspension: BagSuspension | null = null;
    let courierGreeting: CourierGreeting | null = null;
    let runDuration = 1;
    let assetsReady = false;

    // Load Planet & Courier in Parallel
    Promise.all([
      loader.loadAsync(`${ASSET_BASE}models/whimsical-world.glb`),
      loader.loadAsync(`${ASSET_BASE}models/courier.glb`),
    ])
      .then(([planetGltf, courierGltf]) => {
        if (disposed) return;

        // 1. Setup Planet Scene
        planetGltf.scene.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            for (const mat of mats) {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.side = THREE.FrontSide;
                mat.metalness = 0;
                mat.roughness = 0.86;
                mat.normalScale.setScalar(0.65);
                if (mat.map) mat.map.anisotropy = 4;
              }
            }
          }
        });
        planetGroup.add(planetGltf.scene);

        // 2. Setup Courier Character
        optimizeRigidBag(courierGltf.scene);
        courierGltf.scene.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.morphTargetInfluences?.fill(0);
            if (node instanceof THREE.SkinnedMesh) node.frustumCulled = false;
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            for (const mat of mats) {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.metalness = 0;
                mat.roughness = 0.9;
                mat.roughnessMap = null;
                mat.normalScale.setScalar(0.25);
                if (mat.map) mat.map.anisotropy = 8;
              }
            }
          }
        });

        // Setup Animations & Physics
        const clips = courierGltf.animations.filter((a) => a.duration > 0.3);
        if (clips.length > 0) {
          const runSourceClip = new THREE.AnimationClip(
            'Courier_Run_Source',
            -1,
            clips.flatMap((a) => a.tracks)
          );
          mixer = new THREE.AnimationMixer(courierGltf.scene);
          bagSuspension = new BagSuspension(courierGltf.scene);
          courierGreeting = new CourierGreeting(courierGltf.scene);

          const idleClip = makeIdle(courierGltf.scene);
          idleAction = mixer.clipAction(idleClip).play();

          const seamlessRunClip = makeSeamlessRun(runSourceClip);
          runDuration = seamlessRunClip.duration;
          runAction = mixer.clipAction(seamlessRunClip).setLoop(THREE.LoopRepeat, Infinity).play();
          runAction.zeroSlopeAtStart = false;
          runAction.zeroSlopeAtEnd = false;
          runAction.setEffectiveTimeScale(0);
          runAction.setEffectiveWeight(0);
          mixer.update(0);
        }

        modelGroup.add(courierGltf.scene);
        assetsReady = true;
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('3D World load issue:', err);
        if (!disposed) {
          setLoadError('Failed to load 3D world models.');
          setIsLoading(false);
        }
      });

    // 2. Main Animation Render Loop
    let lastTime = performance.now();

    const animate = () => {
      if (disposed) return;
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const m = motionRef.current;
      const count = Math.ceil(delta / (1 / 120));
      screenUp.copy(upVector).applyQuaternion(camera.quaternion);

      for (let i = 0; i < count; i++) {
        const dt = delta / count;
        stepGlobeMotion(globe, m, dt, isAutoRef.current, false);
        stepSurface(surface, m, globe.orientation, screenUp, dt, false, !isAutoRef.current);
      }

      planetGroup.quaternion.copy(globe.orientation);

      if (assetsReady && mixer && runAction && idleAction && bagSuspension && courierGreeting) {
        // Position courier atop surface
        const approxSurfaceRadius = 0.94 * 2.25;
        radiusRef.current = THREE.MathUtils.damp(radiusRef.current, approxSurfaceRadius + 8e-3, 25, delta);
        runnerGroup.position.copy(surface.worldNormal).multiplyScalar(radiusRef.current);
        runnerGroup.quaternion.setFromUnitVectors(upVector, surface.worldNormal);

        inverseRunner.copy(runnerGroup.quaternion).invert();
        cameraFront.set(0, 0, 1).applyQuaternion(camera.quaternion).applyQuaternion(inverseRunner);
        m.cameraHeading = Math.atan2(cameraFront.x, cameraFront.z);

        if (surface.velocity.lengthSq() > 1e-4) {
          localVelocity.copy(surface.worldVelocity).applyQuaternion(inverseRunner);
          m.heading = Math.atan2(-localVelocity.z, localVelocity.x);
        }

        // Steer Facing & Running Direction
        if (!isAutoRef.current) greetingTurn = false;
        else if (m.activity < 0.06) greetingTurn = true;

        const desired = !isAutoRef.current
          ? greetingTurn
            ? m.cameraHeading ?? 0
            : facingGroup.rotation.y
          : (m.heading ?? 0) + Math.PI / 2;
        const turn = Math.atan2(Math.sin(desired - facingGroup.rotation.y), Math.cos(desired - facingGroup.rotation.y));

        if (!isAutoRef.current) {
          const acceleration = THREE.MathUtils.clamp(18 * turn - 8.5 * courierTurnVelocity, -5.5, 5.5);
          courierTurnVelocity = THREE.MathUtils.clamp(courierTurnVelocity + acceleration * delta, -2.2, 2.2);
          if (Math.abs(turn) < 3e-3 && Math.abs(courierTurnVelocity) < 0.025) courierTurnVelocity = 0;
          facingGroup.rotation.y += courierTurnVelocity * delta;
        } else {
          const rot = turn * (1 - Math.exp(-12 * delta));
          facingGroup.rotation.y += rot;
          courierTurnVelocity = rot / delta;
        }

        const turning = !isAutoRef.current && greetingTurn ? smoothstep(Math.abs(courierTurnVelocity), 0.08, 1.2) : 0;
        courierGreeting.step(
          delta,
          !isAutoRef.current && greetingTurn && Math.abs(turn) < 0.055 && Math.abs(courierTurnVelocity) < 0.13,
          false
        );

        leanGroup.rotation.x = THREE.MathUtils.damp(
          leanGroup.rotation.x,
          Math.min(Math.abs(m.characterVelocity) * 0.065, 0.09),
          9,
          delta
        );

        const activity = Math.max(m.activity, turning * 0.3) * (1 - courierGreeting.weight);
        runAction.setEffectiveWeight(activity);
        idleAction.setEffectiveWeight(1 - activity);

        const playback = Math.max(
          ((Math.abs(m.characterVelocity) * 2.25) / GAIT_DISTANCE) * runDuration,
          turning * 0.72
        );
        runAction.setEffectiveTimeScale(THREE.MathUtils.damp(runAction.timeScale, playback, 10, delta));

        courierGreeting.restore();
        bagSuspension.restore();
        mixer.update(delta);
        modelGroup.updateWorldMatrix(true, true);
        courierGreeting.apply(false);
        bagSuspension.update(delta, activity, m.phase, courierTurnVelocity, false, leanGroup.rotation.x);
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 3. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const z = w / (w < 700 ? 5.65 : 5.25);
      camera.left = -w / (2 * z);
      camera.right = w / (2 * z);
      camera.top = h / (2 * z);
      camera.bottom = -h / (2 * z);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      draco.dispose();
      renderer.dispose();
    };
  }, []);

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isAuto || e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    const m = motionRef.current;
    m.dragTarget = m.planetAngle;
    m.pitchTarget = m.pitchAngle;
    m.dragging = true;
    m.lastInteraction = m.time;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isAuto || !dragRef.current || dragRef.current.id !== e.pointerId) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    const sensitivity = 5 / Math.max(360, (e.currentTarget as HTMLElement).clientWidth);
    const m = motionRef.current;
    m.dragTarget = Math.max(m.planetAngle - 0.5, Math.min(m.planetAngle + 0.5, m.dragTarget + dx * sensitivity));
    m.pitchTarget = Math.max(m.pitchAngle - 0.4, Math.min(m.pitchAngle + 0.4, m.pitchTarget + dy * sensitivity * 0.7));
    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
    m.lastInteraction = m.time;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current?.id === e.pointerId) {
      dragRef.current = null;
      motionRef.current.dragging = false;
      motionRef.current.lastInteraction = motionRef.current.time;
      setIsDragging(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[480px] sm:h-[580px] lg:h-[680px] overflow-hidden select-none ${className}`}
    >
      {/* 3D WebGL Canvas with Grab Cursor */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full h-full block touch-none outline-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs z-20 pointer-events-none space-y-3">
          <div className="w-9 h-9 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Bringing your global education world to life…
          </p>
        </div>
      )}

      {/* Curved "Drag to turn the world" Indicator Overlay */}
      <div
        className={`absolute right-4 sm:right-8 top-6 sm:top-10 z-10 pointer-events-none text-slate-400 dark:text-slate-400/80 transition-opacity duration-300 ${
          isDragging ? 'opacity-40' : 'opacity-90'
        }`}
      >
        <p className="text-xs sm:text-sm font-semibold italic text-right leading-tight">
          {!isAuto ? 'Press Start' : isDragging ? 'Good things.' : 'Drag to turn'}
          <br />
          {!isAuto ? 'to keep moving' : isDragging ? 'On their way.' : 'the world'}
        </p>
        <svg viewBox="0 0 180 165" fill="none" className="w-24 sm:w-28 h-auto ml-auto -mt-2">
          <path
            d="M161 148C137 82 103 39 28 14m0 0 6 16m-6-16 19-2"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Floating Cloud Bank at Bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#070D1E] dark:via-[#070D1E]/80 dark:to-transparent z-10"
        aria-hidden="true"
      />

      {/* Interactive Controls Overlay at Bottom */}
      <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-20 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pointer-events-none">
        <div className="hidden sm:block">
          <span className="font-extrabold uppercase tracking-wider text-[10px] text-slate-400">
            Courier Status:
          </span>
          <p className="font-bold text-slate-700 dark:text-slate-200">
            {isAuto ? 'Running in Express Orbit' : 'Paused to Greet You'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Nudge Left */}
          <button
            type="button"
            onClick={() => nudge(-1)}
            title="Rotate Left"
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          </button>

          {/* Pause / Start Button */}
          <button
            type="button"
            onClick={toggleMotion}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-sm border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">
              {isAuto ? 'pause' : 'play_arrow'}
            </span>
            <span>{isAuto ? 'Pause' : 'Start'}</span>
          </button>

          {/* Nudge Right */}
          <button
            type="button"
            onClick={() => nudge(1)}
            title="Rotate Right"
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-200 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
