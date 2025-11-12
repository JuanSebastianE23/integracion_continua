/// <reference types="vite/client" />
/* eslint-disable no-unused-vars */

declare module 'three/examples/jsm/controls/OrbitControls' {
  import { Camera } from 'three';
  export class OrbitControls {
    constructor(object: Camera, domElement: HTMLElement);
    update(): void;
    enableDamping: boolean;
    dampingFactor: number;
    enableZoom: boolean;
    enablePan: boolean;
    enableRotate: boolean;
    minDistance: number;
    maxDistance: number;
  }
}