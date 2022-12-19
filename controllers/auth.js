const User = require('../models/user')
const emailValidator = require('email-validator')
const passwordValidator = require('password-validator')
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')

var schema = new passwordValidator()
schema
    .is().min(8)
    .is().max(20)
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)

exports.signup = (req, res, next) => {
    let email = req.body.email
    let password = req.body.password

    if (!email || !password) {
        res.status(500).json({ message: "Email ou mot de passe vide." })
        return
    }
    if (!emailValidator.validate(email)) {
        res.status(400).json({ message: "Email incorrect." })
        return
    }
    if (!schema.validate(password)) {
        res.status(400).json({ message: "Le mot de passe doit contenir entre 8 et 20 caractères.Il doit avoir au moins une minuscule, une majuscule et 2 chiffre." })
        return
    }
    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email: email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé.' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    if (!email || !password) {
        res.status(500).json({ message: "Email ou mot de passe vide." })
        return
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' })
            }
            bcrypt.compare(password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_SECRET,
                            { expiresIn: '24h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}
