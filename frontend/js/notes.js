const API_URL = 'http://localhost:5555/api' // change this to your Render URL before deploying

// ===== PROTECT THE PAGE =====
const token = localStorage.getItem('token')

if (!token) {
  window.location.href = 'index.html'
  throw new Error('No token')
}


function authHeader() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location.href = 'index.html'
})

async function getEvents() {
  const res = await fetch(`${API_URL}/events`, {
    method: 'GET',
    headers: authHeader()
  })

  const events = await res.json()

  if (!res.ok) {
    document.getElementById('eventsList').textContent = events.message || 'Failed to load events'
    return
  }

  renderEvents(events)
}

function renderEvents(events) {
  const container = document.getElementById('eventsList')
  container.innerHTML = ''

  if (events.length === 0) {
    container.textContent = 'No events yet. Add one above!'
    return
  }

  events.forEach(event => {
    const card = document.createElement('div')
    card.className = 'event-card'
    card.innerHTML = `
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <div class="card-actions">
        <button class="btn-edit" onclick="startEdit('${event._id}', '${event.title.replace(/'/g, "\\'")}', '${event.description.replace(/'/g, "\\'")}', '${event.date}', '${event.location.replace(/'/g, "\\'")}')">Edit</button>
        <button class="btn-delete" onclick="deleteEvent('${event._id}')">Delete</button>
      </div>
    `
    container.appendChild(card)
  })
}

// create event
document.getElementById('createEventForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const title = document.getElementById('newTitle').value
  const description = document.getElementById('newDescription').value
  const date = document.getElementById('newDate').value
  const location = document.getElementById('newLocation').value

  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ title, description, date, location })
  })

  const data = await res.json()

  if (!res.ok) {
    document.getElementById('createMsg').style.color = 'red'
    document.getElementById('createMsg').textContent = data.message || 'Failed to create event'
    return
  }

  document.getElementById('createMsg').style.color = 'green'
  document.getElementById('createMsg').textContent = 'Event created!'
  document.getElementById('createEventForm').reset()
  getEvents()
})

// delete event
async function deleteEvent(id) {
  const confirmed = confirm('Are you sure you want to delete this event?')
  if (!confirmed) return

  const res = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  })

  const data = await res.json()

  if (!res.ok) {
    alert(data.message || 'Failed to delete event')
    return
  }

  getEvents()
}

function startEdit(id, title, description, date, location) {
  document.getElementById('editSection').style.display = 'block'
  document.getElementById('editEventId').value = id
  document.getElementById('editTitle').value = title
  document.getElementById('editDescription').value = description
  document.getElementById('editDate').value = date
  document.getElementById('editLocation').value = location
  document.getElementById('editMsg').textContent = ''
  document.getElementById('editSection').scrollIntoView()
}

// cancel edit
document.getElementById('cancelEditBtn').addEventListener('click', () => {
  document.getElementById('editSection').style.display = 'none'
})

// save edit
document.getElementById('saveEditBtn').addEventListener('click', async () => {
  const id = document.getElementById('editEventId').value
  const title = document.getElementById('editTitle').value
  const description = document.getElementById('editDescription').value
  const date = document.getElementById('editDate').value
  const location = document.getElementById('editLocation').value

  const res = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify({ title, description, date, location })
  })

  const data = await res.json()

  if (!res.ok) {
    document.getElementById('editMsg').style.color = 'red'
    document.getElementById('editMsg').textContent = data.message || 'Failed to update event'
    return
  }

  document.getElementById('editMsg').style.color = 'green'
  document.getElementById('editMsg').textContent = 'Event updated!'
  document.getElementById('editSection').style.display = 'none'
  getEvents()
})

// load events
getEvents()