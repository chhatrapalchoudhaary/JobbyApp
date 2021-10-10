import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Home = props => {
  const findJobButtonClicked = () => {}

  return (
    <div className="app-container">
      <Header />
      <div className="container">
        <div className="text-area">
          <h1 className="title">Find the Job That Fits Your Life</h1>
          <p className="description">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <div>
              <button type="button" className="find-job-button">
                Find Jobs
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
