class Login {
    constructor(form, fields){
        this.form = form;
        this.fields = fields;
        this.validatonSubmit();
    }

    validatonSubmit(){
        let self = this;
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            var error = 0;
            self.fields.forEach((field) => {
                const input = document.querySelector(`#${field}`);
                if(self.validateFields(input) == false){
                    error++;
                }
            });
            if(error == 0){
                //API bejelentkezés itt történik
                var data = {
                    email: document.querySelector(`#email`).value,
                    password: btoa(document.querySelector(`#password`).value),
                };

                fetch("https://api.foksz.dvpc.hu/api/Account/login", {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                })
                .then(async (data) => {
                    if(data.status == 200){
                        localStorage.setItem("user", JSON.stringify(await data.json()));
                        localStorage.setItem("auth", 1);
                        this.form.submit();
                    }else{
                        console.error("Error:", data.message);
                        alert("Az emailed vagy a jelszavad hibás! Kérlek próbáld újra!");
                    }
                })
                .catch((data) => {
                    console.error("Error:", data.message);
                });
            }
        });
    }

    //ha üresen hagy mezőt a felhasználó
    validateFields(field){
        if(field.value.trim() == ""){
            this.setStatus(field, `${field.previousElementSibling.innerText} nem lehet üres`, "error");
            return false;
        }else{
            //ha nem üres a mező
            if(field.type == "password"){
                if(field.value.length < 8){
                    this.setStatus(field, `${field.previousElementSibling.innerText}nak legalább 8 karakter hosszúságunak kell lennie!`, "error");
                    return false;        
                }else{
                    this.setStatus(field, null, "success");
                    return true;
                }
            }else{
                this.setStatus(field, null, "success");
                return true;
            }
        }
    }

    setStatus(field, message, status){
        const errorMessage = field.parentElement.querySelector(".error-message");
        if(status == "error"){
            errorMessage.innerText = message;
            field.classList.add("input-error");
        }

        if(status == "success"){
            if(errorMessage){
                errorMessage.innerText = "";
            }
            field.classList.remove("input-error");
        }
    }
}

const form = document.querySelector(".loginForm"); 
if(form){
    const fields = ["email", "password"];
    const validator = new Login(form, fields);
}