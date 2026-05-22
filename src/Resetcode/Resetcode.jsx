import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

export default function Resetcode() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleResetCode(values) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        { resetCode: values.resetCode }
      );

      console.log(response);

      setTimeout(() => {
        navigate("/ResetPassword");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(
        error.response?.data?.message || "Verification failed"
      );
    }
  }

  const formik = useFormik({
    initialValues: {
      resetCode: "",
    },
    validationSchema: Yup.object({
      resetCode: Yup.string()
        .required("Reset code is required")
        .min(4, "Reset code must be at least 4 characters"),
    }),
    onSubmit: handleResetCode,
  });

  return (
    <div className="signup-wrapper mt-5">
      <div className="signup-box">
        <h2>Verify Code</h2>
        <p className="subtitle">
          Enter the verification code sent to your email
        </p>

        {/* Error */}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
          {/* Reset Code (Underline Style) */}
          <div className="mb-4">
            <label>Verification Code</label>
            <input
              type="text"
              name="resetCode"
              className="form-control border-0 border-bottom rounded-0"
              placeholder="Enter reset code"
              value={formik.values.resetCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.resetCode && formik.errors.resetCode && (
              <small className="text-danger d-block mt-1">
                {formik.errors.resetCode}
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
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </button>

          {/* Links */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <NavLink to="/forgotpassword" className="small text-decoration-none">
              Resend Code
            </NavLink>

            <NavLink to="/login" className="small a_dark  text-decoration-none">
              Back to Login
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}
