import React from 'react'
import { useSelector } from 'react-redux';
import styles from "./sidebar.module.scss";
import { Link } from 'react-router-dom';

function Sidebar() {
  const role=useSelector(state=>state.user.role);
  
  return (
    <div className={styles.container}>
        <div className={styles.sidebar}>
            {role==="admin" && <Link to="/admin/dashboard" className={styles.link}>Roles</Link>}
            <Link to={`/${role}/permissions`} className={styles.link}>{role==="admin"?"Permissions":"Content"}</Link>
        </div>
    </div>
  )
}

export default Sidebar