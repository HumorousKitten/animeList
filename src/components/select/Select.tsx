import { FC, ReactNode } from 'react'
import React from 'react'
import { Updater } from 'use-immer'


type TSelectedOption = {
	orderBy: string
	sortBy: string
}


interface ISelectProps {
	children: ReactNode
	name: string
	selectedOption: TSelectedOption
	setSelectedOption: Updater<TSelectedOption>
}

const Select:FC<ISelectProps> = ({children, name, selectedOption, setSelectedOption}) => {

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption((draft) => {
			if(name === 'order-by'){
				draft.orderBy = e.target.value
				return
			}
			draft.sortBy = e.target.value
		});
  };

	return (
		<select name={name} onChange={handleSelectChange} value={name === 'order-by' ? selectedOption.orderBy : selectedOption.sortBy}>
			{children}
		</select>
	);
}


export default Select;