import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../interfaces/users/User";
import { useAuth } from "./context/AuthContext";
import { errorMessage, sucessMassage } from "../services/feedbackService";
import { getUserById, updateUser } from "../services/userService";
import UserForm from "./forms/UserForm";
import { UnnormalizedUserForm } from "../interfaces/users/UnnormalizedUserForm";
import { UserUpdateDto } from "../interfaces/users/UserUpdateDto";

interface EditUserProps {}

const EditUser: FunctionComponent<EditUserProps> = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user: authUser, isLoggedIn, refreshUser } = useAuth();

  const [_user, setUser] = useState<User | null>(null);
  
  const [initialValues, setInitialValues] = useState<UnnormalizedUserForm>({
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
  });

  useEffect(() => {
    if (!isLoggedIn || !authUser) {
      errorMessage("You must be logged in to edit a profile");
      navigate("/login");
      return;
    }

    if (!id) {
      errorMessage("User ID is missing");
      navigate("/profile");
      return;
    }

    if (id !== authUser._id && !authUser.isAdmin) {
      errorMessage("You can only edit your own profile");
      navigate("/profile");
      return;
    }

    getUserById(id)
      .then((res) => {
        const userData = res.data;
        setUser(userData);
        
        setInitialValues({
          first: userData.name?.first || "",
          middle: userData.name?.middle || "",
          last: userData.name?.last || "",
          phone: userData.phone || "",
          email: userData.email || "",
          password: "", 
          confirmPassword: "",
          image: userData.image?.url || "",
          alt: userData.image?.alt || "",
          state: userData.address?.state || "",
          country: userData.address?.country || "",
          city: userData.address?.city || "",
          street: userData.address?.street || "",
          houseNumber: userData.address?.houseNumber || "",
          zip: userData.address?.zip || "",
          isBusiness: userData.isBusiness || false,
        });
        
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        errorMessage("Failed to fetch user data");
        navigate("/profile");
      });
  }, [id, navigate, authUser, isLoggedIn]);

  const handleSubmit = async (values: UnnormalizedUserForm) => {
    if (!id) return;
    
    try {
      setSubmitting(true);
      
      const updateData: UserUpdateDto = {
        name: {
          first: values.first,
          middle: values.middle || "",
          last: values.last
        },
        phone: values.phone,
        image: {
          url: values.image || "",
          alt: values.alt || ""
        },
        address: {
          state: values.state || "",
          country: values.country,
          city: values.city,
          street: values.street,
          houseNumber: Number(values.houseNumber),
          zip: Number(values.zip)
        }
      };
      
      console.log("Sending update data:", updateData);
      
      const response = await updateUser(id, updateData);
      
      console.log("Update response:", response);
      sucessMassage(`Profile updated successfully`);
      
      refreshUser();
      
      navigate("/profile");
    } catch (err: any) {
      console.error("Update error:", err);
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage(err.response.data);
        } else {
          errorMessage(JSON.stringify(err.response.data));
        }
      } else {
        errorMessage("Failed to update user");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading user data...</span>
        </div>
      </div>
    );
  }

  return (
    <UserForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      formTitle="Edit Profile"
      submitButtonText="Save Changes"
      cancelPath="/profile"
      submitting={submitting}
      isEditMode={true}
    />
  );
};

export default EditUser;