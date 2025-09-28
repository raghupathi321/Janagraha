import React, { useState } from "react";
import "./Alumni.css";

const alumniData = [
  {
    id: 1,
    name: "Asha Reddy",
    batch: "2015",
    role: "Software Engineer at Google",
    story: "From rural roots to Silicon Valley — a journey of grit and grace.",
    photo: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Ravi Kumar",
    batch: "2016",
    role: "Social Entrepreneur",
    story: "Founded an NGO impacting 50,000+ rural children.",
    photo: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Neha Verma",
    batch: "2017",
    role: "Doctor at AIIMS Delhi",
    story: "Returned to her village every weekend to serve locals while studying.",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  
  
];

export default function Alumni() {
  const [search, setSearch] = useState("");
  const filteredAlumni = alumniData.filter((alum) =>
    alum.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="alumni-page">
      <header className="alumni-banner">
        <h1>Our Proud Alumni</h1>
        <p>
          Celebrating the journeys of our past students making a difference across the globe.
        </p>
      </header>

      <div className="alumni-search">
        <input
          type="text"
          placeholder="Search alumni by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="alumni-list">
        {filteredAlumni.map((alum) => (
          <div className="alumni-card" key={alum.id}>
            <img src={alum.photo} alt={alum.name} />
            <h3>{alum.name}</h3>
            <p><strong>Batch:</strong> {alum.batch}</p>
            <p><strong>Now:</strong> {alum.role}</p>
            <p className="story">"{alum.story}"</p>
            <button className="connect-btn">Request to Connect</button>
          </div>
        ))}
      </div>

      <section className="alumni-cta">
        <p>Want to join our alumni network?</p>
        <button className="join-btn">Join Now</button>
      </section>

      <footer className="alumni-footer">
        <p>&copy; {new Date().getFullYear()} Diksha Foundation. All rights reserved.</p>
        <p>
          <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}