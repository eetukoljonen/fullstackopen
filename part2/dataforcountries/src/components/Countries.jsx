import React, { useState, useEffect } from 'react';
import weatherService from '../services/weather'

const Country = ({country, weather}) => {
	if (!weather)
		return null
	const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
	return(
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
			<h2>Weather in {country.capital}</h2>
			<p>temperature: {weather.main.temp}</p>
			<div>
				<img src={iconUrl}/>
			</div>
			<p>wind: {weather.wind.speed} m/s</p>
		</div>
	)
}

const Countries = ({filter, countries, handleShowClick}) => {
	const [weather, setWeather] = useState(null)
	useEffect(() => {
		if (countries.length === 1) {
			const country = countries[0];
			weatherService.getWeather(country.capital, country.name.area)
				.then(weatherData => setWeather(weatherData))
		}
	}, [filter])
	if (countries.length > 10)
		return (<p>Too many matches, specify another filter</p>)
	else if (countries.length === 1) {
		const country = countries[0]
		return (<Country country={country} weather={weather}/>)
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