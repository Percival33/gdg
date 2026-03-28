import { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import ResultsList from './components/ResultsList/ResultsList';
import ComparisonModal from './components/ComparisonModal/ComparisonModal';
import LoadingSpinner from './components/Common/LoadingSpinner';
import ErrorMessage from './components/Common/ErrorMessage';
import { useDishSearch } from './hooks/useDishSearch';
import './index.css';

function App() {
  const { results, isLoading, error, search } = useDishSearch();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedRestaurants = results.filter((r) => selectedIds.includes(r.id));

  return (
    <div className="app-container">
      <header>
        <h1>Crave Finder</h1>
      </header>
      
      <main>
        <SearchBar onSearch={search} isLoading={isLoading} />
        
        {error && <ErrorMessage message={error} />}
        
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ResultsList
            restaurants={results}
            selectedIds={selectedIds}
            onSelect={handleSelect}
          />
        )}
      </main>

      {selectedIds.length > 1 && (
        <div className="fab-container">
          <button className="fab" onClick={() => setIsModalOpen(true)}>
            Compare ({selectedIds.length})
          </button>
        </div>
      )}

      {isModalOpen && (
        <ComparisonModal
          restaurants={selectedRestaurants}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
