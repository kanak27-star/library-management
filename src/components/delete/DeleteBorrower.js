import React, { lazy, useState, startTransition } from "react";
import API_URL from "../config"; // adjust path

const SearchBar = lazy(() => import("../search_comp/SearchBar"));
const ItemList = lazy(() => import("../search_comp/ItemList"));
const FormComp = lazy(() => import("../search_comp/FormComp"));

const DeleteBorrower = ({ onBorrowerDeleted }) => {
  const [borrowers, setBorrowers] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState('');
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [showBorrowerList, setShowBorrowerList] = useState(true);

  const apiUrl = API_URL; // Vite env variable for backend

  // Search borrowers
  const handleSearch = async (query) => {
    try {
      const response = await fetch(`${apiUrl}/api/borrowers
/searchdel?query=${query}`);
      const data = await response.json();
      setBorrowers(data);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
      setBorrowers([]);
    }
  };

  // Select a borrower
  const handleSelectBorrower = async (borrower) => {
    startTransition(() => {
      setSelectedBorrower(borrower);
    });
  };

  // Reset form
  const handleReset = () => {
    startTransition(() => {
      setSelectedBorrower(null);
      setBorrowers([]);
      setConfirmDelete('');
      setShowBorrowerList(true);
    });
  };

  // Delete borrower
  const handleDelete = async () => {
    if (confirmDelete === 'delete' && selectedBorrower) {
      try {
        const response = await fetch(`${apiUrl}/api/borrowers
/${selectedBorrower._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          alert('Borrower deleted successfully');
          console.log('Borrower deleted successfully!');
          setConfirmDelete('');
          setSelectedBorrower(null);
          setShowBorrowerList(true);
          setBorrowers([]);
          handleReset();
          onBorrowerDeleted();
        } else {
          console.error('Failed to delete borrower:', response.statusText);
          alert('Failed to delete borrower. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting borrower:', error);
        alert('Error deleting borrower. Check console for details.');
      }
    } else {
      alert('Please type "delete" in the confirmation box to delete the borrower.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Delete Borrower</h1>
      {!selectedBorrower ? (
        <div className='text-gray-500'>
          <SearchBar onSearch={handleSearch} placeholder="Search Borrower..." />
          <ItemList
            items={borrowers}
            onSelectItem={handleSelectBorrower}
            isVisible={showBorrowerList}
            itemType="borrower"
          />
        </div>
      ) : (
        <>
          <FormComp setConfirm={setConfirmDelete} selectedItem={selectedBorrower} type="deleteborrower" />
          <div className="mt-4">
            <button
              type="button"
              className="bg-blue-700 text-white py-4 mb-4 w-full rounded font-semibold hover:bg-blue-800 focus:ring-4 focus:ring-blue-500 focus:cursor-alias"
              onClick={handleReset}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-red-100 text-red-700 py-4 w-full rounded font-semibold hover:bg-red-300 ring-4 ring-red-400 focus:ring-4 focus:ring-red-600"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeleteBorrower;
