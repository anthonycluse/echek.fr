var DIRECTION = {
    "BAS"    : 0,
    "GAUCHE" : 1,
    "DROITE" : 2,
    "HAUT"   : 3
}

var DUREE_ANIMATION = 5;
var DUREE_DEPLACEMENT = 15;

function Personnage(url, x, y, direction,id,nom,nbcase) {
    this.x = x; // (en cases)
    this.y = y; // (en cases)
    this.direction = direction;
    this.maxDep = null;
    this.nextDep = 0;
    this.etatAnimation = -1;
    this.nom = nom;
    this.id =id;
    this.nbMaxCaseDeplacement = nbcase;
    // Chargement de l'image dans l'attribut image
    this.image = new Image();
    this.image.referenceDuPerso = this;
    this.image.onload = function() {
        if(!this.complete)
            throw "Erreur de chargement du sprite nomme \"" + url + "\".";

        // Taille du personnage
        this.referenceDuPerso.largeur = this.width / 3;
        this.referenceDuPerso.hauteur = this.height / 4;
    }
    this.image.src = "images/sprites/" + url;
}
Personnage.prototype.isDepAutorise = function(cases,desti) {
    var key = desti.x+'_'+desti.y;
    if(cases[key]!=undefined) return true;

    return false;
}
Personnage.prototype.dessinerPersonnage = function(context) {
    var frame = 0; // Numero de l'image Ã  prendre pour l'animation
    var decalageX = 0, decalageY = 0; // Decalage a  appliquer a  la position du personnage
    if(this.etatAnimation >= DUREE_DEPLACEMENT) {
        // Si le deplacement a atteint ou depasse le temps necesaire pour s'effectuer, on le termine
        this.etatAnimation = -1;
    } else if(this.etatAnimation >= 0) {
        // On calcule l'image (frame) de l'animation e  afficher
        frame = Math.floor(this.etatAnimation / DUREE_ANIMATION);
        if(frame > 3) {
            frame %= 4;
        }

        // Nombre de pixels restant e  parcourir entre les deux cases
        var pixelsAParcourir = 32 - (32 * (this.etatAnimation / DUREE_DEPLACEMENT));

        // a partir de ce nombre, on definit le decalage en x et y.
        if(this.direction == DIRECTION.HAUT) {
            decalageY = pixelsAParcourir;
        } else if(this.direction == DIRECTION.BAS) {
            decalageY = -pixelsAParcourir;
        } else if(this.direction == DIRECTION.GAUCHE) {
            decalageX = pixelsAParcourir;
        } else if(this.direction == DIRECTION.DROITE) {
            decalageX = -pixelsAParcourir;
        }

        // On incremente d'une frame
        this.etatAnimation++;
    }
    /*
     * Si aucune des deux conditions n'est vraie, c'est qu'on est immobile,
     * donc il nous suffit de garder les valeurs 0 pour les variables
     * frame, decalageX et decalageY
     */

    context.drawImage(
        this.image,
        this.largeur * frame, this.direction * this.hauteur, // Point d'origine du rectangle source Ã  prendre dans notre image
        this.largeur, this.hauteur, // Taille du rectangle source (c'est la taille du personnage)
        // Point de destination (depend de la taille du personnage)
        (this.x * 32) - (this.largeur / 2) + 16 + decalageX, (this.y * 32) - this.hauteur + 24 + decalageY,
        this.largeur, this.hauteur // Taille du rectangle destination (c'est la taille du personnage)
    );
}

Personnage.prototype.getCoordonneesAdjacentes = function(direction) {
    var coord = {'x' : this.x, 'y' : this.y};
    switch(direction) {
        case DIRECTION.BAS :
            coord.y++;
            break;
        case DIRECTION.GAUCHE :
            coord.x--;
            break;
        case DIRECTION.DROITE :
            coord.x++;
            break;
        case DIRECTION.HAUT :
            coord.y--;
            break;
    }
    return coord;
}
Personnage.prototype.getDirection = function(caseTo) {
    caseTo.x = parseInt(caseTo.x);
    caseTo.y = parseInt(caseTo.y);
    var dirr = null;
    if(caseTo.x<this.x){
        dirr = DIRECTION.GAUCHE;
    }
    else if(caseTo.x>this.x){
        dirr = DIRECTION.DROITE;
    }
    else if(caseTo.y>this.y){
        dirr = DIRECTION.BAS;
    }
    else if(caseTo.y<this.y){
        dirr = DIRECTION.HAUT;
    }
    return dirr;

}
Personnage.prototype.setNbDepAeffectuer = function(cases){
    this.maxDep = cases.length-1;
}
Personnage.prototype.deplacement = function(cases){
    if(this.etatAnimation >= 0 ) {
        return false;
    }
    if(this.nextDep>this.maxDep){
        clearInterval(idInterval);
        this.nextDep = 0;
        this.maxDep = null;
        return false;
    }
    this.deplacer(cases[this.nextDep]);
    this.nextDep++;

}
Personnage.prototype.deplacer = function(caseTo) {

    // On commence l'animation
   this.etatAnimation = 1;
   this.direction = this.getDirection(caseTo);
   this.x = parseInt(caseTo.x);
   this.y = parseInt(caseTo.y);
   return true;
}
/*
Personnage.prototype.deplacer = function(direction) {
    // On ne peut pas se deplacer si un mouvement est deja  en cours !
    if(this.etatAnimation >= 0) {
        return false;
    }
    this.direction = direction;

    var prochaineCase = this.getCoordonneesAdjacentes(direction);

    // On commence l'animation
    this.etatAnimation = 1;
    this.x = parseInt(prochaineCase.x);
    this.y = parseInt(prochaineCase.y);
    return true;
}
*/