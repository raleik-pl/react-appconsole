import { faArrowDown, faArrowUp, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import AlertBar from './AlertBar.jsx'
import ConsoleLog from './ConsoleLog.jsx'
import './AppConsole.css'

export default class AppConsole extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      alerts: {},
      logs: {},
      selectedLog: 0
    }
  }

  static propTypes = {
    wrapperId: PropTypes.string.isRequired
  }

  render = () => {
    document.getElementById(this.props.wrapperId).classList.add('react-appconsole-container')
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className='react-appconsole-tabbedConsole' style={{ display: this.state.open ? 'block' : 'none' }}>
          <Tabs forceRenderTabPanel selectedIndex={this.state.selectedLog}
            onSelect={(index) => {
              this.setState({
                selectedLog: index,
                [Object.keys(this.state.logs)[index] + 'Modified']: false
              })
            }}
            selectedTabClassName='react-appconsole-consoleLogTabActive'
            selectedTabPanelClassName='react-appconsole-consoleLogTabPanelActive'
          >
            <TabList className='react-appconsole-consoleLogTabsList'>
              {Object.keys(this.state.logs).map((key) => {
                return (
                  <Tab key={key} className={'react-appconsole-consoleLogTab'}>
                    {
                      this.state[key + 'Modified'] ? <div className='react-appconsole-consoleLogTabModified'>
                        <FontAwesomeIcon icon={faPlusSquare} fixedWidth size='sm' />
                      </div> : null
                    }
                    <div>{this.state.logs[key].label}</div>
                  </Tab>
                )
              })}
            </TabList>
            {Object.keys(this.state.logs).map((key) => {
              let log = this.state.logs[key]
              return (
                <TabPanel key={log.id} className='react-appconsole-consoleLogTabPanel'>
                  <ConsoleLog logId={log.id} ref={log.ref} logModified={this.logModified} />
                </TabPanel>
              )
            })}
          </Tabs>
        </div>
        <div className='react-appconsole-alertBarContainer'>
          <div className='react-appconsole-appConsoleToggle'>
            <div className='react-appconsole-alertBar' style={{ background: '#fff', cursor: 'pointer' }} onClick={this.toggle}>
              <div style={{ transition: 'max-height 0.3s ease', maxHeight: this.state.open ? '0px' : '25px', overflow: 'hidden' }}>
                <FontAwesomeIcon icon={faArrowUp} fixedWidth />
              </div>
              <div style={{ transition: 'max-height 0.3s ease', maxHeight: this.state.open ? '25px' : '0px', overflow: 'hidden' }}>
                <FontAwesomeIcon icon={faArrowDown} fixedWidth />
              </div>
            </div>
          </div>
          <div className='react-appconsole-alertBarStack'>
            {
              Object.keys(this.state.alerts).sort((a, b) => ConsoleLog.compareLevel(this.state.alerts[a].level, this.state.alerts[b].level))
                .map((key) => {
                  let alert = this.state.alerts[key]
                  return <AlertBar key={alert.id} warning={alert.level === 'warning'} error={alert.level === 'error'}
                    message={ConsoleLog.stringify(alert.message)} actions={alert.actions} />
                })
            }
          </div>
        </div>
      </React.Fragment>
      , document.getElementById(this.props.wrapperId)
    )
  }

  raiseAlert = ({ logRef, id, level, actions, direction, ...message }) => {
    let alerts = this.state.alerts
    logRef.current.log({ level: level, direction: direction, raiseAlert: 'raise alert', ...message })
    alerts[id] = {
      id: id,
      level: level,
      actions: actions || [],
      direction: direction,
      message: message
    }
    this.setState({
      alerts: alerts
    })
    this.shakeBtn()
  }

  clearAlert = ({ logRef, id, ...message }) => {
    if (Object.keys(message).length > 0) {
      let alerts = this.state.alerts
      alerts[id] = {
        id: id,
        level: 'info',
        message: message
      }
      logRef.current.log({ level: 'info', clearAlert: 'clear alert', ...message })
      this.setState({
        alerts: alerts
      }, () => {
        setTimeout(() => {
          let alerts = this.state.alerts
          delete alerts[id]
          this.setState({
            alerts: alerts
          })
        }, 5000)
      })
      this.shakeBtn()
    } else {
      let alerts = this.state.alerts
      if (alerts[id]) {
        logRef.current.log({ level: 'info', clearAlert: 'clear alert', ...alerts[id].message })
        delete alerts[id]
        this.setState({
          alerts: alerts
        })
        this.shakeBtn()
      }
    }
  }

  addLog = ({ id, label, ref }) => {
    let logs = this.state.logs
    logs[id] = {
      id: id,
      label: label,
      ref: ref
    }
    this.setState({
      logs: logs
    })
  }

  removeLog = ({ id }) => {
    let logs = this.state.logs
    delete logs[id]
    this.setState({
      logs: logs
    })
  }

  logModified = ({ logId }) => {
    if (!this.state.open) {
      this.setState({
        selectedLog: Object.keys(this.state.logs).indexOf(logId)
      })
    }
    this.setState({
      [logId + 'Modified']: true
    })
  }

  toggle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  shakeBtn = () => {
    let btn = document.querySelector('.react-appconsole-appConsoleToggle')
    btn.classList.add('react-appconsole-shake')
    setTimeout(() => btn.classList.remove('react-appconsole-shake'), 300)
  }
}
