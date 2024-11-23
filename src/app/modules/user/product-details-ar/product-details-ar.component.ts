import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { XREstimatedLight } from 'three/addons/webxr/XREstimatedLight.js';
import { CommonModule } from '@angular/common';

interface ARButtonOptions {
  requiredFeatures: string[];
  optionalFeatures?: string[];
  domOverlay?: {
    root: HTMLElement;
  };
}

@Component({
  selector: 'app-product-details-ar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details-ar.component.html',
  styleUrl: './product-details-ar.component.scss'
})
export class ProductDetailsArComponent implements OnInit, OnDestroy {
  @ViewChild('arContainer', { static: true }) arContainer!: ElementRef;


  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private reticle!: THREE.Mesh;
  private controller!: THREE.Group;

  errorMessage: string = '';
  loadingProgress: number = 0;

  private loader = new GLTFLoader();
  private loadedModel: THREE.Group | null = null;
  private modelUrls = [
    'models/coffe_pot_on_table.glb',
    'models/sofa.glb'
  ];
  private currentModelIndex = 0;

  private xrLight: XREstimatedLight | null = null;
  private hitTestSource: XRHitTestSource | null = null;
  private localSpace: XRReferenceSpace | null = null;
  public xrSessionActive: boolean = false;

  constructor() {
    this.preloadModels();
  }

  ngOnInit() {
    this.checkARSupport().then(supported => {
      if (supported) {
        this.initializeAR();
      } else {
        this.errorMessage = 'WebXR AR is not supported on this device or browser.';
      }
    });
  }

  ngOnDestroy() {
    this.cleanup();
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

  private preloadModels() {
    this.modelUrls.forEach((url, index) => {
      this.loader.load(
        url,
        (gltf) => {
          console.log(`Preloaded model: ${url}`);
          this.loadingProgress = ((index + 1) / this.modelUrls.length) * 100;
        },
        (progress) => {
          const progressPercentage = (progress.loaded / progress.total) * 100;
          console.log(`Loading ${url}: ${progressPercentage.toFixed(2)}%`);
        },
        (error) => {
          console.error(`Error preloading model ${url}:`, error);
          // Fix for TS18046: Type assertion for error
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          this.errorMessage = `Error loading 3D model: ${errorMessage}`;
        }
      );
    });
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
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.xr.enabled = true;

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
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['light-estimation', 'depth-sensing', 'anchors']
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;

    this.scene.add(ambientLight, directionalLight);
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

        // Fix for TS2322: Explicit null check before assignment
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

  // Rest of the component methods remain the same...
  private onSelect = () => {
    if (this.reticle.visible) {
      this.loadAndPlaceModel();
    }
  }

  loadAndPlaceModel() {
    const modelUrl = this.modelUrls[this.currentModelIndex];

    this.loader.load(
      modelUrl,
      (gltf) => {
        if (this.loadedModel) {
          this.scene.remove(this.loadedModel);
        }

        this.loadedModel = gltf.scene;

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
      },
      (progress) => {
        const progressPercentage = (progress.loaded / progress.total) * 100;
        this.loadingProgress = progressPercentage;
      },
      (error) => {
        console.error(`Error loading model ${modelUrl}:`, error);
        this.errorMessage = 'Error loading 3D model. Please try again.';
      }
    );
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
