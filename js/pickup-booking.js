/* 
   Bhushan E-Waste Recycling Pvt. Ltd.
   pickup-booking.js - Multi-step booking wizard logic
*/

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pickupBookingForm');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.wizard-step'));
  const progressSteps = Array.from(document.querySelectorAll('.stepper-item'));
  const nextBtns = form.querySelectorAll('.btn-next');
  const prevBtns = form.querySelectorAll('.btn-prev');
  const successPanel = document.getElementById('bookingSuccessPanel');
  
  let currentStepIndex = 0;

  // Material type selection (Step 1)
  const materialCards = form.querySelectorAll('.material-select-card');
  const materialInput = document.getElementById('selectedMaterial');

  materialCards.forEach(card => {
    card.addEventListener('click', () => {
      materialCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      materialInput.value = card.getAttribute('data-value');
      
      // Clear invalid state if selected
      const group = materialInput.closest('.form-group');
      if (group) {
        group.classList.remove('is-invalid');
        const errorEl = group.querySelector('.form-error');
        if (errorEl) errorEl.style.display = 'none';
      }
    });
  });

  // Navigation handlers
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStepIndex)) {
        if (currentStepIndex === steps.length - 1) {
          // It's the final submission step
          submitBooking();
        } else {
          currentStepIndex++;
          updateStepVisibility();
        }
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentStepIndex--;
      updateStepVisibility();
    });
  });

  function updateStepVisibility() {
    steps.forEach((step, idx) => {
      if (idx === currentStepIndex) {
        step.style.display = 'block';
        step.classList.add('fade-in');
      } else {
        step.style.display = 'none';
        step.classList.remove('fade-in');
      }
    });

    // Update progress steps visual
    progressSteps.forEach((progressStep, idx) => {
      progressStep.classList.remove('active', 'completed');
      if (idx < currentStepIndex) {
        progressStep.classList.add('completed');
      } else if (idx === currentStepIndex) {
        progressStep.classList.add('active');
      }
    });

    // If on the review step (Step 5), populate review summary fields
    if (currentStepIndex === 4) {
      populateReviewSummary();
    }
  }

  function validateStep(stepIndex) {
    const currentStep = steps[stepIndex];
    const requiredInputs = currentStep.querySelectorAll('[required], input[type="hidden"]');
    let isStepValid = true;

    requiredInputs.forEach(input => {
      const group = input.closest('.form-group') || input.parentElement;
      const errorEl = group.querySelector('.form-error');
      const val = input.value.trim();

      if (!val) {
        isStepValid = false;
        group.classList.add('is-invalid');
        if (errorEl) {
          errorEl.textContent = 'This field is required.';
          errorEl.style.display = 'block';
        }
      } else {
        // Specific checks
        if (input.getAttribute('type') === 'email' && !validateEmail(val)) {
          isStepValid = false;
          group.classList.add('is-invalid');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid email address.';
            errorEl.style.display = 'block';
          }
        } else if (input.getAttribute('type') === 'tel' && !validatePhone(val)) {
          isStepValid = false;
          group.classList.add('is-invalid');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid 10-digit Indian phone number.';
            errorEl.style.display = 'block';
          }
        } else {
          group.classList.remove('is-invalid');
          if (errorEl) errorEl.style.display = 'none';
        }
      }
    });

    return isStepValid;
  }

  function populateReviewSummary() {
    const summaryMaterial = document.getElementById('summaryMaterial');
    const summaryQuantity = document.getElementById('summaryQuantity');
    const summaryLocation = document.getElementById('summaryLocation');
    const summaryDate = document.getElementById('summaryDate');
    const summaryContact = document.getElementById('summaryContact');

    const materialName = document.querySelector('.material-select-card.selected h4')?.textContent || 'Not Selected';
    const quantityVal = document.getElementById('quantity').value;
    const quantityUnit = document.getElementById('quantityUnit').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const pincode = document.getElementById('pincode').value;
    const dateVal = document.getElementById('pickupDate').value;
    const contactName = document.getElementById('contactName').value;
    const companyName = document.getElementById('companyName').value;
    const contactEmail = document.getElementById('contactEmail').value;
    const contactPhone = document.getElementById('contactPhone').value;

    if (summaryMaterial) summaryMaterial.textContent = materialName;
    if (summaryQuantity) summaryQuantity.textContent = `${quantityVal} ${quantityUnit}`;
    if (summaryLocation) summaryLocation.textContent = `${address}, ${city} - ${pincode}`;
    if (summaryDate) summaryDate.textContent = dateVal ? formatDate(dateVal) : 'Not selected';
    if (summaryContact) {
      summaryContact.innerHTML = `
        <strong>${contactName}</strong><br>
        ${companyName ? companyName + '<br>' : ''}
        Email: ${contactEmail}<br>
        Phone: ${contactPhone}
      `;
    }
  }

  function submitBooking() {
    // Generate a unique reference number
    const refNum = 'BHR-' + Math.floor(100000 + Math.random() * 900000);
    const refEl = document.getElementById('bookingRefNumber');
    if (refEl) refEl.textContent = refNum;

    // Transition elements
    form.style.display = 'none';
    successPanel.style.display = 'block';
    
    // Scroll to success panel top
    window.scrollTo({
      top: successPanel.getBoundingClientRect().top + window.scrollY - 120,
      behavior: 'smooth'
    });
  }

  // Helpers
  const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const validatePhone = (phone) => {
    return String(phone).match(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/);
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
  };

  // Initial step setup
  updateStepVisibility();
});
