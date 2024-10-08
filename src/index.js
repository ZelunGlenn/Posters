import path from 'path'
import express from 'express'
import { fileURLToPath } from 'url'
import fs from 'fs/promises';

const app = express()
const port = 3000


app.use(express.urlencoded({ extended: true }))

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
    const FileWithContents = await Promise.all(
      files.map(async(file) => {
        const content = await fs.readFile(path.join(filePath, file), 'utf-8')
        return {
          fileName: file,
          title: content.split('\n')[0],
          name: content.split('\n')[1],
          time: content.split('\n')[2],
        }
      })
    )

    res.render('home', {
      FileWithContents,
    })
  }
})

app.get('/detail', async(req, res) => {
  // req.query.fileName
  const pathz = path.join(__dirname, 'server', 'data', req.query.fileName)
  const file = await fs.readFile(pathz, 'utf-8')
  res.render('detail', {
    title: file.split('\n')[0],
    name: file.split('\n')[1],
    time: file.split('\n')[2],
    content: file.split('\n').slice(3).join('\n'),
  })
})

app.get('/newPost', (req, res) => {
  res.render('newPost')
})

app.post('/create', (req, res) => {
  // { name: 'da', title: 'dsa', content: 'dsa' }
  const { name, title, content } = req.body
  const pathz = path.join(__dirname, 'server', 'data')
  const time = "-" + new Date().getHours() + "-" + new Date().getMinutes()
  const contentTime = new Date().getHours() + ":" + new Date().getMinutes()
  const fileName = name + time + ".txt"
  const contents = `${title}\n${name}\n${contentTime}\n${content}`

  fs.writeFile(`${pathz}/${fileName}`, contents, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log('success')
    }
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port} at http://localhost:${port}`)
})