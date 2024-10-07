type TAired = {
	from: string
	to: string
	string: string
	prop: {
		from: {day:number, month: number, year: number}
		to: {day:number, month: number, year: number}
	}
}

type TBroadcast = {
	day: string
	time: string
	timezone: string
	string: string
}


type TDemographics = {
	mal_id?: number
	type?: string
	name?: string
	url?: string
}

type TGenres = TDemographics
type TLicensors = TDemographics
type TProducers = TDemographics
type TStudios = TDemographics
type TThemes = TDemographics

type TImageExtension = {
	image_url: string | null;
	large_image_url: string | null;
	small_image_url: string | null;
}

type TImages = {
	jpg: TImageExtension
	webp: TImageExtension
}

type TTitles = {
	type: string
	title: string
}

export interface IAnimeData {
  aired: TAired
	airing: boolean
	approved: boolean
	background: string
  broadcast: TBroadcast
  demographics: TDemographics[]
	duration: string
	episodes: number
	explicit_genres: [] //проверить в других местах
  genres: TGenres
	favorites: number
  images: TImages
  licensors: TLicensors
	mal_id: number
  members: number
	popularity: number
  producers: TProducers
  rank: number
  rating: string
  score: number
  scored_by: number
	season: string
	source: string
	status: string
  studios: TStudios
  synopsis: string
  themes: TThemes
  title: string
  title_english: string | null
  title_japanese: string | null
  title_synonyms: string[] | []
	titles: TTitles[]
  trailer: {
    embed_url: string | null
    images: TImageExtension & {
      maximum_image_url: string | null
      medium_image_url: string | null
    };
    url: string | null
    youtube_id: string | null
  };
  type: string
  url: string
  year: number
}
