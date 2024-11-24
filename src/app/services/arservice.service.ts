import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ARServiceService {
  private scene!: THREE.Scene;
  private camera!: THREE.Camera;
  private renderer!: THREE.Renderer;
  private model: THREE.Object3D | null = null;
  private reticle!: THREE.Mesh;
  private hitTestSource: XRHitTestSource | null = null;
  private lightProbe: any = null;
  private modelLoaded = new BehaviorSubject<boolean>(false);
  private lightEstimator!: THREE.LightProbe;
  private modelUrl: string = '/assets/models/coffe_pot_on_table.glb';

  constructor() {

  }

  private async preloadModel(): Promise<void> {
    const loader = new GLTFLoader();
    try {
      const gltf = await loader.loadAsync(this.modelUrl);
      this.model = gltf.scene;
      this.model.scale.set(0.1, 0.1, 0.1);
      this.modelLoaded.next(true);
    } catch (error) {
      console.error('Error loading model: ', error);
    }
  }

  // async initAr(canvas: HTMLCanvasElement); Promise<void> {
  //   if (!navigator.xr) {
  //     throw new Error('WebXR not supported');
  //   }

  //   const isArSupported = await navigator.xr?.isSessionSupported('immersive-ar');
  //   if (!isArSupported) {
  //     throw new Error('AR not supported');
  //   }

  //   try {
  //     const session = await navigator.xr?.requestSession('immersive-ar'. {
  //       requiredFeatures: ['hit-test'],
  //       optionalFeatures: ['light-estimation']
  //     });

  //     this.renderer.xr.setReferenceSpaceType('local');
  //     await this.renderer.xr.setSession(session);
  //     // Set up hit testing
  //     const viewerSpace = await session.requestReferenceSpace('viewer');
  //     this.hitTestSource = await session.requestHitTestSource({
  //       space: viewerSpace
  //     });

  //     // Try to set up light estimation
  //     try {
  //       this.xrLightProbe = await session.requestLightProbe();
  //     } catch (error) {
  //       console.warn('Light estimation not available:', error);
  //     }

  //     // Start render loop
  //     this.renderer.setAnimationLoop((time: number, frame: XRFrame) => {
  //       this.render(time, frame);
  //     });
  //   } catch (error) {
  //     console.error('Error initializing AR:', error);
  //     throw error;
  //   }
  // }
}
