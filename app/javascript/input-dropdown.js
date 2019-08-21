document.addEventListener("turbolinks:load", function() {
  const elements = document.querySelectorAll("[data-action='toggle-input-dropdown-content']")
  const actions = document.querySelectorAll("[data-action='input-dropdown-set-value']")

  if (!elements.length) return

  elements.forEach(element => element.removeEventListener("click", toggleInputDropdownContent))
  elements.forEach(element => element.addEventListener("click", toggleInputDropdownContent))

  actions.forEach(action => action.removeEventListener("click", setInputDropdownValue))
  actions.forEach(action => action.addEventListener("click", setInputDropdownValue))
})

function toggleInputDropdownContent(event) {
  const contentElement = this.querySelector("[data-role='input-dropdown-content']")
  const currentActive = document.querySelector(".input-dropdown__content--is-active")

  if (currentActive) currentActive.classList.toggle("input-dropdown__content--is-active")
  if (currentActive != contentElement) contentElement.classList.toggle("input-dropdown__content--is-active")
}

function setInputDropdownValue() {
  event.preventDefault()

  const parentElement = this.closest("[data-role='input-dropdown']")
  const inputElement = parentElement.querySelector("[data-role='input-dropdown-input']")
  const valueElement = parentElement.querySelector("[data-role='input-dropdown-value']")
  const unsetElement = parentElement.querySelector("[data-unset]")

  inputElement.value = this.dataset.unset != undefined ? "" : this.dataset.value
  valueElement.innerText = this.dataset.unset != undefined ? "..." : this.innerText

  unsetElement.classList.toggle("input-dropdown__item--is-active", inputElement.value)
}
