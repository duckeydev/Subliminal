document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("tutorial") == false) {
     loadModal("success", "Welcome to the TransitCDNCDN interface", false, "step1")
    }
})