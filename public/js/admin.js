const form = document.getElementById('event-form')
const tbody = document.getElementById('events-tbody')
const formTitle = document.getElementById('form-title')
const cancelBtn = document.getElementById('cancel-btn')
let editingId = null

loadEvents()

async function loadEvents() {
    const res = await fetch('/api/admin/events')
    const events = await res.json()

    tbody.innerHTML = events.map(ev => `
        <tr>
            <td>${ev.image_url ? `<img src="${ev.image_url}">` : '<span class="sin-imagen">Sin imagen</span>'}</td>
            <td>${ev.state}</td>
            <td>${ev.title}</td>
            <td>${ev.date}</td>
            <td>${ev.category}</td>
            <td>
                <button class="btn-edit" onclick="editEvent(${ev.id})">Editar</button>
                <button class="btn-delete" onclick="deleteEvent(${ev.id})">Eliminar</button>
            </td>
        </tr>
    `).join('')
}

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('state', document.getElementById('state').value)
    formData.append('title', document.getElementById('title').value)
    formData.append('description', document.getElementById('description').value)
    formData.append('date', document.getElementById('date').value)
    formData.append('location', document.getElementById('location').value)
    formData.append('category', document.getElementById('category').value)

    const imageFile = document.getElementById('image').files[0]
    if (imageFile) formData.append('image', imageFile)

    const url = editingId ? `/api/admin/events/${editingId}` : '/api/admin/events'
    const method = editingId ? 'PUT' : 'POST'

    await fetch(url, { method, body: formData })

    form.reset()
    editingId = null
    formTitle.textContent = 'Agregar Evento'
    cancelBtn.style.display = 'none'
    loadEvents()
})

async function editEvent(id) {
    const res = await fetch('/api/admin/events')
    const events = await res.json()
    const ev = events.find(e => e.id === id)
    if (!ev) return

    editingId = id
    formTitle.textContent = 'Editar Evento'
    cancelBtn.style.display = 'inline-block'

    document.getElementById('state').value = ev.state
    document.getElementById('title').value = ev.title
    document.getElementById('description').value = ev.description
    document.getElementById('date').value = ev.date
    document.getElementById('location').value = ev.location
    document.getElementById('category').value = ev.category

    window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deleteEvent(id) {
    if (!confirm('Seguro que quieres eliminar este evento?')) return
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    loadEvents()
}

cancelBtn.addEventListener('click', () => {
    form.reset()
    editingId = null
    formTitle.textContent = 'Agregar Evento'
    cancelBtn.style.display = 'none'
})
