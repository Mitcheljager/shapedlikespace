document.addEventListener("turbolinks:load", function() {
  const element = document.querySelector("[data-role='filter']")

  if (!element) return

  element.removeEventListener("submit", submitFilter)
  element.addEventListener("submit", submitFilter)
})

function submitFilter(event) {
  event.preventDefault()

  const categoryElement = this.querySelector("input[name='category']")
  const sortElement = this.querySelector("input[name='sort']")
  const fromElement = this.querySelector("input[name='from']")
  const toElement = this.querySelector("input[name='to']")
  const searchElement = this.querySelector("input[name='search']")

  let filter = '/discover'

  if (categoryElement.value != "") filter = filter.concat(`/category/${ categoryElement.value }`)
  if (sortElement.value != "") filter = filter.concat(`/sort/${ sortElement.value }`)
  if (fromElement.value != "") filter = filter.concat(`/from/${ fromElement.value }`)
  if (toElement.value != "") filter = filter.concat(`/to/${ toElement.value }`)
  if (searchElement.value != "") filter = filter.concat(`/search/${ searchElement.value }`)

  console.log(filter)

  window.location.href = filter
}
