"use client"

import { Favorites } from "@/bounded-contexts/user-preferences-context";


const FavoritesPage: React.FC = () => {

    return (
        <div className='w-full'>
            <h2 className='title text-3xl p-1 md:p-4 capitalize'>my favorites videos</h2>

            <div className="pb-4 pt-4 md:absolute md:z-100 md:p-2 md:m-1 sm:max-w-screen-sm md:max-w-screen-xl">
                <Favorites />
            </div>

        </div>
    );
};

export default FavoritesPage;
