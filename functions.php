<?php
function petlist_enqueue_assets() {
  wp_enqueue_style('petlist-style', get_stylesheet_uri());
  wp_enqueue_script('petlist-script', get_stylesheet_directory_uri() . '/script.js', array(), null, true);
}
add_action('wp_enqueue_scripts', 'petlist_enqueue_assets');

function create_video_post_type() {
  register_post_type('video',
    array(
      'labels' => array(
        'name' => __('Videos'),
        'singular_name' => __('Video')
      ),
      'public' => true,
      'has_archive' => true,
      'supports' => array('title','editor','thumbnail','excerpt'),
    )
  );
}
add_action('init', 'create_video_post_type');
