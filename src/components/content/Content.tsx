import AnimeList from '../AnimeList/AnimeList'
import FilterData from '../FilterData/FilterData'
import style from './content.module.css'

const Content = () => {
	return (
		<section className={`${style.container} ${style.content}`}>
			<AnimeList />
			<FilterData />
		</section>
	)
}

export default Content
