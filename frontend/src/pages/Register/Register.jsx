import React, { useEffect, useState } from "react";
import styles from "./register.module.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  initialValues,
  validationSchema,
} from "../../utils/validationSheema/registerScheema";
import LoadingButton from "../../components/loadingButton/LoadingButton";
import Usepost from "../../services/Usepost";
import { login } from "../../stateManagement/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Register() {
  const { postData, isLoading, success } = Usepost("/register");
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (values) => {
    await postData(values, false);
  };

  useEffect(() => {
    if (success) {
      const data = {
        userDetails: success?.data?.user,
        token: success?.data?.Token,
        role: success?.data?.user?.role,
      };
      dispatch(login(data));
      Navigate("/");
    }
  }, [success, dispatch]);
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1>Register</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className={styles.formDiv}>
              <div className={styles.inputDiv}>
                <label htmlFor="firstName">First Name</label>
                <Field
                  name="firstName"
                  id="firstName"
                  type="text"
                  placeholder="John"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>

              <div className={styles.inputDiv}>
                <label htmlFor="lastName">Last Name</label>
                <Field
                  name="lastName"
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>

              <div className={styles.inputDiv}>
                <label htmlFor="email">Email</label>
                <Field
                  name="email"
                  id="email"
                  type="email"
                  placeholder="JohnDoe@gmail.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>

              <div className={styles.inputDiv}>
                <label htmlFor="password">Password</label>
                <Field
                  name="password"
                  id="password"
                  type="password"
                  placeholder="******"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>

              <div className={styles.inputDiv}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  name="confirmPassword"
                  id="confirmPassword"
                  type="text"
                  placeholder="******"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className={styles.selectDiv}>
                <label htmlFor="role">Role</label>
                <Field as="select" name="role" id="role">
                  <option value="" label="Select role" />
                  <option value="author" label="Author" />
                  <option value="user" label="User" />
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>

              <LoadingButton
                title="Register"
                type="submit"
                loading={isLoading}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Register;
