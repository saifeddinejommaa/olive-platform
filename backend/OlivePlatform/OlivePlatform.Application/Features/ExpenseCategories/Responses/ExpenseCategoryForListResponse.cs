namespace OlivePlatform.Application.Features.ExpenseCategories.Responses;

public class ExpenseCategoryForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int? ParentId { get; set; }

    public string? ParentName { get; set; }

    public string? Description { get; set; }
}