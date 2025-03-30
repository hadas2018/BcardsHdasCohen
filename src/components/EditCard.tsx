import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../interfaces/cards/Cards";
import { useAuth } from "./context/AuthContext";
import { errorMessage, sucessMassage } from "../services/feedbackService";
import { getCardById, updateCard } from "../services/cardsService";
import CardForm from "./forms/CardForm";
import { UnnormalizedCard } from "../interfaces/cards/UnnormalizedCard";
import { CardUpdateDto } from "../interfaces/cards/CardUpdateDto";

interface EditCardProps {}

const EditCard: FunctionComponent<EditCardProps> = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      errorMessage("You must be logged in to edit a ticket");
      navigate("/login");
      return;
    }

    if (!id) {
      errorMessage("Card ID is missing");
      navigate("/");
      return;
    }

    getCardById(id)
      .then((res) => {
        const cardData = res.data;
        setCard(cardData);

        if (cardData.user_id !== user._id && !user.isAdmin) {
          errorMessage("You do not have permission to edit this card");
          navigate("/");
          return;
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("שגיאה בטעינת נתוני הכרטיס:", err);
        errorMessage("שגיאה בטעינת נתוני הכרטיס");
        navigate("/");
      });
  }, [id, navigate, user, isLoggedIn]);

  const handleSubmit = async (values: UnnormalizedCard) => {
    if (!id) return;

    try {
      setSubmitting(true);
      
      const cardForUpdate: CardUpdateDto = {
        title: values.title,
        subtitle: values.subtitle,
        description: values.description,
        phone: values.phone,
        email: values.email,
        web: values.web || "",
        image: {
          url: values.url || "",
          alt: values.alt || "",
        },
        address: {
          state: values.state || "",
          country: values.country,
          city: values.city,
          street: values.street,
          houseNumber: values.houseNumber,
          zip: values.zip,
        }
      };

      const response = await updateCard(id, cardForUpdate as unknown as Omit<Card, "_id">);
      
      console.log("Card updated successfully:", response);
      sucessMassage("הכרטיס עודכן בהצלחה");
      navigate("/my-cards");
    } catch (err: any) {
      console.error("שגיאה בעדכון הכרטיס:", err);
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage(err.response.data);
        } else {
          errorMessage(JSON.stringify(err.response.data));
        }
      } else {
        errorMessage("שגיאה בעדכון הכרטיס");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">טוען נתונים...</span>
        </div>
      </div>
    );
  }

  const initialValues: UnnormalizedCard = {
    title: card?.title || "",
    subtitle: card?.subtitle || "",
    description: card?.description || "",
    phone: card?.phone || "",
    email: card?.email || "",
    web: card?.web || "",
    url: card?.image?.url || "",
    alt: card?.image?.alt || "",
    state: card?.address?.state || "",
    country: card?.address?.country || "",
    city: card?.address?.city || "",
    street: card?.address?.street || "",
    houseNumber: card?.address?.houseNumber || 0,
    zip: card?.address?.zip || 0,
  };

  return (
    <CardForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      formTitle="Edit a business card"
      submitButtonText="Save changes"
      cancelPath="/my-cards"
      submitting={submitting}
    />
  );
};

export default EditCard;