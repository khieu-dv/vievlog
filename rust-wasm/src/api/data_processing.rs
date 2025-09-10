use wasm_bindgen::prelude::*;
use js_sys::Date;
use crate::api::models::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ( $( $t:tt )* ) => {
        log(&format!( $( $t )* ))
    }
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
    Ok(serde_wasm_bindgen::to_value(&(result, processed_people))?)
}

#[wasm_bindgen]
pub fn analyze_data(data: &JsValue) -> Result<JsValue, JsValue> {
    let people: Vec<PersonData> = serde_wasm_bindgen::from_value(data.clone())?;
    if people.is_empty() {
        return Err(JsValue::from_str("No data provided"));
    }
    let total_records = people.len();
    let average_age = people.iter().map(|p| p.age as f64).sum::<f64>() / total_records as f64;
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

#[wasm_bindgen]
pub fn filter_data(data: &JsValue, filters: &JsValue) -> Result<JsValue, JsValue> {
    let people: Vec<PersonData> = serde_wasm_bindgen::from_value(data.clone())?;
    let filter_options: FilterOptions = serde_wasm_bindgen::from_value(filters.clone())?;
    let filtered: Vec<PersonData> = people
        .into_iter()
        .filter(|person| {
            if let Some(min_age) = filter_options.min_age {
                if person.age < min_age { return false; }
            }
            if let Some(max_age) = filter_options.max_age {
                if person.age > max_age { return false; }
            }
            if let Some(min_salary) = filter_options.min_salary {
                if let Some(salary) = person.salary {
                    if salary < min_salary { return false; }
                } else {
                    return false;
                }
            }
            if filter_options.active_only && !person.is_active {
                return false;
            }
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
