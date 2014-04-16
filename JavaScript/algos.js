// JavaScript source code
//par Francis cote et daren-ken st-laurent
function keyWord(mot) {
    var tableau = ["break", "case", "catch", "continue", "debugger", "default", "delete", "do",
       "else", "finally", "for", "function", "if", "in", "instanceof", "new", "return", "switch",
       "this", "throw", "try", "typeof", "var", "void", "while", "with"];
    if (trouverDans(mot, tableau) != tableau.length) {
        return true;
    }
    else {
        return false;
    }
}

function trouverDans(val, tab) {
    for (var i = 0; i != tab.length; ++i) {
        if (val == tab[i]) {
            return i;
        }
        return tab.length;
    }
}

// Cette fonction vérifie si le string (s) contient un char spécifique (c) et le retire entierement de la chaine.
function retirerChar(char, mot) {
    for (var i = 0; i < mot.length; ++i) {
        if (mot[i] == char) {
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
//le tableau en entier il nous est pas neccesaire de reparcourir le tableau, nous sauvons donc du temps

function formater(s) {
    Compteur.getInstance().reset();
    var temp = "";
    var result = "";
    var pos = 0;
    while (pos != s.length) {
        var prochain = trouverSi(s, pos, négation(isSpace));
        result += subStr(s, pos, prochain);
        pos = prochain;

        if (pos != s.length) {
            prochain = trouverSi(s, pos, isSpace);
            temp = subStr(s, pos, prochain);
            Compteur.getInstance().ajouterMot(); // Compteur de mots
            if (keyWord(retirerChar(Curseur.getInstance().getCaractere(), temp))) {
                temp = "<strong>" + temp + "</strong>"; // Peinture le mot clé
            }
            pos = prochain;
            result += temp;
        }
    }
    return new Array(result,Compteur.getInstance().getMot());
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
        this.getMot = function () {
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
        this.charactere = '►';
        this.position = 0;
        this.getPosition = function () {
            return this.position;
        };
        this.getCaractere = function () {
            return this.charactere;
        }
        this.gauche = function () {
            this.position--;
        }
        this.droite = function () {
            this.position++;
        }
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

    for (var i = 0; i < tab.length; ++i) {
        if (plusGrosse < tab[i].length)
            plusGrosse = tab[i].length;
    }
    return plusGrosse;

}

function TrouverPosCurseur(s, direction) {
    var tab = s.split(/\n/);
    var posLigne = -1;
    var posTab = -1;

    for (var i = 0; i < tab.length; ++i) {
        var pos = tab[i].search(Curseur.getInstance().getCaractere());
        if (pos != -1) {
            posLigne = pos;
            posTab = i;
        }
    }
    var res = 0;
    if (direction == 'h') {

        if (posTab != 0) {
            for (var i = 0; i < posTab - 1; ++i) { // si pas sur la premiere ligne
                res += tab[i].length + 1; // calcule la valeur + 1 car on considere ici que c'est une ligne sans \n ou il devraient y en avoir une
            }
            if (tab[posTab - 1].length <= posLigne) {
                res += tab[posTab - 1].length;
            }
            else {
                res += posLigne;
            }
        }
    }
    else if (direction == 'b') {
        if (posTab != tab.length - 1) {// si pas sur la derniere ligne 
            for (var i = 0; i <= posTab; ++i) {
                res += tab[i].length + 1; // calcule la valeur + 1 car on considere ici que c'est une ligne sans \n ou il devraient y en avoir une
            }
            res--; // on a calculer le curseur on le retire
            if (tab[posTab + 1].length <= posLigne) {
                res += tab[posTab + 1].length;
            }
            else {
                res += posLigne;
            }
        }
    }

    return res;
}