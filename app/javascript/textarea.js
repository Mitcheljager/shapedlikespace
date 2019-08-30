document.addEventListener("turbolinks:load", function() {
  const elements = document.querySelectorAll("[data-role='resizing-textarea']")

  if (!elements.length) return

  elements.forEach(element => element.removeEventListener("input", () => { resizeTextarea(element) }))
  elements.forEach(element => element.addEventListener("input", () => { resizeTextarea(element) }))

  elements.forEach(element => { resizeTextarea(element) })
})

function resizeTextarea(element) {
  element.style.height = "300px";
  element.style.height = (element.scrollHeight) + "px";
}
