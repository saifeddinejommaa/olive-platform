namespace OlivePlatform.Domain.Entities;

public class ExpenseCategory
{
    public int Id { get; set; }
    public string Code { get; private set; } = null!;
    public string Name { get; private set; } = null!;

    public int? ParentId { get; private set; }

    public string? Description { get; private set; }

    public ExpenseCategory? Parent { get; private set; }

    public ICollection<ExpenseCategory> Children { get; private set; }
        = new List<ExpenseCategory>();

    private ExpenseCategory()
    {
    }

    public ExpenseCategory(
        string code,
        string name,
        int? parentId = null)
    {
        Code = code;
        Name = name;
        ParentId = parentId;
    }
}