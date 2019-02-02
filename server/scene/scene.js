'use strict';

const SceneObject = require('./sceneObject').default;

class Scene {
  constructor(width, height) {
    this._screenSize = [32, 32];
    this._sceneSize = [
      width || 64,
      height || width || 64
    ];
    this._cameraPosition = [
      Math.floor(this._screenSize[0] / 2),
      Math.floor(this._screenSize[1] / 2)
    ];
    this._objects = [];
  }

  _queryObject(query) {
    if (!query) return null;
    let object;
    if (typeof query === 'string') {
      object = this.get(query);
      if (!object) return null;
    } else if (query instanceof SceneObject) {
      object = query;
    } else return null;
    return object;
  }

  setScreenSize(width, height) {
    if (
      !Number.isInteger(width) ||
      !Number.isInteger(height) ||
      width < 0 ||
      height < 0 ||
      width % 2 === 1 ||
      height % 2 === 1
    ) return false;
    this._screenSize = [width, height];
    return this._screenSize;
  }

  get width() {
    return this._sceneSize[0];
  }

  set width(width) {
    if (!Number.isInteger(width) || width < 0) return false;
    this._sceneSize[0] = width;
    return width;
  }

  get height() {
    return this._sceneSize[0];
  }

  set height(height) {
    if (!Number.isInteger(height) || height < 0) return false;
    this._sceneSize[0] = height;
    return height;
  }

  get objects() {
    return this._objects;
  }

  add(object) {
    if (!object instanceof SceneObject) return false;
    const foundObjectId = this._objects.filter(obj => obj.id === object.id);
    if (foundObjectId.length > 0) return false;
    this._objects.push(object);
    return true;
  }

  addMany(objects) {
    if (!Array.isArray(objects)) return false;
    let count = 0;
    objects.map(object => {
      if (this.add(object))
        count++
    })
    return count;
  }

  get(id) {
    return this._objects.filter(object => object.id === id).pop();
  }

  remove(id) {
    if (!id) return false;
    const trimmedList = this._objects.filter(obj => obj.id !== object.id);
    if (trimmedList.length === this._objects.length) return false;
    this._objects = trimmedList;
    return true;
  }

  setCameraAt(x, y) {
    const screenDiffWidth = Math.floor(this._screenSize[0] / 2);
    const screenDiffHeight = Math.floor(this._screenSize[1] / 2);

    let cameraX = x;
    let cameraY = y;

    if (x < screenDiffWidth) cameraX = screenDiffWidth;
    else if (x > this.width - screenDiffWidth) cameraX = this.width - screenDiffWidth;

    if (y < screenDiffHeight) cameraY = screenDiffHeight;
    else if (y > this.height - screenDiffHeight) cameraY = this.width - screenDiffHeight;

    this._cameraPosition = [
      cameraX,
      cameraY
    ];
  }

  centerCameraInObject(query, offsetX, offsetY) {
    const object = this._queryObject(query);
    if (!object) return null;

    this.setCameraAt(
      object.x + Math.floor(object.width / 2) - (offsetX || 0),
      object.y + Math.floor(object.height / 2) - (offsetY || 0)
    )
  }

  get cameraPosition() {
    return this._cameraPosition;
  }

  isInViewport(query) {
    const object = this._queryObject(query);
    if (!object) return null;

    if (
      object.x === null ||
      object.y === null
    ) return false;

    const isInWidth = value => {
      const screenHalf = Math.floor(this._screenSize[0] / 2);
      const viewportMinWidth = this._cameraPosition[0] - screenHalf;
      const viewportMaxWidth = this._cameraPosition[0] + screenHalf;
      return value >= viewportMinWidth && value <= viewportMaxWidth;
    };

    const isInHeight = value => {
      const screenHalf = Math.floor(this._screenSize[1] / 2);
      const viewportMinHeight = this._cameraPosition[1] - screenHalf;
      const viewportMaxHeight = this._cameraPosition[1] + screenHalf;
      return value >= viewportMinHeight && value <= viewportMaxHeight;
    };

    let isVisible = false;
    for (let j = 0; j < object.height; j++) {
      for (let i = 0; i < object.width; i++) {
        if (isInWidth(object.x + i) && isInHeight(object.y + j)) {
          isVisible = true;
          break;
        }
      }
      if (isVisible) break;
    }
    return isVisible;
  }

  isInPixel(query, x, y) {
    const object = this._queryObject(query);
    if (!object) return null;

    if (
      object.x === null ||
      object.y === null
    ) return false;

    return (
      (
        x >= object.x &&
        x <= object.x + (object.width - 1)
      ) &&
      (
        y >= object.y &&
        y <= object.y + (object.height - 1)
      )
    );
  }

  get buffer() {
    // const SortByZ = (a, b) => a.z - b.z;
    const SortByZ = (a, b) => b.z - a.z;
    const sortedObjects = [].concat(this._objects).sort(SortByZ);

    const screenWidth = this._screenSize[0];
    const screenHeight = this._screenSize[1];

    const viewportStartWidth = this._cameraPosition[0] - Math.floor(screenWidth / 2);
    const viewportStartHeight = this._cameraPosition[1] - Math.floor(screenHeight / 2);

    const buffer = [];
    for (let layer = 0; layer <= 1; layer++) { // Background (0) and Foreground (1)
      // Get visible objects for the current layer
      const visibleObjects = sortedObjects
        .filter(obj => obj.layer === layer)
        .filter(obj => this.isInViewport(obj));

      buffer[layer] = [];
      for (let y = 0; y < screenHeight; y++) { // Runs through the height
        buffer[layer][y] = [];
        for (let x = 0; x < screenWidth; x++) { // Runs through the width
          // Apply filter to only get the objects presents in the current stage pixel location
          const objectsToRender = visibleObjects.filter(obj => (
            this.isInPixel(obj, viewportStartWidth + x, viewportStartHeight + y)
          ));

          // Prepare current pixel to be rendered
          const pixel = objectsToRender
            // Get the current pixel of all objects
            .map(obj => {
              const vpy = viewportStartHeight + y;
              const vpx = viewportStartWidth + x;
              const py = vpy - obj.y;
              const px = vpx - obj.x;
              const sprite = obj.sprite[py][px];
              return sprite;
            })
            // Maintain only the topmost non-transparent pixel
            .reduce((acc, cur) => acc || cur, 0);

          buffer[layer][y][x] = pixel;


          /*
          // always render only the topmost object at that coordinate, even if the pixel is transparent
          const objToRender = visibleObjects.filter(obj => this.isInPixel(obj, x, y)).shift();
          const pixel = objToRender.sprite[objToRender.y - viewportStartHeight + y][objToRender.x - viewportStartWidth + x];
          buffer[y][x] = pixel;
          */
        }
      }
    }
    return buffer;
  }
}

exports.default = Scene;
