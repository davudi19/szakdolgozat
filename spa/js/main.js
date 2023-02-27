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