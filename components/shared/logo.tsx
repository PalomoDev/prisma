import Image from "next/image";
import React from "react";

interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
    hideIcon?: boolean; // Новый пропс для скрытия иконки
}

const logoSizes = {
    small: {
        icon: { width: 32, height: 32 },
        name: { width: 120, height: 20 },
        spacing: 'ml-1'
    },
    medium: {
        icon: { width: 33, height: 33 },
        name: { width: 210, height: 40 },
        spacing: 'ml-2'
    },
    large: {
        icon: { width: 80, height: 80 },
        name: { width: 320, height: 50 },
        spacing: 'ml-3'
    }
};

export default function Logo({ size = 'medium', className = '', hideIcon = false }: LogoProps) {
    const currentSize = logoSizes[size];

    return (
        <div className={`w-full flex items-center justify-center ${className}`}>
            <div className="flex items-center">
                {/* Показываем иконку только если hideIcon = false */}
                {!hideIcon && (
                    <Image
                        src="/logo/logo-round.svg"
                        alt="Логотип"
                        width={currentSize.icon.width}
                        height={currentSize.icon.height}
                        priority
                    />
                )}
                <Image
                    src="/logo/logo-name.svg"
                    alt="Название компании"
                    width={currentSize.name.width}
                    height={currentSize.name.height}
                    className={hideIcon ? '' : currentSize.spacing} // Убираем отступ если нет иконки
                    priority
                />
            </div>
        </div>
    );
}