<?php
/**
 * Plugin Name: Contact Form Plugin
 * Description: A plugin to handle contact form submissions via a custom post type and REST API.
 * Version: 1.0.0
 * Author: Monir
 *
 * Instructions:
 * 1. Activate the plugin.
 * 2. Use the [contact_form] shortcode in any post or page to display the contact form.
 * 3. The form will submit data to a custom post type and display a success or error message.
 * 3. or use this Api Endpoint to sumit data http://localhost/wordpress/wp-json/monir/v1/contact-form
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

// Load plugin text domain for translations
add_action('plugins_loaded', 'cfp_load_textdomain');
function cfp_load_textdomain()
{
    load_plugin_textdomain('contact-form-plugin', false, dirname(plugin_basename(__FILE__)) . '/languages');
}

// Function to register the custom post type 'Form'
add_action('init', 'cfp_create_form_cpt');
function cfp_create_form_cpt()
{
    // Labels for the 'Form' post type in the admin interface
    $labels = array(
        'name' => __('Forms', 'contact-form-plugin'),
        'singular_name' => __('Form', 'contact-form-plugin'),
        'menu_name' => __('Forms', 'contact-form-plugin'),
        'name_admin_bar' => __('Form', 'contact-form-plugin'),
    );

    // Arguments for the 'Form' post type
    $args = array(
        'label' => __('Form', 'contact-form-plugin'),
        'description' => __('Custom post type for contact forms', 'contact-form-plugin'),
        'labels' => $labels,
        'supports' => array('title'), // Only title is supported
        'hierarchical' => false, // Not hierarchical like pages
        'public' => true, // Publicly accessible
        'show_ui' => true, // Show in admin UI
        'show_in_menu' => true, // Show in admin menu
        'menu_position' => 20, // Position in the admin menu
        'show_in_admin_bar' => true, // Show in the admin bar
        'show_in_nav_menus' => true, // Show in navigation menus
        'can_export' => true, // Can be exported
        'has_archive' => false, // No archive page
        'exclude_from_search' => true, // Exclude from search results
        'publicly_queryable' => false, // Not queryable
        'capability_type' => 'post', // Use post capabilities
        'show_in_rest' => true, // Enable REST API support
    );

    // Register the 'Form' post type
    register_post_type('form', $args);
}

// Function to add custom meta boxes for the 'Form' post type
add_action('add_meta_boxes', 'cfp_add_meta_boxes');
function cfp_add_meta_boxes()
{
    // Add a meta box to the 'form' post type
    add_meta_box(
        'cfp_meta_box', // ID of the meta box
        __('Form Details', 'contact-form-plugin'), // Title of the meta box
        'cfp_build_meta_box', // Callback function to display the meta box
        'form', // Post type where the meta box will be added
        'normal', // Context where the meta box will be displayed
        'high' // Priority of the meta box
    );
}

// Function to build the custom meta boxes
function cfp_build_meta_box($post)
{
    // Add a nonce field for security
    wp_nonce_field(basename(__FILE__), 'cfp_nonce');

    // Retrieve the current values of the custom fields
    $email = get_post_meta($post->ID, '_cfp_email', true);
    $message = get_post_meta($post->ID, '_cfp_message', true);
    ?>
    <p>
        <label for="cfp_email"><?php esc_html_e('Email', 'contact-form-plugin'); ?></label>
        <input type="email" name="cfp_email" id="cfp_email" value="<?php echo esc_attr($email); ?>" class="widefat">
    </p>
    <p>
        <label for="cfp_message"><?php esc_html_e('Message', 'contact-form-plugin'); ?></label>
        <textarea name="cfp_message" id="cfp_message" class="widefat"><?php echo esc_textarea($message); ?></textarea>
    </p>
    <?php
}

// Function to save the custom meta fields
add_action('save_post', 'cfp_save_meta');
function cfp_save_meta($post_id)
{
    // Check if nonce is set and valid
    if (!isset($_POST['cfp_nonce']) || !wp_verify_nonce($_POST['cfp_nonce'], basename(__FILE__))) {
        return $post_id;
    }

    // Sanitize and save the email and message fields
    $email = isset($_POST['cfp_email']) ? sanitize_email($_POST['cfp_email']) : '';
    $message = isset($_POST['cfp_message']) ? sanitize_text_field($_POST['cfp_message']) : '';
    update_post_meta($post_id, '_cfp_email', $email);
    update_post_meta($post_id, '_cfp_message', $message);
}

// Function to register the REST API endpoint
add_action('rest_api_init', 'cfp_register_form_endpoint');
function cfp_register_form_endpoint()
{
    register_rest_route('monir/v1', '/contact-form', array(
        'methods' => 'POST', // Only allow POST requests
        'callback' => 'cfp_handle_form_submission', // Callback function to handle the request
        'permission_callback' => '__return_true', // Allow all users to access this endpoint
    ));
}

// Function to handle the form submission via the REST API
function cfp_handle_form_submission(WP_REST_Request $request)
{
    // Sanitize input fields
    $name = sanitize_text_field($request->get_param('name'));
    $email = sanitize_email($request->get_param('email'));
    $message = sanitize_textarea_field($request->get_param('message'));

    // Check if all required fields are present
    if (empty($name) || empty($email) || empty($message)) {
        return new WP_Error('missing_fields', __('All fields are required', 'contact-form-plugin'), array('status' => 422));
    }

    // Validate email address
    if (!is_email($email)) {
        return new WP_Error('invalid_email', __('Invalid email address', 'contact-form-plugin'), array('status' => 422));
    }

    // Check for duplicate submissions within the last hour
    $query_args = array(
        'post_type' => 'form',
        'meta_query' => array(
            array(
                'key' => '_cfp_email',
                'value' => $email,
                'compare' => '=',
            ),
        ),
        'date_query' => array(
            array(
                'after' => '1 hour ago',
            ),
        ),
    );

    $query = new WP_Query($query_args);
    if ($query->have_posts()) {
        return new WP_Error('duplicate_submission', __('A form with this email was submitted within the last hour', 'contact-form-plugin'), array('status' => 409));
    }

    // Create new form post
    $post_id = wp_insert_post(array(
        'post_title' => $name,
        'post_type' => 'form',
        'post_status' => 'publish',
    ));

    if (is_wp_error($post_id)) {
        return new WP_Error('form_submission_failed', __('Failed to submit form', 'contact-form-plugin'), array('status' => 500));
    }

    // Save the email and message as post meta
    update_post_meta($post_id, '_cfp_email', $email);
    update_post_meta($post_id, '_cfp_message', $message);

    return new WP_REST_Response(__('Form submitted successfully', 'contact-form-plugin'), 200);
}

// Function to create a shortcode for the contact form
add_shortcode('contact_form', 'cfp_contact_form_shortcode');
function cfp_contact_form_shortcode()
{
    ob_start(); // Start output buffering
    // Generate the REST API endpoint URL dynamically
    $rest_url = rest_url('monir/v1/contact-form');
    ?>
    <form id="contactForm">
        <input type="text" name="name" placeholder="<?php esc_html_e('Name', 'contact-form-plugin'); ?>" required>
        <input type="email" name="email" placeholder="<?php esc_html_e('Email', 'contact-form-plugin'); ?>" required>
        <textarea name="message" placeholder="<?php esc_html_e('Message', 'contact-form-plugin'); ?>" required></textarea>
        <button type="submit"><?php esc_html_e('Submit', 'contact-form-plugin'); ?></button>
    </form>

    <script>
        document.getElementById('contactForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the form from submitting the traditional way

            const formData = {
                name: document.querySelector('input[name="name"]').value,
                email: document.querySelector('input[name="email"]').value,
                message: document.querySelector('textarea[name="message"]').value,
            };

            // Send the form data to the REST API endpoint
            fetch('<?php echo esc_url($rest_url); ?>', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.message);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    alert('<?php esc_html_e('Form submitted successfully', 'contact-form-plugin'); ?>');
                    console.log(data);
                })
                .catch(error => {
                    alert('<?php esc_html_e('There was an error submitting the form', 'contact-form-plugin'); ?>: ' + error.message);
                    console.log(error);
                });
        });
    </script>
    <?php
    return ob_get_clean(); // Return the buffered content
}
?>
