import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,vue}", "!./src/uni_modules/**/*"],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        primary: "var(--wot-primary-6)",
        success: "var(--wot-success-main)",
        warning: "var(--wot-warning-main)",
        danger: "var(--wot-danger-main)",
        "text-main": "var(--wot-text-main)",
        "text-secondary": "var(--wot-text-secondary)",
        "text-auxiliary": "var(--wot-text-auxiliary)",
        "text-white": "var(--wot-text-white)",
        "fill-content": "var(--wot-filled-content)",
        "fill-bottom": "var(--wot-filled-bottom)",
        "fill-oppo": "var(--wot-filled-oppo)",
        "line-main": "var(--wot-border-main)",
        "line-light": "var(--wot-border-light)",
        "primary-soft": "var(--wot-primary-1)",
        "warning-soft": "var(--wot-warning-surface)"
      }
    }
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["mdi"])
    })
  ]
}
