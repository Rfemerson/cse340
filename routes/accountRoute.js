const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build account login by account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to build Registration
router.get("/register", utilities.handleErrors(accountController.buildRegister))
//Route to account management view
router.get("/management", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;