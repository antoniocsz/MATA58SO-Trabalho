const SpanCustomized = ({ type, children }) => {
  let styleType = type
    ? { marginTop: 10, fontWeight: 'bold' }
    : { marginLeft: 5 }
  return (
    <>
      <span style={styleType}>{children}</span>
      <br />
    </>
  )
}

const VPComponent = ({ listProcessos }) => {
  return (
    <div className=" row card-body align-items-start" style={{ margin: 5 }}>
      {listProcessos &&
        listProcessos.map((processo, key) => (
          <div key={key}>
            <SpanCustomized type>{`Processo: ${key + 1}`}</SpanCustomized>
            <SpanCustomized>{`Tempo de Chegada: ${processo.tempoChegada}`}</SpanCustomized>
            <SpanCustomized>{`Tempo de Execução: ${processo.tempoExecucao}`}</SpanCustomized>
            <SpanCustomized>{`Deadline: ${processo.deadline}`}</SpanCustomized>

            {/* <SpanCustomized>{`Prioridade: ${processo.prioridade}`}</SpanCustomized> */}
          </div>
        ))}
    </div>
  )
}

export default VPComponent
