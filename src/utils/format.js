export const dateFormat = new Intl.DateTimeFormat('id-Id', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Asia/Jakarta',
    timeZoneName: 'short'
})

export const idrFormat = Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
})
