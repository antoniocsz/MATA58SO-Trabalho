export function roundRobin(processlist) {
  const processArray = [...processlist]
  const numProcess = processArray.length
  const lista = []
  const fila = []
  const ordensExecucao = {}

  let tempoAtual = 0
  let aux = 0
  let primeiraExecucao = 0

  // Ordena o array pela tempo de chegada
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

  // inicializa a lista
  function listStart(array) {
    array.map((elem) => {
      lista.push(elem)
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

  function escalonamento(arr, arr2) {
    arr.push(arr2[0])
    arr2.shift()

    while (arr.length > 0 || arr2.length > 0) {
      if (arr.length === 0 && arr2.length > 0) {
        arr.push(arr2[0])
        arr2.shift()
      }

      if (primeiraExecucao === 0) {
        if (arr[0].tempoExecucao < arr[0].quantum) {
          ordensExecucao[arr[0].id].push({
            inicio: arr[0].tempoChegada,
            fim: arr[0].quantum - arr[0].tempoExecucao,
            status: 'em-execução',
          })

          tempoAtual += arr[0].quantum - arr[0].tempoExecucao
          arr.shift()
        } else if (arr[0].tempoExecucao === arr[0].quantum) {
          ordensExecucao[arr[0].id].push({
            inicio: arr[0].tempoChegada,
            fim: arr[0].quantum,
            status: 'em-execução',
          })

          tempoAtual += arr[0].quantum
          arr.shift()
        } else {
          ordensExecucao[arr[0].id].push({
            inicio: arr[0].tempoChegada,
            fim: arr[0].quantum,
            status: 'em-execução',
          })

          ordensExecucao[arr[0].id].push({
            inicio: arr[0].tempoChegada + arr[0].quantum,
            fim: arr[0].tempoChegada + arr[0].quantum + arr[0].sobrecarga,
            status: 'em-sobrecarga',
          })

          tempoAtual += arr[0].quantum + arr[0].sobrecarga
          arr.push({
            id: arr[0].id,
            tempoChegada: tempoAtual,
            tempoExecucao: arr[0].tempoExecucao - arr[0].quantum,
            quantum: arr[0].quantum,
            sobrecarga: arr[0].sobrecarga,
            turnaround: arr[0].turnaround + arr[0].quantum + arr[0].sobrecarga,
          })
          arr.shift()
        }
        primeiraExecucao++
      } else {
        if (arr[0].tempoChegada < tempoAtual) {
          ordensExecucao[arr[0].id].push({
            inicio: arr[0].tempoChegada,
            fim: tempoAtual,
            status: 'em-espera',
          })
        }

        if (arr[0].tempoExecucao < arr[0].quantum) {
          ordensExecucao[arr[0].id].push({
            inicio: tempoAtual,
            fim: tempoAtual + (arr[0].quantum - arr[0].tempoExecucao),
            status: 'em-execução',
          })

          tempoAtual += arr[0].quantum - arr[0].tempoExecucao
          arr.shift()
        } else if (arr[0].tempoExecucao === arr[0].quantum) {
          ordensExecucao[arr[0].id].push({
            inicio: tempoAtual,
            fim: tempoAtual + arr[0].quantum,
            status: 'em-execução',
          })

          tempoAtual += arr[0].quantum
          arr.shift()
        } else {
          ordensExecucao[arr[0].id].push({
            inicio: tempoAtual,
            fim: tempoAtual + arr[0].quantum,
            status: 'em-execução',
          })

          ordensExecucao[arr[0].id].push({
            inicio: tempoAtual + arr[0].quantum,
            fim: tempoAtual + arr[0].quantum + arr[0].sobrecarga,
            status: 'em-sobrecarga',
          })

          tempoAtual += arr[0].quantum + arr[0].sobrecarga
          arr.push({
            id: arr[0].id,
            tempoChegada: tempoAtual,
            tempoExecucao: arr[0].tempoExecucao - arr[0].quantum,
            quantum: arr[0].quantum,
            sobrecarga: arr[0].sobrecarga,
            turnaround: arr[0].turnaround + arr[0].quantum + arr[0].sobrecarga,
          })
          arr.shift()
        }
      }

      if (arr2.length > 0 && arr2[0].tempoChegada <= tempoAtual) {
        arr.push(arr2[0])
        sort(arr, arr.length - 1)
        arr2.shift()
      }
    }
  }

  sort(processArray, numProcess - 1)
  listStart(processArray)
  escalonamento(fila, lista)

  return generateResult()
}
