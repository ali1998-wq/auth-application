import * as Yup from "yup";
const roleValidationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
});

const initialValues = {
  name: "",
};

export { roleValidationSchema, initialValues };
