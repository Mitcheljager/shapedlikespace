class CollectionsController < ApplicationController
  before_action :set_collection, only: [:show, :edit, :update, :destroy]

  def index
    @collections = Collection.order(created_at: :desc).page params[:page]
  end

  def show
  end

  def create
    @collection = Collection.new(collection_params)
    @collection.user_id = current_user.id


    create_slug

    if @collection.save
      @post = Post.find(params[:collection][:post_id])
      CollectionPost.new(collection_id: @collection.id, user_id: current_user.id, post_id: @post.id).save

      respond_to do |format|
        format.js
      end
    end
  end

  def destroy
  end

  private

  def create_slug
    @collection.slug = URI.escape(@collection.title.parameterize)

    if Collection.find_by_slug(@collection.slug)
      @collection.slug = @collection.slug + "-" + SecureRandom.hex(4)
    end
  end

  def set_collection
    @collection = Collection.find_by_slug!(params[:slug])
  end

  def collection_params
    params.require(:collection).permit(:title)
  end
end
