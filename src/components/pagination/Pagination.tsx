import { FC, ReactElement } from 'react';
import style from './pagination.module.css'


interface IPagiantionProps{
	children: ReactElement
}

export const Pagination: FC<IPagiantionProps> = ({children}) => {
	return (
		<nav className={style.nav}>
			{children}
		</nav>
	);
}
 