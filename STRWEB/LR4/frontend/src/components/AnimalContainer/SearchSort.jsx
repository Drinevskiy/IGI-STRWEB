
const SearchSort = ({
    searchTerm,
    setSearchTerm,
    sortProperty,
    setSortProperty,
    sortDirection,
    setSortDirection
}) => {
    return (
        <div id="animal-container-elements">
            <input 
                type="text" 
                placeholder="Поиск по имени..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <select 
                value={sortProperty} 
                onChange={(e) => setSortProperty(e.target.value)}
            >
                <option value="name">Имя</option>
                <option value="type">Вид</option>
                <option value="family">Семейство</option>
                <option value="date_of_birth">Возраст</option>
                <option value="aviary">Вольер</option>
            </select>
            <div className='sorting-input'>
                <input 
                    id="sorting"
                    type="checkbox" 
                    checked={sortDirection === 'desc'} 
                    onChange={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')} 
                />
                <label htmlFor="sorting">
                    Сортировать по убыванию
                </label>
            </div>
        </div>
    );
};

export { SearchSort };