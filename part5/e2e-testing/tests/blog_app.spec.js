const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, createUser } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await createUser(request, 'testname', 'testi', 'testisalis')
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testi', 'testisalis')
      await expect(page.getByText('testname logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testi', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testi', 'testisalis')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'title with playwright', 'author with playwright', 'url.playwright.fi')
      await expect(page.getByText('title with playwright author with playwright')).toBeVisible()
      await expect(page.getByRole('button', { name: 'new blog' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'title with playwright', 'author with playwright', 'url.playwright.fi')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted by the creator', async ({ page }) => {
      await createBlog(page, 'title with playwright', 'author with playwright', 'url.playwright.fi')
      await expect(page.getByText('title with playwright author with playwright')).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()
      await page.on('dialog', async dialog => await dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Deletion success')).toBeVisible()
      await expect(page.getByText('title with playwright author with playwright')).toBeHidden()
    })

    test('only blog creator can see the remove button', async ({ page, request }) => {
      // ensuring the blog creator sees remove button and logging out
      await createBlog(page, 'title with playwright', 'author with playwright', 'url.playwright.fi')
      await expect(page.getByText('title with playwright author with playwright')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      await page.getByRole('button', { name: 'log out' }).click()
      await expect(page.getByText('You are now logged out')).toBeVisible()

      // creating a new user and logging in with it
      await createUser(request, 'newuser', 'newuser', 'newpassword')
      await loginWith(page, 'newuser', 'newpassword')
      await expect(page.getByText('newuser logged in')).toBeVisible()

      // testing that the new user cannot see the remove button
      await expect(page.getByText('title with playwright author with playwright')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeHidden()
    })

    test('blogs get sorted by likes', async ({ page }) => {
      // creating three blogs and ensuring all blogs are visible and all have zero likes
      for (let i = 0; i < 3; i++) {
        await createBlog(page, 'title' + i, 'author' + i, 'url' + i)
        
        const blog = await page.getByText(`title${i.toString()} author${i.toString()}`)
        const blogParent = await blog.locator('..')
        await expect(blog).toBeVisible()
        await blogParent.getByRole('button', { name: 'view' }).click()
        await expect(blogParent.getByText('likes 0')).toBeVisible()
      }

      // liking each post a random amount of times between 3 to 20 likes and storing
      // the order into an array
      const sortedLikes = []
      for (let i = 0; i < 3; i++) {
        const blog = await page.getByText(`title${i.toString()} author${i.toString()}`)
        const blogParent = await blog.locator('..')
        const likes = Math.floor(Math.random() * (20 - 3) + 3)
        const likeString = likes.toString()
        sortedLikes.push(likes)
        for (let currentLikes = 0; currentLikes < likes; currentLikes++) {
          await blogParent.getByRole('button', { name: 'like' }).click()
          await blogParent.getByText(`likes ${currentLikes + 1}`).waitFor()
        }
        await expect(blogParent.getByText(`likes ${likeString}`)).toBeVisible() 
      }

      // sorting the like array and comparing the order to be same
      sortedLikes.sort((a, b) => (a - b) * -1)
      const blogLikes = await page.getByText('likes', { exact: false }).all()
      for (let i = 0; i < 3; i++) {
        const blogParent = await blogLikes[i].locator('..')
        await expect(blogParent.getByText(`likes ${sortedLikes[i]}`)).toBeVisible() 
      }
    })
  })  
})
