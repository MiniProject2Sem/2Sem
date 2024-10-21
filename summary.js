// Total Summary Variables
let totalIncome = 0;
let totalExpense = 0;
let userBudget = 0;
let savingsChallengeGoal = 0;
let savingsChallengeProgress = 0;
let habitCount = 0;
let summaryChart, expenseChart; // Declare chart variables

// Function to update total summary display
function updateTotalSummary() {
    const totalSavings = totalIncome - totalExpense; // Calculate savings
    document.getElementById('totalIncome').textContent = `₹${totalIncome}`;
    document.getElementById('totalExpense').textContent = `₹${totalExpense}`;
    document.getElementById('totalSavings').textContent = `₹${totalSavings}`;

    // Update the summary chart
    if (summaryChart) {
        summaryChart.data.datasets[0].data = [totalIncome, totalExpense, totalSavings];
        summaryChart.update(); // Update the existing chart
    } else {
        const ctx = document.getElementById('summaryChart').getContext('2d');
        summaryChart = new Chart(ctx, {
            type: 'bar', // Change this to 'line' if desired
            data: {
                labels: ['Total Income', 'Total Expense', 'Total Savings'],
                datasets: [{
                    label: 'Amount (in Rupees)',
                    data: [totalIncome, totalExpense, totalSavings],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 206, 86, 0.6)'
                    ]
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Function to update totals based on transactions in local storage
function updateTotals() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Reset totals
    totalIncome = 0;
    totalExpense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else if (transaction.type === 'expense') {
            totalExpense += transaction.amount;
        }
    });

    updateTotalSummary(); // Update the summary display after calculating totals
    initializeExpenseChart(); // Update the expense chart after recalculating totals
}

// Function to handle form submission for adding transactions
document.getElementById('transactionForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    document.getElementById('customCategoryContainer').style.display = 'none'; // Hide custom category input

    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    let category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    // If 'Others' is selected, get the custom category
    if (category === 'Others') {
        category = document.getElementById('customCategory').value || 'Other'; // Default to 'Other' if empty
    }

    // Create a transaction object
    const transaction = {
        amount: amount,
        type: type,
        category: category,
        date: date,
    };

    // Add the transaction to storage
    addTransactionToStorage(transaction);

    // Update totals after adding the transaction
    updateTotals(); // Calculate totals again after adding

    // Reset input fields except the date field
    document.getElementById('amount').value = '';
    document.getElementById('customCategory').value = ''; // Clear custom category field

    // Update the transaction list display
    displayTransactions();
});

// Function to display previous transactions
function displayTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transactionListBody = document.querySelector('#transactionList tbody');

    // Clear the current list
    transactionListBody.innerHTML = '';

    // Populate the list with transactions
    transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.type === 'income' ? 'Income' : 'Expense'}</td>
            <td>₹${transaction.amount}</td>
            <td>${transaction.category}</td>
            <td>
                <button onclick="editTransaction(${index})">Edit</button>
                <button onclick="deleteTransaction(${index})">Delete</button>
            </td>
        `;
        transactionListBody.appendChild(row);
    });
}

// Function to edit a transaction
function editTransaction(index) {
    const transactions = JSON.parse(localStorage.getItem('transactions'));
    const transaction = transactions[index];

    document.getElementById('amount').value = transaction.amount;
    document.getElementById('type').value = transaction.type;
    document.getElementById('category').value = transaction.category;
    document.getElementById('date').value = transaction.date;

    // Remove the transaction to be edited
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    updateTotals(); // Recalculate totals after deletion
    displayTransactions(); // Update the transaction list
}

// Function to delete a transaction
function deleteTransaction(index) {
    let transactions = JSON.parse(localStorage.getItem('transactions'));

    // Remove the transaction
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    updateTotals(); // Recalculate totals after deletion
    displayTransactions(); // Update the transaction list
}

// Function to print transactions as a styled PDF
function printTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const totalSavings = totalIncome - totalExpense;

    let content = `
        <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4caf50; color: white; }
            h1 { text-align: center; }
            p { font-weight: bold; }
        </style>
        <h1>Transaction Report</h1>
        <p>Total Income: ₹${totalIncome}</p>
        <p>Total Expense: ₹${totalExpense}</p>
        <p>Total Savings: ₹${totalSavings}</p>
        <h3>Transactions:</h3>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount (₹)</th>
                    <th>Category</th>
                </tr>
            </thead>
            <tbody>`;

    transactions.forEach(transaction => {
        content += `
            <tr>
                <td>${transaction.date}</td>
                <td>${transaction.type === 'income' ? 'Income' : 'Expense'}</td>
                <td>₹${transaction.amount}</td>
                <td>${transaction.category}</td>
            </tr>`;
    });

    content += '</tbody></table>';

    const win = window.open('', '', 'height=600,width=800');
    win.document.write(content);
    win.document.close();
    win.print();
}
// Limit the number of transactions stored per month
function addTransactionToStorage(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Limit the list to 10,000 transactions per month
    if (transactions.length >= 10000) {
        transactions.shift(); // Remove the oldest transaction to make room for the new one
    }

    // Add new transaction
    transactions.push(transaction);

    // Save to local storage
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Budgeting Tool Functionality
function setBudget() {
    userBudget = parseFloat(document.getElementById('budgetInput').value);
    document.getElementById('budgetStatus').textContent = `Your budget is set to ₹${userBudget}`;
    document.getElementById('budgetInput').value = '';
}

// Daily Savings Challenge Functionality
function startSavingsChallenge() {
    savingsChallengeGoal = parseFloat(document.getElementById('savingsAmount').value);
    savingsChallengeProgress = 0; // Reset progress
    document.getElementById('savingsStatus').textContent = `You started a daily savings challenge to save ₹${savingsChallengeGoal} every day.`;
}

// Financial Habit Tracker Functionality
function trackHabit() {
    habitCount++;
    document.getElementById('habitStatus').textContent = `You have achieved ${habitCount} No-Spend Days!`;
}

// Function to reset financial data
function resetData() {
    localStorage.removeItem('transactions'); // Clear the transactions from local storage
    totalIncome = 0;
    totalExpense = 0;
    updateTotalSummary(); // Refresh the displayed totals to zero
    displayTransactions(); // Clear the transaction list
}

// Function to initialize the pie chart with real transaction data
function initializeExpenseChart() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const expenseData = {};
    
    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            expenseData[transaction.category] = (expenseData[transaction.category] || 0) + transaction.amount;
        }
    });

    const labels = Object.keys(expenseData);
    const data = Object.values(expenseData);

    const ctx = document.getElementById('expenseChart').getContext('2d');
    if (expenseChart) {
        expenseChart.destroy(); // Destroy previous instance if exists
    }

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4caf50', '#ff9f40', '#9966ff', '#ffcd56', '#4bc0c0']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('#sidebar nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        const offset = document.querySelector('header').offsetHeight; // Header height for smooth scrolling
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    });
});

// Initialize functionalities on page load
window.onload = function () {
    updateTotals(); // Call the function to calculate and display totals
    displayTransactions(); // Display the transactions on load
    initializeExpenseChart(); // Initialize the expense chart
    updateCategoryOptions();
};
document.getElementById('category').addEventListener('change', function() {
    const customCategoryContainer = document.getElementById('customCategoryContainer');
    if (this.value === 'Others') {
        customCategoryContainer.style.display = 'inline-block'; // Show next to category dropdown
    } else {
        customCategoryContainer.style.display = 'none'; // Hide custom category input
    }
});
// Ensure clicking anywhere in the date field triggers the date picker
document.getElementById('date').addEventListener('click', function() {
    this.showPicker(); // Open the date picker programmatically
});
// Define categories for Income and Expense
const incomeCategories = [
    "Salary", "Bonus", "Investment", "Gift", "Rental Income", "Freelancing", "Others"
];

const expenseCategories = [
    "Groceries", "Entertainment", "Utilities", "Rent", "Transportation",
    "Health", "Education", "Dining Out", "Insurance", "Others"
];
// Function to update the category dropdown based on the selected type
function updateCategoryOptions() {
    const type = document.getElementById('type').value;
    const categorySelect = document.getElementById('category');

    // Clear existing options
    categorySelect.innerHTML = '';

    // Determine which categories to use
    const categories = (type === 'income') ? incomeCategories : expenseCategories;

    // Populate the category dropdown with relevant options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Hide custom category input initially
    document.getElementById('customCategoryContainer').style.display = 'none';
}
// Event listener for Type change to update categories
document.getElementById('type').addEventListener('change', updateCategoryOptions);