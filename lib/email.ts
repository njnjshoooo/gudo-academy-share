import { Resend } from 'resend'

// 懶載入：避免建置時因未設定 RESEND_API_KEY 而報錯
function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 're_placeholder_not_configured')
}
const FROM = process.env.EMAIL_FROM || 'noreply@gudo-academy.com'
const SITE_NAME = '居家整聊室'

// ─── 通用輔助 ───────────────────────────────────────────────────────────────

function emailWrapper(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body { margin:0; padding:0; background:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
    .wrap { max-width:580px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb; }
    .header { background:#1a5c3a; padding:24px 32px; }
    .header img { height:36px; }
    .body { padding:32px; color:#374151; }
    h1 { margin:0 0 16px; font-size:20px; color:#111827; }
    p { margin:0 0 12px; line-height:1.6; font-size:15px; }
    .box { background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:16px 20px; margin:20px 0; }
    .box p { margin:4px 0; font-size:14px; }
    .label { color:#6b7280; }
    .btn { display:inline-block; background:#0ea5e9; color:#fff; padding:12px 28px; border-radius:8px; text-decoration:none; font-weight:600; font-size:15px; margin:16px 0; }
    .footer { padding:20px 32px; border-top:1px solid #f3f4f6; font-size:12px; color:#9ca3af; text-align:center; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <img src="${process.env.NEXT_PUBLIC_SITE_URL}/logo.webp" alt="${SITE_NAME}">
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} ${SITE_NAME}・如有疑問請聯繫客服
    </div>
  </div>
</body>
</html>`
}

// ─── 訂單確認信 ─────────────────────────────────────────────────────────────

export async function sendOrderConfirmation(params: {
  to: string
  customerName: string
  orderNumber: string
  items: { name: string; quantity: number; price: number }[]
  total: number
}) {
  const itemRows = params.items
    .map(
      (i) =>
        `<p><span class="label">${i.name}</span> × ${i.quantity} — NT$${(i.price * i.quantity).toLocaleString()}</p>`
    )
    .join('')

  const html = emailWrapper(
    `訂單確認 #${params.orderNumber}`,
    `
    <h1>感謝您的訂購，${params.customerName}！</h1>
    <p>我們已收到您的訂單，正在等待付款確認。</p>
    <div class="box">
      <p><span class="label">訂單編號：</span><strong>#${params.orderNumber}</strong></p>
      ${itemRows}
      <p style="margin-top:12px;border-top:1px solid #e5e7eb;padding-top:12px;">
        <span class="label">訂單總計：</span><strong>NT$${params.total.toLocaleString()}</strong>
      </p>
    </div>
    <p>請依您選擇的付款方式完成付款。付款完成後，我們將再寄送付款成功通知。</p>
    <p>如有任何問題，歡迎聯繫我們。</p>
    `
  )

  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `【${SITE_NAME}】訂單確認 #${params.orderNumber}`,
    html,
  })
}

// ─── 付款成功通知 ────────────────────────────────────────────────────────────

export async function sendPaymentSuccessEmail(params: {
  to: string
  customerName: string
  orderNumber: string
  total: number
  items: { name: string; quantity: number; price: number }[]
}) {
  const itemRows = params.items
    .map(
      (i) =>
        `<p><span class="label">${i.name}</span> × ${i.quantity} — NT$${(i.price * i.quantity).toLocaleString()}</p>`
    )
    .join('')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  const html = emailWrapper(
    `付款成功 #${params.orderNumber}`,
    `
    <h1>付款成功！感謝您，${params.customerName}</h1>
    <p>您的付款已確認，課程即將開通。</p>
    <div class="box">
      <p><span class="label">訂單編號：</span><strong>#${params.orderNumber}</strong></p>
      ${itemRows}
      <p style="margin-top:12px;border-top:1px solid #e5e7eb;padding-top:12px;">
        <span class="label">已付金額：</span><strong>NT$${params.total.toLocaleString()}</strong>
      </p>
    </div>
    <a href="${siteUrl}/order/${params.orderNumber}" class="btn">查看訂單詳情</a>
    <p>若您對課程有任何問題，歡迎隨時聯繫我們。</p>
    `
  )

  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `【${SITE_NAME}】付款成功 #${params.orderNumber}`,
    html,
  })
}

// ─── KYC 審核通過 ────────────────────────────────────────────────────────────

export async function sendKycApprovedEmail(params: {
  to: string
  name: string
  referralCode: string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  const html = emailWrapper(
    'KYC 審核通過，開始推廣賺分潤！',
    `
    <h1>恭喜！您的推廣大使資格已通過審核</h1>
    <p>親愛的 ${params.name}，您的 KYC 資料審核已通過，現在可以開始推廣課程並賺取分潤！</p>
    <div class="box">
      <p><span class="label">您的專屬推廣代碼：</span></p>
      <p style="font-size:24px;font-weight:bold;color:#0ea5e9;letter-spacing:2px;">${params.referralCode}</p>
    </div>
    <a href="${siteUrl}/dashboard" class="btn">前往大使後台</a>
    <p>在大使後台，您可以取得專屬推廣連結、查看分潤明細，以及管理文案範本。</p>
    `
  )

  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `【${SITE_NAME}】恭喜！推廣大使資格審核通過`,
    html,
  })
}

// ─── KYC 審核未通過 ──────────────────────────────────────────────────────────

export async function sendKycRejectedEmail(params: {
  to: string
  name: string
  reason: string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  const html = emailWrapper(
    'KYC 審核結果通知',
    `
    <h1>您的 KYC 審核需要補件</h1>
    <p>親愛的 ${params.name}，感謝您申請成為推廣大使。</p>
    <p>很遺憾，您的 KYC 資料審核未通過，原因如下：</p>
    <div class="box">
      <p>${params.reason}</p>
    </div>
    <a href="${siteUrl}/ambassador/kyc" class="btn">重新提交 KYC 資料</a>
    <p>如有任何問題，歡迎聯繫我們協助您完成審核。</p>
    `
  )

  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `【${SITE_NAME}】KYC 審核結果通知`,
    html,
  })
}

// ─── 請款申請通知 ────────────────────────────────────────────────────────────

export async function sendWithdrawalProcessedEmail(params: {
  to: string
  name: string
  withdrawalNumber: string
  netAmount: number
  status: 'APPROVED' | 'PAID' | 'REJECTED'
  notes?: string
}) {
  const statusText =
    params.status === 'APPROVED'
      ? '已審核通過，即將撥款'
      : params.status === 'PAID'
      ? '已完成撥款'
      : '審核未通過'

  const html = emailWrapper(
    `請款申請更新 #${params.withdrawalNumber}`,
    `
    <h1>請款申請 ${statusText}</h1>
    <p>親愛的 ${params.name}，您的請款申請狀態已更新。</p>
    <div class="box">
      <p><span class="label">申請編號：</span>#${params.withdrawalNumber}</p>
      <p><span class="label">狀態：</span><strong>${statusText}</strong></p>
      <p><span class="label">實收金額：</span>NT$${params.netAmount.toLocaleString()}</p>
      ${params.notes ? `<p><span class="label">備註：</span>${params.notes}</p>` : ''}
    </div>
    <p>如有任何疑問，歡迎聯繫我們。</p>
    `
  )

  return getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: `【${SITE_NAME}】請款申請 ${statusText} #${params.withdrawalNumber}`,
    html,
  })
}
