import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three"

import spectrumFragmentShader from "../shaders/spectrumFragment.glsl"
import spectrumVertexShader from "../shaders/spectrumVertex.glsl"

class Spectrum {
  constructor(parameters) {
    this.bind
    this.modelLoader = new GLTFLoader()
    // constructor body
  }

  init(scene) {
    this.scene = scene
    this.spectrum

    this.spectrumShaders = new THREE.ShaderMaterial({
      vertexShader: spectrumVertexShader,
      fragmentShader: spectrumFragmentShader,
      uniforms: {
        uTime: { value: 0 },
      },
    })

    this.modelLoader.load("../assets/models/spectrum.glb", (glb) => {
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          this.spectrum = child
          this.spectrum.material = this.spectrumShaders
          this.spectrum.scale.multiplyScalar(3)
          this.spectrum.position.y = 1
        }
      })

      this.scene.add(this.spectrum)
    })
  }

  update() {}

  bind() {}
  // methods
}
const _instance = new Spectrum()
export default _instance
