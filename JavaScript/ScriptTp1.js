// JavaScript source code
//par Francis cote et daren-ken st-laurent
function keyWord( mot ) {
   var tableau = [ "break", "case", "catch", "continue", "debugger", "default", "delete", "do", 
      "else", "finally", "for", "function", "if", "in", "instanceof", "new", "return", "switch", 
      "this", "throw", "try", "typeof", "var", "void", "while", "with" ];
      for (var i = 0; i < tableau.length; i++) {
         if (mot ==tableau[i]){
            return true;
         } 
      }
      return false;

}
function formaterTexte() {
   var contenu = document.getElementById("Editeur");
   contenu.innerHTML = formater(contenu.innerText);
}

function trouverDans(val,tab) {
   for(var i = 0; i != tab.length; ++i) {
      if (val == tab[i]) {
         return i;
      }
      return tab.length;
   }
}

function formater(s) { 
   var temp = "";
   var result = "";
   var pos = 0;
   while (pos != s.length) {
      var prochain = trouverSi(s,pos,négation(isSpace));
      result += subStr(s,pos,prochain);
      pos = prochain;
      if (pos != s.length) {
         prochain = trouverSi(s,pos,isSpace);
         temp = subStr(s,pos,prochain);
         if(keyWord(temp)){
          temp = "<b>" + temp + "</b>";     
         }
         pos = prochain;
         result += temp;
      }
   }
   return result;
}


function isSpace(c) {
   return c == ' '  || c == '\n' || c == '\r' ||
      c == '\f' || c == '\t' || c == '\v';
}

function négation(f) {
   return function(arg) {
      return !f(arg);
   };
}
function subStr(s,début,fin) {
   var résultat = "";
   for(; début != fin; ++début) {
      résultat += s[début];
   }
   return résultat;
}

function trouverSi(s,pos,f) {
   while(pos != s.length && !f(s[pos])) {
      ++pos;
   }
   return pos;
}
function lireUneTouche(event) {
   var dir = document.getElementById("Editeur"); 
   if (event.which != 0 && event.charCode != 0 && event.keyCode != 13 ){
      dir.innerHTML = formater(dir.textContent + String.fromCharCode(event.which)); 
      formaterTexte();
   }
}
document.addEventListener('keypress', lireUneTouche);

function lireUnspecial(event) {
    var dir = document.getElementById("Editeur");
    if (event.keyCode == 13) {
        document.getElementById("Editeur").innerHTML += "\n<span class='Numerote' />";
    }
	if(event.keyCode == 8 ){
		if(dir.textContent.length >= 0){
		dir.innerHTML = formater(dir.textContent.substring(0,dir.textContent.length-1));
		event.preventDefault();
	}
	else{
		event.preventDefault();
	}

   }
}
document.addEventListener('keydown', lireUnspecial);