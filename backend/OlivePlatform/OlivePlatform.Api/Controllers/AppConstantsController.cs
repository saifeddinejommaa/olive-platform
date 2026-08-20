using Microsoft.AspNetCore.Mvc;
using OlivePlatform.Application.Features.AppConstants.Repositories;

[ApiController]
[Route("api/appconstants")]
public class AppConstantsController : ControllerBase
{
    private readonly IAppConstantsQueryRepository _repository;

    public AppConstantsController(
        IAppConstantsQueryRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        CancellationToken cancellationToken)
    {
        var result =
            await _repository.GetAppConstants(cancellationToken);

        return Ok(result);
    }
}