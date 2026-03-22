use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub status: String,
    pub progress: i32,
    pub stack_tags: String, // JSON array as string
    pub github_url: Option<String>,
    pub live_url: Option<String>,
    pub icon_color: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateProjectInput {
    pub name: String,
    pub description: Option<String>,
    pub status: Option<String>,
    pub stack_tags: Option<String>,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct UpdateProjectInput {
    pub name: Option<String>,
    pub description: Option<String>,
    pub status: Option<String>,
    pub progress: Option<i32>,
    pub stack_tags: Option<String>,
    pub github_url: Option<String>,
    pub live_url: Option<String>,
}

// Note: These commands are stubs. In production, database operations
// are performed directly from the frontend using @tauri-apps/plugin-sql

#[tauri::command]
pub async fn get_projects(_filter: Option<String>) -> Result<Vec<Project>, String> {
    // Stub - frontend uses SQL plugin directly
    Ok(vec![])
}

#[tauri::command]
pub async fn get_project(_id: String) -> Result<Option<Project>, String> {
    // Stub - frontend uses SQL plugin directly
    Ok(None)
}

#[tauri::command]
pub async fn create_project(data: CreateProjectInput) -> Result<Project, String> {
    let id = nanoid::nanoid!(12);
    let now = chrono::Utc::now().to_rfc3339();

    let project = Project {
        id,
        name: data.name,
        description: data.description,
        status: data.status.unwrap_or_else(|| "planned".to_string()),
        progress: 0,
        stack_tags: data.stack_tags.unwrap_or_else(|| "[]".to_string()),
        github_url: None,
        live_url: None,
        icon_color: None,
        created_at: now.clone(),
        updated_at: now,
    };

    Ok(project)
}

#[tauri::command]
pub async fn update_project(
    _id: String,
    _data: UpdateProjectInput,
) -> Result<Option<Project>, String> {
    // Stub - frontend uses SQL plugin directly
    Ok(None)
}

#[tauri::command]
pub async fn delete_project(_id: String) -> Result<bool, String> {
    // Stub - frontend uses SQL plugin directly
    Ok(true)
}
