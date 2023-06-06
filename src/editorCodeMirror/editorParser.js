import { defaultKeymap } from '@codemirror/commands'
import { EditorState, Prec, Compartment } from '@codemirror/state'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { keymap } from '@codemirror/view'
import { tutorialString } from './tutorialString'

function getCurrentLineText(view) {
  const currentLine = view.state.doc.lineAt(
    view.state.selection.main.head
  ).number
  if (view.state.doc.text) {
    return view.state.doc.text[currentLine - 1]
  } else {
    return ''
  }
}

function EditorParser({ parent, parser, handlePlay }) {
  const keymaps = []
  let currentLineText = ''
  keymaps.push(
    keymap.of({
      key: 'Ctrl-Enter',
      run: () => this.evaluar(),
      preventDefault: true
    }),

    keymap.of({
      key: 'Ctrl-.',
      run: () => this.stopAll(),
      preventDefault: true
    })
  )
  keymaps.push(keymap.of(defaultKeymap))

  let language = new Compartment()

  let startState = EditorState.create({
    doc: tutorialString,
    extensions: [
      keymaps,
      basicSetup,
      EditorView.lineWrapping,
      EditorView.updateListener.of((v) => {
        currentLineText = getCurrentLineText(v)
      })
    ]
  })

  let view = new EditorView({ state: startState, parent })

  this.evaluar = function () {
    // Revisar si hay seleccion
    let firstRange = view.state.selection.ranges.at(0)
    let selectedText = view.state.doc
      .toString()
      .substring(firstRange.from, firstRange.to)
    console.log(selectedText)
    if (selectedText !== '') {
      const linesToParse = selectedText.split('\n')
      console.log(linesToParse)
      linesToParse.forEach((line) => {
        parser.parseString(line)
      })
    } else {
      parser.parseString(getCurrentLineText(view))
    }

    return true
  }
  this.stopAll = function () {
    stopLine()
  }

  function playCurrentLine() {
    parser.parseString(getCurrentLineText(view))
  }

  function stopLine() {
    console.log('STOP ALL')
    parser.parseString('.')
  }

  return { view, playCurrentLine, stopLine }
}

module.exports = { EditorParser }
