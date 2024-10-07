import { FC, ReactNode } from 'react'

interface IHeaderProps {
	children: ReactNode
}

const Header: FC<IHeaderProps> = ({children}) => {
	return (
		<header>{children}</header>
	);
}
 
export default Header;