import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import static resources
import staticResources from '../../data/resources/static-resources.json';

export default function ResourceCatalog() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedJVDTKey, setSelectedJVDTKey] = useState('all');
  const [loading, setLoading] = useState(true);

  // Categories based on JVDT methodology
  const categories = [
    { id: 'all', name: 'All Categories', icon: '📚' },
    { id: 'trauma-healing', name: 'Trauma Healing', icon: '💚' },
    { id: 'language-learning', name: 'Language Learning', icon: '🗣️' },
    { id: 'critical-thinking', name: 'Critical Thinking', icon: '🧠' },
    { id: 'self-awareness', name: 'Self-Awareness', icon: '🪞' },
    { id: 'communication', name: 'Communication', icon: '💬' },
    { id: 'learning-strategies', name: 'Learning Strategies', icon: '📈' },
    { id: 'assessment', name: 'Assessment Tools', icon: '📊' }
  ];

  const resourceTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'flashcards', name: 'Flashcards' },
    { id: 'workbook', name: 'Workbooks' },
    { id: 'assessment', name: 'Assessments' },
    { id: 'scenarios', name: 'Scenarios' },
    { id: 'toolkit', name: 'Toolkits' },
    { id: 'guide', name: 'Guides' }
  ];

  const jvdtKeys = [
    { id: 'all', name: 'All Keys' },
    { id: 'Association', name: 'Association' },
    { id: 'Analysis', name: 'Analysis' },
    { id: 'Root', name: 'Root' },
    { id: 'Context', name: 'Context' },
    { id: 'Integration', name: 'Integration' }
  ];

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [resources, searchTerm, selectedCategory, selectedType, selectedJVDTKey]);

  const loadResources = () => {
    setLoading(true);
    
    // Load static resources
    let allResources = [...staticResources];
    
    // Load generated resources from localStorage
    try {
      const generatedResources = JSON.parse(localStorage.getItem('jvdt:generated-resources') || '[]');
      allResources = [...allResources, ...generatedResources];
    } catch (error) {
      console.warn('Could not load generated resources:', error);
    }
    
    // Sort by creation date (newest first)
    allResources.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setResources(allResources);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = resources;

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(search) ||
        resource.description.toLowerCase().includes(search) ||
        resource.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Apply JVDT key filter
    if (selectedJVDTKey !== 'all') {
      filtered = filtered.filter(resource => 
        resource.jvdtKeys && resource.jvdtKeys.includes(selectedJVDTKey)
      );
    }

    setFilteredResources(filtered);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      flashcards: '🃏',
      workbook: '📖',
      assessment: '📊',
      scenarios: '🎭',
      toolkit: '🧰',
      guide: '📋'
    };
    return icons[type] || '📄';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading resources...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          JVDT Resource Library
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Discover and create educational resources aligned with JVDT methodology. 
          Use our AI-powered generator to create custom materials for your specific needs.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/resources/generate"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium inline-flex items-center"
          >
            <span className="mr-2">✨</span>
            Generate AI Resource
          </Link>
          <button
            onClick={loadResources}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredResources.length} of {resources.length} resources
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resources..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            >
              {resourceTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {/* JVDT Key Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              JVDT Key
            </label>
            <select
              value={selectedJVDTKey}
              onChange={(e) => setSelectedJVDTKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            >
              {jvdtKeys.map(key => (
                <option key={key.id} value={key.id}>{key.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{getTypeIcon(resource.type)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                      {resource.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                        {resource.difficulty}
                      </span>
                      {resource.isStatic && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Curated
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {resource.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="mr-2">🎯</span>
                  Age: {resource.targetAge} | Duration: {resource.estimatedDuration}
                </div>

                {resource.jvdtKeys && resource.jvdtKeys.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {resource.jvdtKeys.map(key => (
                      <span
                        key={key}
                        className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full"
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {resource.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {resource.tags.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{resource.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                <Link
                  to={`/resources/${resource.id}`}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center text-sm font-medium"
                >
                  View Resource
                </Link>
                <button
                  onClick={() => {
                    // TODO: Implement download functionality
                    alert('Download functionality coming soon!');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  title="Download Resource"
                >
                  📥
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No resources found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search criteria or create a new resource with AI.
          </p>
          <Link
            to="/resources/generate"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <span className="mr-2">✨</span>
            Generate AI Resource
          </Link>
        </div>
      )}
    </div>
  );
}