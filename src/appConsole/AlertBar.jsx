import React from 'react'
import PropTypes from 'prop-types'
import './AlertBar.css'

export default class AlertBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      opacity: 1,
      grow: true
    }
  }

  static propTypes = {
    error: PropTypes.bool,
    success: PropTypes.bool,
    warning: PropTypes.bool,
    message: PropTypes.string,
    actions: PropTypes.array,
    timeout: PropTypes.number
  }

  componentDidMount = () => {
    this.setState({
      opacity: 0
    })
    setTimeout(() => this.setState({ grow: false }), 300)
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.error !== prevProps.error ||
      this.props.success !== prevProps.success ||
      this.props.warning !== prevProps.warning ||
      this.props.message !== prevProps.message ||
      this.props.actions !== prevProps.actions ||
      this.props.timeout !== prevProps.timeout
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ grow: true }, () => setTimeout(() => this.setState({ grow: false }), 300))
    }
  }

  render = () => {
    let background = this.props.error
      ? '#d9070a'
      : this.props.success
        ? '#62ac00'
        : this.props.warning
          ? '#ffbf02'
          : '#124191'
    let color = this.props.warning
      ? '#000'
      : '#fff'
    let computedTimeout = this.props.timeout - 1.5 || undefined
    let fadeout = computedTimeout ? {
      transition: 'opacity 1s ease-in ' + computedTimeout + 's',
      opacity: this.state.opacity
    } : {
      opacity: 1
    }
    let zIndex = this.props.error
      ? 4
      : this.props.success
        ? 3
        : this.props.warning
          ? 2
          : 1
    return (
      <div className='react-appconsole-alertBar' style={{ background: background, color: color, zIndex: zIndex, ...fadeout }}>
        <div style={{ display: 'inline-block' }} className={this.state.grow ? 'react-appconsole-grow' : ''}>
          {this.props.message}
        </div>
        {this.props.actions
          ? <div className='react-appconsole-alertBarActions'>
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
