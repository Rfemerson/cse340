const invModel = require("../models/inventory-model")
const Util = {}

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/details/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="/' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/details/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

/* ***************************
* Build details view
* ***************************/
Util.buildInventoryDetails = async function(data){
  let invDesc = ""
  if(data.length > 0){
      invDesc += '<div class="detailpage">'
      data.forEach(vehicle => {
          invDesc += '<h2>' + vehicle.inv_make +' '+ vehicle.inv_model +' Details</h2>'
          invDesc += '<img id="detailimg" src="' + vehicle.inv_image + '"alt="Image of '+ vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" style="max-width:100%" />'
          invDesc += '<br />'
          invDesc += '<h3 class="detailPrice"><span class="label">Price: </span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</h3>'
          invDesc += '<section id="invDetails">'
          invDesc += vehicle.inv_description
          invDesc += '<h3 class="detailInfo"><span class="label">Color:</span> ' + vehicle.inv_color + '</h3>'
          invDesc += '<h3 class="detailInfo"><span class="label">Miles:</span> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</h3>'
          invDesc += '</section>'
          
      })
      invDesc += '</div>'
      
  } else {
      invDesc += '<p class="notice">Sorry, no matching description could be found.</p>'
  }
  return invDesc
}

/* ********************
* Classification List 
* **********************/
Util.buildClassificationList = async function (req,res,next) {
  let data = await invModel.getClassifications()
  let list = '<select id="classificationList" name="classification_name" required>'
  list += '<option></option>'
  data.rows.forEach((row) => {
      list += '<option value="' + row.classification_id + '">' + row.classification_name +  '</option>'
  })
  list += '</select>'
  return list
}

/* ****************************************
* Middleware For Handling Errors
* Wrap other function in this for 
* General Error Handling
**************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util