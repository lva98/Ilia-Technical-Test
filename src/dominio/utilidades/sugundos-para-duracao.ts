const segundosParaDuracao = (seconds: number): string => {
  const horas = Math.floor(seconds / 3600);
  const minutos = Math.floor((seconds % 3600) / 60);
  const segundos = seconds % 60;

  const duracao =  `PT${horas ? horas + 'H' : ''}${minutos ? minutos + 'M' : ''}${segundos ? segundos + 'S' : ''}`;
  if (duracao === 'PT') {
    return 'PT0S'
  }

  return duracao
}

export default segundosParaDuracao
