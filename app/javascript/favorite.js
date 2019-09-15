import Rails from "@rails/ujs"

document.addEventListener("turbolinks:load", function() {
  const elements = document.querySelectorAll("[data-action='favorite-wrapper']")

  if (!elements.length) return

  elements.forEach(element => element.removeEventListener("click", clickFavorite))
  elements.forEach(element => element.addEventListener("click", clickFavorite))
})

function clickFavorite(event) {
  event.preventDefault()

  const form = this.querySelector("form")
  Rails.fire(form, "submit")
}
