import { FC } from 'react'
import { IAnimeData } from '../../../types/types'
import { Link } from 'react-router-dom'
import style from './animeCard.module.css'


type TDataCard = Pick<
	IAnimeData,
	'mal_id' | 'titles' | 'score' | 'rating' | 'images' | 'scored_by'
>

interface IAnimeCardProps {
	data: TDataCard
}

//'/animeList/animeCard?id=:animeCardId'
const AnimeCard: FC<IAnimeCardProps> = ({data}) => {
	return (
		<div className={style.animeCard}>
			<Link to={`/animeList/animeCardId/${data.mal_id}`}>
				<div className={style.cardImage}>
					<div 
						style = {
							{
								backgroundImage: `url(${data.images.webp.large_image_url})` 
							}
						}
						className={style.imageBlock}
					>
					</div>
					<div className={style.score}>
						<img src="/icons/star.svg" alt="scoreIcon" width={16}/>
						<span>{data.score ? data.score : 0}</span>
					</div>
				</div>
				<div className={style.animeTitles}>
					<p className={style.originalTitle}>{data.titles.find(item => item.type === 'Japanese')?.title ?? ''}</p>
					<p className={style.translateTitle}>{data.titles.find(item => item.type === 'Default')?.title ?? ''}</p>
				</div>
			</Link>
		</div>
	);
}
 
export default AnimeCard;