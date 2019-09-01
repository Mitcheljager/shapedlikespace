class AddListModeToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :list_mode, :boolean, default: 0
  end
end
