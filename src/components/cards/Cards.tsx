import { FunctionComponent, useEffect, useState } from "react";
import {
  getAllCards,
  deleteCard,
  CARDS_UPDATED_EVENT,
} from "../../services/cardsService";
import { errorMessage, sucessMassage } from "../../services/feedbackService";
import { Card } from "../../interfaces/cards/Cards";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import Bcard from "./Bcard";
import DeleteConfirmationModal from "../admin/modal/DeleteConfirmationModal";

interface CardsProps {}

const Cards: FunctionComponent<CardsProps> = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { searchTerm } = useSearch();

  const deleteHandler = async (id: string, type: "card" | "user" | "item") => {
    try {
      if (type === "card") {
        const card = cards.find((c) => c._id === id);
        if (!card) throw new Error("Card not found");
        await deleteCard(id);
        loadCards(true);
        sucessMassage("Card deleted successfully");
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
    loadCards();

    const handleCardsUpdated = () => {
      console.log("Cards updated event received in Cards");
      loadCards(true);
    };

    window.addEventListener(CARDS_UPDATED_EVENT, handleCardsUpdated);

    return () => {
      window.removeEventListener(CARDS_UPDATED_EVENT, handleCardsUpdated);
    };
  }, []);

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

  const loadCards = async (silent: boolean = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await getAllCards(silent);
      setCards(res.data || []);
    } catch (err) {
      console.error("Error loading cards:", err);
      if (!silent) {
        errorMessage("An error occurred while loading the cards");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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

  if (cards.length === 0) {
    return (
      <div className="text-center my-5">
        <h2>No cards to display</h2>
        <p>Try again later or create new cards</p>
        <button
          onClick={() => loadCards()}
          className="btn btn-outline-primary mt-3"
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh list"}
        </button>
      </div>
    );
  }

  return (
    // בקובץ Cards.tsx - החלק הרלוונטי בלבד

    <div className="container mt-4">
      <div className="mb-4">
        <h1>Business Cards</h1>
      </div>
      {searchTerm && filteredCards.length === 0 && (
        <div className="text-center my-5">
          <h3>No results found for "{searchTerm}"</h3>
          <p>Try searching with different keywords or check your spelling</p>
        </div>
      )}
      {searchTerm && filteredCards.length > 0 && (
        <div className="alert alert-info mb-4">
          Found {filteredCards.length} results for "{searchTerm}"
        </div>
      )}

      {/* שינוי כאן - הוספת justify-content-center למיקום הכרטיסים במרכז */}
      <div className="row justify-content-center">
        {filteredCards.map((card) => (
          <div
            className="col-lg-4 col-md-6 col-sm-6 col-12 mb-4 d-flex justify-content-center"
            key={card._id}
          >
            <Bcard
              card={card}
              isMyCard={Boolean(user && user._id === card.user_id)}
              onDelete={(id) => handleDeleteClick(id, "card")}
              refreshCards={() => loadCards(true)}
            />
          </div>
        ))}
      </div>
      <DeleteConfirmationModal {...deleteModalProps} />
    </div>
  );
};

export default Cards;
