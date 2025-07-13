// components/admin/tables/specifications-table.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatId } from "@/lib/utils";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteSpecification } from "@/lib/actions/spec-features.actions";
import Link from "next/link";
import Image from "next/image";

interface SpecificationsTableProps {
    specifications: any[]; // Или создайте правильный тип
}

const SpecificationsTable = ({ specifications }: SpecificationsTableProps) => {
    if (!specifications || specifications.length === 0) {
        return (
            <div className="text-center py-4">
                No se encontraron especificaciones
            </div>
        );
    }

    return (
        <TooltipProvider>
            <Table className="mt-4 border">
                <TableHeader>
                    <TableRow>
                        <TableHead className="border-r border-l text-center w-[60px]">ID</TableHead>
                        <TableHead className="border-r text-center">NOMBRE</TableHead>
                        <TableHead className="border-r text-center">CLAVE</TableHead>
                        <TableHead className="border-r text-center">TIPO</TableHead>
                        <TableHead className="border-r text-center">UNIDAD</TableHead>
                        <TableHead className="border-r text-center">ICONO</TableHead>
                        <TableHead className="border-r text-center">DESCRIPCIÓN</TableHead>
                        <TableHead className="border-r text-center">CATEGORÍAS</TableHead>
                        <TableHead className="border-r text-center w-[80px]">ORDEN</TableHead>
                        <TableHead className="border-r text-center w-[80px]">ACTIVO</TableHead>
                        <TableHead className="border-r text-center w-[100px]">PRODUCTOS</TableHead>
                        <TableHead className="border-r text-center w-[120px]">ACCIONES</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {specifications.map((spec) => (
                        <TableRow key={spec.id}>
                            <TableCell className="border-r border-l text-center">{formatId(spec.id)}</TableCell>
                            <TableCell className="border-r text-center">{spec.name}</TableCell>
                            <TableCell className="border-r text-center">{spec.key}</TableCell>
                            <TableCell className="border-r text-center">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {spec.type}
                                </span>
                            </TableCell>
                            <TableCell className="border-r text-center">{spec.unit || '–'}</TableCell>
                            <TableCell className="border-r text-center">
                                {spec.icon ? (
                                    <div className="flex justify-center">
                                        <Image
                                            src={spec.icon}
                                            alt={spec.name}
                                            width={24}
                                            height={24}
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    '–'
                                )}
                            </TableCell>
                            <TableCell className="border-r text-center max-w-[200px]">
                                {spec.description ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="truncate cursor-help">
                                                {spec.description}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs">{spec.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    '–'
                                )}
                            </TableCell>
                            <TableCell className="border-r text-center max-w-[200px]">
                                {spec.categorySpecs && spec.categorySpecs.length > 0 ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="truncate cursor-help">
                                                {spec.categorySpecs.length === 1
                                                    ? spec.categorySpecs[0].category.name
                                                    : `${spec.categorySpecs.length} categorías`
                                                }
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="max-w-xs">
                                                {spec.categorySpecs.map((cs: any, index: number) => (
                                                    <div key={cs.id}>
                                                        {index > 0 && ', '}
                                                        {cs.category.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    '–'
                                )}
                            </TableCell>
                            <TableCell className="border-r text-center">{spec.sortOrder}</TableCell>
                            <TableCell className="border-r text-center">
                                {spec.isActive ? (
                                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                                ) : (
                                    <X className="w-4 h-4 text-red-600 mx-auto" />
                                )}
                            </TableCell>
                            <TableCell className="border-r text-center">
                                {spec._count?.productSpecifications || 0}
                            </TableCell>
                            <TableCell className="flex items-center justify-center gap-1">
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={`/admin/products/specifications/edit/${spec.id}`}>
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                </Button>
                                {(spec._count?.productSpecifications || 0) > 0 ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled
                                        title={`No se puede eliminar: la especificación tiene ${spec._count?.productSpecifications} productos`}
                                    >
                                        Eliminar
                                    </Button>
                                ) : (
                                    <DeleteDialog id={spec.id} action={deleteSpecification} />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TooltipProvider>
    );
};

export default SpecificationsTable;