import { useState, useEffect } from 'react'
import countryService from './services/countries'
import Filter from './components/Filter'
import Countries from './components/Countries'

function App() {
	const [filter, setFilter] = useState('')
	const [countries, setCountries] = useState([])

	useEffect(() => {
		countryService
			.getAll()
			.then(initialCountries => {
				setCountries(initialCountries)
			})
	}, [])

	const handleFilterChange = (event) => {
		setFilter(event.target.value)
	}

	const filtered = filter
		? countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
		: countries
	return (
		<div>
			<Filter filter={filter} handleFilterChange={handleFilterChange} />
			<Countries countries={filtered}/>
		</div>
	)
}

export default App
