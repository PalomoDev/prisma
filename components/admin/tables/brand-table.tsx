import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Pencil, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";
import { GetBrandsResponse } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { deleteBrand } from "@/lib/actions/new/brand/brand.actions";

interface BrandTableProps {
  brands: GetBrandsResponse;
}

const BrandTable = ({ brands }: BrandTableProps) => {
  if (!brands.success || !brands.data) {
    return (
      <div className="text-center py-4">
        {brands.message || "No brands found"}
      </div>
    );
  }

  return (
    <Table className={"mt-4 border"}>
      <TableHeader>
        <TableRow>
          <TableHead className="border-r border-l text-center w-[150px]">
            BRAND
          </TableHead>
          <TableHead className="border-r text-center hidden md:table-cell">
            SLUG
          </TableHead>
          <TableHead className="border-r text-center hidden md:table-cell">
            DESCRIPTION
          </TableHead>
          <TableHead className="border-r text-center w-[80px] hidden md:table-cell">
            LOGO
          </TableHead>
          <TableHead className="border-r text-center w-[100px] hidden md:table-cell">
            WEBSITE
          </TableHead>
          <TableHead className="border-r text-center w-[80px]">
            PRODUCTS
          </TableHead>
          <TableHead className="border-r text-center w-[60px] hidden md:table-cell">
            ORDER
          </TableHead>
          <TableHead className="border-r text-center w-[80px] hidden md:table-cell">
            ACTIVE
          </TableHead>
          <TableHead className="border-r text-center w-[120px] hidden md:table-cell">
            ACTION
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brands.data.map((brand) => (
          <TableRow key={brand.id}>
            <TableCell className="border-r border-l text-center font-medium">
              {brand.name}
            </TableCell>
            <TableCell className="border-r border-l text-center hidden md:table-cell">
              {brand.slug}
            </TableCell>
            <TableCell className="border-r border-l text-center hidden md:table-cell">
              {brand.description ? (
                <span className="cursor-help" title={brand.description}>
                  {brand.description.length > 50
                    ? `${brand.description.substring(0, 50)}...`
                    : brand.description}
                </span>
              ) : (
                "–"
              )}
            </TableCell>
            <TableCell className="border-r border-l text-center hidden md:table-cell">
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={32}
                  height={32}
                  className="object-contain mx-auto"
                />
              ) : (
                "–"
              )}
            </TableCell>
            <TableCell className="border-r border-l text-center hidden md:table-cell">
              {brand.website ? (
                <Button asChild variant="ghost" size="sm">
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={brand.website}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              ) : (
                "–"
              )}
            </TableCell>
            <TableCell className="border-r border-l text-center">
              {brand._count?.products || 0}
            </TableCell>
            <TableCell className="border-r border-l text-center hidden md:table-cell">
              {brand.sortOrder}
            </TableCell>
            <TableCell className="border-r border-l text-center hidden md:table-cell">
              {brand.isActive ? (
                <Check className="w-4 h-4 text-green-600 mx-auto" />
              ) : (
                <X className="w-4 h-4 text-red-600 mx-auto" />
              )}
            </TableCell>
            <TableCell className="flex justify-center gap-1 hidden md:table-cell">
              <Button asChild variant="ghost" size="sm">
                <Link
                  href={`/admin/products/category/update-brand/${brand.id}`}
                >
                  <Pencil className="w-4 h-4" />
                </Link>
              </Button>
              {brand._count?.products > 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  title={`Cannot delete: brand has ${brand._count.products} products`}
                >
                  Delete
                </Button>
              ) : (
                <DeleteDialog id={brand.id} action={deleteBrand} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BrandTable;
