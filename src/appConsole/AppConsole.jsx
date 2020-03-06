import {
  faArrowDown, faArrowUp, faEllipsisH, faTrashAlt, faInfo, faBell, faBellSlash, faBullhorn,
  faExclamationTriangle, faTimesCircle, faTimes, faChevronLeft, faChevronRight, faCheckSquare
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
      working: false,
      consoleLogFilterError: true,
      consoleLogFilterSuccess: true,
      consoleLogFilterWarning: true,
      consoleLogFilterInfo: true,
      consoleLogFilterOut: true,
      consoleLogFilterIn: true,
      consoleLogFilterBell: true,
      consoleLogFilterNoBell: true,
      consoleLogFilterHorn: true,
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
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterSuccess' icon={faCheckSquare} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction}
                style={{ color: this.state.consoleLogFilterSuccess ? '#62ac00' : '#e0e0e0' }} />
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterWarning' icon={faExclamationTriangle} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction}
                style={{ color: this.state.consoleLogFilterWarning ? '#ffbf02' : '#e0e0e0' }} />
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterInfo' icon={faInfo} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction}
                style={{ color: this.state.consoleLogFilterInfo ? '#124191' : '#e0e0e0' }} />
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterOut' icon={faChevronLeft} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction}
                style={{ color: this.state.consoleLogFilterOut ? '#000' : '#e0e0e0' }} />
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterIn' icon={faChevronRight} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction}
                style={{ color: this.state.consoleLogFilterIn ? '#000' : '#e0e0e0' }} />
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterBell' icon={faBell} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction}
                style={{ color: this.state.consoleLogFilterBell ? '#000' : '#e0e0e0' }} />
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterNoBell' icon={faBellSlash} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction}
                style={{ color: this.state.consoleLogFilterNoBell ? '#000' : '#e0e0e0' }} />
              <FontAwesomeIcon id='react-appconsole-consoleLogFilterHorn' icon={faBullhorn} fixedWidth
                className='react-appconsole-consoleLogFilterItem' onClick={this.filterItemAction}
                style={{ color: this.state.consoleLogFilterHorn ? '#000' : '#e0e0e0' }} />
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
                  <ConsoleLog logId={log.id} ref={log.ref} logModified={this.logModified} open={this.state.open}
                    entryFilter={[
                      this.state.consoleLogFilterError && 'error',
                      this.state.consoleLogFilterSuccess && 'success',
                      this.state.consoleLogFilterWarning && 'warning',
                      this.state.consoleLogFilterInfo && 'info',
                      this.state.consoleLogFilterOut && 'out',
                      this.state.consoleLogFilterIn && 'in',
                      this.state.consoleLogFilterBell && 'bell',
                      this.state.consoleLogFilterNoBell && 'nobell',
                      this.state.consoleLogFilterHorn && 'horn'
                    ]} filterSearchText={this.state.consoleLogFilterSearchText}
                  />
                </TabPanel>
              )
            })}
          </Tabs>
        </div>
        <div className='react-appconsole-alertBarContainer'>
          <div className='react-appconsole-appConsoleToggle'>
            <div className='react-appconsole-alertBar'
              style={{ background: '#fff', cursor: 'pointer' }}
              onClick={this.toggle}
            >
              <div style={{ transition: 'max-height 0.3s ease', maxHeight: this.state.open === true ? '0px' : '25px', overflow: 'hidden' }}>
                {this.state.working
                  ? <FontAwesomeIcon icon={faArrowUp} fixedWidth
                    className='react-appconsole-working react-appconsole-appConsoleToggle-icon' />
                  : <FontAwesomeIcon icon={faArrowUp} fixedWidth className='react-appconsole-appConsoleToggle-icon' />
                }
              </div>
              <div style={{ transition: 'max-height 0.3s ease', maxHeight: this.state.open === true ? '25px' : '0px', overflow: 'hidden' }}>
                <FontAwesomeIcon icon={faArrowDown} fixedWidth className='react-appconsole-appConsoleToggle-icon' />
              </div>
            </div>
          </div>
          <div className='react-appconsole-alertBarStack'>
            {
              Object.keys(this.alerts).sort((a, b) => ConsoleLog.compareLevel(this.alerts[a].level, this.alerts[b].level))
                .map((key) => {
                  let alert = this.alerts[key]
                  return <AlertBar key={alert.id} error={alert.level === 'error'} success={alert.level === 'success'}
                    warning={alert.level === 'warning'} message={ConsoleLog.stringify(alert.message)}
                    actions={alert.actions} timeout={alert.timeout} />
                })
            }
          </div>
        </div>
      </React.Fragment>
      , document.getElementById(this.props.wrapperId)
    )
  }

  announce = ({ logRef, id, level, actions, timeout, message }) => {
    return new Promise((resolve) => {
      let computedTimeout = timeout === 0
        ? undefined
        : timeout || 5
      this.alerts[id] = {
        id: id,
        level: level || 'info',
        actions: actions || [],
        direction: computedTimeout ? 'horn' : 'bell',
        message: message || id,
        timeout: computedTimeout
      }
      logRef.current.log({
        level: level || 'info',
        direction: computedTimeout ? 'horn' : 'bell',
        message: message || id
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

  raiseAlert = ({ logRef, id, level, actions, message }) => {
    this.announce({
      logRef: logRef,
      id: id,
      level: level,
      actions: actions,
      timeout: 0,
      message: message
    })
  }

  clearAlert = ({ logRef, id, level, actions, message }) => {
    return new Promise((resolve) => {
      let alert = this.alerts[id]
      if (alert) {
        let computedTimeout = message ? 5 : 2
        this.alerts[id] = {
          id: id,
          level: level || alert.level,
          actions: actions || alert.actions,
          direction: 'nobell',
          message: message || alert.message,
          timeout: computedTimeout
        }
        this.forceUpdate(resolve)
        logRef.current.log({
          level: 'info',
          direction: 'nobell',
          message: message || alert.message
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

  working = ({ working }) => {
    this.setState({
      working: working
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
    if (this.state.open && this.state.selectedLog === logId) {
      this.logs[logId].ref.current.forceUpdate()
    }
  }

  toggle = () => {
    if (this.state.open === true) {
      this.setState({
        open: 'closing'
      }, () => setTimeout(() => this.setState({ open: false }), 300))
    } else {
      this.setState({
        open: true,
        [this.state.selectedLog + 'Modified']: false
      })
    }
  }

  shakeBtn = () => {
    // let btn = document.querySelector('.react-appconsole-appConsoleToggle')
    // btn.classList.add('react-appconsole-shake')
    // setTimeout(() => btn.classList.remove('react-appconsole-shake'), 300)
  }

  filterItemAction = (event) => {
    switch (event.currentTarget.id) {
      case 'react-appconsole-consoleLogFilterThrash':
        this.logs[this.state.selectedLog].ref.current.clear()
        break
      case 'react-appconsole-consoleLogFilterError':
        this.setState({
          consoleLogFilterError: !this.state.consoleLogFilterError
        })
        break
      case 'react-appconsole-consoleLogFilterSuccess':
        this.setState({
          consoleLogFilterSuccess: !this.state.consoleLogFilterSuccess
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
      case 'react-appconsole-consoleLogFilterBell':
        this.setState({
          consoleLogFilterBell: !this.state.consoleLogFilterBell
        })
        break
      case 'react-appconsole-consoleLogFilterNoBell':
        this.setState({
          consoleLogFilterNoBell: !this.state.consoleLogFilterNoBell
        })
        break
      case 'react-appconsole-consoleLogFilterHorn':
        this.setState({
          consoleLogFilterHorn: !this.state.consoleLogFilterHorn
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
