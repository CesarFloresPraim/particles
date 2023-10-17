import * as THREE from "three";
import { Star } from "./star";
import { Planet } from "./planet";
import { NUM_PLANETS, NUM_STARS } from "../config/galaxyConfig";
import { Z_POSITION } from "../config/sceneConfig";

export class Galaxy {
  constructor(scene) {
    this.scene = scene;
    this.stars = this.generateObject(NUM_STARS, (pos) => new Star(pos));
    this.planets = this.generateObject(NUM_PLANETS, (pos) => new Planet(pos));

    this.stars.forEach((star) => star.toThreeObject(scene));
    this.planets.forEach((planet) => planet.toThreeObject(scene));
  }

  // updateScale(camera) {
  //   this.stars.forEach((star) => {
  //     star.updateScale(camera);
  //   });

  //   this.planets.forEach((planet) => {
  //     planet.updateScale(camera);
  //   });
  // }

  generateObject(num, generator) {
    let objects = [];
    for (let index = 0; index < num; index++) {
      // TODO: ADD GAUSS DISTRIBUTION
      let pos = new THREE.Vector3(
        Math.random() * (Z_POSITION-(Z_POSITION*.1)) * (Math.random() > 0.5 ? 1 : -1),
        Math.random() * (Z_POSITION-(Z_POSITION*.1))  * (Math.random() > 0.5 ? 1 : -1),
        //Math.random() * 400 * (Math.random() > 0.5 ? 1 : -1),
        0
      );
      let obj = generator(pos);
      objects.push(obj);
    }
    return objects;

    // let objects = createArrayOfRandomPlanets(num);
    // console.log(objects);
    // return  objects
  }
}
