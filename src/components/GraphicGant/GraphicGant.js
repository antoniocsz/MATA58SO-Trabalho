import React, { useState, useEffect } from 'react'
import './GraphicGant.css'

import { Button } from '../../components'

export function putColor(i) {
  const espera = document.querySelectorAll(`#em-espera${i}`)
  const execução = document.querySelectorAll(`#em-execução${i}`)
  const sobrecarga = document.querySelectorAll(`#em-sobrecarga${i}`)
  const estouro = document.querySelectorAll(`#em-estouro${i}`)

  if (espera != null) {
    espera.forEach((element) => {
      // element.classList.add('em-espera')
      element.classList.add('table-warning')
    })
  }

  if (execução != null) {
    execução.forEach((element) => {
      // element.classList.add('em-execução')
      element.classList.add('table-success')
    })
  }

  if (sobrecarga != null) {
    sobrecarga.forEach((element) => {
      // element.classList.add('em-sobrecarga')
      element.classList.add('table-danger')
    })
  }

  if (estouro != null) {
    estouro.forEach((element) => {
      // element.classList.add('em-estouro')
      element.classList.add('table-secondary')
    })
  }
}

export function putColorInTime() {
  for (let j = 0; j < 100; j++) {
    setTimeout(() => putColor(j), 1000 * j)
  }
}

export default function Graphic({ dataTest }) {
  const [reset, setReset] = useState(false)
  const [maxTime, setMaxTime] = useState(0)
  const [infos, setInfos] = useState({
    turnaround: 0,
    tempoTotalExecucao: 0,
    qtdProcessos: 0,
  })
  const vHead = [...Array(maxTime).keys()]

  useEffect(() => {
    let turnaround = 0
    let tamProcess = dataTest.length

    dataTest.map((i) => {
      i.execution.map((n) => {
        if (maxTime <= n.fim) {
          setMaxTime(n.fim + 1)
        }
      })
      turnaround += i.turnaround
    })

    setInfos({
      turnaround: turnaround,
      qtdProcessos: tamProcess,
      tempoTotalExecucao: turnaround / tamProcess,
    })
  }, [dataTest])

  function handleTd(position) {
    let ct = 0
    const listTD = []

    if (dataTest[position].tempoChegada !== 0) {
      for (let g = 1; g < dataTest[position].tempoChegada; g++) {
        listTD.push(<td className=" tdBox"></td>)
      }
    }

    for (let i = 0; i < dataTest[position].execution.length; i++) {
      const time =
        dataTest[position].execution[i].fim -
        dataTest[position].execution[i].inicio
      for (let k = 0; k < time; k++) {
        ct++
        const tempoDeChegada =
          dataTest[position].tempoChegada === 0
            ? 0
            : dataTest[position].tempoChegada - 1
        switch (dataTest[position].execution[i].status) {
          case 'em-espera':
            listTD.push(
              <td
                id={`em-espera${ct + tempoDeChegada}`}
                className=" tdBox"></td>
            )
            break
          case 'em-execução':
            listTD.push(
              <td
                id={`em-execução${ct + tempoDeChegada}`}
                className=" tdBox"></td>
            )
            break
          case 'em-sobrecarga':
            listTD.push(
              <td
                id={`em-sobrecarga${ct + tempoDeChegada}`}
                className=" tdBox"></td>
            )
            break
          case 'em-estouro':
            listTD.push(
              <td
                id={`em-estouro${ct + tempoDeChegada}`}
                className=" tdBox"></td>
            )
            break
          default:
            listTD.push(<td className=" tdBox" />)
            break
        }
      }
    }
    return listTD
  }

  function handlerReset() {
    setReset(true)
    setTimeout(() => setReset(false), 1)
  }

  return (
    <>
      {reset === false && (
        <div className="table-responsive" style={{ marginBottom: 20 }}>
          <table className="table table-hover">
            <thead class="table-light">
              <tr>
                <th scope="col" style={{ width: 80 }}></th>
                {vHead.map((i) => (
                  <th scope="col" style={{ width: 80 }} key={i}>
                    <p style={{ textAlign: 'center' }}>{i + 1}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataTest.map((x, m) => (
                <tr>
                  <th scope="row">{m}</th>
                  {handleTd(m)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        <p>
          <span style={{ fontWeight: 'bold' }}>Turnaround:</span>
          <br />
          <span>
            {infos.turnaround}/{infos.qtdProcessos}
          </span>{' '}
          = <span>{infos.tempoTotalExecucao}</span>
        </p>
      </div>
      <div className="table-responsive" style={{ marginBottom: 20 }}>
        <table className="table table-borderless">
          <tbody class="table-light">
            <tr>
              <td scope="col" style={{ fontWeight: 'bold' }}>
                Legenda:
              </td>
              <th className="table-success" scope="row"></th>
              <td scope="col">Em execução</td>

              <th className="table-warning" scope="row"></th>
              <td scope="col">Em Espera</td>

              <th className="table-secondary" scope="row"></th>
              <td scope="col">Em Estouro</td>

              <th className="table-danger" scope="row"></th>
              <td scope="col">Em Sobrecarga</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Button title="Reset" onClick={handlerReset} />
    </>
  )
}
