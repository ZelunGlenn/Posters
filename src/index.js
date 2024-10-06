import path from 'path'
import express from 'express'
import { fileURLToPath } from 'url'
import fs from 'fs/promises';

const app = express()
const port = 3000



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'server', 'views'));

app.set('view engine', 'ejs');

app.use(express.static('public'))

app.get('/', async(req, res) => {
  const filePath = path.join(__dirname, 'server', 'data')
  const files = await fs.readdir(filePath)
  // check if files empty
  if (files.length === 0) {
    res.render('home')
  } else {
    const contents = await Promise.all(
      files.map((file) => 
        fs.readFile(path.join(filePath, file), 'utf-8')
      )
    )
    res.render('home', {
      contents: contents
    })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port} at http://localhost:${port}`)
})