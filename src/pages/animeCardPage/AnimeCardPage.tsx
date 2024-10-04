import { Navigate, useParams } from 'react-router-dom'
import { IAnimeData } from '../../types/types'
import React from 'react'
import axios from 'axios'

type TQueryParam = {
	animeCardId: string
}

interface IData {
	data: IAnimeData
}

const AnimeCardPage = () => {
	const { animeCardId } = useParams<TQueryParam>()
	const [invalidId, setInvalidId] = React.useState<boolean>(false)
	
	React.useEffect(()=>{
		if (animeCardId && isNaN(+animeCardId)) {
			setInvalidId(true)
			return
		}

		if(animeCardId) getAnimeById(+animeCardId)
	}, [])
	
	async function getAnimeById(id: number) {
		const data: IData = (
			await axios.get<IData>(
				`https://api.jikan.moe/v4/anime/${id}`
			)
		).data

		console.log(data.data)
	}

	if (invalidId) {
		return <Navigate to={'/404'} />
	}



	return <h1>Hello!</h1>
}

export default AnimeCardPage
