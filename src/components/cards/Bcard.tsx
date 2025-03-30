import { FunctionComponent, useState } from "react";
import { toggleCardLike } from "../../services/cardsService";
import { errorMessage } from "../../services/feedbackService";
import { Card } from "../../interfaces/cards/Cards";
import { useAuth } from "../context/AuthContext";
import UniversalImageLink from "./UniversalImageLink";
import ActionButtons from "./ActionButtons";

interface BcardProps {
  card: Card;
  isMyCard?: boolean;
  onLikeChange?: () => void;
  onDelete?: (id: string) => void;
  refreshCards?: () => void;
}

const Bcard: FunctionComponent<BcardProps> = ({
  card,
  onDelete,
  onLikeChange,
  refreshCards,
}) => {
  const { user, isLoggedIn } = useAuth();
  const [isLiked, setIsLiked] = useState<boolean>(
    isLoggedIn && user && card.likes ? card.likes.includes(user._id) : false
  );

  // בדיקה אם המשתמש הוא הבעלים של הכרטיס
  const isOwner = () => {
    return isLoggedIn && user && (user._id === card.user_id || user.isAdmin);
  };

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      errorMessage("עליך להתחבר כדי לסמן לייק");
      return;
    }

    try {
      if (!card._id) return;
      await toggleCardLike(card._id);
      setIsLiked(!isLiked);
      if (onLikeChange) onLikeChange();
      if (refreshCards) refreshCards();
    } catch (error) {
      console.error("שגיאה בהוספת/הסרת לייק:", error);
      errorMessage("אירעה שגיאה בסימון הלייק");
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // הסר תווים שאינם ספרות
    const cleaned = phone.replace(/\D/g, "");

    // בדוק אם זה מספר ישראלי שמתחיל ב-0
    if (cleaned.startsWith("0")) {
      return "+972" + cleaned.substring(1);
    }

    return cleaned;
  };

  return (
    <>
      <div
        className="card m-3 shadow-sm"
        style={{
          width: "18rem",
          position: "relative",
          overflow: "hidden",
          borderRadius: "12px",
        }}
      >
        {/* תמונת הכרטיס */}
        {card._id && (
          <UniversalImageLink
            cardId={card._id}
            imageUrl={card.image?.url}
            imageAlt={card.image?.alt}
            title={card.title}
          />
        )}
        <div className="card-body">
          <h5 className="card-title fw-bold">{card.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{card.subtitle}</h6>

          <hr className="my-2" />

          <div className="small mb-2">
            <i className="fas fa-phone me-2 text-primary"></i>
            {card.phone}
          </div>

          <div className="small mb-2">
            <i className="fas fa-map-marker-alt me-2 text-primary"></i>
            {`${card.address.street} ${card.address.houseNumber}, ${card.address.city}`}
          </div>
        </div>

        <div className="card-footer d-flex justify-content-center align-items-center">
          <ActionButtons
            card={card}
            isLoggedIn={isLoggedIn}
            isLiked={isLiked}
            handleLikeClick={handleLikeClick}
            formatPhoneNumber={formatPhoneNumber}
            styleClass="action-icon"
            isOwner={isOwner() === true}
            onDelete={onDelete}
            displayMode="all"
          />
        </div>
      </div>

      <style>{`
        .action-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          padding: 0;
          transition: all 0.2s;
        }
        .action-icon:hover {
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
};

export default Bcard;