import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import ProfileView from '../ProfileView'
import FiltersSection from '../FilterSection'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const jobsApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  noJobs: 'NO_JOBS',
}

class JobsRoute extends Component {
  state = {
    jobsList: [],
    jobsApiStatus: jobsApiStatusConstants.initial,
    searchInput: '',
    activeEmploymentType: '',
    activeSalaryRange: '',
    activeEmploymentList: [],
  }

  componentDidMount() {
    this.getAllJobsList()
  }

  getAllJobsList = async () => {
    this.setState({jobsApiStatus: jobsApiStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const {searchInput, activeEmploymentType, activeSalaryRange} = this.state
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentType}&minimum_package=${activeSalaryRange}&search=${searchInput}`
    const response = await fetch(jobsApiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const updatedJobsListData = data.jobs.map(eachJobDetails => ({
        companyLogoUrl: eachJobDetails.company_logo_url,
        employmentType: eachJobDetails.employment_type,
        id: eachJobDetails.id,
        jobDescription: eachJobDetails.job_description,
        location: eachJobDetails.location,
        packagePerAnnum: eachJobDetails.package_per_annum,
        rating: eachJobDetails.rating,
        title: eachJobDetails.title,
      }))
      if (updatedJobsListData.length > 0) {
        this.setState({
          jobsApiStatus: jobsApiStatusConstants.success,
          jobsList: updatedJobsListData,
        })
      } else {
        this.setState({jobsApiStatus: jobsApiStatusConstants.noJobs})
      }
    } else {
      this.setState({jobsApiStatus: jobsApiStatusConstants.failure})
    }
  }

  renderJobsListView = () => {
    const {jobsList} = this.state
    return jobsList.map(eachJob => (
      <JobCard key={eachJob.id} jobInfo={eachJob} />
    ))
  }

  onClickJobsRetryButton = () => {
    this.getAllJobsList()
  }

  renderJobsFailureView = () => (
    <div className="failure-section-with-image">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-message">Oops! Something Went Wrong</h1>
      <p className="failure-info">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickJobsRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderNoJobsFound = () => (
    <div className="failure-section-with-image">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="failure-image"
      />
      <h1 className="failure-message">No Jobs Found</h1>
      <p className="failure-info">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderOutputForJobsApiStatus = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case jobsApiStatusConstants.success:
        return this.renderJobsListView()
      case jobsApiStatusConstants.failure:
        return this.renderJobsFailureView()
      case jobsApiStatusConstants.inProgress:
        return this.renderLoadingView()
      case jobsApiStatusConstants.noJobs:
        return this.renderNoJobsFound()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value}, this.getAllJobsList)
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getAllJobsList()
    }
  }

  changeActiveEmploymentType = (employmentTypeId, checkedStatus) => {
    const {activeEmploymentList} = this.state
    if (checkedStatus === true) {
      activeEmploymentList.push(employmentTypeId)
      this.setState(
        {activeEmploymentType: activeEmploymentList.join(',')},
        this.getAllJobsList,
      )
    } else {
      activeEmploymentList.remove(employmentTypeId)
      this.setState(
        {activeEmploymentType: activeEmploymentList.join(',')},
        this.getAllJobsList,
      )
    }
  }

  changeActiveSalaryRange = activeSalaryRange => {
    this.setState({activeSalaryRange}, this.getAllJobsList)
  }

  render() {
    const {searchInput, activeEmploymentType, activeSalaryRange} = this.state

    return (
      <div className="all-jobs-container">
        <Header />
        <div className="filters-jobs-list-section">
          <div className="filters-section">
            <ProfileView />
            <hr className="h-line" />
            <FiltersSection
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeActiveEmploymentType={this.changeActiveEmploymentType}
              changeActiveSalaryRange={this.changeActiveSalaryRange}
              activeEmploymentType={activeEmploymentType}
              activeSalaryRange={activeSalaryRange}
            />
          </div>
          <div className="jobs-list-section">
            <div className="search-input-container">
              <input
                value={searchInput}
                type="search"
                className="search-input"
                placeholder="Search"
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                type="button"
                testid="searchButton"
                className="search-button"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>

            <ul className="jobs-list-menu">
              {this.renderOutputForJobsApiStatus()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
export default JobsRoute
