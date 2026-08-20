using System.ComponentModel.DataAnnotations.Schema;

namespace YourProject.Domain.Entities;

[Table("document_counters")]
public class DocumentCounter
{
    [Column("id")]
    public int Id { get; set; }

    [Column("document_type")]
    public string DocumentType { get; set; } = null!;

    [Column("year")]
    public int Year { get; set; }

    [Column("last_number")]
    public int LastNumber { get; set; }
}