import jwt from 'jsonwebtoken';
// import mg from 'mailgun-js';

export const generateToken = (user) => {
    return jwt.sign({
        _id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin,
        isSeller:user.isSeller
    },
    process.env.JWT_SECRET || 'something secret',
    {
        expiresIn: '30d',
    });
}
export const isAuth = (req,res,next) => {
    const authorization = req.headers.authorization;
    if(authorization){
        const token = authorization.slice(7,authorization.length); //Bearer xxx
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (error,decode) => {
                if(error){
                    res.status(401).send({message:'Invalid Token'})
                }
                req.user = decode;
                next();
            }
        );
    }else{
        res.status(401).send({message:"no token"});
    }
}

export const  isAdmin = (req,res,next) => {
    if(req.user?.isAdmin){
        next();
    }else{
        res.status(401).send({message:'Invalid Admin token'})
    }
}
export const isSeller = (req,res,next)=>{
    if(req.user.isSeller){
        next();   
    }else{
        res.status(401).send({message:'invalid seller token'})
    }
}
export const isSellerAndAdmin = (req,res,next)=>{
    if(req.user?.isAdmin && req.user?.isSeller){
        next();
    }
    res.status(401).send({message:'function only spend on for person both admin and seller'});
}
export const isSellerOrAdmin = (req,res,next)=>{
    if(req.user && (req.user.isSeller || req.user.isAdmin)){
        next();
    }else{
        res.status(401).send({message:'Invalid Admin/Seller Token'});
    }
}
export const prices = [
    {
        name:'Any',
        min:0,
        max:0
    },
    {
        name:`$1 to $10`,
        min:1,
        max:10
    },
    {
        name:`$10 to $100`,
        min:10,
        max:100
    },
    {
        name:`$100 to $1000`,
        min:100,
        max:1000
    }
];
export const ratings = [
    {
        name:'4stars & up',
        rating:4
    },
    {
        name:'3stars & up',
        rating:3
    },
    {
        name:'2stars & up',
        rating:2
    },
    {
        name:'1stars & up',
        rating:1
    }
]
export const mailgun = () => mg({
        apiKey:process.env.MAILGUN_API_KEY,
        domain:process.env.MAILGUN_DOMAIN,
    });

export const payOrderEmailTemplate=(order)=>{
    return `<h1>Thanks for shopping with us</h1>
    <p>Hi ${order.user.name}</p>
    <p>We have finished processing your order</p>
    <h2>[Order ${order._id} (${order.createdAt.toString().substring(0,10)})]</h2>
    <table>
        <thead>
            <td><strong>Product</strong></td>
            <td><strong>Quantity</strong></td>
            <td><strong align="right">Price</strong></td>
        </thead>
        <tbody>
            ${order.orderItems.map(item=>`
            <tr>
                <td>${item.name}</td>
                <td align="center">${item.qty}</td>
                <td align="right">${item.price.toFixed(2)}</td>
            </tr>
            `).join('\n')}
        </tbody>
        <tfoot>
        <tr>
            <td colspan="2">Items Price:</td>
            <td align="right">$${order.itemsPrice.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="2">Tax Price:</td>
            <td align="right">$${order.taxPrice.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="2">Payment Method:</td>
            <td align="right">${order.paymentMethod}</td>
        </tr>
    </table>
    <h2>Shipping address</h2>
    <p>
        ${order.shippingAddress.fullName}<br/>
        ${order.shippingAddress.address}<br/>
        ${order.shippingAddress.city} ,
        ${order.shippingAddress.country},
        ${order.shippingAddress.postalCode}<br/>
    </p>
    <hr/>
    <p>
        Thanks for shopping with us
    </p>
    `

}