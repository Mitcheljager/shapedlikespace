include ApplicationHelper

class Post < ApplicationRecord
  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks

  is_impressionable counter_cache: true, unique: true

  belongs_to :user
  has_many :favorites, dependent: :destroy
  has_many_attached :images, dependent: :destroy

  validates :user_id, presence: true
  validates :title, presence: true, length: { minimum: 5, maximum: 75 }
  validates :categories, presence: true
  validates :tags, length: { maximum: 50 }
  validates :images, content_type: ["image/png", "image/jpg", "image/jpeg"], size: { less_than: 500.kilobytes }

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
