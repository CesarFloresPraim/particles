import * as THREE from "three";
import { planetTypes } from "../config/planetConfig";
import { BLOOM_LAYER, STAR_MAX, STAR_MIN } from "../config/renderConfig";
import { clamp, } from "../utils.js";

const texture = new THREE.TextureLoader().load("../resources/planetSprite.png");
const material = new THREE.SpriteMaterial({ map: texture })

export class Planet {
  constructor(position, velocity) {
    this.type = this.generatetype();
    this.position = position;
    this.velocity = velocity;
    this.mass = Math.random() * 1000 + 100;
    this.radius = Math.random() * 7 + 1.5
    this.obj = null;
  }

//   updateScale(camera) {
//     let dist = this.position.distanceTo(camera.position) / 250;

//     // update planet size
//     let planetSize = dist * planetTypes.size[this.type];
//     planetSize = clamp(planetSize, STAR_MIN, STAR_MAX);
//     this.obj?.scale.copy(new THREE.Vector3(planetSize, planetSize, planetSize));

//   }

  getMass() {
    return this.mass
  }

  getRadius() {
    return this.radius
  }

  generatetype() {
    let num = Math.random() * 100.0;
    let pct = planetTypes.percentage;
    for (let i = 0; i < pct.length; i++) {
      num -= pct[i];
      if (num < 0) {
        return i;
      }
    }
    return 0;
  }

  toThreeObject(scene) {
    let sprite = new THREE.Sprite(material);
    // sprite.layers.set(BLOOM_LAYER);

    sprite.scale.multiplyScalar(this.radius);
    sprite.position.copy(this.position);

    this.obj = sprite;

    scene.add(sprite);
  }
}
