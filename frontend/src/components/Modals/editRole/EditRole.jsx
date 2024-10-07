import React, { useEffect } from "react";
import styles from "./editrole.module.scss";
import { closeEditRoleModal } from "../../../stateManagement/slices/modalslice";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { initialValues, roleValidationSchema } from "../../../utils/validationSheema/rolescheema";
import LoadingButton from "../../loadingButton/LoadingButton";
import usePut from "../../../services/usePut";

function EditRole() {
  const editRoleModal = useSelector(state => state.modal.editRoleModal);
  const dispatch = useDispatch();
  const roleData=useSelector(state=>state.role);
  const {putData,isLoading,success}=usePut("/role/update");

  const handleSubmit = async (values) => {
    const data={
        id:roleData._id,
        name:values.name
    }
    await putData(data,true);
  };

  useEffect(() => {
    if(success){
      dispatch(closeEditRoleModal());
      window.location.reload();
    }
  },[success,dispatch]);
  return (
    <Dialog
      visible={editRoleModal}
      style={{ width: "50vw" }}
      onHide={() => dispatch(closeEditRoleModal())}
    >
      <div className={styles.container}>
      <Formik
          initialValues={{ ...initialValues, name: roleData.name }}
          validationSchema={roleValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}

        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className={styles.formDiv}>
              <div className={styles.inputDiv}>
                <label htmlFor="name">Role name</label>
                <Field
                  name="name"
                  type="name"
                  placeholder="admin"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <LoadingButton
                title="Edit Role"
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

export default EditRole;
