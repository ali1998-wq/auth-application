import React, { useEffect } from "react";
import styles from "./login.module.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import LoadingButton from "../../components/loadingButton/LoadingButton";
import Usepost from "../../services/Usepost";
import { login } from "../../stateManagement/slices/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  initialValues,
  LoginValidationSchema,
} from "../../utils/validationSheema/loginScheema";

function Login() {
  const { postData, isLoading, success } = Usepost("/login");
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
        <h1>Login</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className={styles.formDiv}>
              <div className={styles.inputDiv}>
                <label htmlFor="email">Email</label>
                <Field
                  id="email"
                  name="email"
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
                <Field name="password" type="password" placeholder="******" id="password"/>
                <ErrorMessage
                  name="password"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <LoadingButton
                title="Login"
                type="submit"
                loading={isLoading}
              />
            </Form>
          )}
        </Formik>
        <p>Not a Member? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

export default Login;
