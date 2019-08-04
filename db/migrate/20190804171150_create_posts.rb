class CreatePosts < ActiveRecord::Migration[5.2]
  def change
    create_table :posts do |t|
      t.integer :user_id
      t.string :title
      t.text :description
      t.string :categories
      t.string :tags

      t.timestamps
    end
  end
end
