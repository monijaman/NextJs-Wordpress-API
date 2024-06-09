"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './FormContainer.module.scss';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const FormContainer = () => {
  // State variables to store form data and validation errors
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formStatus, setFormStatus] = useState("");
  const [errorStatus, setErrorStatus] = useState("");

  // Function to handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("")
    setErrorStatus("")
    // Validate form data
    const formErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      formErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      formErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      formErrors.email = "Invalid email format";
    }
    if (!formData.message.trim()) {
      formErrors.message = "Message is required";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Send formData to server using fetch
    try {
      const response = await fetch('http://localhost/wordpress/wp-json/monir/v1/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });


      if (!response.ok) {
        const errorData = await response.json();
        setErrorStatus(errorData.message)
        throw new Error(errorData.message);
      }


      const data = await response.json();
      setFormStatus('Form submitted successfully')
    } catch (error) {
      
      console.error(error);
    }
  };

  // Function to handle input change
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear validation error when input value changes
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ""
    }));
  };


  // Function to validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className={styles.form_container}>

      <form className={styles.form_container__form} onSubmit={handleSubmit}>
        <h3 className={styles.form_container__subheader}>Any questions?</h3>
        <h2 className={styles.form_container__header}>Let's talk today!</h2>

        {formStatus &&
          <div className={styles.form_container__success}>{formStatus}</div>
        }
        {errorStatus &&
          <div className={styles.form_container__failed}>{errorStatus}</div>
        }
        <input
          type="text"
          name="name"
          className={styles.form_container__input}
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && <span className={styles.error_message}>{errors.name}</span>}
        <input
          type="email"
          name="email"
          className={styles.form_container__input}
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <span className={styles.error_message}>{errors.email}</span>}
        <textarea
          name="message"
          className={styles.form_container__textarea}
          placeholder="Your Message"
          value={formData.message}
          onChange={handleInputChange}
        ></textarea>
        {errors.message && <span className={styles.error_message}>{errors.message}</span>}
        <button type="submit" className={styles.form_container__button}>Submit</button>
      </form>
    </div>
  );
};

export default FormContainer;
