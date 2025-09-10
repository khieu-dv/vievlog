"use client";

import React, { useState, useEffect } from 'react';
import { rustWasm, PersonData, FilterOptions, DataAnalysis, TableData } from '~/lib/wasm-loader';
import { Button } from '~/components/ui/Button';

export function DataIODemo() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState<PersonData[]>([]);
  const [analysis, setAnalysis] = useState<DataAnalysis | null>(null);
  const [filteredData, setFilteredData] = useState<PersonData[]>([]);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PersonData[]>([]);

  // Form state for adding new person
  const [newPerson, setNewPerson] = useState<PersonData>({
    name: '',
    age: 25,
    email: '',
    skills: [],
    salary: undefined,
    is_active: true
  });

  // Filter state
  const [filters, setFilters] = useState<FilterOptions>({
    min_age: undefined,
    max_age: undefined,
    required_skills: [],
    min_salary: undefined,
    active_only: false
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    const initWasm = async () => {
      try {
        setLoading(true);
        await rustWasm.init();
        setIsLoaded(true);
        
        // Load sample data
        loadSampleData();
      } catch (error) {
        console.error('Failed to initialize WASM:', error);
      } finally {
        setLoading(false);
      }
    };

    initWasm();
  }, []);

  const loadSampleData = () => {
    const sampleData: PersonData[] = [
      {
        name: "Alice Johnson",
        age: 28,
        email: "alice.johnson@example.com",
        skills: ["JavaScript", "React", "Node.js"],
        salary: 75000,
        is_active: true
      },
      {
        name: "Bob Smith",
        age: 35,
        email: "bob.smith@example.com",
        skills: ["Python", "Django", "PostgreSQL"],
        salary: 85000,
        is_active: true
      },
      {
        name: "Carol Davis",
        age: 24,
        email: "carol.davis@example.com",
        skills: ["Rust", "WebAssembly", "Systems Programming"],
        salary: 70000,
        is_active: false
      },
      {
        name: "David Wilson",
        age: 42,
        email: "david.wilson@example.com",
        skills: ["Go", "Docker", "Kubernetes"],
        salary: 95000,
        is_active: true
      },
      {
        name: "Eva Brown",
        age: 31,
        email: "eva.brown@example.com",
        skills: ["TypeScript", "Angular", "Azure"],
        salary: 80000,
        is_active: true
      }
    ];
    
    setPeople(sampleData);
    setFilteredData(sampleData);
  };

  const addPerson = () => {
    if (!isLoaded || !newPerson.name || !newPerson.email) return;

    const personToAdd = { ...newPerson };
    const updatedPeople = [...people, personToAdd];
    
    setPeople(updatedPeople);
    setFilteredData(updatedPeople);
    
    // Reset form
    setNewPerson({
      name: '',
      age: 25,
      email: '',
      skills: [],
      salary: undefined,
      is_active: true
    });
    setSkillInput('');
  };

  const processSinglePerson = (person: PersonData) => {
    if (!isLoaded) return;

    try {
      const result = rustWasm.processPersonData(person);
      console.log('Processing result:', result);
      
      if (result.success && result.data) {
        // Update the person in the list
        const updatedPeople = people.map(p => 
          p.email === person.email ? result.data! : p
        );
        setPeople(updatedPeople);
        setFilteredData(updatedPeople);
      }
    } catch (error) {
      console.error('Error processing person:', error);
    }
  };

  const processBulkData = () => {
    if (!isLoaded) return;

    try {
      const result = rustWasm.processBulkData(people);
      console.log('Bulk processing result:', result);
      
      if (result.result.success) {
        setPeople(result.processedData);
        setFilteredData(result.processedData);
      }
    } catch (error) {
      console.error('Error processing bulk data:', error);
    }
  };

  const analyzeData = () => {
    if (!isLoaded || people.length === 0) return;

    try {
      const analysisResult = rustWasm.analyzeData(people);
      console.log('Analysis result:', analysisResult);
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Error analyzing data:', error);
    }
  };

  const applyFilters = () => {
    if (!isLoaded) return;

    try {
      const filtered = rustWasm.filterData(people, filters);
      console.log('Filtered data:', filtered);
      setFilteredData(filtered);
    } catch (error) {
      console.error('Error filtering data:', error);
    }
  };

  const generateTable = () => {
    if (!isLoaded) return;

    try {
      const table = rustWasm.dataToTable(filteredData);
      console.log('Table data:', table);
      setTableData(table);
    } catch (error) {
      console.error('Error generating table:', error);
    }
  };

  const performSearch = () => {
    if (!isLoaded || !searchQuery.trim()) return;

    try {
      const results = rustWasm.searchData(people, searchQuery);
      console.log('Search results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching data:', error);
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setNewPerson({
        ...newPerson,
        skills: [...newPerson.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setNewPerson({
      ...newPerson,
      skills: newPerson.skills.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading Rust WASM...</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center text-red-600">
          <p>Failed to load Rust WASM module.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🔄 Data Input/Output Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Advanced data processing with Rust and Next.js
        </p>
      </div>

      {/* Add New Person Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Person</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={newPerson.name}
              onChange={(e) => setNewPerson({...newPerson, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={newPerson.email}
              onChange={(e) => setNewPerson({...newPerson, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              value={newPerson.age}
              onChange={(e) => setNewPerson({...newPerson, age: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              min="18"
              max="100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Salary (optional)</label>
            <input
              type="number"
              value={newPerson.salary || ''}
              onChange={(e) => setNewPerson({
                ...newPerson, 
                salary: e.target.value ? parseFloat(e.target.value) : undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="50000"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} type="button">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newPerson.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-md text-sm flex items-center gap-1"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={newPerson.is_active}
              onChange={(e) => setNewPerson({...newPerson, is_active: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-sm font-medium">Active</label>
          </div>
        </div>
        
        <Button onClick={addPerson} className="mt-4">
          Add Person
        </Button>
      </div>

      {/* Data Operations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-3">Bulk Operations</h3>
          <div className="space-y-2">
            <Button onClick={processBulkData} className="w-full">
              Process All Data
            </Button>
            <Button onClick={analyzeData} className="w-full">
              Analyze Data
            </Button>
            <Button onClick={generateTable} className="w-full">
              Generate Table
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-3">Search</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Search name, email, or skills"
            />
            <Button onClick={performSearch} className="w-full">
              Search
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-3">Filters</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min age"
                value={filters.min_age || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  min_age: e.target.value ? parseInt(e.target.value) : undefined
                })}
                className="flex-1 px-2 py-1 border rounded text-sm"
              />
              <input
                type="number"
                placeholder="Max age"
                value={filters.max_age || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  max_age: e.target.value ? parseInt(e.target.value) : undefined
                })}
                className="flex-1 px-2 py-1 border rounded text-sm"
              />
            </div>
            <input
              type="number"
              placeholder="Min salary"
              value={filters.min_salary || ''}
              onChange={(e) => setFilters({
                ...filters,
                min_salary: e.target.value ? parseFloat(e.target.value) : undefined
              })}
              className="w-full px-2 py-1 border rounded text-sm"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active_only"
                checked={filters.active_only}
                onChange={(e) => setFilters({...filters, active_only: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="active_only" className="text-sm">Active only</label>
            </div>
            <Button onClick={applyFilters} className="w-full" size="sm">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Data Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* People List */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-3">
            People ({filteredData.length}/{people.length})
          </h3>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredData.map((person, index) => (
              <div key={index} className="p-3 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{person.name}</h4>
                    <p className="text-sm text-gray-600">{person.email}</p>
                    <p className="text-sm">Age: {person.age}</p>
                    {person.salary && <p className="text-sm">Salary: ${person.salary.toLocaleString()}</p>}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {person.skills.map((skill, i) => (
                        <span key={i} className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 rounded text-xs ${person.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {person.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button size="sm" onClick={() => processSinglePerson(person)}>
                      Process
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-3">Data Analysis</h3>
            <div className="space-y-3">
              <div>
                <p><strong>Total Records:</strong> {analysis.total_records}</p>
                <p><strong>Average Age:</strong> {analysis.average_age.toFixed(1)} years</p>
                <p><strong>Most Common Skill:</strong> {analysis.most_common_skill}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Salary Statistics</h4>
                <div className="text-sm space-y-1">
                  <p>Min: ${analysis.salary_stats.min.toLocaleString()}</p>
                  <p>Max: ${analysis.salary_stats.max.toLocaleString()}</p>
                  <p>Average: ${analysis.salary_stats.average.toLocaleString()}</p>
                  <p>Median: ${analysis.salary_stats.median.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Skill Distribution</h4>
                <div className="space-y-1">
                  {analysis.skill_distribution.slice(0, 5).map((skill, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{skill.skill}</span>
                      <span>{skill.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-3">Search Results ({searchResults.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults.map((person, index) => (
              <div key={index} className="p-3 border rounded-md">
                <h4 className="font-semibold">{person.name}</h4>
                <p className="text-sm text-gray-600">{person.email}</p>
                <p className="text-sm">Skills: {person.skills.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table View */}
      {tableData && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-3">Table View</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {tableData.headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-300 px-3 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Performance Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
          🚀 Data Processing Features
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Real-time data processing with Rust performance</li>
          <li>• Complex filtering and search operations</li>
          <li>• Statistical analysis and data insights</li>
          <li>• Bulk data operations</li>
          <li>• Table generation and data visualization</li>
          <li>• Type-safe data transfer between JS and Rust</li>
        </ul>
      </div>
    </div>
  );
}