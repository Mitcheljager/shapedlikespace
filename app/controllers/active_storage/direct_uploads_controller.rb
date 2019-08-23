class ActiveStorage::DirectUploadsController < ActiveStorage::BaseController
  def create
    arguments = blob_args

    if arguments[:content_type] == ""
      arguments[:content_type] = "model/stl"
    end

    blob = ActiveStorage::Blob.create_before_direct_upload!(arguments)
    render json: direct_upload_json(blob)
  end

  private

  def blob_args
    params.require(:blob).permit(:filename, :byte_size, :checksum, :content_type, :metadata).to_h.symbolize_keys
  end

  def direct_upload_json(blob)
    blob.as_json(root: false, methods: :signed_id).merge(direct_upload: {
      url: blob.service_url_for_direct_upload,
      headers: blob.service_headers_for_direct_upload
    })
  end
end
