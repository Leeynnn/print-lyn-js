import axios from 'axios'

class Print {
  /* 
    options: {
      id<string>? // 打印容器id名
      style<string>? // 样式标签字符串
      css<string>? // 外联样式链接
    }
    初始化时所有字符串请用 " "
  */
  constructor() {
    this.dom = null
    this.style = ''
    this.css = ''
  }

  init(options) {
    const id = options.id
    const css = options.css
    const style = options.style

    return new Promise((resolve, reject) => {
      if (id) {
        if (typeof id !== 'string') {
          reject('new Print()时需传入打印容器id名')
        } else {
          this.dom = document.getElementById(id)
        }
      }

      if (style) {
        if (typeof style !== 'string') {
          reject('new Print()时需传入打印容器样式标签字符串')
        } else {
          this.style = style
        }
      }

      if (css) {
        if (typeof css !== 'string') {
          reject('new Print()时需传入打印容器外联样式字符串')
        } else {
          axios.get(css).then(data => {
            if (this.style) {
              this.style = this.style.replace('<style>', `<style>${data.data}`)
            } else {
              this.style = `<style>${data.data}</style>`
            }
            resolve()
          })
        }
      } else {
        resolve()
      }
    })
  }

  print(options) {
    this.init(options).then(() => {
      const content = this.getContent()
      const document = window.document
      const iframe = document.createElement('iframe')
      const frame = document.body.appendChild(iframe)

      iframe.id = "yxkIframe"
      iframe.setAttribute('style', 'position:absolute;width:0;height:0;top:-10px;left:-10px;')

      const frameWindow = frame.contentWindow || frame.contentDocument
      const frameDocument = frame.contentDocument || frame.contentWindow.document

      frameDocument.open()
      frameDocument.write(content)
      frameDocument.close()

      setTimeout(function () {
        frameWindow.focus()
        try {
          if (!frameWindow.document.execCommand('print', false, null)) {
            frameWindow.print()
          }
        } catch (e) {
          frameWindow.print()
        }
        frameWindow.close()
      }, 10)

      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 100)
    }).catch(error => {
      console.error(error)
    })
  }

  getContent() {
    return `${this.style}${this.dom.outerHTML}`
  }
}

export default new Print()