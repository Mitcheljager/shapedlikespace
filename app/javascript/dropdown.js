document.addEventListener("turbolinks:load", function() {
  const elements = document.querySelectorAll("[data-action='toggle-dropdown-content']")

  if (!elements.length) return

  elements.forEach(element => element.removeEventListener("click", toggleDropdownContent))
  elements.forEach(element => element.addEventListener("click", toggleDropdownContent))

  document.removeEventListener("click", toggleDropdownViaDocument)
  document.addEventListener("click", toggleDropdownViaDocument)
})

function toggleDropdownContent(event) {
  if (!event.target.classList.contains("dropdown__item"))
    if (event.target.closest("[data-role~='dropdown-content']")) return

  if (event.target.href) event.preventDefault()

  const contentElement = this.querySelector("[data-role~='dropdown-content']")
  const currentActive = document.querySelector(".dropdown__content--is-active")

  if (currentActive) currentActive.classList.toggle("dropdown__content--is-active")
  if (currentActive != contentElement) contentElement.classList.toggle("dropdown__content--is-active")
}

function toggleDropdownViaDocument(event) {
  const currentActive = document.querySelector(".dropdown__content--is-active")

  if (!currentActive) return
  if (event.target.closest("[data-role~='dropdown']")) return

  currentActive.classList.remove("dropdown__content--is-active")
}
