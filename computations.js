import { Vector3, CircleGeometry } from "three";
import { planetDensities } from "./consts";
import { getPlanetDensity, getPlanetSize } from "./getters";

const computeMass = (circle) => {
  const volume = (4 / 3) * Math.PI * getPlanetSize(circle) ** 3;
  const mass = volume * getPlanetDensity(circle);
  return mass;
};

const computeForce = (circle, circle2, scene) => {
  const distance = circle.position.distanceTo(circle2.position);


  const radiusSum =
    circle.geometry.parameters.radius + circle2.geometry.parameters.radius;

  // When particles touch then bigger particle absorbs smaller one
  if (distance < radiusSum) {
    return
  }

  const circleMass = computeMass(circle);
  const circle2Mass = computeMass(circle2);

  const gmmr = (105 * (circleMass * circle2Mass)) / (distance * distance);

  const force = new Vector3();
  force.subVectors(circle2.position, circle.position);
  force.normalize();
  force.multiplyScalar(gmmr);

  if(circle.type === "sun" && circle2.type === "sun") {
    return
  }

  if(circle.type === "sun") {
    circle2.velocity.add(force.multiplyScalar(-1));
    return
  }

  if(circle2.type === "sun") {
    circle.velocity.add(force);
    return
  }


    circle.velocity.add(force);
    circle2.velocity.add(force.multiplyScalar(-1));



//   return [
//     {
//       circle: circle,
//       force: circle.type === "sun" ? force : force.multiplyScalar(-1),
//     },
//     {
//       circle: circle2,
//       force: circle.type === "sun" ? force2 : force2.multiplyScalar(-1),
//     },
//   ];
};

export { computeForce };
