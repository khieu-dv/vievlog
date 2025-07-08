export function initUI() {
    // disable right-click
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    // disable autocomplete
    document.querySelectorAll("input, form, textarea, select").forEach(element => {
        element.setAttribute("autocomplete", "off");
    });
}