import React from "react";
import { graphql } from "gatsby";

import ProductList from "../components/ProductList";

export default function ProductsPage({ data: { allChecProduct } }) {
  return (
    <React.Fragment>
      <h1>Products</h1>

      <ProductList products={allChecProduct.nodes} />
    </React.Fragment>
  );
}

export const pageQuery = graphql`
  query ProductsPageQuery {
    allChecProduct {
      nodes {
        name
        permalink
        ...PriceInfo
      }
    }
  }
`;
