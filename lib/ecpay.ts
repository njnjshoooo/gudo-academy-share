import crypto from 'crypto'

/** ECPay payment method mapping */
export const PAYMENT_METHOD_MAP: Record<string, string> = {
  CREDIT_CARD: 'Credit',
  ATM: 'ATM',
  CVS: 'CVS',
}

interface ECPayOrderData {
  orderNumber: string       // MerchantTradeNo (max 20 alphanumeric chars)
  totalAmount: number       // 整數
  itemName: string          // 商品名稱，多項用 # 分隔
  paymentMethod: string     // CREDIT_CARD | ATM | CVS
  customerEmail?: string
}

/** 產生 ECPay CheckMacValue (SHA256) */
function generateCheckMacValue(
  params: Record<string, string>,
  hashKey: string,
  hashIV: string
): string {
  const sorted = Object.entries(params)
    .sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()))

  const raw = `HashKey=${hashKey}&${sorted.map(([k, v]) => `${k}=${v}`).join('&')}&HashIV=${hashIV}`
  const encoded = encodeURIComponent(raw)
    .toLowerCase()
    .replace(/%20/g, '+')
    .replace(/%21/g, '!')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%2a/g, '*')

  return crypto.createHash('sha256').update(encoded).digest('hex').toUpperCase()
}

/** 格式化日期為 ECPay 格式 yyyy/MM/dd HH:mm:ss */
function formatECPayDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  )
}

/**
 * 產生送往綠界的 form 參數物件
 * 使用者需從前端自動 POST 此 form 到 ECPay
 */
export function buildECPayFormData(order: ECPayOrderData): {
  actionUrl: string
  fields: Record<string, string>
} {
  const merchantId = process.env.ECPAY_MERCHANT_ID || ''
  const hashKey = process.env.ECPAY_HASH_KEY || ''
  const hashIV = process.env.ECPAY_HASH_IV || ''
  const returnUrl = process.env.ECPAY_RETURN_URL || ''
  const orderResultUrl = process.env.ECPAY_ORDER_RESULT_URL || ''
  const apiUrl =
    process.env.ECPAY_API_URL ||
    'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'

  const choosePayment = PAYMENT_METHOD_MAP[order.paymentMethod] || 'ALL'

  // MerchantTradeNo 限英數 20 碼以內
  const merchantTradeNo = order.orderNumber.replace(/[^A-Za-z0-9]/g, '').slice(0, 20)

  const params: Record<string, string> = {
    MerchantID: merchantId,
    MerchantTradeNo: merchantTradeNo,
    MerchantTradeDate: formatECPayDate(new Date()),
    PaymentType: 'aio',
    TotalAmount: String(order.totalAmount),
    TradeDesc: encodeURIComponent('居家整聊室 課程訂單'),
    ItemName: order.itemName.slice(0, 200),
    ReturnURL: returnUrl,
    OrderResultURL: orderResultUrl,
    ChoosePayment: choosePayment,
    EncryptType: '1',
  }

  params.CheckMacValue = generateCheckMacValue(params, hashKey, hashIV)

  return { actionUrl: apiUrl, fields: params }
}

/**
 * 產生自動提交的 HTML form 字串
 * 可直接 innerHTML 插入頁面，配合 JS 自動 submit
 */
export function buildECPayAutoSubmitHtml(order: ECPayOrderData): string {
  const { actionUrl, fields } = buildECPayFormData(order)

  const inputs = Object.entries(fields)
    .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}">`)
    .join('\n')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>付款跳轉中...</title></head>
<body>
  <p style="text-align:center;margin-top:40px;font-family:sans-serif;color:#666;">
    正在跳轉至綠界付款頁面，請稍候...
  </p>
  <form id="ecpay-form" method="post" action="${actionUrl}">
    ${inputs}
  </form>
  <script>document.getElementById('ecpay-form').submit();</script>
</body>
</html>`
}
