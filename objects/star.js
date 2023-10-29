import * as THREE from "three";
import { starTypes } from "../config/starsConfig";
import { BLOOM_LAYER, STAR_MAX, STAR_MIN } from "../config/renderConfig";
import { clamp } from "../utils.js";

const texture = new THREE.TextureLoader().load("../resources/sprite120.png");
const material = new THREE.SpriteMaterial({ map: texture, color: 0xffff00 })


export class Star {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.mass = Math.random() * 5000 + 1000;
    this.radius = Math.random() * 20 + 8;
    this.obj = null;
  }

  // updateScale(camera) {
  //   let dist = this.position.distanceTo(camera.position) / 250;

  //   // update star size
  //   let starSize = dist * starTypes.size[this.type];
  //   starSize = clamp(starSize, STAR_MIN, STAR_MAX);
  //   this.obj?.scale.copy(new THREE.Vector3(starSize, starSize, starSize));

  // }

  getMass() {
    return this.mass;
  }

  getRadius() {
    return this.radius;
  }

  generatetype() {
    let num = Math.random() * 100.0;
    let pct = starTypes.percentage;
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
