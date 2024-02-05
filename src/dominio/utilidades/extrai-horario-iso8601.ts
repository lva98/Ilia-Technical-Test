import VerificaIso8601Utils from "./verifica-iso8601";

const ExtraiHorarioIso8601Utils = (isoString: string): string | null => {
  if (VerificaIso8601Utils(isoString)) {
    const partes = isoString.split('T')
    const regex = /^\d{2}:\d{2}:\d{2}$/;
    if (partes.length == 2 && regex.test(partes[1])) {
      return partes[1]
    }
  }
  return null
}

export default ExtraiHorarioIso8601Utils