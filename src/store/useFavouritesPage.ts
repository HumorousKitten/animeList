import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IAnimeData } from '../types/types'


type TListAnime = Partial<
	Pick<
		IAnimeData,
		| 'mal_id'
		| 'titles'
		| 'trailer'
	>
>

interface IFavouriteItem {
	data: TListAnime
	rating: number
	date: number
}

interface IUseFavouritesStore {
	favouriteItems: IFavouriteItem[]
	addFavourite: (item: IFavouriteItem) => void;
	removeFavourite: (mal_id: number) => void;
	isFavourite: (mal_id: number) => boolean;
	sortFavoriteDate: (direction: 'asc' | 'desc') => IFavouriteItem[]
	sortFavoriteRating: (direction: 'asc' | 'desc') => IFavouriteItem[]
}

export const useFavouritesStore = create<IUseFavouritesStore>()(
  persist(
    (set, get) => ({
      favouriteItems: [],
      addFavourite: (item: IFavouriteItem) => set((state) => ({
        favouriteItems: [...state.favouriteItems, item],
      })),
      
      removeFavourite: (mal_id: number) => set((state) => ({
        favouriteItems: state.favouriteItems.filter(fav => fav.data.mal_id !== mal_id),
      })),

			isFavourite: (mal_id: number) => {
        const { favouriteItems } = get(); 
        return favouriteItems.some(fav => fav.data.mal_id === mal_id);
      },

			sortFavoriteDate: (direction: 'asc' | 'desc') => {
				set((state) => {
					const sortedArray = [...state.favouriteItems].sort((a, b) => {
						const dateA = new Date(a.date).getTime();
						const dateB = new Date(b.date).getTime();
						return direction === 'asc' ? dateA - dateB : dateB - dateA;
					});
					return { favouriteItems: sortedArray };
				});
			},
			
			sortFavoriteRating: (direction: 'asc' | 'desc') => {
				set((state) => {
					const sortedArray = [...state.favouriteItems].sort((a, b) => {
						return direction === 'asc' ? a.rating - b.rating : b.rating - a.rating;
					});
					return { favouriteItems: sortedArray };
				});
			}
    }),
    {
      name: 'favourites-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);