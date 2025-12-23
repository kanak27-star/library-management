import React, { useState } from 'react';
import API_URL from "../config"; // adjust path

const AddBorrower = ({ onBorrowerAdded }) => {
  const [formData, setFormData] = useState({
    borrowerName: '',
    borrowerEmail: '',
    borrowerPhone: '',
    borrowerAddress: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleAddBorrower = async (e) => {
    e.preventDefault();

    if (!formData.borrowerName) {
      alert('Please fill in the borrower name.');
      return;
    }

    try {
      const apiUrl = API_URL; // Vite environment variable

      const response = await fetch(`${apiUrl}/api/borrowers
`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Borrower added successfully!');
        console.log('Borrower added successfully!');
        setFormData({
          borrowerName: '',
          borrowerEmail: '',
          borrowerPhone: '',
          borrowerAddress: '',
        });
        onBorrowerAdded();
      } else {
        console.error('Failed to add borrower:', response.statusText);
        alert('Failed to add borrower. Please try again.');
      }
    } catch (error) {
      console.error('Error adding borrower:', error);
      alert('Error adding borrower. Check console for details.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Add Borrower</h1>
      <form onSubmit={handleAddBorrower} className="bg-gray-700 rounded-lg w-screen max-w-md p-6">
        <div className="mb-6">
          <label htmlFor="borrower_name" className="block">Name</label>
          <input
            type="text"
            name="borrowerName"
            id="borrower_name"
            placeholder="Borrower's Name"
            required
            className="border bg-gray-200 text-gray-500 border-gray-300 rounded-lg p-3 w-full"
            value={formData.borrowerName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="borrower_email" className="block">Email</label>
          <input
            type="email"
            name="borrowerEmail"
            id="borrower_email"
            placeholder="Borrower's Email"
            className="border bg-gray-200 text-gray-500 border-gray-300 rounded-lg p-3 w-full"
            value={formData.borrowerEmail}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="borrower_phone" className="block">Phone No</label>
          <input
            type="tel"
            name="borrowerPhone"
            id="borrower_phone"
            placeholder="Borrower's Phone No"
            className="border bg-gray-200 text-gray-500 border-gray-300 rounded-lg p-3 w-full"
            value={formData.borrowerPhone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="borrower_address" className="block">Address</label>
          <input
            type="text"
            name="borrowerAddress"
            id="borrower_address"
            placeholder="Borrower's Address"
            className="border bg-gray-200 text-gray-500 border-gray-300 rounded-lg p-3 w-full"
            value={formData.borrowerAddress}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-700 text-white py-3 w-full rounded font-semibold hover:bg-blue-600 focus:ring-4 focus:ring-blue-500"
        >
          Add Borrower
        </button>
      </form>
    </div>
  );
};

export default AddBorrower;
