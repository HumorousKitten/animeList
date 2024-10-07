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
	sortFavoriteDate: (direction: 'asc' | 'desc', arr: IFavouriteItem[]) => IFavouriteItem[]
	sortFavoriteRating: (direction: 'asc' | 'desc', arr: IFavouriteItem[]) => IFavouriteItem[]
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

			sortFavoriteDate: (direction: 'asc' | 'desc', arr) => {
				return (direction === 'asc') ? [...arr].sort((a, b) => {
					return a.date - b.date
				}) : [...arr].sort((a, b) => {
					return a.date - b.date
				}).reverse()
			},

			sortFavoriteRating: (direction: 'asc' | 'desc', arr) => {
				return (direction === 'asc') ? [...arr].sort((a, b) => {
					return a.rating - b.rating
				}) : [...arr].sort((a, b) => {
					return a.rating - b.rating
				}).reverse()
			}
    }),
    {
      name: 'favourites-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);