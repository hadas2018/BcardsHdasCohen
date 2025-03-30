import { FunctionComponent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFavoriteCards, deleteCard } from "../../services/cardsService";
import { errorMessage, sucessMassage } from "../../services/feedbackService";
import { Card } from "../../interfaces/cards/Cards";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import Bcard from "../cards/Bcard";
import DeleteConfirmationModal from "../admin/modal/DeleteConfirmationModal";

interface FavoriteCardsProps {}

const FavoriteCards: FunctionComponent<FavoriteCardsProps> = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, user } = useAuth();
  const { searchTerm } = useSearch();
  const navigate = useNavigate();
  const deleteHandler = async (id: string, type: "card" | "user" | "item") => {
    try {
      if (type === "card") {
        const card = cards.find((c) => c._id === id);
        if (!card) throw new Error("Card not found");
        if (user && (user._id === card.user_id || user.isAdmin)) {
          await deleteCard(id);
          setCards((prev) => prev.filter((c) => c._id !== id));
          sucessMassage("Card deleted successfully");
        } else {
          errorMessage("You don't have permission to delete this card");
          throw new Error("No delete permissions");
        }
      }
    } catch (err) {
      console.error("Error deleting card:", err);
      errorMessage("An error occurred while deleting the card");
      throw err;
    }
  };

  const { handleDeleteClick, deleteModalProps } =
    useDeleteConfirmation(deleteHandler);

  useEffect(() => {
    if (!isLoggedIn) {
      errorMessage("You must be logged in to view favorite cards");
      navigate("/login");
      return;
    }

    loadFavoriteCards();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCards(cards);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = cards.filter(
      (card) =>
        card.title.toLowerCase().includes(searchTermLower) ||
        card.description.toLowerCase().includes(searchTermLower) ||
        (card.address &&
          ((card.address.city &&
            card.address.city.toLowerCase().includes(searchTermLower)) ||
            (card.address.street &&
              card.address.street.toLowerCase().includes(searchTermLower)) ||
            (card.address.country &&
              card.address.country.toLowerCase().includes(searchTermLower))))
    );

    setFilteredCards(filtered);
  }, [searchTerm, cards]);

  const loadFavoriteCards = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const res = await getFavoriteCards(true);
      if (res.data) {
        setCards(res.data);
      }
    } catch (err) {
      console.error("Error loading favorite cards:", err);
      setError("An error occurred while loading favorite cards");
      errorMessage("An error occurred while loading favorite cards");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLikeChange = () => {
    loadFavoriteCards(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-5" role="alert">
        <h4 className="alert-heading">Error Loading Data</h4>
        <p>{error}</p>
        <hr />
        <div className="d-flex justify-content-between">
          <button
            onClick={() => loadFavoriteCards(true)}
            className="btn btn-outline-danger"
          >
            Try Again
          </button>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center my-5">
        <h2>No Favorite Cards</h2>
        <p>You haven't marked any cards as favorites yet.</p>
        <p>
          You can mark cards as favorites by clicking the heart icon on cards.
        </p>
        <div className="mt-4">
          <Link to="/" className="btn btn-primary mx-2">
            Back to Home and Discover Cards
          </Link>
          <button
            onClick={() => loadFavoriteCards(true)}
            className="btn btn-outline-secondary mx-2"
          >
            Refresh List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Favorite Cards</h1>
        <div>
          <button
            onClick={() => loadFavoriteCards(true)}
            className="btn btn-outline-primary me-2"
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Refreshing...
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt me-2"></i>
                Refresh List
              </>
            )}
          </button>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>

      {searchTerm && filteredCards.length === 0 && (
        <div className="alert alert-info">
          <h5>No results found for "{searchTerm}"</h5>
          <p className="mb-0">
            Try searching with different keywords or check the spelling
          </p>
        </div>
      )}

      {searchTerm && filteredCards.length > 0 && (
        <div className="alert alert-info mb-4">
          Found {filteredCards.length} results for "{searchTerm}"
        </div>
      )}

      <div className="row">
        {filteredCards.map((card) => (
          <div className="col-md-4 col-sm-6 mb-4" key={card._id}>
            <Bcard
              card={card}
              isMyCard={Boolean(user && user._id === card.user_id)}
              onLikeChange={handleLikeChange}
              onDelete={(id) => handleDeleteClick(id, "card")}
              refreshCards={() => loadFavoriteCards(true)}
            />
          </div>
        ))}
      </div>

      <DeleteConfirmationModal {...deleteModalProps} />
    </div>
  );
};

export default FavoriteCards;
