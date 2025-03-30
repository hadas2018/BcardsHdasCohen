import { FormikValues, useFormik } from "formik";
import { FunctionComponent } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { UnnormalizedUserForm } from "../../interfaces/users/UnnormalizedUserForm";

interface UserFormProps {
  initialValues: UnnormalizedUserForm;
  onSubmit: (values: UnnormalizedUserForm) => Promise<void>;
  formTitle: string;
  submitButtonText: string;
  cancelPath?: string;
  submitting?: boolean;
  isEditMode?: boolean; 
}

const UserForm: FunctionComponent<UserFormProps> = ({
  initialValues,
  onSubmit,
  formTitle,
  submitButtonText,
  cancelPath = "/profile",
  submitting = false,
  isEditMode = false,
  
  
  
}) => {
  const navigate = useNavigate();

  const getValidationSchema = () => {
    return yup.object({
      first: yup.string().min(2).max(256).required("First name is required"),
      middle: yup.string().min(2).max(256),
      last: yup.string().min(2).max(256).required("Last name is required"),
      phone: yup.string().min(9).max(11).required("Phone number is required"),
      email: yup.string().email("Invalid email address").min(5).required("Email is required"),
      password: yup
        .string()
        .min(7)
        .max(20)
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-"])[A-Za-z\d!@#$%^&*\-"]{8,}$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-"), and be at least 8 characters long'
        )
        .test('is-empty-or-valid', 'Invalid password', function (value) {
        return isEditMode ? (!value || Boolean(value)) : Boolean(value && value.length >= 8);
        })
        .when('isEditMode', {
          is: true,
          otherwise: (schema) => schema.required('Password is required')
        }),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .when('password', {
          is: (val: string) => val && val.length > 0,
          then: (schema) => schema.required('Confirm password is required when setting a new password'),
        }),
      image: yup.string().min(14, "Image URL must be at least 14 characters"),
      alt: yup.string().min(2).max(256),
      state: yup.string().min(2).max(256),
      country: yup.string().min(2).max(256).required("Country is required"),
      city: yup.string().min(2).max(256).required("City is required"),
      street: yup.string().min(2).max(256).required("Street is required"),
      houseNumber: yup.number().min(1).required("House number is required"),
      zip: yup.number().min(1).max(1000000).required("Zip code is required"),
      isBusiness: yup.boolean().required("Business status is required"),
    });
  };

  const formik: FormikValues = useFormik<FormikValues>({
    initialValues,
    validationSchema: getValidationSchema(),
    onSubmit: async (values) => {
      try {
        await onSubmit(values as UnnormalizedUserForm);
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
                {/* Personal Information */}
                <div className="mb-4">
                  <h4 className="border-bottom pb-2">Personal Information</h4>
                  <div className="row g-3">
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          placeholder="First Name"
                          name="first"
                          required
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.first}
                        />
                        <label htmlFor="firstName">First Name</label>
                        {formik.touched.first && formik.errors.first && (
                          <p className="text-danger">{formik.errors.first}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="middleName"
                          placeholder="Middle Name"
                          name="middle"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.middle}
                        />
                        <label htmlFor="middleName">Middle Name</label>
                        {formik.touched.middle && formik.errors.middle && (
                          <p className="text-danger">{formik.errors.middle}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          placeholder="Last Name"
                          name="last"
                          required
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.last}
                        />
                        <label htmlFor="lastName">Last Name</label>
                        {formik.touched.last && formik.errors.last && (
                          <p className="text-danger">{formik.errors.last}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="tel"
                          className="form-control"
                          id="tel"
                          placeholder="Phone"
                          name="phone"
                          required
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.phone}
                        />
                        <label htmlFor="tel">Phone</label>
                        {formik.touched.phone && formik.errors.phone && (
                          <p className="text-danger">{formik.errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          placeholder="Email"
                          name="email"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                          required
                          disabled={isEditMode} // אימייל לא ניתן לעדכון במצב עריכה
                        />
                        <label htmlFor="email">Email</label>
                        {isEditMode && (
                          <small className="text-muted">Email cannot be changed</small>
                        )}
                        {formik.touched.email && formik.errors.email && (
                          <p className="text-danger">{formik.errors.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="mb-4">
                  <h4 className="border-bottom pb-2">Password</h4>
                  {isEditMode && (
                    <div className="alert alert-info mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      Leave password fields empty to keep your current password.
                    </div>
                  )}
                  <div className="row g-2">
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder={isEditMode ? "New Password" : "Password"}
                          name="password"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.password}
                          required={!isEditMode} // חובה רק בהרשמה, לא בעריכה
                        />
                        <label htmlFor="password">{isEditMode ? "New Password" : "Password"}</label>
                        {formik.touched.password && formik.errors.password && (
                          <p className="text-danger">{formik.errors.password}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          placeholder="Confirm Password"
                          name="confirmPassword"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.confirmPassword}
                          required={!isEditMode || !!formik.values.password} // חובה בהרשמה או אם הוזנה סיסמה חדשה
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        {formik.touched.confirmPassword &&
                          formik.errors.confirmPassword && (
                            <p className="text-danger">
                              {formik.errors.confirmPassword}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Image */}
                <div className="mb-4">
                  <h4 className="border-bottom pb-2">Profile Image</h4>
                  <div className="row g-2">
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="url"
                          className="form-control"
                          id="image"
                          placeholder="Image URL"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.image}
                          name="image"
                        />
                        <label htmlFor="image">Profile Image URL</label>
                        {formik.touched.image && formik.errors.image && (
                          <p className="text-danger">{formik.errors.image}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="alt"
                          placeholder="Alternative Text"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.alt}
                          name="alt"
                        />
                        <label htmlFor="alt">Alternative Text</label>
                        {formik.touched.alt && formik.errors.alt && (
                          <p className="text-danger">{formik.errors.alt}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {formik.values.image && (
                    <div className="text-center mt-2 mb-3">
                      <p className="mb-2">Preview:</p>
                      <img
                        src={formik.values.image}
                        alt={formik.values.alt || "Profile preview"}
                        className="rounded border"
                        style={{ maxHeight: "100px", maxWidth: "100%" }}
                        onError={(e) => {
                          e.currentTarget.src = "https://bcard-client.onrender.com/assets/user-BErsOE_C.png";
                          e.currentTarget.alt = "Invalid image URL";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="mb-4">
                  <h4 className="border-bottom pb-2">Address Information</h4>
                  <div className="row g-3">
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="state"
                          placeholder="State"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.state}
                          name="state"
                        />
                        <label htmlFor="state">State</label>
                        {formik.touched.state && formik.errors.state && (
                          <p className="text-danger">{formik.errors.state}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="country"
                          placeholder="Country"
                          name="country"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.country}
                          required
                        />
                        <label htmlFor="country">Country</label>
                        {formik.touched.country && formik.errors.country && (
                          <p className="text-danger">{formik.errors.country}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="city"
                          placeholder="City"
                          name="city"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.city}
                          required
                        />
                        <label htmlFor="city">City</label>
                        {formik.touched.city && formik.errors.city && (
                          <p className="text-danger">{formik.errors.city}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="street"
                          placeholder="Street"
                          name="street"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.street}
                          required
                        />
                        <label htmlFor="street">Street</label>
                        {formik.touched.street && formik.errors.street && (
                          <p className="text-danger">{formik.errors.street}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-floating mb-3">
                        <input
                          type="number"
                          className="form-control"
                          id="houseNumber"
                          placeholder="House Number"
                          name="houseNumber"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.houseNumber}
                          required
                        />
                        <label htmlFor="houseNumber">House Number</label>
                        {formik.touched.houseNumber && formik.errors.houseNumber && (
                          <p className="text-danger">{formik.errors.houseNumber}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-floating mb-3">
                        <input
                          type="number"
                          className="form-control"
                          id="zip"
                          placeholder="Zip Code"
                          name="zip"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.zip}
                          required
                        />
                        <label htmlFor="zip">Zip Code</label>
                        {formik.touched.zip && formik.errors.zip && (
                          <p className="text-danger">{formik.errors.zip}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Type */}
                <div className="mb-4">
                  <h4 className="border-bottom pb-2">Account Type</h4>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isBusiness"
                      name="isBusiness"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.isBusiness}
                      disabled={isEditMode} // לא ניתן לשינוי במצב עריכה
                    />
                    <label className="form-check-label" htmlFor="isBusiness">
                      Business Account
                    </label>
                    {isEditMode && (
                      <small className="text-muted d-block">Business status cannot be changed through this form</small>
                    )}
                    {formik.touched.isBusiness && formik.errors.isBusiness && (
                      <p className="text-danger">{formik.errors.isBusiness}</p>
                    )}
                  </div>
                  <div className="alert alert-light">
                    <i className="fas fa-info-circle me-2"></i>
                    Business accounts can create and manage business cards.
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
                    disabled={submitting} 
                  >
                    <i className="fas fa-save me-2"></i>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      submitButtonText
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;