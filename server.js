const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const db = require('./database')

function hashPassword(password) {
    return crypto.createHash('sha256').update(password + 'mexi_salt').digest('hex')
}

function generateToken() {
    return crypto.randomBytes(32).toString('hex')
}

function getUserFromToken(token) {
    if (!token) return null
    const row = db.prepare('SELECT user_id FROM tokens WHERE token = ?').get(token)
    if (!row) return null
    return db.prepare('SELECT * FROM users WHERE id = ?').get(row.user_id)
}

const app = express()
const PORT = 3000

const uploadsDir = path.join(__dirname, 'public', 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext)
    }
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, allowed.includes(ext))
    },
    limits: { fileSize: 5 * 1024 * 1024 }
})

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Auth endpoints
app.post('/api/register', (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.json({ success: false, error: 'Faltan datos' })
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
    if (existing) return res.json({ success: false, error: 'El usuario ya existe' })
    const password_hash = hashPassword(password)
    const result = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, password_hash)
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
    const token = generateToken()
    db.prepare('INSERT INTO tokens (token, user_id) VALUES (?, ?)').run(token, user.id)
    res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role, state_id: user.state_id, country_code: user.country_code } })
})

app.post('/api/login', (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.json({ success: false, error: 'Faltan datos' })
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
    if (!user || user.password_hash !== hashPassword(password)) return res.json({ success: false, error: 'Credenciales incorrectas' })
    const token = generateToken()
    db.prepare('INSERT INTO tokens (token, user_id) VALUES (?, ?)').run(token, user.id)
    res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role, state_id: user.state_id, country_code: user.country_code } })
})

app.post('/api/geolocation', (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader?.replace('Bearer ', '')
    const user = getUserFromToken(token)
    if (!user) return res.json({ success: false, error: 'No autorizado' })
    const { country_code, state_id } = req.body
    db.prepare('UPDATE users SET country_code = ?, state_id = ? WHERE id = ?').run(country_code, state_id, user.id)
    res.json({ success: true })
})

// Events
app.get('/api/events/:state', (req, res) => {
    const state = decodeURIComponent(req.params.state)
    const stmt = db.prepare(`
        SELECT * FROM events
        WHERE state = ? AND date >= date('now')
        ORDER BY date ASC
        LIMIT 5
    `)
    const events = stmt.all(state)
    if (events.length === 0) return res.json({ message: 'No hay eventos próximos en este estado' })
    res.json({ data: events })
})

app.get('/api/trending', (req, res) => {
    const events = db.prepare(`
        SELECT * FROM events
        WHERE date >= date('now')
        ORDER BY created_at DESC
        LIMIT 5
    `).all()
    res.json({ data: events })
})

app.get('/api/admin/events', (req, res) => {
    const events = db.prepare('SELECT * FROM events ORDER BY date DESC').all()
    res.json({ data: events })
})

app.post('/api/admin/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' })
    res.json({ success: true, url: '/uploads/' + req.file.filename })
})

app.post('/api/admin/events', (req, res) => {
    const { state, title, description, date, location, category, image_url } = req.body
    const stmt = db.prepare(`
        INSERT INTO events (state, title, description, date, location, category, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(state, title, description, date, location || '', category || '', image_url || null)
    res.json({ success: true, id: result.lastInsertRowid })
})

app.put('/api/admin/events/:id', (req, res) => {
    const { state, title, description, date, location, category, image_url } = req.body
    const id = req.params.id
    const stmt = db.prepare(`
        UPDATE events SET state=?, title=?, description=?, date=?, location=?, category=?, image_url=?
        WHERE id=?
    `)
    stmt.run(state, title, description, date, location || '', category || '', image_url || null, id)
    res.json({ success: true, updated: true })
})

app.delete('/api/admin/events/:id', (req, res) => {
    const existing = db.prepare('SELECT image_url FROM events WHERE id = ?').get(req.params.id)
    if (existing && existing.image_url) {
        const imgPath = path.join(__dirname, 'public', existing.image_url)
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath)
    }
    db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id)
    res.json({ deleted: true })
})

// Importación masiva desde carpetas de estados
const assetsDir = path.join(__dirname, 'assets de los eventos')

app.post('/api/admin/bulk-import', (req, res) => {
    if (!fs.existsSync(assetsDir)) {
        return res.status(404).json({ error: 'Carpeta "assets de los eventos" no encontrada' })
    }

    const stateFolders = fs.readdirSync(assetsDir).filter(name => {
        return fs.statSync(path.join(assetsDir, name)).isDirectory()
    })

    const insertStmt = db.prepare(`
        INSERT INTO events (state, title, description, date, location, category, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    let imported = 0
    let errors = []

    for (const stateFolder of stateFolders) {
        const jsonPath = path.join(assetsDir, stateFolder, 'eventos.json')
        if (!fs.existsSync(jsonPath)) continue

        let eventos
        try {
            eventos = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
        } catch (e) {
            errors.push(`${stateFolder}: eventos.json inválido`)
            continue
        }

        for (const evento of eventos) {
            let image_url = null

            if (evento.image) {
                const srcPath = path.join(assetsDir, stateFolder, evento.image)
                if (fs.existsSync(srcPath)) {
                    const ext = path.extname(evento.image)
                    const newName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext
                    const destPath = path.join(uploadsDir, newName)
                    fs.copyFileSync(srcPath, destPath)
                    image_url = '/uploads/' + newName
                }
            }

            try {
                insertStmt.run(stateFolder, evento.title, evento.description, evento.date, evento.location, evento.category, image_url)
                imported++
            } catch (e) {
                errors.push(`${stateFolder} / ${evento.title}: ${e.message}`)
            }
        }
    }

    res.json({ imported, errors })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
