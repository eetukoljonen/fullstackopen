import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import BlogForm from './BlogForm'

test('Creating a new blog on the blogform', async () => {
  const addBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm addBlog={addBlog} />)


  const inputs = screen.getAllByRole('textbox')
  const createButton = screen.getByText('create')

  let i = 0
  for (const input of inputs) {
    await user.type(input, 'test' + i++)
  }
  await user.click(createButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('test0')
  expect(addBlog.mock.calls[0][0].author).toBe('test1')
  expect(addBlog.mock.calls[0][0].url).toBe('test2')

})