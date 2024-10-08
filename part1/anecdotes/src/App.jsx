import { useState } from 'react'

const Header = ({text}) => (
	<h1>{text}</h1>
)

const Button = ({handleClick, text}) => (
	<button onClick={handleClick}>
		{text}
	</button>
)

const Anecdote = ({text}) => <p>{text}</p>

const Vote = ({votes}) => <p>has {votes} votes</p>

const App = () => {
	const anecdotes = [
		'If it hurts, do it more often.',
		'Adding manpower to a late software project makes it later!',
		'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
		'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
		'Premature optimization is the root of all evil.',
		'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
		'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
		'The only way to go fast, is to go well.'
	]

	const [selected, setSelected] = useState(0)
	const [points, setPoints] = useState(new Uint8Array(8))
	const [mostVotes, setMostVotes] = useState(0)

	const selectRandom = () => setSelected(Math.floor(Math.random() * 8))

	const incrementVote = () => {
		const copy = [...points]
		copy[selected] += 1
		setPoints(copy)
		if (copy[selected] > copy[mostVotes])
			setMostVotes(selected)
	}

	return (
	<div>
		<Header text={'Anecdote of the day'}/>
		<Anecdote text={anecdotes[selected]} />
		<Vote votes={points[selected]} />
		<Button handleClick={incrementVote} text='vote' />
		<Button handleClick={selectRandom} text='next anecdote' />
		<Header text={'Anecdote with most votes'}/>
		<Anecdote text={anecdotes[mostVotes]} />
		<Vote votes={points[mostVotes]} />
	</div>
	)
}

export default App