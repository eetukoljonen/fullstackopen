const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
  const blog = blogs.reduce((maxLikeBlog, blog) => {
    if (!maxLikeBlog)
      return blog
    return maxLikeBlog.likes < blog.likes ? blog : maxLikeBlog
  }, null)
  console.log(blog)
  return blog
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}