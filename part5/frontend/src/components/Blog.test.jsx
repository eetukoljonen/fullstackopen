import { render, screen } from '@testing-library/react'
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

  const element = screen.getByText('This is a title', { exact: false })
  expect(element).toBeDefined()
})