document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('fileChanged', (data) => {
    console.log('File changed:', data);
    location.reload(); // Reload the page on file change
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
});
