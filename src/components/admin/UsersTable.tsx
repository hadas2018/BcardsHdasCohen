import { FunctionComponent, useState } from "react";
import { User } from "../../interfaces/users/User";
import Pagination from "../Pagination";

interface UsersTableProps {
  users: User[];
  onUpdateStatus: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const UsersTable: FunctionComponent<UsersTableProps> = ({ 
  users, 
  onUpdateStatus,
  onDeleteUser 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(users.length / itemsPerPage);
  
  const currentUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!users.length) {
    return (
      <div className="alert alert-info text-center">
        No users found!
      </div>
    );
  }

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className="align-middle">
                <td>
                  {user.name?.first} {user.name?.last}
                </td>
                <td>{user.email}</td>
                <td>{user.phone || "-"}</td>
                <td>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <div className="d-flex flex-column gap-1">
                    <span className={`badge ${user.isBusiness ? 'bg-success' : 'bg-secondary'}`}>
                      {user.isBusiness ? 'Business' : 'Regular'}
                    </span>
                    {user.isAdmin && (
                      <span className="badge bg-danger">
                        Admin
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="d-flex">
                    {!user.isAdmin && (
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => onUpdateStatus(user)}
                        title="Update User Status"
                      >
                        <i className="fas fa-user-tag"></i>
                      </button>
                    )}
                    {!user.isAdmin && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDeleteUser(user._id)}
                        title="Delete User"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                    {user.isAdmin && (
                      <span className="text-muted">
                        <i className="fas fa-lock me-2"></i>
                        Protected
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UsersTable;