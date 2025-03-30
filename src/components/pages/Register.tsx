import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UnnormalizedUserForm } from "../../interfaces/users/UnnormalizedUserForm";
import { registerUser } from "../../services/userService";
import { errorMessage, sucessMassage } from "../../services/feedbackService";
import UserForm from "../forms/UserForm";
import { normalizeUser } from "../../utils/users/normalizeUser";


interface RegisterProps {}

const Register: FunctionComponent<RegisterProps> = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const initialValues: UnnormalizedUserForm = {
    first: "",
    middle: "",
    last: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
    alt: "",
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
    isBusiness: false
  };

  const handleSubmit = async (values: UnnormalizedUserForm) => {
    try {
      setSubmitting(true);

      const normalizedUser = normalizeUser(values);

      const response = await registerUser(normalizedUser);
      
      console.log("Registration successful:", response);
      sucessMassage("Registration successful! You are now logged in.");

      if (response.data.token) {
        login(response.data.token);
        navigate("/"); 
      } else {
        navigate("/login"); 
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage(err.response.data);
        } else {
          errorMessage(JSON.stringify(err.response.data));
        }
      } else {
        errorMessage("Registration failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <UserForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      formTitle="Create Account"
      submitButtonText="Register"
      cancelPath="/"
      submitting={submitting}
      isEditMode={false}
    />
  );
};

export default Register;
