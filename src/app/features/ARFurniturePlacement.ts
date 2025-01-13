import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ARFurniturePlacement {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;
  private raycaster: THREE.Raycaster;
  private currentModel: THREE.Group<THREE.Object3DEventMap> | null;
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.xr.enabled = true;

    // Light setup for realistic rendering
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);

    // Raycaster for hit testing
    this.raycaster = new THREE.Raycaster();

    // Current furniture model
    this.currentModel = null;

    // Initialize XR features
    this.initXR();
  }

  async initXR() {
    // Check if AR is supported
    if (!navigator.xr) {
      console.error('WebXR not supported');
      return;
    }

    // Add AR button to the page
    const arButton = document.createElement('button');
    arButton.textContent = 'Start AR';
    arButton.addEventListener('click', () => this.startAR());
    document.body.appendChild(arButton);
  }

  async startAR() {
    try {
      if (navigator.xr) {
        const session = await navigator.xr.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test', 'local-floor'],
        });

        this.renderer.xr.setReferenceSpaceType('local-floor');
        await this.renderer.xr.setSession(session);

        // Set up hit testing
        this.initHitTesting(session);

        // Start render loop
        this.renderer.setAnimationLoop((timestamp, frame) =>
          this.render(timestamp, frame)
        );
      }

    } catch (error) {
      console.error('Error starting AR session:', error);
    }
  }

  async loadFurnitureModel(modelUrl: string) {
    const loader = new GLTFLoader();
    try {
      const gltf = await loader.loadAsync(modelUrl);
      this.currentModel = gltf.scene;

      // Enable shadows
      this.currentModel.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          const mesh = node as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });

      // Add to scene but hide initially
      this.currentModel.visible = false;
      this.scene.add(this.currentModel);
    } catch (error) {
      console.error('Error loading model:', error);
    }
  }

  initHitTesting(session: XRSession) {
    session.addEventListener('select', () => {
      // Place furniture at hit point
      if (this.currentModel && this.hitPose) {
        this.currentModel.visible = true;
        this.currentModel.position.set(
          this.hitPose.position.x,
          this.hitPose.position.y,
          this.hitPose.position.z
        );
        this.currentModel.quaternion.copy(this.hitPose.orientation);
      }
    });
  }

  async render(timestamp: DOMHighResTimeStamp, frame: XRFrame) {
    if (!frame) return;

    const session = frame.session;
    const referenceSpace = this.renderer.xr.getReferenceSpace() as XRReferenceSpace;

    // Perform hit testing
    if (session.requestHitTest) {
      const hitTestResults = await session.requestHitTest(
        new XRRay(new XRRigidTransform()),
        referenceSpace
      ) as XRHitResult[];

      if (hitTestResults.length) {
        this.hitPose = hitTestResults[0].getPose(referenceSpace);

        // Update model preview position
        if (this.currentModel) {
          this.currentModel.visible = true;
          this.currentModel.position.set(
            this.hitPose.position.x,
            this.hitPose.position.y,
            this.hitPose.position.z
          );
        }
      }
    }

    // Update lighting based on environment
    if (frame.getLightEstimate) {
      const lightEstimate = frame.getLightEstimate();
      if (lightEstimate) {
        const intensity = lightEstimate.primaryLightIntensity;
        this.directionalLight.intensity = intensity;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

export default ARFurniturePlacement;
