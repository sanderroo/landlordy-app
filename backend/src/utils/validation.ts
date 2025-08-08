import Joi from 'joi';

// User registration validation
export const validateRegistration = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    firstName: Joi.string().min(1).max(100).required().messages({
      'string.min': 'First name is required',
      'string.max': 'First name cannot exceed 100 characters',
      'any.required': 'First name is required'
    }),
    lastName: Joi.string().min(1).max(100).required().messages({
      'string.min': 'Last name is required',
      'string.max': 'Last name cannot exceed 100 characters',
      'any.required': 'Last name is required'
    })
  });

  return schema.validate(data);
};

// User login validation
export const validateLogin = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  });

  return schema.validate(data);
};

// Email validation
export const validateEmail = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    })
  });

  return schema.validate(data);
};

// Property validation
export const validateProperty = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(255).required().messages({
      'string.min': 'Property name is required',
      'string.max': 'Property name cannot exceed 255 characters',
      'any.required': 'Property name is required'
    }),
    address: Joi.string().min(1).required().messages({
      'string.min': 'Address is required',
      'any.required': 'Address is required'
    }),
    totalUnits: Joi.number().integer().min(1).required().messages({
      'number.base': 'Total units must be a number',
      'number.integer': 'Total units must be a whole number',
      'number.min': 'Total units must be at least 1',
      'any.required': 'Total units is required'
    }),
    occupiedUnits: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Occupied units must be a number',
      'number.integer': 'Occupied units must be a whole number',
      'number.min': 'Occupied units cannot be negative'
    }),
    monthlyRevenue: Joi.number().min(0).optional().messages({
      'number.base': 'Monthly revenue must be a number',
      'number.min': 'Monthly revenue cannot be negative'
    })
  });

  return schema.validate(data);
};

// Tenant validation
export const validateTenant = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(255).required().messages({
      'string.min': 'Tenant name is required',
      'string.max': 'Tenant name cannot exceed 255 characters',
      'any.required': 'Tenant name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    phone: Joi.string().min(1).max(50).required().messages({
      'string.min': 'Phone number is required',
      'string.max': 'Phone number cannot exceed 50 characters',
      'any.required': 'Phone number is required'
    }),
    propertyId: Joi.string().uuid().required().messages({
      'string.uuid': 'Invalid property ID',
      'any.required': 'Property is required'
    }),
    unitNumber: Joi.string().min(1).max(50).required().messages({
      'string.min': 'Unit number is required',
      'string.max': 'Unit number cannot exceed 50 characters',
      'any.required': 'Unit number is required'
    }),
    rentAmount: Joi.number().positive().required().messages({
      'number.base': 'Rent amount must be a number',
      'number.positive': 'Rent amount must be positive',
      'any.required': 'Rent amount is required'
    }),
    leaseStart: Joi.date().required().messages({
      'date.base': 'Lease start date must be a valid date',
      'any.required': 'Lease start date is required'
    }),
    leaseEnd: Joi.date().greater(Joi.ref('leaseStart')).required().messages({
      'date.base': 'Lease end date must be a valid date',
      'date.greater': 'Lease end date must be after lease start date',
      'any.required': 'Lease end date is required'
    }),
    paymentDay: Joi.number().integer().min(1).max(31).required().messages({
      'number.base': 'Payment day must be a number',
      'number.integer': 'Payment day must be a whole number',
      'number.min': 'Payment day must be between 1 and 31',
      'number.max': 'Payment day must be between 1 and 31',
      'any.required': 'Payment day is required'
    }),
    paymentTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().messages({
      'string.pattern.base': 'Payment time must be in HH:MM format'
    })
  });

  return schema.validate(data);
};

// Payment validation
export const validatePayment = (data: any) => {
  const schema = Joi.object({
    tenantId: Joi.string().uuid().required().messages({
      'string.uuid': 'Invalid tenant ID',
      'any.required': 'Tenant is required'
    }),
    amount: Joi.number().positive().required().messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be positive',
      'any.required': 'Amount is required'
    }),
    dueDate: Joi.date().required().messages({
      'date.base': 'Due date must be a valid date',
      'any.required': 'Due date is required'
    }),
    notes: Joi.string().max(1000).optional().messages({
      'string.max': 'Notes cannot exceed 1000 characters'
    })
  });

  return schema.validate(data);
};