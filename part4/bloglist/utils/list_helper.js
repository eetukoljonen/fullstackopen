const _ = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => {
  const blog = blogs.reduce((maxLikeBlog, blog) => {
    if (!maxLikeBlog)
      return blog
    return maxLikeBlog.likes < blog.likes ? blog : maxLikeBlog
  }, null)
  return blog
}

const mostBlog = (blogs) => {
  const blogCounts = _.countBy(blogs, 'author');
  
  const blogCountsArray = _.map(blogCounts, (blogs, author) => ({ author, blogs }));
  
  const mostBlogResult = _.maxBy(blogCountsArray, 'blogs');
  
  return mostBlogResult;
}

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author');

  const likesByAuthor = _.map(groupedByAuthor, (authorBlogs, author) => {
    return ({
      author: author,
      likes: _.sumBy(authorBlogs, 'likes')
    })
  });

  const mostLikesResult = _.maxBy(likesByAuthor, 'likes');

  return mostLikesResult;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlog,
  mostLikes
}