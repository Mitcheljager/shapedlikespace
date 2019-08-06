Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  mount ActionCable.server => "/cable"

  root "posts#index"

  resources :users, param: :username, except: [:new, :index, :edit, :update]
  get "account(/page/:page)", to: "users#account", as: "account"
  get "edit", to: "users#edit", as: "edit_user"
  patch "user", to: "users#update", as: "update_user"
  delete "user", to: "users#destroy", as: "destroy_user"

  resources :sessions, only: [:new, :create, :destroy]
  get "sessions", to: redirect("/login")

  get "register", to: "users#new", as: "new_user"
  get "login", to: "sessions#new", as: "login"
  get "logout", to: "sessions#destroy", as: "logout"

  resources :favorites, only: [:create]
  delete "favorites", to: "favorites#destroy"

  concern :paginatable do
    get "(page/:page)", action: :index, on: :collection, as: ""
  end

  resources :posts, path: "", concerns: :paginatable, except: [:index]

  get "search/:search(/page/:page)", to: "posts#search", as: "search"
  post "search(/:type)", to: "search#index", as: "search_post"
end
