import * as THREE from "three";
import { createPlanet, createArrayOfRandomPlanets, createSuns } from "./creators";
import { computeForce } from "./computations";
import { randomIntFromInterval } from "./helpers";
import { addVelocityFromForce, setVelocity } from "./setters";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 500;


const circles = createArrayOfRandomPlanets(100);
const suns = createSuns(1);

circles.push(...suns);

const addCirclesToScene = (circles) => {
  circles.forEach((circle) => {
    circle.matrixAutoUpdate = false;
    scene.add(circle);
  });
};



addCirclesToScene(circles);

function animate() {
  requestAnimationFrame(animate);

  // Set random velocity in random direction as a Vector3
  circles.forEach((circle) => {
    circle.position.add(circle.velocity);
  });

  // Compute interaction between all particles
  circles.forEach((circle) => {
    circles.forEach((circle2) => {
      if (circle !== circle2) {
        computeForce(circle, circle2, scene);
        //addVelocityFromForce(forces)
  
      }
    });
  });

  circles.forEach((circle) => {
    circle.updateMatrix();
  });

  //computeForce(circles[0], circles[1]);

  renderer.render(scene, camera);
}

animate();
