use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppSettings {
  pub model_provider: String,
  pub model_name: String,
  pub temperature: f64,
  pub max_tokens: u32,
  pub enabled_tools: Vec<String>,
}

#[tauri::command]
pub fn load_settings(app: tauri::AppHandle) -> Result<Option<AppSettings>, String> {
  let path = settings_path(&app)?;

  if !path.exists() {
    return Ok(None);
  }

  let contents = std::fs::read_to_string(path).map_err(|error| error.to_string())?;
  serde_json::from_str(&contents).map(Some).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn save_settings(app: tauri::AppHandle, settings: AppSettings) -> Result<bool, String> {
  let path = settings_path(&app)?;
  let contents = serde_json::to_string_pretty(&settings).map_err(|error| error.to_string())?;

  std::fs::write(path, contents).map_err(|error| error.to_string())?;
  Ok(true)
}

fn settings_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
  let config_dir = app.path().app_config_dir().map_err(|error| error.to_string())?;
  std::fs::create_dir_all(&config_dir).map_err(|error| error.to_string())?;
  Ok(config_dir.join("settings.json"))
}
