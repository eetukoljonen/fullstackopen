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

const Statistics = ({good, neutral, bad}) => {
	const total = good * 1 + bad * -1
	if (total ===0) {
		return(
			<>
				<h1>statistics</h1>
				<p>No feedback given</p>
			</>
		)
	}
	const length = good + neutral + bad
	const average = (total / length).toFixed(1)
	const positive = (good / length * 100).toFixed(1)
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

	const incrementGood = () => {
		setGood(good + 1)
	}

	const incrementBad = () => {
		setBad(bad + 1)
	}

	const incrementNeutral = () => {
		setNeutral(neutral + 1)
	}

	return (
	<div>
		<Header text={'give feedback'}/>
		<Button handleClick={incrementGood} text={'good'} />
		<Button handleClick={incrementNeutral} text={'neutral'} />
		<Button handleClick={incrementBad} text={'bad'} />
		<Statistics good={good} neutral={neutral} bad={bad} />
	</div>
	)
}

export default App