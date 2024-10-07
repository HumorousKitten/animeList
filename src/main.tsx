import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import AnimeCardPage from './pages/animeCardPage/AnimeCardPage.tsx'
import FavouritePage from './pages/favouritePage/FavouritePage.tsx'
import './index.css'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
    errorElement: <div>Error</div>
	},

	{
	    path: '/animeList/animeCardId/:animeCardId',
	    element: <AnimeCardPage />,
      errorElement: <div>Error</div>
	},

    {
	    path: '/404',
	    element: <div>Error</div>,
	},

	{
		path: '/favouritePage',
		element: <FavouritePage />,
    errorElement: <div>Error</div>
	},
])

createRoot(document.getElementById('root')!).render(
	<RouterProvider router={router} />
)
