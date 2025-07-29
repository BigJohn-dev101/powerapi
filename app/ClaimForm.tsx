"use client"
import React, { useState } from "react";

const claimTypes = ["Home", "Auto", "Health", "Property", "Life"];
const priorities = ["Low", "Medium", "High"];

export default function ClaimForm() {
  const [claimCount, setClaimCount] = useState<number | null>(null);
  const [form, setForm] = useState({
    claimID: "",
    claimType: "Home",
    Priority: "Low",
    Description: "",
    createdOn: new Date().toISOString().slice(0, 16)
  });

  // Fetch only the last claim record from backend
  const fetchLatestClaimID = async () => {
    try {
      const res = await fetch("/api/claims");
      const claims = await res.json();
      let nextCount = 1;
      if (Array.isArray(claims) && claims.length > 0) {
        // Get the last claim record
        const lastClaim = claims[claims.length - 1];
        const match = lastClaim.claimID?.match(/CL-(\d+)/);
        if (match) {
          nextCount = parseInt(match[1], 10) + 1;
        }
      }
      setClaimCount(nextCount);
      setForm(f => ({
        ...f,
        claimID: `CL-${nextCount.toString().padStart(2, "0")}`
      }));
    } catch {
      setClaimCount(1);
      setForm(f => ({ ...f, claimID: "CL-01" }));
    }
  };

  React.useEffect(() => {
    fetchLatestClaimID();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          createdOn: new Date().toISOString() // FastAPI expects ISO format
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Claim submitted successfully!");
        // Fetch the latest claimID from backend after submit
        await fetchLatestClaimID();
        setForm(f => ({
          ...f,
          claimType: "Home",
          Priority: "Low",
          Description: "",
          createdOn: new Date().toISOString().slice(0, 16)
        }));
      } else {
        alert("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Failed to submit claim.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <label className="block mb-2">
        Claim ID
        <input
          type="text"
          name="claimID"
          value={form.claimID}
          readOnly
          className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
        />
      </label>
      <label className="block mb-2">
        Claim Type
        <select
          name="claimType"
          value={form.claimType}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {claimTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>
      <label className="block mb-2">
        Priority
        <select
          name="Priority"
          value={form.Priority}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {priorities.map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
      </label>
      <label className="block mb-2">
        Description
        <textarea
          name="Description"
          value={form.Description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </label>
      <label className="block mb-4">
        Created On
        <input
          type="datetime-local"
          name="createdOn"
          value={form.createdOn}
          readOnly
          className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
        />
      </label>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}
