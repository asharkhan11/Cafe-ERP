const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('erp', {
  version: '1.0.0'
});
