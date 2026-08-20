using Microsoft.EntityFrameworkCore;
using OlivePlatform.Domain.Entities;

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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(OlivePlatformAppDbContext).Assembly);
    }
}