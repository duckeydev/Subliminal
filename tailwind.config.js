/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./views/**/*", "./assets/**/*", "./node_modules/preline/**/*"],
  theme: {
    extend: {
      fontFamily: {
        calsans: "Cal Sans"
      },
    },
  },
  plugins: [
    require('preline/plugin'),
    require("@catppuccin/tailwindcss")({
      // prefix to use, e.g. `text-pink` becomes `text-ctp-pink`.
      // default is `false`, which means no prefix
      prefix: "ctp",
      // which flavour of colours to use by default, in the `:root`
      defaultFlavour: "mocha",
    }),
    require("@tailwindcss/forms")
  ],
}

