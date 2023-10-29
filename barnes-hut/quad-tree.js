import * as THREE from "three";
import { Galaxy } from "../objects/galaxy";
import { Z_POSITION } from "../config/sceneConfig";
import { MAX_QUADRANT_CHILDREN } from "../config/quadTreeConfig";

const COORDINATES_SIZE = Z_POSITION * 2; // = DISTANCE FROM CENTER TO EDGE * 2

class QuadTreeNode {
  constructor(data) {
    this.data = data;
    this.mass = 0;
    this.centerOfMass = new THREE.Vector3();
    this.ne = null;
    this.nw = null;
    this.se = null;
    this.sw = null;
  }
}

class QuadTree {
  constructor(head = null) {
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
      node.quadrantSize = currentGridSize;

      if (currentQuadrant == 0 && currentNode.ne == null) {
        currentNode.ne = node;
        currentNode.ne.mass += mass;
        currentNode.ne.centerOfMass = foundStar.position;
        currentNode.mass += mass;

        continue;
      } else if (currentQuadrant == 0 && currentNode.ne != null) {
        //Add again star and previous node
        elements.unshift(foundStar);
        elements.unshift(currentNode.ne.data);
        currentNode.ne = new QuadTreeNode(null, 0);
        //Need split
        buildQuadTree(
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
        currentNode.nw.centerOfMass = foundStar.position;
        currentNode.mass += mass;

        continue;
      } else if (currentQuadrant == 1 && currentNode.nw != null) {
        //Add again star and previous node
        elements.unshift(foundStar);
        elements.unshift(currentNode.nw.data);
        currentNode.nw = new QuadTreeNode(null, 0);

        //Need split
        buildQuadTree(
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
        currentNode.se.centerOfMass = foundStar.position;
        currentNode.mass += mass;

        continue;
      } else if (currentQuadrant == 2 && currentNode.se != null) {
        //Add again star and previous node
        elements.unshift(foundStar);
        elements.unshift(currentNode.se.data);
        currentNode.se = new QuadTreeNode(null, 0);

        //Need split
        buildQuadTree(
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
        currentNode.sw.centerOfMass = foundStar.position;
        currentNode.mass += mass;

        continue;
      } else if (currentQuadrant == 3 && currentNode.sw != null) {
        //Add again star and previous node
        elements.unshift(foundStar);
        elements.unshift(currentNode.sw.data);
        currentNode.sw = new QuadTreeNode(null, 0);
        //Need split
        buildQuadTree(
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

  let x = 0;
  let y = 0;
  let z = 0;

  x =
    ((currentNode.ne?.centerOfMass.x || 0) * neMass +
      (currentNode.nw?.centerOfMass.x || 0) * nwMass +
      (currentNode.se?.centerOfMass.x || 0) * seMass +
      (currentNode.sw?.centerOfMass.x || 0) * swMass) /
    currentNode.mass;
  y =
    ((currentNode.ne?.centerOfMass.y || 0) * neMass +
      (currentNode.nw?.centerOfMass.y || 0) * nwMass +
      (currentNode.se?.centerOfMass.y || 0) * seMass +
      (currentNode.sw?.centerOfMass.y || 0) * swMass) /
    currentNode.mass;
  z =
    ((currentNode.ne?.centerOfMass.z || 0) * neMass +
      (currentNode.nw?.centerOfMass.z || 0) * nwMass +
      (currentNode.se?.centerOfMass.z || 0) * seMass +
      (currentNode.sw?.centerOfMass.z || 0) * swMass) /
    currentNode.mass;

  currentNode.centerOfMass = new THREE.Vector3(x, y, z);

  currentNode.quadrantSize = currentGridSize;
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
  return quadTree;
};
// -----------------

class QuadT {
  constructor(head) {
    this.head = head;
  }
}

class QuadN {
  constructor() {
    this.data = [];
    this.mass = 0;
    this.centerOfMass = new THREE.Vector3();
    this.quadrantSize = null;
    this.ne = null;
    this.nw = null;
    this.se = null;
    this.sw = null;
  }
}

export const generateQuadTree2 = (galaxy) => {
  let currentGridSize = COORDINATES_SIZE;
  let currentCenter = new THREE.Vector3(0, 0, 0);
  let elements = [...galaxy.stars, ...galaxy.planets];
  let currentNode = new QuadN();

  // debugger;
  const qt = buildQuadTree2(
    elements,
    currentGridSize,
    currentCenter,
    currentNode
  );
  let quadTree = new QuadT(qt);
  return quadTree;
};

const buildQuadTree2 = (
  elements,
  currentGridSize,
  currentCenter,
  currentNode
) => {
  let neElements = [];
  let nwElements = [];
  let seElements = [];
  let swElements = [];

  if (elements.length > MAX_QUADRANT_CHILDREN) {
    //* Needs Split

    currentGridSize /= 2;
    let quadrants = generate4QuadrantCorners(currentCenter, currentGridSize);

    elements.forEach((element) => {
      if (checkIfInBounds(element, quadrants[0])) {
        neElements.push(element);
        return;
      }
      if (checkIfInBounds(element, quadrants[1])) {
        nwElements.push(element);
        return;
      }
      if (checkIfInBounds(element, quadrants[2])) {
        seElements.push(element);
        return;
      }
      if (checkIfInBounds(element, quadrants[3])) {
        swElements.push(element);
        return;
      }
    });

    currentNode.ne = new QuadN();
    currentNode.nw = new QuadN();
    currentNode.se = new QuadN();
    currentNode.sw = new QuadN();

    if (neElements.length == 0) {
      currentNode.ne = null;
    } else {
      currentNode.ne = buildQuadTree2(
        neElements,
        currentGridSize,
        quadrants[0].subQuadCenter,
        currentNode.ne
      );
    }

    if (nwElements.length == 0) {
      currentNode.nw = null;
    } else {
      currentNode.nw = buildQuadTree2(
        nwElements,
        currentGridSize,
        quadrants[1].subQuadCenter,
        currentNode.nw
      );
    }

    if (seElements.length == 0) {
      currentNode.se = null;
    } else {
      currentNode.se = buildQuadTree2(
        seElements,
        currentGridSize,
        quadrants[2].subQuadCenter,
        currentNode.se
      );
    }

    if (swElements.length == 0) {
      currentNode.sw = null;
    } else {
      currentNode.sw = buildQuadTree2(
        swElements,
        currentGridSize,
        quadrants[3].subQuadCenter,
        currentNode.sw
      );
    }


    //Update parent node mass and center of mass
    let mass =
      (currentNode.ne?.mass || 0) +
      (currentNode.nw?.mass || 0) +
      (currentNode.se?.mass || 0) +
      (currentNode.sw?.mass || 0);
    currentNode.mass = mass;


    let xNe = currentNode.ne?.centerOfMass.x || 0;
    let yNe = currentNode.ne?.centerOfMass.y || 0;
    let zNe = currentNode.ne?.centerOfMass.z || 0;

    let xNw = currentNode.nw?.centerOfMass.x || 0;
    let yNw = currentNode.nw?.centerOfMass.y || 0;
    let zNw = currentNode.nw?.centerOfMass.z || 0;

    let xSe = currentNode.se?.centerOfMass.x || 0;
    let ySe = currentNode.se?.centerOfMass.y || 0;
    let zSe = currentNode.se?.centerOfMass.z || 0;

    let xSw = currentNode.sw?.centerOfMass.x || 0;
    let ySw = currentNode.sw?.centerOfMass.y || 0;
    let zSw = currentNode.sw?.centerOfMass.z || 0;

    let massNe = currentNode.ne?.mass || 0;
    let massNw = currentNode.nw?.mass || 0;
    let massSe = currentNode.se?.mass || 0;
    let massSw = currentNode.sw?.mass || 0;

    currentNode.centerOfMass = new THREE.Vector3(
      (xNe * massNe + xNw * massNw + xSe * massSe + xSw * massSw) /
        currentNode.mass,
      (yNe * massNe + yNw * massNw + ySe * massSe + ySw * massSw) /
        currentNode.mass,
      (zNe * massNe + zNw * massNw + zSe * massSe + zSw * massSw) /
        currentNode.mass
    );

    currentNode.quadrantSize = currentGridSize;

  } else {
    // Update node data
    currentNode.data = elements;
    currentNode.mass = nodeMass(currentNode);
    currentNode.centerOfMass = nodeCenterOfMass(currentNode);

  }

  return currentNode;
};

const nodeMass = (node) => {
  return node.data.reduce((acc, element) => {
    return acc + element.getMass();
  }, 0);
};

const nodeCenterOfMass = (node) => {
  let x = 0;
  let y = 0;
  let z = 0;

  for (let i = 0; i < node.data.length; i++) {
    x += node.data[i].position.x * node.data[i].getMass();
    y += node.data[i].position.y * node.data[i].getMass();
    z += node.data[i].position.z * node.data[i].getMass();
  }

  x /= node.mass;
  y /= node.mass;
  z /= node.mass;

  return new THREE.Vector3(x, y, z);
};
