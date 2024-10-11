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

app.use(express.static(path.join(__dirname, 'public')));

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
          image: content.split('\n').slice(4).join('\n'),
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
    fileName: req.query.fileName,
    title: file.split('\n')[0],
    name: file.split('\n')[1],
    time: file.split('\n')[2],
    content: file.split('\n')[3],
    image: file.split('\n').slice(4).join('\n'),
  })
})

app.get('/newPost', (req, res) => {
  res.render('newPost')
})

app.post('/create', async (req, res) => {
  // { name: 'da', title: 'dsa', content: 'dsa' }
  const { name, title, content } = req.body
  const pathz = path.join(__dirname, 'server', 'data')
  const time = "-" + new Date().getHours() + "-" + new Date().getMinutes()
  const contentTime = new Date().getHours() + ":" + new Date().getMinutes()
  const fileName = name + time + ".txt"


  let imageAddresses = ""
  const fileImage = path.join(__dirname, 'public', 'images.txt')
  //read images.txt
  await fs.readFile(fileImage, 'utf-8').then((data) => {
    imageAddresses = `${data}`
  })
  const randomImageAddress = imageAddresses.split('\n')[Math.floor(Math.random() * imageAddresses.split('\n').length)]
  const contents = `${title}\n${name}\n${contentTime}\n${content}\n${randomImageAddress}`

  fs.writeFile(`${pathz}/${fileName}`, contents, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log('success')
    }
  })
  res.redirect('/')
})

app.get('/edit', async(req, res) => {
  const pathz = path.join(__dirname, 'server', 'data', req.query.fileName)
  const file = await fs.readFile(pathz, 'utf-8')
  res.render('edit', {
    fileName: req.query.fileName,
    title: file.split('\n')[0],
    name: file.split('\n')[1],
    time: file.split('\n')[2],
    content: file.split('\n')[3],
    image: file.split('\n').slice(4).join('\n'),
  })
})

app.post('/update', (req, res) => {
  const { fileName, title, time, name, content, image} = req.body
  console.log(image)
  const pathz = path.join(__dirname, 'server', 'data', fileName)


  const contents = `${title}\n${name}\n${time}\n${content}\n${image}`

  fs.writeFile(pathz, contents, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log('success')
    }
  })
  //redirect to home page
  res.redirect('/')
})


app.delete('/files/:fileName', async (req, res) => {
  const fileName = req.params.fileName
  const filepath = path.join(__dirname, 'server', 'data', fileName)
  

  // // wrong approach
  // await fs.access(filepath)
  // await fs.unlink(filepath)
  // console.log('File deleted successfully:', fileName);
  // res.json({ message: `File ${fileName} deleted successfully` })
  // Redirect after successful deletion
  // res.redirect('/');


  try {
    // Check if the file exists before deleting
    await fs.access(filepath);  // This checks if the file exists

    // Delete the file
    await fs.unlink(filepath);
    console.log(`File ${fileName} deleted successfully`);

    // Send a success response
    res.json({ message: `File ${fileName} deleted successfully` });
  } catch (err) {
    if (err.code === 'ENOENT') {
      // If the file is not found
      console.error('File not found:', fileName);
      return res.status(404).json({ message: 'File not found' });
    } else {
      // Other errors
      console.error('Error deleting file:', err);
      return res.status(500).json({ message: 'Failed to delete file' });
    }
  }
})


app.listen(port, () => {
  console.log(`Server is running on port ${port} at http://localhost:${port}`)
})