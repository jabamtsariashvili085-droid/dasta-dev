'use client'

import { formatCurrency, formatDate } from '@/lib/utils'

interface ZReportProps {
    data: {
        totalSales: number
        cashSales: number
        cardSales: number
        vatTotal: number
        saleCount: number
        date: Date
        branchName: string
    }
}

export default function ZReport({ data }: ZReportProps) {
    return (
        <div className="print-only receipt-thermal">
            <div className="receipt-header">
                <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '0' }}>Z-REPORT</h2>
                <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: 'bold' }}>იჯარის დახურვა</p>
                <p style={{ margin: '0' }}>{data.branchName}</p>
                <div className="receipt-divider"></div>
                <p style={{ margin: '0', fontSize: '12px' }}>თარიღი: {formatDate(data.date)}</p>
                <p style={{ margin: '0', fontSize: '12px' }}>დრო: {new Date().toLocaleTimeString('ka-GE')}</p>
            </div>

            <div style={{ padding: '10px 0' }}>
                <div className="receipt-item">
                    <span>ჩეკების რაოდენობა:</span>
                    <span>{data.saleCount}</span>
                </div>

                <div className="receipt-divider"></div>

                <div className="receipt-item">
                    <span>ჯამური გაყიდვები:</span>
                    <span style={{ fontWeight: 'bold' }}>{formatCurrency(data.totalSales)}</span>
                </div>

                <div className="receipt-item" style={{ fontSize: '11px', color: '#444' }}>
                    <span>- ნაღდი:</span>
                    <span>{formatCurrency(data.cashSales)}</span>
                </div>

                <div className="receipt-item" style={{ fontSize: '11px', color: '#444' }}>
                    <span>- ბარათი:</span>
                    <span>{formatCurrency(data.cardSales)}</span>
                </div>

                <div className="receipt-divider"></div>

                <div className="receipt-item">
                    <span>დღგ (18%):</span>
                    <span>{formatCurrency(data.vatTotal)}</span>
                </div>
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-footer">
                <p style={{ fontWeight: 'bold', fontSize: '12px' }}>RS.GE სინქრონიზებული ✅</p>
                <p style={{ marginTop: '20px', fontSize: '8px' }}>DASTA FISCAL ENGINE v1.0</p>
            </div>
        </div>
    )
}
