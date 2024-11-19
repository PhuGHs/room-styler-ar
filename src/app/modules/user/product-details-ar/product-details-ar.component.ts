import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { XREstimatedLight } from 'three/addons/webxr/XREstimatedLight.js';

@Component({
  selector: 'app-product-details-ar',
  standalone: true,
  imports: [],
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

  private loader = new GLTFLoader();
  private loadedModel: THREE.Group | null = null;
  private modelUrls = [
    'models/coffe_pot_on_table.glb',
    'models/sofa.glb'
  ];
  private currentModelIndex = 0;

  private xrLight: XREstimatedLight | null = null;
  private hitTestSource!: XRHitTestSource | null
  private localSpace: XRReferenceSpace | null = null;

  constructor() {
    // Preload models to improve performance
    this.preloadModels();
  }

  ngOnInit() {
    this.initializeAR();
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private preloadModels() {
    this.modelUrls.forEach(url => {
      this.loader.load(url, (gltf) => {
        console.log(`Preloaded model: ${url}`);
      }, undefined, (error) => {
        console.error(`Error preloading model ${url}:`, error);
      });
    });
  }

  private initializeAR() {
    this.scene = new THREE.Scene();

    // Improved camera setup with better FOV and clipping planes
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);

    // Enhanced renderer with better performance settings
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;
    this.arContainer.nativeElement.appendChild(this.renderer.domElement);

    // Advanced lighting setup
    this.setupLighting();

    // Controller and interaction setup
    this.setupController();

    // AR button with comprehensive features
    const arButton = ARButton.createButton(this.renderer, {
      requiredFeatures: ['hit-test', 'depth-sensing'],
      optionalFeatures: ['light-estimation', 'anchors']
    });
    document.body.appendChild(arButton);

    // Event listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Start rendering
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  private setupLighting() {
    // XR Estimated Light
    this.xrLight = new XREstimatedLight(this.renderer);
    this.xrLight.addEventListener('estimationstart', () => {
      this.scene.add(this.xrLight!);
      if (this.xrLight!.environment) {
        this.scene.environment = this.xrLight!.environment;
      }
    });
    this.xrLight.addEventListener('estimationend', () => {
      this.scene.remove(this.xrLight!);
      this.scene.environment = null;
    });

    // Comprehensive lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);

    this.scene.add(ambientLight, directionalLight);
  }

  private setupController() {
    this.controller = this.renderer.xr.getController(0);
    this.controller.addEventListener('select' as keyof THREE.Object3DEventMap, this.onSelect.bind(this));
    this.scene.add(this.controller);

    this.addReticleToScene();
  }

  private addReticleToScene() {
    const geometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,  // Green for better visibility
      opacity: 0.5,
      transparent: true
    });

    this.reticle = new THREE.Mesh(geometry, material);
    this.reticle.matrixAutoUpdate = false;
    this.reticle.visible = false;
    this.scene.add(this.reticle);
  }

  private onSelect = () => {
    if (this.reticle.visible) {
      this.loadNextModel();
    }
  }

  private loadNextModel() {
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

        this.loadedModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
        this.loadedModel.position.setFromMatrixPosition(this.reticle.matrix);
        this.loadedModel.quaternion.setFromRotationMatrix(this.reticle.matrix);

        this.scene.add(this.loadedModel);
        this.currentModelIndex = (this.currentModelIndex + 1) % this.modelUrls.length;
      },
      (progress) => {
        console.log(`Loading ${modelUrl}:`,
          `${(progress.loaded / progress.total * 100).toFixed(2)}% loaded`
        );
      },
      (error) => {
        console.error(`Error loading ${modelUrl}:`, error);
      }
    );
  }

  private render = (timestamp: number, frame: XRFrame) => {
    if (frame) {
      const session = this.renderer.xr.getSession();
      if (session && !this.hitTestSource) {
        this.initializeHitTestSource(session);
      }

      if (this.hitTestSource) {
        const hitTestResults = frame.getHitTestResults(this.hitTestSource);

        if (hitTestResults.length > 0) {
          const hit = hitTestResults[0];
          const pose = hit.getPose(this.localSpace!);

          this.reticle.visible = true;
          this.reticle.matrix.fromArray(pose!.transform.matrix);
        } else {
          this.reticle.visible = false;
        }
      }

      this.renderer.render(this.scene, this.camera);
    }
  }

  private async initializeHitTestSource(session: XRSession) {
    try {
      const viewerSpace = await session.requestReferenceSpace("viewer");
      if (session.requestHitTestSource) {
        this.hitTestSource = await session.requestHitTestSource({space: viewerSpace}) as XRHitTestSource | null;
      } else {
        this.hitTestSource = null;
      }
      this.localSpace = await session.requestReferenceSpace("local");
    } catch (error) {
      console.error("Hit test source initialization failed:", error);
    }
}

  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private cleanup() {
    window.removeEventListener('resize', this.onWindowResize);
    this.renderer.dispose();
  }
}
