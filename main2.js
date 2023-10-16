import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { Galaxy } from "./objects/galaxy";

let camera, scene, renderer, controls, orbit;
let galaxy;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 500;
  scene.add(camera);

  // Create Galaxy
  galaxy = new Galaxy(scene);

  // Helpers
  //scene.add(new THREE.GridHelper(400, 100));
  scene.add(new THREE.AxesHelper(100));

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Orbit Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 16384;
  controls.maxPolarAngle = Math.PI / 2 - Math.PI / 360;
  controls.update();


  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  galaxy.updateScale(camera);

  //console.log(galaxy.stars[0]);

  renderer.render(scene, camera);
}

init();
animate();
