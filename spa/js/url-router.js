const urlPageTitle = "Admin";

document.addEventListener("click", (e) => {
    const {target} = e;
    if(!target.matches("nav a")) {
        return;
    }
    e.preventDefault();
    urlRoute();
})

const urlRoutes = {
    404: {
        template: "../spa/templates/404.html",
        title: "404 | " + urlPageTitle,
        description: "Az oldal nem található"
    },
    "/": {
        template: "../spa/templates/home.html",
        title: "Főoldal | " + urlPageTitle,
        description: "Fő oldal",
        script: "homeLoad()"

    },
    "/kapcsolatok": {
        template: "../spa/templates/kapcsolatok.html",
        title: "Kapcsolatok | " + urlPageTitle,
        description: "Kapcsolatok oldala"
    },
    "/hozzaadas": {
        template: "../spa/templates/hozzaadas.html",
        title: "Hozzáadás | " + urlPageTitle,
        description: "Termékek hozzáadása oldala",
        script: "productAddLoad()"
    },
    "/keresek": {
        template: "../spa/templates/keresek.html",
        title: "Felhasználói kérések | " + urlPageTitle,
        description: "Felhasználói kérések",
        script: "keresekLoad()"//ezt a main js-ben írtam meg(main.js 1) [url-router.js 73]
    },
    "/tiltas": {
        template: "../spa/templates/tiltas.html",
        title: "Felhasználók tiltása | " + urlPageTitle,
        description: "Felhasználók tiltása oldala"
    },
    "/kategoria": {
        template: "../spa/templates/kategoria.html",
        title: "Termékek törlése | " + urlPageTitle,
        description: "Termékek törlése oldala",
        script: "prodCategoryLoad()"
    },
    "/modositas": {
        template: "../spa/templates/modositas.html",
        title: "Termékek módosítása | " + urlPageTitle,
        description: "Termékek módosítása oldala"
    },
    "/shop": {
        template: "../spa/templates/shop.html",
        title: "Shop | " + urlPageTitle,
        description: "Shop-okkal kapcsolatos tevékenységek oldala",
        script: "shopLoad()"
    }
}

const urlRoute = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    urlLocationHandler();
}
const urlLocationHandler = async() => {
    const location = window.location.pathname;
    if(location.length == 0){
        location = "/";
    }
    const route = urlRoutes[location] || urlRoutes[404];
    //const route = urlRoutes["/"] || urlRoutes[404];
    const html = await fetch(route.template).then((response) => response.text());
    document.getElementById("content").innerHTML = html;
    document.title = route.title;
    document.querySelector('meta[name="description"]').setAttribute("content", route.description);
    eval(route.script); //ebből megtudod érteni: https://www.inflectra.com/support/knowledgebase/kb242.aspx
}

window.onpopstate = urlLocationHandler;
window.route = urlRoute;

urlLocationHandler();