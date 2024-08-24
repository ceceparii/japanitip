export function statusColor(status) {
    switch (status) {
        case 'menunggu_pembayaran':
            return {
                background: 'var(--yellow-primer)',
                color: 'var(--yellow-scunder)',
            };
        case 'diproses':
            return {
                background: 'var(--blue-primer)',
                color: 'var(--blue-scunder)',
            };
        case 'dikirim':
            return {
                background: 'var(--orange-primer)',
                color: 'var(--orange-scunder)',
            };
        case 'selesai':
            return {
                background: 'var(--green-primer)',
                color: 'var(--green-scunder)',
            };
        case 'dibatalkan':
            return {
                background: '#fee2e2',
                color: 'var(--red-scunder)'
            }
        default:
            return { background: 'var(--gray-primer)', color: 'var(--black)' };
    }
}