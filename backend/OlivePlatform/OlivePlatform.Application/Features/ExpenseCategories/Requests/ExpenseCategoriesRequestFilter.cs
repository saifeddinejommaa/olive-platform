using OlivePlatform.Application.Common;

namespace OlivePlatform.Application.Features.ExpenseCategories.Requests
{
    public class ExpenseCategoriesRequestFilter : PaginationRequest
    {
        public string? Code { get; set; }

        public string? Name { get; set; }

        public int? ParentId { get; set; }
    }
}
