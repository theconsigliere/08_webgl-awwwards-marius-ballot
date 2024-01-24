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
    this.pillard
    this.upVector = new THREE.Vector3(0, 1, 0)
    this.pillards = new THREE.Group()

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
      glb.scene.traverse((child) => {
        if (child.name === "Cylinder") {
          child.material = this.greyMatCap
        }

        if (child.name === "Base") {
          this.pillard = child
          this.pillard.material = this.blackMatCap
        }
      })
      this.computePositions()
    })
  }

  computePositions() {
    const sphereGeometry = new THREE.IcosahedronGeometry(2, 3)
    const sphereMaterial = this.greyMatCap
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    this.scene.add(sphere)

    let vertexArray = []

    // get all positions of vertices
    for (
      let i = 0;
      i < sphereGeometry.attributes.position.array.length;
      i += 3
    ) {
      const x = sphereGeometry.attributes.position.array[i]
      const y = sphereGeometry.attributes.position.array[i + 1]
      const z = sphereGeometry.attributes.position.array[i + 2]

      vertexArray.push(new THREE.Vector3(x, y, z))
    }

    // filter out duplicates in array for pillards positions

    let pillardPositions = []

    for (let i = 0; i < vertexArray.length; i++) {
      let doesAllreadyExist = false
      for (let j = 0; j < vertexArray.length; j++) {
        // if pillardPoisitions[j] is undefined, then it doesnt exist yet
        if (pillardPositions[j] === undefined) {
          break
        }

        if (
          pillardPositions[j].x === vertexArray[i].x &&
          pillardPositions[j].y === vertexArray[i].y &&
          pillardPositions[j].z === vertexArray[i].z
        ) {
          doesAllreadyExist = true
        }
      }

      if (!doesAllreadyExist) {
        pillardPositions.push(
          new THREE.Vector3(
            vertexArray[i].x,
            vertexArray[i].y,
            vertexArray[i].z
          )
        )

        const clone = this.pillard.clone()
        clone.scale.multiplyScalar(0.2)
        const positionVector = new THREE.Vector3(
          vertexArray[i].x,
          vertexArray[i].y,
          vertexArray[i].z
        )
        clone.position.copy(positionVector)

        // rotate pillards to face center of sphere
        clone.quaternion.setFromUnitVectors(
          this.upVector,
          positionVector.normalize()
        )
        this.pillards.add(clone)
      }
    }

    this.scene.add(this.pillards)
  }

  update(time) {
    let i = 0
    while (i < this.pillards.children.length) {
      this.pillards.children[i].children[0].position.y =
        (Math.sin(time * 25 + this.pillards.children[i].position.x) + 1) * 1.2
      i++
    }
  }

  bind() {}
  // methods
}
const _instance = new SpherePillards()
export default _instance
