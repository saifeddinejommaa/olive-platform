namespace OlivePlatform.Domain.Entities
{
    public class OliveVariety
    {
        public int Id { get; set; }
        public string? Label { get; private set; }

        public bool IsActive { get; set; }
    }
}
