import React, { Dispatch, FC, SetStateAction } from 'react'
import { Updater } from 'use-immer'
import FilterElements from '../filterElements/FilterElements'
import style from './filterData.module.css'

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

enum ETypes {
	TV = 'tv',
	MOVIE = 'movie',
	OVA = 'ova',
	SPECIAL = 'special',
	ONA = 'ona',
	MUSIC = 'music',
	CM = 'cm',
	PV = 'pv',
	TV_SPECIAL = 'tv_special',
}

enum ERating {
	G = 'g',
	PG = 'pg',
	PG_13 = 'pg13',
	R_17 = 'r17',
	R = 'r',
	RX = 'rx',
}

enum EStatus {
	airing = 'airing',
	complete = 'complete',
	upcoming = 'upcoming',
}

interface IFilterData {
	updateFilter: Updater<TFilter>
	isMenu: boolean
	setIsMenu: React.Dispatch<React.SetStateAction<boolean>>
}

const FilterDataMobile: FC<IFilterData> = React.memo(({ updateFilter, isMenu, setIsMenu}) => {
	const genres: { id: number; name: string }[] = [
		{ id: 1, name: 'Action' },
		{ id: 4, name: 'Comedy' },
		{ id: 5, name: 'Avant Garde' },
		{ id: 8, name: 'Drama' },
		{ id: 24, name: 'Sci-Fi' },
		{ id: 41, name: 'Suspense' },
		{ id: 46, name: 'Award Winning' },
		{ id: 22, name: 'Romance' },
	]

	const genres_excluded: { id: number; name: string }[] = [
		{ id: 1, name: 'Action' },
		{ id: 4, name: 'Comedy' },
		{ id: 5, name: 'Avant Garde' },
		{ id: 8, name: 'Drama' },
	]

	const producers: { id: number; name: string }[] = [
		{ id: 16, name: 'TV Tokyo' },
		{ id: 53, name: 'Dentsu' },
		{ id: 139, name: 'Nihon Ad Systems' },
		{ id: 517, name: 'Asmik Ace' },
		{ id: 717, name: 'TV Tokyo Music' },
		{ id: 1365, name: 'Shueisha' },
	]

	const types: ETypes[] = [
		ETypes.TV,
		ETypes.MOVIE,
		ETypes.OVA,
		ETypes.SPECIAL,
		ETypes.ONA,
		ETypes.MUSIC,
		ETypes.CM,
		ETypes.PV,
		ETypes.TV_SPECIAL,
	]

	const rating: ERating[] = [
		ERating.G,
		ERating.PG,
		ERating.PG_13,
		ERating.R_17,
		ERating.R,
		ERating.RX,
	]

	const status: EStatus[] = [EStatus.airing, EStatus.complete, EStatus.upcoming]

	const [isGenre, setIsGenre] = React.useState<boolean>(false)
	const [isGenreExcluded, setIsGenreExcluded] = React.useState<boolean>(false)
	const [isType, setIsType] = React.useState<boolean>(false)
	const [isRating, setIsRating] = React.useState<boolean>(false)
	const [isStatus, setIsStatus] = React.useState<boolean>(false)
	const [isProducer, setIsProducer] = React.useState<boolean>(false)
	const [isDate, setIsDate] = React.useState<boolean>(false)

	const radioGenres = React.useRef<string[]>([])
	const radioGenresExcluded = React.useRef<string[]>([])
	const producer = React.useRef<string[]>([])

	function handleGenreAdd(id: number) {
		const ID = id.toString()

		if (!radioGenres.current.includes(ID)) radioGenres.current.push(ID)
		else {
			radioGenres.current = radioGenres.current.filter(item => item !== ID)
		}

		const genresStr = radioGenres.current.join(',')
		updateFilter(draft => {
			draft.genres = genresStr
		})
	}

	function handleGenreExcludeAdd(id: number) {
		const ID = id.toString()

		if (!radioGenresExcluded.current.includes(ID))
			radioGenresExcluded.current.push(ID)
		else {
			radioGenresExcluded.current = radioGenresExcluded.current.filter(
				item => item !== ID
			)
		}

		const genresStr = radioGenresExcluded.current.join(',')
		updateFilter(draft => {
			draft.genres_exclude = genresStr
		})
	}

	function handleTypeChange(typeAnime: string) {
		updateFilter(draft => {
			draft.type = typeAnime
		})
	}

	function handleRatingChange(rating: string) {
		updateFilter(draft => {
			draft.rating = rating
		})
	}

	function handleStatusChange(status: string) {
		updateFilter(draft => {
			draft.status = status
		})
	}

	function handleProducerChange(id: number) {
		const ID = id.toString()

		if (!producer.current.includes(ID)) producer.current.push(ID)
		else {
			producer.current = producer.current.filter(item => item !== ID)
		}

		const producerStr = producer.current.join(',')
		updateFilter(draft => {
			draft.producers = producerStr
		})
	}

	function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
		updateFilter(draft => {
			draft.start_date = e.currentTarget.value
		})
	}

	function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
		updateFilter(draft => {
			draft.end_date = e.currentTarget.value
		})
	}

	return (
		<>
			{isMenu ? (
				<nav className={style.nav_filter}>
					<div className={style.filter}>
						<FilterElements>
							<h4
								className={style.title}
								onClick={() => setIsGenre(prevState => !prevState)}
							>
								Жанры:{' '}
							</h4>
							<div
								style={isGenre ? { display: 'block' } : { display: 'none' }}
								className={style.genres}
							>
								{genres.map((item, index) => (
									<div
										key={item.id + ' ' + item.name}
										style={
											{
												'--i': index.toString(),
											} as React.CSSProperties
										}
									>
										<input
											type='checkbox'
											id={item.name}
											value={item.id}
											onChange={() => handleGenreAdd(item.id)}
											name='genre'
										/>
										<label htmlFor={item.name}>{item.name}</label>
									</div>
								))}
							</div>
						</FilterElements>

						<FilterElements>
							<h4
								className={style.title}
								onClick={() => setIsGenreExcluded(prevState => !prevState)}
							>
								Жанры исключение:{' '}
							</h4>
							<div
								style={
									isGenreExcluded ? { display: 'block' } : { display: 'none' }
								}
								className={style.genres}
							>
								{genres_excluded.map((item, index) => (
									<div
										key={item.id + ' ' + item.name}
										style={
											{
												'--i': index.toString(),
											} as React.CSSProperties
										}
									>
										<input
											type='checkbox'
											id={item.name}
											value={item.id}
											onChange={() => handleGenreExcludeAdd(item.id)}
											name='genre'
										/>
										<label htmlFor={item.name}>{item.name}</label>
									</div>
								))}
							</div>
						</FilterElements>

						<FilterElements>
							<h4
								className={style.title}
								onClick={() => setIsType(prevState => !prevState)}
							>
								Типы аниме:{' '}
							</h4>
							<div
								style={isType ? { display: 'block' } : { display: 'none' }}
								className={style.genres}
							>
								{types.map((item, index) => (
									<div
										key={index + ' / ' + item}
										style={
											{
												'--i': index.toString(),
											} as React.CSSProperties
										}
									>
										<input
											type='radio'
											id={item}
											onChange={() => handleTypeChange(item)}
											name='typeAnime'
										/>
										<label htmlFor={item}>{item}</label>
									</div>
								))}
							</div>
						</FilterElements>

						<FilterElements>
							<h4
								className={style.title}
								onClick={() => setIsRating(prevState => !prevState)}
							>
								Рейтинг:{' '}
							</h4>
							<div
								style={isRating ? { display: 'block' } : { display: 'none' }}
								className={style.genres}
							>
								{rating.map((item, index) => (
									<div
										key={index + ' / ' + item}
										style={
											{
												'--i': index.toString(),
											} as React.CSSProperties
										}
									>
										<input
											type='radio'
											id={item}
											onChange={() => handleRatingChange(item)}
											name='typeAnime'
										/>
										<label htmlFor={item}>{item}</label>
									</div>
								))}
							</div>
						</FilterElements>

						<FilterElements>
							<h4
								className={style.title}
								onClick={() => setIsStatus(prevState => !prevState)}
							>
								Статус:{' '}
							</h4>
							<div
								style={isStatus ? { display: 'block' } : { display: 'none' }}
								className={style.genres}
							>
								{status.map((item, index) => (
									<div
										key={index + ' / ' + item}
										style={
											{
												'--i': index.toString(),
											} as React.CSSProperties
										}
									>
										<input
											type='radio'
											id={item}
											onChange={() => handleStatusChange(item)}
											name='typeAnime'
										/>
										<label htmlFor={item}>{item}</label>
									</div>
								))}
							</div>
						</FilterElements>

						<FilterElements>
							<h4
								className={style.title}
								onClick={() => setIsProducer(prevState => !prevState)}
							>
								Продюсеры:{' '}
							</h4>
							<div
								style={isProducer ? { display: 'block' } : { display: 'none' }}
								className={style.genres}
							>
								{producers.map((item, index) => (
									<div
										key={item.id + ' ' + item.name}
										style={
											{
												'--i': index.toString(),
											} as React.CSSProperties
										}
									>
										<input
											type='checkbox'
											id={item.name}
											value={item.id}
											onChange={() => handleProducerChange(item.id)}
											name='producer'
										/>
										<label htmlFor={item.name}>{item.name}</label>
									</div>
								))}
							</div>
						</FilterElements>

						<FilterElements>
							<h4
								className={style.title}
								onClick={() => setIsDate(prevState => !prevState)}
							>
								Дата:{' '}
							</h4>
							<div
								style={isDate ? { display: 'block' } : { display: 'none' }}
								className={style.genres}
							>
								<div>
									<label htmlFor='start_date'>Start date: </label>
									<input
										type='date'
										onChange={handleStartDateChange}
										name='start_date'
									/>
								</div>

								<div>
									<label htmlFor='end_date'>End date: </label>
									<input
										type='date'
										onChange={handleEndDateChange}
										name='end_date'
									/>
								</div>
							</div>
						</FilterElements>
					</div>

					<button
						className={style.cancel_btn}
						onClick={() => setIsMenu(false)}
					>
						Закрыть меню
					</button>
				</nav>
			) : null}
		</>
	)
})

export default FilterDataMobile
