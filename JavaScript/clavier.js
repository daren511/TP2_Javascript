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