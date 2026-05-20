mod commands;

use commands::settings::{load_settings, save_settings};
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      // On Windows, remove the native title bar so the custom HTML
      // titlebar integrates seamlessly into the window chrome.
      #[cfg(target_os = "windows")]
      if let Some(window) = app.get_webview_window("main") {
        window.set_decorations(false)?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![load_settings, save_settings])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
