class AddSimpleModeToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :simple_mode, :boolean, default: 0
  end
end
