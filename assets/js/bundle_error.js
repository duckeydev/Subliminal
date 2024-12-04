document.addEventListener("DOMContentLoaded", () => {
  console.log("Just beat it!");
  const error = document.getElementById("500");
  clicks = 0;
  error.addEventListener("click", () => {
    if (clicks != 5) {
      console.log("error");
      clicks = clicks + 1;
      console.log(clicks);
    } else if (clicks == 5) {
      console.log("Your now a developer!");
      console.log("Start cooking yo!");
      const debug = document.getElementById("debug");
      debug.classList.remove("hidden");
      const debuggie = document.getElementById(
        "hs-floating-input-passowrd-value"
      );
      document.addEventListener("keypress", (event) => {
        if (event.key == "Enter") {
          axios
            .post("/api/debuggie", { key: debuggie.value })
            .then((response) => {
                console.log(response.data)
            });
        }
      });
    }
  });
});
