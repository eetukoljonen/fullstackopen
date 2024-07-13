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

const Total = (props) => (
	<p>
		Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}
	</p>
)

const Course = ({course}) => {
	return (
		<>
			<Header text={course.name} />
			<Content parts={course.parts} />
		</>
	)
}

export default Course