const fs = require('fs-extra');
const path = require('path');
const os = require('os');

class ConfigManager {
  constructor() {
    this.configDir = path.join(os.homedir(), '.trconnects');
    this.ensureConfigDir();
  }

  ensureConfigDir() {
    fs.ensureDirSync(this.configDir);
  }

  getConfigPath() {
    return path.join(this.configDir, 'config.json');
  }

  loadConfig() {
    try {
      const configPath = this.getConfigPath();
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
    return {};
  }

  saveConfig(config) {
    try {
      const configPath = this.getConfigPath();
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  get(key, defaultValue) {
    const config = this.loadConfig();
    return config[key] || defaultValue;
  }

  set(key, value) {
    const config = this.loadConfig();
    config[key] = value;
    this.saveConfig(config);
  }
}

module.exports = new ConfigManager();
