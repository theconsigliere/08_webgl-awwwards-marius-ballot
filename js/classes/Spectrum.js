import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three"

import spectrumFragmentShader from "../shaders/spectrumFragment.glsl"
import spectrumVertexShader from "../shaders/spectrumVertex.glsl"

class Spectrum {
  constructor(parameters) {
    this.bind
    this.modelLoader = new GLTFLoader()
    this.textureLoader = new THREE.TextureLoader()
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
        uMatCap: {
          value: this.textureLoader.load("../assets/textures/gunMetal.png"),
        },
        uWaveSize: {
          value: 0.6,
        },
        uWaveBorder: {
          value: 0.1,
        },
        uBorderColour: {
          value: new THREE.Color("hsl(287, 80%, 80%)"),
        },
      },
      transparent: true,
    })

    this.modelLoader.load("../assets/models/spectrum.glb", (glb) => {
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          this.spectrum = child
          this.spectrum.material = this.spectrumShaders
          this.spectrum.scale.multiplyScalar(2.5)
          this.spectrum.position.y = -2.5
        }
      })

      this.scene.add(this.spectrum)
    })
  }

  update() {
    this.spectrumShaders.uniforms.uTime.value += 1
  }

  bind() {}
  // methods
}
const _instance = new Spectrum()
export default _instance
