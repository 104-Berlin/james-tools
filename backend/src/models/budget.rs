use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Monthly {
    pub id: Uuid,
    pub position: String,
    pub debit: f64,  // -
    pub credit: f64, // +
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MonthlyUpdate {
    pub id: Uuid,
    pub position: Option<String>,
    pub debit: Option<f64>,  // -
    pub credit: Option<f64>, // +
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MonthlyAdd {
    pub position: String,
    pub debit: Option<f64>,  // -
    pub credit: Option<f64>, // +
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MonthlyDelete {
    pub delete: Vec<Uuid>,
}
