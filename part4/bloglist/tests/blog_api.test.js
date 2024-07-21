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
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('identifier is id and not _id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach(blog => {
    assert(blog.id !== undefined, 'id field is not defined');
    assert(blog._id === undefined, '_id field should not be defined');
  })
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'test_title',
    author: 'test_author',
    url: 'test_url',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

  assert(titles.includes('test_title'))
})

after(async () => {
  await mongoose.connection.close()
})