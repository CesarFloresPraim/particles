import { Vector3 } from "three";

const setRandomPosition = (circle) => {
  circle.position.x =
    Math.random() +
    (Math.random() > 0.5 ? Math.random() * 350 : -Math.random() * 350);
  circle.position.y =
    Math.random() +
    (Math.random() > 0.5 ? Math.random() * 350 : -Math.random() * 350);
};

const setColor = (circle, color) => {
  circle.material.color.setHex(color);
};

const setInitialVelocity = (circle) => {
    circle.velocity = new Vector3(
      Math.random() * 500 * (Math.random() > 0.5 ? 0.01 : -0.01),
      Math.random() * 500 * (Math.random() > 0.5 ? 0.01 : -0.01),
      0
    );
};

const addVelocityFromForce = (forces) => {
  if (!forces) return;
  forces.forEach((force) => {
    force.circle.velocity.add(force.force);
  });
};

const setVelocity = (circle, velocity) => {
  circle.velocity = velocity;
};

export {
  setRandomPosition,
  setInitialVelocity,
  setColor,
  addVelocityFromForce,
  setVelocity,
};
