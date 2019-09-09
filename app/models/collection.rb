class Collection < ApplicationRecord
  belongs_to :user

  has_many :collection_posts, dependent: :destroy

  validates :title, presence: true, length: { minimum: 1, maximum: 75 }
  validates :slug, presence: true, uniqueness: true
end
