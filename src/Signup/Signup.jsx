import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  let navigate = useNavigate();

  async function send(values) {
    setIsLoading(true);
    setError("");

    const dataToSend = {
      name: values.firstName,                 
      email: values.email,
      password: values.password,
      rePassword: values.confirmPassword,     
      phone: "01221987640",                 
    };

    try {
      let { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        dataToSend
      );

      if (data.message === "success") {
        navigate("/login");
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Signup error:", error.response?.data);
      setError(error.response?.data?.message || "Email already registered");
      setIsLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .matches(
          /^[A-Z].{5,9}$/,
          "Password must start with uppercase and be 6-10 characters"
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),

    onSubmit: send,
  });

  return (
    <div className="signup-wrapper mt-5">
      <div className="signup-box">
        <h2>Create Account</h2>
        <p className="subtitle">Join us and start connecting with others</p>

        {/* Error  API */}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={formik.handleSubmit} noValidate>
     
          <div className="mb-2">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder="Beshoy"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <small className="text-danger">
                {formik.errors.firstName}
              </small>
            )}
          </div>

         
          <div className="mb-3">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="test@gmail.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <small className="text-danger d-block mt-1">
                {formik.errors.email}
              </small>
            )}
          </div>

       
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="********"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <small className="text-danger d-block mt-1">
                {formik.errors.password}
              </small>
            )}
          </div>

        
          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="********"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <small className="text-danger d-block mt-1">
                  {formik.errors.confirmPassword}
                </small>
              )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-dark w-100 Register mt-3"
          >
            {isLoading ? (
              <i className="fas fa-spinner  fa-spin"></i>
            ) : (
              "Register"
            )}
          </button>

        
          <p className="text-center mt-3">
            Already have an account?{" "}
            <NavLink to="/login" className=" a_dark fw-semibold">
              Sign in
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}
