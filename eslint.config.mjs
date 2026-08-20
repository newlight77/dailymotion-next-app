import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      "src/tmp/**",
      ".next/**",
      "node_modules/**",
      "out/**",
      "public/uploads/**",
      "scripts/**",
      "prisma/**",
      "src/generated/**",
    ],
  },
];

export default eslintConfig;
