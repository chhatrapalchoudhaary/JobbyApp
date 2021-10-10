import {Component} from 'react'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'

const profileApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProfileView extends Component {
  state = {
    profileApiStatus: profileApiStatusConstants.initial,
    profileDetails: '',
  }

  componentDidMount() {
    this.getProfileUrl()
  }

  getProfileUrl = async () => {
    this.setState({profileApiStatus: profileApiStatusConstants.inProgress})
    const token = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)

    if (response.ok) {
      const data = await response.json()
      const updatedProfileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileApiStatus: profileApiStatusConstants.success,
        profileDetails: updatedProfileData,
      })
    } else {
      this.setState({profileApiStatus: profileApiStatusConstants.failure})
    }
  }

  renderProfileView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-bg-view">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  onClickProfileRetryButton = () => {
    this.getProfileUrl()
  }

  renderFailureView = () => (
    <div className="retry-view">
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickProfileRetryButton}
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

  renderOutputForApiStatus = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case profileApiStatusConstants.success:
        return this.renderProfileView()
      case profileApiStatusConstants.failure:
        return this.renderFailureView()
      case profileApiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderOutputForApiStatus()}</div>
  }
}
export default ProfileView
