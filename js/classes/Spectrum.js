import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as THREE from "three"
import MyGUI from "../utils/MyGUI.js"

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
        uWaveSpeed: {
          value: 0.1,
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

    const shaderFolder = MyGUI.addFolder("Spectrum Shader")
    shaderFolder
      .add(this.spectrumShaders.uniforms.uWaveSize, "value", 0, 1)
      .name("Wave Size")
    shaderFolder
      .add(this.spectrumShaders.uniforms.uWaveSpeed, "value", 0, 1)
      .name("Wave Speed")
    shaderFolder
      .add(this.spectrumShaders.uniforms.uWaveBorder, "value", 0, 1)
      .name("Wave Border")
    shaderFolder
      .addColor(this.spectrumShaders.uniforms.uBorderColour, "value")
      .name("Border Colour")

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
