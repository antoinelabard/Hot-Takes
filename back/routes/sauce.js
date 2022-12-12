const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/sauce')

router.post('/sauces', userCtrl.addSauce)
router.put('/sauces/:id', userCtrl.updateSauceById)
router.delete('/sauces/:id', userCtrl.deleteSauceById)
router.post('/sauces/:id/like', userCtrl.likeSauceById)
router.post('/sauces/:id/like', userCtrl.likeSauceById)
router.get('/sauces', userCtrl.getSauces)
router.get('/sauces/:id', userCtrl.getSauceById)

module.exports = router