const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Deliver  inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ******************************
* Deliver inventory by details view
* ******************************/
invCont.buildByInventoryId = async function (req, res, next) {
  console.log(this.buildByInventoryId)
  const inv_id = req.params.inventoryId;
  const data = await invModel.getDetailsByInventoryId(inv_id);
  console.log("VEHICLE DATA =>", data)
  const invDesc = await utilities.buildInventoryDetails(data);
  if (data.length > 0) {
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const make = data[0].inv_make;
    const model = data[0].inv_model;
    const year = data[0].inv_year;
    res.render("./inventory/details", {
      title: `${make} ${model} - ${year}`,
      invDesc,
      grid,
      nav,
    });
  } else {
    const error = new error("Sorry, Car not Found")
    error.status = 404;
    next(error);
  }
}

/* ***************************
  *  Deliver Management Page
  * ***************************/
invCont.buildManagementPage = async function(req, res, next) {
  try {
      let nav = await utilities.getNav()
      const classificationSelect = await utilities.buildClassificationList()
      res.render("inventory/management", {
          title: "Inventory Management",
          nav,
          classificationSelect,
          flash: { notice: req.flash("notice") }
      })
  } catch (err) {
      next(err)
  }
}

/* *********************************
  * New Class Page Build
  * *********************************/
invCont.buildNewClass = async function(req, res, next) {
  try {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
          title: "Add Classification",
          nav,
          flash: { notice: req.flash("notice") },
          errors: [],
          classification_name: ""
      })
  } catch (err) {
      next(err)
  }
}

/* ***************************
* Add Classification to Database
* *************************** */
invCont.addClassification = async function(req, res, next) {
  try {
      let nav = await utilities.getNav()
      const { classification_name } = req.body

      // Server validation
      const pattern = /^[A-Za-z0-9]+$/
      let errors = []
      if (!classification_name || !pattern.test(classification_name)) {
          errors.push({ msg: "Classification name must not contain spaces or special characters." })
      }
      if (errors.length > 0) {
          return res.status(400).render("inventory/add-classification", {
              title: "Add Classification",
              nav,
              flash: { notice: req.flash("notice") },
              errors,
              classification_name
          })
      }

      // Insert into DataBase
      const result = await require("../models/inventory-model").addClassification(classification_name)
      if (result) {
          req.flash("notice", "Classification added successfully!")
          nav = await utilities.getNav() // Refresh nav to include new classification
          return res.status(201).render("inventory/management", {
              title: "Inventory Management",
              nav,
              flash: { notice: req.flash("notice") }
          })
      } else {
          req.flash("notice", "Failed to add classification.")
          return res.status(500).render("inventory/add-classification", {
              title: "Add Classification",
              nav,
              flash: { notice: req.flash("notice") },
              errors: [{ msg: "Database insertion failed." }],
              classification_name
          })
      }
  } catch (err) {
      next(err)
  }
}

/* **************************
* New Car Add page Build
* **************************/
invCont.buildInventoryPage = async function (req, res, next) {
  try {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList()
      res.render("inventory/addInventory", {
          title: "Add Inventory",
          nav,
          classificationList,
          flash: { notice: req.flash("notice") },
          errors: [],
          ...req.body
      })
  } catch (err) {
      next(err)
  }
}

/* **************************
* Add New Car to database
* **************************/
invCont.addCarToDatabase = async function (req, res, next) {
  try {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(req.body.classification_id)
      const {
          classification_id, inv_make, inv_model, inv_year, inv_description,
          inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      } = req.body

      // Server-side validation
      let errors = []
      if (!classification_id) errors.push({ msg: "Classification is required." })
      if (!inv_make) errors.push({ msg: "Make is required." })
      if (!inv_model) errors.push({ msg: "Model is required." })
      if (!inv_year || inv_year < 1900 || inv_year > 2099) errors.push({ msg: "Year must be between 1900 and 2099." })
      if (!inv_description) errors.push({ msg: "Description is required." })
      if (!inv_image) errors.push({ msg: "Image path is required." })
      if (!inv_thumbnail) errors.push({ msg: "Thumbnail path is required." })
      if (!inv_price || inv_price < 0) errors.push({ msg: "Price must be a positive number." })
      if (!inv_miles || inv_miles < 0) errors.push({ msg: "Miles must be a positive number." })
      if (!inv_color) errors.push({ msg: "Color is required." })

      if (errors.length > 0) {
          return res.status(400).render("inventory/addInventory", {
              title: "Add Inventory",
              nav,
              classificationList,
              flash: { notice: req.flash("notice") },
              errors,
              ...req.body
          })
      }

      // Insert into DB
      const result = await require("../models/inventory-model").addNewCar({
          classification_id, inv_make, inv_model, inv_year, inv_description,
          inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      })
      if (result) {
          req.flash("notice", "Inventory item added successfully!")
          nav = await utilities.getNav()
          return res.status(201).render("inventory/management", {
              title: "Inventory Management",
              nav,
              flash: { notice: req.flash("notice") }
          })
      } else {
          req.flash("notice", "Failed to add inventory item.")
          return res.status(500).render("inventory/addInventory", {
              title: "Add Inventory",
              nav,
              classificationList,
              flash: { notice: req.flash("notice") },
              errors: [{ msg: "Database insertion failed." }],
              ...req.body
          })
      }
  } catch (err) {
      next(err)
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemDataArr = await invModel.getDetailsByInventoryId(inv_id)
  const itemData = itemDataArr[0]
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: [],
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    classification_name: itemData.classification_name
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/edit/" + inv_id)
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont