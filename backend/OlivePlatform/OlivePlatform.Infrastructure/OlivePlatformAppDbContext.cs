using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;
using YourProject.Domain.Entities;

namespace OlivePlatform.Infrastructure;

public class OlivePlatformAppDbContext : DbContext
{
    public OlivePlatformAppDbContext(
        DbContextOptions<OlivePlatformAppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Plot> Plots => Set<Plot>();
    public DbSet<OliveVariety> OliveVarieties => Set<OliveVariety>();
    public DbSet<PlotVariety> PlotVarieties => Set<PlotVariety>();
    public DbSet<Harvest> Harvests => Set<Harvest>();
    public DbSet<HarvestStock> HarvestStocks => Set<HarvestStock>();

    public DbSet<OlivePurchase> OlivePurchases => Set<OlivePurchase>();
    public DbSet<OlivePurchaseItem> OlivePurchaseItems => Set<OlivePurchaseItem>();

    public DbSet<OliveSample> OliveSamples => Set<OliveSample>();
    public DbSet<LabAnalysis> LabAnalyses => Set<LabAnalysis>();
    public DbSet<LabAnalysisResult> LabAnalysisResults => Set<LabAnalysisResult>();

    public DbSet<OilBatch> OilBatches => Set<OilBatch>();

    public DbSet<PressingOperation> PressingOperations => Set<PressingOperation>();
    public DbSet<PressingOperationInput> PressingOperationInputs => Set<PressingOperationInput>();

    public DbSet<Tank> Tanks => Set<Tank>();
    public DbSet<OilMovement> OilMovements => Set<OilMovement>();

    public DbSet<ExpenseCategory> ExpenseCategories => Set<ExpenseCategory>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceItem> InvoiceItems => Set<InvoiceItem>();
    public DbSet<Payment> Payments => Set<Payment>();

    public DbSet<Worker> Workers => Set<Worker>();
    public DbSet<WorkSession> WorkSessions => Set<WorkSession>();
    public DbSet<DocumentCounter> DocumentCounters { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<PressingOperation>()
        .HasIndex(x => x.OperationNumber)
        .IsUnique();

        modelBuilder.Entity<DocumentCounter>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.DocumentType)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(x => x.Year)
                .IsRequired();

            entity.Property(x => x.LastNumber)
                .IsRequired();

            entity.HasIndex(x => new
            {
                x.DocumentType,
                x.Year
            })
            .IsUnique();
        });

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(OlivePlatformAppDbContext).Assembly);
    }
}