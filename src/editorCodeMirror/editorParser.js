import { defaultKeymap } from '@codemirror/commands'
import { EditorState, Prec, Compartment } from '@codemirror/state'
import { EditorView, basicSetup } from 'codemirror'
import {
  defaultHighlightStyle,
  HighlightStyle,
  syntaxHighlighting
} from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { javascript } from '@codemirror/lang-javascript'
import { keymap, KeyBinding } from '@codemirror/view'
import { SPTMController } from '../traducciones/sptm-live/SPTMController'
import { tutorialString } from './tutorialString'

function EditorParser({ noise, sine, parent, parser }) {
  // llaves?
  this.noiseObject
  this.sineObject
  console.log('Construct parser')

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

  this.setNoise = function (noiseVar) {
    this.noiseObject = noiseVar
    console.log('set noise')
    console.log(this.noiseObject)
  }
  this.setSine = function (sineVar) {
    this.sineObject = sineVar
    console.log('set sine')
    console.log(this.sineObject)
  }
  this.getNoise = function () {
    return this.noiseObject
  }
  this.getSine = function () {
    return this.sineObject
  }
  this.evaluar = function () {
    const currentLine = view.state.doc.lineAt(
      view.state.selection.main.head
    ).number
    const cursorText = view.state.doc.text[currentLine - 1]
    parser.parseString(cursorText)
    //const code = view.state.doc.toString()
    //console.log(code)
    // eval(code);

    let firstRange = view.state.selection.ranges.at(0)
    let selectedText = view.state.doc
      .toString()
      .substring(firstRange.from, firstRange.to)
    console.log(selectedText)
    const str = selectedText.split(' ')

    console.log('Eval', str)
    if (str[0] == 'noise' && str[1] == 'gain') {
      this.getNoise().gain(str[2])
      console.log('noise')
    }

    if (str[0] == 'sine' && str[1] == 'gain') {
      this.getSine().gain(str[2])
      console.log('sine')
    }

    return true
  }
}

module.exports = { EditorParser }
