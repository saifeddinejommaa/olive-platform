using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Domain.Entities
{
    public class OliveVariety
    {
        public int Id { get; set; }
        public string Name { get; private set; } = null!;
        public string? Description { get; private set; }

        public ICollection<PlotVariety> Plots { get; private set; }
            = new List<PlotVariety>();

        public ICollection<OlivePurchaseItem> PurchaseItems { get; private set; }
            = new List<OlivePurchaseItem>();

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
