class FavoritesController < ApplicationController
  def create
    @favorite = Favorite.new(favorite_params)
    @favorite.user_id = current_user.id

    @model_name = favorite_params[:favoritable_type].constantize
    return unless defined? @model_name
    @model = @model_name.find(favorite_params[:favoritable_id])

    if @favorite.save!
      @model.increment!(:hotness) if @model_name.name == "Post"

      respond_to do |format|
        format.js
      end
    end
  end

  def destroy
    @favorite = Favorite.find_by_favoritable_type_and_favoritable_id_and_user_id(favorite_params[:favoritable_type], favorite_params[:favoritable_id], current_user.id)

    @model_name = favorite_params[:favoritable_type].constantize
    return unless defined? @model_name
    @model = @model_name.find(favorite_params[:favoritable_id])

    if @favorite.destroy
      @model.increment!(:hotness, -1) if @model_name.name == "Post"

      respond_to do |format|
        format.js
      end
    end
  end

  private

  def favorite_params
    params.require(:favorite).permit(:favoritable_type, :favoritable_id)
  end
end
