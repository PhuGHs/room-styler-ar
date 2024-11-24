import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { XREstimatedLight } from 'three/addons/webxr/XREstimatedLight.js';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar'
// import { Pane } from 'tweakpane';
import eruda from 'eruda';

interface ARButtonOptions {
  requiredFeatures: string[];
  optionalFeatures?: string[];
  domOverlay?: {
    root: HTMLElement;
  };
  depthSensing?: {
    usagePreference: ['cpu-optimized'],
    dataFormatPreference: ['luminance-alpha']
  }
}

interface PreloadedModel {
  url: string;
  model: THREE.Group;
  loaded: boolean;
}

@Component({
  selector: 'app-product-details-ar',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './product-details-ar.component.html',
  styleUrl: './product-details-ar.component.scss'
})
export class ProductDetailsArComponent implements OnInit, OnDestroy {
  @ViewChild('arContainer', { static: true }) arContainer!: ElementRef;

  //for pane
  // private pane!: Pane;

  //for three.js
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private reticle!: THREE.Mesh;
  private controller!: THREE.Group;

  //for shadows
  private plane!: THREE.Mesh;

  errorMessage: string = '';
  loadingProgress: number = 0;

  private loader = new GLTFLoader();
  private loadedModel: THREE.Group | null = null;
  private preloadedModels: Map<string, PreloadedModel> = new Map();
  private isModelPreloadingComplete: boolean = false;
  private modelUrls = [
    'models/coffe_pot_on_table.glb',
    'models/sofa.glb'
  ];
  private currentModelIndex = 0;

  private xrLight: XREstimatedLight | null = null;
  private hitTestSource: XRHitTestSource | null = null;
  private localSpace: XRReferenceSpace | null = null;
  public xrSessionActive: boolean = false;

  PARAMS = {
    x: -1,
    y: 1.7,
    z: 3.4,
    intensity: 9,
    distance: 20,
    angle: 0.2
  };

  constructor() {
  }

  async ngOnInit() {
    await this.checkARSupport().then(supported => {
      if (supported) {
        this.preloadAllModels().then(() => {
          this.initializeAR();
        })
      } else {
        this.errorMessage = 'WebXR AR is not supported on this device or browser.';
      }
    });
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private async preloadAllModels(): Promise<void> {
    const totalModels = this.modelUrls.length;
    let loadedModels = 0;

    const loadPromises = this.modelUrls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        this.loader.load(
          url,
          (gltf) => {
            this.preloadedModels.set(url, {
              url,
              model: gltf.scene,
              loaded: true
            });
            loadedModels++;
            this.loadingProgress = (loadedModels / totalModels) * 100;
            resolve();
          },
          (progress) => {
            const progressPercentage = (progress.loaded / progress.total) * 100;
            console.log(`Preloading ${url}: ${progressPercentage.toFixed(2)}%`);
          },
          (error) => {
            console.error(`Error preloading model ${url}:`, error);
            reject(error);
          }
        )
      })
    });

    try {
      await Promise.all(loadPromises);
      console.log('All models preloaded successfully');
      this.isModelPreloadingComplete = true;
    } catch (error) {
      console.error('Error during model preloading:', error);
      this.errorMessage = 'Failed to preload some 3D models. Please try again.';
      throw error;
    }
  }

  private async checkARSupport(): Promise<boolean> {
    if (!navigator.xr) {
      console.log('WebXR not available');
      return false;
    }

    try {
      const supported = await navigator.xr.isSessionSupported('immersive-ar');
      console.log('AR supported:', supported);
      return supported;
    } catch (error) {
      console.error('Error checking AR support:', error);
      return false;
    }
  }

  private async initializeAR() {
    try {
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
      );

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.xr.enabled = true;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

      this.arContainer.nativeElement.appendChild(this.renderer.domElement);

      await this.setupLighting();
      await this.setupController();
      this.setupARButton();

      window.addEventListener('resize', this.onWindowResize.bind(this));
      this.renderer.setAnimationLoop(this.render.bind(this));

    } catch (error) {
      console.error('Error initializing AR:', error);
      this.errorMessage = 'Failed to initialize AR. Please try again.';
    }
  }

  private setupARButton() {
    const arButtonOptions: ARButtonOptions = {
      requiredFeatures: ['hit-test', 'dom-overlay'],
      optionalFeatures: ['light-estimation', 'depth-sensing', 'anchors'],
      // domOverlay: {
      //   root: document.body
      // }
      // depthSensing: {
      //   usagePreference: ['cpu-optimized'],
      //   dataFormatPreference: ['luminance-alpha']
      // }
    };

    const arButton = ARButton.createButton(this.renderer, arButtonOptions);

    // Handle session events
    this.renderer.xr.addEventListener('sessionstart', async () => {
      console.log('AR Session starting...');
      this.xrSessionActive = true;
      this.errorMessage = '';

      try {
        const session = this.renderer.xr.getSession();
        if (session) {
          await this.initializeHitTestSource(session);
          // await this.initDepthSensing(session);
        }
      } catch (error) {
        console.error('Error in session start:', error);
        this.errorMessage = 'Error starting AR session';
      }
    });

    this.renderer.xr.addEventListener('sessionend', () => {
      console.log('AR Session ended');
      this.xrSessionActive = false;
      this.hitTestSource = null;
      this.localSpace = null;
    });

    document.body.appendChild(arButton);
  }

  private async initDepthSensing(session: XRSession) {
    try {
      const depthInfo = await session.requestReferenceSpace('local-floor');
      console.log('Depth sensing initialized:', depthInfo);
    } catch (error) {
      console.error('Error initializing depth sensing:', error);
    }
  }

  private async setupLighting() {
    this.xrLight = new XREstimatedLight(this.renderer);

    this.xrLight.addEventListener('estimationstart', () => {
      if (this.xrLight) {
        this.scene.add(this.xrLight);
        if (this.xrLight.environment) {
          this.scene.environment = this.xrLight.environment;
        }
      }
    });

    this.xrLight.addEventListener('estimationend', () => {
      if (this.xrLight) {
        this.scene.remove(this.xrLight);
        this.scene.environment = null;
      }
    });
// // Ambient light for general illumination
// const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
// this.scene.add(ambientLight);

// // Directional light for shadows
// const dirLight = new THREE.DirectionalLight(0xffffff, 1);
// dirLight.position.set(5, 5, 5); // Position the light higher and further from the scene
// dirLight.castShadow = true;

// // Configure shadow properties
// dirLight.shadow.mapSize.width = 2048;
// dirLight.shadow.mapSize.height = 2048;
// dirLight.shadow.camera.near = 0.5;
// dirLight.shadow.camera.far = 50;
// dirLight.shadow.camera.left = -10;
// dirLight.shadow.camera.right = 10;
// dirLight.shadow.camera.top = 10;
// dirLight.shadow.camera.bottom = -10;
// dirLight.shadow.bias = -0.001; // Reduce shadow acne

// this.scene.add(dirLight);

// Optional: Add helper to visualize light position and shadow camera
// const helper = new THREE.DirectionalLightHelper(dirLight, 5);
// this.scene.add(helper);
// const shadowHelper = new THREE.CameraHelper(dirLight.shadow.camera);
// this.scene.add(shadowHelper);

// this.addPlaneToSceneThatReceivesShadows();
}

private addPlaneToSceneThatReceivesShadows() {
  const geometry = new THREE.PlaneGeometry(40, 40);
  geometry.rotateX(-Math.PI / 2);

  // 7. Using a more visible material for the ground
  const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,  // Lighter color to make shadows more visible
      roughness: 1,
      metalness: 0
  });

  this.plane = new THREE.Mesh(geometry, material);
  this.plane.receiveShadow = true;
  this.plane.position.y = 0; // Ensure it's at y=0
  this.plane.visible = true;
  this.plane.matrixAutoUpdate = true;
  this.scene.add(this.plane);
}

  private async setupController() {
    this.controller = this.renderer.xr.getController(0);
    this.controller.addEventListener('select' as keyof THREE.Object3DEventMap, this.onSelect.bind(this));
    this.scene.add(this.controller);

    const geometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x4CAF50,
      opacity: 0.8,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.reticle = new THREE.Mesh(geometry, material);
    this.reticle.matrixAutoUpdate = false;
    this.reticle.visible = false;
    this.scene.add(this.reticle);
  }

  private async initializeHitTestSource(session: XRSession) {
    if (this.hitTestSource) return;

    try {
      console.log('Initializing hit test source...');
      const viewerSpace = await session.requestReferenceSpace("viewer");
      this.localSpace = await session.requestReferenceSpace("local");

      if (session.requestHitTestSource) {
        const hitTestSource = await session.requestHitTestSource({
          space: viewerSpace
        });

        this.hitTestSource = hitTestSource || null;
        console.log('Hit test source initialized successfully');
      } else {
        throw new Error('Hit test source not supported');
      }
    } catch (error) {
      console.error("Hit test source initialization failed:", error);
      this.errorMessage = 'Failed to initialize AR tracking. Please ensure you have good lighting and a clear view of your surroundings.';
    }
  }

  private placePreloadedModel() {
    if (!this.isModelPreloadingComplete) {
      console.warn('Attempted to place model before preloading completed');
      return;
    }

    const currentModelUrl = this.modelUrls[this.currentModelIndex];
    const preloadedModel = this.preloadedModels.get(currentModelUrl);

    if (!preloadedModel || !preloadedModel.loaded) {
      console.error('Model not found or not loaded:', currentModelUrl);
      return;
    }

    if (this.loadedModel) {
      this.scene.remove(this.loadedModel);
    }

    // Clone the preloaded model to allow multiple instances
    this.loadedModel = preloadedModel.model.clone();

    const boundingBox = new THREE.Box3().setFromObject(this.loadedModel);
    const size = boundingBox.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scaleFactor = 1 / maxDimension;

    this.loadedModel.scale.multiplyScalar(scaleFactor);
    this.loadedModel.position.setFromMatrixPosition(this.reticle.matrix);
    this.loadedModel.quaternion.setFromRotationMatrix(this.reticle.matrix);

    this.loadedModel.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    this.scene.add(this.loadedModel);
    this.currentModelIndex = (this.currentModelIndex + 1) % this.modelUrls.length;
  }

  private onSelect = () => {
    if (this.reticle.visible && this.isModelPreloadingComplete) {
      this.placePreloadedModel();
    }
  }

  private render = (timestamp: number, frame?: XRFrame) => {
    if (frame && this.xrSessionActive) {
      const session = this.renderer.xr.getSession();

      if (session && !this.hitTestSource) {
        this.initializeHitTestSource(session);
      }

      if (this.hitTestSource && this.localSpace) {
        const hitTestResults = frame.getHitTestResults(this.hitTestSource);

        if (hitTestResults.length > 0) {
          const hit = hitTestResults[0];
          const pose = hit.getPose(this.localSpace);

          if (pose) {
            this.reticle.visible = true;
            this.reticle.matrix.fromArray(pose.transform.matrix);
          }
        } else {
          this.reticle.visible = false;
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize = () => {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  private cleanup() {
    window.removeEventListener('resize', this.onWindowResize);

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.setAnimationLoop(null);
    }

    if (this.scene) {
      this.scene.clear();
    }

    if (this.hitTestSource) {
      this.hitTestSource.cancel();
      this.hitTestSource = null;
    }

    this.loadedModel = null;
    this.localSpace = null;
    this.xrSessionActive = false;
  }
}
