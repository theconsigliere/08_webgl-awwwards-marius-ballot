import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three"

import LoadingController from "./LoadingController.js"

class Floor {
  constructor(parameters) {
    this.bind
    this.modelLoader = new GLTFLoader(LoadingController)
    // constructor body
  }

  init(scene) {
    this.scene = scene
    this.floor

    this.modelLoader.load("../assets/models/floor.glb", (glb) => {
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          this.floor = child
        }
      })

      this.floor.translateY(-4)
      this.floor.scale.multiplyScalar(1.5)

      this.scene.add(this.floor)
    })
  }

  update() {}

  bind() {}
  // methods
}
const _instance = new Floor()
export default _instance
