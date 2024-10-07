import React, { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./mainLayout.module.scss";
import { useSelector } from "react-redux";
import { isJwtExpired } from "jwt-check-expiration";

function MainLayout({ children }) {
  const token = useSelector((state) => state.user.token);
  useEffect(() => {
    if (token) {
      if (isJwtExpired(token)) {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className={styles.container}>{children}</div>
    </div>
  );
}

export default MainLayout;
