export function fifo(processlist) {
  const processArray = [...processlist] // array usando dentro da lista.
  const numProcess = processArray.length // tamanho da lista
  const ordensExecucao = {} // estrutura de dados auxiliar
  let tempoAtual = 0 // variavel que ajuda a contar o tempo passado durante a excução do processo
  let aux = 0 // variavel euxiliar para ajduar nas permutas do bubblesort

  /* 
    função que realiza um Bubblesort para ordenar os processos pelo tempo de chegada.
    ele faz permutas de i por i+1 e chama recursivamente até percorrer o fim do processo.
  */
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

  /* 
    função que inicializa a estrutura de dados auxiliar. 
  */
  function listStart(array) {
    /*
      Isso aqui equivale a um for que percorre o array, 
      e adiciona ao orderExecução um objeto com o id do processo, com um array vazio:

      for (let i=0; i < array.length; i++) {
        ordensExecucao[array[i].id] = []
        {  0: [], 1: [], 2: [] }
      }
    
    */
    array.map((elem) => {
      ordensExecucao[elem.id] = []
    })
  }

  /* 
    função que gera os dados que são retornados para serem usados nos graficos. 
  */
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

  /*
    Lógica do fifo
  */
  tempoAtual = processArray[0].tempoChegada //
  for (let i = 0; i < numProcess; i++) {
    /* 
      Verifica se tempo atual é mmenor ou igual ao tempo de chegada.
      1 - incrementa o turnaround.
      2 - Salva
    */
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

    // Contador do Turnaround
    for (let j = 0; j < processArray[i].tempoExecucao; j++) {
      processArray[i].turnaround++
    }

    tempoAtual += processArray[i].tempoExecucao
  }

  return generateResult()
}
