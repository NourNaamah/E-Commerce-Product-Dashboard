var selected_device;
var devices = [];

function setup() {
  //Get the default device from the application as a first step. Discovery takes longer to complete.
  BrowserPrint.getDefaultDevice(
    'printer',
    function (device) {
      //Add device to list of devices and to html select element
      selected_device = device;
      devices.push(device);
      var html_select = document.getElementById('selected_device');
      var option = document.createElement('option');
      option.text = device.name;
      if (html_select) html_select.add(option);

      //Discover any other devices available to the application
      BrowserPrint.getLocalDevices(
        function (device_list) {
          for (var i = 0; i < device_list.length; i++) {
            //Add device to list of devices and to html select element
            var device = device_list[i];
            if (!selected_device || device.uid != selected_device.uid) {
              devices.push(device);
              var option = document.createElement('option');
              option.text = device.name;
              option.value = device.uid;
              if (html_select) html_select.add(option);
            }
          }
        },
        function () {
          console.log('Error getting local devices');
        },
        'printer',
      );
    },
    function (error) {
      console.log(error);
    },
  );
}

function getConfig() {
  BrowserPrint.getApplicationConfiguration(
    function (config) {
      console.log(JSON.stringify(config));
    },
    function (error) {
      console.log(JSON.stringify(new BrowserPrint.ApplicationConfiguration()));
    },
  );
}

window.writeToSelectedPrinter = (dataToWrite) => {
  console.log(devices);
  console.log(selected_device);
  console.log(dataToWrite);

  onDeviceSelected({
    value: localStorage.getItem('label_printer'),
  });
  if (selected_device)
    selected_device.send(dataToWrite, undefined, errorCallback);
};
var readCallback = function (readData) {
  if (readData === undefined || readData === null || readData === '') {
    console.log('No Response from Device');
  } else {
    console.log(readData);
  }
};
var errorCallback = function (errorMessage) {
  console.log('Error: ' + errorMessage);
};

function readFromSelectedPrinter() {
  selected_device.read(readCallback, errorCallback);
}

function getDeviceCallback(deviceList) {
  console.log('Devices: \n' + JSON.stringify(deviceList, null, 4));
}

function sendImage(imageUrl) {
  url = window.location.href.substring(
    0,
    window.location.href.lastIndexOf('/'),
  );
  url = url + '/' + imageUrl;
  selected_device.convertAndSendFile(url, undefined, errorCallback);
}

function sendFile(fileUrl) {
  url = window.location.href.substring(
    0,
    window.location.href.lastIndexOf('/'),
  );
  url = url + '/' + fileUrl;
  selected_device.sendFile(url, undefined, errorCallback);
}

function onDeviceSelected(selected) {
  for (var i = 0; i < devices.length; ++i) {
    if (selected.value == devices[i].uid) {
      selected_device = devices[i];
      return;
    }
  }
}
window.onload = setup;
