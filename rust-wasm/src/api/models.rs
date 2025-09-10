use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct PersonData {
    pub name: String,
    pub age: u32,
    pub email: String,
    pub skills: Vec<String>,
    pub salary: Option<f64>,
    pub is_active: bool,
}

#[derive(Serialize, Deserialize)]
pub struct ProcessingResult {
    pub success: bool,
    pub message: String,
    pub data: Option<PersonData>,
    pub timestamp: String,
    pub processing_time_ms: f64,
}

#[derive(Serialize, Deserialize)]
pub struct DataAnalysis {
    pub total_records: usize,
    pub average_age: f64,
    pub most_common_skill: String,
    pub salary_stats: SalaryStats,
    pub skill_distribution: Vec<SkillCount>,
}

#[derive(Serialize, Deserialize)]
pub struct SalaryStats {
    pub min: f64,
    pub max: f64,
    pub average: f64,
    pub median: f64,
}

#[derive(Serialize, Deserialize)]
pub struct SkillCount {
    pub skill: String,
    pub count: usize,
}

#[derive(Serialize, Deserialize)]
pub struct TableData {
    pub headers: Vec<String>,
    pub rows: Vec<Vec<String>>,
    pub total_rows: usize,
    pub filtered_rows: usize,
}

#[derive(Serialize, Deserialize)]
pub struct FilterOptions {
    pub min_age: Option<u32>,
    pub max_age: Option<u32>,
    pub required_skills: Vec<String>,
    pub min_salary: Option<f64>,
    pub active_only: bool,
}
