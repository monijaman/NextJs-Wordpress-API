# NextJs-Wordpress-API

## Plugin Instructions:

1. **Activate the Plugin**: 
   - After cloning the repository, activate the plugin in your WordPress site.

2. **Use Shortcode**: 
   - Insert the `[contact_form]` shortcode in any post or page where you want to display the contact form.

3. **Form Submission**:
   - The form will submit data to a custom post type and display a success or error message.
   
4. **API Endpoint**:
   - Alternatively, you can use the API endpoint to submit data: `http://localhost/wordpress/wp-json/monir/v1/contact-form`

## Landing Page Instructions:

1. **Installation**:
   - After cloning the GitHub repository, navigate to the directory in your terminal.
   - Run the command `npm install` to install dependencies.

2. **Run the Development Server**:
   - Once the installation is finished, run the command `npm run dev`.
   - This will start the frontend at `http://localhost:3000/`.

3. **Contact Form Submission**:
   - The contact form on the landing page will send data to the WordPress plugin when submitted.

###.   Node version 20 is used. so use that to run the frontend