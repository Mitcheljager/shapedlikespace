class AddImageOrderToPosts < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :image_order, :string
  end
end
