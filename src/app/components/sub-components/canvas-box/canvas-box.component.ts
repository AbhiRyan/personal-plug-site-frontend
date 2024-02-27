import { DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import {
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
  BlendFunction,
} from 'postprocessing';
import { vertexShader } from './shaders/vertexShader';
import { fragmentShader } from './shaders/fragmentShader';

@Component({
  selector: 'app-canvas-box',
  standalone: true,
  imports: [FormsModule],
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

    const shader = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
      },
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

    const bloomEffect = new BloomEffect({
      blendFunction: BlendFunction.ADD,
      mipmapBlur: true,
      luminanceThreshold: 0.1,
      luminanceSmoothing: 1.0,
      intensity: 1.0,
      radius: 0.23,
      levels: 3,
      resolutionScale: 1.0,
    });

    const smaaEffect = new SMAAEffect({
      preset: SMAAPreset.HIGH,
    });

    //setup pass composer
    const effectComposer = new EffectComposer(renderer);
    const renderScene = new RenderPass(scene, this.camera);

    const smaaPass = new EffectPass(this.camera, smaaEffect);
    const bloomPass = new EffectPass(this.camera, bloomEffect);
    effectComposer.addPass(renderScene);
    //needs work AO
    effectComposer.addPass(smaaPass);
    effectComposer.addPass(bloomPass);

    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        requestAnimationFrame(animate);
        if (this.animationMixer) {
          this.animationMixer.update(clock.getDelta());
        }
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
