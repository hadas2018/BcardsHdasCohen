import { FunctionComponent, useState } from "react";
import { Card } from "../../interfaces/cards/Cards";
import Pagination from "../Pagination"; 

interface CardsTableProps {
  cards: Card[];
  onDeleteCard: (cardId: string) => void;
}

const CardsTable: FunctionComponent<CardsTableProps> = ({
  cards,
  onDeleteCard,
}) => {
  // פאגינציה
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // חישוב מספר הדפים הכולל
  const totalPages = Math.ceil(cards.length / itemsPerPage);
  
  // פילטור הנתונים לדף הנוכחי
  const currentCards = cards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!cards.length) {
    return (
      <div className="alert alert-info text-center">
        No cards found!
      </div>
    );
  }

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCards.map((card) => (
              <tr key={card._id} className="align-middle">
                <td>{card.title}</td>
                <td>{card.email || "-"}</td>
                <td>{card.phone}</td>
                <td>{new Date(card.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDeleteCard(card._id)}
                      title="Delete Card"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* שימוש בקומפוננטת הפאגינציה */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CardsTable;