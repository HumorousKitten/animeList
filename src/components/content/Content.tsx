import AnimeList from '../AnimeList/AnimeList'
import FilterData from '../FilterData/FilterData'
import style from './content.module.css'
import { useImmer } from 'use-immer'



type TFilter = {
	genres: string
	type: string,
	rating: string,
	status: string,
	start_date: string,
	end_date: string,
	genres_exclude: string,
	producers: string
}

const Content = () => {
	const [filter, updateFilter] = useImmer<TFilter>({
		genres: '',
		type: '',
		rating: '',
		status: '',
		start_date: '',
		end_date: '',
		genres_exclude: '',
		producers: ''
	})

	return (
		<section className={`${style.container} ${style.content}`}>
			<AnimeList filter={filter} updateFilter={updateFilter}/>
			<FilterData updateFilter={updateFilter}/>
		</section>
	)
}

export default Content
