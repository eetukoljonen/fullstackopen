import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonLabel = visible ? 'hide' : 'view'

  const showRest = () => (
    <>
      {blog.url}  <br />
      likes {blog.likes} <button>like</button> <br />
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