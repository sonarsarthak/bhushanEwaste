/* 
   Bhushan E-Waste Recycling Pvt. Ltd.
   form-validation.js - Client side form validations
*/

document.addEventListener('DOMContentLoaded', () => {
  // Utility validation functions
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePhone = (phone) => {
    // Basic Indian phone pattern (10 digits, optionally preceded by +91 or 91 or 0)
    return String(phone)
      .match(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/);
  };

  const setValidationState = (group, isValid, errorMsg = '') => {
    const errorEl = group.querySelector('.form-error');
    if (isValid) {
      group.classList.remove('is-invalid');
      group.classList.add('is-valid');
      if (errorEl) errorEl.style.display = 'none';
    } else {
      group.classList.remove('is-valid');
      group.classList.add('is-invalid');
      if (errorEl) {
        errorEl.textContent = errorMsg;
        errorEl.style.display = 'block';
      }
    }
  };

  const validateField = (input) => {
    const group = input.closest('.form-group');
    if (!group) return true;

    const value = input.value.trim();
    const type = input.getAttribute('type');
    const isRequired = input.hasAttribute('required');

    if (isRequired && !value) {
      setValidationState(group, false, 'This field is required.');
      return false;
    }

    if (value) {
      if (type === 'email' && !validateEmail(value)) {
        setValidationState(group, false, 'Please enter a valid email address.');
        return false;
      }
      if (type === 'tel' && !validatePhone(value)) {
        setValidationState(group, false, 'Please enter a valid 10-digit Indian phone number.');
        return false;
      }
    }

    setValidationState(group, true);
    return true;
  };

  // Find all standard forms on the page (excluding multi-step pickup booking which has its own file)
  const forms = document.querySelectorAll('form:not(.pickup-booking-form)');

  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    const submitBtn = form.querySelector('[type="submit"]');

    // Attach listeners for real-time validation
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        validateField(input);
        checkFormValidity();
      });
      input.addEventListener('blur', () => {
        validateField(input);
        checkFormValidity();
      });
    });

    function checkFormValidity() {
      let isFormValid = true;
      inputs.forEach(input => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('is-invalid')) {
          isFormValid = false;
        }
        if (input.hasAttribute('required') && !input.value.trim()) {
          isFormValid = false;
        }
      });
      if (submitBtn) {
        submitBtn.disabled = !isFormValid;
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let allValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          allValid = false;
        }
      });

      if (allValid) {
        // Successful submission mock
        const successPanel = form.parentElement.querySelector('.form-success-panel');
        if (successPanel) {
          form.style.display = 'none';
          successPanel.style.display = 'block';
          successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          alert('Thank you for contacting us! We will get back to you shortly.');
          form.reset();
        }
      }
    });

    // Initial check
    checkFormValidity();
  });
});
