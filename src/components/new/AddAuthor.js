import React, { useState } from 'react';
import API_URL from "../config"; // adjust path

const AddAuthor = ({ onAuthorAdded }) => {
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorPhone: '',
    books: [],
  });

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle comma-separated books input
  const handleChangeBooks = (e) => {
    const { value } = e.target;
    const booksArray = value.split(',').map((book) => book.trim()).filter(Boolean);
    setFormData((prevData) => ({
      ...prevData,
      books: booksArray,
    }));
  };

  // Handle form submission
  const handleAddAuthor = async (e) => {
    e.preventDefault();

    if (!formData.authorName) {
      alert('Please fill in the author name.');
      return;
    }

    try {
      const apiUrl = API_URL; // Vite environment variable

      const response = await fetch(`${apiUrl}/api/api/authors
`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Author added successfully!');
        console.log('Author added successfully!');
        setFormData({
          authorName: '',
          authorEmail: '',
          authorPhone: '',
          books: [],
        });
        onAuthorAdded();
      } else {
        console.error('Failed to add Author:', response.statusText);
        alert('Failed to add author. Please try again.');
      }
    } catch (error) {
      console.error('Error adding Author:', error);
      alert('Error adding author. Check console for details.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Add Author</h1>
      <form onSubmit={handleAddAuthor} className="bg-gray-700 w-screen max-w-md rounded-lg p-4">
        <div className="mb-6">
          <label htmlFor="author_name" className="block">Name</label>
          <input
            type="text"
            name="authorName"
            id="author_name"
            placeholder="Author's Name"
            required
            className="border bg-gray-200 text-gray-500 border-gray-300 rounded-lg p-2 w-full"
            value={formData.authorName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="author_email" className="block">Email</label>
          <input
            type="email"
            name="authorEmail"
            id="author_email"
            placeholder="Author's Email"
            className="border bg-gray-200 text-gray-500 border-gray-300 rounded-lg p-2 w-full"
            value={formData.authorEmail}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="author_phone" className="block">Phone No</label>
          <input
            type="tel"
            name="authorPhone"
            id="author_phone"
            placeholder="Author's Phone No"
            className="border bg-gray-200 text-gray-500 border-gray-300 rounded-lg p-2 w-full"
            value={formData.authorPhone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="books" className="block">Books (Comma-separated)</label>
          <input
            type="text"
            name="books"
            id="books"
            placeholder="Book names comma separated"
            className="border bg-gray-200 text-gray-500 border-gray-300 rounded-lg p-2 w-full"
            value={formData.books.join(', ')}
            onChange={handleChangeBooks}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-700 text-white py-3 w-full rounded font-semibold hover:bg-blue-600 focus:ring-4 focus:ring-blue-500"
        >
          Add Author
        </button>
      </form>
    </div>
  );
};

export default AddAuthor;
