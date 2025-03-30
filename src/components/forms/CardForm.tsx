import { FormikValues, useFormik } from "formik";
import { FunctionComponent } from "react";
import * as yup from "yup";
import { UnnormalizedCard } from "../../interfaces/cards/UnnormalizedCard";
import { useNavigate } from "react-router-dom";

interface CardFormProps {
  initialValues?: UnnormalizedCard;
  onSubmit: (values: UnnormalizedCard) => Promise<void>;
  formTitle: string;
  submitButtonText: string;
  cancelPath?: string;
  submitting?: boolean;
}

const CardForm: FunctionComponent<CardFormProps> = ({
  initialValues = {
    title: "",
    subtitle: "",
    description: "",
    phone: "",
    email: "",
    web: "",
    url: "",
    alt: "",
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: 0,
    zip: 0,
  },
  onSubmit,
  formTitle,
  submitButtonText,
  cancelPath = "/",
  submitting = false
}) => {
  const navigate = useNavigate();

  const validationSchema = yup.object({
    title: yup.string().min(2).max(256).required("Title is required"),
    subtitle: yup.string().min(2).max(256).required("Subtitle is required"),
    description: yup.string().min(2).max(1024).required("Description is required"),
    phone: yup.string().min(9).max(11).required("Phone number is required"),
    email: yup.string().email("Invalid email address").min(5).required("Email is required"),
    web: yup.string().min(5).url("Website URL must be valid"),
    url: yup.string().min(14).url("Image URL must be valid"),
    alt: yup.string().min(2).max(256),
    state: yup.string().min(2).max(256),
    country: yup.string().min(2).max(256).required("Country is required"),
    city: yup.string().min(2).max(256).required("City is required"),
    street: yup.string().min(2).max(256).required("Street is required"),
    houseNumber: yup.number().min(1).required("House number is required"),
    zip: yup.number().min(1).required("Zip code is required"),
  });

  const formik: FormikValues = useFormik<FormikValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onSubmit(values as UnnormalizedCard);
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
              <h2 className="mb-0 d-flex align-items-center">
                {formTitle}
              </h2>
            </div>
            <div className="card-body">
              <form onSubmit={formik.handleSubmit}>
                {/* Card Information */}
                <div className="mb-4">
                  <h4 className="border-bottom pb-2">
                   Card Information
                  </h4>
                  <div className="row g-3">
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          placeholder="Title"
                          name="title"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.title}
                          required
                        />
                        <label htmlFor="title">Title</label>
                        {formik.touched.title && formik.errors.title && (
                          <p className="text-danger">{formik.errors.title}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="subtitle"
                          placeholder="Subtitle"
                          name="subtitle"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.subtitle}
                          required
                        />
                        <label htmlFor="subtitle">Subtitle</label>
                        {formik.touched.subtitle && formik.errors.subtitle && (
                          <p className="text-danger">{formik.errors.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <textarea
                          className="form-control"
                          id="description"
                          placeholder="Description"
                          name="description"
                          style={{ height: "100px" }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                          required
                        ></textarea>
                        <label htmlFor="description">Description</label>
                        {formik.touched.description && formik.errors.description && (
                          <p className="text-danger">{formik.errors.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-4">
                  <h4 className="border-bottom pb-2">
                   Contact Information
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          placeholder="Phone"
                          name="phone"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.phone}
                          required
                        />
                        <label htmlFor="phone">Phone</label>
                        {formik.touched.phone && formik.errors.phone && (
                          <p className="text-danger">{formik.errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
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
                        />
                        <label htmlFor="email">Email</label>
                        {formik.touched.email && formik.errors.email && (
                          <p className="text-danger">{formik.errors.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="url"
                          className="form-control"
                          id="web"
                          placeholder="Website"
                          name="web"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.web}
                        />
                        <label htmlFor="web">Website</label>
                        {formik.touched.web && formik.errors.web && (
                          <p className="text-danger">{formik.errors.web}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Information */}
                <div className="mb-4">
                  <h4 className="border-bottom pb-2">
                   Card Image
                  </h4>
                  <div className="row g-3">
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="url"
                          className="form-control"
                          id="url"
                          placeholder="Image URL"
                          name="url"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.url}
                        />
                        <label htmlFor="url">Image URL</label>
                        {formik.touched.url && formik.errors.url && (
                          <p className="text-danger">{formik.errors.url}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="alt"
                          placeholder="Alternative Text"
                          name="alt"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.alt}
                        />
                        <label htmlFor="alt">Alternative Text</label>
                        {formik.touched.alt && formik.errors.alt && (
                          <p className="text-danger">{formik.errors.alt}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {formik.values.url && (
                    <div className="text-center mt-2 mb-3">
                      <p className="mb-2">Preview:</p>
                      <div className=" rounded p-2">
                        <img
                          src={formik.values.url}
                          alt={formik.values.alt || "Card image preview"}
                          className="rounded"
                          style={{ maxHeight: "150px", maxWidth: "100%" }}
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/300x150?text=Image+not+found";
                            e.currentTarget.alt = "Image not available";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="mb-4">
                  <h4 className="border-bottom pb-2">
                  Address Information
                  </h4>
                  <div className="row g-3">
                    <div className="col-md">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="state"
                          placeholder="State"
                          name="state"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.state}
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

                <div className="mt-4 d-flex gap-3 justify-content-between">
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

export default CardForm;