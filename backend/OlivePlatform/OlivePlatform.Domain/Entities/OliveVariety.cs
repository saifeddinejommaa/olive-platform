namespace OlivePlatform.Domain.Entities
{
    public class OliveVariety
    {
        public int Id { get; set; }
        public string Name { get; private set; } = null!;
        public string? Description { get; private set; }

        private OliveVariety()
        {
        }

        public OliveVariety(string name, string? description = null)
        {
            Name = name;
            Description = description;
        }
    }
}
