import React, { useContext } from "react";
import { CategoryContext } from "../../context/CategoryContext";
import { Link } from "react-router-dom";
import "./Categories.css";

const Categories = () => {
  const { categories, loading, error } = useContext(CategoryContext);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error loading categories: {error}</p>;

 return (
  <div className="categories-container">
    <h2>Categories</h2>
    <div className="categories-grid">
      {categories.map((category) => (
        <li key={category}>
            <Link to={`/categories/${category.toLowerCase()}`}>{category}</Link>
          </li>
      ))}
    </div>
  </div>
)};

export default Categories;
