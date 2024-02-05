const VerificaIso8601Utils = (data: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  return regex.test(data)
}

export default VerificaIso8601Utils
