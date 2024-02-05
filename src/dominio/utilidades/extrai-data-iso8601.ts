import VerificaIso8601Utils from "./verifica-iso8601";

const ExtraiDataIso8601Utils = (isoString: string): string | null => {
  if (VerificaIso8601Utils(isoString)) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const partes = isoString.split('T')
    if (partes.length > 1 && regex.test(partes[0])) {
      return partes[0]
    }
  }
  return null
}

export default ExtraiDataIso8601Utils
