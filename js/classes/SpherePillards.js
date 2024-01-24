import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three"

class SpherePillards {
  constructor(parameters) {
    this.bind
    this.modelLoader = new GLTFLoader()
    this.textureLoader = new THREE.TextureLoader()
    // constructor body
  }

  init(scene) {
    this.scene = scene

    const greyTexture = this.textureLoader.load(
      "../assets/textures/gunMetal.png"
    )
    const blackTexture = this.textureLoader.load(
      "../assets/textures/blackMetal.png"
    )

    this.greyMatCap = new THREE.MeshMatcapMaterial({
      matcap: greyTexture,
    })

    this.blackMatCap = new THREE.MeshMatcapMaterial({
      matcap: blackTexture,
    })

    this.modelLoader.load("../assets/models/pillard.glb", (glb) => {
      this.pillard = glb.scene
      this.pillard.traverse((child) => {
        if (child.name === "Cylinder") {
          child.material = this.greyMatCap
        }

        if (child.name === "Base") {
          child.material = this.blackMatCap
        }
      })
      this.scene.add(this.pillard)
    })
  }

  update() {}

  bind() {}
  // methods
}
const _instance = new SpherePillards()
export default _instance
