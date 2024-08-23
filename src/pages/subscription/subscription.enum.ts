export const BANK_BIN = '970416'
export const ACCOUNT_NUMBER = '22090167'
export const ACCOUNT_NAME = 'VANG LE DUNG HOAN'
export const QR_URL = `https://api.vietqr.io/image/${BANK_BIN}-${ACCOUNT_NUMBER}-GVcW33B.jpg`
export const ORDER_STATUS = {
  PENDING: {
    NAME: 'Pending',
    CODE: 0,
    COLOR: 'warning',
  },
  COMPLETED: {
    NAME: 'Completed',
    CODE: 1,
    COLOR: 'success',
  },
  CANCELED: {
    NAME: 'Canceled',
    CODE: 2,
    COLOR: 'danger',
  },
}
