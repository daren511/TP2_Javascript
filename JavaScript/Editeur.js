function lireUneToucheSpecial(event) {
    var contenu = document.getElementById("Editeur");
    var chaineSansCurseur = retirerChar(Curseur.getInstance().getCaractere(), contenu.textContent);
    var posCur = Curseur.getInstance().getPosition();
    var resultatFormatage = null;
    var color = getCookie("Keyword");
    var colorNombre = getCookie("Nombres");////////////////////////////////

    switch (event.which) {
        case 8://Backspace
            chaineSansCurseur = backspace(chaineSansCurseur, posCur, contenu, event);
            break;
        case 13://enter
            chaineSansCurseur = enter(chaineSansCurseur, posCur, contenu, event);
            break;
        case 37: // gauche
            if (event.ctrlKey && event.which == 37 && posCur > 0) {
                ctrlFlecheGauche(chaineSansCurseur, posCur, contenu, event);
            } else {
                gauche(chaineSansCurseur, posCur, contenu, event);
            }
            break;
        case 39: //droite   
            if (event.ctrlKey && event.which == 39 && posCur < chaineSansCurseur.length) {
                ctrlFlecheDroite(chaineSansCurseur, posCur, contenu, event);
            } else {
                droite(chaineSansCurseur, posCur, contenu, event);
            }
            break;
        case 40://down
            bas(chaineSansCurseur, posCur, contenu, event);
            break
        case 38://up  
            haut(chaineSansCurseur, posCur, contenu, event);
            break;
        case 46://delete
            del(chaineSansCurseur, posCur, contenu, event);
            break;
        case 36://home
            debut(chaineSansCurseur, posCur, contenu, event);
            break;
        case 35://end
            end(chaineSansCurseur, posCur, contenu, event);
            break;
    }
    compterLignesEtColonnes(chaineSansCurseur);
    resultatFormatage = formater(colorierNombres(ajouterCurseur(chaineSansCurseur),"Nombres"));
    contenu.innerHTML = spannifierCurseur(lignifier(resultatFormatage.Texte));
    ajouterCouleur(color);
    var test = colorierNombres(chaineSansCurseur, "Nombres");
    if (resultatFormatage != null) {
        document.getElementById("Mots").innerHTML = resultatFormatage.Mots;
        
    }
}

document.addEventListener('keydown', lireUneToucheSpecial);

function debut(chaineSansCurseur, posCur, contenu, event) {
    Curseur.getInstance().haut(TrouverNouvellePos(contenu.textContent, 'd'));
}

function end(chaineSansCurseur, posCur, contenu, event) {
    Curseur.getInstance().bas(TrouverNouvellePos(contenu.textContent, 'f'));
}

function gauche(chaineSansCurseur, posCur, contenu, event) {
    event.preventDefault();
    if (posCur > 0 && contenu.textContent.length > 0) {
        Curseur.getInstance().gauche();
    }
}

function droite(chaineSansCurseur, posCur, contenu, event) {
    event.preventDefault();
    if (posCur < contenu.textContent.length - 1 && contenu.textContent.length > 0) {
        Curseur.getInstance().droite();
    }
}

function bas(chaineSansCurseur, posCur, contenu, event) {
    event.preventDefault();
    if (posCur < contenu.textContent.length) {
        Curseur.getInstance().bas(TrouverNouvellePos(contenu.textContent, 'b')); // Mettre le curseur en bas de la position précédente
    }
}

function haut(chaineSansCurseur, posCur, contenu, event) {
    event.preventDefault();
    if (posCur > 0) {
        Curseur.getInstance().haut(TrouverNouvellePos(contenu.textContent, 'h'));
    }
}

function ctrlFlecheGauche(chaineSansCurseur, posCur, contenu, event) {
    if(isSpace(chaineSansCurseur[posCur-1])){
        do {
            posCur--;
        } while (isSpace(chaineSansCurseur[posCur - 1]) && posCur -1 >=0);
    }
    if (!isSpace(chaineSansCurseur[posCur - 1])){
        do{
            posCur--;
        } while (!isSpace(chaineSansCurseur[posCur-1]) && posCur -1 >=0);
        Curseur.getInstance().haut(posCur);
    }
}

function ctrlFlecheDroite(chaineSansCurseur, posCur, contenu, event) {
    if (!isSpace(chaineSansCurseur[posCur])) {
        do {
            posCur++;
        } while (!isSpace(chaineSansCurseur[posCur]) && posCur + 1 < chaineSansCurseur.length-1);
    }
    if (isSpace(chaineSansCurseur[posCur])) {
        do {
            posCur++;
        } while (isSpace(chaineSansCurseur[posCur]) && posCur + 1 < chaineSansCurseur.length - 1);
        Curseur.getInstance().bas(posCur);
    }
}

function del(chaineSansCurseur, posCur, contenu, event) {
    event.preventDefault();
    if (posCur < chaineSansCurseur.length) {
        chaineSansCurseur = retirerLettreApres(chaineSansCurseur, posCur); // Retire la lettre a droite du curseur
        decrementeChar(); // Compteur de char --
    }

    return chaineSansCurseur;
}

function backspace(chaineSansCurseur, posCur, contenu, event) {
    event.preventDefault();
    if (chaineSansCurseur.length > 0 && posCur > 0) {
        chaineSansCurseur = retirerLettreAvant(chaineSansCurseur, posCur); // Retire lettre
        decrementeChar(); // Décrémente le nombre de char à l'effacement
        Curseur.getInstance().gauche();
    }

    return chaineSansCurseur;
}

function enter(chaineSansCurseur, posCur, contenu, event) {
    event.preventDefault();
    chaineSansCurseur = ajoutstring(chaineSansCurseur, "\n", posCur);
    compteurChar(contenu.textContent + 1);
    Curseur.getInstance().droite();

    return chaineSansCurseur;
}



function lireUneTouche(event) {
    var contenu = document.getElementById("Editeur");
    if (event.which != 0 && event.charCode != 0 && event.keyCode != 13) {
        var curPosition = Curseur.getInstance().getPosition();
        var chaineSansCurseur = retirerChar(Curseur.getInstance().getCaractere(), contenu.textContent); // on retire le curseur
        var color = getCookie("Keyword");
        var colorNombre = getCookie("Nombres");/////////////////////////////

        chaineSansCurseur = ajoutstring(chaineSansCurseur, String.fromCharCode(event.which), curPosition)//ajout de la touche a la chaine
        compteurChar(contenu.textContent); // Compteur de char ++
        Curseur.getInstance().droite();
        contenu.innerHTML = spannifierCurseur(lignifier(formater(colorierNombres(ajouterCurseur(chaineSansCurseur), "Nombres")).Texte));
        ajouterCouleur(color);
    }
}
document.addEventListener('keypress', lireUneTouche);

function spannifierCurseur(s) {
    var curseur = Curseur.getInstance().getCaractere();
    s = s.replace(curseur, "<span class='Curseur'>" + curseur + "</span>");
    return s;
}

function compteurChar(contenu) {
    document.getElementById("Char").innerHTML = contenu.length;
}
function decrementeChar() {
    document.getElementById("Char").innerHTML = document.getElementById("Char").textContent - 1;
}
function placerCurseurDebut() {
    document.getElementById("Editeur").innerHTML += "<span class='Curseur'>" + Curseur.getInstance().getCaractere() + "</span>";
}
function compterLignesEtColonnes(tab) {
    document.getElementById("Ligne").innerHTML = tab.length; // Compteur de lignes
    document.getElementById("Colonne").innerHTML = trouverLignePlusGrosse(tab); // Compteur de colonnes
}
function lignifier(s) {
    var res = "";
    var tab = s.split(/\n/);

    for (var i = 0; i < tab.length - 1; ++i) {
        res += "<span class='Numerote' >" + tab[i] + "\n</span>";
    }
    res += "<span class='Numerote' >" + tab[tab.length - 1] + "</span>";
    return res;
}

function obtenirTexte(){
    var s = document.getElementById("Editeur").textContent;
    var chaineSansCurseur = retirerChar(Curseur.getInstance().getCaractere(),s);
    return chaineSansCurseur;
}

function minifier() {
    var txt = obtenirTexte();
    var rq = "http://localhost:8888/minify?input=" +
            btoa(unescape(encodeURIComponent(txt)));
    $.ajax({
        url: rq,
        type: "post",
        contentType: "text/plain",
        crossDomain: true,
        header: {
            "Access-Control-Allow-Origin": null
        },
        xhrFields: {
            witCredentials: false
        },
        success: function (s) {
            var resultat = decodeURIComponent(escape(atob(s)));
            document.getElementById("minificateur").value = resultat;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Zut! " + JSON.stringify(jqXHR) +
                  textStatus + " ; " + JSON.stringify(errorThrown));
        }
    });
}

var tabFonctions = (function () {
    var instance;
    function ZeCompteur() {
        this.fonctionReturn = new Array();
        fonctionReturn[8] = backspace;

    }
    function createInstance() {
        var singleton = new ZeCompteur();
        return singleton;
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

function ajouterCouleur(color) {
    $(".keyword").css("color", color);
    $(".Nombres").css("color", color); /////////////////////
}

function changeKeywordsColor() {
    var color = document.getElementById("Couleur").value;

    $(".keyword").css("color", color);

    setCookie("Keyword", color , 7);
}
function changeNombreColor() {
    var color = document.getElementById("CouleurNombre").value;

    $(".Nombres").css("color", color);

    setCookie("Nombres", color, 7);

}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function init(){
    placerCurseurDebut();
    checkCookie();
}

function checkCookie() {
    var color = getCookie("Keyword");
    if (color != "") {
        $(".keyword").css("color", color);
        document.getElementById("Couleur").value = color;
    }
    else {
        alert(color);
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function colorierNombres(s, classe) {
    var tabDeNonNombres = s.split(/\d+/g); // Sépare chaque mot de s en lignes d'un tableau (s est séparé par tous les espaces/tabulations et newLine, qui soit en suite ou non)
    var tabDeNombres = s.split(/\D+/g); // Créé un tableau qui converse tous les blancs de s
    
    //ici on retire dans le premier espace du tableau si il est vide
    if (tabDeNombres[0] == "") {
        tabDeNombres.shift();
    }
    if (tabDeNonNombres[0] == "") {
        tabDeNonNombres.shift();
    }
    for (var i = 0; i < tabDeNombres.length; ++i) {
        if (tabDeNombres[i] != "") { // si il y a rien on applique rien
            tabDeNombres[i] = spanifier(tabDeNombres[i], classe);
        }
    }
    var nombresEnPremier = true;

    if (s.search(/\D+/g) == 0) {
        nombresEnPremier = false;
    }
    return joindreTabStringAlternatif(tabDeNombres, tabDeNonNombres, nombresEnPremier);
}