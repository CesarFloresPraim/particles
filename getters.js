import { planetSizes} from './consts.js';

const getPlanetSize = (planet) => {
    return planet.geometry.parameters.radius;
}

const getPlanetDensity = (planet) => {
    return planet.density;
}

const getPlanetColor = (size) => {
    if(size < 1) return 0x0000ff;
    if(size < 2) return 0x00ff00;
    if(size < 3) return 0xff0000;
    if(size < 4) return 0x00ffff;
    if(size < 5) return 0x808080;
    if(size < 6) return 0xff00ff;
    if(size < 7) return 0x000000;
    if(size < 8) return 0xffffff;
    return 0x800000;
}

export {
    getPlanetSize,
    getPlanetColor,
    getPlanetDensity
}