import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import MyGUI from "./utils/MyGUI.js"
import config from "./utils/config.js"
import gsap from "gsap"

import SpherePillards from "./classes/SpherePillards.js"
import Floor from "./classes/Floor.js"
import Spectrum from "./classes/Spectrum.js"
import SoundReactor from "./classes/SoundReactor.js"
import ParticleSystem from "./classes/ParticleSystem.js"
import CameraParallax from "./classes/CameraParallax.js"
import LoadingController from "./classes/LoadingController.js"

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene()

    this.audioButton = options.dom.audioButton
    this.loadingScreen = options.dom.loadingScreen
    this.loadingNumberText = options.dom.loadingNumberText
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

    this.loading()
    this.addObjects()
    this.resize()
    this.render()
    this.setupResize()
    this.addEventListeners()
    this.settings()
  }

  loading() {
    LoadingController.onLoad = () => {
      this.loadingScreen.classList.add("is-loaded")
    }

    LoadingController.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = itemsLoaded / itemsTotal
      this.loadingNumberText.textContent = `${Math.round(progress * 100)}`
    }
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
    // set orbit controls

    this.controls.enabled = false
    this.controls.maxDistance = 40 // stops zooming too far out
    this.controls.minDistance = 3 // stops zooming too far in

    // stop orbit controls from moving too low (beneath floor)
    this.controls.minPolarAngle = 0
    this.controls.maxPolarAngle = Math.PI / 2 + 0.3

    // add fog to scene so we dont see the edges of the floor

    const backgroundColour = new THREE.Color(0x151515)
    this.scene.background = backgroundColour
    this.scene.fog = new THREE.Fog(backgroundColour, 15, 30)

    MyGUI.hide()

    if (config.myGui) MyGUI.show()

    const cameraFolder = MyGUI.addFolder("Camera")
    cameraFolder
      .add(this.controls, "enabled")
      .name("Orbit Controls")
      .onChange(() => {
        if (this.controls.enabled) CameraParallax.active = false
      })
      .listen()
    cameraFolder
      .add(CameraParallax, "active")
      .name("Camera Parallax")
      .onChange(() => {
        if (CameraParallax.active) this.controls.enabled = false
      })
      .listen()

    cameraFolder
      .add(CameraParallax.params, "intensity", 0.001, 0.1)
      .name("Parallax Intensity")
    cameraFolder
      .add(CameraParallax.params, "ease", 0.001, 0.1)
      .name("Parallax Ease")
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
    CameraParallax.init(this.camera)
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

    // rotate scene slowly over time
    this.scene.rotation.y += 0.001

    SpherePillards.update(this.time)
    ParticleSystem.update()
    Spectrum.update(this.time)
    CameraParallax.update()
  }
}

new Sketch({
  dom: {
    container: document.getElementById("container"),
    audioButton: document.querySelector(".js-audio-button"),
    loadingScreen: document.querySelector(".js-loading-screen"),
    loadingNumberText: document.querySelector(".js-loading-text"),
  },
})
