function lireUneToucheSpecial(event) {
    var contenu = document.getElementById("Editeur");
    var chaineSansCurseur = retirerChar(Curseur.getInstance().getCaractere(), contenu.textContent);
    var posCur = Curseur.getInstance().getPosition();
    var resultatFormatage = null;
    switch (event.which) {
        case 8://Backspace
            chaineSansCurseur = backspace(chaineSansCurseur, posCur, contenu, event);
            break;
        case 13://enter
            chaineSansCurseur = enter(chaineSansCurseur, posCur, contenu, event);
            break;
        case 90://ctrl + Z
            if (event.ctrlKey && event.which == 90) {
                chaineSansCurseur = annulerDerniereAction();
            }
            break;
        case 37: // gauche
            if (event.ctrlKey && event.which == 37 && posCur > 0) {
                Curseur.getInstance().haut(ctrlFlecheGauche(chaineSansCurseur, posCur, contenu, event));
            } else {
                gauche(chaineSansCurseur, posCur, contenu, event);
            }
            break;
        case 39: //droite
            if (event.ctrlKey && event.which == 39 && posCur < chaineSansCurseur.length) {
                Curseur.getInstance().bas(ctrlFlecheDroite(chaineSansCurseur, posCur, contenu, event));
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
    contenu.innerHTML = paint(chaineSansCurseur);
    appliquerCouleurs();
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
    if (isSpace(chaineSansCurseur[posCur - 1])) {
        do {
            posCur--;
        } while (isSpace(chaineSansCurseur[posCur - 1]) && posCur - 1 >= 0);
    }
    if (!isSpace(chaineSansCurseur[posCur - 1])) {
        do {
            posCur--;
        } while (!isSpace(chaineSansCurseur[posCur - 1]) && posCur - 1 >= 0);
        return posCur;
    }
}

function annulerDerniereAction() {
    if (!Sauvegarde.getInstance().estVide()) {
        var sauvegarde = Sauvegarde.getInstance().getSauvegarde();
        Curseur.getInstance().Annuler(sauvegarde.Position);
        return sauvegarde.Texte;
    }
}

function ctrlFlecheDroite(chaineSansCurseur, posCur, contenu, event) {
    if (!isSpace(chaineSansCurseur[posCur])) {
        do {
            posCur++;
        } while (!isSpace(chaineSansCurseur[posCur]) && posCur + 1 < chaineSansCurseur.length - 1);
    }
    if (isSpace(chaineSansCurseur[posCur])) {
        do {
            posCur++;
        } while (isSpace(chaineSansCurseur[posCur]) && posCur + 1 < chaineSansCurseur.length - 1);
        return posCur;
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

function paint(chaineSansCurseur) {
    resultatFormatage = formater(colorierNombres(ajouterCurseur(chaineSansCurseur), "Nombres"));
    return spannifierCurseur(lignifier(resultatFormatage.Texte));
}

function lireUneTouche(event) {
    var contenu = document.getElementById("Editeur");
    if (event.which != 0 && event.charCode != 0 && event.keyCode != 13) {
        if (event.keycode != 26) {
            var curPosition = Curseur.getInstance().getPosition();
            var chaineSansCurseur = retirerChar(Curseur.getInstance().getCaractere(), contenu.textContent); // on retire le curseur
            Sauvegarde.getInstance().sauvegarder(chaineSansCurseur, curPosition);
            chaineSansCurseur = ajoutstring(chaineSansCurseur, String.fromCharCode(event.which), curPosition)//ajout de la touche a la chaine
            compteurChar(contenu.textContent); // Compteur de char ++
            Curseur.getInstance().droite();
            contenu.innerHTML = paint(chaineSansCurseur);
            appliquerCouleurs();
        }
    }
}
document.addEventListener('keypress', lireUneTouche);

function spannifierCurseur(s) {
    var curseur = Curseur.getInstance().getCaractere();
    s = s.replace(curseur, "<span class='Curseur'>" + curseur + "</span>");
    return s;
}

var Sauvegarde = (function () {
    var instance;
    function zeSauvegarde() {
        this.text = "";
        this.positionCurseur = 0;
        this.estVide = function () {
            return this.text == "";
        }
        this.sauvegarder = function (texte, poscur) {
            if (texte != "" && poscur != 0) {
                this.text = texte;
                this.positionCurseur = poscur;
            }
        };
        this.getSauvegarde = function () {
            var sauvegarde = { Texte: this.text, Position: this.positionCurseur };
            this.clear();
            return sauvegarde;
        }
        this.clear = function () {
            this.text = "";
            this.positionCurseur = 0;
        }

    }
    function createInstance() {
        var singleton = new zeSauvegarde();
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

function compteurChar(contenu) {
    document.getElementById("Char").innerHTML = contenu.length;
}
function decrementeChar() {
    document.getElementById("Char").innerHTML = document.getElementById("Char").textContent - 1;
}
function placerCurseurDebut() {
    document.getElementById("Editeur").innerHTML += "<span class='Curseur'>" + Curseur.getInstance().getCaractere() + "</span>";
}
function compterLignesEtColonnes(chaine) {
    var tab = chaine.split(/\n/);
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

function obtenirTexte() {
    var s = document.getElementById("Editeur").textContent;
    var chaineSansCurseur = retirerChar(Curseur.getInstance().getCaractere(), s);
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

function appliquerCouleurs() {
    var Keywords = getCookie("Keyword");
    var Nombres = getCookie("Nombres");
    $(".keyword").css("color", Keywords);
    $(".Nombres").css("color", Nombres);
}

function Color() {
    var colorKeyword = document.getElementById("CouleurKeywords").value;
    var colorNombres = document.getElementById("CouleurNombre").value;
    $(".keyword").css("color", colorKeyword);
    $(".Nombres").css("color", colorNombres);

    setCookie("Keyword", colorKeyword, 7);
    setCookie("Nombres", colorNombres, 7);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function init() {
    placerCurseurDebut();
    checkCookie();
    AfficherMotCles();
}

function checkCookie() {
    var Keyword = getCookie("Keyword");
    if (Keyword != "") {
        $(".Keyword").css("color", Keyword);
        document.getElementById("CouleurKeywords").value = Keyword;
    }
    var Nombres = getCookie("Nombres");
    if (Keyword != "") {
        $(".Nombres").css("color", Keyword);
        document.getElementById("CouleurNombre").value = Keyword;
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
    var tabNonNombres = s.split(/\d+/g); // Sépare chaque mot de s en lignes d'un tableau (s est séparé par tous les espaces/tabulations et newLine, qui soit en suite ou non)
    var tabNombres = s.split(/\D+/g); // Créé un tableau qui converse tous les blancs de s

    //ici on retire dans le premier espace du tableau si il est vide
    if (tabNombres[0] == "") {
        tabNombres.shift();
    }
    if (tabNonNombres[0] == "") {
        tabNonNombres.shift();
    }
    for (var i = 0; i < tabNombres.length; ++i) {
        if (tabNombres[i] != "") { // si il y a rien on applique rien
            tabNombres[i] = spanifier(tabNombres[i], classe);
        }
    }
    var nombresEnPremier = true;

    if (s.search(/\D+/g) == 0) {
        nombresEnPremier = false;
    }
    return joindre2TabString(tabNombres, tabNonNombres, nombresEnPremier);
}

function searchReplace() {
    var search = document.getElementById("recherche").value;
    var replace = document.getElementById("remplacer").value;
    var texte = document.getElementById("Editeur").textContent;
    // On eleve le curseur
    var chaineSansCurseur = retirerChar(Curseur.getInstance().getCaractere(), texte);
    // change le texte et vide les box
    chaineSansCurseur = replaceString(chaineSansCurseur, new RegExp(search, 'g'), replace);
    document.getElementById("recherche").value = "";
    document.getElementById("remplacer").value = "";
    // Re ajoute tout le style
    document.getElementById("Editeur").innerHTML = paint(chaineSansCurseur);
    appliquerCouleurs();
}
