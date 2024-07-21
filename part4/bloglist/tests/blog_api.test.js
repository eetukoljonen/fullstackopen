const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are right amount of blogs', async () => {
  const blogs = await helper.blogsInDb()

  assert.strictEqual(blogs.length, helper.initialBlogs.length)
})

test('identifier is id and not _id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach(blog => {
    assert(blog.id !== undefined, 'id field is not defined');
    assert(blog._id === undefined, '_id field should not be defined');
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'The Future of Artificial Intelligence',
    author: 'Dr. Alan Turing',
    url: 'https://ai-future.tech/blog/future-of-ai',
    likes: 42
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDb()

  const titles = blogs.map(r => r.title)

  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)

  assert(titles.includes('The Future of Artificial Intelligence'))
})

test('a blog without likes section', async () => {
  const newBlog = {
    title: 'Mastering the Art of Sourdough Baking',
    author: 'Julia Child',
    url: 'https://bakingmasters.com/sourdough-secrets'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDb()

  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)

  const addedBlog = blogs.find(blog => blog.title === 'Mastering the Art of Sourdough Baking');
  assert.strictEqual(addedBlog.likes, 0);
})

test('an invalid blog cant be added', async () => {
  const newBlog = {
    author: 'Albert Einstein'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('can delete a specific blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  
  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(!titles.includes(blogToDelete.title))
})

after(async () => {
  await mongoose.connection.close()
})