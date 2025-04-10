import Joi from 'joi';

export const signUpSchema = Joi.object({
    firstname: Joi.string().required().min(3).max(30).messages({
     'string.empty': 'Firstname is required',
     'string.min': 'Firstname must be at least 3 characters long',
     'string.max': 'Firstname cannot exceed 30 characters'
    }),
  email: Joi.string().required().email().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address'
  }),
  password: Joi.string().required().min(6).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  })
});

export const signInSchema = Joi.object({
  email: Joi.string().required().email().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
});

export const changePasswordSchema = Joi.object({
  user: Joi.object({
    userId: Joi.number().required()
  }),
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Current password is required'
  }),
  newPassword: Joi.string().required().min(6).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 6 characters long',
    'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')).messages({
   'string.empty': 'Confirm password is required',
   'any.only': 'Confirm password must match the new password' 
  }),
});

export const resetPasswordSchema = Joi.object({
  user: Joi.object({
    userId: Joi.number().required()
  }),
  password: Joi.string().required().min(6).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).messages({
    'string.empty': 'Password is required',
    'string.min': 'New password must be at least 6 characters long',
    'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, and one number'
  }),
  passwordConfirm: Joi.string().required().valid(Joi.ref('password')).messages({
    'string.empty': 'Confirm password is required',
    'any.only': 'Confirm password must match the password'
  })
});

export const forgetPasswordSchema = Joi.object({
  user: Joi.object({
    userId: Joi.number().required()
  }),
  email: Joi.string().required().email().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email address'
  })
});

export const updateUserSchema = Joi.object({
  user: Joi.object({
    userId: Joi.number().required()
  }).required(),
  username: Joi.string().min(3).max(30).messages({
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters'
  }),
  email: Joi.string().email().messages({
    'string.email': 'Please enter a valid email address'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});