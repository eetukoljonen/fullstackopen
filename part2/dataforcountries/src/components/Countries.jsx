
const Country = ({country}) => (
	<div>
		<h1>{country.name.common}</h1>
		<p>capital: {country.capital}</p>
		<p>area: {country.area}</p>
		<h3>languages:</h3>
		<ul>
			{Object.values(country.languages).map((language) => (
				<li key={language}>{language}</li>
			))}
		</ul>
		<div>
			<img src={country.flags.png}/>
		</div>
	</div>
)

const Countries = ({countries, handleShowClick}) => {
	if (countries.length > 10)
		return (<p>Too many matches, specify another filter</p>)
	else if (countries.length === 1) {
		const country = countries[0]
		return (
			<Country country={country} />
		)
	}
	return (
		<>
			{countries.map(country => 
				<p
					key={country.name.common}>{country.name.common}
					<button onClick={() => handleShowClick(country)}>show</button>
				</p>
			)}
		</>
	)
}

export default Countries