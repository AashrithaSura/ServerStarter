const express = require('express');
const employeeRouter = express.Router();
const {
    getAllEmployees,
    updateEmployee,
    createEmployee,
    deleteEmployee,
    getEmployee
} = require('../../controllers/empcontroller');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles')

employeeRouter.route('/')
    .get(getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),createEmployee)
    .put(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin),deleteEmployee)

employeeRouter.route('/:id')
    .get(getEmployee);

module.exports = employeeRouter;