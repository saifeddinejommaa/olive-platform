using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using YourProject.Application.Services;
using YourProject.Domain.Entities;

namespace OlivePlatform.Infrastructure.Services
{
    public class DocumentNumberService : IDocumentNumberService
    {
        private readonly OlivePlatformAppDbContext _context;

        public DocumentNumberService(OlivePlatformAppDbContext context)
        {
            _context = context;
        }

        public async Task<string> GenerateAsync(
            string documentType,
            string prefix,
            int year,
            CancellationToken cancellationToken = default)
        {
            var counter = await _context.DocumentCounters
                .SingleOrDefaultAsync(
                    x =>
                        x.DocumentType == documentType &&
                        x.Year == year,
                    cancellationToken);

            if (counter == null)
            {
                counter = new DocumentCounter
                {
                    DocumentType = documentType,
                    Year = year,
                    LastNumber = 1,
                };

                _context.DocumentCounters.Add(counter);
            }
            else
            {
                counter.LastNumber++;
            }

            return $"{prefix}-{year}-{counter.LastNumber:D3}";
        }
    }
}
