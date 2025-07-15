import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import DeleteDialog from "@/components/shared/delete-dialog";
import { GetSubcategoriesFullResponse } from "@/lib/validations/new/subcategory.validation";
import Link from "next/link";
import Image from "next/image";
import { deleteSubcategory } from "@/lib/actions/new/subcategory/manage.actions";

interface SubCategoryTableProps {
  subCategories: GetSubcategoriesFullResponse;
}

const SubCategoryTable = ({ subCategories }: SubCategoryTableProps) => {
  if (!subCategories.success || !subCategories.data) {
    return (
      <div className="text-center py-4">
        {subCategories.message || "No subcategories found"}
      </div>
    );
  }

  return (
    <Table className={"mt-4 border"}>
      <TableHeader>
        <TableRow>
          <TableHead className="border-r border-l text-center w-[187px]">
            SUBCATEGORY
          </TableHead>
          <TableHead className="border-r text-center">SLUG</TableHead>
          <TableHead className="border-r text-center">DESCRIPTION</TableHead>
          <TableHead className="border-r text-center">IMAGE</TableHead>
          <TableHead className="border-r text-center">CATEGORIES</TableHead>
          <TableHead className="border-r text-center w-[60px]">
            PRODUCTS
          </TableHead>
          <TableHead className="border-r text-center w-[60px]">ORDER</TableHead>
          <TableHead className="border-r text-center w-[80px]">
            ACTIVITY
          </TableHead>
          <TableHead className="border-r text-center w-[80px]">
            ACTIVE
          </TableHead>
          <TableHead className="border-r text-center w-[120px]">
            ACTION
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subCategories.data.map((subcategory) => {
          const availableCategories =
            subcategory.categorySubcategories?.map((cs) => cs.category.name) ||
            [];

          return (
            <TableRow key={subcategory.id}>
              <TableCell className="border-r border-l text-center">
                {subcategory.name}
              </TableCell>
              <TableCell className="border-r border-l text-center">
                {subcategory.slug}
              </TableCell>
              <TableCell className="border-r border-l text-center">
                {subcategory.description ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help underline decoration-dotted">
                        {subcategory.description.length > 30
                          ? `${subcategory.description.substring(0, 30)}...`
                          : subcategory.description}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{subcategory.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  "–"
                )}
              </TableCell>
              <TableCell className="border-r border-l text-center">
                {subcategory.image ? (
                  <div className="flex justify-center">
                    <Image
                      src={subcategory.image}
                      alt={subcategory.name}
                      width={40}
                      height={40}
                      className="object-cover rounded border"
                    />
                  </div>
                ) : (
                  "–"
                )}
              </TableCell>
              <TableCell className="border-r border-l text-center">
                {availableCategories.length > 0 ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help underline decoration-dotted">
                        {availableCategories[0]}
                        {availableCategories.length > 1 && "..."}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{availableCategories.join(", ")}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span className="text-muted-foreground">No categories</span>
                )}
              </TableCell>
              <TableCell className="border-r border-l text-center">
                {subcategory._count.productSubcategories}
              </TableCell>
              <TableCell className="border-r border-l text-center">
                {subcategory.sortOrder}
              </TableCell>
              <TableCell className="border-r border-l text-center">
                {subcategory.isActivity ? (
                  <Check className="w-4 h-4 text-green-600 mx-auto" />
                ) : (
                  <X className="w-4 h-4 text-red-600 mx-auto" />
                )}
              </TableCell>
              <TableCell className="border-r border-l text-center">
                {subcategory.isActive ? (
                  <Check className="w-4 h-4 text-green-600 mx-auto" />
                ) : (
                  <X className="w-4 h-4 text-red-600 mx-auto" />
                )}
              </TableCell>
              <TableCell className="flex justify-center gap-1">
                <Button asChild variant="ghost" size="sm">
                  <Link
                    href={`/admin/products/category/update-subcategory/${subcategory.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                </Button>
                {subcategory._count.productSubcategories > 0 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    title={`Cannot delete: subcategory contains ${subcategory._count.productSubcategories} products`}
                  >
                    Delete
                  </Button>
                ) : (
                  <DeleteDialog
                    id={subcategory.id}
                    action={deleteSubcategory}
                  />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SubCategoryTable;
