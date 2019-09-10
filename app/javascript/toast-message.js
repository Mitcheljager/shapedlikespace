customElements.define("toast-message",
  class ToastMessage extends HTMLElement {
    connectedCallback() {
      this.addEventListener("click", this.removeElement)
    }

    constructor() {
      super()

      const template = document.createElement("template")
      template.innerHTML = `
        <div class="toast">
          <slot></slot>

          <div part="progress"></div>
        </div>
      `

      const shadowRoot = this.attachShadow({mode: "open"})
      shadowRoot.appendChild(template.content.cloneNode(true))

      this.startProgress()
      this.determinePosition()
    }

    determinePosition() {
      const elements = document.querySelectorAll("toast-message")

      if (elements.length <= 1) return

      const offset = elements[1].getBoundingClientRect()
      const elementHeight = elements[1].offsetHeight
      const screenHeight = document.documentElement.clientHeight

      this.style.bottom = `calc(1rem + (${ screenHeight - offset.y }px))`
    }

    startProgress() {
      const progressElement = this.shadowRoot.querySelector("[part='progress']")
      progressElement.style.width = "100%"
      setTimeout(() => { progressElement.style.width = 0 })
      setTimeout(() => { this.removeElement() }, 3000)
    }

    removeElement() {
      this.classList.add("is-fading-out")

      setTimeout(() => {
        this.remove()
      }, 500)
    }
  }
)
