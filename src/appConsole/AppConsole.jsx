import {
  faArrowDown, faArrowUp, faEllipsisH, faTrashAlt, faInfo,
  faExclamationTriangle, faTimesCircle, faTimes, faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons'
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
      consoleLogFilterError: true,
      consoleLogFilterWarning: true,
      consoleLogFilterInfo: true,
      consoleLogFilterOut: true,
      consoleLogFilterIn: true,
      consoleLogFilterSearchText: ''
    }
    this.alerts = {}
    this.logs = {}
  }

  static propTypes = {
    wrapperId: PropTypes.string.isRequired
  }

  render = () => {
    let wrapper = document.getElementById(this.props.wrapperId)
    wrapper.classList.add('react-appconsole-container')
    if (this.state.open) {
      wrapper.classList.add('react-appconsole-container-open')
      if (this.state.open === 'closing') {
        wrapper.classList.add('react-appconsole-container-closing')
      }
    } else {
      wrapper.classList.remove('react-appconsole-container-open')
      wrapper.classList.remove('react-appconsole-container-closing')
    }
    return ReactDOM.createPortal(
      <React.Fragment>
        <div className={this.state.open === true ? 'react-appconsole-tabbedConsole react-appconsole-tabbedConsole-open' : 'react-appconsole-tabbedConsole'}
          style={{ display: this.state.open ? 'block' : 'none' }}>
          <Tabs forceRenderTabPanel selectedIndex={Object.keys(this.logs).indexOf(this.state.selectedLog) >= 0 ? Object.keys(this.logs).indexOf(this.state.selectedLog) : 0}
            onSelect={(index) => {
              this.setState({
                selectedLog: Object.keys(this.logs)[index],
                [Object.keys(this.logs)[index] + 'Modified']: false
              })
            }}
            selectedTabClassName='react-appconsole-consoleLogTabActive'
            selectedTabPanelClassName='react-appconsole-consoleLogTabPanelActive'
          >
            <TabList className='react-appconsole-consoleLogTabsList'>
              {Object.keys(this.logs).map((key) => {
                return (
                  <Tab key={key} className={'react-appconsole-consoleLogTab'}>
                    {
                      this.state[key + 'Modified'] ? <div className='react-appconsole-consoleLogTabModified'>
                        <FontAwesomeIcon icon={faEllipsisH} fixedWidth />
                      </div> : null
                    }
                    <div>{this.logs[key].label}</div>
                  </Tab>
                )
              })}
            </TabList>
            <div className='react-appconsole-consoleLogFilter'>
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterThrash' icon={faTrashAlt} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction} />
              <div className='react-appconsole-consoleLogFilterItem spacer'>|</div>
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterError' icon={faTimesCircle} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction}
                style={{ color: this.state.consoleLogFilterError ? '#d9070a' : '#e0e0e0' }} />
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterWarning' icon={faExclamationTriangle} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction}
                style={{ color: this.state.consoleLogFilterWarning ? '#ffbf02' : '#e0e0e0' }} />
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterInfo' icon={faInfo} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction}
                style={{ color: this.state.consoleLogFilterInfo ? '#124191' : '#e0e0e0' }} />
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterOut' icon={faChevronLeft} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction}
                style={{ color: this.state.consoleLogFilterOut ? '#124191' : '#e0e0e0' }} />
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterIn' icon={faChevronRight} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction}
                style={{ color: this.state.consoleLogFilterIn ? '#124191' : '#e0e0e0' }} />
              <input type='search' id='react-appconsole-consoleLogFilterSearchText' placeholder='Filter output'
                className='react-appconsole-consoleLogFilterItem react-appconsole-consoleLogFilterSearchText'
                onChange={this.filterItemAction} value={this.state.consoleLogFilterSearchText} />
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterSearchReset' icon={faTimes} fixedWidth
                className='react-appconsole-consoleLogFilterItem react-appconsole-consoleLogFilterSearchReset'
                onClick={this.filterItemAction} style={{ color: this.state.consoleLogFilterSearchText.length > 0 ? '#000' : '#e0e0e0' }} />
            </div>
            {Object.keys(this.logs).map((key) => {
              let log = this.logs[key]
              return (
                <TabPanel key={log.id} className='react-appconsole-consoleLogTabPanel'>
                  <ConsoleLog logId={log.id} ref={log.ref} logModified={this.logModified}
                    entryFilter={[
                      this.state.consoleLogFilterError && 'error',
                      this.state.consoleLogFilterWarning && 'warning',
                      this.state.consoleLogFilterInfo && 'info',
                      this.state.consoleLogFilterOut && 'out',
                      this.state.consoleLogFilterIn && 'in'
                    ]} filterSearchText={this.state.consoleLogFilterSearchText} />
                </TabPanel>
              )
            })}
          </Tabs>
        </div>
        <div className='react-appconsole-alertBarContainer'>
          <div className='react-appconsole-appConsoleToggle'>
            <div className='react-appconsole-alertBar' style={{ background: '#fff', cursor: 'pointer' }} onClick={this.toggle}>
              <div style={{ transition: 'max-height 0.3s ease', maxHeight: this.state.open === true ? '0px' : '25px', overflow: 'hidden' }}>
                <FontAwesomeIcon icon={faArrowUp} fixedWidth />
              </div>
              <div style={{ transition: 'max-height 0.3s ease', maxHeight: this.state.open === true ? '25px' : '0px', overflow: 'hidden' }}>
                <FontAwesomeIcon icon={faArrowDown} fixedWidth />
              </div>
            </div>
          </div>
          <div className='react-appconsole-alertBarStack'>
            {
              Object.keys(this.alerts).sort((a, b) => ConsoleLog.compareLevel(this.alerts[a].level, this.alerts[b].level))
                .map((key) => {
                  let alert = this.alerts[key]
                  return <AlertBar key={alert.id} warning={alert.level === 'warning'} error={alert.level === 'error'}
                    message={ConsoleLog.stringify(alert.message)} actions={alert.actions} timeout={alert.timeout} />
                })
            }
          </div>
        </div>
      </React.Fragment>
      , document.getElementById(this.props.wrapperId)
    )
  }

  raiseAlert = ({ logRef, id, level, actions, direction, timeout, message }) => {
    return new Promise((resolve) => {
      let computedTimeout = (level === 'info' ? timeout || 5 : timeout)
      console.log(computedTimeout)
      this.alerts[id] = {
        id: id,
        level: level || 'warning',
        actions: actions || [],
        direction: direction || 'in',
        message: message || id,
        timeout: computedTimeout
      }
      logRef.current.log({
        level: level || 'warning',
        direction: direction || 'in',
        message: [computedTimeout ? 'raise alert for ' + computedTimeout + 's' : 'raise alert'].concat(message || id)
      })
      this.shakeBtn()
      this.forceUpdate(resolve)
      if (computedTimeout) {
        setTimeout(() => {
          delete this.alerts[id]
          this.forceUpdate()
        }, computedTimeout * 1000)
      }
    })
  }

  clearAlert = ({ logRef, id, level, actions, direction, timeout, message }) => {
    return new Promise((resolve) => {
      let alert = this.alerts[id]
      if (alert) {
        let computedTimeout = timeout || (message ? 5 : 2)
        this.alerts[id] = {
          id: id,
          level: level || alert.level,
          actions: actions || alert.actions,
          direction: direction || alert.direction,
          message: message || alert.message,
          timeout: computedTimeout
        }
        this.forceUpdate(resolve)
        logRef.current.log({
          level: 'info',
          direction: direction || alert.direction,
          message: ['clear alert'].concat(message || alert.message)
        })
        setTimeout(() => {
          delete this.alerts[id]
          this.forceUpdate()
        }, computedTimeout * 1000)
        this.shakeBtn()
      }
    })
  }

  addLog = ({ id, label, ref }) => {
    return new Promise((resolve) => {
      this.logs[id] = {
        id: id,
        label: label,
        ref: ref
      }
      this.forceUpdate(resolve)
    })
  }

  removeLog = ({ id }) => {
    return new Promise((resolve) => {
      delete this.logs[id]
      this.forceUpdate(resolve)
    })
  }

  logModified = ({ logId, reset }) => {
    let state
    if (!this.state.open && (logId !== this.state.selectedLog)) {
      state = {
        selectedLog: logId
      }
    }
    if (!this.state[logId + 'Modified'] || reset) {
      state = {
        ...state,
        [logId + 'Modified']: !reset
      }
    }
    if (state) {
      this.setState(state)
    }
  }

  toggle = () => {
    if (this.state.open === true) {
      this.setState({
        open: 'closing'
      }, () => setTimeout(() => this.setState({ open: false }), 300))
    } else {
      this.setState({ open: true })
    }
  }

  shakeBtn = () => {
    let btn = document.querySelector('.react-appconsole-appConsoleToggle')
    btn.classList.add('react-appconsole-shake')
    setTimeout(() => btn.classList.remove('react-appconsole-shake'), 300)
  }

  filterItemAction = (event) => {
    switch (event.currentTarget.id) {
      case 'react-appconsole-consoleLogFilterThrash':
        let logRef = this.logs[this.state.selectedLog].ref
        logRef.current.entries = []
        this.logModified({ logId: this.logs[this.state.selectedLog].id, reset: true })
        logRef.current.forceUpdate()
        break
      case 'react-appconsole-consoleLogFilterError':
        this.setState({
          consoleLogFilterError: !this.state.consoleLogFilterError
        })
        break
      case 'react-appconsole-consoleLogFilterWarning':
        this.setState({
          consoleLogFilterWarning: !this.state.consoleLogFilterWarning
        })
        break
      case 'react-appconsole-consoleLogFilterInfo':
        this.setState({
          consoleLogFilterInfo: !this.state.consoleLogFilterInfo
        })
        break
      case 'react-appconsole-consoleLogFilterOut':
        this.setState({
          consoleLogFilterOut: !this.state.consoleLogFilterOut
        })
        break
      case 'react-appconsole-consoleLogFilterIn':
        this.setState({
          consoleLogFilterIn: !this.state.consoleLogFilterIn
        })
        break
      case 'react-appconsole-consoleLogFilterSearchText':
        this.setState({
          consoleLogFilterSearchText: event.currentTarget.value
        })
        break
      case 'react-appconsole-consoleLogFilterSearchReset':
        this.setState({
          consoleLogFilterSearchText: ''
        })
        break
    }
  }
}
