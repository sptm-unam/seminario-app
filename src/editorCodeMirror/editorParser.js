import { defaultKeymap } from '@codemirror/commands'
import { EditorState, Prec, Compartment } from '@codemirror/state'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { keymap } from '@codemirror/view'
import { tutorialString } from './tutorialString'

function EditorParser({ parent, parser }) {

  const keymaps = []
  keymaps.push(
    keymap.of({
      key: 'Ctrl-Enter',
      run: () => this.evaluar(),
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
      language.of(javascript()),
      EditorView.lineWrapping
    ]
  })

  let view = new EditorView({ state: startState, parent })

  this.evaluar = function () {
    const currentLine = view.state.doc.lineAt(
      view.state.selection.main.head
    ).number
    const cursorText = view.state.doc.text[currentLine - 1]
    parser.parseString(cursorText)
    return true
  }
}

module.exports = { EditorParser }
