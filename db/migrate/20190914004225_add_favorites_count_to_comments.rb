class AddFavoritesCountToComments < ActiveRecord::Migration[6.0]
  def change
    add_column :comments, :favorites_count, :integer, default: 0
    add_index :comments, :favorites_count
  end
end
