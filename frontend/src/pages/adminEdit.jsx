import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";
const AddPackage = () => {

  const { id } = useParams();
  const [packages, setPackageData] = useState(null);
  const [packageDetails, setPackageDetails] = useState({
    packageName: "",
    startingPrice: "55",
    groupSize: "",
    days: [
      {
        description: "",
        packageImages: [],
        activities: "",
        highlights: [],
        accommodation: "",
        mealPlan: "",
        travelTime: "",
        transferMode: "",
      },
    ],
  });
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/packages/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        setPackageDetails(response.data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };

    fetchPackageDetails();
  }, []);
  const [errors, setErrors] = useState({});

  const addDay = () => {
    setPackageDetails((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        {
          description: "",
          packageImages: [],
          activities: "",
          highlights: [],
          accommodation: "",
          mealPlan: "",
          travelTime: "",
          transferMode: "",
        },
      ],
    }));
  };

  const removeDay = (index) => {
    const updatedDays = packageDetails.days.filter((_, i) => i !== index);
    setPackageDetails({ ...packageDetails, days: updatedDays });
  };

  const handleInputChange = (e, field) => {
    setPackageDetails({ ...packageDetails, [field]: e.target.value });
  };

  const handleDayChange = (index, field, value) => {
    const updatedDays = [...packageDetails.days];
    updatedDays[index][field] = value;
    setPackageDetails({ ...packageDetails, days: updatedDays });
  };

  // const handleFileUpload = (index, field, files) => {
  //   const updatedDays = [...packageDetails.days];
  //   updatedDays[index][field] = Array.from(files);
  //   setPackageDetails({ ...packageDetails, days: updatedDays });
  // };

  const handleFileUpload = async (index, field, files) => {
    const updatedDays = [...packageDetails.days];
    const fileArray = Array.from(files);
    
    // Upload each file to Firebase and get URLs
    const uploadPromises = fileArray.map(async (file) => {
      const storageRef = ref(storage, `packages/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log("Upload progress:", progress + "%");
          },
          (error) => {
            console.error(error.message);
            reject(error.message);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    });

    try {
      const urls = await Promise.all(uploadPromises);
      updatedDays[index][field] = urls;
      setPackageDetails({ ...packageDetails, days: updatedDays });
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files. Please try again.");
    }
  };
  const validateForm = () => {
    const newErrors = {};

    // Validate package name
    if (!packageDetails.packageName) {
      newErrors.packageName = "Package name is required";
    }

    // Validate starting price
    if (!packageDetails.startingPrice || packageDetails.startingPrice <= 0) {
      newErrors.startingPrice = "Starting price must be a positive number";
    }

    // Validate group size
    if (!packageDetails.groupSize || packageDetails.groupSize <= 0) {
      newErrors.groupSize = "Group size must be a positive number";
    }

    // Validate each day
    packageDetails.days.forEach((day, index) => {
      if (!day.description) newErrors[`description-${index}`] = "Description is required";
      if (!day.activities) newErrors[`activities-${index}`] = "Activities are required";
      if (!day.accommodation) newErrors[`accommodation-${index}`] = "Accommodation is required";
      if (!day.mealPlan) newErrors[`mealPlan-${index}`] = "Meal plan is required";
      if (!day.travelTime) newErrors[`travelTime-${index}`] = "Travel time is required";
      if (!day.transferMode) newErrors[`transferMode-${index}`] = "Transfer mode is required";
      if (day.packageImages.length === 0) newErrors[`packageImages-${index}`] = "At least one package image is required";
      if (day.highlights.length === 0) newErrors[`highlights-${index}`] = "At least one highlight image is required";
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Format the package data
        const formattedPackage = {
          name: packageDetails.packageName,
          price: parseFloat(packageDetails.startingPrice),
          duration: `${packageDetails.days.length} Days / ${packageDetails.days.length - 1} Nights`,
          description: packageDetails.days[0].description, // Using first day's description as package description
          image: packageDetails.days[0].packageImages[0], // Using first image as package image
          days: packageDetails.days.map((day, index) => ({
            day: index + 1,
            description: day.description,
            activities: day.activities,
            highlights: day.highlights,
            accommodation: day.accommodation,
            mealPlan: day.mealPlan,
            travelTime: day.travelTime,
            transferMode: day.transferMode
          }))
        };

        // Here you would typically make an API call to save the package
        console.log(packageDetails)
        const response = await fetch(`http://localhost:5001/api/packages/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(packageDetails),
        });
        // Show success message
        alert("Package added successfully!");
        
        // Reset form
        setPackageDetails({
          packageName: "",
          startingPrice: "",
          groupSize: "",
          days: [
            {
              description: "",
              packageImages: [],
              activities: "",
              highlights: [],
              accommodation: "",
              mealPlan: "",
              travelTime: "",
              transferMode: "",
            },
          ],
        });
        
        // Clear errors
        setErrors({});
        
      } catch (error) {
        console.error("Error adding package:", error);
        alert("Failed to add package. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <h2 className="text-center mb-4" style={{ fontFamily: "'Arial', sans-serif", fontSize: "2rem", color: "#333" }}>Edit Package</h2>
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className={`form-control ${errors.packageName ? "is-invalid" : ""}`}
            placeholder="Package Name"
            onChange={(e) => handleInputChange(e, "packageName")}
            value={packageDetails.packageName}
            style={{
              borderRadius: "8px",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.12)",
              transition: "border-color 0.3s ease",
            }}
          />
          {errors.packageName && <div className="invalid-feedback">{errors.packageName}</div>}
        </div>
        <div className="col-md-4">
          <input
            type="number"
            className={`form-control ${errors.startingPrice ? "is-invalid" : ""}`}
            placeholder="Starting Price"
            onChange={(e) => handleInputChange(e, "startingPrice")}
            value={packageDetails.startingPrice}
            style={{
              borderRadius: "8px",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.12)",
              transition: "border-color 0.3s ease",
            }}
          />
          {errors.startingPrice && <div className="invalid-feedback">{errors.startingPrice}</div>}
        </div>
        <div className="col-md-4">
          <input
            type="number"
            className={`form-control ${errors.groupSize ? "is-invalid" : ""}`}
            placeholder="Group Size"
            onChange={(e) => handleInputChange(e, "groupSize")}
            value={packageDetails.groupSize}
            style={{
              borderRadius: "8px",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.12)",
              transition: "border-color 0.3s ease",
            }}
          />
          {errors.groupSize && <div className="invalid-feedback">{errors.groupSize}</div>}
        </div>
      </div>

      {packageDetails.days.map((day, index) => (
        <div key={index} className="card mb-5" style={{ borderRadius: "8px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
          <div
            className="card-header text-white"
            style={{
              borderRadius: "8px 8px 0 0",
              background: "linear-gradient(to right, #003366, #336699)",
            }}
          >
            <h5 className="d-flex justify-content-between">
              Day {index + 1}
              {index !== 0 && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeDay(index)}
                  style={{ borderRadius: "8px", fontSize: "0.875rem" }}
                >
                  Remove Day
                </button>
              )}
            </h5>
          </div>
          <div className="card-body" style={{ backgroundColor: "#f8f9fa", borderRadius: "0 0 8px 8px" }}>
            <div className="mb-3">
              <textarea
                className={`form-control ${errors[`description-${index}`] ? "is-invalid" : ""}`}
                placeholder="Description"
                onChange={(e) => handleDayChange(index, "description", e.target.value)}
                value={day.description}
                style={{
                  borderRadius: "8px",
                  height: "100px",
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.12)",
                  transition: "border-color 0.3s ease",
                }}
              />
              {errors[`description-${index}`] && <div className="invalid-feedback">{errors[`description-${index}`]}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Package Images</label>
              <input
                type="file"
                className={`form-control ${errors[`packageImages-${index}`] ? "is-invalid" : ""}`}
                multiple
                onChange={(e) => handleFileUpload(index, "packageImages", e.target.files)}
                style={{ padding: "10px", borderRadius: "8px" }}
              />
              {errors[`packageImages-${index}`] && <div className="invalid-feedback">{errors[`packageImages-${index}`]}</div>}
            </div>
            <div className="mb-3">
              <textarea
                className={`form-control ${errors[`activities-${index}`] ? "is-invalid" : ""}`}
                placeholder="Activities"
                onChange={(e) => handleDayChange(index, "activities", e.target.value)}
                value={day.activities}
                style={{
                  borderRadius: "8px",
                  height: "100px",
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.12)",
                  transition: "border-color 0.3s ease",
                }}
              />
              {errors[`activities-${index}`] && <div className="invalid-feedback">{errors[`activities-${index}`]}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Highlights Images</label>
              <input
                type="file"
                className={`form-control ${errors[`highlights-${index}`] ? "is-invalid" : ""}`}
                multiple
                onChange={(e) => handleFileUpload(index, "highlights", e.target.files)}
                style={{ padding: "10px", borderRadius: "8px" }}
              />
              {errors[`highlights-${index}`] && <div className="invalid-feedback">{errors[`highlights-${index}`]}</div>}
            </div>
            <div className="row">
              <div className="col-md-6">
                <input
                  type="text"
                  className={`form-control ${errors[`accommodation-${index}`] ? "is-invalid" : ""}`}
                  placeholder="Accommodation"
                  onChange={(e) => handleDayChange(index, "accommodation", e.target.value)}
                  value={day.accommodation}
                  style={{
                    borderRadius: "8px",
                    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.12)",
                    transition: "border-color 0.3s ease",
                  }}
                />
                {errors[`accommodation-${index}`] && <div className="invalid-feedback">{errors[`accommodation-${index}`]}</div>}
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className={`form-control ${errors[`mealPlan-${index}`] ? "is-invalid" : ""}`}
                  placeholder="Meal Plan"
                  onChange={(e) => handleDayChange(index, "mealPlan", e.target.value)}
                  value={day.mealPlan}
                  style={{
                    borderRadius: "8px",
                    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.12)",
                    transition: "border-color 0.3s ease",
                  }}
                />
                {errors[`mealPlan-${index}`] && <div className="invalid-feedback">{errors[`mealPlan-${index}`]}</div>}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className={`form-control ${errors[`travelTime-${index}`] ? "is-invalid" : ""}`}
                  placeholder="Travel Time"
                  onChange={(e) => handleDayChange(index, "travelTime", e.target.value)}
                  value={day.travelTime}
                  style={{
                    borderRadius: "8px",
                    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.12)",
                    transition: "border-color 0.3s ease",
                  }}
                />
                {errors[`travelTime-${index}`] && <div className="invalid-feedback">{errors[`travelTime-${index}`]}</div>}
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className={`form-control ${errors[`transferMode-${index}`] ? "is-invalid" : ""}`}
                  placeholder="Transfer Mode"
                  onChange={(e) => handleDayChange(index, "transferMode", e.target.value)}
                  value={day.transferMode}
                  style={{
                    borderRadius: "8px",
                    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.12)",
                    transition: "border-color 0.3s ease",
                  }}
                />
                {errors[`transferMode-${index}`] && <div className="invalid-feedback">{errors[`transferMode-${index}`]}</div>}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-outline-primary mb-5 mt-3"
          onClick={addDay}
          style={{
            borderRadius: "8px",
            fontSize: "1rem",
            padding: "10px 20px",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          + Add Day
        </button>
        <button
          className="btn btn-success"
          onClick={handleSubmit}
          style={{
            borderRadius: "8px",
            fontSize: "1rem",
            padding: "10px 20px",
            height: "50px",
            marginTop: "10px",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          Add Package
        </button>
      </div>
    </div>
  );
};

export default AddPackage;
