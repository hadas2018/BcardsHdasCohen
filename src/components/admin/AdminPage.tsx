import { useSearch } from "../context/SearchContext";
import {
  fetchAllUsers,
  fetchAllCards,
  deleteUser,
  deleteCard,
  updateBusinessStatus,
} from "../../services/adminService";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";

// Types
import { useAuth } from "../context/AuthContext";
import CardsTable from "./CardsTable";
import UsersTable from "./UsersTable";
import { User } from "../../interfaces/users/User";
import { Card } from "../../interfaces/cards/Cards";
import { FunctionComponent, useEffect, useState } from "react";
import DeleteConfirmationModal from "./modal/DeleteConfirmationModal";
import StatusEditModal from "./modal/StatusEditModal";

interface AdminPageProps {}

const AdminPage: FunctionComponent<AdminPageProps> = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { searchTerm } = useSearch();
  const [activeTab, setActiveTab] = useState<"users" | "cards">("users");

  // Auth context
  const { isLoggedIn, user } = useAuth();

  const [showStatusEditModal, setShowStatusEditModal] = useState<boolean>(false);
  const [userToUpdateStatus, setUserToUpdateStatus] = useState<User | null>(null);

  const deleteHandler = async (id: string, type: "user" | "card" | "item") => {
    try {
      if (type === "user") {
        await deleteUser(id);
        setUsers((prev) => prev.filter((user) => user._id !== id));
      } else if (type === "card") {
        await deleteCard(id);
        setCards((prev) => prev.filter((card) => card._id !== id));
      }
    } catch (err) {
      throw err; 
    }
  };

  const { handleDeleteClick, deleteModalProps, deleteError } =
    useDeleteConfirmation(deleteHandler);

  useEffect(() => {
    if (deleteError) {
      setError(deleteError);
    }
  }, [deleteError]);

  const loadUsers = async () => {
    try {
      const usersData = await fetchAllUsers();
      setUsers(usersData);
      
      if (!searchTerm.trim()) {
        setFilteredUsers(usersData);
      } else {
        const searchTermLower = searchTerm.toLowerCase();
        const matchedUsers = usersData.filter(
          (user) =>
            user.name?.first?.toLowerCase().includes(searchTermLower) ||
            user.name?.last?.toLowerCase().includes(searchTermLower) ||
            user.email?.toLowerCase().includes(searchTermLower)
        );
        setFilteredUsers(matchedUsers);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError("Failed to load users. Please try again.");
    }
  };
  
  useEffect(() => {
    const loadData = async () => {
      if (!isLoggedIn || !user?.isAdmin) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        await loadUsers();
     
        const cardsData = await fetchAllCards();
        setCards(cardsData);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      setFilteredCards(cards);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
 
    const matchedUsers = users.filter(
      (user) =>
        user.name?.first?.toLowerCase().includes(searchTermLower) ||
        user.name?.last?.toLowerCase().includes(searchTermLower) ||
        user.email?.toLowerCase().includes(searchTermLower)
    );
    setFilteredUsers(matchedUsers);
  
    const matchedCards = cards.filter(
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
    setFilteredCards(matchedCards);
  }, [searchTerm, users, cards]);

  const handleUpdateStatus = (user: User) => {
    setUserToUpdateStatus(user);
    setShowStatusEditModal(true);
  };

  const handleSaveStatusEdit = async (userId: string, isBusiness: boolean) => {
    if (isUpdating) return; 
    
    try {
      setIsUpdating(true);
      setError(null);
      
      console.log(`Updating business status for user ${userId} to ${isBusiness}`);
     
      await updateBusinessStatus(userId, isBusiness);
    
      await loadUsers();
    
      setShowStatusEditModal(false);
      setUserToUpdateStatus(null);
      
      alert("User status updated successfully!");
      
    } catch (err) {
      console.error("Failed to update user status:", err);
      setError("Failed to update user status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };
 
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 py-5">
        <div className="spinner-border text-primary me-3" role="status">
          <span className="visually-hidden">Loading admin dashboard...</span>
        </div>
        <span>Loading admin dashboard...</span>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Access Denied</h4>
          <p>
            You don't have permission to view this page. Only admin users can
            access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Client Relations/Content Management</h1>
        <p className="lead">
          Here you can View, Edit Status & Delete Users and Cards
        </p>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}
     
      {searchTerm && (
        <div className="mb-4">
          {filteredUsers.length > 0 || filteredCards.length > 0 ? (
            <div className="alert alert-info">
              Found for the search {filteredUsers.length} users &- {filteredCards.length}{" "}
              Cards   "{searchTerm}"
            </div>
          ) : (
            <div className="alert alert-warning">
              No search results found! "{searchTerm}"
            </div>
          )}
        </div>
      )}
     
      <ul className="nav nav-tabs mb-4 justify-content-center">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "cards" ? "active" : ""}`}
            onClick={() => setActiveTab("cards")}
          >
            Cards
          </button>
        </li>
      </ul>
      
      <div className="mb-5">
        <h2 className="text-center mb-4">
          {activeTab === "users" ? "Users" : "Cards"} Management
        </h2>

        {activeTab === "users" ? (
          <UsersTable
            users={filteredUsers}
            onUpdateStatus={handleUpdateStatus}
            onDeleteUser={(id) => handleDeleteClick(id, "user")}
          />
        ) : (
          <CardsTable
            cards={filteredCards}
            onDeleteCard={(id) => handleDeleteClick(id, "card")}
          />
        )}
      </div>

      <DeleteConfirmationModal {...deleteModalProps} />
      
      <StatusEditModal
        isOpen={showStatusEditModal}
        user={userToUpdateStatus}
        onClose={() => {
          setShowStatusEditModal(false);
          setUserToUpdateStatus(null);
        }}
        onSave={handleSaveStatusEdit}
      />
    </div>
  );
};

export default AdminPage;
