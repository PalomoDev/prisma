type MenuTextItem = {
    name: string;
    href: string;
};

export type MenuCategory = {
    title: string;
    items: MenuTextItem[];
};
type ImageMenuItem = {
    name: string;
    href: string;
    image: string;
    alt?: string;
};

export type MenuProps = {
    categories: MenuCategory[];
    actividades: ImageMenuItem[];
};

