const CheckedButtonComponent = ({ title, active, onClick }) => {
  const classButton = active ? 'btn btn-primary' : 'btn btn-secondary'

  return (
    <div className="col-sm-2" style={{ margin: 5 }}>
      <button
        type="button"
        className={classButton}
        style={{ width: 150, height: 150 }}
        onClick={onClick}>
        {title}
      </button>
    </div>
  )
}

export default CheckedButtonComponent
