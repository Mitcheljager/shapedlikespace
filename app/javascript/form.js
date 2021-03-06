import Sortable from "sortablejs"
import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"
import Rails from "@rails/ujs"
import Uploader from "uploader"

document.addEventListener("turbolinks:load", function() {
  bindDropzone()
  buildSortable()
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
      } else if (file.name.endsWith(".stl") || file.name.endsWith(".STL")) {
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
  }
}

function drawImageOnCanvas(image) {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  canvas.width = 770
  canvas.height = 480

  let scaleFactor = canvas.width / image.width
  image.width = canvas.width
  image.height = image.height * scaleFactor

  if (image.height < canvas.height) {
    scaleFactor = canvas.width / image.width
    image.height = canvas.height
    image.width = image.width * scaleFactor
  }

  ctx.drawImage(image, (canvas.width / 2) - (image.width / 2), (canvas.height / 2) - (image.height / 2), image.width, image.height)

  ctx.canvas.toBlob(blob => {
    const filename =  Math.random().toString(36).substring(2, 15) + ".jpeg"
    const file = new File([blob], filename, {
      type: "image/jpeg",
      quality: 0.95,
      lastModified: Date.now()
    })

    const uploader = new Uploader(file, "images")

    uploader.upload().then(() => {
      const interval = setInterval(() => {
        if (uploader.blob == "") return
        clearInterval(interval)

        drawAndRenderThumbnail(image, uploader.blob.id)
      }, 100)
    })

  }, "image/jpeg", 0.95)
}

function drawAndRenderThumbnail(image, imageId) {
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
  thumbnail.src = canvas.toDataURL("image/png")
  const thumbnailItem = document.createElement("div")
  thumbnailItem.classList.add("images-preview__item")
  thumbnailItem.dataset.id = imageId
  thumbnailItem.append(thumbnail)

  thumbnailsElement.append(thumbnailItem)

  updateSortable()
}

function drawSTLOnCanvas(file) {
  const element = document.createElement("div")
  const camera = new THREE.PerspectiveCamera(50, 770 / 480, 0.1, 10000)
  const scene = new THREE.Scene()
  const material = new THREE.MeshNormalMaterial()
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  const manager = new THREE.LoadingManager()
  const loader = new STLLoader(manager)

  element.style.width = 770 + "px"
  element.style.height = 480 + "px"

  renderer.setSize(770, 480)
  renderer.setClearColor(0x1a1d23, 0)

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
      const filename =  Math.random().toString(36).substring(2, 15) + ".png"
      const image = new File([blob], filename, {
        type: "image/png",
        quality: 1,
        lastModified: Date.now()
      })

      addToFileList(file)

      const promise = new Promise(resolve => uploadSTLFiles(file, image, resolve))

      promise.then(data => {
        const reader = new FileReader()
        reader.readAsDataURL(image)

        reader.onload = event => {
          const thumbnail = new Image()
          thumbnail.src = event.target.result

          thumbnail.onload = () => {
            drawAndRenderThumbnail(thumbnail, data)
          }
        }
      })
    }, "image/png", 1)
  }

  element.remove()
}

async function uploadSTLFiles(file, image, resolve) {
  const promises = [
    new Promise(resolve => createUploaderPromise(file, "files", resolve)),
    new Promise(resolve => createUploaderPromise(image, "images", resolve))
  ]

  Promise.all(promises).then(data => {
    const fileAssociationsField = document.querySelector("input[name*='file_associations']")
    const value = fileAssociationsField.value ? JSON.parse(fileAssociationsField.value) : []
    value.push({ "stl": data[0].id, "image": data[1].id })

    fileAssociationsField.value = JSON.stringify(value)

    resolve(data[1].id)
  })
}

async function createUploaderPromise(file, type, resolve) {
  const uploader = new Uploader(file, type)

  uploader.upload().then(() => {
    const interval = setInterval(() => {
      if (uploader.blob == "") return
      clearInterval(interval)

      resolve(uploader.blob)
    }, 100)
  })
}

function buildSortable() {
  const element = document.querySelector("[data-role~='sortable']")

  if (!element) return

  const sortable = Sortable.create(element, {
    animation: 50,
    onUpdate: () => { updateSortable() }
  })
}

function addToFileList(file) {
  const fileListElement = document.querySelector("[data-role='file-list']")

  const newElement = document.createElement("div")
  newElement.classList.add("file-list__item")
  newElement.setAttribute("data-file", file.name)
  newElement.innerText = file.name

  fileListElement.append(newElement)
}

function updateSortable() {
  const element = document.querySelector("[data-role*='form-image-thumbnails']")
  const items = [...element.querySelectorAll(".images-preview__item")]
  const array = items.map(item => parseInt(item.dataset.id))

  const input = document.querySelector("input[name*='image_order']")
  input.value = JSON.stringify(array)
}
