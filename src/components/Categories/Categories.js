import React, { useContext } from "react";
import { CategoryContext } from "../../context/CategoryContext";
import { Link } from "react-router-dom";
import "./Categories.css";

const Categories = () => {
  const { categories, loading, error } = useContext(CategoryContext);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error loading categories: {error}</p>;

  return (
    <div className="categories-page">
      <h1>Categories</h1>
    <p>
    Select a category to explore anime recommendations based on your favorite genres and themes.
    </p>
      <div className="categories-grid">
          {categories.map((category) => (
            <li key={category}>
              <Link to={`/categories/${category.toLowerCase()}`}>{category}</Link>
            </li>
          ))}
      </div>
    </div>
  );
};

export default Categories;
