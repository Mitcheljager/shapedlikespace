import Siema from "siema"

let carousel;

document.addEventListener("turbolinks:load", function() {
  const element = document.querySelector("[data-role='carousel']")
  carousel = new Siema({
    selector: element,
    onInit: setActiveItem,
    onChange: setActiveItem
  })

  const navigationElements = document.querySelectorAll("[data-action='carousel-go-to']")

  navigationElements.forEach((element) => element.removeEventListener("click", carouselGoTo))
  navigationElements.forEach((element) => element.addEventListener("click", carouselGoTo))
})

function carouselGoTo() {
  const target = this.dataset.target

  carousel.goTo(target)
}

function setActiveItem() {
  const navigationElements = document.querySelectorAll("[data-action='carousel-go-to']")
  const activeElement = document.querySelector(".carousel__item--is-active")

  if (activeElement) activeElement.classList.remove("carousel__item--is-active")
  navigationElements[this.currentSlide].classList.add("carousel__item--is-active")
}
