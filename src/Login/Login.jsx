import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  let navigate = useNavigate();

  async function send(values) {
    setIsLoading(true);
    setApiError(null);

    const dataToSend = {
      email: values.email,
      password: values.password,
    };

    try {
      let { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        dataToSend
      );

      if (data.message === "success") {
        localStorage.setItem("userToken", data.token);
        navigate("/HomePage");
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Login failed");
      setIsLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Min 6 characters")
        .required("Password is required"),
    }),

    onSubmit: send,
  });

  return (
    <div className="signup-wrapper mt-5">
      <div className="signup-box">
        <h2>Login</h2>
        <p className="subtitle">Welcome back! Please login to your account</p>

        <form onSubmit={formik.handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-3">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="test@gmail.com"
              value={formik.values.email}
              onChange={(e) => {
                formik.handleChange(e);
                setApiError(null);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <small className="text-danger d-block mt-1">
                {formik.errors.email}
              </small>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="********"
              value={formik.values.password}
              onChange={(e) => {
                formik.handleChange(e);
                setApiError(null);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <small className="text-danger d-block mt-1">
                {formik.errors.password}
              </small>
            )}
          </div>

          {/* API Error */}
          {apiError && (
            <div className="alert alert-danger mt-3">
              {apiError}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-dark Register w-100 mt-3"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <NavLink
              to="/forgotpassword"
              className="btn a_dark  btn-link btn-sm text-decoration-none p-0"
            >
              Forgot password?
            </NavLink>

            <NavLink
              to="/signup"
              className="btn a_dark btn-link btn-sm text-decoration-none p-0"
            >
              Sign up?
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}
