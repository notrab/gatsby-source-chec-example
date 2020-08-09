import React from "react";
import { Link } from "gatsby";

import Category from "./Category";

export default function CategoryList({ categories }) {
  if (!categories) return null;

  return (
    <ul>
      {categories.map((category) => (
        <li key={category.slug}>
          <Link to={`/categories/${category.slug}`}>
            <Category {...category} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
