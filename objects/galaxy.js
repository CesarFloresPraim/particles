import * as THREE from "three";
import { Star } from "./star";
import { Planet } from "./planet";
import { DEVIATION, NUM_PLANETS, NUM_STARS } from "../config/galaxyConfig";
import { Z_POSITION } from "../config/sceneConfig";

export class Galaxy {
  constructor(scene) {
    this.scene = scene;
    this.stars = this.generateObject(
      NUM_STARS,
      (pos, vel) => new Star(pos, vel)
    );
    this.planets = this.generateObject(
      NUM_PLANETS,
      (pos, vel) => new Planet(pos, vel)
    );
    // this.stars = this.generateStarTestObjects();
    // this.planets = this.generatePlanetTestObjects();

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

  gravity(quadTree) {
    let head = quadTree.head;

    const preOrderQuadTreeTraversal = (node) => {
      let force = new THREE.Vector3(0, 0, 0);

      if (node.ne != null) {
        //If planet or star
        
        if (node.ne.data != null) {
          force = computeForcesFromQuadTree(node.ne, head);
          node.ne.data.velocity.add(force);
          //node.ne.data.obj.velocity.add(force);
          // console.log(force, node.ne.data);
        }
        //Move this force
        preOrderQuadTreeTraversal(node.ne);
      }
      if (node.nw != null) {
        if (node.nw.data != null) {
          force = computeForcesFromQuadTree(node.nw, head);
          node.nw.data.velocity.add(force);
          //node.nw.data.obj.velocity.add(force);
          // console.log(force, node.nw.data);
        }
        preOrderQuadTreeTraversal(node.nw);
      }
      if (node.se != null) {
        if (node.se.data != null) {
          force = computeForcesFromQuadTree(node.se, head);
          node.se.data.velocity.add(force);
          //node.se.data.obj.velocity.add(force);
          // console.log(force , node.se.data);
        }
        preOrderQuadTreeTraversal(node.se);
      }
      if (node.sw != null) {
        if (node.sw.data != null) {
          force = computeForcesFromQuadTree(node.sw, head);
          node.sw.data.velocity.add(force);
          //node.sw.data.obj.velocity.add(force);
          // console.log(force, node.sw.data);
        }
        preOrderQuadTreeTraversal(node.sw);
      }
    };

    const getForceVector = (node, currentNode) => {
      let g = .005;
      let gmmr =
        (g * (node.mass * currentNode.mass)) /
        node.centerOfMass.distanceToSquared(currentNode.centerOfMass);
      const forceVector = new THREE.Vector3();
      forceVector.subVectors(node.centerOfMass, currentNode.centerOfMass);
      forceVector.normalize();
      forceVector.multiplyScalar(gmmr).multiplyScalar(-1);

      return forceVector;
    };

    const biggestRadius = (node1, node2) => {
      if (node1.data.getRadius() >= node2.data.getRadius()) {
        return node1.data.getRadius();
      }
      return node2.data.getRadius();
    };

    const computeForcesFromQuadTree = (node, currentNode) => {
      let s = null;
      let d = null;
      let deviation = null;
      let force = new THREE.Vector3(0, 0, 0);
      let acumForce = new THREE.Vector3(0, 0, 0);

      if (node == currentNode) {
        return acumForce;
      }

      //Is planet or star
      if (currentNode.data != null) {
        if (
          node.data.obj.position.distanceTo(currentNode.data.obj.position) >= biggestRadius(node, currentNode)*2
        ) {
          return getForceVector(node, currentNode);
        }
        //node.data.velocity.add(force);

        // Collision so 0 force
        return force;
      } else {
        //Is internal node so we compute deviation
        d = node.centerOfMass.distanceTo(currentNode.centerOfMass);
        s = currentNode.quadrantSize;
        //Compute S/D
        deviation = s / d;
        if (deviation < DEVIATION) {
          //Compute force
          force = getForceVector(node, currentNode);
          //node.data.velocity.add(force);
          return force;
          //Add force to currentNode
        } else {
          if (currentNode.ne != null) {
            acumForce.add(computeForcesFromQuadTree(node, currentNode.ne));
          }
          if (currentNode.nw != null) {
            acumForce.add(computeForcesFromQuadTree(node, currentNode.nw));
          }
          if (currentNode.se != null) {
            acumForce.add(computeForcesFromQuadTree(node, currentNode.se));
          }
          if (currentNode.sw != null) {
            acumForce.add(computeForcesFromQuadTree(node, currentNode.sw));
          }
        }
      }

      return acumForce;
    };

    preOrderQuadTreeTraversal(head);
  }

  generateStarTestObjects() {
    let objects = [];
    // objects.push(
    //   new Star(new THREE.Vector3(100, 100, 0), new THREE.Vector3(0, 0, 0))
    // );

    return objects;
  }

  generatePlanetTestObjects() {
    let objects = [];
    objects.push(
      new Planet(new THREE.Vector3(-20, 20, 0), new THREE.Vector3(0, 0, 0))
    );
    objects.push(
      new Planet(new THREE.Vector3(20, 20, 0), new THREE.Vector3(0, 0, 0))
    );
    // objects.push(
    //   new Planet(new THREE.Vector3(-100, 50, 0), new THREE.Vector3(0, 0, 0))
    // );
    // objects.push(
    //   new Planet(new THREE.Vector3(-200, 100, 0), new THREE.Vector3(0, 0, 0))
    // );
    // objects.push(
    //   new Planet(new THREE.Vector3(200, -100, 0), new THREE.Vector3(0, 0, 0))
    // );
    // objects.push(
    //   new Planet(new THREE.Vector3(50, -220, 0), new THREE.Vector3(0, 0, 0))
    // );
    return objects;
  }

  generateObject(num, generator) {
    let objects = [];
    for (let index = 0; index < num; index++) {
      // TODO: ADD GAUSS DISTRIBUTION
      let pos = new THREE.Vector3(
        Math.random() *
          (Z_POSITION - Z_POSITION * 0.2) *
          (Math.random() > 0.5 ? 1 : -1),
        Math.random() *
          (Z_POSITION - Z_POSITION * 0.2) *
          (Math.random() > 0.5 ? 1 : -1),
        //Math.random() * 400 * (Math.random() > 0.5 ? 1 : -1),
        0
      );
      let vel = new THREE.Vector3(
        Math.random()*2 * (Math.random() > 0.5 ? 1 : -1),
        Math.random()*2 * (Math.random() > 0.5 ? 1 : -1), //Math.random() * 400 * (Math.random() > 0.5 ? 1 : -1),
        0
      );
      let obj = generator(pos, vel);
      objects.push(obj);
    }
    return objects;

    // let objects = createArrayOfRandomPlanets(num);
    // console.log(objects);
    // return  objects
  }
}
