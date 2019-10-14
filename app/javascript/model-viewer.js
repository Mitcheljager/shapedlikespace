import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

class ModelViewer {
  constructor(element, src) {
    this.element = element
    this.src = src

    this.camera, this.scene, this.renderer, this.controls, this.geometry, this.material, this.mesh

    this.buildModelViewer()
  }

  buildModelViewer() {
    const elementWidth = this.element.offsetWidth
    const elementHeight = Math.round(this.element.offsetWidth / 16 * 10 - 1)

    this.element.style.height = elementHeight + "px"

    this.camera = new THREE.PerspectiveCamera(50, elementWidth / elementHeight, 0.1, 10000)
    this.scene = new THREE.Scene()
    this.material = new THREE.MeshNormalMaterial()

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(elementWidth, elementHeight)
    this.renderer.setClearColor(0x1a1d23, 0)

    const loader = new STLLoader()
    loader.load(this.src,
      loaded => { this.onLoad(loaded) },
      progress => { this.onProgress(progress) },
      error => { this.onError(error) }
    )

    this.element.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.addControlsToWebViewer()
  }

  onLoad(loaded) {
    this.mesh = new THREE.Mesh(loaded, this.material)
    this.mesh.scale.set(1, 1, 1)
    this.mesh.rotation.x = -1
    this.mesh.geometry.center()

    const boundingBox = new THREE.Box3().setFromObject(this.mesh)
    const size = boundingBox.getSize()
    const maxSize = Math.max(size.x, size.y)

    this.camera.position.z = maxSize * 2

    this.scene.add(this.mesh)

    let progressElement = this.element.querySelector("[data-progress]")
    if (progressElement) progressElement.remove()
  }

  onProgress(progress) {
    let progressElement = this.element.querySelector("[data-progress]")

    if (!progressElement) {
      progressElement = document.createElement("div")
      progressElement.classList.add("model-viewer__progress")

      const progressBarElement = document.createElement("div")
      progressBarElement.classList.add("model-viewer__progress-bar")

      progressElement.append(progressBarElement)
      this.element.prepend(progressElement)
    }

    const progressPercentage = Math.round((100 / progress.total) * progress.loaded)
    progressElement.setAttribute("data-progress", `${ progressPercentage }%`)
    progressElement.querySelector(".model-viewer__progress-bar").style.width = `${ progressPercentage }%`
  }

  onError(error) {
    alert("Something has gone wrong when trying to load the model. Please refresh the page and try again.")
  }

  addControlsToWebViewer() {
    requestAnimationFrame(this.addControlsToWebViewer.bind(this))
    this.controls.update()

    this.renderer.render(this.scene, this.camera)
  }
}

export default ModelViewer
