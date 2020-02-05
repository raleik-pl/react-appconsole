import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faExclamationTriangle, faTimesCircle, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

export default class ConsoleLog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      entries: []
    }
  }

  static propTypes = {
    logId: PropTypes.string.isRequired,
    logModified: PropTypes.func
  }

  static LogEntry = (props) => {
    return (
      <div className='react-appconsole-consoleEntry' style={{
        backgroundColor: props.level === 'error' ? '#d9070a08' : props.level === 'warning' ? '#ffbf0208' : null
      }}>
        <div className='react-appconsole-consoleEntryPart react-appconsole-consoleEntryTimestamp'>{props.timestamp}</div>
        <div className='react-appconsole-consoleEntryPart react-appconsole-consoleEntryLevelDirection'>
          {
            props.level === 'error' ? <FontAwesomeIcon icon={faTimesCircle} fixedWidth color='#d9070a' />
              : props.level === 'warning' ? <FontAwesomeIcon icon={faExclamationTriangle} fixedWidth color='#ffbf02' />
                : <FontAwesomeIcon icon={faInfo} fixedWidth color='#124191' />
          }
          {
            props.direction === 'out' ? <FontAwesomeIcon icon={faChevronLeft} fixedWidth />
              : <FontAwesomeIcon icon={faChevronRight} fixedWidth />
          }
        </div>
        <div className='react-appconsole-consoleEntryPart react-appconsole-consoleEntryMessage'>{props.message}</div>
      </div >
    )
  }

  static stringify = (messageObject) => {
    return Object.keys(messageObject).map((key) => {
      let value = messageObject[key]
      return (value instanceof String) || (typeof value === 'string') ? value : JSON.stringify(value, null, 2)
    }).join(' : ')
  }

  static compareLevel = (a, b) => {
    return ConsoleLog.levelNum(b) - ConsoleLog.levelNum(a)
  }

  static levelNum = (level) => {
    var ret
    switch (level) {
      case 'error':
        ret = 0
        break
      case 'warning':
        ret = 1
        break
      case 'info':
        ret = 2
        break
      default:
        ret = 3
    }
    return ret
  }

  componentDidUpdate = () => {
    var elem = document.getElementById(this.props.logId)
    if (this.autoscroll) {
      elem.scrollTop = elem.scrollHeight
    }
  }

  render = () => {
    var elem = document.getElementById(this.props.logId)
    if (elem) {
      this.autoscroll = elem.offsetHeight + elem.scrollTop >= elem.scrollHeight
    }
    return (
      <div className='react-appconsole-consoleLogContainer'>
        <div className='react-appconsole-consoleLogContent' id={this.props.logId}>
          {this.state.entries.map((entry) => <ConsoleLog.LogEntry key={entry.timestamp} timestamp={entry.timestamp}
            level={entry.level} direction={entry.direction} message={entry.message} />)}
        </div>
      </div>
    )
  }

  log = ({ level, direction, ...message }) => {
    let entries = this.state.entries
    let date = new Date()
    let milis = String(date.getMilliseconds()).padStart(3, '0')
    entries.push({
      timestamp: date.toLocaleTimeString(
        [],
        { hour: '2-digit', minute: '2-digit', second: '2-digit' }
      ) + '.' + milis,
      level: level,
      direction: direction,
      message: ConsoleLog.stringify(message)
    })
    this.setState({
      entries: entries
    })
    this.props.logModified({logId: this.props.logId})
  }

  info = ({ direction, ...message }) => {
    this.log({ level: 'info', direction: direction, ...message })
  }

  warn = ({ direction, ...message }) => {
    this.log({ level: 'warning', direction: direction, ...message })
  }

  err = ({ direction, ...message }) => {
    this.log({ level: 'error', direction: direction, ...message })
  }
}
