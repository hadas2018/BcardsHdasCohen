import { FunctionComponent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UnnormalizedCard } from "../../interfaces/cards/UnnormalizedCard";
import { normalizeCard } from "../../utils/cards/NormalizeCard";
import CardForm from "../forms/CardForm";
import { errorMessage, sucessMassage } from "../../services/feedbackService";
import { postNewCard } from "../../services/cardsService";


interface NewCardProps {}

const NewCard: FunctionComponent<NewCardProps> = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  
  useEffect(() => {
    if (!isLoggedIn) {
      errorMessage("You must be logged in to add a new card");
      navigate("/login");
      return;
    }
    if (user && !user.isAdmin && !user.isBusiness) {
      errorMessage("You don't have permission to add a new card");
      navigate("/");
    }
  }, [isLoggedIn, user, navigate]);
  const handleSubmit = async (values: UnnormalizedCard) => {
    if (!isLoggedIn || (user && !user.isAdmin && !user.isBusiness)) {
      errorMessage("You don't have permission to add a new card");
      throw new Error("No permission to add card");
    }
    
    try {
      let normalizedCard = normalizeCard(values);
      const response = await postNewCard(normalizedCard);
      console.log(response);
      sucessMassage(`Card created successfully!`);
      navigate("/my-cards");
    } catch (err: any) {
      console.log(err);
      errorMessage(err.response?.data || "An error occurred while creating the card");
      throw err;
    }
  };
  
  if (!isLoggedIn || (user && !user.isAdmin && !user.isBusiness)) {
    return null;
  }
  
  return (
    <CardForm 
      onSubmit={handleSubmit}
      formTitle="Create New Business Card"
      submitButtonText="Create Business"
      cancelPath="/"
    />
  );
};

export default NewCard;