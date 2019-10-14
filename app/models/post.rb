include ApplicationHelper

class Post < ApplicationRecord
  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks

  is_impressionable counter_cache: true, unique: true

  belongs_to :user

  has_many :favorites, as: :favoritable, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :collection_posts
  has_many_attached :images, dependent: :destroy
  has_many_attached :files, dependent: :destroy

  validates :user_id, presence: true
  validates :title, presence: true, length: { minimum: 5, maximum: 75 }
  validates :slug, presence: true, uniqueness: true
  validates :categories, presence: true
  validates :tags, length: { maximum: 50 }
  validates :images, attached: true,
                     content_type: "image/png",
                     size: { less_than: 500.kilobytes }

  def self.search(query)
    __elasticsearch__.search({
      query: {
        multi_match: {
          query: query,
          fields: ["title^5", "categories^2", "tags"],
          fuzziness: "AUTO"
        }
      }
    })
  end
end
