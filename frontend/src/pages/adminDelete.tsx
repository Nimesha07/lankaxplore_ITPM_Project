import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Package {
  id: string;
  name: string;
  price: number;
  groupSize: number;
  duration: number;
  description: string;
  mainImage: string;
}

const AdminDelete = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        if (!response.ok) throw new Error('Failed to fetch packages');
        const data = await response.json();
        setPackages(data);
      } catch (err) {
        setError('Failed to load packages');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleDelete = async (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!selectedPackage) return;

    try {
      const response = await fetch(`/api/packages/${selectedPackage.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete package');
      
      setSuccess('Package deleted successfully');
      setPackages(packages.filter(p => p.id !== selectedPackage.id));
      setShowConfirmation(false);
      setSelectedPackage(null);
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to delete package');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Delete Travel Packages</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Group Size</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id}>
                <td>
                  <img
                    src={pkg.mainImage}
                    alt={pkg.name}
                    className="img-thumbnail"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </td>
                <td>{pkg.name}</td>
                <td>${pkg.price}</td>
                <td>{pkg.groupSize} people</td>
                <td>{pkg.duration} days</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(pkg)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmation && selectedPackage && (
        <div className="modal show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedPackage(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete the package "{selectedPackage.name}"?
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedPackage(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDelete; 