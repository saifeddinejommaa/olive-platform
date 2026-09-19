using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities
{
    [Table("supplier")]
    public class Supplier
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("reference")]
        public required string Reference { get; set; }

        [Column("phone")]
        public string? Phone { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        [Column("notes")]
        public string? Notes { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; }
    }
}
