class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :post

  has_many :favorites, dependent: :destroy

  validates :user_id, presence: true
  validates :content, presence: true, length: { minimum: 1, maximum: 2000 }
end
