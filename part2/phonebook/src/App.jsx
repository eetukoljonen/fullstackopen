import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filter, setFilter] = useState('')

	const hook = () => {
		personService
			.getAll()
			.then(initiallPersons => {
				setPersons(initiallPersons)
			})
	}

	useEffect(hook, [])

	const addNewContact = (event) => {
		event.preventDefault()
		if (persons.find((person => person.name === newName))) {
			alert(`${newName} is already added to phonebook`)
			return ;
		}
		const personObject = {
			name: newName,
			number: newNumber
		}
		personService
			.create(personObject)
			.then(returnedPerson => {
				setPersons(persons.concat(returnedPerson))
				setNewName('')
				setNewNumber('')
			})
	}

	const handleNameChange = (event) => {
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value)
	}

	const handleFilterChange = (event) => {
		setFilter(event.target.value)
	}

	const deleteUser = (id, name) => {
		console
		if (window.confirm(`Delete ${name} ?`)) {
			personService
				.deletePerson(id)
				.then(deletedPerson => {
					console.log(deletedPerson)
					setPersons(persons.filter(person => person.id !== id))
				})
		}
	}

	const filtered = filter
		? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
		: persons

	return (
		<div>
			<h2>Phonebook</h2>
			<Filter filter={filter} handleFilterChange={handleFilterChange} />
			<h2>add a new</h2>
			<PersonForm
				addNewContact={addNewContact}
				handleNameChange={handleNameChange}
				handleNumberChange={handleNumberChange}
				newName={newName}
				newNumber={newNumber}
			/>
			<h2>Numbers</h2>
			<Persons persons={filtered} handleClick={deleteUser}/>
		</div>
	)

}

export default App