/**
 * Theme settings
 */

function initThemeRadio() {
    let currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') document.getElementById('themeToggle').checked = true;
}
initThemeRadio();

function setTheme() {
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) currentTheme = 'light';
    if (currentTheme === 'light') document.querySelector(":root").classList.add("dark");
    if (currentTheme === 'dark') document.querySelector(":root").classList.remove("dark");
}

const optionsDiv = document.getElementById('options');

function toggleTheme() {
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) currentTheme = 'light';
    if (currentTheme === 'light') localStorage.setItem('theme', 'dark');
    if (currentTheme === 'dark') localStorage.setItem('theme', 'light');
}

setTheme()
function emitThemeChange() {
    toggleTheme();
    setTheme()
}


/**
 * Gamemode selection
 */
const select = document.getElementById('select_gamemode');
initGamemodeValue();
let gamemode = localStorage.getItem('gamemode');

select.addEventListener('change', () => {
    localStorage.setItem('gamemode', select.value);
})

function initGamemodeValue() {
    let initGamemode = localStorage.getItem('gamemode');
    if (initGamemode) select.value = initGamemode;
}