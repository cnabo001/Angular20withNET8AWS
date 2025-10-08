using Contracts.DTOs;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer.Interfaces;

namespace AspNetServerlessV8.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoreItemsController : Controller
    {
        private readonly IStoreService _storeService;
        public StoreItemsController(IStoreService storeService)
        {
            _storeService = storeService;
        }

        /// <summary>
        /// Gets all store items
        /// </summary>
        /// <returns>${StoreItems}</returns>
        [HttpGet]
        public ActionResult<StoreItems> GetAll()
        {
            var result = _storeService.GetAllStoreItems();

            return result;
        }
    }
}
