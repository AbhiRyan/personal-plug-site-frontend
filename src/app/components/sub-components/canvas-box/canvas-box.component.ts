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

@Component({
  selector: 'app-canvas-box',
  standalone: true,
  imports: [],
  templateUrl: './canvas-box.component.html',
  styleUrl: './canvas-box.component.scss',
})
export class CanvasBoxComponent implements OnInit {
  @Input() glbPath: string = '../../../../assets/fandango_baked_03.glb';
  @Input() canvasWidth: number = 800;
  @Input() aspectRatio: number = 16 / 9;
  @Input() backgroundTransparency: number = 0.0;

  private ngZone = inject(NgZone);

  ngOnInit(): void {
    this.createThreeJsBox();
  }

  constructor(@Inject(DOCUMENT) private document: Document) {}

  createThreeJsBox() {
    //define scene basics
    let canvas = null;
    try {
      canvas = document.getElementById('canvas-box');
    } catch {}
    if (!canvas) {
      return;
    }

    const scene = new THREE.Scene();
    const glbLoader = new GLTFLoader();
    const clock = new THREE.Clock();

    let camera = new THREE.PerspectiveCamera();
    let animationMixer: THREE.AnimationMixer;

    //define canvas size
    const canvasSizes = {
      width: this.canvasWidth,
      height: this.canvasWidth / this.aspectRatio,
    };

    glbLoader.load(
      this.glbPath,
      function (gltf) {
        scene.add(gltf.scene);
        if (gltf.cameras[0] instanceof THREE.PerspectiveCamera) {
          camera = gltf.cameras[0];
        }
        // Extract animations
        animationMixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
          animationMixer.clipAction(clip).play();
        });
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
    scene.add(camera);

    //set renderer up.
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
    });
    renderer.setClearColor(0xe232222, 0);
    renderer.setSize(canvasSizes.width, canvasSizes.height);
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = Math.pow(2, -10);

    //render.
    this.ngZone.runOutsideAngular(() => {
      const animateGeometry = () => {
        if (animationMixer) {
          animationMixer.update(clock.getDelta());
        }
        // Render
        renderer.render(scene, camera);

        window.requestAnimationFrame(animateGeometry);
      };

      animateGeometry();
    });
  }
}
