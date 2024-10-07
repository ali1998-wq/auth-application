import React from "react";
import styles from "./loadingButton.module.scss";
import ClipLoader from "react-spinners/ClipLoader";

function LoadingButton({ loading, title, type }) {
  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loader}>
            <p>loading</p>
            <ClipLoader color={"black"} loading={loading} size={25} />
        </div>
      ) : (
        <button type={type}  className={styles.button} role="button">
          {title}
        </button>
      )}
    </div>
  );
}

export default LoadingButton;
