import { useState } from 'react'

const Header = ({text}) => (
	<h1>{text}</h1>
)

const Button = ({handleClick, text}) => (
	<button onClick={handleClick}>
		{text}
	</button>
)

const StatisticLine = ({text, value}) => (
	<tr>
		<td>{text}</td>
		<td>{value}</td>
	</tr>
)

const Statistics = ({good, neutral, bad, allRatings}) => {
	if (allRatings.length ===0) {
		return(
			<>
				<h1>statistics</h1>
				<p>No feedback given</p>
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
	const average = (calculateTotal(allRatings) / length).toFixed(2)
	const positive = (numOfGood / length * 100).toFixed(1)
	return(
	<>
		<Header text={'statistics'}/>
		<table>
			<tbody>
				<StatisticLine text="good" value={good} />
				<StatisticLine text="neutral" value={neutral} />
				<StatisticLine text="bad" value={bad} />
				<StatisticLine text="all" value={length} />
				<StatisticLine text="average" value={average} />
				<StatisticLine text="positive" value={positive + '%'} />
			</tbody>
		</table>
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
		<Header text={'give feedback'}/>
		<Button handleClick={incrementGood} text={'good'} />
		<Button handleClick={incrementNeutral} text={'neutral'} />
		<Button handleClick={incrementBad} text={'bad'} />
		<Statistics good={good} neutral={neutral} bad={bad} allRatings={allRatings} />
	</div>
	)
}

export default App