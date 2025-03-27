import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Yup from "yup";
import { useFormik } from "formik";

const EditBooking = ({ bookingId }) => {
  const [bookingDetails, setBookingDetails] = useState({
    bookingName: "",
    startDate: "",
    endDate: "",
    price: "",
    groupSize: "",
  });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      // Simulate fetching booking details (replace with real API call)
      const fetchedData = {
        bookingName: "Beach Resort Vacation",
        startDate: "2025-06-15",
        endDate: "2025-06-20",
        price: 1000,
        groupSize: 4,
      };
      setBookingDetails(fetchedData);
    };

    fetchBookingDetails();
  }, [bookingId]);

  const validationSchema = Yup.object({
    bookingName: Yup.string()
      .required("Booking name is required")
      .max(100, "Booking name cannot exceed 100 characters"),
    startDate: Yup.date()
      .required("Start date is required")
      .min(new Date(), "Start date must be in the future"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date cannot be before start date"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be greater than 0")
      .typeError("Price must be a number"),
    groupSize: Yup.number()
      .required("Group size is required")
      .min(1, "Group size must be at least 1")
      .typeError("Group size must be a number"),
  });

  const formik = useFormik({
    initialValues: bookingDetails,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("Updated Booking Details:", values);
      // Perform the API call to update the booking details
    },
  });

  const handleRemoveBooking = () => {
    const confirmRemove = window.confirm("Are you sure you want to remove this booking?");
    if (confirmRemove) {
      console.log("Booking Removed:", bookingDetails);
      // Simulate booking removal (replace with actual API call)
      // You might want to redirect the user to another page or update state here
    }
  };

  return (
    <div className="container" style={{ marginTop: "50px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 className="text-center mb-4" style={{ color: "#2c3e50" }}>Edit Booking</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Booking Name */}
        <div className="mb-3">
          <label htmlFor="bookingName" className="form-label" style={{ fontWeight: "bold" }}>Booking Name</label>
          <input
            type="text"
            id="bookingName"
            name="bookingName"
            className="form-control"
            value={formik.values.bookingName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ fontSize: "1.1rem", padding: "10px", borderRadius: "5px" }}
          />
          {formik.touched.bookingName && formik.errors.bookingName ? (
            <div className="text-danger" style={{ fontSize: "0.875rem" }}>{formik.errors.bookingName}</div>
          ) : null}
        </div>

        {/* Start Date */}
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label" style={{ fontWeight: "bold" }}>Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="form-control"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ fontSize: "1.1rem", padding: "10px", borderRadius: "5px" }}
          />
          {formik.touched.startDate && formik.errors.startDate ? (
            <div className="text-danger" style={{ fontSize: "0.875rem" }}>{formik.errors.startDate}</div>
          ) : null}
        </div>

        {/* End Date */}
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label" style={{ fontWeight: "bold" }}>End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="form-control"
            value={formik.values.endDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ fontSize: "1.1rem", padding: "10px", borderRadius: "5px" }}
          />
          {formik.touched.endDate && formik.errors.endDate ? (
            <div className="text-danger" style={{ fontSize: "0.875rem" }}>{formik.errors.endDate}</div>
          ) : null}
        </div>

        {/* Price */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label" style={{ fontWeight: "bold" }}>Price</label>
          <input
            type="number"
            id="price"
            name="price"
            className="form-control"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ fontSize: "1.1rem", padding: "10px", borderRadius: "5px" }}
          />
          {formik.touched.price && formik.errors.price ? (
            <div className="text-danger" style={{ fontSize: "0.875rem" }}>{formik.errors.price}</div>
          ) : null}
        </div>

        {/* Group Size */}
        <div className="mb-3">
          <label htmlFor="groupSize" className="form-label" style={{ fontWeight: "bold" }}>Group Size</label>
          <input
            type="number"
            id="groupSize"
            name="groupSize"
            className="form-control"
            value={formik.values.groupSize}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ fontSize: "1.1rem", padding: "10px", borderRadius: "5px" }}
          />
          {formik.touched.groupSize && formik.errors.groupSize ? (
            <div className="text-danger" style={{ fontSize: "0.875rem" }}>{formik.errors.groupSize}</div>
          ) : null}
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-between">
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ fontSize: "1.1rem", padding: "10px 20px", borderRadius: "5px" }}
          >
            Save Changes
          </button>
          
          {/* Remove Booking Button */}
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleRemoveBooking}
            style={{ fontSize: "1.1rem", padding: "10px 20px", borderRadius: "5px" }}
          >
            Remove Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBooking;
