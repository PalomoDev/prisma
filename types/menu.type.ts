export type MenuTextItem = {
  name: string;
  href: string;
};

export type MenuCategory = {
  title: string;
  items: MenuTextItem[];
};

export type ImageMenuItem = {
  name: string;
  href: string;
  image: string;
  alt?: string;
  description?: string;
};

// Новый тип для элементов меню с указанием типа отображения
export type MenuItem = {
  title: string;
  href: string;
  categories: MenuCategory[];
  displayType: "text-menu" | "image-grid";
};

export type MenuProps = {
  categories: MenuCategory[];
  actividades: ImageMenuItem[];
};
