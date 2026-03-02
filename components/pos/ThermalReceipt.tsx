'use client'

import { formatCurrency, formatDate } from '@/lib/utils'

interface ThermalReceiptProps {
    sale: any
    items: any[]
    branch: any
    settings: any
}

export default function ThermalReceipt({ sale, items, branch, settings }: ThermalReceiptProps) {
    return (
        <div className="print-only receipt-thermal">
            <div className="receipt-header">
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0' }}>{settings?.receipt_header || branch?.name}</h2>
                <p style={{ margin: '0' }}>{branch?.address}</p>
                <p style={{ margin: '0' }}>ტელ: {branch?.phone}</p>
                <div className="receipt-divider"></div>
                <p style={{ margin: '0', fontSize: '10px' }}>ID: #{sale?.id?.split('-')[0].toUpperCase()}</p>
                <p style={{ margin: '0', fontSize: '10px' }}>თარიღი: {formatDate(new Date())}</p>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <div className="receipt-item" style={{ fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '5px' }}>
                    <span>დასახელება</span>
                    <span>ჯამი</span>
                </div>
                {items.map((item, idx) => (
                    <div key={idx} className="receipt-item">
                        <div style={{ flex: 1 }}>
                            <div>{item.name}</div>
                            <div style={{ fontSize: '10px', color: '#666' }}>{item.quantity} x {formatCurrency(item.retail_price)}</div>
                        </div>
                        <div style={{ fontWeight: 'bold' }}>{formatCurrency(item.retail_price * item.quantity)}</div>
                    </div>
                ))}
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-total">
                <span>სულ:</span>
                <span>{formatCurrency(sale?.total_amount)}</span>
            </div>

            <div className="receipt-item" style={{ fontSize: '10px', marginTop: '5px' }}>
                <span>გადახდა:</span>
                <span>{sale?.payment_method === 'cash' ? 'ნაღდი' : 'ბარათი'}</span>
            </div>

            <div className="receipt-footer">
                <p style={{ margin: '0' }}>{settings?.receipt_footer || 'გმადლობთ!'}</p>
                <p style={{ marginTop: '10px', fontSize: '8px' }}>POWERED BY DASTA</p>
            </div>
        </div>
    )
}
