import React from 'react'
import AnimeList from '../AnimeList/AnimeList'
import FilterData from '../FilterData/FilterData'
import style from './content.module.css'
import axios from 'axios'

const Content = () => {
	const [dataList, setDataList] = React.useState({})
	console.log(dataList)
	React.useEffect(() => {
		async function getAnimeData() {
			const data = (await axios.get('https://api.jikan.moe/v4/anime?page=2&limit=16')).data
			setDataList(data)
		}
		getAnimeData()
	}, [])


	return (
		<main className={style.main}>
			<AnimeList />
			<FilterData />
		</main>
	)
}

export default Content
