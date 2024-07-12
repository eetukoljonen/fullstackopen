import { useState } from 'react'

const Header = () => (
	<h1>give feedback</h1>
)

const Button = ({handleClick, text}) => (
	<button onClick={handleClick}>
		{text}
	</button>
)

const Statistics = ({good, neutral, bad}) => (
	<>
		<h1>statistics</h1>
		<p>good {good}</p>
		<p>neutral {neutral}</p>
		<p>bad {bad}</p>
	</>
)

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
		<Header />
		<Button handleClick={incrementGood} text={'good'} />
		<Button handleClick={incrementNeutral} text={'neutral'} />
		<Button handleClick={incrementBad} text={'bad'} />
		<Statistics good={good} neutral={neutral} bad={bad} />
	</div>
	)
}

export default App