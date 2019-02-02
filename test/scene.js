const Display = require('../server/screen/display').default;
const Scene = require('../server/scene/scene').default;
const SceneObject = require('../server/scene/sceneObject').default;
const MarioSprite = require('./sprites/mario').default;

// Creating new display
const display = new Display();

// Creating scene
const scene = new Scene();

// Adding an object inline
scene.add(
  new SceneObject('mario', MarioSprite)
);

// Fetch added object with it's identifier
const mario = scene.get('mario');

mario.x = 32;
mario.y = 32;

// Center camera into object
scene.centerCameraInObject(mario, -6, 6);

//

const buffer = scene.buffer;
display.buffer = buffer;

//
console.log(display.screen);
console.log(" ");
console.log("Screen size:", scene._screenSize);
console.log("Scene size:", [scene.width, scene.height]);
console.log("Camera position:", scene.cameraPosition);
console.log("Mario position:", [mario.x, mario.y]);
console.log("Is Mario in viewport?", scene.isInViewport(mario));