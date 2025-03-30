import { FunctionComponent } from "react";
import { Card } from "../../interfaces/cards/Cards";

interface CardLocationProps {
  card: Card;
}

const CardLocation: FunctionComponent<CardLocationProps> = ({ card }) => {

  const getDirectionsLink = () => {
    const address = `${card.address.street} ${card.address.houseNumber}, ${card.address.city}, ${card.address.country}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      address
    )}`;
  };

  return (
    <div className="card shadow-lg rounded-3 mb-4 overflow-hidden">
      <div className="card-header py-3">
        <h4 className="card-title mb-0">
          <i className="fas fa-map-marker-alt me-2 text-primary"></i>
          business location
        </h4>
      </div>

      {/* מפת Google מוטמעת */}
      <div style= {{ position: "relative", height: "300px", width: "100%" }}>
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            `${card.address.street} ${card.address.houseNumber}, ${card.address.city}, ${card.address.country}`
          )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="business location"
        ></iframe>
      </div>

      <div className="card-footer bg-light py-3">
        <a
          href={getDirectionsLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary w-100"
        >
          <i className="fas fa-directions me-2"></i>
          Directions
        </a>
      </div>
    </div>
  );
};

export default CardLocation;