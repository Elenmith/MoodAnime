import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_URL]);

  if (loading) return <p>Loading categories...</p>;

  return (
    <div className="categories-page">
      <h2>Categories</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <Link to={`/categories/${category.toLowerCase()}`} key={category} className="category-button">
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
