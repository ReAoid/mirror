mod commands;

use commands::settings::{load_settings, save_settings};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![load_settings, save_settings])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
