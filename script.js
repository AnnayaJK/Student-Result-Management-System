document.addEventListener('DOMContentLoaded', function() {
    const resultForm = document.getElementById('resultForm');
    const resultsBody = document.getElementById('resultsBody');
    const searchInput = document.getElementById('searchInput');
    let results = JSON.parse(localStorage.getItem('studentResults')) || [];
    let editIndex = -1;

    // Render results
    function renderResults(filteredResults = results) {
        if (resultsBody) {
            resultsBody.innerHTML = '';
            filteredResults.forEach((result, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${result.name}</td>
                    <td>${result.subject}</td>
                    <td>${result.marks}</td>
                    <td>${result.grade}</td>
                    <td>
                        <button class="btn btn-edit btn-sm me-2" onclick="editResult(${index})">Edit</button>
                        <button class="btn btn-delete btn-sm" onclick="deleteResult(${index})">Delete</button>
                    </td>
                `;
                resultsBody.appendChild(row);
            });
        }
    }

    // Add or update result (only on add-result.html)
    if (resultForm) {
        resultForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('studentName').value;
            const subject = document.getElementById('subject').value;
            const marks = document.getElementById('marks').value;
            const grade = document.getElementById('grade').value;

            if (editIndex === -1) {
                results.push({ name, subject, marks, grade });
            } else {
                results[editIndex] = { name, subject, marks, grade };
                editIndex = -1;
            }

            localStorage.setItem('studentResults', JSON.stringify(results));
            resultForm.reset();
            renderResults();
        });
    }

    // Edit result
    window.editResult = function(index) {
        const result = results[index];
        if (document.getElementById('studentName')) {
            document.getElementById('studentName').value = result.name;
            document.getElementById('subject').value = result.subject;
            document.getElementById('marks').value = result.marks;
            document.getElementById('grade').value = result.grade;
            editIndex = index;
        } else {
            alert('Edit functionality is available on the Add Result page.');
        }
    };

    // Delete result
    window.deleteResult = function(index) {
        results.splice(index, 1);
        localStorage.setItem('studentResults', JSON.stringify(results));
        renderResults();
    };

    // Search functionality (only on search-results.html)
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = searchInput.value.toLowerCase();
            const filtered = results.filter(result => result.name.toLowerCase().includes(query));
            renderResults(filtered);
        });
    }

    // Initial render
    renderResults();
});