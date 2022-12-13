const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const userCtrl = require('../controllers/sauce')

router.post('/sauces', auth, multer, userCtrl.addSauce)
router.put('/sauces/:id', auth, multer, userCtrl.updateSauceById)
router.delete('/sauces/:id', auth, userCtrl.deleteSauceById)
router.post('/sauces/:id/like', auth, userCtrl.likeSauceById)
router.get('/sauces', userCtrl.getSauces)
router.get('/sauces/:id', userCtrl.getSauceById)

module.exports = router