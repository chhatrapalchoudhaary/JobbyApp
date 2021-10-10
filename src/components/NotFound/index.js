import Header from '../Header'
import './index.css'

const NotFound = () => (
  <>
    <Header />
    <div className="login-app-container">
      <div className="not-found-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
          alt="not found"
          className="not-found-img"
        />
        <h1 className="not-found-error">Page Not Found</h1>
        <p className="description">
          we’re sorry, the page you requested could not be found
        </p>
      </div>
    </div>
  </>
)

export default NotFound
