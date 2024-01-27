import RAF from "../utils/RAF.js"

class SoundReactor {
  constructor(audioUrl) {
    this.ctx
    this.audio
    this.audioSource
    this.analyser
    this.fdata
    this.url = audioUrl

    this.bind()
  }

  init() {
    this.ctx = new AudioContext()
    this.audio = new Audio(this.url)
    this.audioSource = this.ctx.createMediaElementSource(this.audio)
    this.analyser = this.ctx.createAnalyser()
    this.analyser.smoothingTimeConstant = 0.8

    this.audioSource.connect(this.analyser)
    this.audioSource.connect(this.ctx.destination)
    this.fdata = new Uint8Array(this.analyser.frequencyBinCount)

    this.audio.play()
  }

  update() {
    this.analyser.getByteFrequencyData(this.fdata)
  }

  play() {
    this.audio.play()
    RAF.subscribe("soundReactorUpdate", this.update)
  }

  pause() {
    this.audio.pause()
    RAF.unsubscribe("soundReactorUpdate")
  }

  bind() {
    this.update = this.update.bind(this)
    this.init = this.init.bind(this)
  }
}

const _instance = new SoundReactor("../../assets/audio/justice-generator.mp3")
export default _instance
