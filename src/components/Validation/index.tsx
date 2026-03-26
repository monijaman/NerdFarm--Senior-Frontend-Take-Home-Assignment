interface FormData {
  [key: string]: string; // Allows any key of type string with a string value
}


interface ValidationRules {
  required?: boolean;
  email?: boolean;
  phoneNumber?: boolean;
  passwordConfirmation?: boolean;
  minLength?: number;
  maxLength?: number;
  custom?: (value: string, formData: FormData) => boolean | string;
}

interface ValidationConfig {
  [key: string]: ValidationRules; // Maps form fields to their validation rules
}

interface ErrorResponse {
  [key: string]: string[]; // Maps form fields to their error messages
}

// Helper function to format field names: capitalize and remove underscores
const formatFieldName = (field: string): string => {
  const formattedField = field.replace(/_/g, ' '); // Replace underscores with spaces
  return formattedField.charAt(0).toUpperCase() + formattedField.slice(1); // Capitalize first letter
};

const validateField = (
  field: string,
  value: string,
  rules: ValidationRules,
  formData: FormData
): string[] => {
  const errors: string[] = [];

  const formattedField = formatFieldName(field); // Format the field name

  if (rules.required && !value) {
    errors.push(`${formattedField} is required.`);
  }

  if (rules.email && !/\S+@\S+\.\S+/.test(value)) {
    errors.push(`${formattedField} must be a valid email address.`);
  }

  if (rules.phoneNumber && !/^\+?\d{8,11}$/.test(value.replace(/\s/g, ''))) {
    errors.push(`${formattedField} must be a valid phone number.`);
  }

  if (rules.passwordConfirmation && formData.password !== value) {
    errors.push(`Passwords do not match.`);
  }

  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`${formattedField} must be at least ${rules.minLength} characters long.`);
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`${formattedField} must be no more than ${rules.maxLength} characters long.`);
  }

  if (rules.custom) {
    const customError = rules.custom(value, formData);
    if (typeof customError === 'string') {
      errors.push(customError);
    } else if (!customError) {
      errors.push(`${formattedField} is invalid.`);
    }
  }

  return errors;
};

const getErrors = (
  formData: FormData,
  validationConfig: ValidationConfig
): ErrorResponse => {
  const errorResponse: ErrorResponse = {};

  for (const field in validationConfig) {
    if (validationConfig.hasOwnProperty(field)) {
      const rules = validationConfig[field];
      const value = formData[field] || '';

      const fieldErrors = validateField(field, value, rules, formData);

      if (fieldErrors.length > 0) {
        errorResponse[field] = fieldErrors;
      }
    }
  }

  return errorResponse;
};

export default getErrors;
