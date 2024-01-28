import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three"
import SoundReactor from "./SoundReactor.js"
import LoadingController from "./LoadingController.js"
import MyGUI from "../utils/MyGUI.js"

class SpherePillards {
  constructor(parameters) {
    this.bind()
    this.modelLoader = new GLTFLoader(LoadingController)
    this.textureLoader = new THREE.TextureLoader()
    this.params = {
      waveSpeed: 1,
      subDiv: 3,
      pillardsSize: 0.2,
    }
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

    const sphereFolder = MyGUI.addFolder("Sphere Pillards")
    sphereFolder.add(this.params, "waveSpeed", 0.01, 5).name("Wave Speed")
    sphereFolder
      .add(this.params, "pillardsSize", 0.01, 0.8)
      .name("Pillards Size")
      .onChange(() => {
        this.computePositions()
      })
    sphereFolder
      .add(this.params, "subDiv", 1, 5)
      .step(1)
      .name("Sphere Subdivisions")
      .onChange(() => {
        this.computePositions()
      })
  }

  computePositions() {
    // if sphere already exists, remove it (used for GUI)
    let ico

    this.scene.traverse((child) => {
      if (child.name === "Sphere") ico = child
    })

    if (ico) this.scene.remove(ico)

    const sphereGeometry = new THREE.IcosahedronGeometry(2, this.params.subDiv)
    const sphereMaterial = this.greyMatCap
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.name = "Sphere"
    this.scene.add(sphere)

    this.pillards.clear()

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
        clone.scale.multiplyScalar(this.params.pillardsSize)
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
    if (SoundReactor.isPlaying) {
      // music animation
      let i = 0
      while (i < this.pillards.children.length) {
        this.pillards.children[i].children[0].position.y =
          (SoundReactor.fdata[i] / 255) * 2.5
        i++
      }
    } else {
      // original animation

      let i = 0
      while (i < this.pillards.children.length) {
        this.pillards.children[i].children[0].position.y =
          (Math.sin(
            time * (5 * this.params.waveSpeed) +
              this.pillards.children[i].position.x
          ) +
            1) *
          1.2
        i++
      }
    }
  }

  bind() {
    this.computePositionsEvent = this.computePositions.bind(this)
    this.init = this.init.bind(this)
  }
  // methods
}
const _instance = new SpherePillards()
export default _instance
