// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// vehilce details route
router.get("/details/:inventoryId", invController.buildByInventoryId);

// build vehicle management page
router.get("/management", invController.buildManagementPage)

// add class route
router.get("/add-classification", invController.buildNewClass)
router.post("/add-classification",invController.addClassification)

// add vehicle route
router.get("/addInventory", invController.buildInventoryPage)
router.post("/addInventory",invController.addCarToDatabase);

// vehicle inventory modification route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// vehicle edit route
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))
// vehicle delete route
router.get("/delete/:inventoryId", utilities.handleErrors(invController.deleteVehicleData))
// update vehicle post route
router.post(
    "/update",
    // invValidate.inventoryAddRules(),
    invValidate.checkUpdateInventoryData,
    utilities.handleErrors(invController.updateInventory)
);

//Process vehicle delete
router.post("/deleteComplete", utilities.handleErrors(invController.deleteInventory))

module.exports = router;