import { parseISO, format } from 'date-fns'

const ExtraiAnoMesIso8601Utils = (isoString: string): string | null => {
  try {
    const data = parseISO(isoString);
    return format(data, 'yyyy-MM');
  } catch (error) {
    return null;
  }
}

export default ExtraiAnoMesIso8601Utils
