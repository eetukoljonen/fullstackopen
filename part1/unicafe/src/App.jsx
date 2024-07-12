import { useState } from 'react'

const Header = () => (
	<h1>give feedback</h1>
)

const Button = ({handleClick, text}) => (
	<button onClick={handleClick}>
		{text}
	</button>
)

const Statistics = ({good, neutral, bad, allRatings}) => {
	if (allRatings.length ===0) {
		return(
			<>
				<h1>statistics</h1>
				<p>good {good}</p>
				<p>neutral {neutral}</p>
				<p>bad {bad}</p>
				<p>all {0}</p>
				<p>average {0}</p>
				<p>positive {0} %</p>
			</>
		)
	}

	const numOfGood = allRatings.filter((rating) => rating === 1).length
	const length = allRatings.length
	const calculateTotal = (array) => {
		let total = 0
		array.forEach((element) => {
			total += element
		})
		return (total)
	}
	const average = calculateTotal(allRatings) / length
	const positive = numOfGood / length * 100
	return(
	<>
		<h1>statistics</h1>
		<p>good {good}</p>
		<p>neutral {neutral}</p>
		<p>bad {bad}</p>
		<p>all {length}</p>
		<p>average {average}</p>
		<p>positive {positive} %</p>
	</>
	)
}

const App = () => {
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)
	const [allRatings, setRatings] = useState([])

	const incrementGood = () => {
		setGood(good + 1)
		setRatings(allRatings.concat(1))
	}

	const incrementBad = () => {
		setBad(bad + 1)
		setRatings(allRatings.concat(-1))
	}

	const incrementNeutral = () => {
		setNeutral(neutral + 1)
		setRatings(allRatings.concat(0))
	}

	return (
	<div>
		<Header />
		<Button handleClick={incrementGood} text={'good'} />
		<Button handleClick={incrementNeutral} text={'neutral'} />
		<Button handleClick={incrementBad} text={'bad'} />
		<Statistics good={good} neutral={neutral} bad={bad} allRatings={allRatings} />
	</div>
	)
}

export default App