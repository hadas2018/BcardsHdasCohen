import { FunctionComponent, useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface ImageLinkProps {
  // אופציה א: קישור לכרטיס פנימי
  cardId?: string;
  
  // אופציה ב: קישור חיצוני
  externalUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  title: string;
  className?: string;
  height?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  openInNewTab?: boolean;
  onClick?: () => void;
}

// תמונת placeholder סטטית
const PLACEHOLDER_IMAGE ="/public/oops.png"

const UniversalImageLink: FunctionComponent<ImageLinkProps> = ({
  cardId,
  externalUrl,
  imageUrl,
  imageAlt,
  title,
  className = "card-img-top",
  height = "180px",
  objectFit = "cover",
  openInNewTab = false,
  onClick
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const handleImageError = () => {
    setImageError(true);
  };
  const imageSrc = imageError || !imageUrl ? PLACEHOLDER_IMAGE : imageUrl; 
  const isExternalLink = !!externalUrl;
  const linkTarget = openInNewTab || isExternalLink ? "_blank" : undefined;
  const linkRel = openInNewTab || isExternalLink ? "noopener noreferrer" : undefined;
  const imageComponent = (
    <div 
      style={{ 
        height,
        width: "100%", 
        backgroundColor: "#f8f9fa",
        position: "relative",
        overflow: "hidden",
        borderTopLeftRadius: "0.375rem",
        borderTopRightRadius: "0.375rem"
      }}
    >
      <img
        className={className}
        src={imageSrc}
        alt={imageAlt || title}
        style={{ 
          height: "100%", 
          width: "100%", 
          objectFit
        }}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
  if (isExternalLink) {
    return (
      <a 
        href={externalUrl} 
        target={linkTarget} 
        rel={linkRel} 
        onClick={onClick}
      >
        {imageComponent}
      </a>
    );
  }
  
  if (cardId) {
    return (
      <Link 
        to={`/cards/${cardId}`} 
        target={linkTarget} 
        onClick={onClick}
      >
        {imageComponent}
      </Link>
    );
  }
  return (
    <div onClick={onClick}>
      {imageComponent}
    </div>
  );
};

export default UniversalImageLink;