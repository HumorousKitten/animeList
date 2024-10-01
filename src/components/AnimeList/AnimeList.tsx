import axios from 'axios'
import React from 'react'
import { IAnimeData } from '../../types/types'
import AnimeCard from './animeCard/AnimeCard'
import style from './animeList.module.css'
type listState = Pick<
	IAnimeData,
	'mal_id' | 'titles' | 'score' | 'rating' | 'images' | 'scored_by'
>

type TPagination = {
	last_visible_page: number
	has_next_page: boolean
	current_page: number
	items: {
		count: number
		total: number
		per_page: number
	}
}

interface IData {
	data: IAnimeData[]
	pagination: TPagination
}

const AnimeList = () => {
	const [dataList, setDataList] = React.useState<listState[]>([])
	console.log(dataList)
	React.useEffect(() => {
		async function getAnimeData() {
			const data: IData = (
				await axios.get<IData>('https://api.jikan.moe/v4/anime?page=1&limit=16')
			).data
			const dataArr = data.data.map(item => {
				return {
					mal_id: item.mal_id,
					titles: item.titles,
					score: item.score,
					rating: item.rating,
					images: item.images,
					scored_by: item.scored_by,
				}
			})

			setDataList(dataArr)
		}
		getAnimeData()
	}, [])

	return (
		<main className={style.main}>
			<section className={style.animeList}>
				{dataList
					? dataList.map(item => <AnimeCard key={item.mal_id} data={item} />)
					: null}
			</section>
		</main>
	)
}

export default AnimeList
