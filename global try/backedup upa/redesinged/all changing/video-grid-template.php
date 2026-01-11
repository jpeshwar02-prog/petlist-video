<?php
/*
Template Name: Video Grid
*/
get_header(); ?>

<section class="vsection" id="youtube">
  <div class="container reveal">
    <h2 class="section-title">Recent YouTube Videos</h2>
    <p style="text-align:center;">Catch up on our latest uploads from the PetList Tamil YouTube channel.</p>

    <div class="cards">
      <?php
      $args = array('post_type' => 'video', 'posts_per_page' => -1);
      $videos = new WP_Query($args);

      if ($videos->have_posts()) :
        while ($videos->have_posts()) : $videos->the_post();
          $iframe = get_field('youtube_iframe'); ?>
          <div class="card">
            <?php echo $iframe; ?>
            <h3><?php the_title(); ?></h3>
            <p><?php the_excerpt(); ?></p>
          </div>
        <?php endwhile;
        wp_reset_postdata();
      endif;
      ?>
    </div>
  </div>
</section>

<?php get_footer(); ?>
