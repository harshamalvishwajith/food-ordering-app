using MenuService.Models;
using MongoDB.Driver;

namespace MenuService.Services
{
    public class MenuService
    {
        private readonly IMongoCollection<MenuItem> _menuCollection;

        public MenuService(IConfiguration configuration)
        {
            var settings = configuration.GetSection("DatabaseSettings").Get<DatabaseSettings>();
            if (settings == null || string.IsNullOrEmpty(settings.ConnectionString) || string.IsNullOrEmpty(settings.DatabaseName) || string.IsNullOrEmpty(settings.MenuCollectionName))
            {
                throw new ArgumentNullException(nameof(settings), "Database settings are not properly configured.");
            }

            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _menuCollection = database.GetCollection<MenuItem>(settings.MenuCollectionName);
        }

        public async Task<List<MenuItem>> GetAllAsync() => await _menuCollection.Find(_ => true).ToListAsync();
        public async Task<MenuItem?> GetAsync(string id) => await _menuCollection.Find(m => m.Id == id).FirstOrDefaultAsync();
        public async Task CreateAsync(MenuItem item) => await _menuCollection.InsertOneAsync(item);
        public async Task UpdateAsync(string id, MenuItem item) => await _menuCollection.ReplaceOneAsync(m => m.Id == id, item);
        public async Task DeleteAsync(string id) => await _menuCollection.DeleteOneAsync(m => m.Id == id);
    }
}
