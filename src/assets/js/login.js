// Credentials
const cred = {
  user: "Warehouse_Manager",
  pass: "password"
}

// Check for loging credentials
function checkLogin(userName, password) {
  return ((userName == cred.user) && (password == cred.pass)) ? true : false
}
