import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three"

class Floor {
  constructor(parameters) {
    this.bind
    this.modelLoader = new GLTFLoader()
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

      this.floor.translateY(-3)

      this.scene.add(this.floor)
    })
  }

  update() {}

  bind() {}
  // methods
}
const _instance = new Floor()
export default _instance
