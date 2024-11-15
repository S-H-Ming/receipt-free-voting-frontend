import dayjs from "dayjs"

export function getDate(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date)
  }
  // return dayjs(date).tz("Asia/Taipei").format("YYYY/MM/DD HH:mm")
  return dayjs(date).format("YYYY/MM/DD HH:mm")
}

export function showWallet(wallet: string) {
  return `${wallet.slice(0, 5)}...${wallet.slice(-5)}`
}
