import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import styles from "./payment.module.scss";
import { closePaymentModal } from "../../stateManagement/slices/modalslice";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  cardValidationSchema,
  initialValues,
} from "../../utils/validationSheema/paymentScheema";
import LoadingButton from "../../components/loadingButton/LoadingButton";
import Usepost from "../../services/Usepost";
import { toast } from "react-toastify";
import { updateUserDetails } from "../../stateManagement/slices/userSlice";
import io from "socket.io-client";

function PaymentModal() {
  const { postData, isLoading, success } = Usepost("/payment");
  const paymentModal = useSelector((state) => state.modal.PaymentModal);
  const dispatch = useDispatch();
  const content = useSelector((state) => state.content.contentDetails);
  const user = useSelector((state) => state.user.userDetails);
  const socket = io(import.meta.env.VITE_SOCKET);

  const handleSubmit = async (values) => {
    const data = {
      ...values,
      content: content._id,
      author: content.author,
      user: user.id,
      amount: content.amount,
    };
    await postData(data, true);
  };

  const handlePurchaseNotification = () => {
    const data = {
      contentId: content._id,
      authorId: content.author,
      buyerId: user.id,
      name: user.firstName + " " + user.lastName,
    };
    socket.emit("purchase", data);
    toast.success("Payment Successful");
    dispatch(updateUserDetails(success?.data?.user));
    dispatch(closePaymentModal());
  };

  useEffect(() => {
    if (success) {
      handlePurchaseNotification();
    }
  }, [success, dispatch]);

  return (
    <Dialog
      visible={paymentModal}
      style={{ width: "50vw" }}
      onHide={() => dispatch(closePaymentModal())}
    >
      <div className={styles.container}>
        <Formik
          initialValues={initialValues}
          validationSchema={cardValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className={styles.formDiv}>
              <div className={styles.inputDiv}>
                <label htmlFor="cardNumber">Card Number</label>
                <Field
                  name="cardNumber"
                  type="text"
                  placeholder="4242 4242 4242 4242"
                />
                <ErrorMessage
                  name="cardNumber"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>

              <div className={styles.inputDiv}>
                <label htmlFor="expiryDate">Expiry Date</label>
                <Field name="expiryDate" type="text" placeholder="12/34" />
                <ErrorMessage
                  name="expiryDate"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className={styles.inputDiv}>
                <label htmlFor="cvv">CVV</label>
                <Field name="cvv" type="text" placeholder="123" />
                <ErrorMessage
                  name="cvv"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className={styles.inputDiv}>
                <label htmlFor="name">Cardholder Name</label>
                <Field name="name" type="text" placeholder="John Doe" />
                <ErrorMessage
                  name="name"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <LoadingButton title="Pay" type="submit" loading={isLoading} />
            </Form>
          )}
        </Formik>
      </div>
    </Dialog>
  );
}

export default PaymentModal;
