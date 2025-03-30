import { useState } from 'react';

type ItemType = 'user' | 'card' | 'item';

interface DeleteHandler {
  (id: string, type: ItemType): Promise<void>;
}

export function useDeleteConfirmation(deleteHandler: DeleteHandler) {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: ItemType;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = (id: string, type: ItemType) => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      await deleteHandler(itemToDelete.id, itemToDelete.type);

      closeDeleteModal();
    } catch (err) {
      console.error(`Error deleting ${itemToDelete.type}:`, err);
      setDeleteError(`Failed to delete ${itemToDelete.type}. Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    showDeleteModal,
    itemToDelete,
    isDeleting,
    deleteError,
    handleDeleteClick,
    closeDeleteModal,
    handleConfirmDelete,

    deleteModalProps: {
      isOpen: showDeleteModal,
      itemType: itemToDelete?.type || 'item',
      onClose: closeDeleteModal,
      onConfirm: handleConfirmDelete,
      isLoading: isDeleting
    }
  };
}