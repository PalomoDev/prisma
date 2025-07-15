// components/admin/tables/features-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatId } from "@/lib/utils";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteFeature } from "@/lib/actions/new/feature/manage.actions";
import { FeatureFull } from "@/lib/validations/new/feature.validation";
import Link from "next/link";
import Image from "next/image";

interface FeaturesTableProps {
  features: FeatureFull[];
}

const FeaturesTable = ({ features }: FeaturesTableProps) => {
  if (!features || features.length === 0) {
    return (
      <div className="text-center py-4">No se encontraron características</div>
    );
  }

  return (
    <TooltipProvider>
      <Table className="mt-4 border">
        <TableHeader>
          <TableRow>
            <TableHead className="border-r border-l text-center w-[60px]">
              ID
            </TableHead>
            <TableHead className="border-r text-center">NOMBRE</TableHead>
            <TableHead className="border-r text-center">CLAVE</TableHead>
            <TableHead className="border-r text-center">ICONO</TableHead>
            <TableHead className="border-r text-center">IMAGEN</TableHead>
            <TableHead className="border-r text-center">DESCRIPCIÓN</TableHead>
            <TableHead className="border-r text-center w-[80px]">
              ORDEN
            </TableHead>
            <TableHead className="border-r text-center w-[80px]">
              ACTIVO
            </TableHead>
            <TableHead className="border-r text-center w-[100px]">
              PRODUCTOS
            </TableHead>
            <TableHead className="border-r text-center w-[120px]">
              ACCIONES
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature) => (
            <TableRow key={feature.id}>
              <TableCell className="border-r border-l text-center">
                {formatId(feature.id)}
              </TableCell>
              <TableCell className="border-r text-center">
                {feature.name}
              </TableCell>
              <TableCell className="border-r text-center">
                {feature.key}
              </TableCell>
              <TableCell className="border-r text-center">
                {feature.icon || "–"}
              </TableCell>
              <TableCell className="border-r text-center">
                {feature.iconImage ? (
                  <div className="flex justify-center">
                    <Image
                      src={feature.iconImage}
                      alt={feature.name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  "–"
                )}
              </TableCell>
              <TableCell className="border-r text-center max-w-[200px]">
                {feature.description ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="truncate cursor-help">
                        {feature.description}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{feature.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  "–"
                )}
              </TableCell>
              <TableCell className="border-r text-center">
                {feature.sortOrder}
              </TableCell>
              <TableCell className="border-r text-center">
                {feature.isActive ? (
                  <Check className="w-4 h-4 text-green-600 mx-auto" />
                ) : (
                  <X className="w-4 h-4 text-red-600 mx-auto" />
                )}
              </TableCell>
              <TableCell className="border-r text-center">
                {feature._count?.productFeatures || 0}
              </TableCell>
              <TableCell className="flex items-center justify-center gap-1">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/products/features/edit/${feature.id}`}>
                    <Pencil className="w-4 h-4" />
                  </Link>
                </Button>
                {(feature._count?.productFeatures || 0) > 0 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    title={`No se puede eliminar: la característica tiene ${feature._count?.productFeatures} productos`}
                  >
                    Eliminar
                  </Button>
                ) : (
                  <DeleteDialog id={feature.id} action={deleteFeature} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};

export default FeaturesTable;
