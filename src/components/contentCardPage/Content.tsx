import axios from 'axios'
import React, { FC } from 'react'
import { ReactSVG } from 'react-svg'
import NotSelectedStar from '../../assets/notSelectedStar.svg'
import { useFavouritesStore } from '../../store/useFavouritesPage'
import { IAnimeData } from '../../types/types'
import { useNavigate } from 'react-router-dom'
import style from './content.module.css'
import Header from '../header/Header'

interface IContentProps {
	animeCardId: string | undefined
}

interface IData {
	data: IAnimeData
}

type TListAnime = Partial<
	Pick<
		IAnimeData,
		| 'mal_id'
		| 'titles'
		| 'score'
		| 'rating'
		| 'images'
		| 'scored_by'
		| 'trailer'
		| 'aired'
		| 'favorites'
		| 'producers'
		| 'genres'
		| 'themes'
		| 'background'
	>
>

// картинки, трейлер если есть, оригинальный заголовок, переведенный заголовок, даты, рейтинг, оценка, кол-во оценок и favotrites, продюсер, жанры, темы, связанное

const Content: FC<IContentProps> = ({ animeCardId }) => {
	const { isFavourite, favouriteItems, addFavourite, removeFavourite } =
		useFavouritesStore()
	const navigate = useNavigate()
	const [contentData, setContentData] = React.useState<TListAnime | null>(null)
	const [selectedStars, setSelectedStars] = React.useState<number>(0)
	const necessaryKeys: readonly string[] = [
		'mal_id',
		'titles',
		'score',
		'rating',
		'images',
		'scored_by',
		'trailer',
		'aired',
		'favorites',
		'producers',
		'genres',
		'themes',
		'background',
	]

	React.useEffect(() => {
		if (animeCardId) getAnimeById(+animeCardId)
	}, [])

	async function getAnimeById(id: number) {
		try {
			const data: IData = (
				await axios.get<IData>(`https://api.jikan.moe/v4/anime/${id}`)
			).data

			const necessaryData = Object.fromEntries(
				Object.entries(data.data).filter(item =>
					necessaryKeys.includes(item.at(0)) ? item : null
				)
			)
			setContentData(necessaryData)
		} catch (error: unknown) {
			console.log('message: ', error)
		}
	}

	function handleStarClick(index: number) {
		setSelectedStars(index + 1)
	}

	function addInFavourites() {
		const data = {
			mal_id: contentData?.mal_id,
			titles: contentData?.titles,
			trailer: contentData?.trailer,
		}

		addFavourite({
			data: data,
			rating: selectedStars === 0 ? selectedStars + 1 : selectedStars,
			date: Date.now(),
		})
	}

	function removeFromFavourites() {
		removeFavourite(contentData?.mal_id as number)
	}

	return (
		<>
			<Header>
				<div className={style.container}>
					<h2
						style={{ color: '#fff', fontSize: '32px', cursor: 'pointer' }}
						onClick={() => navigate('/')}
					>
						Главная
					</h2>
				</div>
			</Header>

			<main>
				{contentData ? (
					<>
						<section className={`${style.container} ${style.animeInfo}`}>
							<div className={style.leftInfoBlock}>
								<div className={style.imageBlock}>
									<img
										src={
											contentData?.images?.webp.large_image_url as
												| string
												| undefined
										}
										alt='animeImage'
									/>
								</div>
								<div className={style.addFavourites}>
									{!isFavourite(contentData.mal_id as number) ? (
										<>
											<div className={style.ownScore}>
												{Array.from({ length: 10 }, (_, index) => (
													<ReactSVG
														src={NotSelectedStar}
														style={{
															fill: index < selectedStars ? 'gold' : 'white',
															width: '30px',
															cursor: 'pointer',
														}}
														id={index.toString()}
														key={index}
														onClick={() => handleStarClick(index)}
													/>
												))}
											</div>
											<button
												className={style.addFavouritesBtn}
												onClick={() => addInFavourites()}
											>
												Добавить в избранное
											</button>
										</>
									) : (
										<button
											className={style.removeFavouritesBtn}
											onClick={() => removeFromFavourites()}
										>
											удалить из избранного
										</button>
									)}
								</div>
							</div>
							<div className={style.rightInfoBlock}>
								<div className={style.scores}>
									<p>
										<img
											src='/icons/starOrange.svg'
											alt='starScore'
											width={24}
										/>
										<span className={style.increaseScore}>
											{contentData.score}
										</span>
										/10
									</p>
									<p className={style.favorites}>{contentData.favorites}</p>
								</div>

								<h1 className={style.defaultTitle}>
									{contentData.titles?.find(item => item.type === 'Default')
										?.title ?? ''}
								</h1>
								<h5 className={style.originalTitle}>
									{contentData.titles?.find(item => item.type === 'Japanese')
										?.title ?? ''}
								</h5>
								<div className={style.allAboutAnime}>
									<p>Date: {contentData.aired?.string}</p>
									<p>
										Genre: {contentData.genres?.map(item => item.name + ', ')}
									</p>
									<p>
										Themes: {contentData.themes?.map(item => item.name + ', ')}
									</p>
									<p>
										Producer:{' '}
										{contentData.producers?.map(item => item.name + ', ')}
									</p>
									<p>Rating: {contentData.rating}</p>
									<p>
										Background: <br /> {contentData.background}
									</p>
								</div>
							</div>
						</section>

						{contentData.trailer?.embed_url ? (
							<section className={`${style.container} ${style.trailerSection}`}>
								<h3>Трейлер: </h3>
								<iframe src={`${contentData.trailer?.embed_url}`}></iframe>
							</section>
						) : null}
					</>
				) : null}
			</main>
		</>
	)
}

export default Content
