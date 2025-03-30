import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../../services/userService";
import { errorMessage, sucessMassage } from "../../services/feedbackService";
import LoginForm from "../forms/LoginForm";

interface LoginProps {}

const Login: FunctionComponent<LoginProps> = () => {
  let navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { login, isLoggedIn } = useAuth();
  
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setSubmitting(true);
      
      const res = await loginUser(values);
      
      console.log("Login response:", res.data);
      
      let token;
      if (typeof res.data === 'string') {
        token = res.data;
      } else if (res.data && res.data.token) {
        token = res.data.token;
      } else {
        throw new Error("Token not found in server response");
      }
      
      login(token);
      sucessMassage(`${values.email} התחברת בהצלחה`);
      navigate("/"); 
    } catch (err: any) {
      console.error("Login error:", err);
      let errorMsg = "Login failed";
      
      if (err.response && err.response.data) {
        errorMsg = err.response.data;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      errorMessage(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <LoginForm
      onSubmit={handleSubmit}
      formTitle="Login to Your Account" 
      submitButtonText="Login"
      cancelPath="/"
      submitting={submitting}
    />
  );
};

export default Login;