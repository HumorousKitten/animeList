import axios from 'axios'
import React, { FC, useEffect } from 'react'
import { Updater, useImmer } from 'use-immer'
import { IAnimeData } from '../../types/types'
import { Pagination } from '../pagination/Pagination'
import PaginationElement from '../pagination/paginationElement/PaginationElement'
import Select from '../select/Select'
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

interface Sort {
	name: string
	text: string
}

type TSelectedOption = {
	orderBy: string
	sortBy: string
}

type TFilter = {
	genres: string
	type: string
	rating: string
	status: string
	start_date: string
	end_date: string
	genres_exclude: string
	producers: string
}

interface IAnimeListProps {
	filter: TFilter
	updateFilter: Updater<TFilter>
}

const AnimeList: FC<IAnimeListProps> = ({ filter }) => {
	const [dataList, setDataList] = React.useState<IAnimeDataOnPage>({
		data: [],
		pagination: {
			last_visible_page: 0,
			has_next_page: false,
			current_page: 0,
		},
	})
	const [currentPage, setCurrentPage] = React.useState<number>(1)
	const [selectedOption, updateSelectedOption] = useImmer<TSelectedOption>({
		orderBy: '',
		sortBy: '',
	})
	const [limit, setLimit] = React.useState<number>(16)

	console.log(window.innerWidth)
	if(window.innerWidth <= 576 && limit !== 2)
		setLimit(2)
	else if(window.innerWidth > 576 && window.innerWidth < 970 && limit !== 8)
		setLimit(8)
	else if(window.innerWidth > 970 && limit !== 16)
		setLimit(16)

	const VISIBLE_ELEMENTS: number = 3
	let startPage = 1
	const endPage = dataList.pagination.last_visible_page

	const orderList: Sort[] = [
		{ name: 'popularity', text: 'популярности' },
		{ name: 'score', text: 'оценке' },
		{ name: 'scored_by', text: 'количеству оценок' },
		{ name: 'favorites', text: 'количеству favorites' },
		{ name: 'episodes', text: 'количеству эпизодов' },
		{ name: 'start_date', text: 'начальной дате' },
		{ name: 'end_date', text: 'конечной дате' },
	]

	if (currentPage > startPage + 2)
		startPage = currentPage - VISIBLE_ELEMENTS + 1
	const params = {
		page: currentPage,
		limit: limit,
		order_by: selectedOption.orderBy,
		sort: selectedOption.sortBy,
		genres: filter.genres,
		genres_exclude: filter.genres_exclude,
		type: filter.type,
		rating: filter.rating,
		status: filter.status,
		producers: filter.producers,
		start_date: filter.start_date,
		end_date: filter.end_date,
	}

	React.useEffect(() => {
		async function getAnimeData() {
			try {
				const data: IData = (
					await axios.get<IData>(`https://api.jikan.moe/v4/anime`, { params })
				).data
				console.log(data)
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
	}, [currentPage, selectedOption, filter, limit])

	function selectPage(e: React.MouseEvent<HTMLUListElement>) {
		const elem = e.target as HTMLElement
		if (!elem.textContent || elem.textContent === '...') return
		setCurrentPage(+elem.textContent)
	}

	return (
		<main className={style.main}>
			<section className={style.listManagementSection}>
				<button className={style.filter_btn} >
					Filter
				</button>

				<Select
					name={'order-by'}
					setSelectedOption={updateSelectedOption}
					selectedOption={selectedOption}
				>
					<option value='' disabled>
						Выберите метод сортировки
					</option>
					{orderList.map(item => (
						<option value={item.name} key={item.name + ' / ' + item.text}>
							{item.text}
						</option>
					))}
				</Select>

				<Select
					name={'sort-by'}
					setSelectedOption={updateSelectedOption}
					selectedOption={selectedOption}
				>
					<option value='asc'>Возрастание</option>
					<option value='desc'>Убывание</option>
				</Select>
			</section>
			<section className={style.animeList}>
				{dataList.data.length !== 0
					? dataList.data.map((item, index) => (
							<AnimeCard
								key={
									item.mal_id +
									' / ' +
									index +
									' / ' +
									item.images.webp.image_url
								}
								data={item}
							/>
					  ))
					: null}
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
						{
							length:
								endPage > VISIBLE_ELEMENTS
									? startPage + VISIBLE_ELEMENTS - startPage
									: endPage,
						},
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
