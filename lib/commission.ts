import { Decimal } from 'decimal.js'

interface OrderItem {
  subtotal: number | string
  quantity: number
}

interface Product {
  commissionType: 'PERCENTAGE' | 'FIXED' | null
  commissionValue: number | string | null
}

interface SystemSettings {
  defaultCommissionRate: number
  refundGracePeriodDays: number
}

export function calculateItemCommission(
  item: OrderItem,
  product: Product,
  settings: SystemSettings
): Decimal {
  const subtotal = new Decimal(item.subtotal.toString())

  if (product.commissionType === 'FIXED' && product.commissionValue != null) {
    return new Decimal(product.commissionValue.toString()).times(item.quantity)
  }

  if (product.commissionType === 'PERCENTAGE' && product.commissionValue != null) {
    return subtotal.times(new Decimal(product.commissionValue.toString())).dividedBy(100)
  }

  // 使用系統預設比例
  return subtotal.times(new Decimal(settings.defaultCommissionRate)).dividedBy(100)
}

export function calculateOrderCommission(
  items: Array<{ subtotal: number | string; quantity: number; product: Product }>,
  settings: SystemSettings
): Decimal {
  return items.reduce((sum, item) => {
    return sum.plus(calculateItemCommission(item, item.product, settings))
  }, new Decimal(0))
}

export function calculateTaxAmount(amount: Decimal, taxRate: number = 5): Decimal {
  return amount.times(taxRate).dividedBy(100).toDecimalPlaces(0)
}

export function getUnlockDate(gracePeriodDays: number = 7): Date {
  const date = new Date()
  date.setDate(date.getDate() + gracePeriodDays)
  return date
}
