class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]

  before_action only: [:edit, :update, :destroy] do
    redirect_to root_path unless current_user && current_user == @post.user
  end

  before_action :set_order, only: [:category, :hero, :map]

  before_action only: [:create, :new] do
    redirect_to root_path unless current_user
  end

  def index
    @posts = Post.all
  end

  def show
  end

  def new
    @post = Post.new
  end

  def edit
  end

  def create
    @post = Post.new(post_params)
    @post.user_id = current_user.id

    if @post.save
      redirect_to post_path(@post.code)
    else
      render :new
    end
  end

  def update
    if @post.update(post_params)
      redirect_to post_path(@post.code)
    else
      render :edit
    end
  end

  def destroy
    @post.destroy
    redirect_to posts_url
  end

  private

  def set_post
    @post = Post.find_by_code!(params[:code])
  end

  def post_params
    params.require(:post).permit(:title, :description, { categories: [] }, :tags)
  end
end
