class CollectionPostsController < ApplicationController
  def create
    @collection_post = CollectionPost.new(collection_post_params)
    @collection_post.user_id = current_user.id

    @post = @collection_post.post
    @current_collection_post = CollectionPost.find_by_collection_id_and_post_id_and_user_id(collection_post_params[:collection_id], collection_post_params[:post_id], current_user.id)

    if @current_collection_post
      destroy
    else
      if @collection_post.save
        respond_to do |format|
          format.js
        end
      end
    end
  end

  def destroy
    if @current_collection_post.destroy
      respond_to do |format|
        format.js
      end
    end
  end

  private

  def collection_post_params
    params.require(:collection_post).permit(:collection_id, :post_id)
  end
end
