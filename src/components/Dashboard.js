import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Container, Typography, Button, List, ListItem, ListItemText, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: '' });


    const handleLogout = () => {
        logout();
        navigate('/login');
    };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/expenses/user/${user.id}`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.username}!
      </Typography>
      <Button onClick={handleLogout} variant="contained" color="secondary">
        Logout
      </Button>

      <Typography variant="h5" gutterBottom>
        Add New Expense
      </Typography>
      <form onSubmit={handleAddExpense}>
        <TextField
          label="Description"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          required
        />
        <TextField
          label="Amount"
          type="number"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          required
        />
        <TextField
          label="Category"
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Add Expense
        </Button>
      </form>

      <Typography variant="h5" gutterBottom>
        Your Expenses
      </Typography>
      <List>
        {expenses.map((expense) => (
          <ListItem key={expense.id}>
            <ListItemText
              primary={expense.description}
              secondary={`${expense.amount} - ${expense.category}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Dashboard;