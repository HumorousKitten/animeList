import { FC, ReactElement } from 'react'
import style from './paginationElement.module.css'


interface IPaginationElementProps {
	onClickFunc?: () => void
	children: ReactElement
	color?: {
		background: 'black' | '#fff'
		color: 'black' | '#fff'
		
	}
}

const PaginationElement: FC<IPaginationElementProps> = ({onClickFunc, children, color}) => {
	return (
		<li className={style.paginationElem} onClick={onClickFunc} style={color}>{children}</li>
	);
}
 
export default PaginationElement;