import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";

export default function ProductPage({ data: { product } }) {
  const [mainImage] = product.images;

  return (
    <React.Fragment>
      <h1>{product.name}</h1>
      <p>{product.price.formatted_with_symbol}</p>
      {mainImage && (
        <Img
          fluid={mainImage.childImageSharp.fluid}
          style={{ maxWidth: "50%" }}
        />
      )}
    </React.Fragment>
  );
}

export const pageQuery = graphql`
  query ProductPageQuery($id: String!) {
    product: checProduct(id: { eq: $id }) {
      id
      name
      ...PriceInfo
      images {
        childImageSharp {
          fluid(maxWidth: 560) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`;
