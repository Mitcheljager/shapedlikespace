class PostsController < ApplicationController
  require "mini_magick"

  invisible_captcha only: [:create, :update]

  before_action :set_post, only: [:show, :edit, :update, :destroy]

  before_action only: [:edit, :update, :destroy] do
    redirect_to root_path unless current_user && current_user == @post.user
  end

  before_action only: [:create, :new] do
    redirect_to login_path unless current_user
  end

  def index
    @posts = Post.order(created_at: :desc).page params[:page]
  end

  def filter
    @posts = Post.all

    @posts = @posts.where("created_at >= ?", params[:from]) if params[:from]
    @posts = @posts.where("created_at <= ?", params[:to]) if params[:to]
    @posts = @posts.order("#{ sort_switch } DESC") if params[:sort]
    @posts = @posts.select { |post| to_slug(post.categories).include?(to_slug(params[:category])) } if params[:category]

    @posts = Kaminari.paginate_array(@posts).page(params[:page])
  end

  def search
    @posts = Post.search(params[:search]).records.page params[:page]
  end

  def show
    impressionist(@post)
  end

  def new
    @post = Post.new
  end

  def edit
  end

  def create
    @post = Post.new(post_params)
    @post.user_id = current_user.id

    create_slug

    if @post.save
      redirect_to post_path(@post.slug)
    else
      render :new
    end
  end

  def update
    if @post.update(post_params)
      redirect_to post_path(@post.slug)
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
    @post = Post.find_by_slug!(params[:slug])
  end

  def post_params
    params.require(:post).permit(
      :title,
      :description,
      :file_associations,
      :tags,
      :image_order,
      categories: [],
      images: [],
      files: []
    )
  end

  def create_slug
    @post.slug = URI.escape(@post.title.parameterize)

    if Post.find_by_slug(@post.slug)
      @post.slug = @post.slug + "-" + SecureRandom.hex(4)
    end
  end

  def sort_switch
    case params[:sort]
    when "views"
      "impressions_count"
    when "favorites"
      "favorites_count"
    when "time"
      "created_at"
    when "popularity"
      "hotness"
    else
      "created_at"
    end
  end
end
