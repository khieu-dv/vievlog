#include <emscripten/bind.h>
#include <emscripten/emscripten.h>
#include <string>
#include <vector>
#include <cmath>
#include <algorithm>
#include <cctype>

using namespace emscripten;

// Simple math functions
int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

double fibonacci(int n) {
    if (n <= 1) return n;
    double a = 0, b = 1, temp;
    for (int i = 2; i <= n; i++) {
        temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}

double factorial(int n) {
    if (n <= 1) return 1;
    double result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// String manipulation
std::string reverseString(const std::string& str) {
    std::string reversed = str;
    std::reverse(reversed.begin(), reversed.end());
    return reversed;
}

std::string toUpperCase(const std::string& str) {
    std::string upper = str;
    std::transform(upper.begin(), upper.end(), upper.begin(), ::toupper);
    return upper;
}

// Array processing
std::vector<int> sortArray(std::vector<int> arr) {
    std::sort(arr.begin(), arr.end());
    return arr;
}

double calculateMean(const std::vector<double>& numbers) {
    if (numbers.empty()) return 0.0;
    double sum = 0.0;
    for (double num : numbers) {
        sum += num;
    }
    return sum / numbers.size();
}

// Complex calculation example
double calculateDistance(double x1, double y1, double x2, double y2) {
    double dx = x2 - x1;
    double dy = y2 - y1;
    return std::sqrt(dx * dx + dy * dy);
}

// Bind C++ functions to JavaScript
EMSCRIPTEN_BINDINGS(math_utils) {
    function("add", &add);
    function("multiply", &multiply);
    function("fibonacci", &fibonacci);
    function("factorial", &factorial);
    function("reverseString", &reverseString);
    function("toUpperCase", &toUpperCase);
    function("sortArray", &sortArray);
    function("calculateMean", &calculateMean);
    function("calculateDistance", &calculateDistance);

    register_vector<int>("VectorInt");
    register_vector<double>("VectorDouble");
}