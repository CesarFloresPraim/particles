import { CircleGeometry, MeshBasicMaterial, Mesh, Vector3 } from "three";
import { setRandomPosition, setInitialVelocity } from "./setters";
import { randomFromArray, randomIntFromInterval } from "./helpers";
import { getPlanetColor } from "./getters";
import { planetDensities, planetSizes } from "./consts.js";

const createPlanet = (radius, color, density, type) => {
  const geometry = new CircleGeometry(radius, 32);
  const material = new MeshBasicMaterial({ color });
  const circle = new Mesh(geometry, material);
  circle.density = density;
  circle.type = type;
  return circle;
};

const createArrayOfRandomPlanets = (number) => {
  const circles = [];
  for (let i = 0; i < number; i++) {
    const radius = randomFromArray(planetSizes);
    const color = getPlanetColor(radius);
    const circle = createPlanet(
      radius,
      color,
      randomFromArray(planetDensities),
      "planet"
    );
    setRandomPosition(circle);

    setInitialVelocity(circle);
    circles.push(circle);
  }
  return circles;
};

const createSuns = (number) => {
  let suns = [];
  for (let i = 0; i < number; i++) {
    const circleColor = 0xffff00;
    const circle = createPlanet(
      20,
      circleColor,
      10,
      "sun"
    );
    setRandomPosition(circle);

    circle.velocity = new Vector3(0, 0, 0);

    suns.push(circle);
  }
  return suns;
};

export { createPlanet, createArrayOfRandomPlanets, createSuns };
