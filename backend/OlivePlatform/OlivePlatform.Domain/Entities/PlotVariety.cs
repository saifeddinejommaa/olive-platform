using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Domain.Entities
{
    public class PlotVariety 
    {
        public int Id { get; set; }
        public int PlotId { get; private set; }
        public int VarietyId { get; private set; }

        public int? NumberOfTrees { get; private set; }
        public decimal? Percentage { get; private set; }

        public string? Notes { get; private set; }

        public Plot Plot { get; private set; } = null!;
        public OliveVariety Variety { get; private set; } = null!;

        private PlotVariety()
        {
        }

        public PlotVariety(
            int plotId,
            int varietyId,
            int? numberOfTrees = null,
            decimal? percentage = null)
        {
            PlotId = plotId;
            VarietyId = varietyId;
            NumberOfTrees = numberOfTrees;
            Percentage = percentage;
        }
    }
}
