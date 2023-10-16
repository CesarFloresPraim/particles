import * as THREE from "three";
import { Galaxy } from "../objects/galaxy";

const COORDINATES_SIZE = 800; // = DISTANCE FROM CENTER TO EDGE * 2

class QuadTreeNode {
  constructor(data, level) {
    this.data = data;
    this.level = level;
    this.mass = 0;
    this.ne = null;
    this.nw = null;
    this.se = null;
    this.sw = null;
  }
}

class QuadTree {
  constructor() {
    this.level = 0;
    this.mass = 0;
    this.ne = null;
    this.nw = null;
    this.se = null;
    this.sw = null;
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

let maxDepth = 20;
const buildQuadTree = (
  stars,
  currentGridSize,
  currentCenter,
  quadTree,
  needSplit,
  currentQuadrant,
  quadrants,
  currentNode
) => {
  maxDepth -= 1;
  if (maxDepth <= 0) {
    console.log("ended fake");
    return;
  }
  while (currentQuadrant < 4) {
    if (needSplit) {
      quadrants = generate4QuadrantCorners(currentCenter, currentGridSize);
      needSplit = false;
    }

    let foundIdx = stars.findIndex((star) => {
      return checkIfInBounds(star, quadrants[currentQuadrant]);
    });

    let node = null;

    if (foundIdx !== -1) {
      let foundStar = stars[foundIdx];
      stars.splice(foundIdx, 1);
      node = new QuadTreeNode(foundStar, quadTree.level + 1);

      if (currentQuadrant == 0 && currentNode.ne == null) {
        currentNode.ne = node;
        currentNode.mass += 1;
        continue;
      } else if (currentQuadrant == 0 && currentNode.ne != null) {
        console.log({
          currentStar: foundStar,
          previousStar: currentNode.ne.data,
          quadrant: currentQuadrant,
          stars: [...stars]
        });
        //Add again star and previous node
        stars.unshift(stars[foundIdx]);
        stars.unshift(currentNode.ne.data);
        currentNode.ne = new QuadTreeNode(null, 0);
        //Need split
        buildQuadTree(
          stars,
          currentGridSize / 2,
          quadrants[currentQuadrant].subQuadCenter,
          quadTree,
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
        currentNode.mass += 1;
        continue;
      } else if (currentQuadrant == 1 && currentNode.nw != null) {
        console.log({
          currentStar: foundStar,
          previousStar: currentNode.nw.data,
          quadrant: currentQuadrant,
          stars: [...stars]

        });
        //Add again star and previous node
        stars.unshift(stars[foundIdx]);
        stars.unshift(currentNode.nw.data);
        currentNode.nw = new QuadTreeNode(null, 0);

        //Need split
        buildQuadTree(
          stars,
          currentGridSize / 2,
          quadrants[currentQuadrant].subQuadCenter,
          quadTree,
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
        currentNode.mass += 1;
        continue;
      } else if (currentQuadrant == 2 && currentNode.se != null) {
        console.log({
          currentStar: foundStar,
          previousStar: currentNode.se.data,
          quadrant: currentQuadrant,
          stars: [...stars]

        });
        //Add again star and previous node
        stars.unshift(stars[foundIdx]);
        stars.unshift(currentNode.se.data);
        currentNode.se = new QuadTreeNode(null, 0);

        //Need split
        buildQuadTree(
          stars,
          currentGridSize / 2,
          quadrants[currentQuadrant].subQuadCenter,
          quadTree,
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
        currentNode.mass += 1;
        continue;
      } else if (currentQuadrant == 3 && currentNode.sw != null) {
        console.log({
          currentStar: foundStar,
          previousStar: currentNode.sw.data,
          quadrant: currentQuadrant,
          stars: [...stars]
        });
        //Add again star and previous node
        stars.unshift(stars[foundIdx]);
        stars.unshift(currentNode.sw.data);
        currentNode.sw = new QuadTreeNode(null, 0);
        //Need split
        buildQuadTree(
          stars,
          currentGridSize / 2,
          quadrants[currentQuadrant].subQuadCenter,
          quadTree,
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
  // While ended because 4 quadrants completed, return to previous iteration
  return currentNode;
};

export const generateQuadTree = (galaxy) => {
  let currentGridSize = COORDINATES_SIZE;
  let currentCenter = new THREE.Vector3(0, 0, 0);
  let quadTree = new QuadTree();
  let stars = [...galaxy.stars];
  let needSplit = false;
  let currentQuadrant = 0;
  let currentNode = new QuadTreeNode(null, 0);

  currentGridSize /= 2;
  let quadrants = generate4QuadrantCorners(currentCenter, currentGridSize);

  const qt = buildQuadTree(
    stars,
    currentGridSize,
    currentCenter,
    quadTree,
    needSplit,
    currentQuadrant,
    quadrants,
    currentNode
  );
  console.log("ended", qt);
};
