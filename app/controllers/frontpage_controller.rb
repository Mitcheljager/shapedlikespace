class FrontpageController < ApplicationController
  def index
    @posts = Post.order(created_at: :desc).limit(12)
    @hot_posts = Post.order(hotness: :desc).limit(12)
    @featured_posts = Post.order(hotness: :desc).limit(3)
  end
end
