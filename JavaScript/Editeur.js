function lireUneToucheSpecial(event) {
    var contenu = document.getElementById("Editeur");
    var chaineSansCurseur = retirerChar(Curseur.getInstance().getCaractere(), contenu.textContent);
    var posCur = Curseur.getInstance().getPosition();
    var resultatFormatage = null;
    switch (event.which) {
        case 8://Backspace
            event.preventDefault();
            if (chaineSansCurseur.length > 0 && posCur > 0) {
                chaineSansCurseur = retirerLettreAvant(chaineSansCurseur, posCur); // Retire lettre
                decrementeChar(); // Décrémente le nombre de char à l'effacement
                Curseur.getInstance().gauche();
            }
            break;
        case 13://enter
            chaineSansCurseur = ajoutstring(chaineSansCurseur, "\n", posCur);
            compteurChar(contenu.textContent + 1);
            Curseur.getInstance().droite();
            break;
        case 37: // gauche
            if (posCur > 0 && contenu.textContent.length > 0) {
                Curseur.getInstance().gauche();
            }
            break;
        case 39: //droite
            if (posCur < contenu.textContent.length - 1 && contenu.textContent.length > 0) {
                Curseur.getInstance().droite();
            }
            break;
        case 40://down
            if (posCur < contenu.textContent.length) {
                Curseur.getInstance().bas(TrouverNouvellePos(contenu.textContent, 'b')); // Mettre le curseur en bas de la position précédente
            }
            break
        case 38://up
            if (posCur > 0) {
                Curseur.getInstance().haut(TrouverNouvellePos(contenu.textContent, 'h'));
            }
            break;
        case 46://delete
            if (posCur < chaineSansCurseur.length) {
                chaineSansCurseur = retirerLettreApres(chaineSansCurseur, posCur); // Retire la lettre a droite du curseur
                decrementeChar(); // Compteur de char --
            }
            break;
        case 36://home
            Curseur.getInstance().haut(TrouverNouvellePos(contenu.textContent, 'd'));
            break;
        case 35://end
            Curseur.getInstance().bas(TrouverNouvellePos(contenu.textContent, 'f'));
            break;
    }
    resultatFormatage = formater(ajouterCurseur(chaineSansCurseur));
    contenu.innerHTML = spannifierCurseur(lignifier(resultatFormatage.Texte));
    if(resultatFormatage != null)
        document.getElementById("Mots").innerHTML = resultatFormatage.Mots;
}

document.addEventListener('keydown', lireUneToucheSpecial);
function lireUneTouche(event) {
    var contenu = document.getElementById("Editeur");
    if (event.which != 0 && event.charCode != 0 && event.keyCode != 13) {
        var curPosition = Curseur.getInstance().getPosition();
        var chaineSansCurseur = retirerChar(Curseur.getInstance().getCaractere(), contenu.textContent); // on retire le curseur

        chaineSansCurseur = ajoutstring(chaineSansCurseur, String.fromCharCode(event.which), curPosition)//ajout de la touche a la chaine
        compteurChar(contenu.textContent); // Compteur de char ++
        Curseur.getInstance().droite();
        contenu.innerHTML = spannifierCurseur(lignifier(formater(ajouterCurseur(chaineSansCurseur)).Texte));
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

    compterLignesEtColonnes(tab);

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
            // utiliser résultat
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Zut! " + JSON.stringify(jqXHR) +
                  textStatus + " ; " + JSON.stringify(errorThrown));
        }
    });
}