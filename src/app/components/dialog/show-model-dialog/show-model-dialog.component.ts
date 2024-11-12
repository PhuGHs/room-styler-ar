import { Component, ElementRef, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GalleriaModule } from 'primeng/galleria';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

@Component({
  selector: 'app-show-model-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, GalleriaModule],
  templateUrl: './show-model-dialog.component.html',
  styleUrl: './show-model-dialog.component.scss'
})
export class ShowModelDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model: THREE.Object3D | null = null;
  private controls!: OrbitControls;
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  // Initial camera position for reset
  private initialCameraPosition = new THREE.Vector3(0, 1, 1.75);
  private initialControlsTarget = new THREE.Vector3(0, 0, 0);

  showControlsHint = true;

  constructor(private dialogRef: MatDialogRef<ShowModelDialogComponent>) {
  }

  ngOnInit(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.copy(this.initialCameraPosition);
  }

  ngAfterViewInit(): void {
    this.initializeRenderer();
    this.initializeControls();
    this.setUpScene();
    this.setupResizeObserver();
    this.updateSize();
  }

  private initializeRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
  }

  private initializeControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.8;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 100;

    this.controls.maxPolarAngle = Math.PI * 0.75;
    this.controls.minPolarAngle = Math.PI * 0.25;

    this.controls.target.copy(this.initialControlsTarget);
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateSize();
    });

    if (this.canvasRef.nativeElement.parentElement) {
      this.resizeObserver.observe(this.canvasRef.nativeElement.parentElement);
    }
  }

  private updateSize(): void {
    if (!this.canvasRef.nativeElement.parentElement) return;

    const width = this.canvasRef.nativeElement.parentElement.clientWidth;
    const height = this.canvasRef.nativeElement.parentElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private setUpScene(): void {
    // Add background
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/images/background.png', (texture) => {
      const sphere = new THREE.SphereGeometry(500, 60, 40);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
      });
      const background = new THREE.Mesh(sphere, material);
      this.scene.add(background);
    });


    // Add light
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, 3, -5);
    this.scene.add(pointLight);

    this.loadModel();
    this.animate();
  }

  private loadModel(): void {
    // Add loading manager to track progress
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = (url, loaded, total) => {
      const progress = (loaded / total * 100).toFixed(2);
      console.log(`Loading: ${progress}% (${url})`);
    };

    const loader = new GLTFLoader(loadingManager);  // Pass manager directly in constructor

    loader.load('/models/leather-sofa-gltf.gltf',
      (gltf) => {
        this.model = gltf.scene;

        // Center the model
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        this.model.position.sub(center);

        // Adjust model scale if needed
        const scalar = 1; // Adjust this value to change model size
        this.model.scale.set(scalar, scalar, scalar);

        // Enable shadows
        this.model.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        this.scene.add(this.model);

        // Update controls target to model center
        this.controls.target.copy(new THREE.Vector3(0, 0, 0));
        this.controls.update();
      },
      (progress) => {
        const percentComplete = (progress.loaded / progress.total * 100);
        console.log('Loading progress:', percentComplete.toFixed(2) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );
}

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Update controls
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }

  // UI Methods
  hideControlsHint(): void {
    this.showControlsHint = false;
  }

  resetView(): void {
    // Smoothly animate camera back to initial position
    const duration = 1000; // Animation duration in ms
    const startPosition = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const startTime = performance.now();

    const animateReset = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing function
      const eased = 1 - Math.cos((progress * Math.PI) / 2);

      // Interpolate camera position
      this.camera.position.lerpVectors(
        startPosition,
        this.initialCameraPosition,
        eased
      );

      // Interpolate controls target
      this.controls.target.lerpVectors(
        startTarget,
        this.initialControlsTarget,
        eased
      );

      this.controls.update();

      if (progress < 1) {
        requestAnimationFrame(animateReset);
      }
    };

    requestAnimationFrame(animateReset);
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // Clean up controls
    this.controls?.dispose();

    // Clean up Three.js resources
    this.scene?.clear();
    this.renderer?.dispose();
  }
}
