const path = require('path');
const { ipcRenderer } = require('electron');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

let cpuOverload;
let alertFrequency;

// Get settings & values
ipcRenderer.on('settings:get', (e, settings) => {
  cpuOverload = +settings.cpuOverload;
  alertFrequency = +settings.alertFrequency;
});

// Run every 2 seconds
setInterval(() => {
  // CPU Usage
  cpu.usage().then(info => {
    document.getElementById('cpu-usage').innerText = info + '%';

    document.getElementById('cpu-progress').style.width = info + '%';

    // Make progress bar red if overload
    if (info >= cpuOverload) {
      document.getElementById('cpu-progress').style.backgroundColor = 'red';
    } else {
      document.getElementById('cpu-progress').style.backgroundColor = '#30c88b';
    }

    // Check Overload
    if (info >= cpuOverload && runNotify(alertFrequency)) {
      notifyUser({
        title: 'CPU Overload',
        body: `CPU is over ${cpuOverload}%`,
        icon: path.join(__dirname, 'img', 'icon.png'),
      });

      localStorage.setItem('lastNotify', +new Date());
    }
  });

  // CPU Free
  cpu.free().then(info => {
    document.getElementById('cpu-free').innerText = info + '%';
  });

  // Uptime
  document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime());
}, 2000);

// Set model
document.getElementById('cpu-model').innerText = cpu.model();

// Computer Name
document.getElementById('comp-name').innerText = os.hostname();

// OS
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`;

// Total Mem
mem.info().then(info => {
  document.getElementById('mem-total').innerText = info.totalMemMb;
});

// Show days, hours, mins, secs
function secondsToDhms(seconds) {
  seconds = +seconds;

  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${days}d, ${hours}h, ${min}m, ${secs}s`;
}

// Send Notificatino
function notifyUser(options) {
  new Notification(options.title, options);
}

// Check how much time has passed since notification
function runNotify(frequency) {
  const lastNotify = localStorage.getItem('lastNotify');

  if (!lastNotify) {
    localStorage.setItem('lastNotify', +new Date());

    return true;
  }

  const notifyTime = new Date(parseInt(lastNotify));
  const now = new Date();
  const diff = Math.abs(now - notifyTime);
  const minutesPassed = Math.ceil(diff / (1000 * 60));

  if (minutesPassed > frequency) {
    return true;
  } else {
    return false;
  }
}
