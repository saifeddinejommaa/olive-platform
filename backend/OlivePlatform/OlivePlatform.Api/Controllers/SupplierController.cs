using MediatR;
using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IMediator _mediator;

        public SupplierController(
            ISupplierRepository supplierRepository,
            IMediator mediator)
        {
            _supplierRepository = supplierRepository;
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _supplierRepository.GetAllAsync());
        }
    }
}
