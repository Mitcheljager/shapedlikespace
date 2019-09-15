class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :favoritable, polymorphic: true, counter_cache: true

  validates :user_id, presence: true
  validates :favoritable_type, presence: true
  validates :favoritable_id, presence: true
  validates_uniqueness_of :user_id, scope: [:favoritable_type, :favoritable_id]
end
