export function runGame(windowRef) {
    windowRef.current.className = "";
    console.log("running");
    localStorage.setItem("started", true);
}
