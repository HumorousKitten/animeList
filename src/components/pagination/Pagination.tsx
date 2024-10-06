import { FC, ReactElement } from 'react';
import style from './pagination.module.css'


interface IPaginationProps{
	children: ReactElement
}

export const Pagination: FC<IPaginationProps> = ({children}) => {
	return (
		<nav className={style.nav}>
			{children}
		</nav>
	);
}
 