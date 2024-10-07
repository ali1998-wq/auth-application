import React from 'react';
import styles from "./navbar.module.scss";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../stateManagement/slices/userSlice';

function Navbar() {
  const dispatch=useDispatch();
  const role=useSelector(state=>state.user.role);
  return (
    <div className={styles.container}>
        <div className={styles.logo}>Auth App</div>
        <div className={styles.navLinks}>
            <Link to="/" className={styles.link}>Home</Link>
            <Link to="/purchases" className={styles.link}>Purchases</Link>
            {role==="admin" && <Link to="/admin/dashboard" className={styles.link}>Admin Panel</Link>}
            {role==="author" && <Link to="/author/permissions" className={styles.link}>Author Panel</Link>}
            <p onClick={()=>dispatch(logout())}>Logout</p>
        </div>
    </div>
  )
}

export default Navbar;