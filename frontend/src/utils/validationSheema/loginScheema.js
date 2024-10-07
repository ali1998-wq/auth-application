import * as Yup from "yup";
const LoginValidationSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

const initialValues = {
  email: '',
  password: '',
};


export { LoginValidationSchema, initialValues };
