import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Container, Typography, Button, TextField, Grid, Paper, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: '' });
    const [newBudget, setNewBudget] = useState({ amount: '', category: '' });
    const [financialSummary, setFinancialSummary] = useState({});

    const categories = ['Grocery', 'Entertainment', 'Subscription', 'Other'];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        fetchExpenses();
        fetchBudgets();
    }, []);

    useEffect(() => {
        updateFinancialSummary();
    }, [expenses, budgets]);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/expenses/getAll`);
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const fetchBudgets = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/budgets/getAllBudgets`);
            setBudgets(response.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/expenses', { ...newExpense, userId: user.id });
            setNewExpense({ description: '', amount: '', category: '' });
            fetchExpenses();
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const handleAddBudget = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/budgets', { ...newBudget, userId: user.id });
            setNewBudget({ amount: '', category: '' });
            fetchBudgets();
        } catch (error) {
            console.error('Error adding budget:', error);
        }
    };

    const updateFinancialSummary = () => {
        const summary = categories.reduce((acc, category) => {
            const budgetAmount = budgets
                .filter(b => b.category === category)
                .reduce((sum, b) => sum + parseFloat(b.amount), 0);
            const expenseAmount = expenses
                .filter(e => e.category === category)
                .reduce((sum, e) => sum + parseFloat(e.amount), 0);
            acc[category] = {
                budget: budgetAmount.toFixed(2),
                expense: expenseAmount.toFixed(2),
                remaining: (budgetAmount - expenseAmount).toFixed(2)
            };
            return acc;
        }, {});

        const totalBudget = Object.values(summary).reduce((sum, s) => sum + parseFloat(s.budget), 0);
        const totalExpense = Object.values(summary).reduce((sum, s) => sum + parseFloat(s.expense), 0);
        summary.total = {
            budget: totalBudget.toFixed(2),
            expense: totalExpense.toFixed(2),
            remaining: (totalBudget - totalExpense).toFixed(2)
        };

        setFinancialSummary(summary);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Personal Budgeting App
            </Typography>
            <Button onClick={handleLogout} variant="contained" color="secondary">
                Logout
            </Button>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                        <Typography variant="h5" gutterBottom>
                            Add Expense
                        </Typography>
                        <form onSubmit={handleAddExpense}>
                            <TextField
                                fullWidth
                                label="Amount"
                                type="number"
                                value={newExpense.amount}
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                select
                                label="Category"
                                value={newExpense.category}
                                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                                required
                                margin="normal"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth
                                label="Description"
                                value={newExpense.description}
                                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                required
                                margin="normal"
                            />
                            <Button type="submit" fullWidth variant="contained" color="primary">
                                Add Expense
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                        <Typography variant="h5" gutterBottom>
                            Add Budget
                        </Typography>
                        <form onSubmit={handleAddBudget}>
                            <TextField
                                fullWidth
                                label="Amount"
                                type="number"
                                value={newBudget.amount}
                                onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                select
                                label="Category"
                                value={newBudget.category}
                                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                                required
                                margin="normal"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                ))}
                            </TextField>
                            <Button type="submit" fullWidth variant="contained" color="primary">
                                Add Budget
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                        <Typography variant="h5" gutterBottom>
                            Financial Summary
                        </Typography>
                        {Object.entries(financialSummary).map(([category, data]) => (
                            <div key={category}>
                                <Typography variant="h6">{category}</Typography>
                                <Typography>Budget: ${data.budget}</Typography>
                                <Typography>Expenses: ${data.expense}</Typography>
                                <Typography>Remaining: ${data.remaining}</Typography>
                            </div>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Dashboard;