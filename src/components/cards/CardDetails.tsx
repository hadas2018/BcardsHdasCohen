import { FunctionComponent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card } from "../../interfaces/cards/Cards";
import { errorMessage } from "../../services/feedbackService";
import { getCardById, toggleCardLike } from "../../services/cardsService";
import CardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardLocation from "./CardLocation";

interface CardDetailsProps {}

const CardDetails: FunctionComponent<CardDetailsProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isLoggedIn } = useAuth();
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getCardById(id)
      .then((res) => {
        setCard(res.data);
        if (isLoggedIn && user && res.data.likes) {
          setIsLiked(res.data.likes.includes(user._id));
        }
      })
      .catch((err) => {
        console.error("שגיאה בטעינת הכרטיס:", err);
        errorMessage("לא ניתן לטעון את פרטי הכרטיס");
        navigate("/"); 
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, isLoggedIn, user, navigate]);

  const handleLikeClick = async () => {
    if (!isLoggedIn || !card) {
      errorMessage("You must be logged in to like!");
      return;
    }

    try {
      await toggleCardLike(card._id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error adding/removing like:", error);
      errorMessage("An error occurred while marking the like!");
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      return "+972" + cleaned.substring(1);
    }

    return cleaned;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">loading...</span>
        </div>
      </div>
    );
  }

  if (!card) {
    return <div className="alert alert-danger">The card was not found!</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          {/* כרטיס המידע העיקרי */}
          <div className="card shadow-lg rounded-3 mb-4">
            <CardHeader card={card} />
            <CardBody
              card={card}
              isLoggedIn={isLoggedIn}
              isLiked={isLiked}
              handleLikeClick={handleLikeClick}
              formatPhoneNumber={formatPhoneNumber}
            />
          </div>
        </div>

        <div className="col-lg-4">
          <CardLocation card={card} />

          {/* חזרה לדף הבית */}
          <button
            className="btn btn-outline-secondary w-100 mb-4"
            onClick={() => navigate("/")}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Back to home page
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;