import React, { useEffect, useState } from "react";
import styles from "./contentModal.module.scss";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  closeContentModal,
} from "../../../stateManagement/slices/modalslice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import LoadingButton from "../../loadingButton/LoadingButton";
import Usepost from "../../../services/Usepost";
import { removePermission } from "../../../stateManagement/slices/permissionslice";
import usePut from "../../../services/usePut";
import { ContentValidationSchema } from "../../../utils/validationSheema/contentScheema";
import { removeContentDetail } from "../../../stateManagement/slices/contentDetailSlice";

function ContentModal() {
  const { putData, isLoading, success } = usePut("/content/update");
  const { postData } = Usepost("/content/add");
  const contentModal = useSelector((state) => state.modal.contentDetailModal);
  const contentData = useSelector((state) => state.contentDetail);
  const user = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    if(contentData?.id){
        await putData({ ...values, id: contentData?.id }, true);
    }
    else{
        await postData({ ...values, author: user?.id }, true);
    }
    dispatch(closeContentModal());
    dispatch(removeContentDetail({}));
    window.location.reload();
  };

  return (
    <Dialog
      visible={contentModal}
      style={{ width: "50vw" }}
      onHide={() => {
        dispatch(closeContentModal());
        dispatch(removeContentDetail({}));
      }}
    >
      <div className={styles.container}>
        <Formik
          initialValues={{
            title: contentData?.title || "",
            description: contentData?.description || "",
            body: contentData?.body || "",
            amount: contentData?.amount || "",
            type: contentData?.type || "",
          }}
          validationSchema={ContentValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className={styles.formDiv}>
              <div className={styles.inputDiv}>
                <label htmlFor="title">Title</label>
                <Field name="title" type="title" placeholder="First article" />
                <ErrorMessage
                  name="title"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className={styles.inputDiv}>
                <label htmlFor="description">Description</label>
                <Field
                  name="description"
                  type="description"
                  placeholder="...description"
                  as="textarea"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className={styles.inputDiv}>
                <label htmlFor="body">Body</label>
                <Field
                  as="textarea"
                  name="body"
                  type="body"
                  placeholder="...body"
                />
                <ErrorMessage
                  name="body"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className={styles.inputDiv}>
                <label htmlFor="amount">Amount</label>
                <Field name="amount" type="number" placeholder="100" />
                <ErrorMessage
                  name="amount"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className={styles.selectDiv}>
                <label htmlFor="type">type</label>
                <Field as="select" name="type">
                  <option value="" label="Select type" />
                  <option value="Article" label="Article" />
                  <option value="Novel" label="Novel" />
                  <option value="Digest" label="Digest" />
                </Field>
                <ErrorMessage
                  name="type"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <LoadingButton
                title={`${contentData?.id ? "Update" : "Create"}`}
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

export default ContentModal;
