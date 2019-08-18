import Sortable from "sortablejs"
import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"
import Rails from "@rails/ujs"
import Uploader from "uploader"

document.addEventListener("turbolinks:load", function() {
  bindDropzone()
  buildSortable()

  const form = document.querySelector("[data-role='post-form']")

  if (!form) return

  form.removeEventListener("submit", initiatePostForm)
  form.addEventListener("submit", initiatePostForm)
})

function bindDropzone() {
  const element = document.querySelector("[data-role='dropzone']")

  if (!element) return

  element.removeEventListener("dragover", dropzoneEnter)
  element.addEventListener("dragover", dropzoneEnter)

  element.removeEventListener("dragleave", dropzoneLeave)
  element.addEventListener("dragleave", dropzoneLeave)

  element.removeEventListener("drop", dropzoneDrop)
  element.addEventListener("drop", dropzoneDrop)
}

function dropzoneEnter(event) {
  event.preventDefault()
  this.classList.add("dropzone--is-active")
}

function dropzoneLeave(event) {
  this.classList.remove("dropzone--is-active")
}

async function dropzoneDrop(event) {
  event.preventDefault()

  this.classList.remove("dropzone--is-active")

  if (!event.dataTransfer.items) return

  for (var i = 0; i < event.dataTransfer.items.length; i++) {
    if (event.dataTransfer.items[i].kind === "file") {
      const file = event.dataTransfer.items[i].getAsFile()

      if (file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg") {
        readImage(file)
      } else if (file.name.endsWith(".stl")) {        
        readSTL(file)
      }
    }
  }
}

function readImage(file) {
  const reader = new FileReader()
  reader.readAsDataURL(file)

  reader.onload = event => {
    const image = new Image()
    image.src = event.target.result

    image.onload = () => {
      drawImageOnCanvas(image)
    }
  }
}

function readSTL(file) {
  const reader = new FileReader()
  reader.readAsDataURL(file)

  reader.onload = event => {
    drawSTLOnCanvas(file)

    new Uploader(file, "files")
  }
}

function drawImageOnCanvas(image) {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  canvas.width = 770
  canvas.height = 480

  if (image.height > image.width) {
    const scaleFactor = canvas.width / image.width
    image.width = canvas.width
    image.height = image.height * scaleFactor
  } else {
    const scaleFactor = canvas.height / image.height
    image.height = canvas.height
    image.width = image.width * scaleFactor
  }

  ctx.drawImage(image, (canvas.width / 2) - (image.width / 2), (canvas.height / 2) - (image.height / 2), image.width, image.height)

  ctx.canvas.toBlob(blob => {
    const filename =  Math.random().toString(36).substring(2, 15)
    const file = new File([blob], filename, {
      type: "image/jpg",
      quality: 0.85,
      lastModified: Date.now()
    })

    drawAndRenderThumbnail(image)
    new Uploader(file, "images")
  }, "image/jpg", 0.85)
}

function drawAndRenderThumbnail(image) {
  const thumbnailsElement = document.querySelector("[data-role~='form-image-thumbnails']")
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  canvas.width = 200
  canvas.height = 200

  if (image.height > image.width) {
    const scaleFactor = canvas.width / image.width
    image.width = canvas.width
    image.height = image.height * scaleFactor
  } else {
    const scaleFactor = canvas.height / image.height
    image.height = canvas.height
    image.width = image.width * scaleFactor
  }

  ctx.drawImage(image, (canvas.width / 2) - (image.width / 2), (canvas.height / 2) - (image.height / 2), image.width, image.height)

  const thumbnail = new Image()
  thumbnail.src = canvas.toDataURL("image/jpg")
  const thumbnailItem = document.createElement("div")
  thumbnailItem.classList.add("images-preview__item")
  thumbnailItem.append(thumbnail)

  thumbnailsElement.append(thumbnailItem)
}

function drawSTLOnCanvas(file) {
  const element = document.createElement("div")
  const camera = new THREE.PerspectiveCamera(50, 770 / 480, 0.1, 10000)
  const scene = new THREE.Scene()
  const material = new THREE.MeshNormalMaterial()
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  const manager = new THREE.LoadingManager()
  const loader = new STLLoader(manager)

  element.style.width = 770 + "px"
  element.style.height = 480 + "px"

  renderer.setSize(770, 480)
  renderer.setClearColor(0xecf0f2)

  const url = URL.createObjectURL(file)
  loader.load(url, function (geometry) {
    const mesh = new THREE.Mesh(geometry, material)

    mesh.scale.set(1, 1, 1)
    mesh.rotation.x = -1

    mesh.geometry.center()

    const boundingBox = new THREE.Box3().setFromObject(mesh)
    const size = boundingBox.getSize()
    const maxSize = Math.max(size.x, size.y)

    camera.position.z = maxSize * 2

    scene.add(mesh)

    element.appendChild(renderer.domElement)
    renderer.render(scene, camera)
  })

  manager.onLoad = function () {
    const canvas = element.querySelector("canvas")
    const ctx = canvas.getContext("webgl")

    ctx.canvas.toBlob(blob => {
      const filename =  Math.random().toString(36).substring(2, 15)
      const file = new File([blob], filename, {
        type: "image/jpg",
        lastModified: Date.now()
      })

      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = event => {
        const image = new Image()
        image.src = event.target.result

        image.onload = () => {
          drawAndRenderThumbnail(image)
          new Uploader(image, "images")
        }
      }
    }, "image/jpg", 0.85)
  }

  element.remove()
}

function buildSortable() {
  const element = document.querySelector("[data-role~='sortable']")

  if (!element) return

  const sortable = Sortable.create(element, {
    animation: 50
  })
}

function initiatePostForm(event) {

}
