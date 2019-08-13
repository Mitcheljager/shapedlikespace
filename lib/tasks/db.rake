namespace :db do
  desc "Generate dummy data"
  task fakeit: :environment do
    200.times do
      Post.create!(
        user_id: 1,
        title: Faker::Lorem.sentence,
        slug: Faker::Lorem.sentence.parameterize + "-" + SecureRandom.hex(4),
        description: Faker::Markdown.sandwich(sentences: 6, repeat: 3),
        categories: ["Tools"],
        tags: Faker::Lorem.word
      )
    end
  end
end
