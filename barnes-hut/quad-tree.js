import * as THREE from "three";
import { Galaxy } from "../objects/galaxy";
import { Z_POSITION } from "../config/sceneConfig";

const COORDINATES_SIZE = Z_POSITION * 2; // = DISTANCE FROM CENTER TO EDGE * 2

class QuadTreeNode {
  constructor(data) {
    this.data = data;
    this.mass = 0;
    this.ne = null;
    this.nw = null;
    this.se = null;
    this.sw = null;
  }
}

class QuadTree {
  constructor(head= null) {
    this.head = head;
  }
}

const checkIfInBounds = (star, quadrant) => {
  return (
    star.position.x > quadrant.botL.x &&
    star.position.x < quadrant.botR.x &&
    star.position.y > quadrant.botL.y &&
    star.position.y < quadrant.topL.y
  );
};

const generate4QuadrantCorners = (center, currentGridSize) => {
  let topL = new THREE.Vector3(
    center.x - currentGridSize,
    center.y + currentGridSize,
    center.z
  );
  let topR = new THREE.Vector3(center.x, center.y + currentGridSize, center.z);
  let botL = new THREE.Vector3(center.x - currentGridSize, center.y, center.z);
  let botR = new THREE.Vector3(center.x, center.y, center.z);
  let subQuadCenter = new THREE.Vector3(
    center.x - currentGridSize / 2,
    center.y + currentGridSize / 2,
    center.z
  );

  let quad1 = {
    topL,
    topR,
    botL,
    botR,
    subQuadCenter,
  };

  topL = new THREE.Vector3(center.x, center.y + currentGridSize, center.z);
  topR = new THREE.Vector3(
    center.x + currentGridSize,
    center.y + currentGridSize,
    center.z
  );
  botL = new THREE.Vector3(center.x, center.y, center.z);
  botR = new THREE.Vector3(center.x + currentGridSize, center.y, center.z);
  subQuadCenter = new THREE.Vector3(
    center.x + currentGridSize / 2,
    center.y + currentGridSize / 2,
    center.z
  );

  let quad2 = {
    topL,
    topR,
    botL,
    botR,
    subQuadCenter,
  };

  topL = new THREE.Vector3(center.x - currentGridSize, center.y, center.z);
  topR = new THREE.Vector3(center.x, center.y, center.z);
  botL = new THREE.Vector3(
    center.x - currentGridSize,
    center.y - currentGridSize,
    center.z
  );
  botR = new THREE.Vector3(center.x, center.y - currentGridSize, center.z);
  subQuadCenter = new THREE.Vector3(
    center.x - currentGridSize / 2,
    center.y - currentGridSize / 2,
    center.z
  );

  let quad3 = {
    topL,
    topR,
    botL,
    botR,
    subQuadCenter,
  };

  topL = new THREE.Vector3(center.x, center.y, center.z);
  topR = new THREE.Vector3(center.x + currentGridSize, center.y, center.z);
  botL = new THREE.Vector3(center.x, center.y - currentGridSize, center.z);
  botR = new THREE.Vector3(
    center.x + currentGridSize,
    center.y - currentGridSize,
    center.z
  );
  subQuadCenter = new THREE.Vector3(
    center.x + currentGridSize / 2,
    center.y - currentGridSize / 2,
    center.z
  );

  let quad4 = {
    topL,
    topR,
    botL,
    botR,
    subQuadCenter,
  };

  return [quad1, quad2, quad3, quad4];
};

const getMassOfElement = (element) => {
  return element.getMass();
};

const buildQuadTree = (
  elements,
  currentGridSize,
  currentCenter,
  needSplit,
  currentQuadrant,
  quadrants,
  currentNode
) => {
  let completedNode = null;

  while (currentQuadrant < 4) {
    if (needSplit) {
      quadrants = generate4QuadrantCorners(currentCenter, currentGridSize);
      needSplit = false;
    }

    let foundIdx = elements.findIndex((star) => {
      return checkIfInBounds(star, quadrants[currentQuadrant]);
    });

    let node = null;

    if (foundIdx !== -1) {
      let foundStar = elements[foundIdx];
      let mass = getMassOfElement(foundStar);
      elements.splice(foundIdx, 1);
      node = new QuadTreeNode(foundStar);

      if (currentQuadrant == 0 && currentNode.ne == null) {
        currentNode.ne = node;
        currentNode.ne.mass += mass
        currentNode.mass += mass
        continue;
      } else if (currentQuadrant == 0 && currentNode.ne != null) {
        //Add again star and previous node
        elements.unshift(foundStar);
        elements.unshift(currentNode.ne.data);
        currentNode.ne = new QuadTreeNode(null, 0);
        //Need split
        completedNode = buildQuadTree(
          elements,
          currentGridSize / 2,
          quadrants[currentQuadrant].subQuadCenter,
          true,
          0,
          quadrants,
          currentNode.ne
        );
        currentQuadrant++;
        continue;
      }

      if (currentQuadrant == 1 && currentNode.nw == null) {
        currentNode.nw = node;
        currentNode.nw.mass += mass;
        currentNode.mass += mass;
        continue;
      } else if (currentQuadrant == 1 && currentNode.nw != null) {
        //Add again star and previous node
        elements.unshift(foundStar);
        elements.unshift(currentNode.nw.data);
        currentNode.nw = new QuadTreeNode(null, 0);

        //Need split
        completedNode = buildQuadTree(
          elements,
          currentGridSize / 2,
          quadrants[currentQuadrant].subQuadCenter,
          true,
          0,
          quadrants,
          currentNode.nw
        );
        currentQuadrant++;
        continue;
      }

      if (currentQuadrant == 2 && currentNode.se == null) {
        currentNode.se = node;
        currentNode.se.mass += mass;
        currentNode.mass += mass;
        continue;
      } else if (currentQuadrant == 2 && currentNode.se != null) {
        //Add again star and previous node
        elements.unshift(foundStar);
        elements.unshift(currentNode.se.data);
        currentNode.se = new QuadTreeNode(null, 0);

        //Need split
        completedNode = buildQuadTree(
          elements,
          currentGridSize / 2,
          quadrants[currentQuadrant].subQuadCenter,
          true,
          0,
          quadrants,
          currentNode.se
        );
        currentQuadrant++;
        continue;
      }

      if (currentQuadrant == 3 && currentNode.sw == null) {
        currentNode.sw = node;
        currentNode.sw.mass += mass;
        currentNode.mass += mass;
        continue;
      } else if (currentQuadrant == 3 && currentNode.sw != null) {
        //Add again star and previous node
        elements.unshift(foundStar);
        elements.unshift(currentNode.sw.data);
        currentNode.sw = new QuadTreeNode(null, 0);
        //Need split
        completedNode = buildQuadTree(
          elements,
          currentGridSize / 2,
          quadrants[currentQuadrant].subQuadCenter,
          true,
          0,
          quadrants,
          currentNode.sw
        );
        currentQuadrant++;
        continue;
      }
      continue;
    } else {
      currentQuadrant++;
      continue;
    }
  }

  // Update parent node mass
  let neMass = currentNode.ne?.mass || 0;
  let nwMass = currentNode.nw?.mass || 0;
  let seMass = currentNode.se?.mass || 0;
  let swMass = currentNode.sw?.mass || 0;

  currentNode.mass = neMass + nwMass + seMass + swMass;
  // While ended because 4 quadrants completed, return to previous iteration
  return currentNode;
};

export const generateQuadTree = (galaxy) => {
  let currentGridSize = COORDINATES_SIZE;
  let currentCenter = new THREE.Vector3(0, 0, 0);
  let elements = [...galaxy.stars, ...galaxy.planets];
  let needSplit = false;
  let currentQuadrant = 0;
  let currentNode = new QuadTreeNode(null);

  currentGridSize /= 2;
  let quadrants = generate4QuadrantCorners(currentCenter, currentGridSize);

  // debugger;
  const qt = buildQuadTree(
    elements,
    currentGridSize,
    currentCenter,
    needSplit,
    currentQuadrant,
    quadrants,
    currentNode
  );
  let quadTree = new QuadTree(qt);
  console.log(quadTree);
  return qt;
};
