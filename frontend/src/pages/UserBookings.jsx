import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking => {
        const searchLower = searchTerm.toLowerCase();
        return (
          booking.packageName.toLowerCase().includes(searchLower) ||
          booking.name.toLowerCase().includes(searchLower) ||
          booking.email.toLowerCase().includes(searchLower) ||
          String(booking.phone).toLowerCase().includes(searchLower) ||
          booking.status.toLowerCase().includes(searchLower) ||
          new Date(booking.date).toLocaleDateString().includes(searchTerm) ||
          new Date(booking.createdAt).toLocaleDateString().includes(searchTerm) ||
          String(booking.packagePrice).includes(searchTerm) ||
          String(booking.guests).includes(searchTerm)
        );
      });
      setFilteredBookings(filtered);
    }
  }, [searchTerm, bookings]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/bookings/user/681018ba20f36aa516f83851', {
        withCredentials: true
      });
      setBookings(response.data);
      setFilteredBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (bookingId) => {
    navigate(`/bookings/${bookingId}/edit`);
  };

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {console.log(selectedBooking)
      await axios.delete(`http://localhost:5001/api/bookings/${selectedBooking._id}`, {
        withCredentials: true
      });
      setBookings(bookings.filter(booking => booking._id !== selectedBooking._id));
      setShowDeleteConfirm(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Please try again.');
    }
  };

  const downloadReport = () => {
    try {
      console.log('Starting report generation...');
      
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add a simple title
      doc.setFontSize(16);
      doc.text('My Bookings Report', 20, 20);
      
      // Add the current date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      // Create a simple table
      const tableData = filteredBookings.map(booking => [
        booking.packageName || 'N/A',
        booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A',
        booking.guests || '0',
        `$${booking.packagePrice || '0'}`
      ]);
      
      // Add the table
      autoTable(doc, {
        head: [['Package', 'Date', 'Guests', 'Price']],
        body: tableData,
        startY: 40,
        theme: 'grid'
      });
      
      // Save the PDF
      doc.save('bookings-report.pdf');
      console.log('Report generated successfully');
    } catch (error) {
      console.error('Error details:', error);
      alert('Error generating report: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <button
          onClick={downloadReport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Report
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="mb-4 max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">
            {searchTerm ? 'No bookings found matching your search.' : 'You haven\'t made any bookings yet.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition duration-300"
            >
              Browse Packages
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package Details
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Info
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{booking.packageName}</div>
                      <div className="text-gray-500">Duration: {booking.duration}</div>
                      <div className="text-gray-500">Price: ${booking.packagePrice}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-500">Booking Date: {new Date(booking.createdAt).toLocaleDateString()}</div>
                      <div className="text-gray-500">Travel Date: {new Date(booking.date).toLocaleDateString()}</div>
                      <div className="text-gray-500">Guests: {booking.guests}</div>
                      <div className="text-gray-500">Total: ${booking.packagePrice * booking.guests}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-500">{booking.name}</div>
                      <div className="text-gray-500">{booking.email}</div>
                      <div className="text-gray-500">{booking.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {/* <button
                      onClick={() => handleEdit(booking._id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button> */}
                    <button
                      onClick={() => handleDelete(booking)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this booking? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings; 