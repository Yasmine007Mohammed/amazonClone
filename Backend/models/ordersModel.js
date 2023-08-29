const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "user2",
            required: [true, "order must be by user"],
        },
        cartItems: [
            {
                product: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: "Product",
                },
                price: Number,
                quantity: Number,
            },
        ],
        shippingPrice: {
            type: Number,
            default: 0,
        },
        totalOrderPrice: { type: Number },
        paymentMethodsType: {
            type: String,
            enum: ['cash', 'card'],
            default: 'cash'
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        shippingAddress: {
            details: String,
            phone: String,
            city: String,
            postalCode: String,
        },
        paidAt: Date,
        isDelivered: {
            type: Boolean,
            default: false
        },
        DeliveredAt: Date
    },
    { timestamps: true }
);

ordersSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name email' }).populate({
        path: 'cartItems.product',
        select: 'title imageCover  ',
    });;
    next();
});


module.exports = mongoose.model("orders", ordersSchema);
