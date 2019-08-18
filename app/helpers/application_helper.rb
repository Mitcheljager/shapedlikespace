module ApplicationHelper
  def markdown(text)
    options = {
      escape_html: true,
      link_attributes: { target: "_blank" },
      space_after_headers: true,
      fenced_code_blocks: true
    }

    renderer = Redcarpet::Render::HTML.new(options)
    markdown = Redcarpet::Markdown.new(renderer)

    iframe = '<div class="video"><iframe class="video__iframe" width="560" height="315" src="https://www.youtube.com/embed/\\1" frameborder="0" allowfullscreen></iframe></div>'

    content = markdown.render(text)
    content.gsub(/\[youtube\s+(.*?)\]/, iframe).html_safe
  end

  def to_slug(string)
    string.downcase.gsub(" ", "-").gsub(":", "").gsub(".", "").gsub("'", "")
  end

  def categories
    YAML.load(File.read(Rails.root.join("config/arrays", "categories.yml")))
  end
end
