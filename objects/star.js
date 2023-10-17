import * as THREE from "three";
import { starTypes } from "../config/starsConfig";
import { BLOOM_LAYER, STAR_MAX, STAR_MIN } from "../config/renderConfig";
import { clamp } from "../utils.js";

const texture = new THREE.TextureLoader().load("../resources/sprite120.png");
const materials = starTypes.color.map(
  (color) => new THREE.SpriteMaterial({ map: texture, color: color })
);

export class Star {
  constructor(position) {
    this.type = this.generatetype();
    this.position = position;
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
    return starTypes.mass[this.type];
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
    let sprite = new THREE.Sprite(materials[this.type]);
    // sprite.layers.set(BLOOM_LAYER);

    sprite.scale.multiplyScalar(starTypes.size[this.type]);
    sprite.position.copy(this.position);

    this.obj = sprite;

    scene.add(sprite);
  }
}
