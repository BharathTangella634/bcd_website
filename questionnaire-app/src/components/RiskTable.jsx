import React from 'react';
import './RiskTable.css';

const RiskTable = () => {
    const tableData = [
        {
            category: 'Average Risk',
            percentage: '~12% – 13%',
            description: 'Most women fall in this group, with no major known risk indicators.',
            nextSteps: 'Keep up your routine screening. Perform a self breast examination monthly and schedule a clinical breast examination annually.'
        },
        {
            category: 'Low-Intermediate',
            percentage: '15% – 19%',
            description: 'You have a few mild risk indicators that may be worth monitoring over time.',
            nextSteps: 'Continue routine screening. Perform a self breast examination monthly and schedule a clinical breast examination every 6 months.'
        },
        {
            category: 'Moderate Risk',
            percentage: '20% – 24%',
            description: 'You have stronger risk indicators that place you at a moderately elevated risk.',
            nextSteps: 'Perform a self breast examination monthly. Schedule a clinical breast examination every 6 months and consult a physician for sono-mammography.'
        },
        {
            category: 'High Risk',
            percentage: '≥ 25%',
            description: 'You are at a higher than average risk and may need closer clinical attention.',
            nextSteps: 'Perform a self breast examination monthly. Schedule an immediate clinical breast examination and consult a physician urgently for sono-mammography and further evaluation.'
        }
    ];

    return (
        <div className="risk-table-container fade-in">
            <h4 className="risk-table-title">Risk Categories Reference</h4>
            <div className="risk-table-wrapper">
                <table className="risk-table">
                    <thead>
                        <tr>
                            <th>Risk Category</th>
                            <th>Lifetime Risk Percentage</th>
                            <th>Description</th>
                            <th>Next steps</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, idx) => {
                            let bgColor = 'inherit';
                            if (row.category.includes('High Risk')) bgColor = '#fb7185';
                            else if (row.category.includes('Moderate Risk')) bgColor = '#fb923c';
                            else if (row.category.includes('Low-Intermediate')) bgColor = '#fde047';
                            else if (row.category.includes('Average Risk')) bgColor = '#6ee7b7';
                            
                            return (
                                <tr key={idx} style={{ backgroundColor: bgColor, color: '#111' }}>
                                    <td style={{ color: '#111', fontWeight: '500' }}>{row.category}</td>
                                    <td style={{ color: '#111' }}>{row.percentage}</td>
                                    <td style={{ color: '#111' }}>{row.description}</td>
                                    <td style={{ color: '#111' }}>{row.nextSteps}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RiskTable;
