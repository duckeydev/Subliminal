document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("tutorial") == false) {
     loadModal("success", "Welcome to the SubliminalCDN interface", false, "step1")
    }
})