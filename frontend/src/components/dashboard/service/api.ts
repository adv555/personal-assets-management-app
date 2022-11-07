import api from 'axios/axios'

export const fetchWallets = async () => {
  const data = await api.get(`/wallets`)

  return data?.data
}

export const fetchReportForPeriod = async (
  walletId: string | number,
  startDate: string,
  endDate: string,
) => {
  const modifiedEndDate = `${endDate}T23:59`

  const res = await api.get(
    `/overview/search?walletId=${walletId}&startDate=${startDate}&endDate=${modifiedEndDate}`,
  )

  return res?.data
}
