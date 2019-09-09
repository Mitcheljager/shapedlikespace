document.addEventListener("turbolinks:load", function() {
  const actions = document.querySelectorAll("[data-action='input-dropdown-set-value']")

  if (!actions.length) return

  actions.forEach(action => action.removeEventListener("click", setInputDropdownValue))
  actions.forEach(action => action.addEventListener("click", setInputDropdownValue))
})

function setInputDropdownValue() {
  event.preventDefault()

  const parentElement = this.closest("[data-role='dropdown']")
  const inputElement = parentElement.querySelector("[data-role='input-dropdown-input']")
  const valueElement = parentElement.querySelector("[data-role='input-dropdown-value']")
  const unsetElement = parentElement.querySelector("[data-unset]")

  inputElement.value = this.dataset.unset != undefined ? "" : this.dataset.value
  valueElement.innerText = this.dataset.unset != undefined ? "..." : this.innerText

  unsetElement.classList.toggle("dropdown__item--is-visible", inputElement.value)
}
