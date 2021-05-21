import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
//config mailer
let adminEmail = process.env.MAIL_USER;
let adminPassword = process.env.MAIL_PASSWORD;


export const sendMail = (to, subject , htmlContent)=>{
    let transporter = nodeMailer.createTransport({
    service:"gmail",
      auth:{
          user:adminEmail,
          pass:adminPassword,
      },
      //tls:{rejectUnauthorized: false}
    });
    let options = {
      from: adminEmail,
      to:to,
      subject:subject,
      html:htmlContent
    }
    return transporter.sendMail(options); // this default return a promise
}
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