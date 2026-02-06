const states = document.querySelectorAll('#mexico-map .state')
const eventsList = document.getElementById('events-list')
const stateTitle = document.getElementById('state-title')
let activeState = null

states.forEach(state => {
    state.addEventListener('click', () => {
        if (activeState) activeState.classList.remove('active')
        state.classList.add('active')
        activeState = state

        const name = state.getAttribute('data-name')
        loadEvents(name)
    })

    state.addEventListener('mouseenter', () => {
        const name = state.getAttribute('data-name')
        state.setAttribute('title', name)
    })
})

async function loadEvents(stateName) {
    stateTitle.innerHTML = `<h2>${stateName}</h2>`
    eventsList.innerHTML = '<p class="placeholder">Cargando...</p>'

    try {
        const res = await fetch(`/api/events/${encodeURIComponent(stateName)}`)
        const events = await res.json()

        if (events.length === 0) {
            eventsList.innerHTML = '<p class="no-events">No hay eventos proximos en este estado</p>'
            return
        }

        eventsList.innerHTML = events.map(ev => `
            <div class="event-card">
                ${ev.image_url ? `<img src="${ev.image_url}" alt="${ev.title}">` : ''}
                <div class="event-info">
                    <span class="event-category">${ev.category}</span>
                    <h3>${ev.title}</h3>
                    <p class="event-date">${formatDate(ev.date)}</p>
                    <p>${ev.description}</p>
                    <p class="event-location">${ev.location}</p>
                </div>
            </div>
        `).join('')
    } catch (err) {
        eventsList.innerHTML = '<p class="no-events">Error al cargar eventos</p>'
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
