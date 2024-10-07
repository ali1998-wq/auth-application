import React from 'react';
import styles from "./loading.module.scss";
import ClipLoader from "react-spinners/ClipLoader";

function LoadingOverlay() {
  return (
    <div className={styles.container}>
       <p>Loading...</p>
        <ClipLoader color={"#000"} loading={true} size={150} />
    </div>
  )
}

export default LoadingOverlay