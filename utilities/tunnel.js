const { spawn } = require("child_process");

function connectToServeo(localPort, subdomain = null) {
  return new Promise((resolve, reject) => {
    const sshArgs = ["-T", "-o", "StrictHostKeyChecking=no"];

    // Add the subdomain if provided
    if (subdomain) {
      sshArgs.push("-R", `${subdomain}.serveo.net:80:localhost:${localPort}`);
    } else {
      sshArgs.push("-R", `80:localhost:${localPort}`);
    }

    sshArgs.push("serveo.net");

    const ssh = spawn("ssh", sshArgs);

    let serveoUrl = "";

    ssh.stdout.on("data", (data) => {
      const output = data.toString();
      const urlMatch = output.match(
        /Forwarding HTTP traffic from (https?:\/\/\S+)/,
      );
      if (urlMatch) {
        serveoUrl = urlMatch[1];
        resolve(serveoUrl);
      }
      if (output.includes("remote port forwarding failed")) {
        reject(
          new Error(
            `The subdomain '${subdomain}' is not available. Please try another one.`,
          ),
        );
      }
    });

    ssh.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
      if (!serveoUrl) {
        reject(new Error(data.toString()));
      }
    });

    ssh.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`SSH process exited with code ${code}`));
      }
    });
  });
}

module.exports = connectToServeo;
