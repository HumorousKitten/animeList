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

// type THoverBlock = {
// 	width: number
// 	bottom: number
// 	left: number
// 	right: number
// 	top: number
// 	height: number
// }

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

	// const [isHoverAnimeInfo, setIsHoverAnimeInfo] = React.useState<boolean>(false)
	// const hoverBlockCoord = React.useRef<THoverBlock>({
	// 	width: 0,
	// 	bottom: 0,
	// 	left: 0,
	// 	right: 0,
	// 	top: 0,
	// 	height: 0
	// })

	// let intervalId: ReturnType<typeof setInterval> 

	if (currentPage > startPage + 2)
		startPage = currentPage - VISIBLE_ELEMENTS + 1

	React.useEffect(() => {
		async function getAnimeData() {
			try {
				const data: IData = (
					await axios.get<IData>(
						`https://api.jikan.moe/v4/anime?page=${currentPage}&limit=16`
					)
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
			} catch (error: unknown) {
				console.log('message: ', error)
			}
		}
		getAnimeData()
	}, [currentPage])

	function selectPage(e: React.MouseEvent<HTMLUListElement>) {
		const elem = e.target as HTMLElement
		if (!elem.textContent || elem.textContent === '...') return
		setCurrentPage(+elem.textContent)
	}

	// function timerForHovering(seconds: number): Promise<number> {
	// 	return new Promise<number>((resolve) => {
	// 		intervalId = setInterval(() => {
	// 			seconds--
	// 			console.log(seconds)
	// 			if(seconds <= 0){
	// 				console.log(seconds)
	// 				clearInterval(intervalId)
	// 				resolve(seconds)
	// 			}
	// 		}, 1000)
	// 	})
	// }

	// async function hoverAnimeCard(e: React.MouseEvent<HTMLElement>) {
	// 	const animeCard = e.target as HTMLElement
	// 	console.log(animeCard.tagName)
	// 	if (!animeCard) return
	// 	if (animeCard.tagName === 'DIV') {
	// 		const waiting = await timerForHovering(2)
	// 		console.log(waiting)
	// 		if(waiting === 0){
	// 			const cardCoord = animeCard.getBoundingClientRect()
	// 			console.log(cardCoord)
	// 			setIsHoverAnimeInfo(true)
	// 			hoverBlockCoord.current = {
	// 				width: cardCoord.width,
	// 				bottom: cardCoord.bottom,
	// 				top: cardCoord.top,
	// 				right: cardCoord.right,
	// 				left: cardCoord.left,
	// 				height: cardCoord.height
	// 			}
	// 			console.log(hoverBlockCoord)
	// 			console.log(hoverBlockCoord.current.right)
	// 		}
	// 	}
	// 	clearInterval(intervalId);
	// }

	// function leaveFromAnimeCard(e:React.MouseEvent<HTMLElement>) {
	// 	clearInterval(intervalId)
	// }

	return (
		<main className={style.main}>
			<section className={style.animeList}>
				{dataList.data.length !== 0
					? dataList.data.map((item, index) => (
							<AnimeCard key={item.mal_id + index} data={item} />
					  ))
					: null}
				{/* {isHoverAnimeInfo ? (
					<div 
						className={style.hoverAnimeInfo}
						style={{
							left: `${hoverBlockCoord.current.left}px`,
							right: `${hoverBlockCoord.current.right}px`,
							top: `${hoverBlockCoord.current.top}px`,
							bottom: `${hoverBlockCoord.current.bottom}px`,
							width: `${hoverBlockCoord.current.width}px`,
							height: `${hoverBlockCoord.current.height}px`
						}}
					>dfdsfsdfsdfsd</div>
				) : null} */}
			</section>

			<Pagination>
				<ul className={style.paginationList} onClick={selectPage}>
					<PaginationElement
						onClickFunc={() => {
							setCurrentPage(prevState => Math.max(prevState - 1, 1))
						}}
					>
						<img src='/icons/chevron-left.svg' alt='prevPage' />
					</PaginationElement>
					{Array.from(
						{ length: startPage + VISIBLE_ELEMENTS - startPage },
						(_, i) => (
							<PaginationElement
								key={'Page' + '#' + i}
								color={
									currentPage === startPage + i
										? { background: 'black', color: '#fff' }
										: { background: '#fff', color: 'black' }
								}
							>
								<span>{startPage + i}</span>
							</PaginationElement>
						)
					)}
					{currentPage !== endPage ? (
						<PaginationElement>
							<span>...</span>
						</PaginationElement>
					) : null}
					{currentPage !== endPage ? (
						<PaginationElement>
							<span>{endPage}</span>
						</PaginationElement>
					) : null}
					<PaginationElement
						onClickFunc={() => {
							setCurrentPage(prevState =>
								Math.min(prevState + 1, dataList.pagination.last_visible_page)
							)
						}}
					>
						<img src='/icons/chevron-right.svg' alt='nextPage' />
					</PaginationElement>
				</ul>
			</Pagination>
		</main>
	)
}

export default AnimeList
