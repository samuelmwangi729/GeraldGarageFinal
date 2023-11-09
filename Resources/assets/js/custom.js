//get the subs form to stop any action 

const forms = document.querySelector("form#subscribe")
const errorEmail = document.querySelector("span#emailError")
forms.addEventListener('submit',async(e)=>{
    e.preventDefault()
    const subsEmail = forms.Email.value
    if(subsEmail==null || !subsEmail || subsEmail ==""){
        errorEmail.textContent='The email field is required'
    }else{
        //attempt to submit the data
        const res = await fetch("/Subscribe",{
            method:'POST',
            body:JSON.stringify({
                subsEmail
            }),
            headers:{
                'Content-Type':'application/json'
            }
        })
        const dataBack = await res.json()
        if(dataBack.status==='success'){
            errorEmail.textContent = 'Successfully Subscribed'
        }else{
            errorEmail.textContent = dataBack.data
        }
    }
})

