import React, { FC } from 'react'
import style from './content.module.css'
import { IAnimeData } from '../../types/types'
import axios from 'axios'

interface IContentProps {
	animeCardId: string | undefined
}

interface IData {
	data: IAnimeData
}

type TListAnime = Pick<
	IAnimeData,
	'mal_id' | 'titles' | 'score' | 'rating' | 'images' | 'scored_by' | 'trailer' | 'aired' | 'favorites' | 'producers' | 'genres' | 'themes' | 'background'
>

// картинки, трейлер если есть, оригинальный заголовок, переведенный заголовок, даты, рейтинг, оценка, кол-во оценок и favotrites, продюсер, жанры, темы, связанное


const Content: FC<IContentProps> = ({animeCardId}) => {
	const [contentData, setContentData] = React.useState<TListAnime | object >({})


	React.useEffect(()=>{
		if(animeCardId) getAnimeById(+animeCardId)
	}, [])
	
	async function getAnimeById(id: number) {
		try {
			const data: IData = (
				await axios.get<IData>(
					`https://api.jikan.moe/v4/anime/${id}`
				)
			).data

			
		} catch (error: unknown) {
			console.log('message: ', error)
		}
	}

	return (
		<main>
			<section>
		
			</section>
		</main>		
	);
}
 
export default Content;