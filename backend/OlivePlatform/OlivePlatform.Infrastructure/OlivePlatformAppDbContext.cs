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
    public DbSet<HarvestStartWeather> HarvestStartWeather => Set<HarvestStartWeather>();

    public DbSet<HarvestCostLine> HarvestCostLine => Set<HarvestCostLine>();

    public DbSet<FinancialPayment> FinancialPayment => Set<FinancialPayment>();

    public DbSet<OlivePurchase> OlivePurchases => Set<OlivePurchase>();

    public DbSet<OliveSample> OliveSamples => Set<OliveSample>();
    public DbSet<OliveAnalysis> OliveAnalysis => Set<OliveAnalysis>();
    public DbSet<OilAnalysis> OilAnalysis => Set<OilAnalysis>();

    public DbSet<OilBatch> OilBatches => Set<OilBatch>();

    public DbSet<PressingOperation> PressingOperations => Set<PressingOperation>();
    public DbSet<PressingOperationInput> PressingOperationInputs => Set<PressingOperationInput>();
    public DbSet<PressingParameters> PressingParameters => Set<PressingParameters>();

    public DbSet<Tank> Tanks => Set<Tank>();
    public DbSet<OilMovement> OilMovements => Set<OilMovement>();

    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<OilSale> OilSales => Set<OilSale>();
    public DbSet<OilSaleLine> OilSaleLines => Set<OilSaleLine>();
    public DbSet<OilSaleLineMovement> OilSaleLineMovements => Set<OilSaleLineMovement>();
    public DbSet<OilSalePayment> OilSalePayments => Set<OilSalePayment>();

    public DbSet<ExpenseCategory> ExpenseCategories => Set<ExpenseCategory>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceItem> InvoiceItems => Set<InvoiceItem>();
    public DbSet<Payment> Payments => Set<Payment>();

    public DbSet<Worker> Workers => Set<Worker>();

    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<DocumentCounter> DocumentCounters { get; set; }

    public DbSet<Season> Seasons => Set<Season>();

    public DbSet<OliveLot> OliveLots => Set<OliveLot>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<PressingOperation>()
        .HasIndex(x => x.OperationNumber)
        .IsUnique();

        // Clé = la récolte : une seule météo de lancement par récolte.
        modelBuilder.Entity<HarvestStartWeather>(entity =>
        {
            entity.HasKey(x => x.HarvestId);
            entity.Property(x => x.HarvestId).ValueGeneratedNever();
        });

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

        // Lien ligne de vente -> mouvement : clé composée.
        modelBuilder.Entity<OilSaleLineMovement>()
            .HasKey(x => new { x.OilSaleLineId, x.OilMovementId });

        modelBuilder.Entity<OilSale>()
            .HasMany(x => x.Lines)
            .WithOne()
            .HasForeignKey(x => x.OilSaleId);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(OlivePlatformAppDbContext).Assembly);
    }
}