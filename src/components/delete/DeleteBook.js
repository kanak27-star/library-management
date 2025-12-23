import React, { lazy, startTransition, useState } from "react";
import API_URL from "../config"; // adjust path

const SearchBar = lazy(() => import("../search_comp/SearchBar"));
const ItemList = lazy(() => import("../search_comp/ItemList"));
const FormComp = lazy(() => import("../search_comp/FormComp"));

const DeleteBook = ({ onBookDeleted }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [showBookList, setShowBookList] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    category: "",
    price: "",
  });

  const apiUrl = API_URL; // Vite env variable for backend

  // Search books
  const handleSearch = async (query) => {
    try {
      const response = await fetch(`${apiUrl}/api/books
/searchout?query=${query}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  // Select a book
  const handleSelectBook = async (book) => {
    startTransition(() => {
      setSelectedBook(book);
      setShowBookList(false);
      setFormData({
        title: book.title,
        authorName: book?.author?.authorName || "",
        category: book.category || "",
        price: book.price ? book.price.toString() : "",
      });
    });
  };

  // Reset form
  const handleReset = () => {
    startTransition(() => {
      setFormData({
        title: "",
        authorName: "",
        category: "",
        price: "",
      });
      setBooks([]);
      setSelectedBook(null);
      setShowBookList(true);
      setConfirmDelete("");
    });
  };

  // Delete book
  const handleDelete = async () => {
    if (confirmDelete === "delete" && selectedBook) {
      const { _id: bookId, author } = selectedBook;
      const requestBody = {
        bookId,
        authorId: author._id,
      };

      try {
        const response = await fetch(`${apiUrl}/api/books
`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        if (response.ok) {
          alert("Book deleted successfully");
          console.log("Book deleted successfully!");
          setConfirmDelete("");
          setSelectedBook(null);
          setBooks([]);
          handleReset();
          onBookDeleted();
        } else {
          console.error("Failed to delete book:", response.statusText);
          alert("Failed to delete book. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Error deleting book. Check console for details.");
      }
    } else {
      alert('Please type "delete" in the confirmation box to delete the book.');
    }
  };

  return (
    <div className="p-14">
      <h1 className="text-2xl font-bold text-center mb-6">Delete Book</h1>
      {!selectedBook ? (
        <>
          <SearchBar
            onSearch={handleSearch}
            selectedItem={selectedBook}
            placeholder="Search Books..."
          />
          <ItemList
            items={books}
            onSelectItem={handleSelectBook}
            itemType="book"
            isVisible={showBookList}
          />
        </>
      ) : (
        <>
          <FormComp
            form_data={formData}
            setConfirm={setConfirmDelete}
            type="deletebook"
          />
          <div className="mt-2">
            <button
              onClick={handleReset}
              className="bg-blue-700 text-white py-4 mb-4 w-full rounded font-semibold hover:bg-blue-600 focus:ring-4 focus:ring-blue-500 focus:cursor-alias"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-100 text-red-500 py-4 mb-4 w-full rounded font-semibold hover:bg-red-200 ring-2 ring-red-300 focus:ring-4 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeleteBook;
