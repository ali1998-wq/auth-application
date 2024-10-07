import React, { useEffect } from 'react'
import RoleNavbar from '../../components/RoleNavbar/RoleNavbar';
import styles from "./admin.module.scss";
import Sidebar from '../../components/sidebar/Sidebar';
import { useSelector } from 'react-redux';
import { isJwtExpired } from 'jwt-check-expiration';


function AdminAuthorLayout({children}) {
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
    <div className={styles.top}>
       <RoleNavbar/>
       <div className={styles.container}>
          <div>
              <Sidebar/>
          </div>
          <div>
              {children}
          </div>
       </div>
    </div>
  )
}

export default AdminAuthorLayout