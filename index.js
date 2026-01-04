let darkMode = localStorage.getItem('darkMode');
console.log(darkMode)
if (darkMode==='dark') {
    applyDarkMode();
    document.getElementsByClassName('dark-mode')[0].innerHTML = 'Light Mode'
}

function toggleSkill(element) {
    element.classList.toggle('active-skill');
}

function darkModeToggle() {
    darkMode = darkMode === 'dark' ? 'light' : 'dark';
    localStorage.setItem('darkMode', darkMode);
    applyDarkMode();
    if(darkMode==='light'){
        document.getElementsByClassName('dark-mode')[0].innerHTML = 'Dark Mode'
    }else{
        document.getElementsByClassName('dark-mode')[0].innerHTML = 'Light Mode'
    }
}
function applyDarkMode() {
    
        document.body.classList.toggle('dark-mode-toggle');

}