import { FC, ReactNode } from 'react'

interface IFilterElementsProps {
	children: ReactNode
}

const FilterElements: FC<IFilterElementsProps> = ({ children }) => {
	return <div>{ children }</div>
}

export default FilterElements
