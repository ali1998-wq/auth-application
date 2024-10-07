import React, { useEffect, useState } from "react";
import styles from "./roleNavbar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../stateManagement/slices/userSlice";
import useGet from "../../services/useGet";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { FaBell } from "react-icons/fa";

function RoleNavbar() {
  const userDetails = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  const { getData, isLoading, success } = useGet(
    `/notifications/author/${userDetails.id}`
  );
  const [notifications, setNotifications] = useState([]);
  const socket = io(import.meta.env.VITE_SOCKET);
  const [open, setOpen] = useState(false);

  const getNotifications = async () => {
    await getData(true);
  };

  useEffect(() => {
    if (success) {
      setNotifications(success?.data);
    } else {
      getNotifications();
    }
  }, [success, dispatch]);

  useEffect(() => {
    socket.on("notification", (data) => {
      if (data.authorId === userDetails.id) {
        setNotifications([...notifications, data]);
        toast.success(data.message);
      }
    });

    return () => {
      socket.off("notification");
    };
  }, [socket]);
  return (
    <div className={styles.container}>
      <div className={styles.logo}>Auth App</div>
      {userDetails.role === "author" && (
        <div className={styles.notificationDiv}>
          <i onClick={()=>{
            setOpen(!open)
          }}>
          <FaBell />
          </i>
          {open && <div className={styles.notificationsdiv}>
            {notifications.map((notification) => (
              <p key={notification.id}>{notification.message}</p>
            ))}
          </div>}
        </div>
      )}
      <div className={styles.navLinks}>
        <p onClick={() => dispatch(logout())}>Logout</p>
      </div>
    </div>
  );
}

export default RoleNavbar;
