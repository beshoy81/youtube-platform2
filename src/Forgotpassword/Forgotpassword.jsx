import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

export default function Forgotpassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  async function handleForgetPassword(values) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data } = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", { email: values.email });
      localStorage.setItem("userEmail", values.email);
      setTimeout(() => { navigate("/resetcode");}, 1000);
      
      formik.resetForm();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.response?.data?.message ||  "Failed to send verification code. Please try again." );
    } 
  }

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema:Yup.object({
        email: Yup.string().email("Invalid email format").required("Email is required")
      }),
    onSubmit: handleForgetPassword
  });


  return (
    <div className="signup-wrapper mt-5">
      <div className="signup-box">
        <h2>Forgot Password</h2>
        <p className="subtitle">
          Enter your email address and we'll send you a reset code
        </p>

        {/* Error */}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <form onSubmit={formik.handleSubmit} noValidate>
  
          <div className="mb-4">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control border-0 border-bottom rounded-0"
              placeholder="you@example.com"
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

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-dark w-100 mt-3"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Sending...
              </>
            ) : (
              "Send Reset Code"
            )}
          </button>

   
          <div className="d-flex justify-content-between align-items-center mt-4">
            <NavLink
              to="/login"
              className="small a_dark text-decoration-none"
            >
              Back to Login
            </NavLink>

            <NavLink
              to="/signup"
              className="small a_dark text-decoration-none"
            >
              Create account
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}
























// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { useNavigate, NavLink } from "react-router-dom";

// export default function Forgotpassword() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const navigate = useNavigate();

//   async function handleForgetPassword(values) {
//     setIsLoading(true);
//     setErrorMessage(null);
//     try {
//       const { data } = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", { email: values.email });
// console.log(data)
//       localStorage.setItem("userEmail", values.email);
//       setTimeout(() => { navigate("/resetcode");}, 1000);
      
//       formik.resetForm();
//     } catch (error) {
//       setIsLoading(false);
//       setErrorMessage(error.response?.data?.message ||  "Failed to send verification code. Please try again." );
//     } 
//   }

//   const formik = useFormik({
//     initialValues: { email: "" },
//     validationSchema:Yup.object({
//         email: Yup.string().email().required("Email is required")
//       }),
//     onSubmit: handleForgetPassword
//   });


//   return (
//     <div className="signup-wrapper mt-5">
//       <div className="signup-box">
//         <h2>Forgot Password</h2>
//         <p className="subtitle">
//           Enter your email address and we'll send you a reset code
//         </p>

//         {/* Error */}
//         {errorMessage && (
//           <div className="alert alert-danger">{errorMessage}</div>
//         )}

//         <form onSubmit={formik.handleSubmit} noValidate>
//           {/* Email (Underline Style زي Login) */}
//           <div className="mb-4">
//             <label>Email Address</label>
//             <input
//               type="email"
//               name="email"
//               className="form-control border-0 border-bottom rounded-0"
//               placeholder="you@example.com"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//             />
//             {formik.touched.email && formik.errors.email && (
//               <small className="text-danger d-block mt-1">
//                 {formik.errors.email}
//               </small>
//             )}
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="btn  Register btn-dark w-100 mt-3"
//           >
//             {isLoading ? (
//               <>
//                 <i className="fas fa-spinner fa-spin me-2"></i>
//                 Sending...
//               </>
//             ) : (
//               "Send Reset Code"
//             )}
//           </button>

//           {/* Links (نفس مكان وشكل Login) */}
//           <div className="d-flex justify-content-between align-items-center mt-4">
//             <NavLink
//               to="/login"
//               className="small a_dark text-decoration-none"
//             >
//               Back to Login
//             </NavLink>

//             <NavLink
//               to="/signup"
//               className="small a_dark text-decoration-none"
//             >
//               Create account
//             </NavLink>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
