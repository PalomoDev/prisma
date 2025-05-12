import Image from "next/image";
import React from "react";

export default function Logo() {
    return (
        <div className="w-full flex items-center justify-center">
            <div className="flex items-center">
                <Image
                    src="/logo/logo-round.svg"
                    alt="Логотип"
                    width={60}
                    height={60}
                    priority
                />
                <Image
                    src="/logo/logo-name.svg"
                    alt="Название компании"
                    width={250}
                    height={40}
                    className="ml-2"
                    priority
                />
            </div>
        </div>
    )
}