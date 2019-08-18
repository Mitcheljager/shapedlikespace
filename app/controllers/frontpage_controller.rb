class FrontpageController < ApplicationController
  def index
    @posts = Post.order(created_at: :desc).limit(16)
  end
end
