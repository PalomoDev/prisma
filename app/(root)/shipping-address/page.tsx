import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@/auth";
import AddressForm from "./address-form";
import { shippingAddressSchema } from "@/lib/validations/user.validation";
import { ShippingAddress } from "@/types";
import { z } from "zod";
import {SHIPPING_ADDRESS_DEFAULT} from "@/lib/constants";
import CheckoutSteps from "@/components/card/checkout-steps";


const ShippingAddressPage = async () => {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) throw new Error('User not found')

    const user = await getUserById(userId)

    const validateAddress = (addressData: unknown): {
        isValid: boolean;
        address?: ShippingAddress;
    } => {
        try {
            // Если addressData строка, пробуем её распарсить
            const addressObj = typeof addressData === 'string'
                ? JSON.parse(addressData)
                : addressData;

            // Валидация через ZOD схему
            const result = shippingAddressSchema.safeParse(addressObj);

            if (result.success) {
                return {
                    isValid: true,
                    address: result.data
                };
            } else {
                return {
                    isValid: false,

                };
            }
        } catch (error) {
            console.error('Failed to parse address data:', error);
            return {
                isValid: false,
            };
        }
    };

    return (
        <div className="p-4 w-full">
            <CheckoutSteps current={1}/>

            {user && (
                <AddressForm
                    address={
                        (user.address && validateAddress(user.address).isValid)
                            ? validateAddress(user.address).address as ShippingAddress
                            : SHIPPING_ADDRESS_DEFAULT
                    }
                />
            )}
        </div>
    );
}

export default ShippingAddressPage