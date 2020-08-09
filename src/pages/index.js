import React from "react";
import { graphql, Link } from "gatsby";

import ProductList from "../components/ProductList";
import CategoryList from "../components/CategoryList";

export default function IndexPage({
  data: { checMerchant, allChecProduct, allChecCategory },
}) {
  return (
    <React.Fragment>
      <h1>{checMerchant.business_name}</h1>

      <h3>
        <Link to="/categories">Categories</Link>
      </h3>

      <CategoryList categories={allChecCategory.nodes} />

      <h3>
        <Link to="/products">Products</Link>
      </h3>

      <ProductList products={allChecProduct.nodes} />
    </React.Fragment>
  );
}

export const pageQuery = graphql`
  fragment PriceInfo on ChecProduct {
    price {
      formatted_with_symbol
    }
  }

  query IndexPageQuery {
    checMerchant {
      business_name
    }

    allChecCategory {
      nodes {
        name
        slug
      }
    }

    allChecProduct {
      nodes {
        name
        permalink
        ...PriceInfo
      }
    }
  }
`;
