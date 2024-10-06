import axios from 'axios'
import React, { FC } from 'react'
import { IAnimeData } from '../../types/types'
import style from './content.module.css'

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
	const [contentData, setContentData] = React.useState<TListAnime | null>(null)
	console.log(contentData)
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
			console.log(data)
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

	return (
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
							<div className={style.addFavourites}></div>
						</div>
						<div className={style.rightInfoBlock}>
							<div className={style.scores}>
								<p>
									<img src='/icons/starOrange.svg' alt='starScore' width={24} />
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
	)
}

export default Content
