const express = require('express');
const path = require('path');
const fs = require('fs');

const data = {
    employees: require(path.join(__dirname, '../models/employees.json')),
    setEmployees: function(data) {
        this.employees = data;
        fs.writeFileSync(
            path.join(__dirname, '../models/employees.json'),
            JSON.stringify(data)
        );
    }
};

const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const updateEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp._id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
    }
    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;
    const filteredArray = data.employees.filter(emp => emp._id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, employee];
    data.setEmployees(unsortedArray.sort((a, b) => a._id > b._id ? 1 : -1));
    res.json({ message: 'Employee updated', employee });
};

const createEmployee = (req, res) => {
    const newEmployee = {
        _id: data.employees[data.employees.length-1]._id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    };
    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({"message": "Firstname and lastname are required"});
    }
    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(newEmployee);
};

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp._id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({"message": `Employee ID ${req.body.id} not found`});
    }
    const filteredArray = data.employees.filter(emp => emp._id !== parseInt(req.body.id));
    data.setEmployees([...filteredArray]);
    res.json(data.employees);
};

const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp._id === parseInt(req.params.id));
    if (!employee) {
        return res.status(400).json({"message": `Employee ID ${req.params.id} not found`});
    }
    res.json(employee);
};

module.exports = {
    getAllEmployees,
    updateEmployee,
    createEmployee,
    deleteEmployee,
    getEmployee
};