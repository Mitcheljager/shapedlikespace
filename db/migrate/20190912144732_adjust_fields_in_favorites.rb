class AdjustFieldsInFavorites < ActiveRecord::Migration[6.0]
  def change
    remove_columns :favorites, :post_id

    add_column :favorites, :favoritable_type, :string
    add_column :favorites, :favoritable_id, :integer
  end
end
