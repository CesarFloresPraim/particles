import { Galaxy } from "../objects/galaxy";

const X_SIZE = 400;
const Y_SIZE = 400;

class QuadTreeNode {
  constructor(data) {
    this.data = data;
    this.ne = null;
    this.nw = null;
    this.se = null;
    this.sw = null;
  }
}

class QuadTree {
    constructor(head=null) {
        this.head = head;
    }
}

export const generateQuadTree = (galaxy) => {
  let quadTree = new QuadTree();
  console.log(galaxy.stars);
};


