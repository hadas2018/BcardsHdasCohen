import { FunctionComponent } from "react";
import { Card } from "../../interfaces/cards/Cards";
import ActionButtons from "./ActionButtons"; 

interface CardBodyProps {
  card: Card;
  isLoggedIn: boolean;
  isLiked: boolean;
  handleLikeClick: () => Promise<void>;
  formatPhoneNumber: (phone: string) => string;
  isOwner?: boolean; 
}

const CardBody: FunctionComponent<CardBodyProps> = ({
  card,
  isLoggedIn,
  isLiked,
  handleLikeClick,
  formatPhoneNumber,
  isOwner = false, 
}) => {
  const handleDeleteCard = async (id: string) => {
    console.log("פונקציית מחיקה לא מיושמת בCardBody", id);
  };

  return (
    <div className="card-body">
      <div className="d-flex justify-content-end mb-3">
        <ActionButtons
          card={card}
          isLoggedIn={isLoggedIn}
          isLiked={isLiked}
          handleLikeClick={handleLikeClick}
          formatPhoneNumber={formatPhoneNumber}
          styleClass="rounded-circle p-2"
          iconSize={24}
          isOwner={isOwner}
          onDelete={handleDeleteCard}
          displayMode="basic"
        />
      </div>
      <div className="mb-3">
        <h1 className="card-title display-5 fw-bold">{card.title}</h1>
        <h3 className="card-subtitle text-muted">{card.subtitle}</h3>
      </div>

      {/* תיאור */}
      <div className="mb-4">
        <h4 className="mb-2">Business description</h4>
        <p className="lead">{card.description}</p>
      </div>

      <hr className="my-4" />

      {/* פרטי קשר */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h4 className="mb-3">Contact details</h4>
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex align-items-center">
              <i className="fas fa-phone me-3 text-primary"></i>
              <span>{card.phone}</span>
            </li>
            <li className="list-group-item d-flex align-items-center">
              <i className="fas fa-envelope me-3 text-primary"></i>
              <span>{card.email}</span>
            </li>
            {card.web && (
              <li className="list-group-item">
                <div className="d-flex align-items-start">
                  <i className="fas fa-globe me-3 text-primary flex-shrink-0 mt-1"></i>
                  <a
                    href={card.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {card.web}
                  </a>
                </div>
              </li>
            )}
          </ul>
        </div>

        <div className="col-md-6">
          <h4 className="mb-3">address</h4>
          <address className="mb-0">
            <div className="d-flex align-items-center mb-2">
              <i className="fas fa-map-marker-alt me-3 text-primary"></i>
              <div>
                <div>
                  {card.address.street} {card.address.houseNumber}
                </div>
                <div>{card.address.city}</div>
                <div>{card.address.country}</div>
              </div>
            </div>
          </address>
        </div>
      </div>
    </div>
  );
};

export default CardBody;