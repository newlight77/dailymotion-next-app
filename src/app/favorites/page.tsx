"use client"

import Favorites from "@/search-context/search-provider/view/favorites/Favorites";
import { FavoriteType } from "@/search-context/search-provider/domain/anime";
import { useRouter } from "next/navigation";

const FavoritesPage: React.FC = () => {

    const router = useRouter()

    const handleSelectFavorite = (favorite: FavoriteType) => {
        const title = encodeURIComponent(`${favorite.title} ${favorite.originalTitle ? favorite.lastEpisode : ''}`)
        router.push(`/?keywords=${title}`);
    };

    return (
        <div className='w-full'>
            <h2 className='title text-3xl p-1 md:p-4 capitalize'>my favorites videos</h2>

            <div className="pb-4 pt-4 md:absolute md:z-100 md:p-2 md:m-1 sm:max-w-screen-sm md:max-w-screen-xl">
                <Favorites onSelected={handleSelectFavorite} />
            </div>

        </div>
    );
};

export default FavoritesPage;
