# gatsby-source-chec-example

This repo contains all of the code necessary to create a static commerce with Gatsby and Chec/Commerce.js. It includes creating index pages for products and categories, single product and category pages, and categories with associated products.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/notrab/gatsby-source-chec-example)

[![Codesandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/notrab/gatsby-source-chec-example/tree/main)

## Run this locally

1. `npm install`
2. Add your `CHEC_PUBLIC_KEY` to `.env`
3. `npm run dev`

## Build it with me

Before you start, you'll want to create an account at [Chec](https://commercejs.com) or use the [CLI](https://github.com/chec/cli).

You'll also need to create a few categories, that have products to get the most out of this tutorial. Once you've done that, grab a copy of your public API key. You can find this at [Chec Dashboard > Developer Settings](https://dashboard.chec.io/settings/developer).

_If you don't want to create an account with Commerce.js to follow along with this tutorial, you can use the demo store public key `pk_184625ed86f36703d7d233bcf6d519a4f9398f20048ec`._

---

## 1. Initial setup

In this tutorial we'll be using Gatsby. Gatsby ships with a CLI to make it easier to bootstrap applications, but we'll do things manually.

To begin, inside a new directory, do the following:

```bash
npm init -y
npm install react react-dom gatsby @chec/gatsby-source-chec
```

Then add some `scripts` to `package.json`:

```js
"scripts": {
  "build": "gatsby build",
  "clean": "gatsby clean",
  "dev": "gatsby develop"
}
```

Now create a new file `.env` and add your public API key here.

```
CHEC_PUBLIC_KEY=...
```

Next create the file `gatsby-config.js`.

We'll first import the `dotenv` package at the top. `dotenv` is a dependency of Gatsby itself, so there's no need to install it here.

```js
require("dotenv").config();
```

Then we will export by default an array of `plugins`. Inside this array, we'll configure `@chec/gatsby-source-chec` with our `publicKey` from `.env`.

```js
module.exports = {
  plugins: [
    {
      resolve: "@chec/gatsby-source-chec",
      options: {
        publicKey: process.env.CHEC_PUBLIC_KEY,
      },
    },
  ],
};
```

## 2. Create homepage of categories and products

Inside a new directory `src`, and inside that a new folder for our `pages`, we'll create the file `index.js`.

We can query Chec using the `@chec/gatsby-source-chec` plugin we configured earlier.

Gatsby will run the exported `pageQuery` at build time. Let's write a query to get the merchant information, all categories, and products.

```js
import React from "react";
import { graphql } from "gatsby";

export default function IndexPage({
  data: {
    checMerchant: merchant,
    allChecCategory: categories,
    allChecProduct: products,
  },
}) {
  return (
    <div>
      <pre>{ JSON.stringify(merchant, null, 2) }</pre>
      <pre>{ JSON.stringify(categories, null, 2) }</pre>
      <pre>{ JSON.stringify(products, null, 2) }</pre>
    </div>
  )
}

export const pageQuery = graphql`
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
        price {
          formatted_with_symbol
        }
      }
    }
  }
`;
```

## 3. Create `ProductList` and `Product` components

As we'll show a list of products in multiple pages across our store, let's create a component we can reuse.

Inside the `src` directory, create a new folder `components`. Inside here create the file `Product.js`, and add the following:

```js
import React from "react";

export default function Product({ name, price }) {
  return (
    <p>
      {name}: {price.formatted_with_symbol}
    </p>
  );
}
```

This component is responsible for showing just the product name, and formatted with symbol price.

Now create the file `ProductList.js`, and add the following:

```js
import React from "react";
import { Link } from "gatsby";

import Product from "./Product";

export default function ProductList({ products }) {
  if (!products) return null;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.permalink}>
          <Link to={`/products/${product.permalink}`}>
            <Product {...product} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

In this file we're mapping over the `products` prop, and rendering a list item that contains a `Link`, and the rendered `Product` component we created previously.

If there are no products, we don't render anything.

## 4. Update index page to use ProductList component

Let's use the newly created `ProductList` component on our homepage.

Inside `src/pages/index.js`, import the component:

```js
import ProductList from "../components/ProductList";
```

Next replace the following:

```js
<pre>{JSON.stringify(products, null, 2)}</pre>
```

With our new `ProductList` component, and pass along `products` as a prop.

```js
<ProductList products={allChecProduct.nodes} />
```

## 5. Create products index page

Let's now create the `/products` page for browsing just our products.

Create the file `src/pages/products.js`, and add the following:

```js
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
        price {
          formatted_with_symbol
        }
      }
    }
  }
`;
```

Similar to the homepage, we export a `pageQuery` that queries `allChecProduct`. You will notice a bit of repetition for our query here.

Let's assume the products index page will in the future show more than just the `name` and `permalink`, so we'll keep this query defined here, but let's turn the `price` query into a GraphQL Fragment.

GraphQL Fragments mean we can define a name for our query, and use that fragment instead of typing again what fields we want from `price`.

Inside the `pageQuery` of `src/pages/index.js`, add the following fragment:

```graphql
fragment PriceInfo on ChecProduct {
  price {
    formatted_with_symbol
  }
}
```

Then where we have:

```graphql
price {
  formatted_with_symbol
}
```

In both `src/pages/index.js`, and `src/pages/products.js`, replace it with:

```graphql
...PriceInfo
```

## 6. Create `CategoryList` and `Category` components

Similar to our `ProductList` and `Product` components, let's now do the same for categories.

In a new file `Category.js` within the `src/components` directory, add the following:

```js
export default function Category({ name }) {
  return name;
}
```

This one is very basic! All we're doing in this example is rendering the name of our category.

Let's now create a component to list our categories, and render this component for each.

In a new file `CategoryList.js` inside `src/components`, add the following:

```js
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
```

Just like we were linking to products before, here we're now linking to categories.

You'll notice `to` for our categories uses a `slug` instead of `permalink`.

## 7. Create categories index page

Let's also create an index page for just our categories. Inside a new file `src/pages/categories.js`, add the following:

```js
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
```

Here we're exporting a query which just fetches our categories.

It's important to remember that Gatsby fetches all of these nodes, so we're querying Gatsby, and NOT Chec API at this point.

## 8. Update index page to use `CategoryList` component

Above where we're importing `ProductList`, let's import the `CategoryList` component:

```js
import CategoryList from "../components/CategoryList";
```

Then where we have:

```js
<pre>{JSON.stringify(categories, null, 2)}</pre>
```

Replace it with:

```js
<CategoryList categories={allChecCategory.nodes} />
```

Finally let's add a `<h1 />` to the page with our `merchant.business_name`, and add links to both the category and product index pages.

Where we're importing `graphql` from the `gatsby` dependency, let's also import `Link`.

```js
import { graphql, Link } from "gatsby";
```

Now update the `IndexPage` function to look a little something like:

```js
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
```

## 9. Create individual category pages

Since we're linking to `/categories/:slug` from our list of categories inside `CategoryList` component, we need to create pages for each of them at build time.

This is where we will hook into a special Gatsby API at build time to do this.

Let's first create the template for our category page. Inside the `src` directory, create a new folder `templates`.

Here create a file `CategoryPage.js` and add the following:

```js
import React from "react";
import { graphql } from "gatsby";

import ProductList from "../components/ProductList";

export default function CategoryPage({ data: { category } }) {
  const { products } = category;

  return (
    <React.Fragment>
      <h1>{category.name}</h1>

      <ProductList products={products} />
    </React.Fragment>
  );
}
```

You'll notice we're not exporting a `pageQuery`, yet. Let's now export a `pageQuery`, but this time it will look a little different.

Since this is a "template", it should be used when visiting `/categories/:slug`.

With Gatsby, we must pass some "context" to the template when building it. This context is available to the GraphQL query as variables, so we can use write a query that uses that variable to fetch the page.

In this case we will use the `id` of each category nodes to fetch from the Gatsby built Chec nodes.

```js
export const pageQuery = graphql`
  query CategoryPageQuery($id: String!) {
    category: checCategory(id: { eq: $id }) {
      id
      name
      products {
        name
        permalink
        ...PriceInfo
      }
    }
  }
`;
```

As it stands, this file does nothing itself. So let's put it to action!

Inside the root of your project, create the file `gatsby-node.js`.

We need to hook into the [`createPages`](https://www.gatsbyjs.com/docs/using-gatsby-without-graphql/#the-approach-fetch-data-and-use-gatsbys-createpages-api) Gatsby API.

Update `gatsby-node.js` to include the following:

```js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const {
    data: { allChecCategory },
  } = await graphql(`
    {
      allChecCategory {
        nodes {
          id
          slug
        }
      }
    }
  `);

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
```

Inside the `createPages` function we're running a GraphQL query to get all of our categories, and for each of those, using the `createPage` action, and providing it the required path, component, and context.

## 10. Create individual product pages

Just like we did for all categories, let's now create individual pages for our products.

This time inside `src/templates`, create the file `ProductPage.js` and add the following:

```js
import React from "react";
import { graphql } from "gatsby";

export default function ProductPage({ data: { product } }) {
  return (
    <React.Fragment>
      <h1>{product.name}</h1>
      <p>{product.price.formatted_with_symbol}</p>
    </React.Fragment>
  );
}

export const pageQuery = graphql`
  query ProductPageQuery($id: String!) {
    product: checProduct(id: { eq: $id }) {
      id
      name
      ...PriceInfo
    }
  }
`;
```

This template is simply rendering our product page, and formatted with symbol with price. You may want to include the image, and more!

Now inside `gatsby-node.js` we must also query all products, and use the `createPage` action for each of our products to generate the files at path `/products/:permalink`.

Update `gatsby-node.js` to look like:

```js
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
```

## 11. Using Gatsby Image with product images

The time has come to implement product images using [Gatsby Image](https://www.gatsbyjs.com/plugins/gatsby-image/).

Since the beginning of the tutorial, there has been a new version of [`gatsby-source-chec`](https://www.npmjs.com/package/@chec/gatsby-source-chec/v/1.2.0).

Inside `package.json`, update the version of `gatsby-source-chec` to be at least `1.2.0`, and run `npm install`.

Once installed, go ahead and install the dependencies for using Gatsby Image.

```bash
npm i -E gatsby-transformer-sharp gatsby-plugin-sharp gatsby-image
```

Once installed, you will need to update the `pageQuery` in `templates/ProductPage.js`:

```js
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
```

Here we're calling the `GatsbyImageSharpFluid` fragment for our product images. The `images` array is an array of `File`'s added by the updated source plugin.

Inside `templates/ProductPage.js`, go ahead and import the Gatsby Image component:

```js
import Img from "gatsby-image";
```

Then inside the page function, you will want to destructure the first item from the `product.images` array, and call this `mainImage`:

```js
const [mainImage] = product.images;
```

Then all that's left to do is render the `<Img />` component on the page with the applicable components if it exists.

```js
{
  mainImage && (
    <Img fluid={mainImage.childImageSharp.fluid} style={{ maxWidth: "50%" }} />
  );
}
```

## 12. Run it locally

That's it!

Now you're ready to go! Type `npm run dev` in your Terminal, and head to the local port to browse your Gatsby powered commerce site.
