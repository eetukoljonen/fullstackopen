import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'vitest'
import Blog from './Blog'

test('renders title', () => {
  const blog = {
    title: 'This is a title',
    author: 'Test Author',
    url: 'testurl.fi',
    likes: 0
  }

  render(<Blog blog={blog} />)

  const titleElement = screen.getByText('This is a title', { exact: false })
  expect(titleElement).toBeDefined()

  const urlElement = screen.queryByText('testurl.fi', { exact: false })
  expect(urlElement).toBeNull()

  const likesElement = screen.queryByText('likes', { exact: false })
  expect(likesElement).toBeNull()
})

test('clicking the button shows rest of the blog info', async () => {
  const blog = {
    title: 'This is a title',
    author: 'Test Author',
    url: 'testurl.fi',
    likes: 0,
    user: {
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const titleElement = screen.getByText('This is a title', { exact: false })
  expect(titleElement).toBeDefined()

  const urlElement = screen.getByText('testurl.fi', { exact: false })
  expect(urlElement).toBeDefined()

  const likesElement = screen.getByText('likes', { exact: false })
  expect(likesElement).toBeDefined()

  const userElement = screen.getByText('Test User', { exact: false })
  expect(userElement).toBeDefined()
})