import * as THREE from "three";

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

const createCircle = (radius, color) => {
  const geometry = new THREE.CircleGeometry(radius, 32);
  const material = new THREE.MeshBasicMaterial({ color });
  const circle = new THREE.Mesh(geometry, material);
  return circle;
};

const setRandomPosition = (circle) => {
  circle.position.x =
    Math.random() +
    (Math.random() > 0.5 ? Math.random() * 200 : -Math.random() * 200);
  circle.position.y =
    Math.random() +
    (Math.random() > 0.5 ? Math.random() * 200 : -Math.random() * 200);
};

const createArrayOfRandomCircles = (number) => {
  const circles = [];
  for (let i = 0; i < number; i++) {
    const circleColor = 0xffffff;

    const circle = createCircle(Math.random() * 3, circleColor);
    setRandomPosition(circle);
    setInitialVelocity(circle);
    circles.push(circle);
  }
  // let circle = createCircle(0.01, 0x00ff00);
  // setRandomPosition(circle);
  // circles.push(circle);
  // circle = createCircle(0.1, 0xff0000);
  // setRandomPosition(circle);
  // circles.push(circle);

  return circles;
};

// const mergeObjects = (circle, circle2, first) => {
//   const newRadius =
//     (first
//       ? circle.geometry.parameters.radius
//       : circle2.geometry.parameters.radius) +
//     Math.random() * 0.02;

//   if (first) {
//     circle.geometry = new THREE.CircleGeometry(newRadius, 32);
//     scene.remove(circle2);
//     circles.splice(circles.indexOf(circle2), 1);
//   } else {
//     circle2.geometry = new THREE.CircleGeometry(newRadius, 32);
//     scene.remove(circle);
//     circles.splice(circles.indexOf(circle), 1);
//   }
// };

const addCirclesToScene = (circles) => {
  circles.forEach((circle) => {
    circle.matrixAutoUpdate = false;
    scene.add(circle);
  });
};

const computeAttraction = (circle, circle2) => {
  const distance = circle.position.distanceTo(circle2.position);

  if(distance > 50) return;

  const radiusSum =
    circle.geometry.parameters.radius + circle2.geometry.parameters.radius;

  // When particles touch then bigger particle absorbs smaller one
  if (distance < radiusSum) {
    return;
    // let first =
    //   circle.geometry.parameters.radius > circle2.geometry.parameters.radius
    //     ? true
    //     : false;
    // mergeObjects(circle, circle2, first);
  }

  const circleArea = Math.PI * circle.geometry.parameters.radius ** 2;
  const circle2Area = Math.PI * circle2.geometry.parameters.radius ** 2;

  const gmmr = (0.005 * (circle2Area * circleArea)) / (distance * distance);

  const force = new THREE.Vector3();
  force.subVectors(circle2.position, circle.position);
  force.normalize();
  force.multiplyScalar(gmmr);

  circle.velocity.add(force);

  const force2 = new THREE.Vector3();
  force2.subVectors(circle.position, circle2.position);
  force2.normalize();
  force2.multiplyScalar(gmmr);

  circle2.velocity.add(force2);
};

const setInitialVelocity = (circle) => {
  circle.velocity = new THREE.Vector3(
    Math.random() * (Math.random() > 0.05 ? 0.01 : -0.01),
    Math.random() * (Math.random() > 0.05 ? 0.01 : -0.01),
    0
  );
};

const circles = createArrayOfRandomCircles(500);

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Sun
const createSuns = (number) => {
  for (let i = 0; i < number; i++) {
    const circleColor = 0xffff00;
    const circle = createCircle(randomIntFromInterval(3, 9), circleColor);

    circle.position.x =
      Math.random() +
      (Math.random() > 0.5 ? Math.random() * 300 : -Math.random() * 300);
    circle.position.y =
      Math.random() +
      (Math.random() > 0.5 ? Math.random() * 300 : -Math.random() * 300);

    circle.velocity = new THREE.Vector3(0, 0, 0);

    circles.push(circle);
  }
};

createSuns(6);

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
        computeAttraction(circle, circle2);
      }
    });
  });

  circles.forEach((circle) => {
    circle.updateMatrix();
  });

  //computeAttraction(circles[0], circles[1]);

  renderer.render(scene, camera);
}

animate();
