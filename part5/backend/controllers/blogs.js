const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog =
    await Blog.findById(savedBlog.id).populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  const blogCreatorId = blog.user
   ? blog.user.toString()
   : undefined

  if (!blogCreatorId || blogCreatorId !== decodedToken.id) {
    response.status(401).end()
  } else {
    await blog.deleteOne()
    response.status(204).end()
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const updatedBlog =
    await Blog
      .findByIdAndUpdate(request.params.id, request.body, { new: true })
      .populate('user')
  response.json(updatedBlog)
})

module.exports = blogsRouter