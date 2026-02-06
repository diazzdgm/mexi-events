const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const db = require('./database')

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

app.get('/api/events/:state', (req, res) => {
    const state = decodeURIComponent(req.params.state)
    const stmt = db.prepare(`
        SELECT * FROM events
        WHERE state = ? AND date >= date('now')
        ORDER BY date ASC
        LIMIT 5
    `)
    const events = stmt.all(state)
    res.json(events)
})

app.get('/api/admin/events', (req, res) => {
    const events = db.prepare('SELECT * FROM events ORDER BY date DESC').all()
    res.json(events)
})

app.post('/api/admin/events', upload.single('image'), (req, res) => {
    const { state, title, description, date, location, category } = req.body
    const image_url = req.file ? '/uploads/' + req.file.filename : null

    const stmt = db.prepare(`
        INSERT INTO events (state, title, description, date, location, category, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(state, title, description, date, location, category, image_url)
    res.json({ id: result.lastInsertRowid })
})

app.put('/api/admin/events/:id', upload.single('image'), (req, res) => {
    const { state, title, description, date, location, category } = req.body
    const id = req.params.id

    const existing = db.prepare('SELECT image_url FROM events WHERE id = ?').get(id)
    let image_url = existing ? existing.image_url : null

    if (req.file) {
        if (existing && existing.image_url) {
            const oldPath = path.join(__dirname, 'public', existing.image_url)
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
        }
        image_url = '/uploads/' + req.file.filename
    }

    const stmt = db.prepare(`
        UPDATE events SET state=?, title=?, description=?, date=?, location=?, category=?, image_url=?
        WHERE id=?
    `)
    stmt.run(state, title, description, date, location, category, image_url, id)
    res.json({ updated: true })
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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
