import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, NavLink } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  async function handleResetPassword(values) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.put(
        "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
        {
          email: values.email,
          newPassword: values.newPassword,
        }
      );

      console.log("Reset Password Success:", response.data);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      formik.resetForm();
    } catch (error) {
      console.log("Reset Password Error:", error.response?.data);

      setErrorMessage(
        error.response?.data?.message ||
          "Reset password failed. Please verify the reset code first."
      );

      setIsLoading(false);
    }
  }

 
  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem("userEmail") || "",
      newPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      newPassword: Yup.string()
        .required("Password is required")
        .matches(
          /^[A-Z].{5,9}$/,
          "Password must start with uppercase and be 6-10 characters"
        ),
    }),
    onSubmit: handleResetPassword, // ✅ هنا
  });

  return (
    <div className="signup-wrapper mt-5">
      <div className="signup-box">
        <h2>Reset Password</h2>
        <p className="subtitle">
          Enter your email and new password to reset your account password
        </p>

        {/* Error */}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-4">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control border-0 border-bottom rounded-0"
              placeholder="you@example.com"
              value={formik.values.email || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="username"
            />
            {formik.touched.email && formik.errors.email && (
              <small className="text-danger d-block mt-1">
                {formik.errors.email}
              </small>
            )}
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              className="form-control border-0 border-bottom rounded-0"
              placeholder="Enter new password (e.g. A123456)"
              value={formik.values.newPassword || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="new-password"
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <small className="text-danger d-block mt-1">
                {formik.errors.newPassword}
              </small>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-dark w-100 mt-3"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          {/* Links */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <NavLink to="/login" className="small text-decoration-none">
              Back to Login
            </NavLink>

            <NavLink to="/signup" className="small text-decoration-none">
              Create account
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}
