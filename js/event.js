$(document).ready(function() {
var Ii = 1;
    $('canvas').mousemove(function(e){
         cellule = map.getCase(e.pageX-$(this).offset().left,e.pageY-$(this).offset().top);
       var result = map.isCaseDisponible(cellule);
        console.log(result);
    });

    $('canvas').click(function(e){
            //if(cellule!=null){
            //    var perso = map.getPerso(cellule);
             //   if(perso!=null){
                    var celluleDispo = map.getTabDisponible(joueur);
                    var celule =  {'x' : 8, 'y' : 13};
                    arrayRoute = map.getTabRoute(celluleDispo,joueur,celule);

                 //   console.log(celluleDispo);
               // }
            //}
    });
});
