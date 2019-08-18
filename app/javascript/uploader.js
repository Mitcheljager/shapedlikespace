import { DirectUpload } from "@rails/activestorage"

class Uploader {
  constructor(file, name) {
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

  directUploadWillStoreFileWithXHR(request) {
    request.upload.addEventListener("progress",
    event => this.directUploadDidProgress(event))
  }

  directUploadDidProgress(event) {
    console.log(event)
  }
}

export default Uploader
