/**
* MME2 Ü1 von FullStack
* Katharina, Kevin, Stefan
**/

console.log("MME2 Ü1 startbereit!!!");

/*
    Global Scope
*/

// Selbstaufrufende Funktion
(function () {
    "use strict";
    /*
        Hilffunktionen
    */
    
    
    /**
    * Spielt ein Video nach Betätigung des Play Buttons ab.
    * @constructor
    * @param {Object} target - Objekt das event verarbeitet 
    */
    function playVideoOfTarget(target) {
        
        var parent = target.parentNode;
        parent.children[1].play();
    }
    
    
    /**
    * Stopt ein Video nach Betätigung des Stop Buttons.
    * @constructor
    * @param {Object} target - Objekt das event verarbeitet 
    */
    function stopVideoOfTarget(target) {
        
        var parent = target.parentNode;
        parent.children[1].pause();
    }
    
    /**
    * Überwacht die Betätigung der Buttons in der Section
    * @constructor
    * @param {Object} e - ein ausgelöstes Event 
    */
    function delegationOfPlayStopClicks(e) {
        
       /*
       * Hier wird e = e || window.event genutzt um sich eine
       * größere Bedingungsabfrage zu ersparen.
       */
        var e = e || window.event,
            target = e.target || e.srcElement,
            elementClass = target.className;
        console.log(elementClass);
        
        if (elementClass === "playButton") {
            playVideoOfTarget(target);
        }
        
        if (elementClass === "stopButton") {
            stopVideoOfTarget(target);
        }
        
    }
    
    
    
    
    /*
    * TagName gibt eine NodeList zurück. 
    * Die NodeList hat hier nur ein Element.
    * An das Element wird einer Listiner gebunden.
    */
    document.getElementsByTagName("section")[0].addEventListener("click", function (e) {
        delegationOfPlayStopClicks(e);
    });
    
})();
