use serde::{Deserialize, Serialize};
use sqlx::{MySqlPool, Row};
use tauri::Manager;

struct AppState {
  db: MySqlPool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct DbBox {
  id: String,
  title: String,
  room_id: String,
  items_preview: String,
  fragile: bool,
  status: String,
  created_at: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct NewBox {
  id: String,
  title: String,
  room_id: String,
  items_preview: String,
  fragile: bool,
  status: String,
  created_at: String,
}

async fn init_db(mysql_url: &str) -> Result<MySqlPool, String> {
  let pool = MySqlPool::connect(mysql_url)
    .await
    .map_err(|e| format!("MySQL connection failed: {e}"))?;

  sqlx::query(
    "CREATE TABLE IF NOT EXISTS boxes (
      id VARCHAR(120) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      room_id VARCHAR(120) NOT NULL,
      items_preview TEXT NOT NULL,
      fragile BOOLEAN NOT NULL,
      status VARCHAR(32) NOT NULL,
      created_at VARCHAR(64) NOT NULL
    )",
  )
  .execute(&pool)
  .await
  .map_err(|e| format!("Failed to prepare schema: {e}"))?;

  Ok(pool)
}

#[tauri::command]
async fn load_boxes(state: tauri::State<'_, AppState>) -> Result<Vec<DbBox>, String> {
  let rows = sqlx::query(
    "SELECT id, title, room_id, items_preview, fragile, status, created_at FROM boxes ORDER BY created_at DESC",
  )
  .fetch_all(&state.db)
  .await
  .map_err(|e| format!("Failed to load boxes: {e}"))?;

  let boxes = rows
    .into_iter()
    .map(|row| DbBox {
      id: row.get("id"),
      title: row.get("title"),
      room_id: row.get("room_id"),
      items_preview: row.get("items_preview"),
      fragile: row.get("fragile"),
      status: row.get("status"),
      created_at: row.get("created_at"),
    })
    .collect();

  Ok(boxes)
}

#[tauri::command]
async fn add_box(state: tauri::State<'_, AppState>, payload: NewBox) -> Result<(), String> {
  sqlx::query(
    "INSERT INTO boxes (id, title, room_id, items_preview, fragile, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)",
  )
  .bind(payload.id)
  .bind(payload.title)
  .bind(payload.room_id)
  .bind(payload.items_preview)
  .bind(payload.fragile)
  .bind(payload.status)
  .bind(payload.created_at)
  .execute(&state.db)
  .await
  .map_err(|e| format!("Failed to add box: {e}"))?;

  Ok(())
}

#[tauri::command]
async fn update_box_status(
  state: tauri::State<'_, AppState>,
  box_id: String,
  status: String,
) -> Result<(), String> {
  sqlx::query("UPDATE boxes SET status = ? WHERE id = ?")
    .bind(status)
    .bind(box_id)
    .execute(&state.db)
    .await
    .map_err(|e| format!("Failed to update box status: {e}"))?;
  Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let mysql_url = std::env::var("MYSQL_URL")
    .unwrap_or_else(|_| "mysql://root:root@127.0.0.1:3306/packgo".to_string());
  let pool = tauri::async_runtime::block_on(init_db(&mysql_url)).expect("MySQL setup failed");

  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      app.manage(AppState { db: pool.clone() });
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![load_boxes, add_box, update_box_status])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
