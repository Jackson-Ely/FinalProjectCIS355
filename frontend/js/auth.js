const API_URL = 'http://localhost:5555/api' // change to your Render URL before deploying

// register
const registerForm = document.getElementById('registerForm')
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = document.getElementById('name').value
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username: username || undefined, email: email || undefined, password })
      })

      const data = await res.json()

      if (!res.ok) {
        document.getElementById('errorMsg').textContent = data.message || 'Registration failed'
        return
      }

      document.getElementById('successMsg').textContent = 'Registered! Redirecting to login...'
      setTimeout(() => window.location.href = 'index.html', 1500)

    } catch (err) {
      document.getElementById('errorMsg').textContent = 'Could not connect to server'
    }
  })
}

// login
const loginForm = document.getElementById('loginForm')
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const identifier = document.getElementById('identifier').value // email or username
    const password = document.getElementById('password').value

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      })

      const data = await res.json()

      if (!res.ok) {
        document.getElementById('errorMsg').textContent = data.message || 'Login failed'
        return
      }

      localStorage.setItem('token', data.token)
      window.location.href = 'dashboard.html'

    } catch (err) {
      document.getElementById('errorMsg').textContent = 'Could not connect to server'
    }
  })
}