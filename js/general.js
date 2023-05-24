//variables
var bigScreen = 700
var darkTheme = "dark-theme"
var Html = document.getElementsByTagName("html")[0]
var currentSection = 0
var formalScroll = Html.scrollTop
var contactMethod = {email:contactEmail,phone:contactPhone,wa:contactWa,uw:contactUw}

//pages
var IntroPage = document.getElementById("intro")
var skillsPage = document.getElementById("skills")
var projectsPage = document.getElementById("projects")
var footer = document.getElementsByTagName("footer")[0]
var sections = [IntroPage,skillsPage,projectsPage]

window.onload = function(){
    var minLoadTime = 3 /*the minimum amount of time in seconds that the welcome page should 
    be displayed*/
    minLoadTime *= 1000
    var loaded = Number(new Date())
    var timeToLoad = loaded - loadStart
    function load(){
        remove(WelcomeContainer)
        changeClass(document.body,"not-loaded","")
        loadTheme()
        adjust()
        loadSkills()
        loadProjects()
        addEvent(window,"resize",adjust)
        addEvent(menuIniBtn,"click",openMenu)
        addEvent(themeIni,"click",toggleTheme)
        addEvent(document,"scroll",updateSection)
        scrollNShow()
        for(var i = 0; i < menu.children[0].children.length; i++){
            addMenuEvent(menu.children[0].children[i])
        }
        for(var c = 0; c < contactList.children.length; c++){
            var contactInter = contactList.children[c]
            contactInter.onclick = contactMethod[contactInter.name]
            var clone = contactInter.cloneNode(true)
            clone.id = ""; clone.onclick = contactInter.onclick
            footer.appendChild(clone) 
        }
        function addMenuEvent(current){
            addEvent(current,"click",function(e){moveToSection(e,current)})
        }
    }
    if(loaded - loadStart >= minLoadTime){load()}
    else{setTimeout(load,minLoadTime - timeToLoad)}
}
function loadIntro(){
    var intro = IntroPage.children[0]; remove(intro)
    write(intro,IntroPage)
}
function adjust(){
    //adjusts the contents on the page
    var winDim = windowDim()
    if(winDim.w < 700){
        /*small screen*/
        changeClass(document.body,"bs","ss")
        mainTab.style.marginTop = elementDim(menuIni,"h").toString() + "px"
        menuIni.appendChild(themeToggle)
        remove(themeSet)
    }
    else{
        changeClass(document.body,"ss","bs")
        mainTab.style.marginTop = ""
        menu.style.height = ""
        themeSet.appendChild(themeToggle)
        mainTab.appendChild(themeSet)
    }
    adjustMenu()
}
function adjustMenu(){
    /*adjusts the menu*/
    var menuDim = elementDim(menu)
    var menuWrapperDim = elementDim(menu.children[0])
    var menuIniDim = elementDim(menuIni)
    var winDim = windowDim()
    if(menuWrapperDim.h > 0 && menuWrapperDim.h < menuDim.h){
        menu.children[0].style.marginTop = ((menuDim.h - menuWrapperDim.h) / 2).toString() + "px"
    }
    else{menu.children[0].style.marginTop = ""}
    if(menuIniDim.h > 0 && menuIniDim.h < winDim.h){
        menu.style.height = (winDim.h - menuIniDim.h).toString() + "px"
    }
}
function openMenu(){
    /*opens the menu for small screens*/
    if(!hasClass(menu,"hide")){
        changeClass(menu,"","hide")
        removeEvent(mainTab,"click",openMenu)
    }
    else{
        changeClass(menu,"hide","")
        addEvent(mainTab,"click",openMenu)
        adjustMenu();
    }
}
function toggleTheme(){
    var theme = (themeIni.checked)? darkTheme : ""; Html.id = theme
    try{localStorage.setItem("theme",theme)}
    catch(err){}
    if(theme == darkTheme){themeIndicator.innerHTML = "Dark Theme"}
    else{themeIndicator.innerHTML = "Light Theme"}
}
function loadTheme(){
    /*loads the appropriate theme*/
    var theme
    try{theme = localStorage.getItem("theme")}
    catch(err){theme = ""}
    themeIni.checked = (theme == darkTheme)? true : false
    toggleTheme()
}
function loadSkills(){
    var parent = document.createElement("div"); 
    parent.className = "wrapper"
    for(var i=0; i < Skills.length; i++){
        var container = document.createElement("div")
        container.className = "skill pointer zoom scroll-n-view"
        var logo = document.createElement("img")
        var name = document.createElement("div")
        append(container,[logo,name])
        logo.src = Skills[i].icon
        name.innerHTML = Skills[i].name
        parent.appendChild(container)
    }
    var clearFix = document.createElement("div"); clearFix.className = "clear-fix"
    parent.appendChild(clearFix)
    skillsList.appendChild(parent)
}
function loadProjects(){
    for(var i = 0; i < Projects.length; i++){
        var container = document.createElement("div")
        container.className = "project pointer zoom scroll-n-view from-left"
        var logo = document.createElement("img")
        logo.src = "projects/images/" + Projects[i].images[0]
        var name = document.createElement("div"); 
        name.innerHTML = Projects[i].name
        append(container,[logo,name])
        projectsList.appendChild(container)
        addFunction(container,i)
    }
    function addFunction(object,index){
        var details = Projects[index]
        var overflow = true
        var tabObject = new miniTab(ini,object,function(){document.body.style.overflow=""})
        tabObject.bigScreen = function(){
            changeClass(this.tab,this.smallScreenClass,this.bigScreenClass)
        }
        var container
        function ini(){
            if(!container){
                container = document.createElement("div"); 
                container.className = "project-details"
                var header = document.createElement("h1")
                header.innerHTML = "Project Details"
                header.className = "header"
                var name = document.createElement("h3");
                name.innerHTML = details.name
                var link = undefined
                if(!isEmpty(details.link)){
                    link = document.createElement("a")
                    link.target = "_blank"
                    link.innerHTML = "See Project"
                    link.href = details.link
                }
                var skills = document.createElement("div")
                var skillsHeader = document.createElement("div")
                skillsHeader.innerHTML = "Skills Involved"
                skillsHeader.className = "center-text"
                skills.appendChild(skillsHeader)
                for(var i = 0; i < details.skills.length; i++){
                    var skillBox = document.createElement("span")
                    skillBox.className = "bit-curved minor-pad skills"
                    skillBox.innerHTML = details.skills[i]
                    skills.appendChild(skillBox)
                }
                var imageSlider = new slider(container)
                for(var i = 0; i < details.images.length; i++){
                    var image = document.createElement("img")
                    image.src = "projects/images/" + details.images[i]
                    imageSlider.add(image)
                }
                var desc = document.createElement("div")
                desc.className = "space-up desc"
                desc.innerHTML = details.description
                append(container,[header,name])
                if(link){container.appendChild(link)}
                container.appendChild(skills)
                tabObject.tab.appendChild(container)
                imageSlider.display()
                container.appendChild(desc)
            }
            document.body.style.overflow = "hidden"
        }
    }
    var clearFix = document.createElement("div"); clearFix.className = "clear-fix"
    projectsList.appendChild(clearFix)
}
function contactEmail(){
    var emailAddress = "chigoziemebubebeloved@gmail.com"
    copy(emailAddress,function(){customAlert("Email Address Copied")})
}
function contactPhone(){
    var phoneNo = "09166102474"
    copy(phoneNo,function(){customAlert("Phone Number Copied")})
}
function contactUw(){
    var profileLink = "https://www.upwork.com/freelancers/~018563bf28c5aafcda"
    window.open(profileLink,"_blank")
}
function contactWa(){
    var link = "https://wa.link/ftapf2"
    window.open(link,"_blank")
}
function moveToSection(e,target){
    stopDefault(e)
    var href = target.href
    href = reverse(href)
    href = reverse(href.slice(0,href.indexOf("/") - 1))
    target = document.getElementById(href)
    var top = target.getBoundingClientRect().top + window.scrollY
    try{scroll({top:top,behavior:"smooth"})}
    catch(err){scroll(0,top)}
}
function updateSection(e){
    var coord = sections[currentSection].getBoundingClientRect()
    var pos = window.scrollY
    var winH = windowDim("h")
    function changeSection(){
        changeClass(menu.children[0].children[currentSection],"current","")
        changeClass(menu.children[0].children[newSection],"","current")
        currentSection = newSection
    }
    if(formalScroll > pos){
        /*scrolling up*/
        var newSection = currentSection - 1
        if(coord.top > 10 && newSection in sections){
            changeSection()
        }
    }
    else{
        var newSection = currentSection + 1
        if(coord.bottom < 1 && newSection in sections){
            changeSection()
        }
    }
    formalScroll = pos
}