class AddFavoritesCountToCollections < ActiveRecord::Migration[6.0]
  def change
    add_column :collections, :favorites_count, :integer, default: 0
    add_index :collections, :favorites_count
  end
end
