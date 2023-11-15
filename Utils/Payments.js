require('dotenv').config();
const https = require('https');
const InitPay = require('../Models/InitializedPayments')
const InitiatePay = async (res,PaymentID,PaymentType,Reason,Amount,userEmail)=>{
    //first check the logged in user
    //logic -> check if the user had initialized payment, if initialized and had paid partial amount, set the amount to pay as the difference
    let payAmount = Amount * 100
    const secret_key = process.env.LIVE_SECRET_KEY
    const params = JSON.stringify({
        "email": userEmail,
        "amount": payAmount,
        // "currency":"USD",
        "metadata": {
          "custom_fields": [
            {
                //set the value for the order the client is paying for
              "value": Reason,
              "display_name": "Payment for",
              "variable_name": "payment_for"
            },
            {
                "value": PaymentID,
                "display_name": "Payment Ref",
                "variable_name": "payment_ref"
            },
            {
                "value": PaymentType,
                "display_name": "Payment For",
                "variable_name": "payment_for"
            }
          ]
        },
      })
      
    const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
        headers: {
            Authorization: `Bearer ${secret_key}`,
            'Content-Type': 'application/json'
        }
    }
    
    const reqData = https.request(options, resp => {
        let data = ''
        resp.on('data', (chunk) => {
            data += chunk
        });
        resp.on('end', async () => {
            const ed = JSON.parse(data)
            if(ed.status){
                const initLog = await InitPay.create({
                    InitStatus:ed.status,
                    Message:ed.message,
                    AuthUrl:ed.data['authorization_url'],
                    AccessCode:ed.data['access_code'],
                    PaymentRef:ed.data['reference'],
                    PaymentReason:Reason,
                    UserEmail:userEmail,
                    OurRef:PaymentID,
                    PaymentType:PaymentType,
                    AmountPaid:Amount,
                })
                if(initLog){
                    res.redirect(ed.data['authorization_url'])
                }
            }else{
                if(PaymentType==='CheckOut'){
                    res.redirect('/All-Products')
                }else{
                    res.redirect("/Dashboard")
                }
            }
        })
    })
    .on('error', error => {
        //if there is an error, return an error and redirect to dashboard
        res.status(400).redirect("/Dashboard")
    })
    reqData.write(params)
    reqData.end()

}

module.exports = InitiatePay