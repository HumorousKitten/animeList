import { Navigate, useParams } from 'react-router-dom'
import React, { FC } from 'react'
import Content from '../../components/contentCardPage/Content'

type TQueryParam = {
	animeCardId: string
}


const AnimeCardPage: FC = () => {
	const { animeCardId } = useParams<TQueryParam>()
	const [invalidId, setInvalidId] = React.useState<boolean>(false)
	
	React.useEffect(()=>{
		if (animeCardId && isNaN(+animeCardId)) {
			setInvalidId(true)
			return
		}

	}, [])
	
	if (invalidId) {
		return <Navigate to={'/404'} />
	}



	return (
		<Content animeCardId = {animeCardId}/>
	)
}

export default AnimeCardPage
