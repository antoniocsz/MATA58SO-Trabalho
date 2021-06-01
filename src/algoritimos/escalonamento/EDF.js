export function edf(processlist) {
  const processArray = [...processlist]
  const numProcess = processArray.length
  const lista = []
  const fila = []
  const ordensExecucao = {}

  let tempoAtual = 0
  let aux = 0
  let primeiraExecucao = 0

  function calcDeadline(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].estouroDeadline = arr[i].tempoChegada + arr[i].deadline
    }
  }

  function sortByChegada(array, n) {
    for (let i = 0; i < n; i++) {
      if (array[i].tempoChegada > array[i + 1].tempoChegada) {
        aux = array[i]
        array[i] = array[i + 1]
        array[i + 1] = aux
      }
      sortByChegada(array, n - 1)
    }
  }

  function sortByDeadline(array, n) {
    for (let i = 0; i < n; i++) {
      if (array[i].deadline > array[i + 1].deadline) {
        aux = array[i]
        array[i] = array[i + 1]
        array[i + 1] = aux
      }
      sortByDeadline(array, n - 1)
    }
  }

  // inicializa a lista
  function listStart(array) {
    array.map((elem) => {
      lista.push(elem)
      ordensExecucao[elem.id] = []
    })
  }

  function insert({ arr, pos, inicio, fim, status }) {
    arr[pos].push({ inicio, fim, status })
  }

  function generateResult() {
    let result = []
    let xOrdensExecucao = Object.values(ordensExecucao)

    processArray.map((i) => {
      result.push({
        id: i.id,
        tempoChegada: i.tempoChegada,
        deadline: i.estouroDeadline,
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
        //   Não há sobre carga: ([Tempo de Execução do Processo] < [Quantum do Sistema])
        if (arr[0].tempoExecucao < arr[0].quantum) {
          if (arr[0].quantum - arr[0].tempoExecucao > arr[0].estouroDeadline) {
            insert({
              arr: ordensExecucao,
              pos: arr[0].id,
              inicio: arr[0].tempoChegada,
              fim: arr[0].estouroDeadline,
              status: 'em-execução',
            })
            insert({
              arr: ordensExecucao,
              pos: arr[0].id,
              inicio: arr[0].estouroDeadline,
              fim: arr[0].quantum - arr[0].tempoExecucao,
              status: 'em-estouro',
            })
          } else {
            insert({
              arr: ordensExecucao,
              pos: arr[0].id,
              inicio: arr[0].tempoChegada,
              fim: arr[0].quantum - arr[0].tempoExecucao,
              status: 'em-execução',
            })
          }

          tempoAtual += arr[0].quantum - arr[0].tempoExecucao
          arr.shift()
        } else if (arr[0].tempoExecucao === arr[0].quantum) {
          if (arr[0].quantum > arr[0].estouroDeadline) {
            insert({
              arr: ordensExecucao,
              pos: arr[0].id,
              inicio: arr[0].tempoChegada,
              fim: arr[0].estouroDeadline,
              status: 'em-execução',
            })
            insert({
              arr: ordensExecucao,
              pos: arr[0].id,
              inicio: arr[0].estouroDeadline,
              fim: arr[0].quantum,
              status: 'em-estouro',
            })
          } else {
            insert({
              arr: ordensExecucao,
              pos: arr[0].id,
              inicio: arr[0].tempoChegada,
              fim: arr[0].quantum,
              status: 'em-execução',
            })
          }

          tempoAtual += arr[0].quantum
          arr.shift()
        } else {
          if (arr[0].quantum > arr[0].estouroDeadline) {
            insert({
              arr: ordensExecucao,
              pos: arr[0].id,
              inicio: arr[0].tempoChegada,
              fim: arr[0].estouroDeadline,
              status: 'em-execução',
            })
            insert({
              arr: ordensExecucao,
              pos: arr[0].id,
              inicio: arr[0].estouroDeadline,
              fim: arr[0].quantum,
              status: 'em-estouro',
            })
          } else {
            insert({
              arr: ordensExecucao,
              pos: arr[0].id,
              inicio: arr[0].tempoChegada,
              fim: arr[0].quantum,
              status: 'em-execução',
            })
          }

          insert({
            arr: ordensExecucao,
            pos: arr[0].id,
            inicio: arr[0].tempoChegada + arr[0].quantum,
            fim: arr[0].tempoChegada + arr[0].quantum + arr[0].sobrecarga,
            status: 'em-sobrecarga',
          })

          tempoAtual += arr[0].quantum + arr[0].sobrecarga
          arr.push({
            id: arr[0].id,
            tempoChegada: tempoAtual,
            deadline: arr[0].deadline - arr[0].quantum - arr[0].sobrecarga,
            estouroDeadline: arr[0].estouroDeadline,
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
          insert({
            arr: ordensExecucao,
            pos: arr[0].id,
            inicio: arr[0].tempoChegada,
            fim: tempoAtual,
            status: 'em-espera',
          })

          arr[0].deadline = arr[0].deadline - (tempoAtual - arr[0].tempoChegada)
        }

        if (arr[0].tempoExecucao < arr[0].quantum) {
          let qMaiorTmpExec =
            tempoAtual + (arr[0].quantum - arr[0].tempoExecucao)
          if (
            tempoAtual > arr[0].estouroDeadline ||
            qMaiorTmpExec > arr[0].estouroDeadline
          ) {
            if (tempoAtual > arr[0].estouroDeadline) {
              insert({
                arr: ordensExecucao,
                pos: arr[0].id,
                inicio: tempoAtual,
                fim: tempoAtual + (arr[0].quantum - arr[0].tempoExecucao),
                status: 'em-estouro',
              })
            } else {
              insert({
                arr: ordensExecucao,
                pos: arr[0].id,
                inicio: tempoAtual,
                fim: arr[0].estouroDeadline,
                status: 'em-execução',
              })
              insert({
                arr: ordensExecucao,
                pos: arr[0].id,
                inicio: arr[0].estouroDeadline,
                fim: tempoAtual + (arr[0].quantum - arr[0].tempoExecucao),
                status: 'em-estouro',
              })
            }
          } else {
            insert({
              arr: ordensExecucao,
              pos: arr[0].id,
              inicio: tempoAtual,
              fim: tempoAtual + (arr[0].quantum - arr[0].tempoExecucao),
              status: 'em-execução',
            })
          }

          tempoAtual += arr[0].quantum - arr[0].tempoExecucao
          arr.shift()
        } else if (arr[0].tempoExecucao === arr[0].quantum) {
          let qIgualTmpExec = tempoAtual + arr[0].quantum
          if (
            tempoAtual > arr[0].estouroDeadline ||
            qIgualTmpExec > arr[0].estouroDeadline
          ) {
            if (tempoAtual > arr[0].estouroDeadline) {
              insert({
                arr: ordensExecucao,
                pos: arr[0].id,
                inicio: tempoAtual,
                fim: tempoAtual + arr[0].quantum,
                status: 'em-estouro',
              })
            } else {
              insert({
                arr: ordensExecucao,
                pos: arr[0].id,
                inicio: tempoAtual,
                fim: arr[0].estouroDeadline,
                status: 'em-execução',
              })
              insert({
                arr: ordensExecucao,
                pos: arr[0].id,
                inicio: arr[0].estouroDeadline,
                fim: tempoAtual + arr[0].quantum,
                status: 'em-estouro',
              })
            }
          } else {
            insert({
              arr: ordensExecucao,
              pos: arr[0].id,
              inicio: tempoAtual,
              fim: tempoAtual + arr[0].quantum,
              status: 'em-execução',
            })
          }

          tempoAtual += arr[0].quantum
          arr.shift()
        } else {
          let qMenorTmpExec = tempoAtual + arr[0].quantum
          if (
            tempoAtual > arr[0].estouroDeadline ||
            qMenorTmpExec > arr[0].estouroDeadline
          ) {
            if (tempoAtual > arr[0].estouroDeadline) {
              insert({
                arr: ordensExecucao,
                pos: arr[0].id,
                inicio: tempoAtual,
                fim: tempoAtual + arr[0].quantum,
                status: 'em-estouro',
              })
            } else {
              insert({
                arr: ordensExecucao,
                pos: arr[0].id,
                inicio: tempoAtual,
                fim: arr[0].estouroDeadline,
                status: 'em-execução',
              })
              insert({
                arr: ordensExecucao,
                pos: arr[0].id,
                inicio: arr[0].estouroDeadline,
                fim: tempoAtual + arr[0].quantum,
                status: 'em-estouro',
              })
            }
          } else {
            insert({
              arr: ordensExecucao,
              pos: arr[0].id,
              inicio: tempoAtual,
              fim: tempoAtual + arr[0].quantum,
              status: 'em-execução',
            })
          }

          insert({
            arr: ordensExecucao,
            pos: arr[0].id,
            inicio: tempoAtual + arr[0].quantum,
            fim: tempoAtual + arr[0].quantum + arr[0].sobrecarga,
            status: 'em-sobrecarga',
          })

          tempoAtual += arr[0].quantum + arr[0].sobrecarga
          arr.push({
            id: arr[0].id,
            tempoChegada: tempoAtual,
            deadline: arr[0].deadline - arr[0].quantum - arr[0].sobrecarga,
            estouroDeadline: arr[0].estouroDeadline,
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
        sortByDeadline(arr, arr.length - 1)
        arr2.shift()
      }
    }
  }

  calcDeadline(processArray)
  sortByChegada(processArray, numProcess - 1)
  listStart(processArray)
  escalonamento(fila, lista)
  return generateResult()
}
