import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons";

export default {
  plugins: [
    iconsPlugin({
      // Select the icon collections you want to use
      collections: getIconCollections(["mdi"]),
    }),
  ],
};
