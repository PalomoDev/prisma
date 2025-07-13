import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Отключаем правило для 'any'
      "@typescript-eslint/no-explicit-any": "off",

      // Настраиваем правило для неиспользуемых переменных

      "@typescript-eslint/no-unused-vars": "off",

      // Отключаем базовое правило no-unused-vars (используем TypeScript версию)
      "no-unused-vars": "off",

      // Дополнительные правила
      "prefer-const": "error"
    }
  }
];

export default eslintConfig;