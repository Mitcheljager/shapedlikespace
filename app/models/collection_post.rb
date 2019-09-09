class CollectionPost < ApplicationRecord
  belongs_to :user
  belongs_to :collection
  belongs_to :post

  validates :user_id, presence: true
  validates :collection_id, presence: true
  validates :post_id, presence: true

  validates_uniqueness_of :collection_id, scope: %i[post_id user_id]
end
