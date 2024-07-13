import { useState, useEffect } from 'react'
import axios from 'axios'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [filter, setFilter] = useState('')

	const hook = () => {
		axios
			.get('http://localhost:3001/persons')
			.then(response => {
				setPersons(response.data)
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
		setPersons(persons.concat(personObject))
		setNewName('')
		setNewNumber('')
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
			<Persons persons={filtered} />
		</div>
	)

}

export default App