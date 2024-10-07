import React, { useEffect, useState } from "react";
import styles from "./permissionModal.module.scss";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import { closePermissionModal } from "../../../stateManagement/slices/modalslice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import LoadingButton from "../../loadingButton/LoadingButton";
import { permissionValidationSchema } from "../../../utils/validationSheema/permissionScheema";
import Usepost from "../../../services/Usepost";
import useGet from "../../../services/useGet";
import Select from "react-select";
import { roles } from "../../../assets/data";
import { removePermission } from "../../../stateManagement/slices/permissionslice";
import usePut from "../../../services/usePut";

function PermissionModal() {
  const { putData, isLoading, success } = usePut("/permission/update");
  const { getData, success: userSuccess } = useGet("/user/all");
  const { postData } = Usepost("/permission/add");
  const permissionModal = useSelector((state) => state.modal.permissionModal);
  const permissionData = useSelector((state) => state.permission);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    if (permissionData?.id) {
      const data = {
        ...values,
        usersWithAccess: selectedUsers.map((user) => user.value),
        groupsWithAccess: selectedRoles.map((role) => role.value),
        id: permissionData.id,
      };
      await putData(data, true);
    } else {
      const data = {
        ...values,
        usersWithAccess: selectedUsers.map((user) => user.value),
        groupsWithAccess: selectedRoles.map((role) => role.value),
      };
      await postData(data, true);
    }
    dispatch(closePermissionModal());
    dispatch(removePermission({}));
    window.location.reload();
  };

  //fetching user data
  const handleFetchData = async () => {
    await getData(true);
  };

  useEffect(() => {
    if (userSuccess) {
      const mapedUsers = userSuccess?.data.map((user) => {
        return {
          label: user.firstName + " " + user.lastName,
          value: user._id,
        };
      });
      setUsers(mapedUsers);
    } else {
      handleFetchData();
    }
  }, [userSuccess, dispatch]);

  useEffect(() => {
    if (permissionData) {
      const handleUsers = permissionData.usersWithAccess.map((user) => {
        return {
          label: user.firstName + " " + user.lastName,
          value: user._id,
        };
      });
      setSelectedUsers(handleUsers);
      const handleRoles = permissionData.groupsWithAccess.map((role) => {
        return {
          label: role,
          value: role,
        };
      });
      setSelectedRoles(handleRoles);
    }
  }, [permissionData]);

  return (
    <Dialog
      visible={permissionModal}
      style={{ width: "50vw" }}
      onHide={() => {
        dispatch(closePermissionModal());
        dispatch(removePermission({}));
      }}
    >
      <div className={styles.container}>
        <Formik
          initialValues={{
            name: permissionData.name,
            content: permissionData.content,
            usersWithAccess: permissionData.usersWithAccess,
            groupsWithAccess: permissionData.groupsWithAccess,
          }}
          validationSchema={permissionValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className={styles.formDiv}>
              <div className={styles.inputDiv}>
                <label htmlFor="name">Permission name</label>
                <Field name="name" type="name" placeholder="admin" />
                <ErrorMessage
                  name="name"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className={styles.inputDiv}>
                <label htmlFor="content">Users with access</label>
                <Select
                  options={users}
                  onChange={setSelectedUsers}
                  value={selectedUsers}
                  isMulti
                ></Select>
              </div>
              <div className={styles.inputDiv}>
                <label htmlFor="content">Groups with access</label>
                <Select
                  options={roles}
                  onChange={setSelectedRoles}
                  value={selectedRoles}
                  isMulti
                ></Select>
              </div>
              <LoadingButton
                title={permissionData.id ? "Update" : "Create"}
                type="submit"
                loading={isLoading}
              />
            </Form>
          )}
        </Formik>
      </div>
    </Dialog>
  );
}

export default PermissionModal;
