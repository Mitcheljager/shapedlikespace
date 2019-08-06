source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "2.6.3"

gem "rails", "~> 6.0.0.rc2"
gem "pg"
gem "puma", "~> 3.11"
gem "sass-rails", "~> 5"
gem "webpacker", "~> 4.0"
gem "turbolinks", "~> 5"
gem "jbuilder", "~> 2.7"

gem "inline_svg"
gem "redcarpet"
gem "kaminari"
gem "impressionist"

gem "elasticsearch-model", "~> 6"
gem "elasticsearch-rails", "~> 6"

gem "carrierwave"
gem "mini_magick"

gem "bcrypt", :require => "bcrypt"
gem "high_voltage", "~> 3.0.0"

# Use Active Storage variant
# gem "image_processing", "~> 1.2"

group :development, :test do
  gem "byebug", platforms: [:mri, :mingw, :x64_mingw]
  gem "sqlite3", "1.4.1"
end

group :development do
  gem "win32-security"
  gem "web-console", ">= 3.3.0"
  gem "faker"
end

group :test do
  gem "capybara", ">= 2.15"
  gem "selenium-webdriver"
  gem "webdrivers"
end

group :production do
  gem "autoprefixer-rails"
  gem "heroku-deflater"
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
