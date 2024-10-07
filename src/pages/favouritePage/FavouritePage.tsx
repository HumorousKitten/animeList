import React from 'react'
import { useImmer } from 'use-immer'
import { Pagination } from '../../components/pagination/Pagination'
import PaginationElement from '../../components/pagination/paginationElement/PaginationElement'
import Select from '../../components/select/Select'
import { useFavouritesStore } from '../../store/useFavouritesPage'
import { useNavigate } from 'react-router-dom'
import style from './favouritePage.module.css'

type TSelectedOption = {
	orderBy: string
	sortBy: string
}

const FavouritePage = () => {
	const {
		favouriteItems,
		removeFavourite,
		sortFavoriteDate,
		sortFavoriteRating,
	} = useFavouritesStore()
	const [favourites, setFavourites] = React.useState(favouriteItems)

	const [selectedOption, updateSelectedOption] = useImmer<TSelectedOption>({
		orderBy: '',
		sortBy: '',
	})
	const [currentPage, setCurrentPage] = React.useState<number>(1)
	const [countItems, setCountItems] = React.useState<number>(12)
	const navigate = useNavigate()
	React.useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth

			if (width <= 576 && countItems !== 2) {
				setCountItems(2)
			} else if (width > 576 && width < 970 && countItems !== 6) {
				setCountItems(6)
			} else if (width >= 970 && countItems !== 12) {
				setCountItems(12)
			}
		}

		handleResize()

		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	}, [countItems])

	console.log(favourites)

	const VISIBLE_ELEMENTS: number = 4
	let startPage = 1
	let endPage = Math.ceil(favouriteItems.length / countItems)

	if (endPage <= VISIBLE_ELEMENTS) {
		startPage = 1
		endPage = Math.ceil(favouriteItems.length / countItems)
	} else if (currentPage <= VISIBLE_ELEMENTS) {
		startPage = 1
		endPage = VISIBLE_ELEMENTS
	} else if (
		currentPage >
		Math.ceil(favouriteItems.length / countItems) -
			Math.floor(VISIBLE_ELEMENTS / countItems)
	) {
		startPage =
			Math.ceil(favouriteItems.length / countItems) - VISIBLE_ELEMENTS + 1
		endPage = Math.ceil(favouriteItems.length / countItems)
	} else {
		startPage = currentPage - Math.floor(VISIBLE_ELEMENTS / countItems)
		endPage = currentPage + Math.floor(VISIBLE_ELEMENTS / countItems)
	}

	const startPosition = (currentPage - 1) * countItems
	const endPosition = (currentPage - 1) * countItems + countItems

	function selectPage(e: React.MouseEvent<HTMLUListElement>) {
		const elem = e.target as HTMLElement
		if (!elem.textContent || elem.textContent === '...') return
		setCurrentPage(+elem.textContent)
	}

	React.useEffect(() => {
		const { orderBy, sortBy } = selectedOption
		console.log(orderBy)
		console.log(sortBy)
		if (!orderBy || !sortBy) return
		if (orderBy === 'date') {
			setFavourites(sortFavoriteDate(sortBy as 'asc' | 'desc', favouriteItems))
		}
		if (orderBy === 'rating') {
			setFavourites(
				sortFavoriteRating(sortBy as 'asc' | 'desc', favouriteItems)
			)
		}
	}, [selectedOption.orderBy, selectedOption.sortBy])

	return (
		<>
			<header>
				<div className={style.container}>
					<h2 style={{color: '#fff', fontSize: '32px', cursor:'pointer'}} onClick={() => navigate('/')}>Главная</h2>
				</div>
			</header>
			<main>
				<section className={`${style.container} ${style.sortSection}`}>
					<Select
						name={'order-by'}
						setSelectedOption={updateSelectedOption}
						selectedOption={selectedOption}
					>
						<option value='' disabled>
							Выберите метод сортировки
						</option>
						<option value='rating'>Рейтингу</option>
						<option value='date'>Дате</option>
					</Select>

					<Select
						name={'sort-by'}
						setSelectedOption={updateSelectedOption}
						selectedOption={selectedOption}
					>
						<option value='' disabled>
							Направление
						</option>
						<option value='asc'>Возрастание</option>
						<option value='desc'>Убывание</option>
					</Select>
				</section>
				<section
					className={`${style.container} ${style.favouriteAnimeSection}`}
				>
					{favourites
						? favourites
								.slice(startPosition, endPosition)
								.map((item, index) => (
									<div
										key={item.data.mal_id + ' / ' + index}
										className={style.favouriteItem}
									>
										<iframe src={`${item.data.trailer?.embed_url}`}></iframe>
										<div className={style.favouriteItemInfo}>
											<p>
												{item.data.titles?.find(item => item.type === 'Default')
													?.title ?? ''}
											</p>
											<p>Own score: {item.rating}</p>
											<button
												className={style.deleteBtn}
												onClick={() =>
													removeFavourite(item.data.mal_id as number)
												}
											>
												delete
											</button>
										</div>
									</div>
								))
						: null}
				</section>

				{!(endPage === 0 || endPage === 1) ? (
					<Pagination>
						<ul
							className={`${style.paginationList} ${style.container}`}
							onClick={selectPage}
						>
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

							<PaginationElement
								onClickFunc={() => {
									setCurrentPage(prevState =>
										Math.min(
											prevState + 1,
											Math.ceil(favouriteItems.length / 12)
										)
									)
								}}
							>
								<img src='/icons/chevron-right.svg' alt='nextPage' />
							</PaginationElement>
						</ul>
					</Pagination>
				) : null}
			</main>
		</>
	)
}

export default FavouritePage
