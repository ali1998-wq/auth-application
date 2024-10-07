import * as Yup from "yup";
const cardValidationSchema = Yup.object({
    cardNumber: Yup.string()
        .required("Card number is required")
        .matches(
        /^([0-9]{4}) ([0-9]{4}) ([0-9]{4}) ([0-9]{4})$/,
        "Card number is invalid"
        ),
    expiryDate: Yup.string()
        .required("Expiry date is required")
        .matches(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, "Expiry date is invalid"),
    cvv: Yup.string()
        .required("CVV is required")
        .matches(/^[0-9]{3}$/, "CVV is invalid"),
    name: Yup.string().required("Name is required"),
});

const initialValues = {
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  name: "",
};

export { cardValidationSchema, initialValues };
