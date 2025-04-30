import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";

const BookingPage = () => {
  const location = useLocation();
  const selectedPackage = location.state?.package;

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      guests: 1,
      date: "",
      specialRequests: "",
      paymentMethod: "credit-card",
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required("Full name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phone: Yup.string()
        .matches(/^\d{10}$/, "Enter a valid 10-digit phone number")
        .required("Phone number is required"),
      guests: Yup.number().min(1, "At least one guest required").required("Number of guests is required"),
      date: Yup.string().required("Please select a date"),
    }),
    onSubmit: (values) => {
      alert("Booking Successful!");
      console.log(values);
    },
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9" }}>
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e6e6e6",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#333",
            fontSize: "28px",
            marginBottom: "30px",
            fontFamily: "'Helvetica Neue', sans-serif",
            fontWeight: "bold",
          }}
        >
          Book Your Travel Package
        </h1>

        {/* Selected Package Information */}
        {selectedPackage && (
          <div style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
            border: "1px solid #e9ecef"
          }}>
            <h2 style={{
              color: "#4CAF50",
              fontSize: "24px",
              marginBottom: "10px",
              fontWeight: "bold"
            }}>
              Selected Package: {selectedPackage.name}
            </h2>
            <div style={{ color: "#666" }}>
              <p><strong>Duration:</strong> {selectedPackage.duration}</p>
              <p><strong>Price:</strong> {selectedPackage.price}</p>
              <p><strong>Description:</strong> {selectedPackage.description}</p>
            </div>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
                color: "#444",
                fontSize: "16px",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "border 0.3s ease-in-out",
              }}
            />
            {formik.touched.name && formik.errors.name && (
              <p style={{ color: "red", fontSize: "14px" }}>{formik.errors.name}</p>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
                color: "#444",
                fontSize: "16px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "border 0.3s ease-in-out",
              }}
            />
            {formik.touched.email && formik.errors.email && (
              <p style={{ color: "red", fontSize: "14px" }}>{formik.errors.email}</p>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
                color: "#444",
                fontSize: "16px",
              }}
            >
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "border 0.3s ease-in-out",
              }}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p style={{ color: "red", fontSize: "14px" }}>{formik.errors.phone}</p>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
                color: "#444",
                fontSize: "16px",
              }}
            >
              Number of Guests
            </label>
            <input
              type="number"
              name="guests"
              min="1"
              value={formik.values.guests}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "border 0.3s ease-in-out",
              }}
            />
            {formik.touched.guests && formik.errors.guests && (
              <p style={{ color: "red", fontSize: "14px" }}>{formik.errors.guests}</p>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
                color: "#444",
                fontSize: "16px",
              }}
            >
              Select Date
            </label>
            <input
              type="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "border 0.3s ease-in-out",
              }}
            />
            {formik.touched.date && formik.errors.date && (
              <p style={{ color: "red", fontSize: "14px" }}>{formik.errors.date}</p>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
                color: "#444",
                fontSize: "16px",
              }}
            >
              Special Requests
            </label>
            <textarea
              name="specialRequests"
              value={formik.values.specialRequests}
              onChange={formik.handleChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
                height: "100px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "border 0.3s ease-in-out",
              }}
            ></textarea>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
                color: "#444",
                fontSize: "16px",
              }}
            >
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formik.values.paymentMethod}
              onChange={formik.handleChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "border 0.3s ease-in-out",
              }}
            >
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank-transfer">Bank Transfer</option>
            </select>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              style={{
                padding: "12px 30px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "18px",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease-in-out",
              }}
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;