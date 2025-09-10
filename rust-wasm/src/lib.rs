use wasm_bindgen::prelude::*;
use js_sys::Date;
use serde::{Deserialize, Serialize};

// Import the `console.log` function from the browser
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! console_log {
    ( $( $t:tt )* ) => {
        log(&format!( $( $t )* ))
    }
}

// Called when the wasm module is instantiated
#[wasm_bindgen(start)]
pub fn main() {
    // Set panic hook for better error messages
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
    
    console_log!("VieVlog Rust WASM initialized!");
}

// Simple greeting function
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! This message comes from Rust 🦀", name)
}

// Math utilities
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u64 {
    if n <= 1 {
        return n as u64;
    }
    
    let mut a = 0u64;
    let mut b = 1u64;
    
    for _ in 2..=n {
        let temp = a + b;
        a = b;
        b = temp;
    }
    
    b
}

// String processing utilities
#[wasm_bindgen]
pub fn reverse_string(input: &str) -> String {
    input.chars().rev().collect()
}

#[wasm_bindgen]
pub fn count_words(text: &str) -> usize {
    text.split_whitespace().count()
}

// Performance testing function
#[wasm_bindgen]
pub fn heavy_computation(iterations: u32) -> f64 {
    let start = Date::now();
    
    let mut result = 0.0;
    for i in 0..iterations {
        result += (i as f64).sin().cos().tan();
    }
    
    let end = Date::now();
    console_log!("Heavy computation took {} ms", end - start);
    
    result
}

// Working with complex data structures
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

#[wasm_bindgen]
pub fn process_person_data(data: &JsValue) -> Result<JsValue, JsValue> {
    let start_time = Date::now();
    
    let person: PersonData = serde_wasm_bindgen::from_value(data.clone())?;
    
    let processed = PersonData {
        name: format!("Processed: {}", person.name),
        age: person.age + 1,
        email: person.email.to_lowercase(),
        skills: person.skills.iter().map(|s| s.to_uppercase()).collect(),
        salary: person.salary.map(|s| s * 1.1), // 10% increase
        is_active: true,
    };
    
    let end_time = Date::now();
    
    let result = ProcessingResult {
        success: true,
        message: "Person data processed successfully".to_string(),
        data: Some(processed),
        timestamp: js_sys::Date::new_0().to_iso_string().as_string().unwrap(),
        processing_time_ms: end_time - start_time,
    };
    
    Ok(serde_wasm_bindgen::to_value(&result)?)
}

// Process multiple records
#[wasm_bindgen]
pub fn process_bulk_data(data: &JsValue) -> Result<JsValue, JsValue> {
    let start_time = Date::now();
    
    let people: Vec<PersonData> = serde_wasm_bindgen::from_value(data.clone())?;
    let mut processed_people = Vec::new();
    
    for person in people {
        let processed = PersonData {
            name: format!("Processed: {}", person.name),
            age: person.age + 1,
            email: person.email.to_lowercase(),
            skills: person.skills.iter().map(|s| s.to_uppercase()).collect(),
            salary: person.salary.map(|s| s * 1.1),
            is_active: true,
        };
        processed_people.push(processed);
    }
    
    let end_time = Date::now();
    
    let result = ProcessingResult {
        success: true,
        message: format!("Processed {} records successfully", processed_people.len()),
        data: None,
        timestamp: js_sys::Date::new_0().to_iso_string().as_string().unwrap(),
        processing_time_ms: end_time - start_time,
    };
    
    console_log!("Bulk processing completed in {} ms", end_time - start_time);
    
    Ok(serde_wasm_bindgen::to_value(&(result, processed_people))?)
}

// Analyze data and return statistics
#[wasm_bindgen]
pub fn analyze_data(data: &JsValue) -> Result<JsValue, JsValue> {
    let people: Vec<PersonData> = serde_wasm_bindgen::from_value(data.clone())?;
    
    if people.is_empty() {
        return Err(JsValue::from_str("No data provided"));
    }
    
    // Calculate statistics
    let total_records = people.len();
    let average_age = people.iter().map(|p| p.age as f64).sum::<f64>() / total_records as f64;
    
    // Skill analysis
    let mut skill_counts: std::collections::HashMap<String, usize> = std::collections::HashMap::new();
    for person in &people {
        for skill in &person.skills {
            *skill_counts.entry(skill.clone()).or_insert(0) += 1;
        }
    }
    
    let most_common_skill = skill_counts
        .iter()
        .max_by_key(|(_, &count)| count)
        .map(|(skill, _)| skill.clone())
        .unwrap_or_else(|| "None".to_string());
    
    let skill_distribution: Vec<SkillCount> = skill_counts
        .into_iter()
        .map(|(skill, count)| SkillCount { skill, count })
        .collect();
    
    // Salary statistics
    let salaries: Vec<f64> = people
        .iter()
        .filter_map(|p| p.salary)
        .collect();
    
    let salary_stats = if salaries.is_empty() {
        SalaryStats {
            min: 0.0,
            max: 0.0,
            average: 0.0,
            median: 0.0,
        }
    } else {
        let min = salaries.iter().fold(f64::INFINITY, |a, &b| a.min(b));
        let max = salaries.iter().fold(f64::NEG_INFINITY, |a, &b| a.max(b));
        let average = salaries.iter().sum::<f64>() / salaries.len() as f64;
        
        let mut sorted_salaries = salaries.clone();
        sorted_salaries.sort_by(|a, b| a.partial_cmp(b).unwrap());
        let median = if sorted_salaries.len() % 2 == 0 {
            (sorted_salaries[sorted_salaries.len() / 2 - 1] + sorted_salaries[sorted_salaries.len() / 2]) / 2.0
        } else {
            sorted_salaries[sorted_salaries.len() / 2]
        };
        
        SalaryStats { min, max, average, median }
    };
    
    let analysis = DataAnalysis {
        total_records,
        average_age,
        most_common_skill,
        salary_stats,
        skill_distribution,
    };
    
    Ok(serde_wasm_bindgen::to_value(&analysis)?)
}

// Filter data based on criteria
#[wasm_bindgen]
pub fn filter_data(data: &JsValue, filters: &JsValue) -> Result<JsValue, JsValue> {
    let people: Vec<PersonData> = serde_wasm_bindgen::from_value(data.clone())?;
    let filter_options: FilterOptions = serde_wasm_bindgen::from_value(filters.clone())?;
    
    let filtered: Vec<PersonData> = people
        .into_iter()
        .filter(|person| {
            // Age filter
            if let Some(min_age) = filter_options.min_age {
                if person.age < min_age {
                    return false;
                }
            }
            if let Some(max_age) = filter_options.max_age {
                if person.age > max_age {
                    return false;
                }
            }
            
            // Salary filter
            if let Some(min_salary) = filter_options.min_salary {
                if let Some(salary) = person.salary {
                    if salary < min_salary {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            
            // Active filter
            if filter_options.active_only && !person.is_active {
                return false;
            }
            
            // Skills filter
            if !filter_options.required_skills.is_empty() {
                let has_required_skills = filter_options.required_skills
                    .iter()
                    .all(|required_skill| {
                        person.skills.iter().any(|skill| 
                            skill.to_lowercase().contains(&required_skill.to_lowercase())
                        )
                    });
                if !has_required_skills {
                    return false;
                }
            }
            
            true
        })
        .collect();
    
    Ok(serde_wasm_bindgen::to_value(&filtered)?)
}

// Convert data to table format
#[wasm_bindgen]
pub fn data_to_table(data: &JsValue) -> Result<JsValue, JsValue> {
    let people: Vec<PersonData> = serde_wasm_bindgen::from_value(data.clone())?;
    
    let headers = vec![
        "Name".to_string(),
        "Age".to_string(),
        "Email".to_string(),
        "Skills".to_string(),
        "Salary".to_string(),
        "Status".to_string(),
    ];
    
    let rows: Vec<Vec<String>> = people
        .iter()
        .map(|person| {
            vec![
                person.name.clone(),
                person.age.to_string(),
                person.email.clone(),
                person.skills.join(", "),
                person.salary.map_or_else(|| "N/A".to_string(), |s| format!("${:.2}", s)),
                if person.is_active { "Active" } else { "Inactive" }.to_string(),
            ]
        })
        .collect();
    
    let table = TableData {
        headers,
        total_rows: people.len(),
        filtered_rows: people.len(),
        rows,
    };
    
    Ok(serde_wasm_bindgen::to_value(&table)?)
}

// Search functionality
#[wasm_bindgen]
pub fn search_data(data: &JsValue, query: &str) -> Result<JsValue, JsValue> {
    let people: Vec<PersonData> = serde_wasm_bindgen::from_value(data.clone())?;
    let query_lower = query.to_lowercase();
    
    let results: Vec<PersonData> = people
        .into_iter()
        .filter(|person| {
            person.name.to_lowercase().contains(&query_lower)
                || person.email.to_lowercase().contains(&query_lower)
                || person.skills.iter().any(|skill| skill.to_lowercase().contains(&query_lower))
        })
        .collect();
    
    Ok(serde_wasm_bindgen::to_value(&results)?)
}

// Text analysis functions (useful for content management)
#[wasm_bindgen]
pub fn analyze_text(text: &str) -> JsValue {
    let word_count = text.split_whitespace().count();
    let char_count = text.chars().count();
    let line_count = text.lines().count();
    
    // Calculate reading time (assuming 200 words per minute)
    let reading_time_minutes = (word_count as f64 / 200.0).ceil() as u32;
    
    let analysis = serde_json::json!({
        "wordCount": word_count,
        "charCount": char_count,
        "lineCount": line_count,
        "readingTimeMinutes": reading_time_minutes
    });
    
    JsValue::from_str(&analysis.to_string())
}

// Hash function for simple content verification
#[wasm_bindgen]
pub fn simple_hash(input: &str) -> u32 {
    let mut hash = 0u32;
    for byte in input.bytes() {
        hash = hash.wrapping_mul(31).wrapping_add(byte as u32);
    }
    hash
}

// Array processing utilities
#[wasm_bindgen]
pub fn sum_array(numbers: &[i32]) -> i32 {
    numbers.iter().sum()
}

#[wasm_bindgen]
pub fn find_max(numbers: &[i32]) -> Option<i32> {
    numbers.iter().max().cloned()
}

// URL slug generation (useful for CMS)
#[wasm_bindgen]
pub fn generate_slug(title: &str) -> String {
    title
        .to_lowercase()
        .chars()
        .map(|c| {
            if c.is_alphanumeric() {
                c
            } else if c.is_whitespace() {
                '-'
            } else {
                '-'
            }
        })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<&str>>()
        .join("-")
}