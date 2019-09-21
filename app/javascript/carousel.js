import Siema from "siema"
import ModelViewer from "model-viewer"

let carousel;

document.addEventListener("turbolinks:load", function() {
  const element = document.querySelector("[data-role='carousel']")

  if (!element) return

  carousel = new Siema({
    selector: element,
    onInit: setActiveItem,
    onChange: setActiveItem
  })

  const navigationElements = document.querySelectorAll("[data-action='carousel-go-to']")
  navigationElements.forEach((element) => element.removeEventListener("click", carouselGoTo))
  navigationElements.forEach((element) => element.addEventListener("click", carouselGoTo))

  const modelViewerActions = document.querySelectorAll("[data-action='set-model-viewer']")
  modelViewerActions.forEach((element) => element.removeEventListener("click", setModelViewer))
  modelViewerActions.forEach((element) => element.addEventListener("click", setModelViewer))
})

function carouselGoTo() {
  const target = this.dataset.target

  carousel.goTo(target)
  unsetModelViewer()
}

function setActiveItem() {
  const navigationElements = document.querySelectorAll("[data-action='carousel-go-to']")
  const activeElement = document.querySelector(".carousel__navigation-item--is-active")

  if (activeElement) activeElement.classList.remove("carousel__navigation-item--is-active")
  if (navigationElements.length) navigationElements[this.currentSlide].classList.add("carousel__navigation-item--is-active")

  setLazyImage(this)
}

function setLazyImage(element) {
  const slides = []
  slides.push(element.innerElements[element.currentSlide - 1])
  slides.push(element.innerElements[element.currentSlide])
  slides.push(element.innerElements[element.currentSlide + 1])

  slides.forEach(slide => {
    if (!slide) return

    const sources = slide.querySelectorAll("source, img")

    sources.forEach(source => {
      if (source.dataset.src) {
        source.src = source.dataset.src
      } else if (source.dataset.srcset) {
        source.srcset = source.dataset.srcset
      }
    })
  })
}

function setModelViewer() {
  const carouselElement = document.querySelector(".carousel__wrapper")
  const modelViewerElement = document.querySelector("[data-role='model-viewer']")

  modelViewerElement.innerHTML = ""
  modelViewerElement.dataset.src = this.dataset.src
  modelViewerElement.classList.add("model-viewer--is-active")

  carouselElement.classList.add("carousel__wrapper--is-inactive")

  const modelViewer = new ModelViewer(modelViewerElement, modelViewerElement.dataset.src)
}

function unsetModelViewer() {
  const carouselElement = document.querySelector(".carousel__wrapper")
  const modelViewerElement = document.querySelector("[data-role='model-viewer']")
  const canvas = modelViewerElement.querySelector("canvas")

  if (!canvas) return

  canvas.remove()
  carouselElement.classList.remove("carousel__wrapper--is-inactive")
  modelViewerElement.classList.remove("model-viewer--is-active")
}
