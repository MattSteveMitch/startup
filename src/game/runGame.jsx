export function runGame(windowRef, setStarted) {
    windowRef.current.className = "";
    console.log("running");
    setStarted(true);
}
