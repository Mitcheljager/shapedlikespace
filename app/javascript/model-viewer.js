import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let camera, scene, renderer, controls, geometry, material, mesh

document.addEventListener("turbolinks:load", function() {
  const elements = document.querySelectorAll("[data-role='model-viewer']")

  elements.forEach(element => { buildModelViewer(element) })
})

function buildModelViewer(element, controllable = true) {
  const elementWidth = element.offsetWidth
  const elementHeight = element.offsetWidth / 16 * 10

  element.style.height = elementHeight + "px"

  camera = new THREE.PerspectiveCamera(50, elementWidth / elementHeight, 0.1, 10000)

  scene = new THREE.Scene()

  material = new THREE.MeshNormalMaterial()

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(elementWidth, elementHeight)
  renderer.setClearColor(0xecf0f2)

  const loader = new STLLoader()
  loader.load("/uploads/models/6gon_bowl.stl", function (geometry) {
    const mesh = new THREE.Mesh(geometry, material)

    mesh.scale.set(1, 1, 1)
    mesh.rotation.x = -1

    mesh.geometry.center()

    const boundingBox = new THREE.Box3().setFromObject(mesh)
    const size = boundingBox.getSize()
    const maxSize = Math.max(size.x, size.y)

    camera.position.z = maxSize * 2

    scene.add(mesh)
  })

  element.appendChild(renderer.domElement)

  if (!controllable) return

  controls = new OrbitControls(camera, renderer.domElement)

  addControlsToWebViewer()
}

function addControlsToWebViewer() {
  requestAnimationFrame(addControlsToWebViewer)
  controls.update()

  renderer.render(scene, camera)
}
