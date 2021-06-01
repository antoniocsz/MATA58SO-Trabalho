const ButtonComponent = ({ title, disabled, onClick }) => {
  return (
    <div className="col-xs-2">
      <button
        type="button"
        className="btn btn-primary"
        disabled={disabled}
        onClick={onClick}>
        {title}
      </button>
    </div>
  )
}

export default ButtonComponent
