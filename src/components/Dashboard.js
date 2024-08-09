import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Container, Typography, Button, List, ListItem, ListItemText, TextField, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: '' });
    const [income, setIncome] = useState({ amount: '', description: '' });
    const [financialData, setFinancialData] = useState({
        totalExpenditure: 0,
        totalIncome: 0,
        remainingIncome: 0,
        percentageExpended: 0
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        fetchExpenses();
        fetchIncome();
    }, []);

    useEffect(() => {
        updateFinancialData();
    }, [expenses, income]);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/expenses/user/${user.id}`);
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const fetchIncome = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/income/user/${user.id}`);
            setIncome(response.data);
        } catch (error) {
            console.error('Error fetching income:', error);
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

    const handleAddIncome = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/income', { ...income, userId: user.id });
            setIncome({ amount: '', description: '' });
            fetchIncome();
        } catch (error) {
            console.error('Error adding income:', error);
        }
    };

    const updateFinancialData = () => {
        const totalExp = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
        const totalInc = parseFloat(income.amount) || 0;
        const remaining = totalInc - totalExp;
        const percentage = totalInc > 0 ? (totalExp / totalInc) * 100 : 0;

        setFinancialData({
            totalExpenditure: totalExp.toFixed(2),
            totalIncome: totalInc.toFixed(2),
            remainingIncome: remaining.toFixed(2),
            percentageExpended: percentage.toFixed(2)
        });
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
                                <option value="jvalery">jvalery</option>
                                {/* Add more options as needed */}
                            </TextField>
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
                        <form onSubmit={handleAddIncome}>
                            <TextField
                                fullWidth
                                label="Amount"
                                type="number"
                                value={income.amount}
                                onChange={(e) => setIncome({ ...income, amount: e.target.value })}
                                required
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={income.description}
                                onChange={(e) => setIncome({ ...income, description: e.target.value })}
                                required
                                margin="normal"
                            />
                            <Button type="submit" fullWidth variant="contained" color="primary">
                                Add Income
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                        <Typography variant="h5" gutterBottom>
                            Financial Summary
                        </Typography>
                        <Typography>Total Expenditure: ${financialData.totalExpenditure}</Typography>
                        <Typography>Remaining Income: ${financialData.remainingIncome}</Typography>
                        <Typography>Percentage Expended: {financialData.percentageExpended}%</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Dashboard;