const socket = io(); //use this to initialize the socket that we will use to talk to the server
const inputDiv = document.getElementById("inputDiv"); // the input
const consoleDiv = document.getElementById("console");
let typing = true;

window.addEventListener("keydown", (event) => {
  inputDiv.focus();
  consoleDiv.innerHTML = "";
    if (event.key === "Enter" && typing) {
      event.preventDefault(); // Prevents adding a newline in the div
      const message = inputDiv.innerHTML.trim(); // Get the typed content
      if (message) {
        // if the message is valid and we have a partner
        socket.emit("message", message); // send it to the partner
        inputDiv.innerHTML = "";
      }
    } else {
      if (!typing) {
        // if a key is typed that isn't enter and we just received a message
        inputDiv.innerHTML = ""; // clear the input
        inputDiv.style.color = "blue"; // set the div color to blue
        typing = true; // since we are typing now, set typing variable to true
      }
    }
});

socket.on("message", (message) => {
  //if data from the server is received...
  inputDiv.innerHTML = message; //set the displayed in our browser to the received text
  inputDiv.style.color = "red"; //display received text as 'red'
  consoleDiv.innerHTML = "";
  typing = false; //set typing variable to false
});

socket.on("error", (message) => {
  //if data from the server is received...
  consoleDiv.innerHTML = message;
});
