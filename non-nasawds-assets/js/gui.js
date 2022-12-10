// Overrides the href call to div to adapt to the header
document.onclick = function (e) {
    $("#headerSearch").css("display","none");
    e = e ||  window.event;
    var element = e.target || e.srcElement;
    if(element.tagName == 'SPAN'){
        element = element.parentElement;
    }
    if(element.href != null){
        var nameSplit = element.href.split('/');
        if (element.tagName == 'A'&& nameSplit[nameSplit.length - 1][2] == '-' && $(element).parent().attr("class") == "usa-width-one-whole") {
            $("#" + nameSplit[nameSplit.length - 1].substring(1)).prev().click();
            return false; // prevent default action and stop event propagation
        }
        else if (element.tagName == 'A'&& nameSplit[nameSplit.length - 1][0] == '#') {
            goTo(nameSplit[nameSplit.length - 1].substring(1));
            return false; // prevent default action and stop event propagation
        }
    }
  };

//function replacing the "scrollTo" for href div calls
function goTo(divName){
    if (divName == ""){
        return 0;
    }
    var divTop = document.getElementById(divName).getBoundingClientRect().top;
    //Space buffer base for Mobile vs Desktop view
    if(window.innerWidth > 951){
        divTop -= 140;
    }
    else{
        divTop -= 32;
    }
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
    if(isSafari){
        var target = $("#" + divName);
            $('html, body').animate({
                scrollTop: divTop + window.scrollY
            }, 500, function() {
                return false;
            });
    }
    else{
        window.scrollBy({left: 0, top: divTop, behavior: "smooth"});
    }
}
//Displays the Application URL help
function displayHelp(enterExit, divHelpName2){
    if(enterExit){
        $('#' + divHelpName2).css('display','block');
    }
    else{
        $('#' + divHelpName2).css('display','none');
    }
}
var clickOn = {};
function displayHelpClick(thisDiv, divHelpName){
    if(clickOn[thisDiv] == null){
        clickOn[thisDiv] = true;
    }
    else{
        clickOn[thisDiv] = !clickOn[thisDiv]; 
    }
    displayHelp(clickOn[thisDiv], divHelpName);
    if(clickOn[thisDiv]){
        $("#" + thisDiv).off("mouseenter")
        .off("mouseout")
        .off("focusin")
        .off("focusout");
    }
    else{
        $("#" + thisDiv).on("mouseenter", function(){displayHelp(true, divHelpName)})
            .on("mouseout", function(){displayHelp(false, divHelpName)})
            .on("focusin", function(){displayHelp(true, divHelpName)})
            .on("focusout", function(){displayHelp(false, divHelpName)});
    }
}

//async function for editing Generate API key form after load
var resolveCounter = 0;
function resolveAfterTenthSeconds() {
    return new Promise(resolve => {
     setTimeout(() => {
        if(document.getElementById("apidatagov_signup_form") != null && document.getElementById("apidatagov_signup_form").length > 4){
            resolveCounter = 0;
            resolve("true");
        }
        else if(resolveCounter < 30){
            resolve("false");
        }
        else{
            resolve("error in loading form");
        }
     }, 100);
    });
  }

  async function asyncCall() {
    var result = await resolveAfterTenthSeconds();
    if(result == "true"){
        $("#apidatagov_signup").removeClass();
            //.children().eq(1).css("text-align","center");
        $($("#apidatagov_signup").children().eq(1)[0].children[0]).remove();
        $("#apidatagov_signup").children().eq(1).html("*" + $("#apidatagov_signup").children().eq(1).html());

        $("#apidatagov_signup_form").addClass("usa-form");
        //$("#apidatagov_signup_form").css("margin", "0 auto");
        for(var x = 0; x < 4; x++){
            var temp = $("#apidatagov_signup_form").children().eq(x);
            temp.children().eq(0).removeClass("col-sm-4");
            temp.children().eq(0).removeClass("control-label");
            temp.children().eq(0).children().eq(0).remove();
            temp.children().eq(0).html("*" + temp.children().eq(0).html());
            var tempChild = temp.children().eq(1).children().eq(0);
            tempChild.removeClass("form-control");
            temp.children().eq(1).remove();
            temp.append(tempChild);
        }
        var textDiv = document.getElementById("apidatagov_signup_form").children[3]
        textDiv.children[0].innerHTML = "Application URL<img src='assets/img/alerts/info.svg' height = '20px' width = '20px' class = 'infoDiv' tabindex = '0' onclick = 'displayHelpClick(this.id, \"infoTab\")' id = 'infoPic'>(optional):";
        $("#infoPic").on("mouseenter", function(){displayHelp(true, 'infoTab');})
        .on("mouseout", function(){displayHelp(false, 'infoTab');})
        .on("focusin", function(){displayHelp(true, 'infoTab')})
        .on("focusout", function(){displayHelp(false, 'infoTab')});
        textDiv.children[1].remove();
        var newField = document.createElement("input");
        newField.id = "user_use_description";
        newField.name = "user[use_description]";
        newField.size = "50";
        newField.type = "url";
        document.getElementById("apidatagov_signup_form").children[3].appendChild(newField);
        var help = document.createElement("label");
        help.id = "infoTab";
        help.style.display = "none";
        help.animation = "slidein-bottom .3s ease-in-out";
        help.innerHTML = "<small>Enter the URL that you will use your API key with. We would love to see what you do with your key!</small>";
        textDiv.insertBefore(help, textDiv.children[1]);
    }
    else if(result == "false"){
        asyncCall();
    }
    else{
        alert(result);
    }
}

function closeSubMenu(controlName){
    var buttonSM = "button[aria-controls='" + controlName + "'"
    $(buttonSM).attr("aria-expanded", "false");
    $("#" + controlName).attr("aria-hidden", true);
}