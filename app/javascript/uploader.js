import { DirectUpload } from "@rails/activestorage"

class Uploader {
  constructor(file, name) {
    this.file = file

    this.upload(file, name)
  }

  upload(file, name) {
    const element = document.querySelector("input[type='file'][name*='" + name + "']")
    const upload = new DirectUpload(file, element.dataset.directUploadUrl, this)

    upload.create((error, blob) => {
      if (error) {
        console.log(error)
      } else{
        const hiddenField = document.createElement("input")
        hiddenField.setAttribute("type", "hidden")
        hiddenField.setAttribute("value", blob.signed_id)
        hiddenField.name = element.name
        document.querySelector("[data-role='post-form']").appendChild(hiddenField)
      }
    })
  }

  directUploadWillStoreFileWithXHR(request, xhr) {
    request.upload.addEventListener("progress", event => this.directUploadDidProgress(event))
  }

  directUploadDidProgress(event) {
    const element = document.querySelector(`[data-file="${ this.file.name }"]`)

    if (!element) return

    console.log(event)

    const progressPercentage = (100 / event.total) * event.loaded
    let progressElement = element.querySelector(".file-list__progress")

    if (!progressElement) {
      progressElement = document.createElement("div")
      progressElement.classList.add("file-list__progress")
      element.append(progressElement)
    }

    if (progressPercentage == 100) {
      progressElement.remove()
    } else {
      progressElement.style.width = progressPercentage + "%"
    }
  }
}

export default Uploader
