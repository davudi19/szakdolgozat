class Auth{
    constructor(){
        document.querySelector("body").style.display = "none"; //üressé teszi az oldalt
        const auth = localStorage.getItem("auth");
        const user = JSON.parse(localStorage.getItem("user"));
        this.validateAuth(auth, user);
    }
    validateAuth(auth, user){
        if(auth != 1){
            window.location.replace("login.html");
        }else{
            document.querySelector("body").style.display = "block"; //ha sikeres a bejelentkezés akkor leveszi a konstruktorban beállított üressé tevő parancsot (3. sor)
            var span_name = document.querySelector("#fullname");
            span_name.innerHTML = user.firstName;
        }
    }

    logOut(){
        localStorage.removeItem("auth");
        localStorage.removeItem("user");
        window.location.replace("login.html");
    }
}