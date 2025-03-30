import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../interfaces/cards/Cards";

interface ActionButtonsProps {
  card: Card;
  isLoggedIn: boolean;
  isLiked: boolean;
  handleLikeClick: () => Promise<void>;
  formatPhoneNumber: (phone: string) => string;
  styleClass?: string; 
  iconSize?: number; 
  isOwner?: boolean; 
  onDelete?: (id: string) => void; 
  displayMode?: 'all' | 'basic' | 'edit' | 'delete'; 
}

const ActionButtons: FunctionComponent<ActionButtonsProps> = ({
  card,
  isLoggedIn,
  isLiked,
  handleLikeClick,
  formatPhoneNumber,
  styleClass = "btn-outline",
  iconSize = 20,
  isOwner = false,
  onDelete,
  displayMode = 'all',
}) => {
 
  const hasWebsite = !!card.web;
  
  // הגדרת גודל האייקונים של Font Awesome לפי הפרמטר שהתקבל
  const iconStyle = { fontSize: `${iconSize}px` };
  
  return (
    <div className="d-flex gap-2">
      {/* Phone icon */}
      <a
        href={`tel:${card.phone}`}
        className={`btn btn-outline-primary ${styleClass}`}
        title="Call"
      >
        <i className="fas fa-phone" style={iconStyle}></i>
      </a>

      {/* WhatsApp icon */}
      <a
        href={`https://wa.me/${formatPhoneNumber(card.phone)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn-outline-success ${styleClass}`}
        title="Send WhatsApp message"
      >
        <i className="fab fa-whatsapp" style={iconStyle}></i>
      </a>

      {/* Website icon - only shows if website exists */}
      {hasWebsite && (
        <a
          href={card.web}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-outline-info ${styleClass}`}
          title="Visit website"
        >
          <i className="fas fa-external-link-alt" style={iconStyle}></i>
        </a>
      )}

      {/* Like icon - only for logged in users */}
      {isLoggedIn && (
        <button
          className={`btn ${
            isLiked ? "btn-danger" : "btn-outline-danger"
          } ${styleClass}`}
          onClick={handleLikeClick}
          title={isLiked ? "Remove like" : "Add like"}
        >
          <i className={`${isLiked ? 'fas' : 'far'} fa-heart`} style={iconStyle}></i>
        </button>
      )}

      {/* Edit button - only for owners */}
      {isOwner && (displayMode === 'all' || displayMode === 'edit') && (
        <Link
          to={`/edit-card/${card._id}`}
          className={`btn btn-outline-warning ${styleClass}`}
          title="Edit card"
        >
          <i className="fas fa-edit" style={iconStyle}></i>
        </Link>
      )}

      {/* Delete button - only for owners */}
      {isOwner && (displayMode === 'all' || displayMode === 'delete') && card._id && (
        <button
          className={`btn btn-outline-danger ${styleClass}`}
          onClick={() => {
            try {
              if (onDelete) {
                onDelete(card._id as string);
              } else {
                console.warn("Delete function not defined");
              }
            } catch (err) {
              console.error("Error executing delete function:", err);
            }
          }}
          title="Delete card"
        >
          <i className="fas fa-trash-alt" style={iconStyle}></i>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;