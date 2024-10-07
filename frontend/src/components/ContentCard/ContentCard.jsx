import React from "react";
import styles from "./contentCard.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { openModal, openPaymentModal } from "../../stateManagement/slices/modalslice";
import { checkPermission } from "../../utils/common/checkPermission";
import { setContent } from "../../stateManagement/slices/contentslice";

function ContentCard({ data }) {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.user.userDetails);

  const handleOpenModal = () => {
    dispatch(setContent(data));
    dispatch(openModal());
  };

  const handleOpenPayment=()=>{
    dispatch(setContent(data));
    dispatch(openPaymentModal());
  }
  return (
    <div className={styles.container}>
      <h1>{data?.title}</h1>
      <p>{data?.description}</p>
      <p>${data?.amount}</p>
      <div className={styles.buttonDiv}>
        {checkPermission({ userDetails, content: data }) ? (
          <button
            className={styles.button}
            onClick={handleOpenModal}
          >
            Read More
          </button>
        ) : null}
        <button className={styles.purchaseButton} onClick={handleOpenPayment}>Purchase</button>
      </div>
    </div>
  );
}

export default ContentCard;
