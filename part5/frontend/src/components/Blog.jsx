import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonLabel = visible ? 'hide' : 'view'

  const likeBlog = () => {
    const updatedBlog = {
      user: blog.user._id,
      likes: blog.likes + 1,
      url: blog.url,
      author: blog.author,
      title: blog.title
    }
    updateBlog(updatedBlog, blog.id)
  }

  const showRest = () => (
    <>
      {blog.url}  <br />
      likes {blog.likes} <button onClick={likeBlog}>like</button> <br />
      {blog.author}
    </>
  )

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} <button onClick={() => setVisible(!visible)}>{buttonLabel}</button>  <br />
        {visible && showRest()}
      </div>  
    </div>
  )
}

export default Blog