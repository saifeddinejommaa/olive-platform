namespace OlivePlatform.Domain.Entities
{
    public class Plot
    {
        public int Id { get; set; }
        public string Code { get;  set; } = null!;
        public string? Name { get;  set; }

        public decimal AreaHectares { get;  set; }
        public int NumberOfTrees { get;  set; }

        public int? PlantingYear { get;  set; }

        public string? Location { get;  set; }
        public string? Notes { get;  set; }

        public bool IsActive { get;  set; }

        public ICollection<PlotVariety> Varieties { get;  set; }
            = new List<PlotVariety>();

        public ICollection<Harvest> Harvests { get;  set; }
            = new List<Harvest>();

        public ICollection<WorkSession> WorkSessions { get;  set; }
            = new List<WorkSession>();
    }
}
