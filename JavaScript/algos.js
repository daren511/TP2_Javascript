// JavaScript source code
//par Francis cote et daren-ken st-laurent

var keyWord = (function () {
    var instance;
    function ZeMotCles() {
        this.tableau = ["break", "case", "catch", "continue", "debugger", "default", "delete", "do",
       "else", "finally", "for", "function", "if", "in", "instanceof", "new", "return", "switch",
       "this", "throw", "try", "typeof", "var", "void", "while", "with"];
        this.ajouterKeyword = function (mot) {
            return this.tableau.push(mot);
        }
        this.removeKeyWord = function (mot) {
            var index = this.tableau.indexOf(mot);
            if (index != -1) {
                this.tableau.splice(index,1);
            }
        }
        this.checkMot = function (mot) {
            if (trouverDans(mot, this.tableau) != this.tableau.length) {
                return true;
            }
            else {
                return false;
            };
        }
        this.getTabString = function(){
            return this.tableau.join(";");
        }
    }
    function createInstance() {
        var singleton = new ZeMotCles();
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

function keyWordAdd(){
    var mot = document.getElementById("Keyword");

    if (mot.value != "") {
        if (!keyWord.getInstance().checkMot(mot.value)) {
            keyWord.getInstance().ajouterKeyword(mot.value);
            mot.value = "";
            AfficherMotCles();
        }
        else {
            alert(mot.value + " déjà présent")
        }
    }
    else {
        alert("Texte Vide");
    }

}

function keyWordDelete() {
    var mot = document.getElementById("Keyword");
    if (mot.value != "") {
        if (keyWord.getInstance().checkMot(mot.value)) {
            keyWord.getInstance().removeKeyWord(mot.value);
            mot.value = "";
            AfficherMotCles();
        }
        else {
            alert(mot.value + " non présent")
        }
    }
    else {
        alert("Texte Vide");
    }
}

function AfficherMotCles(){
    document.getElementById("AffichageMots").innerHTML = keyWord.getInstance().getTabString();
}

function trouverDans(val, tab) {
    for (var i = 0; i != tab.length; ++i) {
        if (val == tab[i]) {
            return i;
        }
    }
    return tab.length;
}

// Cette fonction vérifie si le string (s) contient un char spécifique (c) et le retire entierement de la chaine.
function retirerChar(c, mot) {
    for (var i = 0; i < mot.length; ++i) {
        if (mot[i] == c) {
            if (i == 0) {
                mot = mot.substring(i + 1, mot.length);
            }
            else if (i == mot.length - 1) {
                mot = mot.substring(0, i);
            }
            else {
                mot = mot.substring(0, i) + mot.substring(i + 1, mot.length);
            }
        }
    }
    return mot;
}

//Cette fonction formate le texte et elle compte aussi le nombre de mots puisque cette fonction parcours
//le tableau en entier il nous est pas neccesaire de reparcourir le tableau par la suite, nous sauvons donc du temps

function formater(s) {
    Compteur.getInstance().reset();
    var temp = "";
    var result = "";
    var pos = 0;
    var curseur = Curseur.getInstance().getCaractere();
    while (pos != s.length) {
        var prochain = trouverSi(s, pos, négation(isSpace));
        result += subStr(s, pos, prochain);
        pos = prochain;

        if (pos != s.length) {
            prochain = trouverSi(s, pos, isSpace);
            temp = subStr(s, pos, prochain);
            Compteur.getInstance().ajouterMot(); // Compteur de mots
            if (keyWord.getInstance().checkMot(retirerChar(curseur, temp))) {
                temp = spanifier(temp, "keyword"); // Peinture le mot clé
            }
            pos = prochain;
            result += temp;
        }
    }
    return { Texte: result, Mots: Compteur.getInstance().getMots() };
}

function spanifier(s, classe) {
    return "<span class='" + classe + "'>" + s + "</span>"
}

function isSpace(c) {
    return c == ' ' || c == '\n' || c == '\r' ||
       c == '\f' || c == '\t' || c == '\v';
}

function négation(f) {
    return function (arg) {
        return !f(arg);
    };
}
function subStr(s, début, fin) {
    var résultat = "";
    for (; début != fin; ++début) {
        résultat += s[début];
    }
    return résultat;
}

function trouverSi(s, pos, f) {
    while (pos != s.length && !f(s[pos])) {
        ++pos;
    }
    return pos;
}

var Compteur = (function () {
    var instance;
    function ZeCompteur() {
        this.mots = 0;
        this.char = 0;
        this.ajouterChar = function () {
            return this.char++;
        }
        this.getChar = function () {
            this.char;
        }
        this.ajouterMot = function () {
            return this.mots++;
        }
        this.getMots = function () {
            return this.mots;
        }
        this.reset = function () {
            this.mots = 0;
            this.char = 0;
        }

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

var Curseur = (function () {
    var instance;
    function ZeCurseur() {
        this.caractere = '►';
        this.position = 0;
        this.getPosition = function () {
            return this.position;
        };
        this.getCaractere = function () {
            return this.caractere;
        }
        //il n'y a pas de validation l'usager est donc responsable de s'assurer que le curseur ne deborde pas
        this.gauche = function () {
            this.position--;
        }
        this.droite = function () {
            this.position++;
        }
        //ces 2 fonctions prennent en parametre une position ou il doit se deplacer dans le texte
        //car ces position doivent etre calculer
        this.haut = function (pos) {
            if (pos < this.position && pos >= 0) {
                this.position = pos;
            }
        }
        this.bas = function (pos) {
            if (pos > this.position) {
                this.position = pos;
            }
        }
        // cette fonction est appeler au moment ou nous appelons ctrl + Z
        this.Annuler = function (pos) {
            this.position = pos;
        }
    }
    function createInstance() {
        var singleton = new ZeCurseur();
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


function ajoutstring(s, string, position) {

    var avant = s.substring(0, position);
    var apres = s.substring(position, s.length);

    return avant + string + apres;
}

function ajouterCurseur(s) {
    var posCurseur = Curseur.getInstance().getPosition();
    var avant = s.substring(0, posCurseur);
    var apres = s.substring(posCurseur, s.length);

    return avant + Curseur.getInstance().getCaractere() + apres;
}

function trouverLignePlusGrosse(tab) {
    var plusGrosse = 0;
    var curseur = Curseur.getInstance().getCaractere();
    for (var i = 0; i < tab.length; ++i) {
        if (plusGrosse < tab[i].length) {
            if (tab[i].search(curseur) != -1) {
                plusGrosse = tab[i].length - 1;
            }
            else {
                plusGrosse = tab[i].length;
            }
        }
    }
    return plusGrosse;

}

function TrouverPosCurseur(tab) {
    var posLigne = -1;
    var posTab = -1;
    var curseur = Curseur.getInstance().getCaractere();
    for (var i = 0; i < tab.length; ++i) {
        var pos = tab[i].search(curseur);
        if (pos != -1) {
            posLigne = pos;
            posTab = i;
        }
    }

    return { Ligne: posLigne, Colonne: posTab };
}
//quand c'est pas un des cas suivant : h(haut),b(bas),d(debut),f(fin)
//la fonction retourne 0
//dans les autre cas elle calcul la nouvelle position
function TrouverNouvellePos(s, direction) {
    var tab = s.split(/\n/);
    var pos = 0;

    var position = TrouverPosCurseur(tab);

    var posLigne = position.Ligne;
    var posTab = position.Colonne;
    
    switch (direction) {
        case 'h':
            if (posTab != 0) {
                pos = CalculerNouvellePos(tab, posTab - 1, posLigne);
            }
            break;
        case 'b':
            if (posTab != tab.length - 1) {// si pas sur la derniere ligne 
                pos = CalculerNouvellePos(tab, posTab + 1, posLigne);
                pos--; // on retire le curseur qui a ete calculer
            }
            break;
        case 'd':
            if (posTab != 0) {
                pos = CalculerNouvellePos(tab, posTab, 0);
            }
            break;
        case 'f':
            pos = CalculerNouvellePos(tab, posTab, tab[posTab].length - 1)
            break;
    }

    return pos;
}

function CalculerNouvellePos(tab, posTab, posLigne) {
    var res = 0;

    for (var i = 0; i < posTab; ++i) {
        res += tab[i].length + 1; // calcule la valeur + 1 car on considere ici que c'est une ligne sans \n ou il devraient y en avoir une
    }
    if (tab[posTab].length <= posLigne) {
        res += tab[posTab].length;
    }
    else {
        res += posLigne;
    }

    return res;
}

function joindre2TabString(tabMots, tabNombre, MotNombre) {
    var res = "";
    if (MotNombre) {
        res = joindreTab(tabMots, tabNombre);
    }
    else {
        res = joindreTab(tabNombre, tabMots);
    }

    return res;
}

function joindreTab(premierTab, deuxiemeTab) {
    var res = "";
    var nbTours = plusGrand(premierTab.length, deuxiemeTab.length);
    for (var i = 0; i < nbTours; ++i) {
        if (i < premierTab.length) {
            res += premierTab[i];
        }
        if (i < deuxiemeTab.length) {
            res += deuxiemeTab[i];
        }
    }
    return res;
}

function plusGrand(premierNombre, deuxiemeNombre) {
    if (premierNombre >= deuxiemeNombre)
        return premierNombre;
    else
        return deuxiemeNombre;
}

function replaceString(stringInit, stringARetirer, stringARajouter) {
    return stringInit.replace(stringARetirer, stringARajouter);
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function retirerLettreAvant(s, position) {
    var avant = s.substring(0, position - 1);
    var apres = s.substring(position, s.length);

    return avant + apres;
}
function retirerLettreApres(s, position) {
    var avant = s.substring(0, position);
    var apres = s.substring(position + 1, s.length);

    return avant + apres;
}