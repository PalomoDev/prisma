'use client';


import {Control, SubmitHandler, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {useEffect, useState, useTransition} from "react";
import { useActionState } from "react";
import { updateUserAddress} from "@/lib/actions/user.actions";
import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from "@/lib/validations/user.validation";
import { SHIPPING_ADDRESS_DEFAULT } from "@/lib/constants";
import {useRouter} from "next/navigation";
import {z} from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { ShippingAddressFormFieldProps } from "@/types";
import { ShippingAddressFormFields } from "@/lib/constants";
import { isEqual } from 'lodash';


interface AddressFormProps {
    address: ShippingAddress;
}

const AddressForm = ({ address }: AddressFormProps) => {
    const router = useRouter();

    const isDefaultAddress = isEqual(address, SHIPPING_ADDRESS_DEFAULT);

    const [formState, setFormState] = useState({
        isFormChanged: false,
        isFormValid: false,
        isDefaultValues: isDefaultAddress
    });

    const form = useForm<ShippingAddress>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || SHIPPING_ADDRESS_DEFAULT
    });
    const [isPending, startTransition] = useTransition();

    // Отслеживаем изменения формы и её валидность
    useEffect(() => {
        const subscription = form.watch((formValues) => {
            // Проверяем, изменились ли значения формы по сравнению с исходным адресом
            const hasChanged = !isEqual(formValues, address);

            console.log('Changed:', hasChanged);

            // Проверяем, используются ли значения по умолчанию
            const isDefault = isEqual(formValues, SHIPPING_ADDRESS_DEFAULT);

            console.log('Default:', isDefault);

            setFormState(prev => ({
                ...prev,
                isFormChanged: hasChanged,
                isDefaultValues: isDefault
            }));
        });

        return () => subscription.unsubscribe();
    }, [form, address]);

    // Отслеживаем валидность формы
    useEffect(() => {

        console.log('Valid:', form.formState.isValid);
        setFormState(prev => ({
            ...prev,
            isFormValid: form.formState.isValid
        }));
    }, [form.formState.isValid]);


    const onSubmit: SubmitHandler<ShippingAddress> = async (data) => {
        startTransition(async () => {
            const result = await updateUserAddress(data);
            if(!result.success) {
                console.log(result.message);
                return
            }
        })
        return
    }

    const handleProceedToCheckout = () => {
        router.push('/shipping-method')
    }

    const formField = ({
                           key,
                           name,
                           label,
                           placeholder,
                           control,
                           className = "w-full",
                           type = "text"
                       }: ShippingAddressFormFieldProps) => {
        return (
            <div key={key} className={`flex flex-col md:flex-row gap-5 ${className}`}>
                <FormField
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                                <Input
                                    type={type}
                                    placeholder={placeholder || label}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        );
    };

    return (
        <div className="w-full  mx-auto space-y-4">
            <h1 className="text-2xl font-semibold mb-6">Dirección de envío</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} method={'post'} className="space-y-4">
                    {ShippingAddressFormFields.map((field) => (
                        formField({
                            ...field,
                            control: form.control,
                            key: field.name
                        })
                    ))}
                    <div className="flex gap-3 justify-between mt-6">
                        <Button
                            type="submit"
                            className="flex-1"
                            aria-label="Сохранить адрес"
                            disabled={isPending || !formState.isFormChanged || !formState.isFormValid}
                        >
                            {isPending ? ('Guardando...') : ('Guardar')}
                        </Button>
                        <Button

                            type="button"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                            onClick={handleProceedToCheckout}
                            aria-label="Продолжить оформление"
                            disabled={isPending || formState.isDefaultValues || !formState.isFormValid}
                        >
                            Продолжить оформление
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AddressForm;