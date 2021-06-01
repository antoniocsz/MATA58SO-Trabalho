export function fifo(processlist) {
  const processArray = [...processlist]
  const numProcess = processArray.length
  const ordensExecucao = {}
  let tempoAtual = 0
  let aux = 0

  function sort(array, n) {
    for (let i = 0; i < n; i++) {
      if (array[i].tempoChegada > array[i + 1].tempoChegada) {
        aux = array[i]
        array[i] = array[i + 1]
        array[i + 1] = aux
      }
      sort(array, n - 1)
    }
  }

  function listStart(array) {
    array.map((elem) => {
      ordensExecucao[elem.id] = []
    })
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

  sort(processArray, numProcess - 1)
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
  }

  return generateResult()
}
