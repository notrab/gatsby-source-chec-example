import React from "react";
import { graphql } from "gatsby";

import CategoryList from "../components/CategoryList";

export default function CategoriesPage({ data: { allChecCategory } }) {
  return (
    <React.Fragment>
      <h1>Categories</h1>

      <CategoryList categories={allChecCategory.nodes} />
    </React.Fragment>
  );
}

export const pageQuery = graphql`
  query CategoriesPageQuery {
    allChecCategory {
      nodes {
        name
        slug
      }
    }
  }
`;
