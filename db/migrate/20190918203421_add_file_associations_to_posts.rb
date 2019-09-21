class AddFileAssociationsToPosts < ActiveRecord::Migration[6.0]
  def change
    add_column :posts, :file_associations, :string
  end
end
