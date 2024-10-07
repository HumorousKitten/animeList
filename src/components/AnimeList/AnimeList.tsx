import axios from 'axios'
import React from 'react'
import { IAnimeData } from '../../types/types'
import { Pagination } from '../pagination/Pagination'
import PaginationElement from '../pagination/paginationElement/PaginationElement'
import AnimeCard from './animeCard/AnimeCard'
import style from './animeList.module.css'

type TListAnime = Pick<
	IAnimeData,
	'mal_id' | 'titles' | 'score' | 'rating' | 'images' | 'scored_by'
>

interface IAnimeDataOnPage {
	data: TListAnime[]
	pagination: {
		last_visible_page: number
		has_next_page: boolean
		current_page: number
	}
}

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
	const [dataList, setDataList] = React.useState<IAnimeDataOnPage>({
		data: [],
		pagination: {
			last_visible_page: 0,
			has_next_page: false,
			current_page: 0,
		},
	})

	const [currentPage, setCurrentPage] = React.useState<number>(1)
	const VISIBLE_ELEMENTS: number = 3
	let startPage = 1
	const endPage = dataList.pagination.last_visible_page


	if(currentPage > startPage + 2)
		startPage = currentPage - VISIBLE_ELEMENTS + 1

	React.useEffect(() => {
		async function getAnimeData() {
			try {
				const data: IData = (
					await axios.get<IData>(`https://api.jikan.moe/v4/anime?page=${currentPage}&limit=16`)
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
	
				setDataList({
					data: dataArr,
					pagination: {
						last_visible_page: data.pagination.last_visible_page,
						has_next_page: data.pagination.has_next_page,
						current_page: data.pagination.current_page,
					},
				})
			}catch(error: unknown){
				console.log('message: ', error)
			}
		}
		getAnimeData()
	}, [currentPage])

	function selectPage(e: React.MouseEvent<HTMLUListElement>){
		const elem = e.target as HTMLElement
		if(!elem.textContent || elem.textContent === '...') return
		setCurrentPage(+elem.textContent)
	}

	return (
		<main className={style.main}>
			<section className={style.animeList}>
				{dataList.data.length !== 0
					? dataList.data.map((item, index) => (
							<AnimeCard key={item.mal_id + index} data={item} />
					  ))
					: null}
			</section>

			<Pagination>
				<ul className={style.paginationList} onClick={selectPage}>
					<PaginationElement
						onClickFunc={() => {
							setCurrentPage(prevState => Math.max(prevState - 1, 1))
						}}
					><img src="/icons/chevron-left.svg" alt="prevPage" /></PaginationElement>
					{Array.from(
						{ length: startPage + VISIBLE_ELEMENTS - startPage },
						(_, i) => (
							<PaginationElement
								key={'Page' + '#' + i}
								color = {
									currentPage === startPage + i ?
									{background: 'black', color: "#fff"} : {background: '#fff', color: "black"}
								}
							><span>{startPage + i}</span></PaginationElement>
						)
					)}
					{currentPage !== endPage ? (
						<PaginationElement><span>...</span></PaginationElement>
					) : null}
					{currentPage !== endPage ? (
						<PaginationElement
						><span>{endPage}</span></PaginationElement>
					) : null}
					<PaginationElement
						onClickFunc={() => {
							setCurrentPage(prevState =>
								Math.min(prevState + 1, dataList.pagination.last_visible_page)
							)
						}}
					><img src="/icons/chevron-right.svg" alt="nextPage" /></PaginationElement>
				</ul>
			</Pagination>
		</main>
	)
}

export default AnimeList
