using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MenuService.Models
{
    public class MenuItem
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string RestaurantId { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Description { get; set; } = "";
        public decimal Price { get; set; }
        public string Category { get; set; } = "Main";
        public string ImageUrl { get; set; } = "";
        public bool IsAvailable { get; set; } = true;
    }
}
