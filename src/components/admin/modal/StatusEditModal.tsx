import { FunctionComponent, useState, useEffect } from "react";
import { User } from "../../../interfaces/users/User";

interface StatusEditModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userId: string, isBusiness: boolean) => void;
}

const StatusEditModal: FunctionComponent<StatusEditModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
}) => {
  const [isBusiness, setIsBusiness] = useState<boolean>(false);

  // עדכון המצב כאשר המשתמש משתנה
  useEffect(() => {
    if (user) {
      setIsBusiness(user.isBusiness || false);
    }
  }, [user]);

  // אין מה להציג אם אין משתמש או המודל סגור
  if (!user || !isOpen) {
    return null;
  }

  // טיפול בשמירת השינויים
  const handleSave = () => {
    onSave(user._id, isBusiness);
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className={`modal-backdrop fade ${isOpen ? "show" : ""}`}
        style={{
          display: isOpen ? "block" : "none",
          opacity: 0.8,
          backdropFilter: "blur(5px)",
        }}
      ></div>

      {/* Modal */}
      <div
        className={`modal fade ${isOpen ? "show" : ""}`}
        tabIndex={-1}
        role="dialog"
        style={{ display: isOpen ? "block" : "none" }}
        data-bs-theme="auto"
      >
        <div
          className="modal-dialog"
          role="document"
          style={{ borderRadius: "15px" }}
        >
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">Update User Status</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <div className="alert alert-info mb-4">
                Updating status for user:{" "}
                <strong>
                  {user.name?.first} {user.name?.last}
                </strong>
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="userStatusSwitch"
                  checked={isBusiness}
                  onChange={(e) => setIsBusiness(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="userStatusSwitch">
                  Business User
                </label>
              </div>

              <div className="alert alert-secondary">
                <small>
                  <i className="fas fa-info-circle me-2"></i>
                  Only the business status can be updated. To update other user
                  details, please contact support.
                </small>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusEditModal;