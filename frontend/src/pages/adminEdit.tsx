import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface PackageDay {
  dayNumber: number;
  description: string;
  activities: string;
  accommodation: string;
  mealPlan: string;
  travelTime: string;
  transferMode: string;
  images: string[];
}

interface PackageDetails {
  name: string;
  price: number;
  groupSize: number;
  duration: number;
  description: string;
  days: PackageDay[];
  mainImage: string;
}

const AdminEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageDetails, setPackageDetails] = useState<PackageDetails>({
    name: '',
    price: 0,
    groupSize: 0,
    duration: 0,
    description: '',
    days: [],
    mainImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/packages/${id}`);
        if (!response.ok) throw new Error('Failed to fetch package');
        const data = await response.json();
        setPackageDetails(data);
      } catch (err) {
        setError('Failed to load package details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPackageDetails(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'groupSize' || name === 'duration' 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleDayChange = (index: number, field: string, value: string) => {
    setPackageDetails(prev => {
      const updatedDays = [...prev.days];
      updatedDays[index] = {
        ...updatedDays[index],
        [field]: value
      };
      return { ...prev, days: updatedDays };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, dayIndex?: number) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => formData.append('images', file));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      const uploadedImages = await response.json();

      if (dayIndex !== undefined) {
        setPackageDetails(prev => {
          const updatedDays = [...prev.days];
          updatedDays[dayIndex] = {
            ...updatedDays[dayIndex],
            images: [...updatedDays[dayIndex].images, ...uploadedImages]
          };
          return { ...prev, days: updatedDays };
        });
      } else {
        setPackageDetails(prev => ({
          ...prev,
          mainImage: uploadedImages[0]
        }));
      }
    } catch (err) {
      setError('Failed to upload images');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(packageDetails)
      });

      if (!response.ok) throw new Error('Update failed');
      setSuccess('Package updated successfully');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError('Failed to update package');
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
      <h2 className="mb-4">Edit Travel Package</h2>
      
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

      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header">
            <h4>Package Information</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Package Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={packageDetails.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Price (USD)</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={packageDetails.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Group Size</label>
                <input
                  type="number"
                  className="form-control"
                  name="groupSize"
                  value={packageDetails.groupSize}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Duration (days)</label>
                <input
                  type="number"
                  className="form-control"
                  name="duration"
                  value={packageDetails.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Package Description</label>
              <textarea
                className="form-control"
                name="description"
                value={packageDetails.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Main Package Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
              />
              {packageDetails.mainImage && (
                <img
                  src={packageDetails.mainImage}
                  alt="Main package"
                  className="img-thumbnail mt-2"
                  style={{ maxHeight: '200px' }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4>Package Days</h4>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setPackageDetails(prev => ({
                  ...prev,
                  days: [...prev.days, {
                    dayNumber: prev.days.length + 1,
                    description: '',
                    activities: '',
                    accommodation: '',
                    mealPlan: '',
                    travelTime: '',
                    transferMode: '',
                    images: []
                  }]
                }));
              }}
            >
              Add Day
            </button>
          </div>
          <div className="card-body">
            {packageDetails.days.map((day, index) => (
              <div key={index} className="card mb-3">
                <div className="card-header">
                  <h5>Day {day.dayNumber}</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={day.description}
                      onChange={(e) => handleDayChange(index, 'description', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Activities</label>
                    <textarea
                      className="form-control"
                      value={day.activities}
                      onChange={(e) => handleDayChange(index, 'activities', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Accommodation</label>
                      <input
                        type="text"
                        className="form-control"
                        value={day.accommodation}
                        onChange={(e) => handleDayChange(index, 'accommodation', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Meal Plan</label>
                      <input
                        type="text"
                        className="form-control"
                        value={day.mealPlan}
                        onChange={(e) => handleDayChange(index, 'mealPlan', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Travel Time</label>
                      <input
                        type="text"
                        className="form-control"
                        value={day.travelTime}
                        onChange={(e) => handleDayChange(index, 'travelTime', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Transfer Mode</label>
                      <input
                        type="text"
                        className="form-control"
                        value={day.transferMode}
                        onChange={(e) => handleDayChange(index, 'transferMode', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Day Images</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, index)}
                    />
                    <div className="mt-2">
                      {day.images.map((image, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={image}
                          alt={`Day ${day.dayNumber} - ${imgIndex + 1}`}
                          className="img-thumbnail me-2"
                          style={{ maxHeight: '100px' }}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setPackageDetails(prev => ({
                        ...prev,
                        days: prev.days.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    Remove Day
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between mb-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Update Package
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEdit; 