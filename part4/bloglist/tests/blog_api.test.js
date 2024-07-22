const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'test_user', passwordHash })
  await user.save()
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
  
  const loginResponse = await api
    .post('/api/login')
    .send({ username: "test_user", password: "sekret" })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const token = loginResponse.body.token

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
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

  const loginResponse = await api
    .post('/api/login')
    .send({ username: "test_user", password: "sekret" })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const token = loginResponse.body.token

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
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

  const loginResponse = await api
    .post('/api/login')
    .send({ username: "test_user", password: "sekret" })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const token = loginResponse.body.token

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('cannot delete someone elses blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  const loginResponse = await api
    .post('/api/login')
    .send({ username: "test_user", password: "sekret" })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const token = loginResponse.body.token

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(401)
  
  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(titles.includes(blogToDelete.title))
})

test('can delete self created blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const newBlog = {
    title: 'The Future of Artificial Intelligence',
    author: 'Dr. Alan Turing',
    url: 'https://ai-future.tech/blog/future-of-ai',
    likes: 42
  }
  
  const loginResponse = await api
    .post('/api/login')
    .send({ username: "test_user", password: "sekret" })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const token = loginResponse.body.token

  const createBlogResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfterCreation = await helper.blogsInDb()
  assert.strictEqual(blogsAtStart.length + 1, blogsAfterCreation.length)

  await api
    .delete(`/api/blogs/${createBlogResponse.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
})

test('can update a specific blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 1
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  const returnedBlog = response.body
  assert.strictEqual(returnedBlog.likes, updatedBlog.likes)
})

test('cannot update a specific blog with a valid non existing id', async () => {
  const validNonexistingId = await helper.nonExistingId()

  const updatedBlog = {
    title: 'trying to update this',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/'
  }

  await api
    .put(`/api/blogs/${validNonexistingId.id}`)
    .send(updatedBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(!titles.includes(updatedBlog.title))
})

after(async () => {
  await mongoose.connection.close()
})