import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  NgZone,
  OnInit,
  inject,
} from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

@Component({
  selector: 'app-canvas-box',
  standalone: true,
  imports: [],
  templateUrl: './canvas-box.component.html',
  styleUrl: './canvas-box.component.scss',
})
export class CanvasBoxComponent implements OnInit {
  @Input() glbPath: string = '../../../../assets/fandango_baked_04.glb';
  @Input() canvasWidth: number = 800;
  @Input() aspectRatio: number = 16 / 9;
  @Input() backgroundTransparency: number = 0.0;
  @Input() backgroundTransparencyBloom: number = 0.075;
  @Input() backgroundColour: string = '#2F2856';
  @Input() animationLoop: boolean = false;
  @Input() animationIndex: number = 0;
  @Input() exposure: number = 0;

  @Input() bloomEnabled: boolean = true;
  @Input() bloomParams: {
    strength: number;
    radius: number;
    threshold: number;
  } = {
    strength: 0.15,
    radius: 1.0,
    threshold: 0.8,
  };

  private ngZone = inject(NgZone);

  private animationMixer: THREE.AnimationMixer;
  private animations: THREE.AnimationClip[];
  private loopToggle: boolean = true;
  private camera: any;
  private cameraOriginal: any;

  ngOnInit(): void {
    this.createThreeJsScene();
  }

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.animations = [];
    this.animationMixer = new THREE.AnimationMixer(new THREE.Scene());
  }

  public onClick() {
    if (!this.animationLoop) {
      this.playAnimation(true, this.animationIndex, 1);
      return;
    }
    this.playAnimation(this.loopToggle);
    this.loopToggle = !this.loopToggle;
  }

  public createThreeJsScene() {
    //define scene basics
    let canvas = null;
    try {
      canvas = document.getElementById('canvas-box');
    } catch {}
    if (!canvas) {
      return;
    }

    const scene = new THREE.Scene();
    this.cameraOriginal = new THREE.PerspectiveCamera();
    this.camera = new THREE.PerspectiveCamera();

    const glbLoader = new GLTFLoader();
    const clock = new THREE.Clock();
    //set renderer up.
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
      alpha: true,
    });

    //define canvas size
    const canvasSizes = {
      width: this.canvasWidth,
      height: this.canvasWidth / this.aspectRatio,
    };

    //load glb file & process relative dependant elements.
    glbLoader.load(
      this.glbPath,
      (gltf) => {
        scene.add(gltf.scene);
        if (gltf.cameras[0] instanceof THREE.PerspectiveCamera) {
          this.cameraOriginal = gltf.cameras[0];
        }

        this.animations = gltf.animations;
        this.animationMixer = new THREE.AnimationMixer(gltf.scene);
        this.playAnimation(this.animationLoop, this.animationIndex, 1);

        this.camera.copy(this.cameraOriginal);

        this.camera.updateMatrixWorld();
        this.camera.updateProjectionMatrix();
        scene.add(this.camera);

        const controls = new OrbitControls(this.camera, renderer.domElement);
        controls.maxPolarAngle = Math.PI * 0.5;
        controls.minDistance = 10;
        controls.maxDistance = 30;
        controls.update();
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    //set up renderer
    const renBackgroundColour = new THREE.Color(this.backgroundColour);
    renderer.setClearColor(renBackgroundColour, this.backgroundTransparency);
    renderer.setSize(canvasSizes.width, canvasSizes.height);
    renderer.pixelRatio = window.devicePixelRatio;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = Math.pow(2, this.exposure);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //setup bloom pass
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(canvasSizes.width, canvasSizes.height),
      this.bloomParams.strength,
      this.bloomParams.radius,
      this.bloomParams.threshold
    );

    //setup pass composer
    const renderScene = new RenderPass(scene, this.camera);
    const effectComposer = new EffectComposer(renderer);
    effectComposer.addPass(renderScene);
    effectComposer.addPass(bloomPass);

    const outputPass = new OutputPass();
    effectComposer.addPass(outputPass);

    effectComposer.renderer.setClearColor(
      renBackgroundColour,
      this.backgroundTransparencyBloom
    );

    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        requestAnimationFrame(animate);
        if (this.animationMixer) {
          this.animationMixer.update(clock.getDelta());
        }
        renderer.render(scene, this.camera);
        effectComposer.render();
      };
      animate();
    });
  }

  /**
   * plays the animation of the loaded glb file
   * @param loop
   * @param clipIndex
   * @param repetitions
   */
  public playAnimation(
    loop: boolean = false,
    clipIndex: number = 0,
    repetitions: number = loop ? Infinity : 1
  ) {
    if (
      this.animations &&
      this.animations.length > clipIndex &&
      this.animationMixer
    ) {
      const action = this.animationMixer.clipAction(this.animations[clipIndex]);
      action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, repetitions);
      action.clampWhenFinished = true;
      if (!action.isRunning()) {
        action.reset();
      }
      action.play();
    }
  }
}
