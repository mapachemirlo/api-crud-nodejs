const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchena = new Schema(
    {
        title: { type: String, required: true },
        desc: { type: String, required: true },
        price: { type: Number, required: true },
        images: { type: [{ type: String, require: true }], default: [] },      
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true } 
    },{
        timestamps: true
    }
);

const model = mongoose.model('Product', productSchena);

module.exports = model;