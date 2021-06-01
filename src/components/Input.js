const InputComponent = ({ label, name, value, onChange }) => {
  return (
    <div className="col-auto">
      <label className="col-form-label">{label}</label>
      <div className="col-form-label">
        <input
          type="number"
          className="form-control"
          name={name}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default InputComponent
