import * as Yup from "yup";
const ContentValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(3, "Description must be at least 3 characters")
    .max(100, "Description must be at most 100 characters"),
  body: Yup.string().required("Body is required"),
  type: Yup.string().required("Type is required"),
  amount: Yup.number().required("Amount is required"),
});

const initialValues = {
  title: "",
  description: "",
  body: "",
  type: "",
  amount: "",
};

export { ContentValidationSchema, initialValues };
