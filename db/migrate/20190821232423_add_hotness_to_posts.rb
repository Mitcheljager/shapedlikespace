class AddHotnessToPosts < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :hotness, :integer, default: 0
    add_index :posts, :hotness
  end
end
