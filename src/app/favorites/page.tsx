"use client"

import Favorites, { FavoriteType } from "@/search-context/search-provider/components/favorites/Favorites";
import { useRouter } from "next/navigation";


const FavoritesPage: React.FC = () => {

    const router = useRouter()

    const handleSelectFavorite = (favorite: FavoriteType) => {
        console.log('selected favorite', favorite);
        router.push(`?keywords=${favorite.title} ${favorite.originalTitle ? favorite.originalTitle : ''} ${favorite.originalTitle ? favorite.lastEpisode : ''}`);
    };

    return (
        <div className='container w-full'>
            <h2 className='title text-4xl p-1 md:p-4 capitalize'>my favorites videos</h2>

            <div className="pb-4 pt-4 md:absolute md:z-100 md:p-2 md:m-1 w-2/4">
                <h3 className='title text-4xl p-1 md:p-4 capitalize'>favorites</h3>
                <Favorites onSelected={handleSelectFavorite} />
            </div>

        </div>
    );
};

export default FavoritesPage;
