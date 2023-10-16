import * as THREE from "three";
import { Star } from "./star";

export class Galaxy {
  constructor(scene) {
    this.scene = scene;
    this.stars = this.generateObject(250, (pos) => new Star(pos));
    this.suns = [];

    this.stars.forEach((star) => star.toThreeObject(scene));
  }

  updateScale(camera) {
    this.stars.forEach((star) => {
      star.updateScale(camera);
    });
  }

  generateObject(num, generator) {
    let objects = [];
    for (let index = 0; index < num; index++) {
      // TODO: ADD GAUSS DISTRIBUTION
      let pos = new THREE.Vector3(
        Math.random() * 400 * (Math.random() > 0.5 ? 1 : -1),
        Math.random() * 400 * (Math.random() > 0.5 ? 1 : -1),
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
