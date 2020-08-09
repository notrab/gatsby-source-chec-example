exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const {
    data: { allChecProduct, allChecCategory },
  } = await graphql(`
    {
      allChecProduct {
        nodes {
          id
          permalink
        }
      }

      allChecCategory {
        nodes {
          id
          slug
        }
      }
    }
  `);

  allChecProduct.nodes.forEach(({ id, permalink }) =>
    createPage({
      path: `/products/${permalink}`,
      component: require.resolve(`./src/templates/ProductPage.js`),
      context: {
        id,
      },
    })
  );

  allChecCategory.nodes.forEach(({ id, slug }) =>
    createPage({
      path: `/categories/${slug}`,
      component: require.resolve(`./src/templates/CategoryPage.js`),
      context: {
        id,
      },
    })
  );
};
