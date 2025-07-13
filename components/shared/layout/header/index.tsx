// Header.tsx (серверный компонент)
import { auth } from "@/auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import Logo from "@/components/shared/logo";
import CartButton from "@/components/shared/layout/header/cart-button";
import { getMyCart } from "@/lib/actions/cart.actions";
import { countCartItems } from "@/lib/utils/count-cart-items";
import UserDropdown from "@/components/shared/layout/header/user-dropdown";
import AdaptiveNavigation from "@/components/shared/layout/header/menu/top-menu";
import SearchButton from "@/components/shared/layout/header/search-button";
import { getCategoriesLight } from "@/lib/actions/new/category/get.actions";
import { CategoryLight } from "@/lib/validations/new/category.validation";
import { ImageMenuItem } from "@/types/menu.type";

// Моковые данные для ACTIVIDADES с картинками
const actividadesImageData: ImageMenuItem[] = [
  {
    name: "Senderismo",
    href: "/products/senderismo",
    image: "/activities/senderismo.png",
    alt: "Senderismo en la montaña",
  },
  {
    name: "Alpinismo",
    href: "/products/alpinismo",
    image: "/activities/alpinismo.png",
    alt: "Alpinismo profesional",
  },
  {
    name: "Escalada",
    href: "/products/escalada",
    image: "/activities/escalada.png",
    alt: "Escalada en roca",
  },
  {
    name: "Vía ferrata",
    href: "/products/via-ferrata",
    image: "/activities/via-ferrata.png",
    alt: "Vía ferrata aventura",
  },
  {
    name: "Trail Running",
    href: "/products/trail-running",
    image: "/activities/trail-running.png",
    alt: "Trail running en montaña",
  },
];

const transformCategoriesToMenu = (categories: CategoryLight[]) => {
  return categories.map((category) => ({
    title: category.name,
    items: [
      // Добавляем пункт "Ver todo"
      {
        name: "Ver todo",
        href: `/products/${category.slug}`,
      },
      // Добавляем все подкатегории
      ...category.categorySubcategories.map((catSubcat) => ({
        name: catSubcat.subcategory.name,
        href: `/products/${category.slug}/${catSubcat.subcategory.slug}`,
      })),
    ],
  }));
};

export default async function Header() {
  // Получаем сессию напрямую на сервере
  const session = await auth();
  const cart = await getMyCart();
  const count = countCartItems(cart?.items);
  const categoriesResponse = await getCategoriesLight();
  const menuCategories = categoriesResponse.success
    ? transformCategoriesToMenu(categoriesResponse.data || [])
    : [];

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between bg-white/95 z-50 pb-4">
      <div className={"relative wrapper flex items-end justify-between"}>
        <div className="flex items-center pl-6">
          <Link href="/">
            <Logo size={"medium"} />
          </Link>
        </div>
        <AdaptiveNavigation
          products={menuCategories}
          actividades={actividadesImageData}
        />

        <div className="flex items-center pr-4">
          <div>
            <SearchButton />
          </div>
          <div className="ml-2">
            <CartButton quantity={count} />
          </div>
          <div className="ml-5">
            {session && session.user ? (
              <UserDropdown user={session.user} />
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
