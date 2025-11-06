// Analytics-specific script for analytics.html
document.addEventListener('DOMContentLoaded', function() {
    const results = JSON.parse(localStorage.getItem('studentResults')) || [];
    
    if (results.length === 0) {
        // No data message
        const container = document.querySelector('.container');
        const noDataAlert = document.createElement('div');
        noDataAlert.className = 'alert alert-info mt-4';
        noDataAlert.innerHTML = 'No results available. <a href="add-result.html">Add some results</a> to see analytics.';
        container.appendChild(noDataAlert);
        return;
    }

    // Calculate stats
    const totalResults = results.length;
    const averageMarks = (results.reduce((sum, r) => sum + parseInt(r.marks), 0) / totalResults).toFixed(1);
    const grades = results.map(r => r.grade);
    const gradeCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    grades.forEach(g => gradeCounts[g]++);
    
    // Find highest and lowest grade (based on count, or alphabetically if tie)
    const gradeOrder = ['A', 'B', 'C', 'D', 'F'];
    const sortedGrades = gradeOrder.filter(g => gradeCounts[g] > 0);
    const highestGrade = sortedGrades.length > 0 ? sortedGrades[0] : '-';
    const lowestGrade = sortedGrades.length > 0 ? sortedGrades[sortedGrades.length - 1] : '-';

    // Update stats cards
    document.getElementById('totalResults').textContent = totalResults;
    document.getElementById('averageMarks').textContent = averageMarks;
    document.getElementById('highestGrade').textContent = highestGrade;
    document.getElementById('lowestGrade').textContent = lowestGrade;

    // Grade Pie Chart
    const gradeCtx = document.getElementById('gradeChart').getContext('2d');
    new Chart(gradeCtx, {
        type: 'pie',
        data: {
            labels: ['A', 'B', 'C', 'D', 'F'],
            datasets: [{
                data: [gradeCounts.A, gradeCounts.B, gradeCounts.C, gradeCounts.D, gradeCounts.F],
                backgroundColor: ['#28a745', '#007bff', '#ffc107', '#fd7e14', '#dc3545']
            }]
        },
        options: { responsive: true }
    });

    // Marks Bar Chart (grouped by ranges)
    const marksRanges = { '0-49': 0, '50-69': 0, '70-89': 0, '90-100': 0 };
    results.forEach(r => {
        const m = parseInt(r.marks);
        if (m < 50) marksRanges['0-49']++;
        else if (m < 70) marksRanges['50-69']++;
        else if (m < 90) marksRanges['70-89']++;
        else marksRanges['90-100']++;
    });
    const marksCtx = document.getElementById('marksChart').getContext('2d');
    new Chart(marksCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(marksRanges),
            datasets: [{
                label: 'Number of Students',
                data: Object.values(marksRanges),
                backgroundColor: '#667eea'
            }]
        },
        options: { 
            responsive: true, 
            scales: { 
                y: { beginAtZero: true } 
            } 
        }
    });
});