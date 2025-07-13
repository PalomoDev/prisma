'use client'
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type SearchButtonProps = {
    className?: string;
};

const SearchButton = ({ className }: SearchButtonProps) => {
    const router = useRouter();

    const handleClick = () => {
        // TODO: Открыть модальное окно поиска или перейти на страницу поиска
        console.log('Search button clicked - implement search functionality');
        // router.push('/search');
    }

    return (
        <Button
            className={className}
            variant="ghost"
            onClick={handleClick}
            aria-label="Поиск"
        >
            <Search size={24} />
        </Button>
    );
};

export default SearchButton;