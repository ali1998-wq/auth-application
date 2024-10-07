import * as Yup from "yup";
const permissionValidationSchema = Yup.object({
  name: Yup.string().required("Permission name is required"),
  content: Yup.string().required("Permission content is required"),
});

const initialValues = {
  id: "",
  name: "",
  content: "",
  usersWithAccess: [],
  groupsWithAccess: [],
};

export { permissionValidationSchema, initialValues };
