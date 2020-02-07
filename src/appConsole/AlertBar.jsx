import React from 'react'
import PropTypes from 'prop-types'
import './AlertBar.css'

export default class AlertBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      opacity: 1
    }
  }

  static propTypes = {
    error: PropTypes.bool,
    warning: PropTypes.bool,
    message: PropTypes.string,
    actions: PropTypes.array,
    timeout: PropTypes.number
  }

  componentDidMount = () => {
    this.setState({
      opacity: 0
    })
  }

  render = () => {
    let background = this.props.error ? '#d9070a' : this.props.warning ? '#ffbf02' : '#124191'
    let color = this.props.error ? '#fff' : this.props.warning ? '#000' : '#fff'
    let computedTimeout = this.props.timeout ? this.props.timeout - 1.5 : undefined
    let fadeout = computedTimeout ? {
      transition: 'opacity 1s ease-in ' + computedTimeout + 's',
      opacity: this.state.opacity
    } : {
      opacity: 1
    }
    let zIndex = this.props.error ? 2 : this.props.warning ? 1 : 0
    return (
      <div className='react-appconsole-alertBar' style={{ background: background, color: color, zIndex: zIndex, ...fadeout }}>
        <span>{this.props.message}</span>
        {this.props.actions ? <div className='react-appconsole-alertBarActions'>
          {this.props.actions.map((action) =>
            <div className='react-appconsole-alertBarAction' key={action.label} onClick={action.action}>
              {action.label}
            </div>)}
        </div>
          : null
        }
      </div>
    )
  }
}
