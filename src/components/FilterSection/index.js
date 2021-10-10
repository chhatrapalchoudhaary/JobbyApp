import './index.css'

const FiltersSection = props => {
  const renderEachEmploymentType = () => {
    const {employmentTypesList} = props

    return employmentTypesList.map(eachType => {
      const {changeActiveEmploymentType} = props
      const isChecked = false
      const onChangeActiveEmploymentType = () =>
        changeActiveEmploymentType(eachType.employmentTypeId, !isChecked)

      return (
        <li className="section-view-menu-item" key={eachType.employmentId}>
          <input
            type="checkbox"
            id={eachType.label}
            onClick={onChangeActiveEmploymentType}
            checkedStatus={isChecked}
          />
          <label className="label" htmlFor={eachType.label}>
            {eachType.label}
          </label>
        </li>
      )
    })
  }

  const renderEachSalaryRange = () => {
    const {salaryRangesList} = props

    return salaryRangesList.map(eachRange => {
      const {changeActiveSalaryRange} = props
      const onChangeActiveSalaryRange = () =>
        changeActiveSalaryRange(eachRange.salaryRangeId)

      return (
        <li className="section-view-menu-item" key={eachRange.salaryRangeId}>
          <input
            type="radio"
            name="salary"
            id={eachRange.salaryRangeId}
            onClick={onChangeActiveSalaryRange}
          />
          <label className="label" htmlFor={eachRange.salaryRangeId}>
            {eachRange.label}
          </label>
        </li>
      )
    })
  }

  return (
    <div className="filter-section">
      <h1 className="section-view-heading">Type of Employment</h1>
      <ul className="filter-section-view-menu">{renderEachEmploymentType()}</ul>
      <hr className="h-line" />
      <h1 className="section-view-heading">Salary Range</h1>
      <ul className="filter-section-view-menu">{renderEachSalaryRange()}</ul>
    </div>
  )
}
export default FiltersSection
