import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookie from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    anyError: false,
    errorMsg: '',
  }

  submitSuccess = jwtToken => {
    const {history} = this.props
    Cookie.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  submitFailure = errorMessage => {
    this.setState({errorMsg: errorMessage, anyError: true})
  }

  onSubmitForm = async event => {
    const {username, password} = this.state
    const userDetails = {username, password}
    event.preventDefault()
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderPasswordField = () => {
    const {password} = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  render() {
    const {username, password, anyError, errorMsg} = this.state
    const jwtToken = Cookie.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-app-container">
        <div className="login-container">
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
              alt="website logo"
              className="logo-login"
            />
            <div className="input-container">{this.renderUsernameField()}</div>

            <div className="input-container">{this.renderPasswordField()}</div>
            <button type="submit" className="login-button">
              Login
            </button>
            {anyError && <p className="error-message">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
