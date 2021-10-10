import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {
  BsFillStarFill,
  BsFillBriefcaseFill,
  BsBoxArrowUpRight,
} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'
import SimilarJobDetails from '../SimilarJobDetails'

import './index.css'

const jobDetailsApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobData: [],
    apiStatus: jobDetailsApiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: jobDetailsApiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const data = fetchedData.job_details
      console.log(fetchedData)
      const updatedData = {
        companyLogoUrl: data.company_logo_url,
        employment: data.employment_type,
        id: data.id,
        jobDescription: data.job_description,
        title: data.title,
        packagePerAnnum: data.package_per_annum,
        rating: data.rating,
        location: data.location,
        skills: data.skills,
        lifeAtCompany: data.life_at_company,
        companyWebsiteUrl: data.company_website_url,
      }
      const updatedSimilarJobData = fetchedData.similar_jobs.map(each => ({
        id: each.id,
        title: each.title,
        companyLogoUrl: data.company_logo_url,
        employmentType: data.employment_type,
        jobDescription: data.job_description,
        rating: data.rating,
        location: data.location,
      }))
      this.setState({
        jobData: updatedData,
        similarJobData: updatedSimilarJobData,
        apiStatus: jobDetailsApiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: jobDetailsApiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="jobs-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    return (
      <div className="jobs-details-error-view-container">
        <img
          alt="failure view"
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          className="error-view-image"
        />
        <h1 className="product-not-found-heading">
          Oops! Something Went Wrong
        </h1>
        <p className="content">
          We cannot seem to find the page you are looking for
        </p>
        <Link to={`/jobs/${id}`}>
          <button type="button" className="button">
            Retry
          </button>
        </Link>
      </div>
    )
  }

  renderJobDetailsView = () => {
    const {jobData, similarJobData} = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
      lifeAtCompany,
      companyWebsiteUrl,
    } = jobData
    const skillsObj = skills

    return (
      <div className="job-details-success-view">
        <div className="job-details-container">
          <div className="company-logo-name">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="company-name-rating">
              <h1 className="company-name">{title}</h1>
              <div className="company-rating">
                <BsFillStarFill className="star-fill" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-employment-lpa">
            <div className="location-employment">
              <MdLocationOn className="icon" />
              <p className="icon-name content">{location}</p>
              <BsFillBriefcaseFill className="icon" />
              <p className="content">{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="h-line" />
          <div className="description-visit">
            <h1 className="content-heading">Description</h1>
            <a href={companyWebsiteUrl}>
              Visit <BsBoxArrowUpRight />
            </a>
          </div>

          <p className="content">{jobDescription}</p>
          <p className="content-heading">Skills</p>
          <ul className="skills-menu">
            {skillsObj.map(each => (
              <li className="skill-menu-item" key={each.name}>
                <img
                  src={each.image_url}
                  alt={each.name}
                  className="course-logo"
                />
                <p className="content">{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="content-heading">Life at Company</h1>
          <div className="life-at-company">
            <p className="content">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.image_url}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1 className="content-heading margin">Similar Jobs</h1>
        <ul className="similar-data-menu">
          {similarJobData.map(each => (
            <SimilarJobDetails key={each.id} details={each} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case jobDetailsApiStatusConstants.success:
        return this.renderJobDetailsView()
      case jobDetailsApiStatusConstants.failure:
        return this.renderFailureView()
      case jobDetailsApiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
