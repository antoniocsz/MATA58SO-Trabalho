export function shortest(processlist) {
  const processArray = [...processlist]
  const numProcess = processArray.length
  const ordensExecucao = {}
  let tempoAtual = 0
  let aux = 0
  let aux2 = 0
  let aux3 = 0

  function listStart(array) {
    array.map((elem) => {
      ordensExecucao[elem.id] = []
    })
  }

  function sort(array, n) {
    for (let i = aux2; i < n; i++) {
      if (array[i].tempoExecucao > array[i + 1].tempoExecucao) {
        aux = array[i]
        array[i] = array[i + 1]
        array[i + 1] = aux
      }
      sort(array, n - 1)
    }
  }

  function sortTempoExecucao(array, n, tempo) {
    aux3 = 0
    for (let i = 0; i < n; i++) {
      if (array[i].turnaround === 0 && array[i].tempoChegada < tempo) {
        aux3++
      }
    }

    if (aux3 >= 2) {
      aux2 = 0
      while (aux2 < numProcess) {
        if (array[aux2].turnaround === 0) break
        aux2++
      }
      sortTempoChegadaIgual(processArray, numProcess - 1)
      sort(array, aux2 + aux3 - 1)
    }
  }

  function sortTempoChegada(array, n) {
    for (let i = 0; i < n; i++) {
      if (array[i].tempoChegada > array[i + 1].tempoChegada) {
        aux = array[i]
        array[i] = array[i + 1]
        array[i + 1] = aux
      }
      sortTempoChegada(array, n - 1)
    }
  }

  function sortTempoChegadaIgual(array, n) {
    for (let i = 0; i < n; i++) {
      if (
        array[i].tempoChegada === array[i + 1].tempoChegada &&
        array[i].tempoExecucao > array[i + 1].tempoExecucao
      ) {
        aux = array[i]
        array[i] = array[i + 1]
        array[i + 1] = aux
      }
      sortTempoChegadaIgual(array, n - 1)
    }
  }

  function generateResult() {
    let result = []
    let xOrdensExecucao = Object.values(ordensExecucao)

    processArray.map((i) => {
      result.push({
        id: i.id,
        tempoChegada: i.tempoChegada,
        execution: xOrdensExecucao[i.id],
        turnaround:
          xOrdensExecucao[i.id][xOrdensExecucao[i.id].length - 1].fim -
          xOrdensExecucao[i.id][0].inicio,
      })
    })

    return result
  }

  sortTempoChegada(processArray, numProcess - 1)
  sortTempoChegadaIgual(processArray, numProcess - 1)
  listStart(processArray)

  tempoAtual = processArray[0].tempoChegada
  for (let i = 0; i < numProcess; i++) {
    if (tempoAtual <= processArray[i].tempoChegada) {
      processArray[i].turnaround = 0
      tempoAtual = processArray[i].tempoChegada
      ordensExecucao[processArray[i].id].push({
        inicio: tempoAtual,
        fim: tempoAtual + processArray[i].tempoExecucao,
        status: 'em-execução',
      })
    } else {
      processArray[i].turnaround = tempoAtual - processArray[i].tempoChegada
      ordensExecucao[processArray[i].id].push({
        inicio: processArray[i].tempoChegada,
        fim: tempoAtual,
        status: 'em-espera',
      })
      ordensExecucao[processArray[i].id].push({
        inicio: tempoAtual,
        fim: tempoAtual + processArray[i].tempoExecucao,
        status: 'em-execução',
      })
    }
    for (let j = 0; j < processArray[i].tempoExecucao; j++) {
      processArray[i].turnaround++
    }

    tempoAtual += processArray[i].tempoExecucao

    sortTempoExecucao(processArray, numProcess, tempoAtual)
  }

  return generateResult()
}
