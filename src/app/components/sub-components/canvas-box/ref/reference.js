import * as THREE from "https://threejs.org/build/three.module.js";

import Stats from "https://threejs.org/examples/jsm/libs/stats.module.js";
import { GUI } from "https://threejs.org/examples/jsm/libs/dat.gui.module.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";
import { RenderPass } from "https://threejs.org/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://threejs.org/addons/postprocessing/UnrealBloomPass.js";

let camera, stats;
let composer, renderer, mixer, clock;

const params = {
  exposure: 1,
  bloomStrength: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0,
};

init();

function init() {
  const container = document.getElementById("container");

  stats = new Stats();
  container.appendChild(stats.dom);

  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ReinhardToneMapping;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    100
  );
  camera.position.set(-5, 2.5, -3.5);
  scene.add(camera);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.minDistance = 1;
  controls.maxDistance = 10;

  scene.add(new THREE.AmbientLight(0x404040));

  const pointLight = new THREE.PointLight(0xffffff, 1);
  camera.add(pointLight);

  const renderScene = new RenderPass(scene, camera);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  new GLTFLoader().load(
    "https://threejs.org/examples/models/gltf/PrimaryIonDrive.glb",
    function (gltf) {
      const model = gltf.scene;

      scene.add(model);

      mixer = new THREE.AnimationMixer(model);
      const clip = gltf.animations[0];
      mixer.clipAction(clip.optimize()).play();

      animate();
    }
  );

  const gui = new GUI();

  gui.add(params, "exposure", 0.1, 2).onChange(function (value) {
    renderer.toneMappingExposure = Math.pow(value, 4.0);
  });

  gui.add(params, "bloomThreshold", 0.0, 1.0).onChange(function (value) {
    bloomPass.threshold = Number(value);
  });

  gui.add(params, "bloomStrength", 0.0, 3.0).onChange(function (value) {
    bloomPass.strength = Number(value);
  });

  gui
    .add(params, "bloomRadius", 0.0, 1.0)
    .step(0.01)
    .onChange(function (value) {
      bloomPass.radius = Number(value);
    });

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  composer.setSize(width, height);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  mixer.update(delta);

  stats.update();

  composer.render();
}
