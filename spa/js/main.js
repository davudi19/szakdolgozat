//------------------------------------------------------------------------------------------------------------------------------------------------
//FELHASZNÁLÓI KÉRÉSEK - KEZDET-------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
async function keresekLoad (){
    var list = await getData('https://api.foksz.dvpc.hu/api/admin/product')
    .then(async response => {
        return await response.json();
    });
    //console.log(list);
    var datas = list.items;
    //console.log(datas);

    //document.getElementById("fuggo-keresek").innerHTML = datas.length;
    //console.log("List length: " + datas.length);
    
    var html = getHTMLElement(datas);
    document.getElementById("accordion").innerHTML = html;



}

//FÜGGVÉNYEK------------------------------------------------------
function getImage(image){
    var img = "data:image/jpg;base64,";
    img += image;
    return img;
}
var eredmeny = [];

function getHTMLElement(datas){
    var html = "";
    for(var i = 0; i<datas.length;i++){
        html += '<div class="card">'+
        //ez lesz az adatbázisba fent lévő termék
        '<div class="card-header" id="'+datas[i].currentProduct.id+'">'+
        '<h5 class="mb-0">'+
        '<button class="btn btn-link" data-toggle="collapse" data-target="#collapse'+i+'" aria-expanded="true" aria-controls="collapse'+i+'" onclick="currentP(\''+datas[i].currentProduct.id+'\',\''+i+'\')">'+
        datas[i].currentProduct.name+
        '</button>'+
        '<p class="btn" id="shop-text" >'+
        datas[i].currentProduct.shopName+
        '</p></h5></div>'
        +
        '<div id="collapse'+i+'" class="collapse" aria-labelledby="'+datas[i].currentProduct.Id+'" data-parent="#accordion">'+
        '<div class="card" id="first-card">';
        html += '<div id="ideFogodMasolni'+i+'">';
        html += '</div>';
        html += '<div id="gombhely"></div>';
        //console.log(currID);
        if(!Array.isArray(datas[i].alternativeProducts)){
            html += getButton(datas[i].currentProduct);
        }
        html += '</div>';

        //módosításra küldött kérés
        if(Array.isArray(datas[i].alternativeProducts)){
            //logika
            html += '<div class="card" id="select">';
            html += '<select id="prodUpd'+i+'"  onchange="szures(this)">';
            html += '<option value="">Válasszon...</option>';
            for(var j = 0; j<datas[i].alternativeProducts.length; j++){
                html += '<option value="'+datas[i].alternativeProducts[j].id+'">'+ datas[i].alternativeProducts[j].createdUserName +'</option>';
            }
            html += '</select>';
            html += '</div>';

            html += '<div class="card" id="second-card">';
            html += '<div id="ideFogodMasolni2'+i+'">'; 
            html += '</div>';
            }
        //vége a select + módosítandó termékek---------------
        html +=
        '</div>'+
        '</div>'+
        '</div>'+
        '<br>';
    }
    return html;
}

async function szures(sObject){
    
    var parameter = sObject.value;
    var divID = sObject.id;
    var ciklusValtozo = parseInt(divID.substring(7));

    await getData('https://api.foksz.dvpc.hu/api/admin/product/id/'+parameter+'')
    .then(async response => {
        var list = await response.json();

        var alterP = "";
        alterP += 
        '<img src="'+getImage(list.image)+'" class="card-img-top" alt="">'+
        '<div class="card-body">'+
        '<h5 class="card-title">'+list.name+'</h5>'+
        '<p class="card-text">Ezt a terméket szeretnék módosítani.</p>'+
        '</div>'+
        '<ul class="list-group list-group-flush">'+
        '<li class="list-group-item">Ára: <br>'+list.fullPackPrice+' HUF</li>'+
        '<li class="list-group-item">Kategória:<br> '+list.productCategoryName+'</li>'+
        '<li class="list-group-item">Árúház:<br> '+list.shopName+'</li>'+
        '<li class="list-group-item">Csomagolás típusa:<br> '+list.productPackTypeName+'</li>'+
        '<li class="list-group-item">Hány darabra vonatkozik? :<br> '+list.packSize+'</li>'+
        '<li class="list-group-item">Létrehozó:<br> '+list.createdUserName+'</li>'+
        '<li class="list-group-item">Létrehozás dátuma:<br> '+list.createdDate+'</li>'+
        '</ul>'+
        //ez majd gomb lesz
        getButton(list);

        document.getElementById("ideFogodMasolni2"+ciklusValtozo).innerHTML = alterP;

        });
}

function getButton(datas){
    var btn = "";
        btn += 
        '<div class="card-body">'+
        '<button type="button" class="btn btn-outline-success" id="requestButton" value="1" onclick="elfogad(\''+datas.id+'\')">Elfogadás</button>'+
        '<button type="button" class="btn btn-outline-danger"  id="requestButton" value="2" onclick="elutasit(\''+datas.id+'\')">Elutasítás</button>'+
        '</div>';
    return btn;
}

function elfogad(id){
    dontes(id, "elfogad");
}
function elutasit(id){
    dontes(id, "elutasit");
}

async function dontes(dataId, type){    
    var data = {};
    var felkuldE;
    if(type == "elfogad") felkuldE = true;
    else if(type == "elutasit") felkuldE = false;
    await getData('https://api.foksz.dvpc.hu/api/admin/product/id/'+dataId+'')
    .then(async response => {
        var list = await response.json();
        //console.log("dontes id: " + list.id);
        //console.log(list.name);

        data = {
            id: list.id,
            shopId: list.shopId,
            enabled: felkuldE

        };

    });

    //console.log(data);

    await postData('https://api.foksz.dvpc.hu/api/admin/product' , data);
    if(type == "elfogad"){
        alert("Sikeresen felküldted a termék módosítást/létrehozást az adatbázisba!");
    }
    else if(type == "elutasit"){
        alert("Sikeresen elutasítottad a termék módosítást/felküldést!");
    }
    keresekLoad();

}

async function currentP(id, i){
     await getData('https://api.foksz.dvpc.hu/api/admin/product/id/'+id+'')
    .then(async response => {
        var list = await response.json();
        //console.log(list);

        var currentP = "";
        currentP += 
            '<img src="'+getImage(list.image)+'" class="card-img-top" alt="">'+
            '<div class="card-body">'+
            '<h5 class="card-title">'+list.name+'</h5>'+
            '<p class="card-text">Ezt a terméket szeretnék módosítani.</p>'+
            '</div>'+
            '<ul class="list-group list-group-flush">'+
            '<li class="list-group-item">Ára: <br>'+list.fullPackPrice+' HUF</li>'+
            '<li class="list-group-item">Kategória:<br> '+list.productCategoryName+'</li>'+
            '<li class="list-group-item">Árúház:<br> '+list.shopName+'</li>'+
            '<li class="list-group-item">Csomagolás típusa:<br> '+list.productPackTypeName+'</li>'+
            '<li class="list-group-item">Hány darabra vonatkozik? :<br> '+list.packSize+'</li>'+
            '<li class="list-group-item">Létrehozó:<br> '+list.createdUserName+'</li>'+
            '<li class="list-group-item">Létrehozás dátuma:<br> '+list.createdDate+'</li>'+
            '</ul>';

        document.getElementById("ideFogodMasolni"+i).innerHTML = currentP;
        //console.log(list.name);
    });
}
//------------------------------------------------------------------------------------------------------------------------------------------------
//FELHASZNÁLÓI KÉRÉSEK - VÉGE --------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------------------
//SHOP - KEZDET ----------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

async function shopLoad (){
    
    var shopok = await getData('https://api.foksz.dvpc.hu/api/shop')
    .then(async response => {
        return await response.json();
    });
    console.log(shopok);
    var shopHtml = getShop(shopok);
    document.getElementById("shopPage").innerHTML = shopHtml;
}

function getShop(shopok){
    var html = "";
    html += '<table class="table">'+
            '<thead>'+
            '<tr>'+
            '<th scope="col" class="bg-primary" id="shopHeader">Bolt id</th>'+
            '<th scope="col" class="bg-primary" id="shopHeader">Bolt név</th>'+
            '</tr>'+
            '</thead>';
    html += '<tbody>';
    for (var i=0;i<shopok.length;i++){
        html += '<tr class="shopElement">'+
                '<td>'+ shopok[i].id +'</td>'+
                '<td><input type="button" class="buttonName" value="'+ shopok[i].name + '" onclick="shopTermekLista(\''+shopok[i].id+'\')"></td>'+
                '</tr>';
    }
    html += '</tbody>' 
         +'</table>';

   
    html+='<div class="felkuldShop">'+
     '<h2 id="boltFejlec">Bolt hozzáadása</h2>'+
     '<input type="text" class="felkuldName" id="felkuldName" placeholder="Ide írd a bolt nevét a felvételhez...">'+
     '<button type="submit" class="buttonFelkuld" onclick="felkuldShop()">Küldés</button>'+
     '</div>';

     html+='<div class="torolShop">'+
     '<h2 id="boltFejlec">Bolt törlés</h2>'+
     '<input type="text" class="torolID" id="torolID" placeholder="Ide írd a bolt nevét a törléshez...">'+
     '<button type="submit" class="buttonTorol" onclick="torolShop()">Törlés</button>'+
     '</div>';

    return html;
}

async function felkuldShop(){
    
    var felkuldNev = document.querySelector("#felkuldName").value;
    console.log(felkuldNev);
    await getData('https://api.foksz.dvpc.hu/api/shop')
    .then(async response => {
        var list = await response.json();
        console.log(list);
        var fentVan = 0;
        var str = felkuldNev.toLowerCase();
        for(var i=0;i<list.length;i++){
            var result = str.localeCompare(list[i].name.toLowerCase());
            console.log(result);
            if(result == 0){
                fentVan++;
            }
        }
        if(fentVan != 0){     
            alert("Ez a bolt már megtalálható az adatbázisban!");
        }else{
            await postData2('https://api.foksz.dvpc.hu/api/shop/'+felkuldNev);
            alert("A bolt sikeresen bekerült az adatbázisba.");
            shopLoad();
        }

    });
}

async function torolShop(){
    var torolID = document.querySelector('#torolID').value;
    await deleteData('https://api.foksz.dvpc.hu/api/shop/'+torolID);
    alert("Sikeres törlés!");
    shopLoad();
}

async function shopTermekLista(id){

    var list = await getData('https://api.foksz.dvpc.hu/api/product?ShopId='+id)
    .then(async response => {
        return await response.json();
    });
    var adottShopList = list.items;
    console.log(adottShopList);
    console.log(id);

    var html = productListHTML(adottShopList);
    document.getElementById("accordion").innerHTML = html;
}
//----------------------------------------------------
function productListHTML(adottShopList){
    var html = "";
    for(var i = 0; i<adottShopList.length;i++){
        html += '<div class="card" id="card">'+
        //ez lesz az adatbázisba fent lévő termék
        '<div class="card-header" id="'+adottShopList[i].id+'">'+
        '<h5 class="mb-0">'+
        '<button class="btn btn-link" data-toggle="collapse" data-target="#collapse'+i+'" aria-expanded="true" aria-controls="collapse'+i+'" onclick="clickedListItems(\''+adottShopList[i].id+'\',\''+i+'\')">'+
        (i+1) + '. termék' +
        '</button>'+
        '<p class="btn" id="shop-text" >'+
        adottShopList[i].name+
        '</p></h5></div>'
        +
        '<div id="collapse'+i+'" class="collapse" aria-labelledby="'+adottShopList[i].id+'" data-parent="#accordion">'+
        '<div class="card" id="first-card">';
        html += '<div id="clickedListaPlace'+i+'" class="clickedListaPlace">';
        html += '</div>';
        html += '<div id="gombhely"></div>';
        html += '</div>';

        //módosításra küldött kérés
            html += '</div>';

            html += '<div class="card" id="second-card">';
            html += '<div id="ideFogodMasolni2'+i+'">'; 
            html += '</div>';
            
        //vége a select + módosítandó termékek---------------
        html +=
        '</div>'+
        '</div>'+
        '</div>'+
        '<br>';
    }
    return html;
}

async function clickedListItems(id, i){
    console.log("clickedList id: " + id);
    
    console.log("i: " + i);
    await getData('https://api.foksz.dvpc.hu/api/product/id/'+id+'')
    .then(async response => {
        var list = await response.json();
        console.log(list);

        var bovitett = "";
        bovitett += 
            '<img src="'+getImage(list.image)+'" class="card-img-top" alt="">'+
            '<div class="card-body">'+
            '<h5 class="card-title">'+list.name+'</h5>'+
            '</div>'+
            '<ul class="list-group list-group-flush">'+
            '<li class="list-group-item">Ára: <br>'+list.fullPackPrice+' HUF</li>'+
            '<li class="list-group-item">Kategória:<br> '+list.productCategoryName+'</li>'+
            '<li class="list-group-item">Árúház:<br> '+list.shopName+'</li>'+
            '<li class="list-group-item">Csomagolás típusa:<br> '+list.productPackTypeName+'</li>'+
            '<li class="list-group-item">Hány darabra vonatkozik? :<br> '+list.packSize+'</li>'+
            '<li class="list-group-item">Létrehozó:<br> '+getUser(list.createdUserName)+'</li>'+
            '<li class="list-group-item">Vonalkód:<br> '+list.barcode+'</li>'+
            '</ul>';

        document.getElementById("clickedListaPlace"+i).innerHTML = bovitett;
        //console.log(list.name);
    });


}

function getUser(user){
    var element = '';
    console.log(user);
    if(user === undefined){
        element = "Admin";
    }else{
        element = user;
    }

    return element;
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//SHOP - VÉGE ----------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//TERMÉK FELTÖLTÉS - KEZDET ----------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
async function productAddLoad() {
    var addProdPage = "";
    addProdPage += 
    '<input type="text" class="addProdText" id="termekNev" placeholder="Ide írd a termék nevét...">'+
    '<input type="number" class="addProdText" id="barcode" placeholder="Ide írd a vonalkódot...">';

    //CATEGORY----------------------------------------------------------------------
    var categoryList = await getData('https://api.foksz.dvpc.hu/api/product/category')
    .then(async response => {
        return await response.json();
    });
    console.log(categoryList);
    
    addProdPage += '<select id="categorySelect" onchange="ProdFel()">'+
    '<option value="0">Válasszon...</option>';
    for(var i=0;i<categoryList.length;i++){
        addProdPage += '<option value="'+categoryList[i].id+'">'+ categoryList[i].name +'</option>';
    }
    addProdPage += '</select> <br>';

    //PACKTYPE----------------------------------------------------------------------
    var packTypeList = await getData('https://api.foksz.dvpc.hu/api/product/packtype')
    .then(async response => {
        return await response.json();
    });
    console.log(packTypeList);

    addProdPage += '<select id="packtypeSelect" onchange="ProdFel()">'+
    '<option value="0">Válasszon...</option>';
    for(var i=0;i<packTypeList.length;i++){
        addProdPage += '<option value="'+packTypeList[i].id+'">'+ packTypeList[i].name +'</option>';
    }
    addProdPage += '</select> <br>';

    //SHOP----------------------------------------------------------------------
    var shopList = await getData('https://api.foksz.dvpc.hu/api/shop')
    .then(async response => {
        return await response.json();
    });
    console.log(shopList);

    addProdPage += '<select id="shopSelect" onchange="ProdFel()">'+
    '<option value="0">Válasszon...</option>';
    for(var i=0;i<shopList.length;i++){
        addProdPage += '<option value="'+shopList[i].id+'">'+ shopList[i].name +'</option>';
    }
    addProdPage += '</select> <br>';

    addProdPage += 
    '<input type="number" class="addProdText" id="ar" placeholder="Ide írd a termék árát...">'+
    '<input type="number" class="addProdText" id="csomag" placeholder="Ide írd az egy csomag számát...">';



    addProdPage += '<button type="button" onclick="ProdFel()">Felküld</button>';
    document.getElementById("prodAddPage").innerHTML = addProdPage;



}

function ProdFel(){
    var felkuldTermek = {
        name: document.getElementById("termekNev").value,
        barcode: document.getElementById("barcode").value,
        image: "",
        productCategoryId: document.getElementById("categorySelect").value,
        productPackTypeId: document.getElementById("packtypeSelect").value,
        shopId: document.getElementById("shopSelect").value,
        fullPackPrice: document.getElementById("ar").value,
        packSize: document.getElementById("csomag").value
    };
    console.log(felkuldTermek);
    if(felkuldTermek.fullPackPrice != 0){
        elkuldProd(felkuldTermek);
    }

}

async function elkuldProd(felkuldTermek){
    await postData('https://api.foksz.dvpc.hu/api/product' , felkuldTermek);
    alert("Felküldted a terméket.");
    productAddLoad();
}


//------------------------------------------------------------------------------------------------------------------------------------------------
//TERMÉK FELTÖLTÉS - VÉGE ----------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//TERMÉKKATEGÓRIA - KEZDET ----------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

async function prodCategoryLoad(){
    var kategoriak = await getData('https://api.foksz.dvpc.hu/api/product/category')
    .then(async response => {
        return await response.json();
    });
    console.log(kategoriak);
    var categoryHtml = getCategoryHTML(kategoriak);
    document.getElementById("prodCategoryPage").innerHTML = categoryHtml;
}

function getCategoryHTML(kategoriak){
    var html = "";
        html += '<table class="table">'+
            '<thead>'+
            '<tr>'+
            '<th scope="col" class="bg-primary" id="categoryHeader">Kategória id</th>'+
            '<th scope="col" class="bg-primary" id="categoryHeader">Kategória név</th>'+
            '<th scope="col" class="bg-primary" id="categoryHeader">Többeszám</th>'+
            '</tr>'+
            '</thead>';
        html += '<tbody>';
        for (var i=0;i<kategoriak.length;i++){
        html += '<tr class="categoryElement">'+
                '<td>'+ kategoriak[i].id +'</td>'+
                '<td>'+kategoriak[i].name+'</td>'+
                '<td>'+kategoriak[i].plural+'</td>'+
                '</tr>';
        }
        html += '</tbody>' 
        +'</table>';


        html+='<div class="felkuldCategory">'+
            '<h2 id="kategoriaFejlec">Kategória hozzáadása</h2>'+
            '<input type="text" class="felkuldKategoriaNev" id="felkuldKategoriaNev" placeholder="Ide írd a kategória nevét a felvételhez...">'+
            '<input type="text" class="felkuldKategoriaTszamNev" id="felkuldKategoriaTszamNev" placeholder="Ide írd a kategória nevét a felvételhez...">'+
            '<button type="submit" class="buttonFelkuld" onclick="felkuldCategory()">Küldés</button>'+
            '</div>';

        html+='<div class="torolCategory">'+
            '<h2 id="kategoriaFejlec">Kategória törlés</h2>'+
            '<input type="text" class="torolID" id="torolID" placeholder="Ide írd a kategória nevét a törléshez...">'+
            '<button type="submit" class="buttonTorol" onclick="torolCategory()">Törlés</button>'+
            '</div>';
    return html;
}

async function felkuldCategory(){
    var fN = document.querySelector("#felkuldKategoriaNev").value;
    var fTSzN = document.querySelector("#felkuldKategoriaTszamNev").value;
    console.log(fN);
    console.log(fTSzN);
    await getData('https://api.foksz.dvpc.hu/api/product/category')
    .then(async response => {
        var list = await response.json();
        console.log(list);
        var fentVan = 0;
        var str = fN.toLowerCase();
        for(var i=0;i<list.length;i++){
            var result = str.localeCompare(list[i].name.toLowerCase());
            console.log(result);
            if(result == 0){
                fentVan++;
            }
        }
        if(fentVan != 0){     
            alert("Ez a kategóriaa már megtalálható az adatbázisban!");
        }else{
            var felkuld = {
                name: fN,
                plural: fTSzN
            }
            await postData('https://api.foksz.dvpc.hu/api/product/category/', felkuld);
            alert("A kategória sikeresen bekerült az adatbázisba.");
            prodCategoryLoad();
        }

    });
}

async function torolCategory(){
    var torolID = document.querySelector('#torolID').value;
    await deleteData('https://api.foksz.dvpc.hu/api/product/category/'+torolID);
    alert("Sikeres törlés!");
    prodCategoryLoad();

}

//------------------------------------------------------------------------------------------------------------------------------------------------
//TERMÉKKATEGÓRIA - VÉGE ----------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------------------------------------------------
//HOME - KEZDET ----------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

async function homeLoad(){
    var rendszerAdatok = await getData('https://api.foksz.dvpc.hu/api/System')
    .then(async response => {
        return await response.json();
    });
    console.log(rendszerAdatok);
    var html = '';
    //1. sor 
    html += '<div class="values">';
    
    html += '<div class="val-box">';
    html += '<i class="material-icons">person</i>';//ICON
    html += '<div>'
         + '<h3>' + rendszerAdatok.activeUsersCount + '</h3>'
         + '<span>Aktív felhasználók</span>'
         + '</div>';
    html +='</div>';

    html += '<div class="val-box">';
    html += '<i class="material-icons">perm_identity</i>';//ICON
    html += '<div>'
         + '<h3>' + rendszerAdatok.deniedUsersCount + '</h3>'
         + '<span>Tiltott felhasználók</span>'
         + '</div>';
    html +='</div>';

    html += '<div class="val-box">';
    html += '<i class="material-icons">import_contacts</i>';//ICON
    html += '<div>'
         + '<h3>' + rendszerAdatok.productsCount + '</h3>'
         + '<span>Összes termék</span>'
         + '</div>';
    html +='</div>';
    html +='</div>';

    //2.sor
    html += '<div class="values2">';
        html += '<div class="val-box">';
        html += '<i class="material-icons">home</i>';//ICON
        html += '<div>'
            + '<h3>' + rendszerAdatok.shopsCount + '</h3>'
            + '<span>Összes bolt</span>'
            + '</div>';
        html +='</div>';

        html += '<div class="val-box">';
        html += '<i class="material-icons">favorite</i>';//ICON
        html += '<div>'
            + '<h3>' + rendszerAdatok.mostProductsShop.name + '</h3>'
            + '<span>Legnépszerűbb bolt</span>'
            + '</div>';
        html +='</div>';

        html += '<div class="val-box">';
        html += '<i class="material-icons">import_contacts</i>';//ICON
        html += '<div>'
            + '<h3><button type="button" class="utolsoTermekBtn" onclick="latestProduct(\''+rendszerAdatok.latestProduct.name+'\',\''+rendszerAdatok.latestProduct.shopName+'\')">Kattints</button></h3>'
            + '<span>Összes termék</span>'
            + '</div>';
        html +='</div>';
    html +='</div>';

    document.getElementById("homePage").innerHTML=html;
}

function latestProduct(name, shopName){
    //alert(latestProd);
    swal("Legnépszerűbb termék", name + "\r\r Bolt: " + shopName);
}


//------------------------------------------------------------------------------------------------------------------------------------------------
//HOME - VÉGE ----------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
