import { FormikValues, useFormik } from "formik";
import { FunctionComponent } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  submitButtonText: string;
  formTitle: string;
  cancelPath?: string;
  submitting?: boolean;
}

const LoginForm: FunctionComponent<LoginFormProps> = ({
  onSubmit,
  submitButtonText,
  formTitle,
  cancelPath = "/",
  submitting = false,
}) => {
  const navigate = useNavigate();

  const formik: FormikValues = useFormik<FormikValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email("Invalid email address").min(5).required("Email is required"),
      password: yup
        .string()
        .min(7)
        .max(20)
        .required("Password is required")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-"])[A-Za-z\d!@#$%^&*\-"]{8,}$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-"), and be at least 8 characters long'
        ),
    }),
    onSubmit: async (values) => {
      try {
        await onSubmit({
          email: values.email,
          password: values.password,
        });
      } catch (error) {
        console.error("Error in form submission:", error);
      }
    },
  });

  return (
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">{formTitle}</h2>
            </div>
            <div className="card-body">
              <form onSubmit={formik.handleSubmit}>
                {/* Email */}
                <div className="mb-4">
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                      id="email"
                      placeholder="name@example.com"
                      name="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      required
                    />
                    <label htmlFor="email">Email</label>
                    {formik.touched.email && formik.errors.email && (
                      <div className="invalid-feedback">{formik.errors.email}</div>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className={`form-control ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                      id="password"
                      placeholder="Password"
                      name="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      required
                    />
                    <label htmlFor="password">Password</label>
                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback">{formik.errors.password}</div>
                    )}
                  </div>
                </div>

                <div className="mt-4 d-flex gap-2 justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(cancelPath)}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!formik.isValid || submitting}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      submitButtonText
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <p>Don't have an account? <a href="/register">Register here</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;