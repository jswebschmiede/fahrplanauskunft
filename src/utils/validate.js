/**
 * Validates if an address is valid
 * @param {string} address - The entered address
 * @returns {Object} Validation result with isValid and message properties
 */
export const validateAddress = (address) => {
  if (!address || address.trim() === '') {
    return {
      isValid: false,
      message: 'Bitte geben Sie eine Adresse ein'
    }
  }

  if (address.trim().length < 3) {
    return {
      isValid: false,
      message: 'Die Adresse muss mindestens 3 Zeichen lang sein'
    }
  }

  return {
    isValid: true,
    message: ''
  }
}

/**
 * Validates if a date is valid
 * @param {string} date - The entered date in the format YYYY-MM-DD
 * @returns {Object} Validation result with isValid and message properties
 */
export const validateDate = (date) => {
  if (!date || date.trim() === '') {
    return {
      isValid: true,
      message: ''
    }
  }

  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) {
    return {
      isValid: false,
      message: 'Bitte geben Sie ein gültiges Datum ein'
    }
  }

  return {
    isValid: true,
    message: ''
  }
}

/**
 * Validates if a time is valid
 * @param {string} time - The entered time in the format HH:MM
 * @returns {Object} Validation result with isValid and message properties
 */
export const validateTime = (time) => {
  if (!time || time.trim() === '') {
    return {
      isValid: true,
      message: ''
    }
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(time)) {
    return {
      isValid: false,
      message: 'Bitte geben Sie eine gültige Zeit im Format HH:MM ein'
    }
  }

  return {
    isValid: true,
    message: ''
  }
}

/**
 * Shows validation errors in the form
 * @param {Object} errors - Object with error messages for each field
 * @returns {void}
 */
export const showValidationErrors = (errors) => {
  document.querySelectorAll('.error-message').forEach(el => el.remove())
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error', 'border-red-500'))
  
  Object.entries(errors).forEach(([fieldName, message]) => {
    const inputField = document.getElementById(fieldName)
    if (!inputField) return
    
    inputField.classList.add('input-error', 'border-red-500')
    
    const errorElement = document.createElement('div')
    errorElement.className = 'error-message text-red-500 text-sm mt-1'
    errorElement.textContent = message
    
    inputField.parentNode.appendChild(errorElement)
  })
}

/**
 * Clears all validation errors from the form
 * @returns {void}
 */
export const clearValidationErrors = () => {
  document.querySelectorAll('.error-message').forEach(el => el.remove())
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error', 'border-red-500'))
}

/**
 * Validates the form fields specifically for navigation (Goto-Button)
 * Ensures that all fields are filled
 * @param {Object} formData - Object with all form data (date, time, fromAddress)
 * @returns {Object} Validation result with isValid, errors and firstError properties
 */
export const validateNavigation = (formData) => {
  const errors = {}
  
  if (!formData.fromAddress || formData.fromAddress.trim() === '') {
    errors.fromAddress = 'Bitte geben Sie eine Startadresse ein'
  }
  
  if (!formData.date || formData.date.trim() === '') {
    errors.date = 'Bitte wählen Sie ein Datum'
  } else {
    const dateObj = new Date(formData.date)
    if (isNaN(dateObj.getTime())) {
      errors.date = 'Bitte geben Sie ein gültiges Datum ein'
    }
  }
  
  if (!formData.time || formData.time.trim() === '') {
    errors.time = 'Bitte wählen Sie eine Uhrzeit'
  } else {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(formData.time)) {
      errors.time = 'Bitte geben Sie eine gültige Zeit im Format HH:MM ein'
    }
  }
  
  if (!formData.selectedLocation) {
    errors.fromAddress = 'Bitte wählen Sie eine Haltestelle aus der Liste'
  }
  
  const isValid = Object.keys(errors).length === 0
  
  const firstError = Object.values(errors)[0] || ''
  
  return {
    isValid,
    errors,
    firstError
  }
} 