import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import gui from "lil-gui"
import gsap from "gsap"

import SpherePillards from "./classes/SpherePillards.js"
import Floor from "./classes/Floor.js"
import Spectrum from "./classes/Spectrum.js"
import SoundReactor from "./classes/SoundReactor.js"
import ParticleSystem from "./classes/ParticleSystem.js"

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene()

    this.audioButton = options.dom.audioButton
    this.container = options.dom.container
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.width, this.height)

    this.renderer.setClearColor(0x000000, 1)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 10)
    // this.camera.lookAt(0, 0, 0)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.time = 0

    this.isPlaying = true
    this.audioIsInit = false

    this.addObjects()
    this.resize()
    this.render()
    this.setupResize()
    this.addEventListeners()
    // this.settings();
  }

  addEventListeners() {
    this.audioButton.addEventListener("click", (e) => {
      if (!this.audioIsInit) {
        SoundReactor.init()
        this.audioIsInit = true
      }

      if (SoundReactor.isPlaying) {
        e.currentTarget.textContent = "Play"
        SoundReactor.pause()
        return
      }

      e.currentTarget.textContent = "Pause"
      SoundReactor.play()
    })
  }

  settings() {
    this.settings = {
      progress: 0,
    }
    this.gui = new dat.GUI()
    this.gui.add(this.settings, "progress", 0, 1, 0.01)
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this))
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addObjects() {
    // Sphere Pillards
    SpherePillards.init(this.scene)
    Floor.init(this.scene)
    Spectrum.init(this.scene)
    ParticleSystem.init(this.scene)
  }

  stop() {
    this.isPlaying = false
  }

  play() {
    if (!this.isPlaying) {
      this.render()
      this.isPlaying = true
    }
  }

  render() {
    if (!this.isPlaying) return
    this.time += 0.01

    // this.material.uniforms.time.value = this.time
    requestAnimationFrame(this.render.bind(this))
    this.renderer.render(this.scene, this.camera)
    SpherePillards.update(this.time)
    ParticleSystem.update()
    Spectrum.update(this.time)
  }
}

new Sketch({
  dom: {
    container: document.getElementById("container"),
    audioButton: document.querySelector(".js-audio-button"),
  },
})
