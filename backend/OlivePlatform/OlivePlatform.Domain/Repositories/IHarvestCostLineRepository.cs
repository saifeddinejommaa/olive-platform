using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Domain.Repositories
{
    public interface IHarvestCostLineRepository : IRepository<HarvestCostLine>
    {
        Task<IEnumerable<HarvestCostLine>> GetCostLinesForPaymentAsync(int[] sourceIds, 
                CostLineType sourceType, 
                CancellationToken cancellationToken);
    }
}
