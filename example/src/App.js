import React from 'react'

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
        <button onClick={this.click}>CLICK</button>
        <AppConsole wrapperId='react-appconsole-container' ref={this.appConsole} />
      </React.Fragment>
    )
  }

  componentDidMount = () => {
    this.appConsole.current.addLog({ id: 'systemLog', label: 'System log', ref: this.systemLog })
    this.appConsole.current.addLog({ id: 'buildLog', label: 'Build log', ref: this.buildLog })
  }

  click = () => {
    let s = () => Math.random().toString(36);
    let d = new Date().toISOString();
    let r = Math.random();
    if (r > 0.5) {
      this.appConsole.current.raiseAlert({ logRef: this.systemLog, id: s(), level: 'warning', message: d })
      this.appConsole.current.raiseAlert({ logRef: this.systemLog, id: s(), level: 'error', message: d })
    }
    else {
      this.appConsole.current.clearAlert({ logRef: this.buildLog, id: s(), message: d })
    }
  }
}
