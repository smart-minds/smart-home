const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const validate = require('mongoose-validator');

const ProfilSchema = require('./profil_schema');

let UserSchema = mongoose.Schema({
    phone: {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
        unique: true,
        sparse: true, //sparse is because now we have two possible unique keys that are optional
        validate: [validate({
            validator: 'isNumeric',
            arguments: [7, 20],
            message: 'Not a valid phone number.',
        })]
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
        unique: true,
        sparse: true,
        validate: [validate({
            validator: 'isEmail',
            message: 'Not a valid email.',
        }), ]
    },
    password: { 
        type: String 
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },

    profil: {
        type: ProfilSchema
    },

    admin: {
        type: Boolean
    }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {

    if (this.isNew && (this.profil == null)) {
        this.profil = {};
    }

    if (this.isModified('password') || this.isNew) {

        let err, salt, hash;
        [err, salt] = await to(bcrypt.genSalt(10));
        if (err) TE(err.message, true);

        [err, hash] = await to(bcrypt.hash(this.password, salt));
        if (err) TE(err.message, true);

        this.password = hash;

    } else {
        return next();
    }
})

UserSchema.methods.comparePassword = async function(pw) {
    let err, pass;
    if (!this.password) TE('password not set');

    [err, pass] = await to(bcrypt_p.compare(pw, this.password));
    if (err) TE(err);

    if (!pass) TE('invalid password');

    return this;
}

UserSchema.methods.getJWT = function() {
    let expiration_time = parseInt(CONFIG.jwt_expiration);
    return "Bearer " + jwt.sign({ user_id: this._id }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
};

UserSchema.methods.toWeb = function() {
    let json = this.toJSON();
    json.id = this._id; //this is for the front end
    return json;
};

UserSchema.methods.toView = function() {
    this.password = '';
    return this;
}

let User = module.exports = mongoose.model('User', UserSchema);