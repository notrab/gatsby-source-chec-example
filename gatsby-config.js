require("dotenv").config();

module.exports = {
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: "@chec/gatsby-source-chec",
      options: {
        publicKey: process.env.CHEC_PUBLIC_KEY,
        downloadImageAssets: true,
      },
    },
  ],
};
