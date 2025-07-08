pub fn clean_string_vector(v: &mut Vec<String>) {
    v.retain(|s: &String| !s.is_empty())
}
