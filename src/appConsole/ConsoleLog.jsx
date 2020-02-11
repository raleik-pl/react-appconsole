import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faExclamationTriangle, faTimesCircle, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

export default class ConsoleLog extends React.Component {
  constructor(props) {
    super(props)
    this.entries = []
    this.cntr = 999;
  }

  static propTypes = {
    logId: PropTypes.string.isRequired,
    logModified: PropTypes.func,
    entryFilter: PropTypes.array.isRequired,
    filterSearchText: PropTypes.string
  }

  static LogEntry = (props) => {
    return props.entryFilter.includes(props.level) && props.entryFilter.includes(props.direction) &&
      (props.message.includes(props.filterSearchText || '') || props.timestamp.includes(props.filterSearchText || ''))
      ? (
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
      : null
  }

  static stringify = (message) => {
    return message instanceof String || typeof message === 'string'
      ? message
      : message.map((value) => {
        return (value instanceof String) || (typeof value === 'string') ? value : JSON.stringify(value, null, 2)
      }).join(' : ')
  }

  static compareLevel = (a, b) => {
    return ConsoleLog.levelNum(b) - ConsoleLog.levelNum(a)
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
          {this.entries.sort((a, b) => a.timestampMicros - b.timestampMicros)
            .map((entry) => <ConsoleLog.LogEntry key={entry.timestampMicros} timestamp={ConsoleLog.timestampStr(entry.timestampMicros)}
              level={entry.level} direction={entry.direction} message={ConsoleLog.stringify(entry.message)}
              entryFilter={this.props.entryFilter} filterSearchText={this.props.filterSearchText} />)}
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
      resolve()
    })
  }

  info = ({ direction, timestampMicros, message }) => {
    return this.log({ level: 'info', direction: direction, timestampMicros: timestampMicros, message: message })
  }

  warn = ({ direction, timestampMicros, message }) => {
    return this.log({ level: 'warning', direction: direction, timestampMicros: timestampMicros, message: message })
  }

  err = ({ direction, timestampMicros, message }) => {
    return this.log({ level: 'error', direction: direction, timestampMicros: timestampMicros, message: message })
  }
  
  counter = () => {
    this.cntr = ++this.cntr > 999 ? 0 : this.cntr
    return this.cntr
  }
}
