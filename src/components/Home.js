import React, { useState, useEffect } from "react";

const Home = ({
  showBooks,
  showAuthors,
  showBorrowers,
  showBorrowersWithoutBook,
  showCheckoutBooks,
  showRemainingBooks,
}) => {
  const [counts, setCounts] = useState({
    books: 0,
    authors: 0,
    borrowers: 0,
    booksWithBorrower: 0,
    borrowersWithoutBook: 0,
  });

  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Use Vite environment variable
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          console.error("VITE_API_URL is undefined. Check your .env file.");
          return;
        }

        console.log("Fetching counts from:", `${apiUrl}/counts`);
        const response = await fetch(`${apiUrl}/counts`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Counts fetched successfully:", data);

        setCounts({
          books: parseInt(data.books) || 0,
          authors: parseInt(data.authors) || 0,
          borrowers: parseInt(data.borrowers) || 0,
          booksWithBorrower: parseInt(data.booksWithBorrower) || 0,
          borrowersWithoutBook: parseInt(data.borrowersWithoutBook) || 0,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [forceUpdate]);

  const triggerUpdate = () => setForceUpdate((prev) => !prev);

  const Card = ({ children }) => (
    <div className="bg-gray-900 rounded-lg justify-center shadow-md px-4 py-4 mb-1 max-w-xl">
      {children}
    </div>
  );

  const StatCard = ({ title, count, onClickHandle }) => (
    <div
      className="bg-gray-800 rounded-lg shadow-md px-4 py-2 mb-2 cursor-pointer focus:scale-95 focus:ring-3 focus:ring-blue-400 hover:scale-105 transition-transform transition-ring transition-duration-100"
      onClick={onClickHandle}
      tabIndex={0}
    >
      <p className="font-semibold">{title}:</p>
      <p>{count}</p>
    </div>
  );

  return (
    <div className="justify-center p-8">
      <Card>
        <h1 className="font-bold text-center mb-6">
          Welcome to the Library Management System
        </h1>
        <p className="text-center">This is a simple library management system where</p>
        <p className="text-center">you can add, update, and delete books and borrowers.</p>
        <h2 className="font-bold text-center mt-8">-:Status:-</h2>
      </Card>

      <div className="flex justify-center mt-2">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <StatCard title="Total Books" onClickHandle={showBooks} count={counts.books} />
            <StatCard title="Total Authors" onClickHandle={showAuthors} count={counts.authors} />
            <StatCard title="Total Borrowers" onClickHandle={showBorrowers} count={counts.borrowers} />
          </Card>
          <Card>
            <StatCard title="Checked Out Books" onClickHandle={showCheckoutBooks} count={counts.booksWithBorrower} />
            <StatCard title="Borrowers without Books" onClickHandle={showBorrowersWithoutBook} count={counts.borrowersWithoutBook} />
            <StatCard title="Remaining Books" onClickHandle={showRemainingBooks} count={Math.max(0, counts.books - counts.booksWithBorrower)} />
          </Card>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={triggerUpdate}
          className="mt-8 bg-gray-700 ring-1 ring-gray-500 hover:bg-gray-600 hover:ring-gray-700 text-gray-300 py-1 px-2 rounded-lg"
        >
          Force Refresh Counts
        </button>
      </div>
    </div>
  );
};

export default Home;
