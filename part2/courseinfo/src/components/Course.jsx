const Header = ({text}) => {
	return (
		<h1>{text}</h1>
	)
}

const Part = ({name, exercises}) => (
	<p>
		{name} {exercises}
	</p>
)

const Content = ({parts}) => (
	<>
		{parts.map(part => 
			<Part key={part.id} name={part.name} exercises={part.exercises} />
		)}
	</>
)

const Total = ({parts}) => {
	const total = parts.reduce((sum, part) => {
		return sum + part.exercises;
	}, 0)

	return (
		<h4>
			total of {total} exercises
		</h4>
	)
}

const Course = ({course}) => {
	return (
		<>
			<Header text={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</>
	)
}

export default Course