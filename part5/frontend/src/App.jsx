import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, className }) => {
	if (message === null) {
		return null
	}
	return (
		<div className={className}>
			{message}
		</div>
	)
}

const LoginForm = ({ setUser, showNotification}) => {
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')


  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification('You are now logged in', 'success')
    } catch (exception) {
      showNotification('wrong username or password', 'error')
    }
  }

  return (
    <div>
      <h1>log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

const CreateBlogForm = ({blogs, setBlogs, showNotification}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author}`, 'success')
    } catch (error) {
      showNotification('something went wrong when creating the blog', 'error')
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          title:
            <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
            <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
            <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
	const [className, setClassName] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (msg, className) => {
    setClassName(className)
    setNotification(msg)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedUser')
    showNotification('You are now logged out', 'success')
    setUser(null)
  }


  if (!user) {
    return (
      <div>
        <Notification message={notification} className={className}/>
        <LoginForm setUser={setUser} showNotification={showNotification} />
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} className={className}/>
      <p>{user.name} logged in  <button onClick={logOut}>log out</button></p>
      <CreateBlogForm blogs={blogs} setBlogs={setBlogs} showNotification={showNotification} />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App