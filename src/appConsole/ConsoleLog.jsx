import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faExclamationTriangle, faTimesCircle, faChevronRight, faChevronLeft, faBell, faBellSlash, faBullhorn, faCheckSquare } from '@fortawesome/free-solid-svg-icons'

export default class ConsoleLog extends React.Component {
  constructor (props) {
    super(props)
    this.entries = []
    this.cntr = 999
  }

  static propTypes = {
    logId: PropTypes.string.isRequired,
    logModified: PropTypes.func,
    entryFilter: PropTypes.array.isRequired,
    filterSearchText: PropTypes.string,
    open: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
  }

  static LogEntry = (props) => {
    return props.entryFilter.includes(props.level) && props.entryFilter.includes(props.direction) &&
      (props.message.toLowerCase().includes(props.filterSearchText.toLowerCase() || '') ||
        props.timestamp.includes(props.filterSearchText || ''))
      ? (
        <div className='react-appconsole-consoleEntry' style={{
          backgroundColor: props.level === 'error'
            ? '#d9070a08'
            : props.level === 'success'
              ? '#62ac0008'
              : props.level === 'warning'
                ? '#ffbf0208'
                : null
        }}>
          <div className='react-appconsole-consoleEntryPart react-appconsole-consoleEntryTimestamp'>{props.timestamp}</div>
          <div className='react-appconsole-consoleEntryPart react-appconsole-consoleEntryLevelDirection'>
            {props.level === 'error'
              ? <FontAwesomeIcon icon={faTimesCircle} fixedWidth color='#d9070a' />
              : props.level === 'success'
                ? <FontAwesomeIcon icon={faCheckSquare} fixedWidth color='#62ac00' />
                : props.level === 'warning'
                  ? <FontAwesomeIcon icon={faExclamationTriangle} fixedWidth color='#ffbf02' />
                  : <FontAwesomeIcon icon={faInfo} fixedWidth color='#124191' />

            }
            {props.direction === 'out'
              ? <FontAwesomeIcon icon={faChevronLeft} fixedWidth />
              : props.direction === 'in'
                ? <FontAwesomeIcon icon={faChevronRight} fixedWidth />
                : props.direction === 'bell'
                  ? <FontAwesomeIcon icon={faBell} fixedWidth />
                  : props.direction === 'nobell'
                    ? <FontAwesomeIcon icon={faBellSlash} fixedWidth />
                    : <FontAwesomeIcon icon={faBullhorn} fixedWidth />
            }
          </div>
          <div className='react-appconsole-consoleEntryPart react-appconsole-consoleEntryMessage'>{props.message}</div>
        </div >
      )
      : null
  }

  static stringify = (message) => {
    return message instanceof String || typeof message === 'string'
      ? message
      : message.map((value) => {
        return (value instanceof String) || (typeof value === 'string') ? value : JSON.stringify(value, null, 2)
      }).join(' • ')
  }

  static compareLevel = (a, b) => {
    return ConsoleLog.levelNum(a) - ConsoleLog.levelNum(b)
  }

  static timestampStr = (timestampMicros) => {
    let date = new Date(timestampMicros / 1000)
    let milis = String(date.getMilliseconds()).padStart(3, '0')
    return date.toLocaleTimeString(
      [],
      { hour: '2-digit', minute: '2-digit', second: '2-digit' }
    ) + '.' + milis
  }

  static levelNum = (level) => {
    var ret
    switch (level) {
      case 'error':
        ret = 4
        break
      case 'success':
        ret = 3
        break
      case 'warning':
        ret = 2
        break
      case 'info':
        ret = 1
        break
      default:
        ret = 0
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
          {this.props.open ? this.entries.map((entry) => <ConsoleLog.LogEntry key={entry.timestampMicros}
            timestamp={ConsoleLog.timestampStr(entry.timestampMicros)} level={entry.level}
            direction={entry.direction} message={ConsoleLog.stringify(entry.message)}
            entryFilter={this.props.entryFilter} filterSearchText={this.props.filterSearchText} />)
            : null}
        </div>
      </div>
    )
  }

  log = ({ level, direction, timestampMicros, message }) => {
    return new Promise((resolve) => {
      this.entries.push({
        timestampMicros: timestampMicros || (Date.now() * 1000 + this.counter()),
        level: level || 'info',
        direction: direction || 'in',
        message: message
      })
      this.props.logModified({ logId: this.props.logId })
      this.growBtn()
      resolve()
    })
  }

  info = ({ direction, timestampMicros, message }) => {
    return this.log({ level: 'info', direction: direction, timestampMicros: timestampMicros, message: message })
  }

  warn = ({ direction, timestampMicros, message }) => {
    return this.log({ level: 'warning', direction: direction, timestampMicros: timestampMicros, message: message })
  }

  success = ({ direction, timestampMicros, message }) => {
    return this.log({ level: 'success', direction: direction, timestampMicros: timestampMicros, message: message })
  }

  err = ({ direction, timestampMicros, message }) => {
    return this.log({ level: 'error', direction: direction, timestampMicros: timestampMicros, message: message })
  }

  clear = () => {
    this.entries = []
    this.props.logModified({ logId: this.props.logId, reset: true })
    this.forceUpdate()
  }

  counter = () => {
    this.cntr = ++this.cntr > 999 ? 0 : this.cntr
    return this.cntr
  }

  growBtn = () => {
    let btn = document.querySelector('.react-appconsole-appConsoleToggle-icon')
    btn.classList.add('react-appconsole-grow')
    setTimeout(() => btn.classList.remove('react-appconsole-grow'), 300)
  }
}
