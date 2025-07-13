import Link from "next/link";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
    return (
        <nav className={`mb-8 ${className}`} aria-label="Навигационные крошки">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 uppercase">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <span className="text-red-600 mr-2">•</span>
                        )}
                        {item.href && index !== items.length - 1 ? (
                            <Link
                                href={item.href}
                                className="hover:text-red-600 transition-colors"
                                aria-label={`Перейти к ${item.label}`}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={index === items.length - 1 ? "text-red-600 font-medium" : ""}
                                aria-current={index === items.length - 1 ? "page" : undefined}
                            >
                {item.label}
              </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;

// Пример использования:
/*
const breadcrumbItems = [
  { label: "INICIO", href: "/" },
  { label: product.category.name.toUpperCase(), href: `/categoria/${product.category.slug}` },
  ...(product.productSubcategories?.length > 0 ? [{
    label: product.productSubcategories[0].subcategory.name.toUpperCase(),
    href: `/subcategoria/${product.productSubcategories[0].subcategory.slug}`
  }] : []),
  { label: product.name.toUpperCase() } // последний элемент без href - автоматически станет красным
];

<Breadcrumbs items={breadcrumbItems} />
*/