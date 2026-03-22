use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct UserStats {
    pub total_xp: i32,
    pub level: i32,
    pub level_name: String,
    pub xp_to_next_level: i32,
    pub current_streak: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct XPLogEntry {
    pub id: String,
    pub amount: i32,
    pub reason: String,
    pub source_type: String,
    pub source_id: Option<String>,
    pub created_at: String,
}

// Level thresholds and names
const LEVELS: [(i32, &str); 10] = [
    (0, "Novice"),
    (250, "Apprentice"),
    (750, "Developer"),
    (1500, "Engineer"),
    (3000, "Senior"),
    (5000, "Staff"),
    (8000, "Principal"),
    (12000, "Architect"),
    (18000, "Fellow"),
    (25000, "Legend"),
];

pub fn calculate_level(xp: i32) -> (i32, &'static str, i32) {
    let mut level = 0;
    let mut name = "Novice";
    let mut next_threshold = 250;

    for (i, (threshold, level_name)) in LEVELS.iter().enumerate() {
        if xp >= *threshold {
            level = i as i32;
            name = level_name;
            next_threshold = LEVELS.get(i + 1).map(|(t, _)| *t).unwrap_or(i32::MAX);
        } else {
            break;
        }
    }

    (level, name, next_threshold - xp)
}

// Note: These commands are stubs. Database operations
// are performed from the frontend using @tauri-apps/plugin-sql

#[tauri::command]
pub async fn get_user_stats() -> Result<UserStats, String> {
    // Stub - frontend uses SQL plugin directly
    let total_xp = 0;
    let (level, level_name, xp_to_next) = calculate_level(total_xp);

    Ok(UserStats {
        total_xp,
        level,
        level_name: level_name.to_string(),
        xp_to_next_level: xp_to_next,
        current_streak: 0,
    })
}

#[tauri::command]
pub async fn add_xp(
    amount: i32,
    reason: String,
    source_type: String,
    source_id: Option<String>,
) -> Result<XPLogEntry, String> {
    let id = nanoid::nanoid!(12);
    let now = chrono::Utc::now().to_rfc3339();

    let entry = XPLogEntry {
        id,
        amount,
        reason,
        source_type,
        source_id,
        created_at: now,
    };

    Ok(entry)
}

#[tauri::command]
pub async fn get_xp_log(_limit: Option<i32>) -> Result<Vec<XPLogEntry>, String> {
    // Stub - frontend uses SQL plugin directly
    Ok(vec![])
}
