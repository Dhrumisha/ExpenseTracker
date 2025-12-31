import * as Yup from 'yup';

export const SignUpSchema = Yup.object().shape({
  firstname: Yup.string().required('first name is required').min(3, 'first name must be at least 3 characters long').max(50, 'first name must be at most 50 characters long'),
  lastname: Yup.string().required('last name is required').min(3, 'last name must be at least 3 characters long').max(50, 'last name must be at most 50 characters long'),
  password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long').max(50, 'Password must be at most 50 characters long').matches(/[a-z]/, 'Password must contain at least one lowercase letter').matches(/[A-Z]/, 'Password must contain at least one uppercase letter').matches(/[0-9]/, 'Password must contain at least one number').matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/, 'Password must contain at least one special character'),

  email: Yup.string().email('Invalid email format').required('Email is required'),
});

export const SignInSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required"),
});

export const ForgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export const ResetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const ChangePasswordSchema = Yup.object({
  currentPassword: Yup.string()
    .required("Current Password is required"),

  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm Password is required"),
});

