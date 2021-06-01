import { useState, useEffect } from 'react'
import { edf } from './algoritimos/escalonamento/EDF'
import { fifo } from './algoritimos/escalonamento/fifo'
import { roundRobin } from './algoritimos/escalonamento/roundRobin'
import { shortest } from './algoritimos/escalonamento/shortest'
import GraphicGant from './components/GraphicGant/GraphicGant'
import { putColorInTime } from './components/GraphicGant/GraphicGant'

import { Input, Button, CButton, VPComponent } from './components'

function factory(p0, p1 = 0, p2 = 0, p3 = 0, p4 = 0, p5 = 0, p6 = 0) {
  return {
    id: p0,
    tempoChegada: p1,
    tempoExecucao: p2,
    deadline: p3,
    prioridade: p4,
    quantum: p5,
    sobrecarga: p6,
    turnaround: 0,
  }
}

function App() {
  // States
  const [qtdProcessos, setQtdProcessos] = useState(0)
  const [quantum, setQuantum] = useState(2)
  const [sobrecarga, setSobrecarga] = useState(1)

  const [visible, setVisible] = useState(false)
  const [visibleChart, setVisibleChart] = useState(false)
  const [listProcessos, setListProcessos] = useState([])
  const [dataset, setDataSet] = useState([])

  const [funcEscal, setFuncEscal] = useState('fifo')
  const [funcPage, setPageEs] = useState('')

  // functions

  // useEffect(() => {
  //   console.log(listProcessos.length)
  // }, [listProcessos])

  function handleAlgoType(algotype) {
    switch (algotype) {
      case 'fifo': {
        setDataSet(fifo(listProcessos))
        setVisibleChart(true)
        putColorInTime()
        break
      }
      case 'roundRobin': {
        setDataSet(roundRobin(listProcessos))
        setVisibleChart(true)
        putColorInTime()
        break
      }
      case 'shortest': {
        setDataSet(shortest(listProcessos))
        setVisibleChart(true)
        putColorInTime()
        break
      }
      case 'EDF': {
        setDataSet(edf(listProcessos))
        setVisibleChart(true)
        putColorInTime()
        break
      }
      default: {
        console.log('')
      }
    }
  }

  const handlerSetProcessos = (e) => setQtdProcessos(e.target.value)
  const handlerSetQuantum = (e) => setQuantum(e.target.value)
  const handlerSetSobrecarga = (e) => setSobrecarga(e.target.value)

  const handlerVisible = () => setVisible(false)

  const handlerListProcesso = (key) => (e) => {
    let newArr = [...listProcessos]
    let porpertyName = e.target.name
    newArr[key][porpertyName] = parseInt(e.target.value)
    setListProcessos(newArr)
  }

  const handlerSetFuncEscal = (algoType) => (e) => setFuncEscal(algoType)
  const handlerSetFuncPage = (algoType) => (e) => setPageEs(algoType)

  const startProcessos = () => {
    setListProcessos(
      Array.from(Array(parseInt(qtdProcessos)).keys()).map((i) =>
        factory(i, 0, 0, 0, 0, quantum, sobrecarga)
      )
    )
    setVisible(true)
  }

  return (
    <div className="container" style={{ marginBottom: 30 }}>
      <div>
        <h2 style={{ marginTop: 50, marginBottom: 50 }}>
          Trabalho - SO: Escalonamento de Processos e Gerenciamento de Páginas
        </h2>

        {/* Capta a Quantidade de Processos */}
        <div className="card" style={{ marginBottom: 50 }}>
          <h5 className="card-title" style={{ marginLeft: 10, marginTop: 10 }}>
            Informações báscias para simulação dos processos:
          </h5>
          <div
            className=" row card-body align-items-start"
            style={{ margin: 5 }}>
            <Input
              label="Quantidade de Processos:"
              name="qtdProcessos"
              value={qtdProcessos}
              onChange={handlerSetProcessos}
            />
            <Input
              label="Duração do Quantum:"
              name="quantum"
              value={quantum}
              onChange={handlerSetQuantum}
            />
            <Input
              label="Duração da Sobrecarga:"
              name="sobrecarga"
              value={sobrecarga}
              onChange={handlerSetSobrecarga}
            />
            <Button
              disabled={
                qtdProcessos !== '' && parseInt(qtdProcessos) > 0 ? false : true
              }
              onClick={startProcessos}
              title="OK"
            />
          </div>
        </div>

        {/* Regra de salvar os valores de cada processo */}
        {visible && (
          <div style={{ marginBottom: 15 }}>
            {listProcessos.map((processo, key) => (
              <div className="card mb-3" key={key}>
                <h5
                  className="card-title"
                  style={{ marginLeft: 10, marginTop: 10 }}>
                  Processo: {key + 1}
                </h5>
                <div className="card-body">
                  <div className="row g-3">
                    <Input
                      label="Tempo de Chegada:"
                      name="tempoChegada"
                      value={processo.tempoChegada}
                      onChange={handlerListProcesso(key)}
                    />
                    <Input
                      label="Tempo de Execução:"
                      name="tempoExecucao"
                      value={processo.tempoExecucao}
                      onChange={handlerListProcesso(key)}
                    />
                    <Input
                      label="Deadline:"
                      name="deadline"
                      value={processo.deadline}
                      onChange={handlerListProcesso(key)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={handlerVisible} title="OK" />
          </div>
        )}

        <>
          {!visible && (
            <div className="card mb-3">
              <h5
                className="card-title"
                style={{ marginLeft: 10, marginTop: 10 }}>
                Lista de Processos
              </h5>
              <VPComponent listProcessos={listProcessos} />
            </div>
          )}

          <div className="card mb-3">
            <h5
              className="card-title"
              style={{ marginLeft: 10, marginTop: 10 }}>
              Algortimos de Escalonamento
            </h5>
            <div className="card-body row">
              <CButton
                onClick={handlerSetFuncEscal('fifo')}
                title="FIFO"
                active={funcEscal === 'fifo'}
              />
              <CButton
                onClick={handlerSetFuncEscal('shortest')}
                title="SJF"
                active={funcEscal === 'shortest'}
              />
              <CButton
                onClick={handlerSetFuncEscal('roundRobin')}
                title="Round Robin"
                active={funcEscal === 'roundRobin'}
              />
              <CButton
                onClick={handlerSetFuncEscal('EDF')}
                title="EDF"
                active={funcEscal === 'EDF'}
              />
            </div>
          </div>

          {/* <div className="card mb-3">
            <h5
              className="card-title"
              style={{ marginLeft: 10, marginTop: 10 }}>
              Algortimos de Substituição de Página
            </h5>
            <div className="card-body row">
              <CButton
                title="FIFO"
                onClick={handlerSetFuncPage('fifo')}
                active={funcPage === 'fifo'}
              />
              <CButton
                title="MRU"
                onClick={handlerSetFuncPage('mru')}
                active={funcPage === 'mru'}
              />
            </div>
          </div> */}
        </>
      </div>
      <Button
        title="Executar"
        onClick={() => handleAlgoType(funcEscal)}
        disabled={listProcessos <= 0}
      />
      {visibleChart && (
        <div className="card" style={{ marginTop: 50, marginBottom: 50 }}>
          <h5 className="card-title" style={{ marginLeft: 10, marginTop: 10 }}>
            Grafico de Gantt
          </h5>
          <div
            className=" row card-body align-items-start"
            style={{ margin: 5 }}>
            <GraphicGant dataTest={dataset} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
