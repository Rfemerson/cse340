const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/* ********************************
* Check Inventory Rules
* ******************************* */
validate.inventoryAddRules = () => {
    return [
        // make is required and must be a string
        body("inv_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a car make."), // on error this message is sent

        //model is required and must be a string
        body("inv_model")
            .isLength({ min: 2 })
            .withMessage("Please provide a car model."), 

        //year is required and must be 4 digits
        body("inv_year")
            .trim()
            .isNumeric()
            .withMessage("A year is required."),

        // Description is required and must be a string
        body("inv_description")
            .isLength({ min: 1 })
            .withMessage("Please provide a description of vehicle."),

        // Image is required
        body("inv_image")
            .notEmpty()
            .withMessage("Please provide a picture."),

        // // Thumbnail is required
        body("inv_thumbnail")
            .notEmpty()
            .withMessage("Please provide a thumbnail image."),

        // Must include a price
        body("inv_price")
            .isNumeric()
            .withMessage("Please provide a price."),

        // Must include Mileage
        body("inv_miles")
            .trim()
            .isNumeric()
            .withMessage("Please include the mileage."),

        // Must include a color
        body("inv_color")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide a color."),

    ]
}

/* *********************************
* Check Inventory Data
* ******************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { 
        inv_make, 
        inv_model, 
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color

    } = req.body

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/addInventory", {
            errors,
            title: "Vehicle Management",
            nav,
            inv_make, 
            inv_model, 
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

/* *********************************
* Check Update Invenotory Data
* ******************************** */
validate.checkUpdateInventoryData = async (req, res, next) => {
    const { 
        inv_make, 
        inv_model, 
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        inv_id

    } = req.body

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const invData = await invModel.getDetailsByInventoryId(inv_id)
        const itemName = `${invData.inv_make} ${invData.inv_model}`
        res.render("/inv/edit/", {
            errors,
            title: "Edit" + itemName,
            nav,
            inv_make, 
            inv_model, 
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            inv_id
        })
        return
    }
    next()
}

module.exports = validate