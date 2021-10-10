import {Link, withRouter} from 'react-router-dom'
import Cookie from 'js-cookie'
import './index.css'

const Header = props => {
  const logoutClicked = () => {
    const {history} = props
    Cookie.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="nav-container">
      <div className="nav-bar">
        <div className="logo-section">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
              alt="website logo"
              className="logo"
            />
          </Link>
        </div>
        <ul className="nav">
          <Link to="/" className="link-style">
            <li className="link">Home</li>
          </Link>

          <li className="link">
            <Link to="/jobs" className="link-style">
              Jobs
            </Link>
          </li>

          <li className="link">
            <button
              type="button"
              className="logout-button"
              onClick={logoutClicked}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default withRouter(Header)
