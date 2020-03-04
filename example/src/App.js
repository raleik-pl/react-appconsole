




import React from 'react'
import './App.css'

import AppConsole from '@raleik.pl/react-appconsole'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.appConsole = React.createRef()
    this.systemLog = React.createRef()
    this.buildLog = React.createRef()
  }

  render = () => {
    return (
      <React.Fragment>
        <div>
          <p>Logs</p>
          <label htmlFor='logId'>id*</label>
          <input type='text' placeholder='id' id='logId' />
          <label htmlFor='logLabel'>label*</label>
          <input type='text' placeholder='label' id='logLabel' />
          <label htmlFor='logRef'>ref*</label>
          <input type='text' placeholder='ref' id='logRef' />
          <input type='button' id='logAddBtn' value='addLog' onClick={this.addLog} />
          <input type='button' id='logRemoveBtn' value='removeLog' onClick={this.removeLog} />
        </div>
        <div>
          <p>Alerts</p>
          <label htmlFor='alertLogRef'>logRef*</label>
          <input type='text' placeholder='logRef' id='alertLogRef' />
          <label htmlFor='alertId'>id*</label>
          <input type='text' placeholder='id' id='alertId' />
          <label htmlFor='alertLevel'>level</label>
          <select id='alertLevel' size={3}>
            <option value='info'>info</option>
            <option value='warning'>warning</option>
            <option value='error'>error</option>
          </select>
          <label htmlFor='alertActions'>actions</label>
          <textarea id='alertActions' placeholder='[{ label: String, action: () => {} }, ...]' cols={50}></textarea>
          <label htmlFor='alertDirection'>direction</label>
          <select id='alertDirection' size={2}>
            <option value='in'>in</option>
            <option value='out'>out</option>
          </select>
          <label htmlFor='alertMessage'>message</label>
          <textarea id='alertMessage' placeholder='String || [any, ...]'></textarea>
          <label htmlFor='alertTimeout'>timeout</label>
          <input type='number' id='alertTimeout' min={0} />
          <input type='button' id='alertRaiseBtn' value='raiseAlert' onClick={this.raiseAlert} />
          <input type='button' id='alertClearBtn' value='clearAlert' onClick={this.clearAlert} />
        </div>
        <div>
          <input type='checkbox' id='workingChkBox' onClick={this.working} />
          <label htmlFor='workingChkBox'>working</label>
        </div>
        <AppConsole wrapperId='react-appconsole-container' ref={this.appConsole} />
      </React.Fragment>
    )
  }

  addLog = () => {
    let id = document.getElementById('logId').value
    let label = document.getElementById('logLabel').value
    let ref = document.getElementById('logRef').value
    this[ref] = React.createRef()
    this.appConsole.current.addLog({ id: id, label: label, ref: this[ref] })
  }

  removeLog = () => {
    let id = document.getElementById('logId').value
    this.appConsole.current.removeLog({ id: id })
    delete this[id]
  }

  raiseAlert = () => {
    let logRef = document.getElementById('alertLogRef').value
    let id = document.getElementById('alertId').value
    let level = document.getElementById('alertLevel').value
    let actions
    try {
      actions = JSON.parse(document.getElementById('alertActions').value || '[]')
    } catch(err) {

    }
    let direction = document.getElementById('alertDirection').value
    let message
    try {
        message = JSON.parse(document.getElementById('alertMessage').value)
    } catch(err) {
      message = document.getElementById('alertMessage').value
    }
    let timeout = parseInt(document.getElementById('alertTimeout').value, 10) || undefined
    this.appConsole.current.raiseAlert({logRef: this[logRef], id: id, level: level, actions: actions,
      direction: direction, timeout: timeout, message: message})
  }

  clearAlert = () => {
    let logRef = document.getElementById('alertLogRef').value
    let id = document.getElementById('alertId').value
    let level = document.getElementById('alertLevel').value
    let actions
    try {
      actions = JSON.parse(document.getElementById('alertActions').value)
    } catch(err) {
      actions = undefined
    }
    let direction = document.getElementById('alertDirection').value
    let message
    try {
        message = JSON.parse(document.getElementById('alertMessage').value)
    } catch(err) {
      message = document.getElementById('alertMessage').value
    }
    let timeout = parseInt(document.getElementById('alertTimeout').value, 10) || undefined
    this.appConsole.current.clearAlert({logRef: this[logRef], id: id, level: level, actions: actions,
      direction: direction, timeout: timeout, message: message})
  }

  working = () => {
    let working = document.getElementById('workingChkBox').checked
    this.appConsole.current.working({ working: working })
  }
}
