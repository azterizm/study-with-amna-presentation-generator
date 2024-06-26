import domToImage from 'dom-to-image'
import JSZip from 'jszip'
import './style.css'


const generateBtn = document.getElementById('generate-btn')

generateBtn?.addEventListener('click', processInput)

function processInput() {
  const input = document.getElementById('input') as HTMLInputElement
  const value = input.value.trim()
  if (!value) return
  const json = JSON.parse(value) as DataItem[]
  if (!json.length || typeof json[0].title !== 'string') return
  showMain()
  generate(json)
}

async function generate(data: DataItem[]) {
  const title = document.getElementById('title') as HTMLHeadingElement
  const content = document.getElementById('content') as HTMLDivElement

  const images: string[] = []
  for (let i = 0; i < data.length; i++) {
    const r = data[i]
    title.innerHTML = r.title
    content.innerHTML = ''
    r.content.map(r => {
      const p = document.createElement('p')
      p.textContent = r
      content.appendChild(p)
    })

    const image = await domToImage.toPng(document.getElementById('main'), {
      quality: 1,
    })

    images.push(image)
  }

  const zip = new JSZip()
  images.forEach((uri, i) => {
    var idx = uri.indexOf('base64,') + 'base64,'.length
    var content = uri.substring(idx)
    zip.file(`slide-${i}.png`, content, { base64: true })
  })

  const result = await zip.generateAsync({ type: 'blob' })

  downloadURI(URL.createObjectURL(result), 'slides.zip')

  showInput()
}


function downloadURI(uri: string, name: string) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link.remove()
}

function showMain() {
  const wrapper = document.getElementById('input-wrapper') as HTMLDivElement
  wrapper.classList.add('hidden')
  const main = document.getElementById('main')
  main?.classList.remove('hidden')
}

function showInput() {
  const wrapper = document.getElementById('input-wrapper') as HTMLDivElement
  wrapper.classList.remove('hidden')
  const main = document.getElementById('main')
  main?.classList.add('hidden')
}


type DataItem = {
  title: string; content: string[];
}
