require 'test_helper'

class CollectionsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get collections_index_url
    assert_response :success
  end

  test "should get show" do
    get collections_show_url
    assert_response :success
  end

  test "should get create" do
    get collections_create_url
    assert_response :success
  end

  test "should get destroy" do
    get collections_destroy_url
    assert_response :success
  end

end
